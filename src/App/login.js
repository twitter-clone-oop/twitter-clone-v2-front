import env from "../../env.js";

export class Login {
  constructor() {
    this.loginPage = `
    <div class="loginContainer">
      <div class="login__titleContainer">
        <img src="assets/images/twitter.png" alt=""> 
        <h1>Login</h1>
      </div>
      <form action="POST" class="login-form">
        <p id="errorMessage"></p>
    
        <input type="text" id="loginUsername" name="loginUsername" placeholder="E-Mail" required>
        <input type="password" id="loginPassword" name="loginPassword" placeholder="Password" required>
        <input type="submit" id="login-btn" value="Login">
      </form>
    
      <div class="register-message-container">
        <a href="/register">Need an account? Register here!</a>
      </div>
    </div>
    `;

    const wrapper = document.querySelector(".wrapper");
    wrapper.innerHTML = this.loginPage;

    this.loginForm = document.querySelector(".login-form");
    this.loginButton = document.querySelector("#login-btn");
    this.loginButton.addEventListener("click", this.loginHandler.bind(this));

    const fileref = document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", "assets/styles/login.css");
    fileref.setAttribute("id", "login-css");
    document.getElementsByTagName("head")[0].appendChild(fileref);
    // this._states = {};
  }

  // get states() {
  //   return this._states
  // }

  // set state( key, value ) {
  //   if( stateObj ) {
  //     this._states[key] = value;
  //   }
  // }

  async loginHandler(event) {
    event.preventDefault();

    const loginUsername = this.loginForm.querySelector("#loginUsername").value;
    const loginPassword = this.loginForm.querySelector("#loginPassword").value;

    let response = await fetch(`${env.BACKEND_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loginUsername,
        password: loginPassword,
      }),
    });
    if (response.status !== 200) {
      response = await response.json();

      return this.showErrorMessage(response.message);
    }

    response = await response.json();

    localStorage.setItem("token", response.token);
    localStorage.setItem("userId", response.userId);

    const remainingMilliseconds = 60 * 60 * 1000;
    const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);
    localStorage.setItem("expiryDate", expiryDate.toISOString());
    const loginEvent = new Event("login-success", { bubbles: true });
    event.target.dispatchEvent(loginEvent);
  }

  static clearLoginCSS() {
    const fileref = document.querySelector("#login-css");
    fileref.remove();
  }

  showErrorMessage(message) {
    const errorMessageElement = document.querySelector("#errorMessage");
    errorMessageElement.innerText = message;
  }
}

// new Login();
