const baseUrl = "https://tarmeezacademy.com/api/v1/";
function showPost() {
    const params = new URL(location.href).searchParams;
    const posteId = params.get('posteId');
    togleLoader(true)
    document.getElementsByClassName("main-container")[0].innerHTML = ""
    axios.get(`${baseUrl}posts/${posteId}`)
    .then((response)=>{
        togleLoader(false)
        let abstractDate = response.data.data;
        if(abstractDate.title === null || abstractDate.title === undefined){
            abstractDate.title = "";
        }

        let tags = "";  

            for (const tag of abstractDate.tags) {
                tags += `<span class="tag">#${tag.name} #${tag.arabic_name}</span>`;
            }
            let comments = "";
            for (const comment of abstractDate.comments) {
                comments += `
                    <div class="comment">
                        <img src="${comment.author.profile_image}" alt="Commenter Profile Picture" class="comment-pic">
                        <div class="comment-content">
                            <p class="comment-author">@${comment.author.username}</p>
                            <p class="comment-text">${comment.body}</p>
                        </div>
                    </div>
                `;
            }
        let post = `
        <div class="post">
            <div class="post-header">
                <img src="${abstractDate.author.profile_image}" alt="Profile Picture" class="profile-pic">
                <div class="user-info">
                    <p class="username">${abstractDate.author.username}</p>
                    <p class="post-time">${abstractDate.created_at}</p>
                </div>
            </div>
            <div class="post-content">
                <h3 class="post-title">${abstractDate.title}</h3>
                <p class="post-body">${abstractDate.body}</p>
                <img src="${abstractDate.image}" alt="Post Image" class="post-image">
            </div>
            
            <div class="post-tags">
                ${tags}
            </div>

            <div class="post-footer">
                <p class="comments-count">${abstractDate.comments_count} Comments</p>
            </div>
            <div class="comment-form">
            <input type="text" placeholder="Add a comment..." class="comment-input">
            <button class="comment-button" onclick="postComment('${posteId}')" >Comment</button>
            </div>
            <div id="comments">
                ${comments}
            </div>
        </div>
    `;
    document.getElementsByClassName("main-container")[0].innerHTML = post;
    })
}
showPost()
function postComment(posteId) {
    togleLoader(true)
    const comment = document.getElementsByClassName("comment-input")[0].value;
    const params = {
        "body" : comment
    }
    let header = {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        }
      }
    axios.post(`${baseUrl}posts/${posteId }/comments`,params,header)
    .then(()=>{
        togleLoader(false);
        showSuccesAlert("comment posted");
        showPost()
    })
    .catch((error)=>{
        showErrorAlert(error.response.data.message)
        togleLoader(false);
    })
}


function togleLoader(show = true) {
    if(show)
        document.getElementById("togle").style.visibility = "visible";
    else
    document.getElementById("togle").style.visibility = "hidden";
        
}
