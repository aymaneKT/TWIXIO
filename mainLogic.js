function showSuccesAlert(text) {
  document.getElementsByClassName("SucessAlert")[0].innerHTML = text;
  document.getElementsByClassName("SucessAlert")[0].style.top = "2vh";
  setTimeout(() => {
    document.getElementsByClassName("SucessAlert")[0].style.position = "fixed";
    document.getElementsByClassName("SucessAlert")[0].style.top = "-10vh";
  }, 1000);
}
function showErrorAlert(text) {
  document.getElementsByClassName("ErrorAlert")[0].innerHTML = text;
  document.getElementsByClassName("ErrorAlert")[0].style.top = "2vh";
  setTimeout(() => {
    document.getElementsByClassName("ErrorAlert")[0].style.position = "fixed";
    document.getElementsByClassName("ErrorAlert")[0].style.top = "-10vh";
  }, 1000);
}
function configShow(data) {
  let content = document.getElementsByClassName("main-container")[0];
  let dataLow = data.toLowerCase();
  if (dataLow.includes("login")) {
    content.innerHTML = `
        <div class="login-form" id="login-form">
                <div class="head">
                    <h1>Login</h1>
                    <div class="username-input">
                        <input type="text" id="login-username" placeholder="Username">
                    </div>
                    <div class="password-input">
                        <input type="password" id="login-password" placeholder="Password">
                    </div>
                    <div class="password-action">
                        <div class="show-password">
                            <input type="checkbox" id="show-password" onclick="showPassword()">
                            <label for="show-password">Show Password</label>
                        </div>
                        <a href="#">Forgot Password?</a>
                    </div>
                    <button onclick="login()">Login</button>
                    <div class="create-acc">
                        <p>Don't have an account?</p><a onclick="configShow('register')">Sign up</a>
                    </div>
                </div>
            </div>`;
  } else if (dataLow.includes("register")) {
    content.innerHTML = `
        <div class="register-form" id="register-form"> 
                <div class="head">
                    <h1>Register</h1>
                    <div class="username-input">
                        <input type="text" id="register-username" placeholder="Username">
                    </div>
                    <div class="name-input">
                        <input type="text" id="register-name" placeholder="Name">
                    </div>
                    <div class="email-input">
                        <input type="email" id="register-email" placeholder="Email">

                    </div>
                    <div class="password-input">
                        <input type="password" id="register-password" placeholder="Password">
                    </div>
                    <div class="photo-input">
                        <input type="file" id="register-image" accept="image/*">
                        <label for="register-image" class="photo-label">
                            <span class="upload-icon">📷</span> Upload Photo
                        </label>
                    </div>
                    <button onclick="Register()">Register</button>
                    <div class="already-acc">
                        <p>Already have an account?</p><a onclick="configShow('login')" >Login</a>
                    </div>
                </div>
            </div>
        `;
  } else if (dataLow.includes("home")) {
    window.location.href = "../HomePage/index.html";
    getPosts();
  }
}
function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  setupUi();
  showErrorAlert("Logout Successfully");
}

