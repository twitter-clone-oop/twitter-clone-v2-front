import env from "../../env.js";

class Signup {
  constructor() {
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
      alert(response.message);
      location.href = "/login";
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

new Signup();
