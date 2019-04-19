//define function to remove item from cart and subtract its value from the current total
let removeItem = (i) => {
    let cart = convertStringsArrays(sessionStorage.getItem('myCart'))
    let cartValue = Number(sessionStorage.getItem('cartValue'))
    let itemValue = 0
    //create an empty string to record removed item's value
    let tempStr = ""
    //parse string of removed item backwards until reaching $ sign to determine value
    for (let j = cart[i].length - 1; j > 0; j --) {
        if (cart[i][j] === "$") {
            tempStr = cart[i].substr(j + 1)
        }
    }
    itemValue = Number(tempStr)
    cartValue -= itemValue
    cart.splice(i, 1);
    sessionStorage.setItem('myCart', convertStringsArrays(cart));
    sessionStorage.setItem('cartValue', "" + cartValue);
    showCart()
}

//define function to add a product to cart based on its passed in ID, and add its value to the cart total
let addToCart = (id) => {
    let cart = convertStringsArrays(sessionStorage.getItem('myCart'))
    let quantity = document.getElementById("quantity"+ id)
    console.log("quantity is " + quantity.value)
    if (cart[0] === "") {
        cart[0] = ("" + quantity.value + "x " + products[id - 1].name + "  - $" + (Number(products[id - 1].price.slice(1)) * Number(quantity.value)).toFixed(2))
    } else {
        cart.push("" + quantity.value + "x " + products[id - 1].name + "  - $" + (Number(products[id - 1].price.slice(1)) * Number(quantity.value)).toFixed(2))
    }
    let cartValue = Number(sessionStorage.getItem('cartValue'))
    cartValue += (Number(products[id - 1].price.substring(1)) * Number(quantity.value))
    sessionStorage.setItem('myCart', convertStringsArrays(cart));
    sessionStorage.setItem('cartValue', "" + cartValue);
    //empty status bar
    let statusbar = document.getElementById("statusbar")
    statusbar.innerHTML = `<font color="red">${products[id - 1].name} added to cart!</font>` 
}

//define function to show each item in the cart and the total value
let showCart = () => {
    let cart = convertStringsArrays(sessionStorage.getItem('myCart'))
    let cartValue = Number(sessionStorage.getItem('cartValue'))
    let cartStr = ""
    if (cart.length === 1 && cart[0] === "") {
        cartStr += `<p>Cart is Empty!</p>`
    } else {
        for (let i = 0; i < cart.length; i++) {
            cartStr += `<p> ${cart[i]} <button type="button" onclick="removeItem(${i})">Remove</button></p>`
        }
    }
    cartStr += `<h3>Total price: $${cartValue.toFixed([2])}</h3><button type="button" onclick="checkout()">Checkout</button><br><br><button type="button" onclick="loadPage()">Return</button>`
    currentDiv.innerHTML = cartStr
    //empty status bar
    let statusbar = document.getElementById("statusbar")
    statusbar.innerHTML = " "
}

//define a function to show checkout screen
let checkout = () => {
    let cart = convertStringsArrays(sessionStorage.getItem('myCart'))
    //if cart is empty, alert with an error
    if (cart.length === 1 && cart[0] === "") {
        alert("Error! Empty cart.")
        return
    }
    let cartValue = Number(sessionStorage.getItem('cartValue'))
    let checkoutStr = ""
    checkoutStr += `<form>
            First Name: <input></input><br>
            Last Name: <input></input><br>
            E-mail Address: <input></input><br>
            <h2>Total price: $${cartValue.toFixed([2])}</h2>
            <button type="submit">Place Order</button>
            <br><br>
            <button type="button" onclick="loadPage()">Return</button>
        </form>`
    currentDiv.innerHTML = checkoutStr
    //empty status bar
    let statusbar = document.getElementById("statusbar")
    statusbar.innerHTML = " "
}