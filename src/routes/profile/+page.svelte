<script lang="ts">
    let server_adress = "https://677fa88cdec95724eace.appwrite.global";
    document.addEventListener("DOMContentLoaded", async () => {
        let currentUserId;
        let currentUserName;

        try {
            const currentUserData = localStorage.getItem("currentUser");

            if (!currentUserData) {
                throw new Error("User not logged in");
            }

            const currentUser = JSON.parse(currentUserData);
            currentUserId = currentUser.id;
            currentUserName = currentUser.username;

            const usernameDisplay = document.querySelector(".username");
            if (usernameDisplay) {
                usernameDisplay.textContent = currentUserName;
            }
        } catch (error) {
            console.error("Error initializing home page:", error);
            window.location.replace("/login");
        }

        //  changing img pic
        const profilePictureImg = document.querySelector("#profilePicture");
        const profilePictureContainer = document.querySelector(".profile");
        try {
            const response = await fetch(
                `${server_adress}/profilePicture/${currentUserId}`,
            );
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            const profilePicture = data.userProfilePicture;

            if (profilePicture) {
                if (profilePictureImg) {
                    profilePictureImg.src = profilePicture;
                } else if (profilePictureContainer) {
                    const newImg = document.createElement("img");
                    newImg.src = profilePicture;
                    newImg.alt = "profile picture";
                    profilePictureContainer.appendChild(newImg);
                }
            } else {
                if (profilePictureImg) {
                    profilePictureImg.src = "/default-profile.png";
                } else {
                    const newImg = document.createElement("img");
                    newImg.src = "/default-profile.png";
                    newImg.alt = "default profile picture";
                    profilePictureContainer.appendChild(newImg);
                }
            }
        } catch (error) {
            console.error("Error fetching profile picture:", error);
            if (profilePictureImg) {
                profilePictureImg.src = "/default-profile.png";
            } else {
                const newImg = document.createElement("img");
                newImg.src = "/default-profile.png";
                newImg.alt = "default profile picture";
                profilePictureContainer.appendChild(newImg);
            }
        }

        // Changing profile
        const fileInput = document.getElementById("fileInput");
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const desiredWidth = 200; // Desired width of the cropped image
        const desiredHeight = 200; // Desired height of the cropped image

        profilePictureImg.addEventListener("click", function (event) {
            fileInput.click();
        });
        fileInput.addEventListener("change", function () {
            const file = fileInput.files[0];
            if (file) {
                const reader = new FileReader();

                reader.onload = function (e) {
                    profilePictureImg.src = e.target.result;
                };

                reader.readAsDataURL(file);
            }
        });
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

<header>
    <a href="./index.html">
        <span class="material-symbols-outlined"> arrow_back </span></a
    >
    <div>
        <img src="images/logo.png" alt="logo" class="logo" />
        <h1 class="headline">Technigram</h1>
    </div>
</header>
<div class="middle">
    <main>
        <div class="profile">
            <h3>Click to change something</h3>
            <img src="" alt="pfp" class="pfp" id="profilePicture" />
            <input type="file" id="fileInput" style="display: none" />
            <h1 class="username"></h1>
        </div>
        <div id="notLoggedPopup">
            <h1>Not Logged In!</h1>
            <p>You have to be logged in to view posts and all</p>
            <a href="login.html"><button>Log in</button></a>
        </div>
    </main>
    <div class="sidebar">
        <a href="profile.html">Profile</a>
        <a href="login.html">Login</a>
        <a href="add_post.html">Add Post</a>
    </div>
</div>

<style lang="scss">
    @import "../../styles/reset.scss";
    @import "../../styles/index.scss";
    @import "../../styles/profile.scss";
</style>
