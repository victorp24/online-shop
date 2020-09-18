// num of seconds in 30 minutes
const THIRTY_MINUTES = 1800;

// initialize time counter (in seconds)
var inactiveTime = 0;

// called every 1000 ms
var inactivity = setInterval(checkInactivity, 1000);

// reset the time counter
function resetTimer() {
    inactiveTime = 0;
}

/*
 * Checks for inactivity in the last 30 minutes (1800 seconds).
 */
function checkInactivity() {
    if(inactiveTime < THIRTY_MINUTES) {
        inactiveTime++;
        if(inactiveTime == THIRTY_MINUTES) {
            alert("Hey there! Are you still planning to buy something?");

            // reset the counter
            resetTimer();
        }
    }
}


/*
 * Constructor for a Store object.
 *
 * @param {Object} initialStock     Describes the store's stock
 */
var Store = function(initialStock) {
    this.stock = initialStock;
    this.cart = {};
    this.onUpdate = null;

    /*
     * Adds an item to the Store's cart.
     *
     * @param {string} itemName     Item name must exist in the store's stock.
     */
    this.addItemToCart = function(itemName) {
        if(this.stock[itemName].quantity > 0) {

            // check if at least one instance of the item is already in the cart
            if(this.cart.hasOwnProperty(itemName)) {

                this.cart[itemName]++;

            } else {
                
                // initialize this item in the cart
                this.cart[itemName] = 1;

            }

            // take away one instance of the item from the Store stock
            this.stock[itemName].quantity--;

            this.onUpdate(itemName);

        }

        resetTimer();

    };

    /*
     * Removes an item from the Store's cart.
     *
     * @param {string} itemName     Item name must exist in the store's stock.
     */
    this.removeItemFromCart = function(itemName) {

        // check if at least one instance of the item is already in the cart
        if(this.cart.hasOwnProperty(itemName)) {

            this.cart[itemName]--;

            // return one instance of the item to the Store stock
            this.stock[itemName].quantity++;

            // check if the last instance of the item in the cart has been taken out
            if(this.cart[itemName] == 0) {

                delete this.cart[itemName];

            }
        
            this.onUpdate(itemName);

        }

        resetTimer(); 

    };

}

// static initial store stock
var products = {
    Box1: {
        label: 'White Box',
        imageUrl: "./images/Box1_$10.png",
        price: 10,
        quantity: 5
    },
    Box2: {
        label: 'Colored Box',
        imageUrl: "./images/Box2_$5.png",
        price: 5,
        quantity: 5
    },
    Clothes1: {
        label: 'Maroon Dress',
        imageUrl: "./images/Clothes1_$20.png",
        price: 20,
        quantity: 5
    },
    Clothes2: {
        label: 'Colorful T-shirt',
        imageUrl: "./images/Clothes2_$30.png",
        price: 30,
        quantity: 5
    },
    Jeans: {
        label: 'Blue Jeans',
        imageUrl: "./images/Jeans_$50.png",
        price: 50,
        quantity: 5
    },
    Keyboard: {
        label: 'Light-Up Keyboard',
        imageUrl: "./images/Keyboard_$20.png",
        price: 20,
        quantity: 5
    },
    KeyboardCombo: {
        label: 'Light-Up Keyboard and Mouse (Red)',
        imageUrl: "./images/KeyboardCombo_$40.png",
        price: 40,
        quantity: 5
    },
    Mice: {
        label: 'Gaming Mouse',
        imageUrl: "./images/Mice_$20.png",
        price: 20,
        quantity: 5
    },
    PC1: {
        label: 'Dell PC',
        imageUrl: "./images/PC1_$350.png",
        price: 350,
        quantity: 5
    },
    PC2: {
        label: 'Quantum PC',
        imageUrl: "./images/PC2_$400.png",
        price: 400,
        quantity: 5
    },
    PC3: {
        label: 'HP PC',
        imageUrl: "./images/PC3_$300.png",
        price: 300,
        quantity: 5
    },
    Tent: {
        label: 'Camping Tent',
        imageUrl: "./images/Tent_$100.png",
        price: 100,
        quantity: 5
    }
}

var store = new Store(products);

// called whenever there is an action performed on a product or the cart
store.onUpdate = function(itemName) {
    var identifier = "product-" + itemName;
    var productBox = document.getElementById(identifier);
    var modalContent = document.getElementById("modal-content");
    renderProduct(productBox, store, itemName);
    renderCart(modalContent, store);
}

/*
 * Generates a single product box (DOM element) representing a given item of a store.
 * This replaces the contents of 'container' with the new DOM element.
 *
 * @param {DOM element} container
 * @param {Store} storeInstance
 * @param {{label: string, imageUrl: string, price: number, quantity: 5}}   Must exist in storeInstance's stock
 * 
 */
