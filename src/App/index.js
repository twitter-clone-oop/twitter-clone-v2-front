import { Login } from "../App/login.js";
import { Signup } from "../App/signup.js";
import { Profile } from "../App/Profile.js";

import { Navbar } from "../Components/Navbar.js";
import { PostForm } from "../Components/PostForm.js";
import { Post } from "../Components/Post.js";
import { PostModal } from "../Components/PostModal.js";

import env from "../../env.js";

export class Index {
  constructor() {
    // this.sessionStorageClearHandler();

    this.Login;
    this.Signup;
    this.Profile;

    this.navbar;

    this.token;
    this.userId;
    this.expiryDate;

    this.userProfile;

    this.isAuth;

    this.wrapper = document.querySelector(".wrapper");
    this.postsArea;

    this.postCards = [];
    this.patchPostResponse;

    this.initPage();
  }

  //page code -> dynamic import

  async initPage() {
    const states = this.getStates();
    this.isAuth = await this.checkAuth(states.token);

    if (this.isAuth) {
      // load main post apge
      this.loginSuccessHandler();
      // render posts
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
      });
    }
  }

  async _getPosts() {
    let posts = await fetch(
      `${env.BACKEND_BASE_URL}/post/posts?followingOnly=true`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
    posts = await posts.json();
    return posts;
  }

  async renderPosts() {
    const mainSectionContainer = document.querySelector(
      ".mainSectionContainer"
    );

    const oldPostsArea = document.querySelector(".posts-area");
    oldPostsArea.innerHTML = "";
    const newPostsArea = oldPostsArea.cloneNode(true); //clear all event listeners

    mainSectionContainer.removeChild(oldPostsArea);
    newPostsArea.innerHTML = "";

    const posts = await this._getPosts();

    posts.forEach((post) => {
      const postCard = new Post(post);
      newPostsArea.appendChild(postCard);
      this.postCards.push(postCard);
    });

    mainSectionContainer.appendChild(newPostsArea);
  }

  loadMainPage() {
    const mainLayout = `
    <div class="row">
      <nav-bar class="col-2"></nav-bar>
      <div class="mainSectionContainer col-10 col-md-8 col-lg-6">
        <div class="titleContainer">
          <h1 id="page-title">PageTitle</h1>
        </div>
        <create-post-form profile-image-url="${this.userProfile.profilePic}"></create-post-form>
        <div class="posts-area">
        </div>
      </div>
      <div class="d-none d-md-block col-md-2 col-lg-4">
        <span>Third column</span>
      </div>
    </div>
    `;
    this.wrapper.innerHTML = mainLayout;

    //init navbar
    this.initNavbar();
  }

  getStates() {
    return {
      token: sessionStorage.getItem("token"),
      userId: sessionStorage.getItem("userId"),
    };
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

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("expiryDate");
  };

  loginSuccessHandler = async () => {
    this.token = sessionStorage.getItem("token");
    this.userId = sessionStorage.getItem("userId");
    this.expiryDate = sessionStorage.getItem("expiryDate");

    this.userProfile = await this.fetchUserProfile();

    Login.clearLoginCSS();
    this.loadMainPage();

    this.renderPosts();

    const createPostForm = document.querySelector("create-post-form");
    createPostForm.addEventListener("create-post", (event) => {
      const newPost = event.post.createdPost;
      const postCard = new Post(newPost);
      this.postCards.push(postCard);
      const postsArea = document.querySelector(".posts-area");
      postsArea.prepend(postCard);
    });
  };

  //navbar
  initNavbar() {
    this.navbar = document.querySelector("nav-bar");
    this.navbar.addEventListener("nav-home", this.navHomeHandler.bind(this));
    this.navbar.addEventListener(
      "nav-profile",
      this.navProfileHandler.bind(this)
    );
  }

  navHomeHandler() {
    this.loadMainPage();
    this.renderPosts();
  }

  navProfileHandler() {
    const profileUser = this.userProfile;
    const user = this.userProfile;
    this.Profile = new Profile(profileUser, user, this.token);
  }

  setAutoLogout = (milliseconds) => {
    setTimeout(() => {
      this.logoutHandler();
    }, milliseconds);
  };

  _initLoginHandler(event) {
    this.Login = new Login();
  }

  _initSignupHandler(event) {
    this.Signup = new Signup();
  }

  sessionStorageClearHandler() {
    window.addEventListener("beforeunload", function (e) {
      // Cancel the event
      e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
      // Chrome requires returnValue to be set
      sessionStorage.clear();
      e.returnValue = "";
    });
  }

  async fetchUserProfile() {
    let user = await fetch(`${env.BACKEND_BASE_URL}/user/profile`, {
      headers: {
        Authorization: "Bearer " + this.token,
      },
      method: "GET",
    });

    user = await user.json();
    return user;
  }
}

new Index();
