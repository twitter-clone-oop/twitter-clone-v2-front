import env from "../../env.js";

export class PostModal extends HTMLElement {
  constructor(action) {
    super();
    this.action = action;

    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous" />
      <link rel="stylesheet" href="assets/styles/fontawesome/css/all.css" />

      <style>

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

        
      </style>

      <div class="backdrop">backdrop</div>
      <div class="modal">
        <div class="modal-header">
          <h5 id="confirmPinModalLabel" class="modal-title">Pin this post?</h5>
        </div>
        <div class="modal-body">
          <p>This post will appear at the top of your profile. You can only pin one post.</p>
        </div>
        <div class="modal-footer">
          <button id="cancel-btn" class="btn btn-secondary" type="button">Cancel</button>
          <button id="confirm-btn" class="btn btn-primary" type="button">Pin</button>
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
    this.confirmButton.addEventListener(
      "click",
      this.confirmButtonHandler.bind(this)
    );
  }

  cancleButtonHandler(event) {
    this.hideModal();
  }

  confirmButtonHandler(event) {
    const modalConfirmEvent = new Event("confirm-modal");
    modalConfirmEvent.action = this.action;
    this.dispatchEvent(modalConfirmEvent);
  }

  showModal() {
    document.body.prepend(this);
  }

  hideModal() {
    document.body.removeChild(this);
  }
}

customElements.define("post-modal", PostModal);
