# Free API Authentication

A simple authentication UI built with HTML, CSS, and vanilla JavaScript using the FreeAPI Authentication Module. It supports register, login, logout, and current-user profile retrieval with basic loading states and status messages.

## Live Demo
[freeapi-auth.ashish.pro](https://freeapi-auth.ashish.pro)

freeapi.vercel.app

## Features

- Register screen and form
- Login screen and form
- Logout action
- Current user profile/details section
- Success and error messages
- Loading states during API calls
- Clean, responsive UI with custom CSS

## Tech Stack

- HTML
- CSS
- JavaScript (vanilla)

## API Endpoints Used

- Register User: `POST https://api.freeapi.app/api/v1/users/register`
- Login User: `POST https://api.freeapi.app/api/v1/users/login`
- Logout User: `POST https://api.freeapi.app/api/v1/users/logout`
- Get Current User: `GET https://api.freeapi.app/api/v1/users/current-user`

### Example Payloads

Register

```json
{
  "email": "user.email@domain.com",
  "password": "test@123",
  "role": "ADMIN",
  "username": "doejohn"
}
```

Login

```json
{
  "password": "test@123",
  "username": "doejohn"
}
```

## Project Structure

```
.
├── index.html
├── main.js
└── style.css
```

## How It Works

- Register and login forms send requests to the FreeAPI endpoints.
- Access and refresh tokens are stored in `localStorage` after login.
- The dashboard fetches the current user data and displays profile details.
- Logout clears tokens and resets the UI state.

## Run Locally

1. Open the project folder in VS Code.
2. Use a local server (for example, Live Server) to open `index.html`.

## Notes

- The app uses the access token in the `Authorization` header for authenticated calls.
- All requests expect JSON responses from the API.
