import { Login } from "../App/login.js";
import { Signup } from "../App/signup.js";

import { Navbar } from "../Components/Navbar.js";
import { PostForm } from "../Components/PostForm.js";
import { Post } from "../Components/Post.js";
import { PostModal } from "../Components/PostModal.js";

import env from "../../env.js";

class Index {
  constructor() {
    // this.sessionStorageClearHandler();

    this.Login;
    this.Signup;

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
    console.log(states.token);
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

  pinPostHandler(event) {
    // console.log(event.target.shadowRoot.querySelector(".post").dataset.id);
    const postId = event.target.shadowRoot.querySelector(".post").dataset.id;

    const postModal = new PostModal(
      "pin",
      "Pin this post?",
      "This post will appear at the top of your profile. You can only pin one post.",
      "Pin"
    );

    document
      .querySelector("post-modal")
      .addEventListener(
        "confirm-modal",
        this.pinPostConfirmHandler.bind(this, postId)
      );
  }

  async pinPostConfirmHandler(postId, event) {
    if (event.action === "pin") {
      //pin the post
      try {
        let patchPostResponse = await fetch(
          `${env.BACKEND_BASE_URL}/post/${postId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.token}`,
            },
            body: JSON.stringify({ pinned: true }),
          }
        );
        this.patchPostResponse = await patchPostResponse.json();

        event.target.remove();
        this.updatePostsArea();
      } catch (error) {
        console.log(error);
      }
    }
  }

  retweetHandler(event) {
    const repost = event.repost;
    const postCard = new Post(repost);
    this.postCards.push(postCard);
    const postsArea = document.querySelector(".posts-area");
    postsArea.prepend(postCard);
  }

  unRetweetHandler(event) {
    const repost = event.repost;
    const deleteTargetPostId = repost._id;

    let deleteTargetPostCard = this.postCards.filter((post) => {
      return post.postData._id === deleteTargetPostId;
    })[0];

    deleteTargetPostCard.remove();
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
    newPostsArea.addEventListener("pin-post", this.pinPostHandler.bind(this));

    newPostsArea.addEventListener("retweet", this.retweetHandler.bind(this));
    newPostsArea.addEventListener(
      "un-retweet",
      this.unRetweetHandler.bind(this)
    );

    const posts = await this._getPosts();

    posts.forEach((post) => {
      const postCard = new Post(post);
      newPostsArea.appendChild(postCard);
      this.postCards.push(postCard);
    });

    mainSectionContainer.appendChild(newPostsArea);
  }

  updatePostsArea() {
    // select prevPinnedPost
    const postCards = document.querySelectorAll("post-card");

    let prevPinnedPostNode;
    let currentPinnedPostNode;
    let updatedCurrentPinnedPostNode;

    postCards.forEach((post) => {
      if (this.patchPostResponse.prevPinnedPost) {
        if (
          post.postData._id.toString() ===
          this.patchPostResponse.prevPinnedPost._id
        ) {
          prevPinnedPostNode = post;
        }
      }
      if (
        post.postData._id.toString() ===
        this.patchPostResponse.currentPinnedPost._id
      ) {
        currentPinnedPostNode = post;
      }
    });

    if (this.patchPostResponse.prevPinnedPost) {
      const updatedPrevPinnedPostNode = new Post(
        this.patchPostResponse.prevPinnedPost
      );

      prevPinnedPostNode.replaceWith(updatedPrevPinnedPostNode);
    }

    updatedCurrentPinnedPostNode = new Post(
      this.patchPostResponse.currentPinnedPost
    );
    currentPinnedPostNode.replaceWith(updatedCurrentPinnedPostNode);
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
      const postsArea = document.querySelector(".posts-area");
      postsArea.prepend(postCard);
    });
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
    // let user = await fetch(`${env.BACKEND_BASE_URL}/user/profile`, {
    //   headers: {
    //     Authorization: `Bearer ${this.token}`,
    //   },
    // });

    // fetch(`${env.BACKEND_BASE_URL}/user/profile`, {
    //   headers: {
    //     Authorization: "Bearer " + this.token,
    //   },
    //   method: "GET",
    // }).then((response) => {
    //   console.log("done...");
    // });

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
