let currentUserId;
let currentUserName;
// let loggedInAsMessage = document.querySelector(`.headline`);
// const loggedInAsMessage = document.querySelector("#currently-logged-user`);
// loggedInAsMessage.innerHTML = "yes";

function escapeHTML(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function fetchPost(postId) {
  try {
    const response = await fetch(
      `https://technigram.onrender.com/posts/${postId}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const postDetails = await response.json();

    const mainElement = document.querySelector("main");
    const imgPath = baseToPath(postDetails.creatorProfilePicture);

    const postDiv = document.createElement("div");
    postDiv.className = "post";

    let commentsHTML = "";
    postDetails.comments.forEach((comment) => {
      commentsHTML += `
        <p class="description">
          <span class="author">${escapeHTML(comment.username)}:</span>
          ${escapeHTML(comment.comment_content)}
        </p>
      `;
    });

    postDiv.innerHTML = `
      <div class="profile">
        <img src="${imgPath}" alt="" class="avatar medium" />
        <span class="author">${escapeHTML(postDetails.creatorUsername)}</span>
      </div>
      <div class="post-content">
        <h3 class="title">${escapeHTML(postDetails.title)}</h3>
        <div class="line"></div>
        <p>${escapeHTML(postDetails.content)}</p>
      </div>
      <footer>
        <div class="comments">
          <div class="comment-creator">
            <input type="text" placeholder="Napisz komentarz..." id="commentInput-${postId}" />
            <button onclick="handleAddComment(${postId})">Add Comment</button>
          </div>
          ${commentsHTML}
        </div>
      </footer>
    `;

    mainElement.appendChild(postDiv);
  } catch (error) {
    console.error("Error fetching post details:", error);
    const mainElement = document.querySelector("main");
    mainElement.innerHTML = "<h2>Error fetching post details.</h2>";
  }
}

async function handleAddComment(postId) {
  const commentInput = document.querySelector(`#commentInput-${postId}`);
  const commentContent = commentInput.value;

  if (!commentContent) {
    alert("Comment content cannot be empty");
    return;
  }

  try {
    const response = await fetch(
      `https://technigram.onrender.com/posts/${postId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment_content: commentContent,
          comment_creator_id: currentUserId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const newComment = await response.json();

    const commentsContainer = commentInput.closest(".comments");
    commentsContainer.insertAdjacentHTML(
      "beforeend",
      `
      <p class="description">
      <span class="author">${escapeHTML(newComment.username)}:</span>
      ${escapeHTML(newComment.comment_content)}
      </p>
    `
    );

    commentInput.value = "";
  } catch (error) {
    console.error("Error adding comment:", error);
    alert("Failed to add comment");
  }
}

async function fetchNumberOfPosts() {
  try {
    const response = await fetch("https://technigram.onrender.com/posts/count");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.numberOfPosts;
  } catch (error) {
    console.error("Error fetching number of posts:", error);
    return 0;
  }
}

async function addComment(postId, commentContent) {
  try {
    const response = await fetch(
      `https://technigram.onrender.com/posts/${postId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment_content: commentContent }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const newComment = await response.json();
    console.log("Added new comment:", newComment);
  } catch (error) {
    console.error("Error adding comment:", error);
  }
}

function baseToPath(base64String) {
  if (base64String) {
    let imgSrc = base64String;
    if (!imgSrc.startsWith("data:image")) {
      imgSrc = "data:image/png;base64," + imgSrc;
    }
    return imgSrc;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const currentUserData = localStorage.getItem("currentUser");

    if (!currentUserData) {
      throw new Error("User not logged in");
    }

    const currentUser = JSON.parse(currentUserData);
    currentUserId = currentUser.id;
    currentUserName = currentUser.username;

    const usernameDisplay = document.querySelector("#username-display");
    if (usernameDisplay) {
      usernameDisplay.textContent = currentUserName;
    }

    const numberOfPosts = await fetchNumberOfPosts();
    for (let i = numberOfPosts; i >= 1; i--) {
      await fetchPost(i);
    }
  } catch (error) {
    console.error("Error initializing home page:", error);
    window.location.replace("./login.html");
  }
});
