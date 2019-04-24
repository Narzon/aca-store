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

    //if local storage does not yet have users sign up info, present sign up screen
    if (!localStorage.getItem("user")) {
        signUp()
        return
        //if user exists and does not yet have an assigned cart, create and assign one from the server
    } else {
        //run initCart to create cart if the current user does not have an assigned cartId
        initCart()
    }   
    
    let newStr = ""
    let tenOptions = "<option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option>"
    if (searchTerm) {
        for (let i = 0; i < products.length; i++) {
            let product = products[i]
            if (product.name.includes(searchTerm) || product.description.includes(searchTerm)) {
                newStr += `<div> ${product.name} - ${product.price} <br><img src=${product.imgUrl} onclick="showDescription(${product.id})"></img>` + `<br><button type="button" onclick="addToCart(${product.id})"> Add to Cart </button> <select id="quantity">${tenOptions}</select></div>`
            }
        }
        if (newStr === "") {
            newStr = "<h3>No results founds</h3>"
        }
    } else if (catSelect) {
        for (let i = 0; i < products.length; i++) {
            let product = products[i]
            if (product.category === catSelect) {
                newStr += `<div> ${product.name} - ${product.price} <br><img src=${product.imgUrl} onclick="showDescription(${product.id})"></img>` + `<br><button type="button" onclick="addToCart(${product.id})"> Add to Cart </button> <select id="quantity">${tenOptions}</select></div>`
            }
        }
    } else {
        for (let i = 0; i < products.length; i++) {
            let product = products[i]
            newStr += `<div> ${product.name} - ${product.price} <br><img src=${product.imgUrl} onclick="showDescription(${product.id})"></img>` + `<br><button type="button" onclick="addToCart(${product.id})"> Add to Cart </button> <select id="quantity${product.id}">${tenOptions}</select></div>`
        }
    }
    //place products in container to display all products in a grid
    newStr = '<div id="container">' + newStr + '</div>' 
    currentDiv.innerHTML = newStr
}

//define a function to show product description on page, reached on clicking its image from products page
let showDescription = (id) => {
    product = products[id - 1]
    console.log("product is "+product.id)
    let tenOptions = "<option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option>"
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
    
    </div><br><button type="button" onclick="addToCart(${product.id})">Add to Cart </button><br> <select id="quantity${product.id}">${tenOptions}</select><br><br><button type="button" onclick="loadPage()">Return</button><br>
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

let currentDiv = document.getElementById("currentPage")
//reload products on page when category selection is changed
document.getElementById('catSelect').addEventListener('change', loadPage);
//check if user has interacted with page in last minute
let isActive = true
var intervalID = window.setInterval(checkActivity, 60000)