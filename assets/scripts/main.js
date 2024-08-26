var myCart;
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
	return v.toString(16);
  });
}


class Cart {
  static _amount = document.querySelector(`#amount-article`)
  static _empty = document.querySelector(`#empty-cart`)
  static _selected = document.querySelector(`#articles-selected`)
  static _orderSelected = document.querySelector(`#articles-selected-ordered`)
  static _totalPrice = document.querySelector(`#cart-order-total-price`)
  static _totalPriceOrdered = document.querySelector(`#cart-ordered-total-price`)
  static _totalPurchase = document.querySelector(`#total-purchase`)
  static render() {

	let articles = [];
	let total = 0;
	let sum = myCart.reduce((a, c) => {
	  
	  total += c.info.price * c.amount
	  let article = `
	  <article class="article" data-article="${c.id}">
		  <div class="article-wrapper">
			<div class="article-name">${c.info.name}</div>
			<div class="article-info">
			  <div class="article-amount">
				${c.amount}X
			  </div>
			  <div class="article-unit-price">
				@ \$${c.info.price.toFixed(2)}                    
			  </div>
			  <div class="article-sum">
				\$${(c.info.price * c.amount).toFixed(2)}
			  </div>
			</div>
		  </div>
		  <a class="article-close" onclick="myCart[${c.id}].remove(this)">
			<img src="./assets/images/icon-remove-item.svg" alt="">
		  </a>
		</article>

		<div class="article-separator"></div>
		`
		if(c.amount > 0) articles.push(article);
	  return a + c.amount
	}, 0)

	if(sum == 0) {
	  this._empty.style.display = "flex"
	  this._totalPurchase.style.display = "none"
	}
	else {
	  this._empty.style.display = "none"
	  this._totalPurchase.style.display = "block"
	}
	this._amount.innerText = sum
	this._selected.innerHTML = articles.join(' ');
	this._orderSelected.innerHTML = articles.join(' ');
	this._totalPrice.innerText = '$'+total.toFixed(2);
	this._totalPriceOrdered.innerText = '$'+total.toFixed(2);
  }

  static reset(sel) {
	myCart.forEach( itm => itm.remove())
	Cart.render()
	window.document.querySelectorAll('.cart-manager').forEach(itm => itm.style.display = 'none')
	window.document.querySelectorAll('.add-to-cart').forEach( itm => itm.style.display = 'flex')
	window.document.querySelector(`#screen-modal`).style.display = "none"
	window.document.querySelector(`html`).style.overflow = "auto"
	window.document.body.scrollTop = 0;

  }
}

class Article {

  #_amount;
  #_id;
  #_info;

  constructor(id, info) {
	this.#_id = id;
	this.#_amount = 0;
	this.#_info = info;
  }

  increase(sel) {
	this.#_amount++;
	Cart.render()
	console.log(myCart)
	if(sel) {
	  let id = sel.closest('.card').getAttribute('data-article')
	  let amount = myCart[id].amount
	  sel.closest('.card').querySelector('.amount-articles').innerText = amount
	}
	if(this.amount == 0 ) {
	  sel.closest('.card').querySelector(".cart-manager").style.display = "none"
	  sel.closest('.card').querySelector(".add-to-cart").style.display = "flex"
	  sel.closest('.card').querySelector(".card-head > img").style.border = "none"

	} else {
	  sel.closest('.card').querySelector(".cart-manager").style.display = "flex"
	  sel.closest('.card').querySelector(".add-to-cart").style.display = "none"
	  sel.closest('.card').querySelector(".card-head > img").style.border = "solid 2px var(--red)"
	}
  }

  decrease(sel) {


	if(this.amount > 0){
	  this.#_amount--;
	  Cart.render()
	  if(sel) {
		let id = sel.closest('.card').getAttribute('data-article')
		let amount = myCart[id].amount
		sel.closest('.card').querySelector('.amount-articles').innerText = amount
	  }
	}
	if(this.amount == 0 ) {
	  sel.closest('.card').querySelector(".cart-manager").style.display = "none"
	  sel.closest('.card').querySelector(".add-to-cart").style.display = "flex"
	  sel.closest('.card').querySelector(".card-head > img").style.border = "none"

	}else {
	  sel.closest('.card').querySelector(".cart-manager").style.display = "flex"
	  sel.closest('.card').querySelector(".add-to-cart").style.display = "none"
	  sel.closest('.card').querySelector(".card-head > img").style.border = "solid 2px var(--red)"
	}
  }

  remove(sel) {
	console.log(sel)
	this.#_amount = 0;
	Cart.render()
	if(sel){
	  
	  let id = sel.closest('.article').getAttribute('data-article')
	  let amount = myCart[id].amount
	  window.document.querySelector(`.card[data-article="${id}"] .amount-articles`).innerText = amount
	  if(this.amount == 0 ) {
		window.document.querySelector(`.card[data-article="${id}"] .cart-manager`).style.display = "none"
		window.document.querySelector(`.card[data-article="${id}"] .add-to-cart`).style.display = "flex"
		window.document.querySelector(`.card[data-article="${id}"] > .card-head > img`).style.border = "none"
	  
	}
	  if(this.amount > 0 ) {
		window.document.querySelector(`.card[data-article="${id}"] .cart-manager`).style.display = "flex"
		window.document.querySelector(`.card[data-article="${id}"] .add-to-cart`).style.display = "none"
		window.document.querySelector(`.card[data-article="${id}"] > .card-head > img`).style.border = "solid 2px var(--red)"
  
	}
	  sel.closest('.article').remove()
	}

   
  }

  set amount(val) {
	this.#_amount = val;
  }

  get amount() {
	return this.#_amount;
  }

  get id() {
	return this.#_id;
  }

  get info() {
	return this.#_info
  }


}

function domReady() {

  myCart = []

  fetch("./data.json")
	.then( resp => resp.json())
	.then( data => {
	  let list = document.querySelector('.list-cards')
	  var elts = "";
		data.forEach((itm, index) => {

		  let article = new Article(index, itm)
		  myCart[index] = article
		  

		  elts += `<div class="card" data-article="${index}">
				<div class="card-head">

				  <img src="${itm.image.desktop}" alt="${itm.name}">
				  <div class="btn-container">
					<button  class="add-to-cart" onclick="myCart[${index}].increase(this)">
					  <img class="cart-img" width="20" src="./assets/images/icon-add-to-cart.svg" />      
					  <span>Add to Cart</span>
					</button>
					
					<button  style="display:none;" class="cart-manager">
							<span class="decrease-btn" onclick="myCart[${index}].decrease(this)">
							  <img  width="10" src="./assets/images/icon-decrement-quantity.svg" />
							</span>
							<span class="amount-articles">0</span>
							<span class="increase-btn" onclick="myCart[${index}].increase(this)">
							  <img width="10" src="./assets/images/icon-increment-quantity.svg" />
							</span>
					</button>
					
				  </div>
				</div>
				
				<div class="card-body">
				  <div class="category">${itm.category}</div>
				  <div class="name">${itm.name}</div>
				  <div class="price">${itm.price}</div>
				</div>

			  </div>`
		  
		})
		list.innerHTML = elts;
	  })

}

document.addEventListener('DOMContentLoaded', domReady);

