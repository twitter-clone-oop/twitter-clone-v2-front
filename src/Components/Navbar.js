export class Navbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous" />
      <link rel="stylesheet" href="assets/styles/fontawesome/css/all.css" />
      <style>
        nav {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          height: 100%;
        }

        nav a {
          padding: 10px;
          font-size: 3rem;
          width: 5rem;
          height: 5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #212529;
        }

        nav a:hover{
          background-color: var(--buttonHoverBg);
          color: var(--blue);
          border-radius: 50%;
        }
      </style>
      <nav>
        <a id="nav-home">
          <i class="fas fa-dove"></i>
        </a>
        <a>
          <i class="fas fa-search"></i>
        </a>
        <a>
          <i class="fas fa-bell"></i>
        </a>
        <a>
          <i class="fas fa-envelope"></i>
        </a>
        <a id="nav-profile">
          <i class="fas fa-user"></i>
        </a>
        <a>
          <i class="fas fa-sign-out-alt"></i>
        </a>
      </nav>
    `;
  }

  connectedCallback() {
    this.shadowRoot
      .querySelector("#nav-home")
      .addEventListener("click", this.navHomeHandler.bind(this));

    this.shadowRoot
      .querySelector("#nav-profile")
      .addEventListener("click", this.navProfileHandler.bind(this));
  }

  navHomeHandler() {
    const navHomeEvent = new Event("nav-home", { bubbles: true });
    this.dispatchEvent(navHomeEvent);
  }

  navProfileHandler() {
    console.log("Pro");
    const navProfileEvent = new Event("nav-profile", { bubbles: true });
    this.dispatchEvent(navProfileEvent);
  }
}

customElements.define("nav-bar", Navbar);
