import {
    Client,
    Account,
    OAuthProvider,
    Databases
} from "appwrite";

export default async ({
    req,
    res,
    log,
    error
}) => {
    const client = new Client().setEndpoint('https://678273d353eb3e147e60.appwrite.global').setProject('678273d2002b8624f985');
    const databases = new Databases(client);

    if (req.path === "/ping") {
        return res.text("Pong");
    }

    if (req.path === "/auth/google") {
        const account = new Account(client);
            
        account.createOAuth2Session(
            OAuthProvider.Google,
            'https://www.google.com/search?client=opera&hs=XBo&sca_esv=b13e22941889ff0e&sxsrf=ADLYWILzHJr9V_T-SQ2u9zrR3y-TT7K2xA:1736712243909&q=success&udm=2&fbs=AEQNm0Dvr3xYvXRaGaB8liPABJYdGovAUMem85jmaNP43N9LWv8DF2btGLpo_B7RuF8Id5OVSETK2jLKOZWVIv57qyFi9d22-yTFKcOfIcPjRKe_rh8eUrwuvoaVpYGyg19NNRx4wPdwxgZP25iEZiRG0SriUvMOz28cVhXkeKdfYD_HfUBMztLVmAyZxU-dgFCy4-3DWBEWyRUZSf1ZnfFW65sTeWzNXA&sa=X&ved=2ahUKEwiq-P-i_fCKAxV32gIHHbOzCjwQtKgLegQIFhAB&biw=1866&bih=911&dpr=1#vhid=cqr-rS9566pJ1M&vssid=mosaic',
            'https://www.google.com/search?q=failed&client=opera&hs=rq8&sca_esv=b13e22941889ff0e&udm=2&biw=1866&bih=911&sxsrf=ADLYWIIgs9ecVy_LxCxdSEOvAgAn29h03Q%3A1736712244835&ei=NCCEZ9TVMse8i-gPhputCA&ved=0ahUKEwjUv7ij_fCKAxVH3gIHHYZNCwEQ4dUDCBE&uact=5&oq=failed&gs_lp=EgNpbWciBmZhaWxlZDIKEAAYgAQYQxiKBTIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABEjtC1DNBFimCHABeACQAQCYAcEBoAGcB6oBAzAuNrgBA8gBAPgBAZgCB6ACtgfCAg0QABiABBixAxhDGIoFwgIGEAAYBxgewgILEAAYgAQYsQMYgwHCAggQABiABBixA8ICEBAAGIAEGLEDGEMYgwEYigXCAg4QABiABBixAxiDARiKBZgDAIgGAZIHAzEuNqAHox4&sclient=img#vhid=nO-4aAaaWmZ5eM&vssid=mosaic'
        );

        const user = await account.get();
        const { email, name, picture } = user;

        return res.json({
            message: "OAuth session created",
            email,
            name,
            picture
        });
    }

    if (req.path === "/posts/count") {
        try {
            const response = await databases.listDocuments('posts');
            return res.json({ numberOfPosts: response.total });
        } catch (err) {
            return res.status(500).json({ error: "Failed to fetch post count" });
        }
    }

    if (req.path.startsWith("/posts/") && req.method === "GET") {
        const postId = req.path.split("/")[2];
        try {
            const response = await databases.getDocument('posts', postId);
            return res.json(response);
        } catch (err) {
            return res.status(500).json({ error: "Failed to fetch post details" });
        }
    }

    if (req.path.startsWith("/posts/") && req.path.endsWith("/comments") && req.method === "POST") {
        const postId = req.path.split("/")[2];
        const { comment_content, comment_creator_id } = req.body;
        try {
            const response = await databases.createDocument('comments', {
                post_id: postId,
                comment_creator_id,
                comment_content
            });
            return res.json(response);
        } catch (err) {
            return res.status(500).json({ error: "Failed to add comment" });
        }
    }

    if (req.path === "/posts" && req.method === "POST") {
        const { creator_id, title, content } = req.body;
        try {
            const response = await databases.createDocument('posts', {
                creator_id,
                title,
                content
            });
            return res.status(201).json(response);
        } catch (err) {
            return res.status(500).json({ error: "Failed to add post" });
        }
    }

    if (req.path === "/login" && req.method === "POST") {
        const { email, password } = req.body;
        const account = new Account(client);
        try {
            const session = await account.createSession(email, password);
            return res.json(session);
        } catch (err) {
            return res.status(500).json({ error: "Failed to login" });
        }
    }

    if (req.path === "/profile" && req.method === "GET") {
        const account = new Account(client);
        try {
            const user = await account.get();
            return res.json(user);
        } catch (err) {
            return res.status(500).json({ error: "Failed to fetch profile" });
        }
    }

    if (req.path === "/profilePicture/:user_id" && req.method === "GET") {
        const userId = req.path.split("/")[2];
        try {
            const response = await databases.getDocument('users', userId);
            return res.json({ profilePicture: response.profile_picture });
        } catch (err) {
            return res.status(500).json({ error: "Failed to fetch profile picture" });
        }
    }
};
