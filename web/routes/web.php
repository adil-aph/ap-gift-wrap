<?php

use App\Exceptions\ShopifyProductCreatorException;
use App\Lib\AuthRedirection;
use App\Lib\EnsureBilling;
use App\Lib\ProductCreator;
use App\Models\Session;
use \App\Models\GiftProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Shopify\Auth\OAuth;
use Shopify\Auth\Session as AuthSession;
use Shopify\Clients\HttpHeaders;
use Shopify\Clients\Rest;
use Shopify\Context;
use Shopify\Exception\InvalidWebhookException;
use Shopify\Utils;
use Shopify\Webhooks\Registry;
use Shopify\Webhooks\Topics;
use Illuminate\Support\Str;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::fallback(function (Request $request) {
    if (Context::$IS_EMBEDDED_APP &&  $request->query("embedded", false) === "1") {
        if (env('APP_ENV') === 'production') {
            return file_get_contents(public_path('index.html'));
        } else {
            return file_get_contents(base_path('frontend/index.html'));
        }
    } else {
        return redirect(Utils::getEmbeddedAppUrl($request->query("host", null)) . "/" . $request->path());
    }
})->middleware('shopify.installed');

Route::get('/api/auth', function (Request $request) {
    $shop = Utils::sanitizeShopDomain($request->query('shop'));

    // Delete any previously created OAuth sessions that were not completed (don't have an access token)
    Session::where('shop', $shop)->where('access_token', null)->delete();

    return AuthRedirection::redirect($request);
});

Route::get('/api/auth/callback', function (Request $request) {
    $session = OAuth::callback(
        $request->cookie(),
        $request->query(),
        ['App\Lib\CookieHandler', 'saveShopifyCookie'],
    );

    $host = $request->query('host');
    $shop = Utils::sanitizeShopDomain($request->query('shop'));

    $response = Registry::register('/api/webhooks', Topics::APP_UNINSTALLED, $shop, $session->getAccessToken());
    if ($response->isSuccess()) {
        Log::debug("Registered APP_UNINSTALLED webhook for shop $shop");
    } else {
        Log::error(
            "Failed to register APP_UNINSTALLED webhook for shop $shop with response body: " .
                print_r($response->getBody(), true)
        );
    }

    $redirectUrl = Utils::getEmbeddedAppUrl($host);
    if (Config::get('shopify.billing.required')) {
        list($hasPayment, $confirmationUrl) = EnsureBilling::check($session, Config::get('shopify.billing'));

        if (!$hasPayment) {
            $redirectUrl = $confirmationUrl;
        }
    }

    return redirect($redirectUrl);
});

Route::get('/api/products/count', function (Request $request) {
    /** @var AuthSession */
    $session = $request->get('shopifySession'); // Provided by the shopify.auth middleware, guaranteed to be active

    $client = new Rest($session->getShop(), $session->getAccessToken());
    $result = $client->get('products/count');

    return response($result->getDecodedBody());
})->middleware('shopify.auth');

Route::get('/api/products/create', function (Request $request) {
    /** @var AuthSession */
    $session = $request->get('shopifySession'); // Provided by the shopify.auth middleware, guaranteed to be active

    $success = $code = $error = null;
    try {
        ProductCreator::call($session, 5);
        $success = true;
        $code = 200;
        $error = null;
    } catch (\Exception $e) {
        $success = false;

        if ($e instanceof ShopifyProductCreatorException) {
            $code = $e->response->getStatusCode();
            $error = $e->response->getDecodedBody();
            if (array_key_exists("errors", $error)) {
                $error = $error["errors"];
            }
        } else {
            $code = 500;
            $error = $e->getMessage();
        }

        Log::error("Failed to create products: $error");
    } finally {
        return response()->json(["success" => $success, "error" => $error], $code);
    }
})->middleware('shopify.auth');

