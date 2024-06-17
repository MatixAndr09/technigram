let currentUserId; // Initialize currentUserId
let currentUserName;
// let loggedInAsMessage = document.querySelector(`.headline`);
// const loggedInAsMessage = document.getElementById(`currently-logged-user`);
// loggedInAsMessage.innerHTML = "yes";

async function fetchPost(postId) {
  try {
    const response = await fetch(
      `https://server-002v.onrender.com/posts/${postId}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const postDetails = await response.json();
    const mainElement = document.querySelector("main");

    // Create a new div.post element
    const postDiv = document.createElement("div");
    postDiv.className = "post";

    // Construct HTML for post and comments
    let commentsHTML = "";
    postDetails.comments.forEach((comment) => {
      commentsHTML += `
        <p class="description">
          <span class="author">${comment.username}:</span>
          ${comment.comment_content}
        </p>
      `;
    });

    // Set the inner HTML of the new post element
    postDiv.innerHTML = `
      <div class="profile">
        <img src="./images/profiles/default.png" alt="" class="avatar medium" />
        <span class="author">${postDetails.creatorUsername}</span>
      </div>
      <div class="post-content">
        <h3 class="title">${postDetails.title}</h3>
        <div class="line"></div>
        <p>${postDetails.content}</p>
      </div>
      <footer>
        <span>Liczba polubień: <span>${postDetails.likes}</span></span>
        <div class="comments">
          ${commentsHTML}
          <div class="comment-creator">
            <input type="text" placeholder="Napisz komentarz..." id="commentInput-${postId}" />
            <button onclick="handleAddComment(${postId})">Add Comment</button>
          </div>
        </div>
      </footer>
    `;

    // Append the new post element to the main element
    mainElement.appendChild(postDiv);
  } catch (error) {
    console.error("Error fetching post details:", error);
    const mainElement = document.querySelector("main");
    mainElement.innerHTML = "<h2>Error fetching post details.</h2>";
  }
}

// Function to handle adding comments
async function handleAddComment(postId) {
  const commentInput = document.getElementById(`commentInput-${postId}`);
  const commentContent = commentInput.value;

  if (!commentContent) {
    alert("Comment content cannot be empty");
    return;
  }

  try {
    const response = await fetch(
      `https://server-002v.onrender.com/posts/${postId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment_content: commentContent,
          comment_creator_id: currentUserId, // Include the user ID
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const newComment = await response.json();

    // Optionally, you can update the UI to show the new comment immediately
    const commentsContainer = commentInput.closest(".comments");
    commentsContainer.insertAdjacentHTML(
      "beforeend",
      `
      <p class="description">
        <span class="author">${newComment.username}:</span>
        ${newComment.comment_content}
      </p>
    `
    );

    commentInput.value = ""; // Clear the input field
  } catch (error) {
    console.error("Error adding comment:", error);
    alert("Failed to add comment");
  }
}

async function fetchNumberOfPosts() {
  try {
    const response = await fetch(
      "https://server-002v.onrender.com/posts/count"
    );
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

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Retrieve user data from localStorage
    const currentUserData = localStorage.getItem("currentUser");

    if (!currentUserData) {
      throw new Error("User not logged in");
    }

    const currentUser = JSON.parse(currentUserData);
    currentUserId = currentUser.id;
    currentUserName = currentUser.username;

    // loggedInAsMessage.innerHTML = currentUserName;

    const numberOfPosts = await fetchNumberOfPosts();
    for (let i = numberOfPosts; i >= 1; i--) {
      await fetchPost(i);
    }
  } catch (error) {
    console.error("Error initializing home page:", error);
    // Handle error if necessary
  }
});
