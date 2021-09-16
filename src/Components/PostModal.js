import env from "../../env.js";

export class PostModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <div class="modal-header">
        <h5 id="confirmPinModalLabel" class="modal-title">Pin this post?</h5>
        <button class="close" type="button" data-dismiss="modal" arial-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p>This post will appear at the top of your profile. You can only pin one post.</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
        <button id="pinPostButton" class="btn btn-primary" type="button">Pin</button>
      </div>
    `;
  }

  connectedCallback() {}
}

customElements.define("post-modal", PostModal);