Route::post('/api/gift/create', function (Request $request) {
    /** @var AuthSession */
    $session = $request->get('shopifySession'); // Provided by the shopify.auth middleware, guaranteed to be active
    $proO = new ProductCreator();
    $proResp = '';
    $success = $code = $error = null;
    try {
        
        $proResp = $proO->createGiftProduct($session, $request->prodTitle, $request->prodPrice, $request->prodDescription, '');
        $success = true;
        $code = 200;
        $error = null;
        
        $proResp = json_decode($proResp);
        $pid = $proResp->data->productCreate->product->id;
        $variant_id = $proResp->data->productCreate->product->variants->edges[0]->node->legacyResourceId;

        store_product($pid, $request->prodTitle, $request->prodPrice, $request->prodDescription, $request->prodImgLink, $variant_id, $session->getShop());
        
    } catch (\Exception $e) {
        $success = false;
        

        if ($e instanceof ShopifyProductCreatorException) {
            $code = $e->response->getStatusCode();
            $error = $e->response->getDecodedBody();
            if (array_key_exists("errors", $error)) {
                $error = $error["errors"];
            }
        } else {
            $code = 500;
            $error = $e->getMessage();
        }

       // Log::error("Failed to create products: $error");
    } finally {
        return response()->json(["gid" => $pid, "success" => $success, "error" => $error, "data" => $proResp], $code);
    }
})->middleware('shopify.auth');

Route::post('/api/gift/update', function (Request $request) {
    /** @var AuthSession */
    $session = $request->get('shopifySession'); // Provided by the shopify.auth middleware, guaranteed to be active
    $proO = new ProductCreator();
    $proResp = '';
    $success = $code = $error = null;

    $prodData = get_product($session->getShop());

    try {
        if($prodData) {

            $proResp = $proO->updateGiftProduct($session, $prodData->product_gid, $request->prodTitle, $request->prodPrice, $request->prodDescription, '');
            $success = true;
            $code = 200;
            $error = null;

            $proResp = json_decode($proResp);
            $pid = $proResp->data->productUpdate->product->id;
            $variant_id = $proResp->data->productUpdate->product->variants->edges[0]->node->legacyResourceId;

            store_product($pid, $request->prodTitle, $request->prodPrice, $request->prodDescription, '', $variant_id, $session->getShop());
            
        } else {
            $success = false;
            $error = 'Product not found!';
        }
        
        
    } catch (\Exception $e) {
        $success = false;
        

        if ($e instanceof ShopifyProductCreatorException) {
            $code = $e->response->getStatusCode();
            $error = $e->response->getDecodedBody();
            if (array_key_exists("errors", $error)) {
                $error = $error["errors"];
            }
        } else {
            $code = 500;
            $error = $e->getMessage();
        }

       // Log::error("Failed to create products: $error");
    } finally {
        return response()->json(["gid" => $pid, "success" => $success, "error" => $error, "data" => $proResp], $code);
    }
})->middleware('shopify.auth');

Route::get('/api/gift', function (Request $request) {
    
    $session = $request->get('shopifySession'); // Provided by the shopify.auth middleware, guaranteed to be active

    $dbSession = GiftProduct::where ('shop', '=', $session->getShop())->first();

    if ($dbSession->exists) {
        $proO = new ProductCreator();
        $proResp = $proO->getGiftProduct($session, $dbSession->product_gid);
        $product_info = json_decode($proResp);
    }
    return response()->json(['success' => true, 'data' => $product_info->data->product]);
    
})->middleware('shopify.auth');

Route::get('/api/gift/test', function (Request $request) {
    /** @var AuthSession */
   
    $session = $request->get('shopifySession'); // Provided by the shopify.auth middleware, guaranteed to be active
    
    store_product();

    return response()->json('this is test respinse');
    
})->middleware('shopify.auth');

