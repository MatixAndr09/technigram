from appwrite.exception import AppwriteException
from appwrite.services.users import Users
from appwrite.client import Client
import random
import string
import os
from appwrite.services.account import Account

def random_string(length=256):
    letters = string.ascii_letters
    return ''.join(random.choice(letters) for i in range(length))

# This Appwrite function will be executed every time your function is triggered
def main(context):
    # You can use the Appwrite SDK to interact with other services
    # For this example, we're using the Users service
    client = (
        Client()
        .set_endpoint(os.environ["APPWRITE_FUNCTION_API_ENDPOINT"])
        .set_project(os.environ["APPWRITE_FUNCTION_PROJECT_ID"])
        .set_key(context.req.headers["x-appwrite-key"])
    )
    users = Users(client)

    try:
        response = users.list()
        context.log("Total users: " + str(response["total"]))
    except AppwriteException as err:
        context.error("Could not list users: " + repr(err))

    path = context.req.path

    if path == "/ping":
        return context.res.text("Pong")
    elif path == "/auth/google":
        account = Account(client)

        try:
            session = account.create_session(
                provider="google",
                success=os.environ["APPWRITE_FUNCTION_SUCCESS_URL"],
                failure=os.environ["APPWRITE_FUNCTION_FAILURE_URL"]
            )
            user = account.get()
            user_data = {
            "imie": user["name"],
            "nazwisko": user["surname"],
            "pfp": user["prefs"]["profilePicture"],
            "email": user["email"]
            }
            return context.res.json(user_data)
        except AppwriteException as err:
            context.error("Google authentication failed: " + repr(err))
            return context.res.json({"error": "Authentication failed"}, status=500)
        
    elif path.startswith("/posts/") and path.endswith("/comments"):
        return context.res.text(random_string())
    elif path.startswith("/posts/") and path.count('/') == 2:
        return context.res.text(random_string())
    elif path == "/posts/count":
        return context.res.text(random_string())
    elif path == "/posts":
        return context.res.text(random_string())
    elif path == "/login":
        return context.res.text(random_string())
    elif path == "/profile":
        return context.res.text(random_string())
    elif path == "/add_post":
        return context.res.text(random_string())
    elif path.startswith("/profilePicture/") and path.count('/') == 2:
        return context.res.text(random_string())

    return context.res.json(
        {
            "Err": "404 Not Found"
        }
    )
