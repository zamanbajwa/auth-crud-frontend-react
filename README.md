# Auth CRUD Frontend (React + Material UI)

A modern, responsive user management dashboard built with React and Material UI. This frontend connects to a Laravel backend for authentication and CRUD operations. It features beautiful UI/UX, user roles, profile management, and admin controls.

---

## Features

- **Authentication:** Login, register, and logout with JWT token storage.
- **Role-based Access:** Admin and user roles, with different dashboard views.
- **User CRUD:**
  - Admins can view, create, edit, and delete users.
  - Users can view and edit their own profile.
- **Profile Management:**
  - Update name, email, phone, bio, and avatar.
  - Avatar upload and preview.
- **Responsive UI:**
  - Fully responsive, mobile-friendly layouts.
  - Glassmorphism cards, modern AppBar, and animated login/register pages.
- **Pagination & Scroll:**
  - Paginated, scrollable user table for large datasets.
- **Material UI:**
  - All components use MUI for a polished, consistent look.

---

## Tech Stack

- **Frontend:** React, Material UI (MUI), Axios, React Router
- **Backend:** Laravel (API, not included in this repo)

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone git@github.com:zamanbajwa/auth-crud-frontend-react.git
cd auth-crud-frontend-react
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
- Create a `.env` file in the project root (or use `.env.local`).
- Add your backend API URL:
  ```env
  VITE_API_URL=http://localhost:8000
  ```
  (Adjust the URL to match your Laravel backend.)

### 4. Start the Development Server
```bash
npm run dev
```
- The app will be available at `http://localhost:5173` (or as shown in your terminal).

### 5. Build for Production
```bash
npm run build
```
- Output will be in the `dist/` folder.

---

## Usage

- **Login:** Use your credentials to log in. Admins are redirected to the dashboard, users to their profile.
- **Register:** Create a new user account. (Admins can create users from the dashboard.)
- **Dashboard:**
  - Admins see a paginated, scrollable table of all users.
  - Can view, edit, or delete any user.
- **Profile:**
  - Users can view and edit their own profile, including uploading an avatar.
- **Logout:** Click the logout button in the header.

---

## Customization & Notes

- **Backend:** This frontend expects a Laravel backend with JWT authentication and user CRUD endpoints.
- **Avatar Storage:** Avatars are served from the backend's `/storage` directory. Ensure your backend is configured to serve uploaded files.
- **Roles:**
  - Admins have full access to all users.
  - Users can only edit their own profile.
- **Styling:** All UI is built with Material UI and custom glassmorphism effects.
- **Pagination:** Table pagination is client-side. For large datasets, consider implementing server-side pagination in the backend and updating the frontend fetch logic.

---

## Screenshots

image.png

---


