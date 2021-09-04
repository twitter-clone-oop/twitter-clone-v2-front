import { Navbar } from "../Components/Navbar.js";
import { PostForm } from "../Components/PostForm.js";

const postForm = document.querySelector("create-post-form");
postForm.addEventListener("create-post", () => {
  console.log("create post btn clicked");
});
