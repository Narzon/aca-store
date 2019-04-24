let products = []

let createProduct = () => {
  let newStr = ""
  newStr += `
  <form>
    Name: <input id="addName"></input><br>
    Description: <input id="addDescription"></input><br>
    Price: <input id="addPrice"></input><br>
    <button type="button" onclick="postProduct()">Save New Product</button>
  </form>
  `
  currentDiv.innerHTML = newStr
}

let postProduct = () => {
  let addName = document.getElementById("addName").value
  let addDescription = document.getElementById("addDescription").value
  let addPrice = document.getElementById("addPrice").value
  console.log("name, desc, and price are: "+addName+addDescription+addPrice)
  fetch("https://acastore.herokuapp.com/products", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: addName, description: addDescription, price: addPrice, imgUrl: "https://via.placeholder.com/140x100", rating: 0, category: "", reviews: []})
      }).then((response) => response.json()).then(() => {refreshProducts()})
}
// get products from server and then call loadPage
let refreshProducts = () => {
  fetch("https://acastore.herokuapp.com/products").then((res) => {return res.json()}).then((data) => {products = data; loadPage()})
}
refreshProducts()