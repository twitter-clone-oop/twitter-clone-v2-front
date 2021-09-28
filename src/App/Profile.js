import env from "../../env.js";

export class Profile {
  constructor(profileUserId, userId, token) {
    this.profileUserId = profileUserId;
    this.userId = userId;
    this.token = token;

    this.followersCount;
    this.followingCount;

    this.profileUser = this.getUser(profileUserId);

    this.profilePage = `
    <div class="titleContainer">
      <h1 id="page-title">Profile</h1>
    </div>
    
    <div class="profileHeaderContainer">
      <div class="coverPhotoSection">
        <div class="coverPhotoContainer">

        </div>
        <div class="userImageContainer">
          <img src="" alt="">

        </div>
      </div>

      <div class="profileButtonsContainer">

      </div>
      <div class="userDetailsContainer">
        <span class="displyName"></span>
        <span class="username"></span>
        <span class="description"></span>

        <div class="followersContainer">
          <a href="/profile/profileUser.userName/following">
            <span class="value"></span>
            <span>Following</span>
          </a>
          <a href="/profile/profileUser.userName/followers">
            <span class="value" id="followersValue"></span>
            <span>Followers</span>
          </a>
        </div>
      </div>
    </div>

    <div class="tabsContainer">

    </div>

    <div class="pinnedPostContainer"></div>
    <div class="postsContainer"></div>


    `;

    this.wrapper = document.querySelector(".mainSectionContainer");
    this.wrapper.innerHTML = this.profilePage;
  }

  async getUser(id) {
    let response = await fetch(`${env.BACKEND_BASE_URL}/user/${id}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    response = await response.json();
    console.log(response);
    return response;
  }
}
