import env from "../../env.js";
import { timeDifference } from "../Utility/time.js";
import { PostModal } from "./PostModal.js";

export class Post extends HTMLElement {
  constructor(postData) {
    super();
    this.attachShadow({ mode: "open" });

    this.states = this.getStates();

    this.userProfile;
    this.getUserProfile();

    this.postData = postData;

    this.buttons = "";
    this.pinnedClass = "";
    this.pinnedPostText = "";

    this.pinButton;

    this.deleteButton;

    this.states = this.getStates();

    this.patchPostResponse;

    //pin

    if (postData.postedBy._id.toString() === this.states.userId.toString()) {
      if (postData.pinned === true) {
        this.pinnedClass = "active";
        this.pinnedPostText = `
          <i class="fas fa-thumbtack"></i> <span>Pinned post</span>
        `;
      } else {
        this.pinnedClass = "";
        this.pinnedPostText = "";
      }

      this.buttons = `
        <button class="pinButton ${this.pinnedClass}" data-id="${postData._id}">
          <i class="fas fa-thumbtack"></i>
        </button>
        <button class="deleteButton" datqa-id=${postData._id}>
          <i class="fas fa-times"></i>
        </button>
      `;
    }

    //reply

    this.replyButton;
    this.replyFlag = "";
    if (postData.replyTo && postData.replyTo._id) {
      const replyToUsername = postData.replyTo.postedBy.userName;

      this.replyFlag = `
        <div class="replyFlag">
          Replying to <a href="/profile/${replyToUsername}">@${replyToUsername}</a>
        </div>
      `;
    }

    // like

    this.likeButtonActiveClass = postData.likes.includes(this.states.userId)
      ? "active"
      : "";
    this.likeCount = postData.likes.length === 0 ? "" : postData.likes.length;
    this.likeButton;

    // retweet

    this.isRetweet = this.postData.retweetData !== undefined;
    // this.isRetweet = this.postData.retweetData !== null;
    this.retweetedBy = this.isRetweet ? postData.postedBy.userName : "";
    this.postData = this.isRetweet ? postData.retweetData : postData;

    this.postData._id = postData._id;

    this.retweetButtonActiveClass =
      this.postData.retweetUsers &&
      this.postData.retweetUsers.includes(this.states.userId)
        ? "active"
        : "";

    let retweetText = "";
    if (this.isRetweet) {
      retweetText = `
        <span>
          <i class="fas fa-retweet"></i>
          Retweeted by <a href="${env.BACKEND_BASE_URL}/profile/${this.retweetedBy}">@${this.retweetedBy}</a>
        </span>
      `;
    }

    this.retweetCount =
      this.postData.retweetUsers && this.postData.retweetUsers.length !== 0
        ? this.postData.retweetUsers.length
        : "";

    this.retweetButton;

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous" />
      <link rel="stylesheet" href="assets/styles/fontawesome/css/all.css" />

      <style>
      button {
        background-color: transparent;
        border: none;
        color: var(--grayButtonText)
      }

      button i,
      button span {
        pointer-events: none;
      }

      button:focus {
        outline:none;
        box-shadow: none;
      }


      .userImageContainer {
        width: 50px;
        height: 50px;
      }

      .userImageContainer img {
        width: 100%;
        border-radius: 50%;
        background-color: #fff;
      }

      .post {
        disply: flex;
        flex-direction: column;
        padding: var(--spacing);
        cursor: pointer;
        border-bottom: 1px solid var(--lightGrey);
        flex-shrink: 0;
      }

      .mainContentContainer {
        flex: 1;
        display: flex;
        overflow-y: hidden;
      }

      .postContentContainer {
        padding-left: var(--spacing);
        display: flex;
        flex-direction: column;
        flex: 1;
      }

      .postContentContainer .header {
        display: flex;
      }
      .postContentContainer .header .date {
        flex: 1;
      }

      .username,
      .date {
        color: var(--grayText);
      }

      .displayName {
        font-weight: bold;
      }

      .postFooter {
        display: flex;
        align-items: center;
      }

      .postFooter .postButtonContainer {
        flex: 1;
        display: flex;
      }

      .postFooter .postButtonContainer button {
        padding: 0 5px;
      }

      .header a:hover {
        text-decoration: underline;
      }

      .header a,
      .header span {
        padding-right: 5px;
      }
      
      .postButtonContainer button:hover {
        background-color: #d4edff;
        color: var(--blue);
        border-radius: 50%;
      }

      .postButtonContainer.red button:hover {
        color: var(--red);
        background-color: var(--redBackground);
      }

      .postButtonContainer.green button:hover {
        color: var(--green);
        background-color: var(--greenBackground);
      }

      .pinButton.active {
        color: var(--blue);
      }

      .pinPostText {
        font-size: 12px;
        color: var(--grayText);
      } 

      .postButtonContainer.red button.active {
        color: var(--red);
      }

      .postButtonContainer.green button.active {
        color: var(--green);
      }

      .postActionContainer {}

      .post.largeFont .postBody,
      .post.largeFont .postFooter {}

      </style>

      <div class="post" data-id="${this.postData._id}">
        <div class="postActionContainer">
          ${retweetText}
        </div>
        <div class="mainContentContainer">
          <div class="userImageContainer">
            <img src="${env.BACKEND_BASE_URL}/${
      this.postData.postedBy.profilePic
    }">
          </div>
          <div class="postContentContainer">
            <div class="pinnedPostText">${this.pinnedPostText}</div>
            <div class="header">
              <a href="user_profile_page_link" class="displayName">${
                this.postData.postedBy.firstName
              } ${this.postData.postedBy.lastName}</a>
              <span class="username">@${this.postData.postedBy.userName}</span>
              <span class="date">${timeDifference(
                new Date(),
                new Date(this.postData.createdAt)
              )}</span>
              ${this.buttons}
            </div>
            ${this.replyFlag}
            <div class="postBody">
              <span>${this.postData.content}</span>
            </div>
            <div class="postFooter">
              <div class="postButtonContainer">
                <button class="replyButton">
                  <i class="far fa-comment"></i>
                </button>
              </div>
              <div class="postButtonContainer green">
                <button class="retweetButton ${this.retweetButtonActiveClass}">
                  <i class="fas fa-retweet"></i>
                  <span>${this.retweetCount}</span>  <!-- reweetUsers.length -->
                </button>
              </div>
              <div class="postButtonContainer red">
                <button class="likeButton ${this.likeButtonActiveClass}">
                  <i class="far fa-heart"></i>
                  <span>${this.likeCount}</span> <!-- likes.length -->
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    this.pinButton = this.shadowRoot.querySelector(".pinButton");
    this.pinButton.addEventListener("click", this.pinPostHandler.bind(this));

