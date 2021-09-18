import env from "../../env.js";
import { timeDifference } from "../Utility/time.js";

export class Post extends HTMLElement {
  constructor(postData) {
    super();
    this.attachShadow({ mode: "open" });

    this.buttons = "";
    this.pinnedPostText = "";

    this.pinButton;

    this.states = this.getStates();

    console.log(postData);

    if (postData.postedBy._id.toString() === this.states.userId.toString()) {
      let pinnedClass = "";

      if (postData.pinned === true) {
        pinnedClass = "active";
        this.pinnedPostText = `
          <i class="fas fa-thumbtack"></i> <span>Pinned post</span>
        `;
      } else {
        pinnedClass = "";
        this.pinnedPostText = "";
      }

      this.buttons = `
        <button class="pinButton ${pinnedClass}" data-id="${postData._id}">
          <i class="fas fa-thumbtack"></i>
        </button>
      `;
    }

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
    

      .postActionContainer {}

      .post.largeFont .postBody,
      .post.largeFont .postFooter {}
      </style>

      <div class="post" data-id="${postData._id}">
        <div class="postActionContainer">
          <!-- retweet post -->
        </div>
        <div class="mainContentContainer">
          <div class="userImageContainer">
            <img src="${env.BACKEND_BASE_URL}/${postData.postedBy.profilePic}">
          </div>
          <div class="postContentContainer">
            <div class="pinnedPostText">${this.pinnedPostText}</div>
            <div class="header">
              <a href="user_profile_page_link" class="displayName">${
                postData.postedBy.firstName
              } ${postData.postedBy.lastName}</a>
              <span class="username">@${postData.postedBy.userName}</span>
              <span class="date">${timeDifference(
                new Date(),
                new Date(postData.createdAt)
              )}</span>
              ${this.buttons}
            </div>
            <!-- replyFlag -->
            <div class="postBody">
              <span>${postData.content}</span>
            </div>
            <div class="postFooter">
              <div class="postButtonContainer">
                <button data-toggle="modal" data-target="replyModal">
                  <i class="far fa-comment"></i>
                </button>
              </div>
              <div class="postButtonContainer green">
                <button class="retweetButton">
                  <i class="fas fa-retweet"></i>
                  <span>${
                    postData.retweetUsers.length
                  }</span>  <!-- reweetUsers.length -->
                </button>
              </div>
              <div class="postButtonContainer red">
                <button class="likeButton">
                  <i class="far fa-heart"></i>
                  <span>${postData.likes.length}</span> <!-- likes.length -->
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
  }

  pinPostHandler(event) {
    const pinPostEvent = new Event("pin-post", { bubbles: true });
    this.dispatchEvent(pinPostEvent);
  }

  static createPostHTML(post) {}

  getStates() {
    return {
      token: sessionStorage.getItem("token"),
      userId: sessionStorage.getItem("userId"),
    };
  }
}

customElements.define("post-card", Post);
