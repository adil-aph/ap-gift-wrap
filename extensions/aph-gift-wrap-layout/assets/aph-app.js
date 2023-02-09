console.log("WELCOM TO THEME EXTENSIOn");

const xmlhttp = new XMLHttpRequest();

const { fetch: originalFetch } = window;

var cartObj = [];
var tempRes;
var prod_id;
var prod_title;

var giftHTML = document.getElementById("giftWrapHead"); 
if (giftHTML != null) {
    if (giftHTML.innerHTML.length) {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.onload = function () {
            let resData = JSON.parse(this.responseText);
            document.getElementById("gift_product_price").innerHTML = resData.product_price;
            prod_id = resData.product_id;
            prod_title = resData.product_title;
        };

        xmlhttp.open(
            "GET",
            "https://shopify-app.wearelegion.xyz/api/gift/layout?shop=" +
                Shopify.shop
        );
        xmlhttp.send();

        /**
         * Capture User's Clicks on Element
         * Send to Server through API
         * Save to Database
         */
        let aph_gift_check_elem = document.getElementById("giftWrapOption"); 
        aph_gift_check_elem.onclick = function(e){
            alert('click');
            var tmp_data = new FormData();
            tmp_data.append('gift_id', prod_id);

            aph_general_xmlhttp(xmlhttp, "post", "https://163c-86-98-222-8.eu.ngrok.io/api/gift/clicks/", tmp_data);
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
                        properties: { Product: title_p },
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
                args[1].body.append("items[0][properties][Product]", title_p);
            }
            console.log("fdata ", args[1].body);
            setTimeout(() => {
                var tmp_data = new FormData();
                tmp_data.append('gift_id', prod_id);
                tmp_data.append('product_id', pro_id);
                aph_general_xmlhttp(xmlhttp, "post", "https://163c-86-98-222-8.eu.ngrok.io/api/gift/addcart/", tmp_data);
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
            if (item.properties != null && "Product" in item.properties) {
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