    this.deleteButton = this.shadowRoot.querySelector(".deleteButton");
    this.deleteButton.addEventListener(
      "click",
      this.deletePostHandler.bind(this)
    );

    this.likeButton = this.shadowRoot.querySelector(".likeButton");
    this.likeButton.addEventListener("click", this.likeHandler.bind(this));

    this.retweetButton = this.shadowRoot.querySelector(".retweetButton");
    this.retweetButton.addEventListener(
      "click",
      this.retweetHandler.bind(this)
    );

    this.replyButton = this.shadowRoot.querySelector(".replyButton");
    this.replyButton.addEventListener("click", this.replyHandler.bind(this));
  }

  unpinPost() {
    this.pinButton.classList.remove("active");
    this.shadowRoot.querySelector(".pinnedPostText").innerHTML = "";

    //for profile page
    // const postsContainer = document.querySelector(".postsContainer");
    // if (postsContainer) {
    //   this.remove();
    //   const unpinnedNode;
    //   postsContainer.prepend(unpinnedNode);
    // }
  }

  async likeHandler(event) {
    let post = await fetch(
      `${env.BACKEND_BASE_URL}/post/${this.postData._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.states.token}`,
        },
        body: JSON.stringify({ action: "like" }),
      }
    );

    post = await post.json();

    const likeCountSpan = this.shadowRoot.querySelector(".likeButton span");
    likeCountSpan.textContent = post.likes.length || "";

    if (post.likes.includes(this.states.userId)) {
      this.likeButton.classList.add("active");
    } else {
      this.likeButton.classList.remove("active");
    }
  }

  async retweetHandler(event) {
    const postId = this.postData._id;

    if (!postId) return;

    const isRetweet = !event.target.classList.contains("active");

    let response = await fetch(`${env.BACKEND_BASE_URL}/post/${postId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.states.token}`,
      },
      body: JSON.stringify({ action: "retweet" }),
    });

    response = await response.json();

    const post = response.post;
    const repost = response.repost;

    const retweetCountSpan = this.shadowRoot.querySelector(
      ".retweetButton span"
    );
    retweetCountSpan.innerText = post.retweetUsers.length || "";

    if (post.retweetUsers.includes(this.states.userId)) {
      //retweet
      this.retweetButton.classList.add("active");

      const postCard = new Post(repost);
      const postsArea =
        document.querySelector(".posts-area") ||
        document.querySelector(".postsContainer");
      postsArea.prepend(postCard);
    } else {
      // un-retweet
      this.retweetButton.classList.remove("active");

      const deleteTargetPostId = repost._id;
      //get postCards
      let postCards = document.querySelectorAll("post-card");

      let deleteTargetPostCard;
      postCards.forEach((post) => {
        if (post.postData._id.toString() === deleteTargetPostId.toString()) {
          deleteTargetPostCard = post;
        }
      });

      deleteTargetPostCard.remove();
    }
  }

  replyHandler(evnet) {
    const replyTo = this.postData._id;
    const originalPostData = this.postData;

    const replyModal = new PostModal(
      "reply",
      "Reply",
      "",
      "Reply",
      `${env.BACKEND_BASE_URL}/${this.userProfile.profilePic}`,
      originalPostData
    );

    document
      .querySelector("post-modal")
      .addEventListener(
        "confirm-modal",
        this.modalConfirmHandler.bind(this, replyTo)
      );
  }

  getStates() {
    return {
      token: sessionStorage.getItem("token"),
      userId: sessionStorage.getItem("userId"),
    };
  }

  pinPostHandler(event) {
    const postId = this.shadowRoot.querySelector(".post").dataset.id;

    const isUnpinAction = event.target.classList.contains("active");
    if (!isUnpinAction) {
      //pin action
      const postModal = new PostModal(
        "pin",
        "Pin this post?",
        "This post will appear at the top of your profile. You can only pin one post.",
        "Pin"
      );
    } else {
      //unpin action
      const postModal = new PostModal(
        "unpin",
        "Unpin this post?",
        "This post will be unpinned from your profile page.",
        "Unpin"
      );
    }

    document
      .querySelector("post-modal")
      .addEventListener(
        "confirm-modal",
        this.modalConfirmHandler.bind(this, postId)
      );
  }

  deletePostHandler(event) {
    //show modal
    const postId = this.shadowRoot.querySelector(".post").dataset.id;

    const deletePostModal = new PostModal(
      "delete-post",
      "Delete this post?",
      "This post will be deleted.",
      "Delete" //button color -> red
    );

    document
      .querySelector("post-modal")
      .addEventListener(
        "confirm-modal",
        this.modalConfirmHandler.bind(this, postId)
      );
  }

  async modalConfirmHandler(postId, event) {
    if (event.action === "pin") {
      //pin the post
      try {
        let patchPostResponse = await fetch(
          `${env.BACKEND_BASE_URL}/post/${postId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.states.token}`,
            },
            body: JSON.stringify({ action: "pin", filter: { pinned: true } }),
          }
        );
        this.patchPostResponse = await patchPostResponse.json();

        event.target.remove();

        this.updatePostsArea(event.action);
      } catch (error) {
        console.log(error);
      }
    } else if (event.action === "unpin") {
      let patchPostResponse = await fetch(
        `${env.BACKEND_BASE_URL}/post/${postId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.states.token}`,
          },
          body: JSON.stringify({ action: "unpin" }),
        }
      );
      this.patchPostResponse = await patchPostResponse.json();

      event.target.remove();
      this.updatePostsArea(event.action);
    } else if (event.action === "delete-post") {
      //delete the post
      let deletedPostId = await fetch(
        `${env.BACKEND_BASE_URL}/post/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${this.states.token}`,
          },
        }
      );
      deletedPostId = await deletedPostId.json();
      deletedPostId = deletedPostId.deletedPostId;

      event.target.remove();

      this.remove();
    } else if (event.action === "reply") {
      const replyTo = postId;
      const content = event.content;
      let response = await fetch(`${env.BACKEND_BASE_URL}/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.states.token}`,
        },
        body: JSON.stringify({ action: event.action, replyTo, content }),
      });

      response = await response.json();
      event.target.remove();
      // call func with post

      this.updatePostsArea(event.action, response.createdPost);
    }
  }

  updatePostsArea(action, post = null) {
    const postCards = document.querySelectorAll("post-card");
    if (action === "pin") {
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

      //for profile page
      const pinnedPostContainer = document.querySelector(
        ".pinnedPostContainer"
      );

      if (!pinnedPostContainer) {
        //home page
        currentPinnedPostNode.replaceWith(updatedCurrentPinnedPostNode);
      }

      if (pinnedPostContainer) {
        //profile page
        pinnedPostContainer.hidden = false;
        currentPinnedPostNode.remove();
        pinnedPostContainer.appendChild(updatedCurrentPinnedPostNode);
      }
    } else if (action === "unpin") {
      let unpinnedPostNode;

      postCards.forEach((post) => {
        if (
          post.postData._id.toString() ===
          this.patchPostResponse.unpinnedPost._id
        ) {
          unpinnedPostNode = post;
        }
      });

      console.log(unpinnedPostNode);

      //for profile page
      const postsContainer = document.querySelector(".postsContainer");
      if (!postsContainer) {
        //home page
        unpinnedPostNode.unpinPost();
      }

      if (postsContainer) {
        unpinnedPostNode.remove();
        console.log("patchPostResponse", this.patchPostResponse);
        unpinnedPostNode = new Post(this.patchPostResponse.unpinnedPost);

        postsContainer.prepend(unpinnedPostNode);
      }
    } else if (action === "reply") {
      const replyPost = new Post(post);
      document.querySelector(".posts-area").prepend(replyPost);
    }
  }

  getStates() {
    return {
      token: sessionStorage.getItem("token"),
      userId: sessionStorage.getItem("userId"),
    };
  }

  async getUserProfile() {
    this.userProfile = await this.fetchUserProfile();
  }

  async fetchUserProfile() {
    let user = await fetch(`${env.BACKEND_BASE_URL}/user/profile`, {
      headers: {
        Authorization: "Bearer " + this.states.token,
      },
      method: "GET",
    });

    user = await user.json();
    return user;
  }
}

customElements.define("post-card", Post);
