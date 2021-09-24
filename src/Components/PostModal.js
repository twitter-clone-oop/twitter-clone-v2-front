import env from "../../env.js";
import { PostForm } from "./PostForm.js";

export class PostModal extends HTMLElement {
  constructor(
    action,
    modalTitle,
    modalContent,
    confirmButtonLabel,
    profilePic = null
  ) {
    super();
    this.action = action;

    this.attachShadow({ mode: "open" });

    this.confirmBtnClass;
    console.log(action);
    if (action === "pin") {
      this.confirmBtnClass = "btn-primary";
    } else if (action === "delete-post" || action == "unpin") {
      this.confirmBtnClass = "btn-danger";
    } else if (action === "reply") {
      this.confirmBtnClass = "btn-primary";
    }

    this.modalContent = `<p>${modalContent}</p>`;

    if (action === "reply") {
      this.modalContent = `
        <div id="originalPostContainer"></div>
        <div class="postFormContainer">
          <div class="userImageContainer"><img src="${profilePic}" alt="User's profile pictur"/></div>
          <div class="textareaContainer">
            <textarea id="replyTextarea" placeholder="What's happening?"></textarea>
          </div>
        </div>
      `;
    }

    this.replyTextarea;

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous" />
      <link rel="stylesheet" href="assets/styles/fontawesome/css/all.css" />

      <style>


        .modal {
          animation: fadein 1s;
          -webkit-animation: fadein 1s;
          -webkit-transition: all 1s ease-in-out;
          transition: all 1s ease-in-out;
        }

        @keyframes fadein {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @-webkit-keyframse fadein {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .backdrop {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 10;
          background-color: rgba(0, 0, 0, 0.75);
          width: 100%;
          height: 100vh;
        }

        .modal {
          position: fixed;
          z-index: 11;
          top: 10vh;
          left: 25%;
          width: 50%;
          height: 40%;
          border-radius: 5px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: white;
          transition: all 0.5s ease-out;
        }
        
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


        
      </style>

      <div class="backdrop">backdrop</div>
      <div class="modal">
        <div class="modal-header">
          <h5 id="confirmPinModalLabel" class="modal-title">${modalTitle}</h5>
        </div>
        <div class="modal-body">
          ${this.modalContent}
        </div>
        <div class="modal-footer">
          <button id="cancel-btn" class="btn btn-secondary" type="button">Cancel</button>
          <button id="confirm-btn" class="btn ${this.confirmBtnClass}" type="button">${confirmButtonLabel}</button>
        </div>
      </div>
    `;

    this.showModal();

    this.cancelButton;
    this.confirmButton;
  }

  connectedCallback() {
    this.cancelButton = this.shadowRoot.querySelector("#cancel-btn");
    this.cancelButton.addEventListener(
      "click",
      this.cancleButtonHandler.bind(this)
    );

    this.confirmButton = this.shadowRoot.querySelector("#confirm-btn");
    if (this.action === "reply") {
      this.confirmButton.disabled = true;
    }

    this.confirmButton.addEventListener(
      "click",
      this.confirmButtonHandler.bind(this)
    );

    this.replyTextarea = this.shadowRoot.querySelector("#replyTextarea");
    this.replyTextarea.addEventListener("keyup", this.keyupHandler.bind(this));
  }

  cancleButtonHandler(event) {
    this.hideModal();
  }

  confirmButtonHandler(event) {
    const modalConfirmEvent = new Event("confirm-modal");
    modalConfirmEvent.action = this.action;

    if (event.target.textContent === "Reply") {
      modalConfirmEvent.content =
        this.shadowRoot.querySelector("#replyTextarea").value;
    }

    this.dispatchEvent(modalConfirmEvent);
  }

  keyupHandler(event) {
    if (this.replyTextarea.value !== "") {
      this.confirmButton.disabled = false;
    } else {
      this.confirmButton.disabled = true;
    }
  }

  showModal() {
    document.body.prepend(this);
  }

  hideModal() {
    document.body.removeChild(this);
  }
}

customElements.define("post-modal", PostModal);
