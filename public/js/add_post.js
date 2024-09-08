document
  .querySelector("#addPostForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.querySelector("#title").value;
    const content = document.querySelector("#content").value;
    const errorDiv = document.querySelector("#error");

    try {
      const currentUserData = localStorage.getItem("currentUser");
      if (!currentUserData) {
        throw new Error("User not logged in");
      }

      const currentUser = JSON.parse(currentUserData);
      const creatorId = currentUser.id;

      const response = await fetch("https://technigram.onrender.com/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creator_id: creatorId,
          title: title,
          content: content,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const newPost = await response.json();
      console.log("Added new post:", newPost);

      window.location.replace("https://technigram.onrender.com/index.html");
    } catch (error) {
      console.error("Error adding post:", error);
      errorDiv.textContent = error.message;
    }
  });
