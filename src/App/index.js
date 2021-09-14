import { Login } from "../App/login.js";
import { Signup } from "../App/signup.js";

import { Navbar } from "../Components/Navbar.js";
import { PostForm } from "../Components/PostForm.js";
import env from "../../env.js";

class Index {
  constructor() {
    this.localStorageClearHandler();

    this.Login;
    this.Signup;

    this.token;
    this.userId;
    this.expiryDate;

    this.isAuth;

    this.wrapper = document.querySelector(".wrapper");

    this.initPage();

    this.mainLayout = `
    <div class="row">
      <nav-bar class="col-2"></nav-bar>
      <div class="mainSectionContainer col-10 col-md-8 col-lg-6">
        <div class="titleContainer">
          <h1 id="page-title">PageTitle</h1>
        </div>
        <create-post-form></create-post-form>
      </div>
      <div class="d-none d-md-block col-md-2 col-lg-4">
        <span>Third column</span>
      </div>
    </div>`;
  }

  //page code -> dynamic import

  async initPage() {
    this.isAuth = await this.checkAuth(this.token);
    if (this.isAuth) {
      // load main post apge
      loginSuccessHandler();
    } else {
      this.Login = new Login();

      this.wrapper.addEventListener(
        "init-login",
        this._initLoginHandler.bind(this)
      );

      this.wrapper.addEventListener(
        "init-signup",
        this._initSignupHandler.bind(this)
      );

      this.wrapper.addEventListener("login-success", async (event) => {
        this.loginSuccessHandler();
        this.isAuth = await this.checkAuth(this.token);

        if (this.isAuth) {
          Login.clearLoginCSS();
          this.loadMainPage();
          this.Login = null;
        }
      });
    }
  }

  loadMainPage() {
    this.wrapper.innerHTML = this.mainLayout;
  }

  async checkAuth(token) {
    try {
      let isAuth = await fetch(`${env.BACKEND_BASE_URL}/auth/check`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      isAuth = await isAuth.json();
      if (isAuth.token) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
    }
  }

  logoutHandler = () => {
    this.isAuth = false;
    this.token = null;

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("expiryDate");
  };

  loginSuccessHandler = () => {
    this.token = localStorage.getItem("token");
    this.userId = localStorage.getItem("userId");
    this.expiryDate = localStorage.getItem("expiryDate");
  };

  setAutoLogout = (milliseconds) => {
    setTimeout(() => {
      this.logoutHandler();
    }, milliseconds);
  };

  _initLoginHandler(event) {
    this.Login = new Login();
  }

  _initSignupHandler(event) {
    console.log("initSignupHandler");
    this.Signup = new Signup();
  }

  localStorageClearHandler() {
    window.addEventListener("beforeunload", function (e) {
      // Cancel the event
      e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
      // Chrome requires returnValue to be set
      localStorage.clear();
      e.returnValue = "";
    });
  }
}

new Index();

// const postForm = document.querySelector("create-post-form");
// postForm.addEventListener("create-post", () => {
//   const content = postForm.getAttribute("data");

//   // fetch("create post url", {
//   //   method: "POST",
//   //   body: {
//   //     creator,
//   //     content,
//   // },
// });