Route::post('/api/gift/image', function (Request $request) {

    $image = $request->file('prodImage');
    $imageName = $image->getClientOriginalName();
    $image->move(public_path('images'),$imageName);

    $success = true;
    $code = 200;

    $uid =  Str::uuid()->toString();

    $teslink = asset('images/' . $imageName);
    
    return response()->json(["success" => $success, "uid" => $uid, "imgname" => $imageName, "imglink" => $teslink], $code);
    
});


Route::post('/api/webhooks', function (Request $request) {
    try {
        $topic = $request->header(HttpHeaders::X_SHOPIFY_TOPIC, '');

        $response = Registry::process($request->header(), $request->getContent());
        if (!$response->isSuccess()) {
            Log::error("Failed to process '$topic' webhook: {$response->getErrorMessage()}");
            return response()->json(['message' => "Failed to process '$topic' webhook"], 500);
        }
    } catch (InvalidWebhookException $e) {
        Log::error("Got invalid webhook request for topic '$topic': {$e->getMessage()}");
        return response()->json(['message' => "Got invalid webhook request for topic '$topic'"], 401);
    } catch (\Exception $e) {
        Log::error("Got an exception when handling '$topic' webhook: {$e->getMessage()}");
        return response()->json(['message' => "Got an exception when handling '$topic' webhook"], 500);
    }
});


Route::get('/api/gift/settag', function (Request $request) {
    
    /** @var AuthSession */
   
    $session = $request->get('shopifySession'); // Provided by the shopify.auth middleware, guaranteed to be active
    
    $proOd = new ProductCreator();
    $proResp = $proOd->setScriptTag($session);
    $product_info = json_decode($proResp);

    return response()->json(['success' => true, 'data' => $product_info]);
    
})->middleware('shopify.auth');

Route::get('/api/gift/layout', function (Request $request) {

    $prodData = get_product($request->shop);

    $success = true;
    $code = 200;
    $dataStr = '';
    $prodID = 0;
    $prodTitle = '';

    if ($prodData) {
        $prodID = $prodData->variant_id;
        $prodTitle = $prodData->product_title;
        $dataStr = '
            <div class="only_us" style="margin-bottom: 20px;">
            <p class="gift_head_top">
            <label for="giftWrapOption" id="giftWrapHead">
                <b>Gift Wrap My Item For $' . $prodData->product_price . '</b>
            </label>
            <input type="checkbox" id="giftWrapOption" class="coupon_question" name="coupon_question" value="1" style=" margin-left: 10px; " />

            <span class="info_msg info_msg_hidden">
                Please check the box to add Gift Wrap with your product.
            </span>
            </p>
            <!-- <p style="margin-top: -27px;">
            <small>
            <i>( We\'ll add a complimentary custom note card too. )</i>
            </small>
            </p> -->
        </div>';
    }
    
    return response()->json(["success" => $success, "gift_layout" => $dataStr, 'product_id' => $prodID, 'product_title' => $prodTitle ], $code);
    
});

function store_product($pgid, $ptitle, $pprice, $pdesc, $pimg, $vid, $shop_name) {

   // $dbSession = GiftProduct::find(1);
   $dbSession = GiftProduct::where ('shop', '=', $shop_name)->first();
    if (!$dbSession) {
        $dbSession = new GiftProduct();
    }

    $dbSession->product_gid = $pgid;
    $dbSession->product_title = $ptitle;
    $dbSession->product_price = $pprice;
    $dbSession->product_description = $pdesc;
    $dbSession->Product_image = $pimg;
    $dbSession->variant_id = $vid;
    $dbSession->shop = $shop_name;

    try {
        return $dbSession->save();
    } catch (Exception $err) {
        echo 'errr';
        print_r( $err->getMessage() );
        Log::error("Failed to save session to database: " . $err->getMessage());
        return false;
    }
}

function get_product($shop_name) {
    
    $dbSession = GiftProduct::where ('shop', '=', $shop_name)->first();

    if ($dbSession->exists) {
        return $dbSession;
    }

    return false;
}