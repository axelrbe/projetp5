const urlSearch = document.location.search;
const urlSearchParams = new URLSearchParams(urlSearch);
const productId = urlSearchParams.get('orderid');

const orderId = document.getElementById('orderId');
orderId.innerHTML = productId;

localStorage.removeItem('axelRibeiroP5');