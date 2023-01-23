
console.log('Thanks for reading WeeklyHow\'s Tutorials!');
alert('WORLING');

var para1 = document.createElement("p");
var node = document.createTextNode("This is new.");
para1.appendChild(node);

 var elem = document.getElementsByClassName('product-form__quantity'); 

 elem[0].parentNode.insertBefore( para1, elem[0] );

