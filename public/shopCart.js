//check if current user has a cartId; if null, post a new cart and link it to the user
let initCart = () => {
    let tempID = JSON.parse(localStorage.getItem("user")).id
    if (JSON.parse(localStorage.getItem("user")).cartId === null){
        fetch("https://acastore.herokuapp.com/carts", {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId: tempID, products: [], cartValue: "0"})
        })
        .then((response) => response.json())
        //use PATCH method to add newly posted cart's ID to corresponding user
        .then( (cartobj) => {
            fetch(`https://acastore.herokuapp.com/users/${tempID}`, {
                method: 'PATCH',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({cartId: cartobj.id})
            })
        .then((response) => response.json())
        .then((data) => {localStorage.setItem('user', JSON.stringify(data))})
        .then(() => {loadPage()})
        })
    }
}

//define function to remove item from cart and subtract its value from the current total
let removeItem = (i) => {
    let tempCartObj = {}
    cart = []
    let cartValue = 0
    let itemValue = 0
    let tempStr = ""
    let tempID = JSON.parse(localStorage.getItem("user")).cartId
    fetch(`https://acastore.herokuapp.com/carts/${tempID}`).then((response) => {return response.json()})
    //assign data from server to a temporary cart Obj, and grab the current value and list of products
    .then((data)=>{tempCartObj = data; cart = data.products; cartValue = Number(data.cartValue)})
    //using retrieved data, update cart object array and current cart value
    .then(() => {
        for (let j = cart[i].length - 1; j > 0; j --) {
            if (cart[i][j] === "$") {
                tempStr = cart[i].substr(j + 1)
            }
        }
        itemValue = Number(tempStr)
        cartValue -= itemValue
        cart.splice(i, 1)
        tempCartObj.products = cart
        tempCartObj.cartValue = cartValue
    })
    //use PUT method to update info on server
    .then(() => {
        fetch(`https://acastore.herokuapp.com/carts/${tempID}`, {
            method: 'PUT',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(tempCartObj)
        })
    })
    //after updating cart, refresh the cart page
    .then(() => {
        //add 100ms delay to ensure server has updated
        setTimeout(showCart, 100)
    })
}

//define function to add a product to cart based on its passed in ID, and add its value to the cart total
let addToCart = (id) => {
    //init relevant variables, and begin with a GET request to the user's cart
    let tempCartObj = {}
    cart = []
    let cartValue = 0
    let quantity = document.getElementById("quantity" + id)
    let tempID = JSON.parse(localStorage.getItem("user")).cartId
    fetch(`https://acastore.herokuapp.com/carts/${tempID}`).then((response) => {return response.json()})
    //assign data from server to a temporary cart Obj, and grab the current value and list of products
    .then((data)=>{tempCartObj = data; cart = data.products; cartValue = Number(data.cartValue)})
    //push the product, its quantity, and relevant information to the list, then assign that to the temporary object
    .then(() => {    
        cart.push("" + quantity.value + "x " + products[id - 1].name + "  - $" + (Number(products[id - 1].price.slice(1)) * Number(quantity.value)).toFixed(2));
        tempCartObj.products = cart})
    //derive the price of new product(s) and add them to the total cart value
    .then(()=>{
        cartValue += (Number(products[id - 1].price.substring(1)) * Number(quantity.value));
        tempCartObj.cartValue = cartValue;
        })
    //use PUT method to update cart object in server
    .then(() => {
        fetch(`https://acastore.herokuapp.com/carts/${tempID}`, {
            method: 'PUT',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(tempCartObj)
        })
    })
    //update status bar
    let statusbar = document.getElementById("statusbar")
    statusbar.innerHTML = `<font color="red">${products[id - 1].name} added to cart!</font>` 
}

//define function to show each item in the cart and the total value
let showCart = () => {
    //init relevant varibles
    let tempID = JSON.parse(localStorage.getItem("user")).cartId
    let cart = []
    let cartValue = 0
    let cartStr = ""
    fetch(`https://acastore.herokuapp.com/carts/${tempID}`).then((response) => {return response.json()})
    //GET data from server to grab array of products and value from cart
    .then((data)=>{cart = data.products; cartValue = Number(data.cartValue)})
    //display cart info to page
    .then(() => {
        if (!cart[0]) {
            cartStr += `<p>Cart is Empty!</p>`
        } else {
            for (let i = 0; i < cart.length; i++) {
                cartStr += `<p> ${cart[i]} <button type="button" onclick="removeItem(${i})">Remove</button></p>`
            }
        }
        cartStr += `<h3>Total price: $${cartValue.toFixed([2])}</h3><button type="button" onclick="checkout()">Checkout</button><br><br><button type="button" onclick="loadPage()">Return</button>`
        currentDiv.innerHTML = cartStr
    })
    //empty status bar
    let statusbar = document.getElementById("statusbar")
    statusbar.innerHTML = " "
}

//define a function to show checkout screen
let checkout = () => {
    let checkoutStr = ""
    let cart = []
    let cartValue = 0
    let tempID = JSON.parse(localStorage.getItem("user")).cartId
    fetch(`https://acastore.herokuapp.com/carts/${tempID}`).then((response) => {return response.json()})
    //assign data from server to a temporary cart Obj, and grab the current value and list of products
    .then((data)=>{cart = data.products; cartValue = Number(data.cartValue)})
    //if cart is empty, alert with an error
    .then(() => {
        if (cart.length === 1 && cart[0] === "") {
            alert("Error! Empty cart.")
            return
        }
    //otherwise, create a submit form using EmailJS API  
        checkoutStr += `<form id="myform" onsubmit="submitOrder(); emailjs.sendForm('default_service', 'aca_store', this); return false;" method="post">
            <label>E-Mail</label>
            <input type="text" name="orderEmail" />
            <label>First Name</label>
            <input type="text" name="orderFName" />
            <label>Last Name</label>
            <input type="text" name="orderLName" />
            <br><br>
            <h2>Total price: $${cartValue.toFixed([2])}</h2> <br>
            <button>
            Confirm Order
            </button>
        </form>`
        currentDiv.innerHTML = checkoutStr
    })
    //empty status bar
    let statusbar = document.getElementById("statusbar")
    statusbar.innerHTML = " "
}