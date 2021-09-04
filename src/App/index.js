import { Navbar } from "../Components/Navbar.js";
import { PostForm } from "../Components/PostForm.js";

const postForm = document.querySelector("create-post-form");
postForm.addEventListener("create-post", () => {
  const content = postForm.getAttribute("data");

  // fetch("create post url", {
  //   method: "POST",
  //   body: {},
  // });
});
