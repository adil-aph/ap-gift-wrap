const { fetch: originalFetchBolck } = window;

var cartObj = [];
var tempRes;
var prod_id;
var prod_title;
var prod_slug;
var product_price = '';
var product_image = ''; 
const baseURLblock = 'https://giftify-pro-gift-app.digitalagebusiness.com';

/**
 * Send HTTP request to get Gift Product data 
 * Used to hide Gift Product from store front
 */
const xmlhttpblock = new XMLHttpRequest();

if (window.location.href.indexOf('cart') === -1) {

    xmlhttpblock.onload = function () {
        let resData = JSON.parse(this.responseText);
        
        prod_id = resData.product_id;
        prod_title = resData.product_title;
        prod_slug = resData.product_slug;
        product_price = resData.product_price;
        product_image = resData.product_image; 
        removeGiftProductFront(prod_slug);
    };
    
    xmlhttpblock.open(
        "GET",
        baseURLblock + "/api/gift/layout?shop=" +
            Shopify.shop
    );
    xmlhttpblock.send();

    setTimeout(() => {
        removeGiftProductFront(prod_slug);
    }, 3000);
}


/**
 * Intercept Windows default Fetch request
 * Alter Request and Response objects
 */

window.fetch = async (...args) => {

    let [resource, config] = args;

    const response = await originalFetchBolck(resource, config);
    console.log(" new res ", resource);
    if (resource == "/cart/change") {
        console.log(" new res 2st ", response);
        tempRes = response;
    }
    // response interceptor here
    if (resource == "/cart/change" && resource != "/cart/change.js") {
        let testResp = response;

        // response interceptor
        console.log('Resp Intercept ', response);
        const responseClone = response.clone();
        responseClone.json().then((data) => {
            if (data.item_count) {
                deleteGift(data.items);
            }
        });

        return tempRes;
    } else {
        return response;
    }
};


function deleteGift(crtO) {
    nfIndx = -1;
    if (crtO.length) {
        console.log("crto ", crtO);
        crtO.forEach((item, ind, arr) => {
            if (item.properties != null && "Product Name" in item.properties) {
                for (let i = ind; i < arr.length; i++) {
                    if (arr[i].product_title === item.properties.Product) {
                        nfIndx = -1;
                        break;
                    } else {
                        nfIndx = ind;
                    }
                }
            }
        });

        if (nfIndx >= 0) {
            console.log("nfindx ", nfIndx);
            let giftData = {
                line: nfIndx + 1,
                quantity: crtO[nfIndx].quantity - 1,
                sections: [
                    "template--15018629529693__cart-items",
                    "cart-icon-bubble",
                    "cart-live-region-text",
                    "template--15018629529693__cart-footer",
                ],
                sections_url: "/cart",
            };

            fetch(window.Shopify.routes.root + "cart/change.js", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    IsGift: true,
                },
                body: JSON.stringify(giftData),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("my data  ", data);
                    cart_form = document.querySelectorAll(
                        "form[action='/cart']"
                    );
                    var resp_element = document.createElement("p");
                    resp_element.setAttribute("class", "gift-response");
                    resp_element.innerHTML =
                        "Gift Product is removed, please refresh the page";

                    if (cart_form.length) {
                        cart_form[cart_form.length - 1].parentNode.insertBefore(
                            resp_element,
                            cart_form[cart_form.length - 1]
                        );
                    }
                })
                .catch((error) => console.log(error));
        }
    }
}

/**
 * Remove APH Gift Product from store Fornt
 */
function removeGiftProductFront(slug) {
    const links = document.querySelectorAll('a[href*="' + slug + '"]');

    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        let parent = link.parentNode;
        while (parent && parent.nodeName !== 'LI') {
           // parent.parentNode.removeChild(parent);
            parent = parent.parentNode;
        }
        if(parent == null || parent == 'null'){
            parent = link.parentNode;
        }
        
        parent.remove();
        //parent.removeChild(link);
    }
}