function renderProduct(container, storeInstance, itemName) {
    var productBox = document.createElement('li');
    productBox.className = "product";
    productBox.id = container.id;

    // optionally generate a 'Add to Cart'/'Remove from Cart' buttons depending on store stock and cart
    addToCartFlag = true;
    removeFromCartFlag = true;

    if(getQuantity(storeInstance,itemName) == 0) {
        addToCartFlag = false;
    }

    if(!isItemInCart(storeInstance, itemName)) {
        removeFromCartFlag = false;
    }

    if(addToCartFlag) {
        var btnadd = document.createElement('button');
        btnadd.className = "btn-add-remove";
        btnadd.type = "button";
        btnadd.onclick = function() {
            storeInstance.addItemToCart(itemName);
        };
        btnadd.appendChild(document.createTextNode("Add to Cart"));
        productBox.appendChild(btnadd);
    }

    if(removeFromCartFlag) {
        var btnremove = document.createElement('button');
        btnremove.className = "btn-add-remove";
        btnremove.type = "button";
        btnremove.onclick = function() {
            storeInstance.removeItemFromCart(itemName);
        };
        btnremove.appendChild(document.createTextNode("Remove from Cart"));
        productBox.appendChild(btnremove);
    }

    // build the rest of the contents of a product box from the top down, in this order: Price, Image, Label

    // Product Price:
    var productPrice = document.createElement('p');
    productPrice.className = "price";
    var price = getPrice(storeInstance, itemName);
    productPrice.appendChild(document.createTextNode("$" + price));

    // Product Image:
    var productImage = document.createElement('img');
    productImage.className = "productImage";
    productImage.src = getProductImg(storeInstance, itemName);

    var lineBreak = document.createElement('br');

    // Product Label:
    var productName = document.createTextNode(getProductLabel(storeInstance, itemName));

    productBox.appendChild(productPrice);
    productBox.appendChild(productImage);
    productBox.appendChild(lineBreak);
    productBox.appendChild(productName);

    container.parentNode.replaceChild(productBox, container);
}

/*
 * Generates the product list (DOM element) from a store's stock.
 * This replaces the contents of 'container' with the new DOM element.
 * 
 * @param {DOM element} container
 * @param {Store} storeInstance
 */
function renderProductList(container, storeInstance) {
    var productList = document.createElement('ul');
    productList.id = "productList";

    // generate a product box for each item in the stock using the renderProduct function
    for(var itemName in storeInstance.stock) {
        var productBox = document.createElement('li');
        productBox.id = "product-" + itemName;
        productList.append(productBox);
        renderProduct(productBox, storeInstance, itemName);
    }

    container.parentNode.replaceChild(productList, container);
}

/*
 * Generates a table displaying the items in the cart including the quantity and price.
 * This replaces the contents of 'container' with the new DOM element.
 * 
 * For each item in the cart, also generates a '-' and '+' button to decrease/increase the quantity.
 * 
 * @param {DOM element} container
 * @param {Store} storeInstance
 * 
 */
function renderCart(container, storeInstance) {
    var cartTable = document.createElement('table');


    // create the heading of the tabular representation of the cart: Item | Price | Quantity
    var cartTableHeadingRow = document.createElement('tr');

    var cartItemHeading = document.createElement('th');
    cartItemHeading.appendChild(document.createTextNode('Item'));

    var cartPriceHeading = document.createElement('th');
    cartPriceHeading.appendChild(document.createTextNode('Price'));

    var cartQuantityHeading = document.createElement('th');
    cartQuantityHeading.appendChild(document.createTextNode('Quantity'));

    cartTableHeadingRow.appendChild(cartItemHeading);
    cartTableHeadingRow.appendChild(cartPriceHeading);
    cartTableHeadingRow.appendChild(cartQuantityHeading);

    cartTable.appendChild(cartTableHeadingRow);

    // for each item in the cart create a new table row : {itemName} | {itemName.price} | {quantity in cart}
    for (var itemName in storeInstance.cart) {
        var cartItem = document.createElement('tr');
        
        // item name
        var productName = document.createElement('td');
        productName.appendChild(document.createTextNode(itemName));

        // item price
        var productPrice = document.createElement('td');
        productPrice.appendChild(document.createTextNode(getPrice(storeInstance, itemName)));

        // item quantity with '-' and '+' butons
        var productQuantity = document.createElement('td');
        var lowerQuantityBtn = document.createElement('button');
        lowerQuantityBtn.className = "qtyBtn";
        lowerQuantityBtn.onclick = (function(opt) {
            return function() {
                storeInstance.removeItemFromCart(opt);
            };
        })(itemName);
        lowerQuantityBtn.appendChild(document.createTextNode('-'));

        var addQuantityBtn = document.createElement('button');
        addQuantityBtn.className = "qtyBtn";
        addQuantityBtn.onclick = (function(opt) {
            return function() {
                storeInstance.addItemToCart(opt);
            };
        })(itemName);
           
        addQuantityBtn.appendChild(document.createTextNode('+'));

        productQuantity.appendChild(lowerQuantityBtn);
        productQuantity.appendChild(document.createTextNode(getCartQuantity(storeInstance, itemName)));
        productQuantity.appendChild(addQuantityBtn);

        // form the table row/entry of the item
        cartItem.appendChild(productName);
        cartItem.appendChild(productPrice);
        cartItem.appendChild(productQuantity);

        cartTable.appendChild(cartItem);
    }

    // create the last row showing the total price of the entire cart
    var totalRow = document.createElement('tr');
    var totalDisplay = document.createElement('td');
    totalDisplay.colSpan = "3";
    totalDisplay.id = "total";
    totalDisplay.appendChild(document.createTextNode("Total: $" + getCartPrice(storeInstance).toString()));
    totalRow.appendChild(totalDisplay);

    cartTable.appendChild(totalRow);

    cartTable.id = "modal-content";
    container.parentNode.replaceChild(cartTable, container);
}

