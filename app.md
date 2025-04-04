# Getting to know the Application under test

Before we start configuring Cypress and writing automated test scripts, let me introduce the application we will test throughout this course.

This is a **personal link manager** application with features like authentication, tag management, and metadata extraction. It was built using **React**, **TypeScript**, and **Supabase** for the backend.

---

## Application features

The application allows users to:

- Store links with title, description, and tags
- Add up to **30 links** and **15 tags**
- Use **emoji-supported tags** with a maximum of 15 characters
- Receive **automatic tag suggestions** based on the provided URL
- Filter links using visually distinct colored tags
- Mark links as **read or unread**
- Automatically extract metadata from URLs (title, description, image)
- Configure **email preferences** _(not fully implemented yet)_
- (Future) Share links with others
- Log in, sign up, and log out
- Manage admin users (configured via environment variables)

---

## Application rules and behaviors

### Limits and validations

- A maximum of **30 links** per user
- A maximum of **15 tags**
- Tags: up to **15 characters**, including emoji support
- URLs must start with `http` or `https` to be considered valid
- **Duplicate links are not allowed**

### Conditional logic

- If the URL is invalid (e.g., missing `http`/`https`), it is ignored
- Fields such as title and description have size limits
- If a link already exists, it won’t be added again

---

## Supabase initialization and authentication

The `SupabaseService` class is responsible for:

- Initializing the Supabase client using API URL and key
- Handling user authentication (login, signup, logout)
- Storing credentials locally during development
- Ensuring Supabase is initialized before performing any operation

---

## User management

- Users can sign up and log in with **email and password**
- Additional user data (e.g., name) is stored upon signup
- The service checks whether a user is logged in
- Support for **admin users** configured via environment variables

---

## Link management

- Add, update, and delete links
- Retrieve all user-specific links
- Mark links as read or unread
- Prevent duplicate link entries

Each link includes:

- URL
- Title
- Description
- Tags

---

## Tag management

- Retrieve and add new tags
- Automatically suggest tags based on the URL
- Visually enhanced tag filtering

---

## Email configuration

- Retrieve and update user email preferences _(notification service not yet implemented)_

---

## Metadata extraction

- Automatically extract metadata from the provided URL:
  - Page title
  - Description
  - Cover image

---

## Testability

- All interactive elements include **test IDs** to support automated testing

---
