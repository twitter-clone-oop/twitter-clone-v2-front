import env from "../../env.js";

export class Signup {
  constructor() {
    this.signupPage = `
    <div class="loginContainer">
      <div class="login__titleContainer">
        <img src="assets/images/twitter.png" alt=""> 
        <h1>Sign Up</h1>
      </div>
      <form method="POST" id="signup-form">
        <p id="errorMessage"></p>
  
        <input type="text" name="firstName" id="firstName" placeholder="First name" required>
        <input type="text" name="lastName" id="lastName" placeholder="Last name" required>
        <input type="text" name="userName" id="userName" placeholder="User name" required>

        <input type="email" name="email" id="email" placeholder="E-mail" required>

        <input id="password" type="password" id="password" name="password" placeholder="Password" required>
        <input id="passwordConfirm" type="password" id="passwordConfirm" name="passwordConfirm" placeholder="Confirm Password" required>
        <input type="submit" value="Register" id="submit-signup">
      </form>
  
      <div class="register-message-container">
        <a href="/login">Already have an account? Login here</a>
      </div>
    </div>`;

    this.wrapper = document.querySelector(".wrapper");
    this.wrapper.innerHTML = this.signupPage;

    this.signupForm = document.querySelector("#signup-form");
    this.submitButton = document.querySelector("#submit-signup");

    this.submitButton.addEventListener("click", this._submitHandler.bind(this));
  }

  async _submitHandler(event) {
    event.preventDefault();
    console.log("btn");
    const firstName = this.signupForm.querySelector("#firstName").value;
    const lastName = this.signupForm.querySelector("#lastName").value;
    const userName = this.signupForm.querySelector("#userName").value;
    const email = this.signupForm.querySelector("#email").value;
    const password = this.signupForm.querySelector("#password").value;
    const passwordConfirm =
      this.signupForm.querySelector("#passwordConfirm").value;

    if (password !== passwordConfirm) {
      this._showErrorMessage("Error: Password mismatch.");
      return;
    }

    //send request to the backend

    let response = await fetch(`${env.BACKEND_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        userName,
        email,
        password,
      }),
    });
    console.log(response.status);
    let statusCode = response.status;
    response = await response.json();

    console.log("response", response);

    if (statusCode >= 200 && statusCode < 400) {
      const initLoginEvent = new Event("init-login");
      this.wrapper.dispatchEvent(initLoginEvent);
      alert(response.message);
    } else {
      //error
      let errorMessage = `${response.message.param} - ${response.message.msg}`;

      console.log(errorMessage);

      this._showErrorMessage(errorMessage);
    }
  }

  _showErrorMessage(errorMessage) {
    const errorMessageContainer = document.querySelector("#errorMessage");
    errorMessageContainer.textContent = errorMessage;
    errorMessageContainer.classList.add("error");
  }
}
