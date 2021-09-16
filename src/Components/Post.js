export class Post extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.buttons = "";

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

      .postActionContainer {}

      .post.largeFont .postBody,
      .post.largeFont .postFooter {}
      </style>

      <div class="post" data-id="postData._id">
        <div class="postActionContainer">
          <!-- retweet post -->
        </div>
        <div class="mainContentContainer">
          <div class="userImageContainer">
            <img src="src/Components/user.png">
          </div>
          <div class="postContentContainer">
            <!-- <div class="pinnedPostText"></div> -->
            <div class="header">
              <a href="user_profile_page_link" class="displayName">displayName</a>
              <span class="username">@username</span>
              <span class="date">timestamp</span>
              ${this.buttons}
            </div>
            <!-- replyFlag -->
            <div class="postBody">
              <span>post content</span>
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
                  <span>0</span>  <!-- reweetUsers.length -->
                </button>
              </div>
              <div class="postButtonContainer red">
                <button class="likeButton">
                  <i class="far fa-heart"></i>
                  <span>0</span> <!-- likes.length -->
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    `;
  }

  connectedCallbed() {}

  static createPostHTML(post) {}
}

customElements.define("post-card", Post);
