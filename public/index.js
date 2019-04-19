//Basic shopping site, ACA JS311
//Nicolai Antonov
//April 2019

//load main products page
//if value exists in searchbox, filter to only include results with that value
//else, if category is selected, filter to show only products in that category
//else, list all products
let loadPage = () => {
    //empty the status bar whenever page is loaded
    let statusbar = document.getElementById("statusbar")
    statusbar.innerHTML = " "
    let searchTerm = document.getElementById("searchbox").value
    let catSelect = document.getElementById("catSelect").value
    //create cart in sessionStorage if it doesn't yet exist
    //create variables in sessionStorage to keep track of shopping cart if they don't currently exist
    if (sessionStorage.getItem('myCart') == undefined) {
        sessionStorage.setItem('myCart', '');
    }
    if (sessionStorage.getItem('cartValue') == undefined) { 
        sessionStorage.setItem('cartValue', '');
    }
    let newStr = ""
    if (searchTerm) {
        for (let i = 0; i < products.length; i++) {
            let product = products[i]
            if (product.name.includes(searchTerm) || product.description.includes(searchTerm)) {
                newStr += `<div> ${product.name} - ${product.price} <br><img src=${product.imgUrl} onclick="showDescription(${product._id})"></img>` + `<br><button type="button" onclick="addToCart(${product._id})"> Add to Cart </button></div>`
            }
        }
    } else if (catSelect) {
        for (let i = 0; i < products.length; i++) {
            let product = products[i]
            if (product.category === catSelect) {
                newStr += `<div> ${product.name} - ${product.price} <br><img src=${product.imgUrl} onclick="showDescription(${product._id})"></img>` + `<br><button type="button" onclick="addToCart(${product._id})"> Add to Cart </button></div>`
            }
        }
    } else {
        for (let i = 0; i < products.length; i++) {
            let product = products[i]
            newStr += `<div> ${product.name} - ${product.price} <br><img src=${product.imgUrl} onclick="showDescription(${product._id})"></img>` + `<br><button type="button" onclick="addToCart(${product._id})"> Add to Cart </button></div>`
        }
    }
    //place products in container to display all products in a grid
    newStr = '<div id="container">' + newStr + '</div>' 
    currentDiv.innerHTML = newStr
}

//define a function to show product description on page, reached on clicking its image from products page
let showDescription = (id) => {
    product = products[id - 1]
    let descStr = ""
    descStr += `<div>
        <h2>${product.name}</h2>
        <h3>Category: ${product.category}</h3>
        <br>
        <img src=${product.imgUrl}></img>
        <br>
        <p>${product.description}</p>
        <br>
        <p>Price: ${product.price}</p>
    
    </div><br><button type="button" onclick="addToCart(${product._id})">Add to Cart </button><br><br><button type="button" onclick="loadPage()">Return</button><br>
    <p>This product is rated ${product.rating} based on ${product.reviews.length} review(s).</p>
    <h3>Reviews:</h3>`
    for (let i = 0; i < product.reviews.length; i++) {
        descStr += `<p>${product.reviews[i].rating} - ${product.reviews[i].description}</p>`
    }
    currentDiv.innerHTML = descStr
}

//define function to reset category and search on clicking title
let resetCat = () => {
    document.getElementById('catSelect').value = ""
    document.getElementById('searchbox').value = ""
}

//define function to convert between strings (with comma separators) and arrays both ways
let convertStringsArrays = (original) => {
    if ((typeof original) === "string") {
        let newArray = []
        newArray = original.split(",")
        return newArray
    } else if (Array.isArray(original)) {
        let newString = original.toString()
        return newString
    }
}

//define functions to detect and record instances of activity
let activityDetected = () => {
    isActive = true
}
let checkActivity = () => {
    if (isActive === true) {
        isActive = false
    } else if (isActive === false) {
        alert("Are you still there?")
        isActive = true
    }
}

//Load all products to page
let currentDiv = document.getElementById("currentPage")
loadPage()
//reload products on page when category selection is changed
document.getElementById('catSelect').addEventListener('change', loadPage);
//check if user has interacted with page in last minute
let isActive = true
var intervalID = window.setInterval(checkActivity, 60000)