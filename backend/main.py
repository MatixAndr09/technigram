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
            google_auth_url = account.create_oauth2_session_url(
                provider='google',
                success="https://https://677fa88cdec95724eace.appwrite.global/auth/success", 
                failure="https://https://677fa88cdec95724eace.appwrite.global/auth/failure"
            )
            
            return context.res.json({"auth_url": google_auth_url})
            
        except AppwriteException as err:
            context.error("OAuth2 Error: " + repr(err))
            return context.res.json({"error": "Failed to generate Google OAuth2 URL"})
    elif path == "/auth/success":
        return context.res.text("You have successfully authenticated with Google")
    elif path == "/auth/failure":
        return context.res.text("You have NOT successfully authenticated with Google")
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
            "Err": "404: Page you looking for was not found"
        }
    )
