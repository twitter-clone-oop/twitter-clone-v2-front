class PostForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
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
}

customElements.define("create-post-form", PostForm);
