const baseUrl = "https://tarmeezacademy.com/api/v1/";
let Page = 1;
let LastPage = 1;

getPosts();

window.addEventListener("scroll", () => {
  const endOfPage =
    window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;

  if (endOfPage && Page <= LastPage) {
    Page++;
    getPosts(false, Page);
  }
});

function getPosts(reload = true, currentPage = 1) {
  togleLoader(true);
  axios.get(`${baseUrl}posts?limit=5&page=${currentPage}`).then((response) => {
    togleLoader(false);
    let abstractDate = response.data.data;
    LastPage = response.data.meta.last_page;
    if (reload) {
      document.getElementsByClassName("main-container")[0].innerHTML = "";
    }

    let content = "";

    for (const info of abstractDate) {
      if (info.title === null || info.title === undefined) {
        info.title = "";
      }

      let tags = "";
      let user = GetCurrentUser();
      let btnEdit = "";

      let isMyPost = user !== null && info.author.id === user.id;

      for (const tag of info.tags) {
        tags += `<span class="tag">#${tag.name} #${tag.arabic_name}</span>`;
      }
      if (isMyPost) {
        btnEdit = `
                <div class="edit-remove">
                    <div class="editButton" onclick="checkOpenPost('edit','${encodeURIComponent(
                      JSON.stringify(info)
                    )}')"> 
                                <i class="fa-solid fa-pen-to-square"></i>
                                EDIT
                    </div>
                    <div class="removeButton id="remove" onclick="checkOpenPost('remove','${encodeURIComponent(
                      JSON.stringify(info)
                    )}')"> 
                                <i class="fa-solid fa-trash"></i>
                                REMOVE
                    </div>
                </div>
                `;
      }

      content = `
                <div class="post">
                    <div class="post-header">
                        <img src="${info.author.profile_image}" onclick="showProfile(${info.author.id})" alt="Profile Picture" class="profile-pic">
                        <div class="user-info">
                            <p class="username" style="cursor:pointer" onclick="showProfile(${info.author.id})">${info.author.username}</p>
                            <p class="post-time">${info.created_at}</p>
                        </div>
                        ${btnEdit}
                    </div>
                    <div class="post-content">
                        <h3 class="post-title">${info.title}</h3>
                        <p class="post-body">${info.body}</p>
                        <img src="${info.image}" onclick="showPost(${info.id})" alt="Post Image" class="post-image">
                    </div>
                    
                    <div class="post-tags">
                        ${tags}
                    </div>

                    <div class="post-footer">
                        <p class="comments-count">${info.comments_count} Comments</p>
                    </div>
                </div>
            `;

      document.getElementsByClassName("main-container")[0].innerHTML += content;
    }
  });
}
function showPost(posteId) {
  window.location.href = `./SinglePostPage/index.html?posteId=${posteId}`;
}
function togleLoader(show = true) {
  if (show) document.getElementById("togle").style.visibility = "visible";
  else document.getElementById("togle").style.visibility = "hidden";
}

function GetCurrentUser() {
  let user = null;
  const storage = localStorage.getItem("user");

  if (storage != null) {
    user = JSON.parse(storage);
  }
  return user;
}
