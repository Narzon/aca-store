//show sign up screen
let signUp = () => {
    let descStr = ""
    descStr += `<form>
        E-mail Address: <input id="email"></input><br>
        Password: <input id="password"></input><br>
        <button type="button" onclick="submitSignUp()">Sign Up</button>
    </form>`
    currentDiv.innerHTML += descStr    
}
let submitSignUp = () => {
    fetch("https://acastore.herokuapp.com/users", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: document.getElementById("email").value, password: document.getElementById("password").value, cartId: null})
      }).then((response) => response.json()).then((data) => {localStorage.setItem('user', JSON.stringify(data))}).then(() => {loadPage()})
      
}