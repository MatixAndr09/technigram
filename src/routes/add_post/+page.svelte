<script lang="ts">
    let server_adress = "https://677fa88cdec95724eace.appwrite.global";
    const addPostForm = document.querySelector("#addPostForm");
    if (addPostForm) {
        addPostForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const title = document.querySelector("#title").value;
            const content = document.querySelector("#content").value;
            const errorDiv = document.querySelector("#error");

            const errorDiv = document.querySelector("#error");
            if (!errorDiv) {
                console.error("Error div not found");
                return;
            }

            try {
                const currentUserData = localStorage.getItem("currentUser");
                if (!currentUserData) {
                    throw new Error("User not logged in");
                }

                const currentUser = JSON.parse(currentUserData);
                const creatorId = currentUser.id;
                const token = currentUser.token;
                const response = await fetch(server_adress + "/posts", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        creator_id: creatorId,
                        title: title,
                        content: content,
                    }),
                });

                console.log("Server response:", response);

                if (!response.ok) {
                    const errorData = await response.json();
                    console.log("Error data:", errorData);
                    throw new Error(
                        `HTTP error! Status: ${response.status} - ${errorData.message}`,
                    );
                }

                const newPost = await response.json();
                console.log("Added new post:", newPost);

                window.location.replace(
                    "/",
                );
            } catch (error) {
                console.error("Error adding post:", error);
                errorDiv.textContent = `Failed to add post: ${error.message}`;
            }
        });
    };
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
    <a href="/"> <span class="material-symbols-outlined"> arrow_back </span></a>
    <h1>Add a New Post</h1>
</header>
<main>
    <form id="addPostForm">
        <label for="title">Title</label>
        <input type="text" id="title" name="title" required />

        <label for="content">Content</label>
        <textarea id="content" name="content" required></textarea>
        <button type="submit">Add Post</button>
    </form>
    <div id="error" class="error"></div>
</main>

<style lang="scss">
    @import "../../styles/reset.scss";
    @import "../../styles/add_post.scss";
</style>
