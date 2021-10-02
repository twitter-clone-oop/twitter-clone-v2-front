import env from "../../env.js";
import { Post } from "../Components/Post.js";

export class Profile {
  constructor(profileUser, user, token) {
    this.profileUserId = profileUser._id;
    this.userId = user._id;
    this.token = token;
    this.profileUser = profileUser;
    this.user = user;

    console.log(profileUser);

    this.followersCount = profileUser.following.length;
    this.followingCount = profileUser.followers.length;

    this.coverPhotoButton = "";
    if (this.profileUserId === this.userId) {
      this.coverPhotoButton = `
      <button class="coverPhotoButton">
        <i class="fas fa-camera"></i>
      </button>
      `;
    }

    this.profilePictureButton = "";
    if (this.profileUserId === this.userId) {
      this.profilePictureButton = `
      <button class="profilePictureButton">
        <i class="fas fa-camera"></i>
      </button>
      `;
    }

    this.profileButtons = "";
    if (this.profileUserId !== this.userId) {
      this.profileButtons = `
      <a class="profileButton">
        <i class="fas fa-envelop"></i>
      </a>
      `;

      const isFollowing =
        this.user.following && this.user.following.includes(profileUserId);
      const buttonText = isFollowing ? "Following" : "Follow";
      const buttonClass = isFollowing
        ? "followButton following"
        : "followButton";
      if (isFollowing) {
        this.profileButtons += `
          <button class="${buttonClass}">${buttonText}</button>
        `;
      }
    }

    this.tabs = `
      <a class="tab posts-tab active">
        <span>Posts</span>
      </a>
      <a class="tab replies-tab">
        <span>Replies</span>
      </a>
    `;

    this.profilePage = `
    <div class="titleContainer">
      <h1 id="page-title">Profile</h1>
    </div>
    
    <div class="profileHeaderContainer">
      <div class="coverPhotoSection">
        <div class="coverPhotoContainer">
          ${this.coverPhotoButton}
          <img src="${env.BACKEND_BASE_URL}/${this.profileUser.coverPhoto}" alt="Cover Photo">
          
        </div>
        <div class="userImageContainer">
          ${this.profilePictureButton}
          <img src="${env.BACKEND_BASE_URL}/${this.profileUser.profilePic}" alt="Cover Photo">
        </div>
        
      </div>

      <div class="profileButtonsContainer">
        ${this.profileButtons}
      </div>

      <div class="userDetailsContainer">
        <span class="displayName">${this.profileUser.firstName} ${this.profileUser.lastName}</span>
        <span class="username">@${this.profileUser.userName}</span>
        <span class="description">?</span>

        <div class="followersContainer">
          <a href="/profile/profileUser.userName/following">
            <span class="value">${this.followingCount}</span>
            <span>Following</span>
          </a>
          <a href="/profile/profileUser.userName/followers">
            <span class="value" id="followersValue">${this.followersCount}</span>
            <span>Followers</span>
          </a>
        </div>
      </div>
    </div>

    <div class="tabsContainer">
      ${this.tabs}
    </div>

    <div class="pinnedPostContainer"></div>
    <div class="postsContainer"></div>


    `;

    this.wrapper = document.querySelector(".mainSectionContainer");
    this.wrapper.innerHTML = this.profilePage;

    this.loadPosts();

    this.selectedTab = "Posts";

    this.registerEvents();
  }

  async loadPosts() {
    //pinned post
    let url =
      `${env.BACKEND_BASE_URL}/post/posts?` +
      new URLSearchParams({ postedBy: this.profileUserId, pinned: true });

    let pinnedPostData = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    pinnedPostData = await pinnedPostData.json();

    const pinnedPostContainer = document.querySelector(".pinnedPostContainer");
    pinnedPostContainer.innerHTML = "";
    this.outputPosts(pinnedPostData, pinnedPostContainer);

    // posts
    url =
      `${env.BACKEND_BASE_URL}/post/posts?` +
      new URLSearchParams({ postedBy: this.profileUserId, isReply: false });

    let postsData = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    postsData = await postsData.json();

    postsData = postsData.filter((post) => {
      return post.pinned === false;
    });

    const postsContainer = document.querySelector(".postsContainer");
    postsContainer.innerHTML = "";
    this.outputPosts(postsData, postsContainer);
  }

  async loadReplies() {
    //load replies

    let url =
      `${env.BACKEND_BASE_URL}/post/posts?` +
      new URLSearchParams({
        postedBy: this.profileUserId,
        isReply: true,
      });

    let replies = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    replies = await replies.json();

    const pinnedPostContainer = document.querySelector(".pinnedPostContainer");
    pinnedPostContainer.innerHTML = "";
    const postsContainer = document.querySelector(".postsContainer");
    postsContainer.innerHTML = "";

    this.outputPosts(replies, postsContainer);
  }

  outputPosts(posts, container) {
    container.innerHTML = "";
    if (posts.length === 0) {
      return;
    }

    console.log(posts);
    console.log(typeof posts);

    posts.forEach((post) => {
      const postCard = new Post(post);
      container.appendChild(postCard);
    });
  }

  registerEvents() {
    const tabsContainer = document.querySelector(".tabsContainer");
    tabsContainer.addEventListener("click", this.tabSelectHandler.bind(this));
  }

  tabSelectHandler(event) {
    const selectedTabElement = event.target;
    this.selectedTab = selectedTabElement.innerText;

    const postTab = document.querySelector(".posts-tab");
    const repliesTab = document.querySelector(".replies-tab");

    if (this.selectedTab === "Posts") {
      postTab.classList.add("active");
      repliesTab.classList.remove("active");
      this.loadPosts();
    } else {
      postTab.classList.remove("active");
      repliesTab.classList.add("active");
      this.loadReplies();
    }
  }

  // async getUser(id) {
  //   let response = await fetch(`${env.BACKEND_BASE_URL}/user/${id}`, {
  //     headers: {
  //       Authorization: `Bearer ${this.token}`,
  //     },
  //   });

  //   response = await response.json();
  //   console.log(response);
  //   return response;
  // }
}
