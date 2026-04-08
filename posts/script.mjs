let isEditing = false;
let editingIndex = null;

let user_string = localStorage.getItem("currentUsers");
let string_data = JSON.parse(user_string);

if (!string_data) {
  window.location.href = "../Login/index.html";
}

document.querySelector(".user-gmail").innerText = string_data.email;

function logout() {
  localStorage.removeItem("currentUsers");
  window.location.href = "../Login/index.html";
}

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.querySelector("#title").value;
  const description = document.querySelector("#desc").value;

  let all_posts_string = localStorage.getItem("posts");
  let all_posts = JSON.parse(all_posts_string) || [];

  if (isEditing && editingIndex !== null) {
    all_posts[editingIndex] = {
      title: title,
      description: description,
      Time: all_posts[editingIndex].Time,
      createdBy: all_posts[editingIndex].createdBy,
      editedAt: new Date().getTime(),
      likes: all_posts[editingIndex].likes,
    };

    Swal.fire({
      icon: "success",
      title: "Post Updated",
      text: "Your post has been updated successfully!",
      showConfirmButton: false,
      timer: 1500,
      backdrop: true,
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    });
  } else {
    let new_posts = {
      title: title,
      description: description,
      Time: new Date().getTime(),
      createdBy: string_data.email,
      likes: [],
    };
    all_posts = [new_posts, ...all_posts];

    Swal.fire({
      icon: "success",
      title: "Post Created",
      text: "Your post has been created successfully!",
      showConfirmButton: false,
      timer: 1500,
      backdrop: true,
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    });
  }

  localStorage.setItem("posts", JSON.stringify(all_posts));

  e.target.reset();

  isEditing = false;
  editingIndex = null;

  const submitBtn = document.querySelector("form button[type='submit']");
  if (submitBtn) submitBtn.innerHTML = "Create Post";

  rendor_posts();
});

function edit_post(postsIndex) {
  let all_posts_string = localStorage.getItem("posts");
  let all_posts = JSON.parse(all_posts_string);

  const postToEdit = all_posts[postsIndex];

  if (postToEdit.createdBy !== string_data.email) {
    alert("You can only edit your own posts!");
    return;
  }

  document.querySelector("#title").value = postToEdit.title;
  document.querySelector("#desc").value = postToEdit.description;

  isEditing = true;
  editingIndex = postsIndex;

  const submitBtn = document.querySelector("form button[type='submit']");
  if (submitBtn) submitBtn.innerHTML = "Update Post";

  document
    .querySelector("form")
    .scrollIntoView({ behavior: "smooth", block: "center" });
}

document.querySelector("#desc").addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    document.querySelector("form").requestSubmit();
  }
});

function like_post(postsIndex) {
  let all_posts = JSON.parse(localStorage.getItem("posts")) || [];

  let currentPosts = all_posts[postsIndex];

  let useremail = currentPosts.likes.find((email) => {
    return email === string_data.email;
  });

  if (useremail) {
    let updatedLikes = currentPosts.likes.filter((email) => {
      return email !== string_data.email;
    });

    all_posts[postsIndex].likes = updatedLikes;
    localStorage.setItem("posts", JSON.stringify(all_posts));
  } else {
    currentPosts.likes.unshift(string_data.email);
    all_posts[postsIndex] = currentPosts;
    localStorage.setItem("posts", JSON.stringify(all_posts));
  }
  rendor_posts();
}

function delete_post(postsIndex) {
  let all_posts_string = localStorage.getItem("posts");
  let all_posts = JSON.parse(all_posts_string);

  if (all_posts[postsIndex].createdBy !== string_data.email) {
    alert("You can only delete your own posts!");
    return;
  }

  all_posts.splice(postsIndex, 1);
  localStorage.setItem("posts", JSON.stringify(all_posts));

  rendor_posts();

  console.log("delete post", postsIndex);
}

function rendor_posts() {
  let all_posts_string = localStorage.getItem("posts");
  let all_posts = JSON.parse(all_posts_string) || [];

  const output = document.querySelector("#output");

  output.innerHTML = "";

  all_posts.forEach((posts, index) => {
    posts.likes = posts.likes || [];

    let useremail = posts.likes.find((email) => {
      return email === string_data.email;
    });

    output.innerHTML += `
  <div class="single-post">
  <span class="post-time">${moment(posts.Time).fromNow()}</span>
    <h2>${posts.createdBy}</h2>
    <h2>${posts.title}</h2>
    <h4>${posts.description}</h4>
    <div class="post-btns">
      ${
        posts.createdBy === string_data.email
          ? ` <button class="${useremail ? "liked-posts" : "unliked-posts"}" onclick="like_post(${index})"><i class="bi bi-hand-thumbs-up"></i> Like(${posts.likes.length})</button>
      <button onclick="edit_post(${index})"><i class="bi bi-pencil-square"></i> Edit</button>
      <button onclick="delete_post(${index})"><i class="bi bi-trash"></i> Delete</button> `
          : `<button class="${useremail ? "liked-posts" : "unliked-posts"}" onclick="like_post(${index})"><i class="bi bi-hand-thumbs-up"></i> Like(${posts.likes.length})</button>`
      }
    </div>
    
  </div>`;
  });
}

rendor_posts();
