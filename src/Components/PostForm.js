import env from "../../env.js";

export class PostForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.token = sessionStorage.getItem("token");
    this.userId = sessionStorage.getItem("userId");

    this.postTextarea;
    this.profileImageTag;

    this.shadowRoot.innerHTML = `
    <style>
      .postFormContainer {
        display: flex;
        padding: var(--spacing);
        border-bottom: 10px solid rgb(230, 236, 240);
        flex-shrink: 0;
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

      .textareaContainer {
        flex: 1;
        padding-left: var(--spacing)
      }

      .textareaContainer textarea {
        width: 100%;
        border: none;
        resize: none;
        font-size: 19px;
      }

      #submitPostButton {
        background-color: var(--blue);
        color: #fff;
        border: none;
        border-radius: 40px;
        padding: 7px 15px;
      }

      #submitPostButton:disabled {
        background-color: var(--blueLight);
      }
    </style>
    
    <div class="postFormContainer">
      <div class="userImageContainer">
        <slot><img src="src/Components/user.png"></slot>
      </div>
      <div class="textareaContainer">
        <textarea id="postTextarea" placeholder="What's happening?"></textarea>
        <button id="submitPostButton" disabled>Post</button>
      </div> 
    </div>
    `;
  }

  connectedCallback() {
    this.postTextarea = this.shadowRoot.querySelector("#postTextarea");
    this.postButton = this.shadowRoot.querySelector("#submitPostButton");

    this.postTextarea.addEventListener("keyup", (event) => {
      const value = this.postTextarea.value.trim();
      if (value === "") {
        return this.postButton.setAttribute("disabled", "");
      }
      this.postButton.removeAttribute("disabled");
    });

    this.profileImageTag = this.shadowRoot.querySelector(
      ".userImageContainer img"
    );
    this.profileImageUrl = this.getAttribute("profile-image-url");
    this._fetchProfilePic(this.profileImageUrl);

    this.postButton.addEventListener("click", this._postPostHandler.bind(this));
  }

  async _postPostHandler() {
    const content = this.postTextarea.value;

    const post = {
      content,
    };

    let response = await fetch(`${env.BACKEND_BASE_URL}/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(post),
    });

    this.postTextarea.value = "";

    response = await response.json();
    this._dispatchCreatePostEvent(response);

    //update posts list of the Main layout
  }

  async _fetchProfilePic(path) {
    this.profileImageTag.setAttribute("src", `${env.BACKEND_BASE_URL}${path}`);
    //fetch pic
    //set pic to div
  }

  _dispatchCreatePostEvent(post) {
    const createPostEvent = new Event("create-post");
    createPostEvent.post = post;
    this.setAttribute("data", this.postTextarea.value);
    this.dispatchEvent(createPostEvent);
  }

  _fetchProfileImage() {}
}

customElements.define("create-post-form", PostForm);
