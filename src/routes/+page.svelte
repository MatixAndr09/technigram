<script lang="ts">
    let currentUserId;
    let currentUserName;
    let server_adress = "https://677fa88cdec95724eace.appwrite.global";

    // let loggedInAsMessage = document.querySelector(`.headline`);
    // const loggedInAsMessage = document.querySelector("#currently-logged-user`);
    // loggedInAsMessage.innerHTML = "yes";

    function escapeHTML(unsafe: string) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    async function fetchPost(postId: number) {
        try {
            const response = await fetch(`${server_adress}/posts/${postId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const postDetails = await response.json();

            const mainElement = document.querySelector("main");
            if (!mainElement) throw new Error("Main element not found");
            
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
                    <img src="${escapeHTML(
                        postDetails.creatorProfilePicture,
                    )}" alt="" class="avatar medium" />
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
            if (mainElement) {
                mainElement.innerHTML = "<h2>Error fetching post details.</h2>";
            }
        }
    }

    async function handleAddComment(postId: number) {
        const commentInput = document.querySelector(`#commentInput-${postId}`) as HTMLInputElement;
        if (!commentInput) {
            alert("Comment input not found");
            return;
        }
        const commentContent = commentInput.value;

        if (!commentContent) {
            alert("Comment content cannot be empty");
            return;
        }

        const storedUser = localStorage.getItem("currentUser");
        if (!storedUser) return;
        const currentUser = JSON.parse(storedUser);
        const token = currentUser?.token;

        if (!token) {
            alert("You are not authorized. Please log in first.");
            return;
        }

        try {
            const response = await fetch(
                `${server_adress}/posts/${postId}/comments`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        comment_content: commentContent,
                        comment_creator_id: currentUser.id,
                    }),
                },
            );
            commentInput.value = "";

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
                return;
            }

            const newComment = await response.json();

            const commentsContainer = commentInput.closest(".comments");
            if (!commentsContainer) {
                console.error("Comments container not found");
                return;
            }
            commentsContainer.insertAdjacentHTML(
                "beforeend",
                `
      <p class="description">
      <span class="author">${escapeHTML(newComment.username)}:</span>
      ${escapeHTML(newComment.comment_content)}
      </p>
    `,
            );
        } catch (error) {
            console.error("Error adding comment:", error);
            alert("Failed to add comment");
        }
    }

    async function fetchNumberOfPosts() {
        try {
            const response = await fetch(`${server_adress}/posts/count`);
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

    async function addComment(postId: number, commentContent: string) {
        try {
            const response = await fetch(
                `${server_adress}/posts/${postId}/comments`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ comment_content: commentContent }),
                },
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

    function baseToPath(base64String: string) {
        if (base64String) {
            let imgSrc = base64String;
            if (!imgSrc.startsWith("data:image")) {
                imgSrc = "data:image/png;base64," + imgSrc;
            }
            return imgSrc;
        }
    }

    import { onMount } from 'svelte';

    onMount(async () => {
        try {
            const currentUserData = localStorage.getItem("currentUser");

            if (!currentUserData) {
                throw new Error("User not logged in");
            }

            const currentUser = JSON.parse(currentUserData);

            const currentUserId = currentUser.id;
            const currentUserName = currentUser.username;

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
            window.location.replace("/login");
        }
    });
</script>

<head>
    <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
    />
    <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
    />
</head>

<main>
    <header>
        <div>
            <img src="../images/logo.png" alt="logo" class="logo" />
            <h1 class="headline">Technigram BETA</h1>
        </div>
    </header>
    <div class="middle">
        <main>
            <h2>
                Just, saying, this is sorta beta access and Technigram itself
                ain't finished yet.
            </h2>
            <div id="notLoggedPopup">
                <h1>Not Logged In!</h1>
                <p>You have to be logged in to view posts and all</p>
                <a href="/login"><button>Log in</button></a>
            </div>
        </main>
        <div class="sidebar">
            <div class="profile">
                <p id="username-display">Not Logged In</p>
            </div>
            <a href="/profile">Profile</a>
            <a href="/login">Login</a>
            <a href="/add_post">Add Post</a>
        </div>
    </div>
</main>

<style lang="scss">
    @import '../styles/reset.scss';
    @import '../styles/index.scss';
</style>