/*
 * Shows the cart contents of a store.
 *
 * @param {Store} storeInstance 
 */
function showCart(storeInstance) {
    var modal = document.getElementById("modal");
    modal.style.visibility = "visible";
    var modalContent = document.getElementById("modal-content");
    renderCart(modalContent,storeInstance);
}

/*
 * Hides the cart modal.
 */
function hideCart() {
    var modal = document.getElementById("modal");
    modal.style.visibility = "hidden";
}

// Functions below are helper functions to get information on a specific store product:

/*
 * Get an item's price.
 *
 * @param {Store} storeInstance
 * @param {string} itemName
 * 
 * @return {string}     Item's price as a string
 */
function getPrice(storeInstance, itemName) {
    if(storeInstance.stock[itemName].price != undefined) {
        return storeInstance.stock[itemName].price.toString();
    } else {
        return null;
    }
}

/*
 * Get an item's image URL.
 *
 * @param {Store} storeInstance
 * @param {string} itemName
 * 
 * @return {string}     Item's image URL
 */
function getProductImg(storeInstance, itemName) {
    if(storeInstance.stock[itemName].imageUrl != undefined) {
        return storeInstance.stock[itemName].imageUrl;
    } else {
        return null;
    }
}

/*
 * Get an item's quantity in a store's stock.
 *
 * @param {Store} storeInstance
 * @param {string} itemName
 * 
 * @return {number}     Item's store quantity.
 */
function getQuantity(storeInstance, itemName) {
    if(storeInstance.stock[itemName].quantity != undefined) {
        return storeInstance.stock[itemName].quantity;
    } else {
        return null;
    }
}

/*
 * Get an item's presentable label.
 *
 * @param {Store} storeInstance
 * @param {string} itemName
 * 
 * @return {string}     Item label.
 */
function getProductLabel(storeInstance, itemName) {
    if(storeInstance.stock[itemName].label != undefined) {
        return storeInstance.stock[itemName].label;
    } else {
        return null;
    }
}

/*
 * Get an item's quantity in the cart.
 *
 * @param {Store} storeInstance
 * @param {string} itemName
 * 
 * @return {string}     Item's cart quantity as a string.
 */
function getCartQuantity(storeInstance, itemName) {
    if(storeInstance.cart[itemName] != undefined) {
        return storeInstance.cart[itemName].toString();
    } else {
        return null;
    }
}

/*
 * Get the total price of a cart.
 *
 * @param {Store} storeInstance
 * 
 * @return {number}     Price of all items in the cart.
 */
function getCartPrice(storeInstance) {
    var total = 0;
    if( Object.keys(storeInstance.cart).length == 0 ) {
        return 0;
    } else {
        for(var itemName in storeInstance.cart) {
            total = total + storeInstance.stock[itemName].price*storeInstance.cart[itemName];
        }
        return total;
    }
}

/*
 * Checks if given item is in the cart.
 *
 * @param {Store} storeInstance
 * @param {string} itemName
 * 
 * @return {bool}
 */
function isItemInCart(storeInstance, itemName) {
    return storeInstance.cart.hasOwnProperty(itemName);
}

// This is executed after the entire page and all of its related files and components are loaded
window.onload = function() {
    var showCartBtn = document.getElementById('btn-show-cart');
    showCartBtn.onclick = function() {
        showCart(store);
    }
    var hideCartBtn = document.getElementById('btn-hide-cart');
    hideCartBtn.onclick = function() {
        hideCart();
    }
    var productView = document.getElementById('productView');
    renderProductList(productView,store);

    // https://stackoverflow.com/questions/3369593/how-to-detect-escape-key-press-with-pure-js-or-jquery
    document.onkeydown = function(evt) {
        evt = evt || window.event;
        var isEscape = false;
        if ("key" in evt) {
            isEscape = (evt.key === "Escape" || evt.key === "Esc");
        } else {
            isEscape = (evt.keyCode === 27);
        }
        if (isEscape) {
            hideCart();
        }
    };
}