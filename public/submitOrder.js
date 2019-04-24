//define a function to POST an order to the server using the current user information and cart
let submitOrder = () => {
    let checkOutCart = []
    let checkOutValue = 0
    //retrieve current user's ID and e-mail
    let userID = JSON.parse(localStorage.getItem("user")).id
    let userEmail = JSON.parse(localStorage.getItem("user")).email
    //retrieve current user's cart array
    let tempID = JSON.parse(localStorage.getItem("user")).cartId
    fetch(`https://acastore.herokuapp.com/carts/${tempID}`).then((response) => {return response.json()})
    //assign data from server to a temporary cart Obj, and grab the current value and list of products
    .then((data)=>{checkOutCart = data.products; checkOutValue = Number(data.cartValue)})
    .then(() => {
        fetch("https://acastore.herokuapp.com/orders", {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId: userID, items: checkOutCart})
        })
    })
    .then(() => {
        alert("Order placed! Check your e-mail for verification.") 
    })
}