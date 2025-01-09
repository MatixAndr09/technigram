from appwrite.exception import AppwriteException
from appwrite.services.users import Users
from appwrite.client import Client
import os
import random
import string

def random_string(length=10):
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
        # Log messages and errors to the Appwrite Console
        # These logs won't be seen by your end users
        context.log("Total users: " + str(response["total"]))
    except AppwriteException as err:
        context.error("Could not list users: " + repr(err))

    # The req object contains the request data
    path = context.req.path

    if path == "/ping":
        return context.res.text("Pong")
    elif path == "/auth/google/":
        return context.res.text(random_string())
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