function showPassword() {
  let check = document.getElementById("login-password");
  if (check.type === "password") {
    check.type = "text";
  } else {
    check.type = "password";
  }
}
function login() {
  let password = document.getElementById("login-password").value;
  let username = document.getElementById("login-username").value;
  const params = {
    username: username,
    password: password,
  };
  togleLoader(true);
  axios
    .post(`${baseUrl}login`, params)
    .then((response) => {
      let abstractDate = response.data;
      localStorage.setItem("token", abstractDate.token);
      localStorage.setItem("user", JSON.stringify(abstractDate.user));
      showSuccesAlert("Login Succeeded");
      getPosts();
      setupUi();
    })
    .catch((error) => {
      showErrorAlert(error.response.data.message);
    })
    .finally(() => {
      togleLoader(false);
    });
}
function Register() {
  const username = document.getElementById("register-username").value;
  const password = document.getElementById("register-password").value;
  const image = document.getElementById("register-image").files[0];
  const name = document.getElementById("register-name").value;
  const email = document.getElementById("register-email").value;

  let formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("image", image);
  formData.append("name", name);
  formData.append("email", email);
  togleLoader(true);
  axios
    .post(`${baseUrl}register`, formData)
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      getPosts();
      showSuccesAlert("Registration Success");
      setupUi();
    })
    .catch((errore) => {
      showErrorAlert(errore.response.data.message);
    })
    .finally(() => {
      togleLoader(false);
    });
}
function GetCurrentUser() {
  let user = null;
  const storage = localStorage.getItem("user");

  if (storage != null) {
    user = JSON.parse(storage);
  }
  return user;
}
function setupUi() {
  let token = localStorage.getItem("token");

  if (token === null) {
    document.getElementById("Logout-btn").style.display = "none";
    document.getElementById("Login-btn").style.display = "flex";
    document.getElementById("Register-btn").style.display = "flex";
    document.getElementById("Profile-btn").style.display = "none";
    document.getElementById("add-post").style.display = "none";
    closeNewPost();
  } else {
    document.getElementById("add-post").style.display = "block";
    document.getElementById("Register-btn").style.display = "none";
    document.getElementById("Logout-btn").style.display = "flex";
    document.getElementById("Login-btn").style.display = "none";
    document.getElementById("Profile-btn").style.display = "flex";
  }
}
setupUi();
function deletePost(id) {
  let URL = `${baseUrl}posts/${id}`;
  let userToken = localStorage.getItem("token");
  togleLoader(true);
  let header = {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  };
  axios
    .delete(URL, header)
    .then(() => {
      showSuccesAlert("Post Removed");
      getPosts();
      closeNewPost();
      scrollTop();
    })
    .catch((error) => {
      showErrorAlert(error.response.data.message);
    })
    .finally(() => {
      togleLoader(false);
    });
}
function checkOpenPost(id, obj = null) {
  let OBJ = JSON.parse(decodeURIComponent(obj));

  if (id === "edit") {
    document.getElementsByClassName("create-post")[0].innerHTML = `
                    <button onclick="closeNewPost()" class="close-btn" id="close-btn">X</button>
                    <h2>Edit The Post</h2>
                    <input type="text" id="title" placeholder="Post Title" value="${OBJ.title}">
                    <textarea id="body" placeholder="Post Body">${OBJ.body}</textarea>
                    <input type="file" id="image">
                    <button onclick="createNewPost()" class="submit-btn">Edit Post</button>
        `;
    helper = OBJ.id;
  } else if (id.includes("add")) {
    document.getElementsByClassName("create-post")[0].innerHTML = `
                    <button onclick="closeNewPost()" class="close-btn" id="close-btn">X</button>
                    <h2>Create a New Post</h2>
                    <input type="text" id="title" placeholder="Post Title">
                    <textarea id="body" placeholder="Post Body"></textarea>
                    <input type="file" id="image">
                    <button onclick="createNewPost()" class="submit-btn">Submit Post</button>
        `;
  } else if (id == "remove") {
    document.getElementsByClassName("create-post")[0].innerHTML = `
                <div class="popup" id="popup">
                 <div class="popup-content">
                <h2>Confirm Deletion</h2>
                <p>Are you sure you want to delete this post?</p>
                <button id="confirmDelete" onclick="deletePost(${OBJ.id})">Yes, Delete</button>
                <button id="cancelDelete" onclick="closeNewPost()">Cancel</button>
                </div>
                </div>
        `;
  }

  openNewPost();
}
let helper = null;
function openNewPost() {
  let window = document.getElementsByClassName("create-post")[0];
  window.style.position = "fixed";
  window.style.top = "10px";
}
function closeNewPost() {
  let window = document.getElementById("create-post");
  window.style.top = "-100vh";
}

function createNewPost() {
  const title = document.getElementById("title").value;
  const body = document.getElementById("body").value;
  const image = document.getElementById("image").files[0];

  let formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  formData.append("image", image);

  togleLoader(true);
  let header = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  let url = "";
  if (helper === null) {
    url = `${baseUrl}posts`;
    axios
      .post(url, formData, header)
      .then(() => {
        scrollTop();
        getPosts();
        showSuccesAlert("Post Published");
        closeNewPost();
      })
      .catch((error) => {
        showErrorAlert(error.response.data.message);
      });
  } else {
    formData.append("_method", "put");
    url = `${baseUrl}posts/${helper}`;
    axios
      .post(url, formData, header)
      .then(() => {
        getPosts();
        scrollTop();
        showSuccesAlert("Post Aggiornato");
        closeNewPost();
      })
      .catch((error) => {
        showErrorAlert(error.response.data.message);
      });
  }
  togleLoader(false);
}
function showProfile(id) {
  window.location.href = `../ProfileHtml/index.html?userId=${id}`;
}
function ProfileClicked() {
  const user = GetCurrentUser();
  window.location.href = `./ProfileHtml/index.html?userId=${user.id}`;
}

function togleLoader(show = true) {
  if (show) document.getElementById("togle").style.visibility = "visible";
  else document.getElementById("togle").style.visibility = "hidden";
}

function scrollTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}
