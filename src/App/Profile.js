import env from "../../env.js";

export class Profile {
  constructor() {
    this.profilePage = `
    <div class="titleContainer">
      <h1 id="page-title">Profile</h1>
    </div>
    <h1>USER PROFILE PAGE CONTENT</h1>
    `;

    this.wrapper = document.querySelector(".mainSectionContainer");
    this.wrapper.innerHTML = this.profilePage;
  }
}
