console.log("WELCOM TO THEME EXTENSION");

const xmlhttp = new XMLHttpRequest();

const { fetch: originalFetch } = window;

var cartObj = [];
var tempRes;
var prod_id;
var prod_title;
var prod_slug;
var product_price = '';
var product_image;
const baseURL = 'https://bde2-94-205-107-178.in.ngrok.io';

/**
 * Send HTTP request to get Gift Product data 
 */



if (window.location.href.indexOf('cart') === -1) {
    console.log('This is a cart page');
    xmlhttp.onload = function () {
        let resData = JSON.parse(this.responseText);
        
        prod_id = resData.product_id;
        prod_title = resData.product_title;
        prod_slug = resData.product_slug;
        product_price = resData.product_price;
        product_image = resData.product_image; 
        document.getElementById("gift_product_price").innerHTML = product_price;
        if(resData.app_status == 'deactive')
            document.getElementById("aph_gift_wrap_app").remove();
        removeGiftProductFront(prod_slug);
    };
    
    xmlhttp.open(
        "GET",
        baseURL + "/api/gift/layout?shop=" +
            Shopify.shop
    );
    xmlhttp.send();

    setTimeout(() => {
        removeGiftProductFront(prod_slug);
    }, 3000);
}

var giftHTML = document.getElementById("giftWrapHead"); 
if (giftHTML != null) {
    if (giftHTML.innerHTML.length) {

        document.getElementById("gift_product_price").innerHTML = product_price;
        document.getElementById("gift_image").src = product_image;

        /**
         * Capture User's Clicks on Element
         * Send to Server through API
         * Save to Database
         */
        let aph_gift_check_elem = document.getElementById("giftWrapOption"); 
        let aph_gift_textarea = document.getElementById("giftWrapText"); 
        
        aph_gift_check_elem.onchange = function(e){
            //alert('click');
            if(aph_gift_check_elem != null && aph_gift_check_elem.checked == true) {
                console.log('onchange ', e);
                aph_gift_textarea.style.display = 'block';
            } else {
                aph_gift_textarea.style.display = 'none';
            }
            
            var tmp_data = new FormData();
            tmp_data.append('gift_id', prod_id);

            aph_general_xmlhttp(xmlhttp, "post", baseURL + "/api/gift/clicks/", tmp_data);
          }
          

    }
}


var testResp2;
var testset = 0;

window.fetch = async (...args) => {

    let [resource, config] = args;

    // Check GiftBox is selected

    let giftBoxOption = document.getElementById("giftWrapOption");

    if (giftBoxOption != null && giftBoxOption.checked == true) {
        console.log("CHECKED TRUE");
        let title_p = document.getElementsByTagName("h1")[0].innerHTML;
        let gifttext = document.getElementById("gifttext").value;

        // request interceptor here
        console.log("res  ", resource);
        console.log("args ", args);
        if (resource == "/cart/add") {
            if (
                typeof args[1].body == "string" ||
                args[1].body instanceof String
            ) {
                let jsonbody = JSON.parse(args[1].body);
                
                let temparr = [
                    {
                        quantity: 1,
                        id: prod_id,
                        properties: { 'Product Name': title_p, 'Your Custom Note': gifttext },
                    },
                ];
                console.log("JSON 1", jsonbody);
                jsonbody["items"] = temparr;
                //jsonbody.items[0].id = prod_id;
                //jsonbody.items[0].properties.Product =  title_p;
                console.log("JSON 2", JSON.stringify(jsonbody));
                args[1].body = JSON.stringify(jsonbody);
            } else {
                args[1].body.append("items[0][quantity]", 1);
                args[1].body.append("items[0][id]", prod_id);
                args[1].body.append("items[0][properties][Product Name]", title_p);
                if(gifttext.length){
                    args[1].body.append("items[0][properties][Your Custom Note]", gifttext);
                }
                if (giftInvoice != null && giftInvoice.checked == true) {
                    args[1].body.append("items[0][properties][Gift Receipt]", giftInvoice.value);
                }

            }
            console.log("fdata ", args[1].body);
            setTimeout(() => {
                var tmp_data = new FormData();
                tmp_data.append('gift_id', prod_id);
                tmp_data.append('product_id', pro_id);
                aph_general_xmlhttp(xmlhttp, "post", baseURL + "/api/gift/addcart/", tmp_data);
            }, 2000);
        }
    }

    console.log("TURE 2");
    const response = await originalFetch(resource, config);

    console.log(" new res 1st ", response);
    if (resource == "/cart/change") {
        console.log(" new res 2st ", response);
        tempRes = response;
    }
    // response interceptor here
    if (resource == "/cart/change" && resource != "/cart/change.js") {
        console.log("count ", ++testset);
        let testResp = response;

        console.log(" new respppp 1 ", testResp);
        console.log(" header ", args[1].headers.IsGift);
        // response interceptor
        const responseClone = response.clone();
        responseClone.json().then((data) => {
            if (data.item_count) {
                deleteGift(data.items);
            }
        });

        return tempRes;
        //return tempRes;

        /*setTimeout(() => {
			return tempRes;
		}, 5000);*/
        /*const json = () =>
			response
			.clone()
			.json()
			.then((data) => {
				console.log('new data 111', data);
				if(data.item_count) {
					deleteGift(data.items);
					return data;
				}
				return data;
			});	 
*/
        // json().then((resp) => {
        // 	console.log('new data 111333', resp);
        // 	return resp;
        // });
        // testResp.json().then(data => {
        // 	console.log('new data ', data);
        // 	console.log('new responses  ', response);
        // 	if(data.item_count) {
        // 		deleteGift(data.items).then(res => {
        // 			console.log('ttt ', res);
        // 			return res;
        // 		});
        // 	}
        // 	return response;
        // });
        //response.json = json;
    } else {
        console.log("else res ", response);
        return response;
    }
};

window.addEventListener("xhr", function (event) {
    alert("xhr");
});

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
                // if (arr.some(e => e.product_title === item.properties.Product)) {
                // 	/* vendors contains the element we're looking for */
                // 	console.log('pro title ', e.product_title);
                // 	console.log('item ititle ', item.properties.Product);
                // } else {
                // 	console.log('NOt found');
                // }

                /*const found = arr.find((elem, idx) => {
					console.log('pro title ', elem.title);
					console.log('item ititle ', item.properties.Product);

					if(ind != idx)
					{
						if(elem.title == item.properties.Product )
						{
							console.log('pro title ', elem.title);
							console.log('Product found');
							console.log('item ititle ', item.properties.Product);
							break;
						} else {
							console.log('Product NOT found');
							let giftData = {
								'line': (ind+1),
								'quantity': (item.quantity - 1),
								'sections': ['template--15018629529693__cart-items', 'cart-icon-bubble', 'cart-live-region-text', 'template--15018629529693__cart-footer'],
								'sections_url': '/cart'
							};
								const respGift = fetch(window.Shopify.routes.root + 'cart/change.js', {
									method: 'POST',
									headers: {
									'Content-Type': 'application/json'
									},
									body: JSON.stringify(giftData)	
								})
							return respGift;
						}
					}
				});*/
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
 * Send XML HTTP request to Server
 */
function aph_general_xmlhttp(xmlhttpReq, reqMethod, url, data) {
    xmlhttpReq.onload = function () {
        console.log(JSON.parse(this.responseText));
    };

    xmlhttpReq.open(
        reqMethod,
        url + "?shop=" +
            Shopify.shop
    );
    xmlhttpReq.send(data);
}

/**
 * Remove APH Gift Product from store Fornt
 */
function removeGiftProductFront(slug) {
    console.log('slug ', slug);
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