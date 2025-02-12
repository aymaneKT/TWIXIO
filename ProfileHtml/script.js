function GetCurrentUserId(){
    const params = new URL(location.href).searchParams;
    const id = params.get('userId');
    return id;
}
const baseUrl = "https://tarmeezacademy.com/api/v1/";
function infoUserProfile(){
    const id = GetCurrentUserId();
    axios.get(`${baseUrl}users/${id}`)
    .then((response)=>{
        let user = response.data.data;
        if(user.email === null || user.email === undefined){
            user.email = "";
        }
        document.getElementsByClassName("user-information")[0].innerHTML = `
        <div class="left-part">
                <div class="img-box">
                    <img src="${user.profile_image}" alt="Profile Picture">
                </div>
                <div class="detail-user">
                    <p class="username">${user.username}</p>
                    <p class="name">${user.name}</p>
                    <p class="email">${user.email}</p>
                </div>
            </div>
            <div class="right-part">
                <div class="stat">
                    <h2><span>${user.posts_count}</span> Posts</h2>
                    <h2><span>${user.comments_count}</span> Comments</h2>
                </div>
            </div>
    
            `
            document.getElementsByClassName("user-posts")[0].innerHTML = `<h1>${user.username}' s Posts</h1>`
    })
    
}
infoUserProfile()
getPosts() 
function getPosts() {
    togleLoader(true)
    const id = GetCurrentUserId();
    axios.get(`${baseUrl}users/${id}/posts`)
    .then(response => {
        let abstractDate = response.data.data;
        infoUserProfile()
        togleLoader(false)
        document.getElementsByClassName("main-container")[0].innerHTML = "";  
        let content = "";
        
        

        for (const info of abstractDate) {
            if(info.title === null || info.title === undefined){
                info.title = "";
            }
            
            
            let tags = "";  
            let user = GetCurrentUser();
            let btns = "";
            
            let isMyPost = user !== null && info.author.id === user.id;
            
            for (const tag of info.tags) {
                tags += `<span class="tag">#${tag.name} #${tag.arabic_name}</span>`;
            }
            if(isMyPost){
                btns =  `
                <div class="edit-remove">
                    <div class="editButton" onclick="checkOpenPost('edit','${encodeURIComponent(JSON.stringify(info))}')"> 
                                <i class="fa-solid fa-pen-to-square"></i>
                                EDIT
                    </div>
                    <div class="removeButton id="remove" onclick="checkOpenPost('remove','${encodeURIComponent(JSON.stringify(info))}')"> 
                                <i class="fa-solid fa-trash"></i>
                                REMOVE
                    </div>
                </div>
                `
            }
            
            
            
            content += `
                <div class="post">
                    <div class="post-header">
                        <img src="${info.author.profile_image}" alt="Profile Picture" class="profile-pic">
                        <div class="user-info">
                            <p class="username">${info.author.username}</p>
                            <p class="post-time">${info.created_at}</p>
                        </div>
                        ${btns}
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
            
            
            
        }
        document.getElementsByClassName("main-container")[0].innerHTML = content;

    });
}
function togleLoader(show = true) {
    if(show)
        document.getElementById("togle").style.visibility = "visible";
    else
    document.getElementById("togle").style.visibility = "hidden";
        
}

function showPost(posteId) {
    window.location.href = `../SinglePostPage/index.html?posteId=${posteId}`
}