# TWIXIO - Social Media Platform

## Description
**TWIXIO** is a dynamic web application developed with **advanced HTML, CSS, and JavaScript**, allowing users to register, log in, and interact with content by posting, commenting, and deleting their own posts. The app uses **Axios** for API calls and manages authentication via **JWT tokens** to ensure security and session handling.

## Key Features
- ✅ **Registration and Login** – Authentication system based on JWT tokens.
- ✅ **Post Management** – Create, view, and delete posts.
- ✅ **Post Comments** – Ability to comment on other users' posts.
- ✅ **Token Authentication** – API protection using JWT tokens.
- ✅ **Responsive Interface** – Adaptable design for desktop, tablet, and mobile.
- ✅ **API Calls with Axios** – Efficient backend communication.

## Technologies Used
- **Frontend:**
  - HTML5, CSS3 
  - JavaScript ES6+
  - Axios for API calls

## Installation and Setup
### 1. Clone the Repository
```bash
git clone https://github.com/aymaneKT/TWIXIO.git
```

### 2. Launch the Client Application
Open the `index.html` file in the browser or use Live Server.

## API Endpoints
Example API calls using Axios:

### Login
```javascript
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
    })
    .catch((error) => {
      showErrorAlert(error.response.data.message);
    })
    .finally(() => {
      togleLoader(false);
    });
}
```


## Contributions
If you would like to contribute, feel free to submit a **pull request** or open an **issue** for suggestions and improvements!
