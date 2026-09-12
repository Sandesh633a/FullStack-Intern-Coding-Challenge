# StoreRating

Live Demo

Application	Deployment	Link

Frontend	Vercel	https://full-stack-intern-coding-challenge-wine.vercel.app

Backend API	Render	https://fullstack-intern-coding-challenge-ueqt.onrender.com



Note: The frontend is deployed on Vercel and communicates with the Express.js backend deployed on Render.

> A full-stack store rating platform with role-based access for administrators, store owners, and customers.

StoreRating is a responsive web application that allows authenticated users to discover stores, view aggregate ratings, and submit or update their own 1–5 star rating.

Administrators can manage users and stores and monitor platform-wide statistics, while store owners can view the rating performance and customer ratings for their assigned stores.

The project is built with a **React + Vite frontend**, **Express.js REST API**, and **PostgreSQL database**. Authentication is implemented using **JWT**, passwords are securely hashed using **bcrypt**, and protected routes use role-based authorization.

---

## Table of Contents

* [Features](#features)
* [Roles and Permissions](#roles-and-permissions)
* [Technology Stack](#technology-stack)
* [Architecture](#architecture)
* [Project Structure](#project-structure)
* [Database Design](#database-design)
* [API Reference](#api-reference)
* [Frontend Routes](#frontend-routes)
* [Authentication Flow](#authentication-flow)
* [Validation Rules](#validation-rules)
* [Getting Started](#getting-started)
* [Environment Variables](#environment-variables)
* [Database Setup](#database-setup)
* [Running the Application](#running-the-application)
* [Demo Admin Account](#demo-admin-account)
* [How the Main Features Work](#how-the-main-features-work)
* [Security and Reliability](#security-and-reliability)
* [Development Commands](#development-commands)
* [Troubleshooting](#troubleshooting)
* [License](#license)

---

# Features

## Authentication

* User registration
* User login
* JWT-based authentication
* Secure password hashing using bcrypt
* Password change functionality
* Protected frontend routes
* Backend authentication middleware
* Role-based authorization
* Automatic logout when an authentication token becomes invalid

---

## Customer Features

Authenticated customers can:

* Browse available stores
* Search stores by name
* Search/filter stores by address
* Sort stores by:

  * Name
  * Address
  * Average rating
* View average store rating
* View total number of ratings
* See their own rating for each store
* Submit a rating from **1 to 5 stars**
* Update an existing rating
* Change their password

The application prevents a customer from creating multiple ratings for the same store.

---

## Admin Features

Administrators have access to a dedicated dashboard.

### Dashboard

The admin dashboard displays:

* Total users
* Total stores
* Total ratings
* Recent users
* Highest-rated stores

### User Management

Administrators can:

* Create users
* Create administrators
* Create store owners
* Create normal customers
* Search users
* Filter users by role
* Filter users by name, email, or address
* Sort users
* View individual user details
* View stores owned by store owners

### Store Management

Administrators can:

* Create stores
* Assign stores to store owners
* Search stores
* Filter stores
* Sort stores
* View average ratings
* View total rating counts
* View store details

---

## Store Owner Features

Store owners have a dedicated dashboard that provides:

* Assigned stores
* Average rating
* Total number of ratings
* Rating percentage
* Rating distribution from 1–5 stars
* Customer rating information
* Customer names
* Customer emails
* Rating dates

This gives store owners a quick overview of how their stores are performing.

---

# Roles and Permissions

| Role            | Permissions                                                                       |
| --------------- | --------------------------------------------------------------------------------- |
| **Admin**       | Manage users, manage stores, assign store owners, view platform statistics        |
| **User**        | Browse stores, view ratings, submit ratings, update ratings, change password      |
| **Store Owner** | View assigned stores, rating statistics, rating distribution and customer ratings |

Role authorization is enforced on the **backend**, so users cannot gain access to restricted API endpoints simply by manipulating the frontend.

---

# Technology Stack

## Frontend

| Technology       | Purpose                         |
| ---------------- | ------------------------------- |
| React 19         | UI development                  |
| Vite             | Frontend development/build tool |
| React Router DOM | Client-side routing             |
| Tailwind CSS 4   | Styling                         |
| Axios            | API communication               |
| React Hot Toast  | Notifications                   |
| Lucide React     | Icons                           |

---

## Backend

| Technology        | Purpose                    |
| ----------------- | -------------------------- |
| Node.js           | Runtime                    |
| Express.js        | REST API framework         |
| PostgreSQL        | Relational database        |
| Neon PostgreSQL   | Cloud PostgreSQL provider  |
| JSON Web Token    | Authentication             |
| bcryptjs          | Password hashing           |
| express-validator | Request validation         |
| Helmet            | HTTP security headers      |
| CORS              | Cross-origin configuration |
| Morgan            | HTTP request logging       |
| dotenv            | Environment configuration  |

---

# Architecture

The application follows a standard full-stack architecture.

```text
                    ┌───────────────────────┐
                    │     React Frontend    │
                    │                       │
                    │ React + Vite          │
                    │ Tailwind CSS          │
                    │ React Router          │
                    │ Axios                 │
                    └───────────┬───────────┘
                                │
                         HTTP / JSON
                       Bearer JWT Token
                                │
                                ▼
                    ┌───────────────────────┐
                    │     Express API       │
                    │                       │
                    │ Authentication        │
                    │ Authorization         │
                    │ Validation            │
                    │ Controllers           │
                    │ Services              │
                    └───────────┬───────────┘
                                │
                              SQL
                                │
                                ▼
                    ┌───────────────────────┐
                    │   PostgreSQL / Neon   │
                    │                       │
                    │ users                 │
                    │ stores                │
                    │ ratings               │
                    └───────────────────────┘
```

---

# Backend Request Flow

```text
HTTP Request
     │
     ▼
Express
     │
     ├── Helmet
     ├── CORS
     ├── JSON Parser
     └── Morgan
     │
     ▼
Authentication
     │
     ▼
Role Authorization
     │
     ▼
Request Validation
     │
     ▼
Controller
     │
     ▼
Service
     │
     ▼
Parameterized SQL
     │
     ▼
PostgreSQL
     │
     ▼
ApiResponse / Error Handler
     │
     ▼
JSON Response
```

The backend follows a **controller/service architecture**.

Controllers handle HTTP requests and responses, while services contain the application logic and database queries.

---

# Project Structure

```text
FullStack-Intern-Coding-Challenge/
│
├── FullStack Intern Coding Challenge - V1.1.pdf
├── README.md
│
├── backend/
│   ├── .env.example
│   ├── .gitignore
│   ├── app.js
│   ├── dblink.txt
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   │
│   ├── scripts/
│   │   ├── migrate.js
│   │   └── seed.js
│   │
│   └── src/
│       │
│       ├── app.js
│       │
│       ├── config/
│       │   ├── db.js
│       │   └── env.js
│       │
│       ├── middleware/
│       │   ├── auth.js
│       │   ├── authorize.js
│       │   ├── errorHandler.js
│       │   └── validate.js
│       │
│       ├── modules/
│       │   ├── admin/
│       │   ├── auth/
│       │   ├── owner/
│       │   ├── ratings/
│       │   ├── stores/
│       │   └── users/
│       │
│       └── utils/
│           ├── ApiError.js
│           ├── ApiResponse.js
│           └── validators.js
│
└── frontend/
    │
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    │
    └── src/
        │
        ├── App.jsx
        ├── index.css
        ├── main.jsx
        │
        ├── components/
        │   ├── Layout.jsx
        │   ├── ProtectedRoute.jsx
        │   └── ui/
        │
        ├── context/
        │   └── AuthContext.jsx
        │
        ├── lib/
        │   └── api.js
        │
        └── pages/
            │
            ├── Login.jsx
            ├── Register.jsx
            ├── Settings.jsx
            │
            ├── admin/
            │   ├── AdminDashboard.jsx
            │   ├── AdminStores.jsx
            │   └── AdminUsers.jsx
            │
            ├── owner/
            │   └── OwnerDashboard.jsx
            │
            └── user/
                └── StoresList.jsx
```

---

# Database Design

The application uses three primary tables:

```text
users
stores
ratings
```

It also uses a PostgreSQL enum:

```text
user_role
```

with the following values:

```text
admin
user
store_owner
```

---

## Users Table

```text
users
├── id
├── name
├── email
├── password
├── address
├── role
├── created_at
└── updated_at
```

| Column       | Type         | Description           |
| ------------ | ------------ | --------------------- |
| `id`         | UUID         | Primary key           |
| `name`       | VARCHAR(60)  | User name             |
| `email`      | VARCHAR(255) | Unique email          |
| `password`   | VARCHAR(255) | Bcrypt password hash  |
| `address`    | VARCHAR(400) | User address          |
| `role`       | user_role    | User role             |
| `created_at` | TIMESTAMPTZ  | Account creation time |
| `updated_at` | TIMESTAMPTZ  | Last update time      |

---

# Stores Table

```text
stores
├── id
├── name
├── email
├── address
├── owner_id
├── created_at
└── updated_at
```

| Column       | Type         | Description          |
| ------------ | ------------ | -------------------- |
| `id`         | UUID         | Primary key          |
| `name`       | VARCHAR(60)  | Store name           |
| `email`      | VARCHAR(255) | Store email          |
| `address`    | VARCHAR(400) | Store address        |
| `owner_id`   | UUID         | Assigned store owner |
| `created_at` | TIMESTAMPTZ  | Creation time        |
| `updated_at` | TIMESTAMPTZ  | Last update time     |

`owner_id` is a foreign key referencing `users.id`.

---

# Ratings Table

```text
ratings
├── id
├── store_id
├── user_id
├── rating
├── created_at
└── updated_at
```

| Column       | Type        | Description               |
| ------------ | ----------- | ------------------------- |
| `id`         | UUID        | Primary key               |
| `store_id`   | UUID        | Rated store               |
| `user_id`    | UUID        | User who submitted rating |
| `rating`     | SMALLINT    | Rating from 1 to 5        |
| `created_at` | TIMESTAMPTZ | Creation time             |
| `updated_at` | TIMESTAMPTZ | Last update time          |

A unique constraint on:

```text
(store_id, user_id)
```

ensures that a user can only have **one rating per store**.

---

# Database Relationships

```text
                    users
                      │
             ┌────────┴────────┐
             │                 │
             │                 │
        owner_id           user_id
             │                 │
             ▼                 ▼
          stores ◄──────── ratings
             │
             │
          store_id
             │
             └───────────────► ratings
```

More specifically:

* One user can create many ratings.
* One store can receive many ratings.
* A user can rate a particular store only once.
* A store can optionally have one assigned owner.
* Deleting a store cascades to its ratings.
* Deleting a user removes their ratings.
* Deleting a store owner sets the corresponding store's `owner_id` to `NULL`.

---

# Database Indexes

The migration creates indexes for frequently queried fields:

```text
ratings.store_id
ratings.user_id
stores.owner_id
users.email
users.role
```

These indexes improve lookup performance for authentication, ratings, owner dashboards, and administrative filtering.

---

# API Reference

## Base URL

Local development:

```text
http://localhost:5000
```

---

# Health Check

### GET `/health`

Public endpoint used to verify that the backend is running.

Example:

```http
GET /health
```

---

# Authentication API

## Register

### POST `/api/auth/register`

Creates a normal customer account.

Example request:

```json
{
  "name": "Jonathan Alexander Smith Jr",
  "email": "user@example.com",
  "password": "Password@123",
  "address": "123 Main Street, Mumbai, Maharashtra"
}
```

---

## Login

### POST `/api/auth/login`

Authenticates a user and returns a JWT.

Example:

```json
{
  "email": "user@example.com",
  "password": "Password@123"
}
```

Successful response contains:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {},
    "token": "<jwt>"
  }
}
```

---

## Change Password

### PATCH `/api/auth/change-password`

Requires authentication.

---

# Admin API

## Dashboard

### GET `/api/admin/dashboard`

**Role:** `admin`

Returns:

* Total users
* Total stores
* Total ratings
* Recent users
* Highest-rated stores

---

# Admin Users

## Create User

### POST `/api/admin/users`

**Role:** `admin`

Allows an administrator to create:

* Admin
* User
* Store owner

---

## List Users

### GET `/api/admin/users`

**Role:** `admin`

Supported query parameters:

```text
name
email
address
role
sortBy
sortOrder
```

Supported `sortBy` fields:

```text
name
email
address
created_at
```

Supported sort orders:

```text
ASC
DESC
```

---

## Get User

### GET `/api/admin/users/:id`

**Role:** `admin`

Returns detailed information about a specific user.

For store owners, owned stores are also included.

---

# Admin Stores

## Create Store

### POST `/api/admin/stores`

**Role:** `admin`

Creates a store and optionally assigns it to a store owner.

---

## List Stores

### GET `/api/admin/stores`

**Role:** `admin`

Supported query parameters:

```text
name
email
address
sortBy
sortOrder
```

Supported sorting fields:

```text
name
email
address
average_rating
created_at
```

The response includes store rating aggregates.

---

# Store API

## List Stores

### GET `/api/stores`

**Authentication:** Required

Returns stores along with:

* Average rating
* Total rating count
* Current user's rating

Supported query parameters:

```text
name
address
sortBy
sortOrder
```

Supported sorting:

```text
name
address
average_rating
```

---

## Get Store

### GET `/api/stores/:id`

**Authentication:** Required

Returns detailed information about a store and the authenticated user's rating.

---

# Ratings API

## Create Rating

### POST `/api/ratings/:storeId`

**Role:** `user`

Example:

```json
{
  "rating": 5
}
```

Allowed values:

```text
1
2
3
4
5
```

---

## Update Rating

### PATCH `/api/ratings/:storeId`

**Role:** `user`

Updates the authenticated user's existing rating.

---

# Store Owner API

## Owner Dashboard

### GET `/api/owner/dashboard`

**Role:** `store_owner`

Returns:

* Assigned stores
* Average rating
* Rating count
* Rating distribution
* Customer rating information

---

# Frontend Routes

| Route              | Access        | Description                |
| ------------------ | ------------- | -------------------------- |
| `/login`           | Public        | Login                      |
| `/register`        | Public        | Registration               |
| `/`                | Public        | Role-based redirect        |
| `/admin/dashboard` | Admin         | Admin dashboard            |
| `/admin/users`     | Admin         | User management            |
| `/admin/stores`    | Admin         | Store management           |
| `/stores`          | Authenticated | Store browsing and ratings |
| `/owner/dashboard` | Store Owner   | Owner dashboard            |
| `/settings`        | Authenticated | Account settings           |
| `/unauthorized`    | Public        | Unauthorized access        |
| `*`                | Public        | 404 page                   |

---

# Authentication Flow

The application uses JWT-based authentication.

```text
User
 │
 ▼
Login Form
 │
 ▼
POST /api/auth/login
 │
 ▼
Backend validates credentials
 │
 ▼
Password checked using bcrypt
 │
 ▼
JWT generated
 │
 ▼
JWT + User returned
 │
 ▼
Frontend stores authentication data
 │
 ▼
Axios interceptor
 │
 ├── Adds Authorization header
 │
 │   Authorization: Bearer <token>
 │
 ▼
Protected API
 │
 ▼
JWT verification
 │
 ▼
User loaded from database
 │
 ▼
Role authorization
 │
 ▼
Controller
```

The frontend stores the authentication information in `localStorage`.

The Axios client automatically attaches the JWT to API requests.

If the API returns:

```text
401 Unauthorized
```

the frontend clears the authentication state and redirects the user to the login page.

---

# Validation Rules

The backend uses `express-validator` for request validation.

## Name

```text
Required
20–60 characters
```

---

## Email

```text
Required
Valid email format
Normalized
```

---

## Password

Passwords must:

* Be at least 8 characters long
* Contain at least one uppercase letter
* Contain at least one special character

Example:

```text
Password@123
```

---

## Address

```text
Required
Maximum 400 characters
```

---

## Rating

```text
Required
Integer
Minimum: 1
Maximum: 5
```

---

## UUID Parameters

Store IDs and user IDs are validated as UUIDs before database operations.

---

# Getting Started

## Prerequisites

Make sure the following are installed:

* Node.js
* npm
* Git
* PostgreSQL-compatible database

The application is configured to work with **Neon PostgreSQL**.

---

# 1. Clone the Repository

```bash
git clone https://github.com/Sandesh633a/FullStack-Intern-Coding-Challenge.git
```

Navigate into the project:

```bash
cd FullStack-Intern-Coding-Challenge
```

---

# 2. Setup Backend

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

---

# 3. Configure Environment Variables

Copy the example environment file.

### Linux / macOS

```bash
cp .env.example .env
```

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

Open `.env` and configure the required values.

Example:

```env
PORT=5000
NODE_ENV=development

DATABASE_URL=postgresql://user:password@your-neon-host/database?sslmode=require

JWT_SECRET=replace_with_a_strong_random_secret
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173
```

---

# Environment Variables

| Variable         | Required | Default                 | Description                  |
| ---------------- | -------- | ----------------------- | ---------------------------- |
| `PORT`           | No       | `5000`                  | Backend port                 |
| `NODE_ENV`       | No       | `development`           | Environment                  |
| `DATABASE_URL`   | Yes      | —                       | PostgreSQL connection string |
| `JWT_SECRET`     | Yes      | —                       | JWT signing secret           |
| `JWT_EXPIRES_IN` | No       | `7d`                    | JWT expiration               |
| `CLIENT_URL`     | No       | `http://localhost:5173` | Frontend origin              |

The backend intentionally fails during startup if required environment variables such as `DATABASE_URL` or `JWT_SECRET` are missing.

---

# Database Setup

After configuring the database connection:

```bash
npm run migrate
```

The migration creates:

```text
pgcrypto extension
user_role enum
users table
stores table
ratings table
indexes
foreign keys
constraints
```

---

# Seed Demo Data

Run:

```bash
npm run seed
```

This creates the initial administrator account.

The seed operation is idempotent and uses conflict handling to avoid creating duplicate admin accounts when executed repeatedly.

---

# Running the Application

The recommended development setup uses two terminals.

---

## Terminal 1 — Backend

```bash
cd backend
npm run dev
```

Backend:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/health
```

---

## Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

The Vite development server proxies `/api` requests to the backend.

---

# Demo Admin Account

The seed script creates the following demo administrator:

```text
Email:    admin@storerating.com
Password: Admin@12345
Role:     admin
```

> **Important:** This credential is intended for local/demo use only. Do not use it in a production deployment. Replace it with a strong production credential.

---

# How the Main Features Work

## Store Rating Workflow

When a customer opens the store listing, the backend returns:

```text
Store
Average Rating
Rating Count
Current User Rating
```

If the user has never rated the store:

```text
POST /api/ratings/:storeId
```

is used.

If the user already has a rating:

```text
PATCH /api/ratings/:storeId
```

is used.

The database constraint:

```text
UNIQUE(store_id, user_id)
```

prevents duplicate ratings.

---

# Average Rating Calculation

Store ratings are aggregated using SQL.

Conceptually:

```text
Average Rating =
SUM(all ratings) / COUNT(all ratings)
```

The backend rounds the calculated average appropriately before returning it to the frontend.

---

# Admin Dashboard

The admin dashboard loads platform-level information including:

```text
Total Users
Total Stores
Total Ratings
Recent Users
Top Rated Stores
```

This gives administrators a high-level view of the platform.

---

# Owner Dashboard

The store owner dashboard retrieves the ratings belonging to the owner's assigned stores.

The frontend displays:

```text
Average Rating
Total Ratings
Rating Percentage
★★★★★
★★★★
★★★
★★
★
```

along with customer information.

---

# Responsive UI

The frontend uses Tailwind CSS and responsive layouts.

The shared layout supports:

* Desktop sidebar
* Mobile navigation
* Collapsible navigation
* Settings
* Logout
* Responsive content areas

The application also provides:

* Loading states
* Empty states
* Toast notifications
* Modal dialogs
* Error states
* Responsive tables/cards

---

# Security and Reliability

Several security practices are implemented.

## Password Hashing

Passwords are hashed using:

```text
bcryptjs
```

Plaintext passwords are not returned in authentication responses.

---

## JWT Authentication

Protected endpoints require:

```http
Authorization: Bearer <JWT>
```

The backend verifies the token before allowing access.

---

## Role-Based Authorization

The backend explicitly checks user roles.

For example:

```text
admin
    ↓
Admin routes

user
    ↓
Rating routes

store_owner
    ↓
Owner dashboard
```

Frontend protection is used for navigation, but backend authorization remains the authoritative security layer.

---

## Input Validation

User input is validated using:

```text
express-validator
```

Invalid requests are rejected before reaching business logic.

---

## Parameterized SQL

Database queries use parameterized values rather than directly concatenating user input into SQL.

This helps protect against SQL injection.

---

## Sort Allowlisting

Dynamic sorting is restricted to known fields and sort directions.

For example:

```text
sortBy=name
sortOrder=ASC
```

Unknown sort fields are not blindly inserted into SQL.

---

## Helmet

The backend uses Helmet to provide common HTTP security headers.

---

## CORS

Cross-origin requests are configured using the application's `CLIENT_URL`.

---

## Request Size Limit

JSON request bodies are limited to:

```text
10 KB
```

---

## Centralized Error Handling

The backend uses a centralized error handler and common response utilities:

```text
ApiError
ApiResponse
errorHandler
```

This keeps API responses consistent.

---

# Development Commands

## Backend

From `/backend`:

```bash
npm start
```

Starts the backend normally.

```bash
npm run dev
```

Starts the backend using Node's watch mode.

```bash
npm run migrate
```

Runs database migrations.

```bash
npm run seed
```

Creates the demo administrator.

---

# Frontend

From `/frontend`:

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Creates the production build.

```bash
npm run preview
```

Previews the production build locally.

```bash
npm run lint
```

Runs ESLint.

---

# Troubleshooting

## Frontend Cannot Reach Backend

Make sure the backend is running:

```bash
cd backend
npm run dev
```

Verify:

```text
http://localhost:5000/health
```

Then start the frontend:

```bash
cd frontend
npm run dev
```

---

## Backend Exits Immediately

Check `.env`.

At minimum, verify:

```env
DATABASE_URL=...
JWT_SECRET=...
```

---

## Database Connection Error

Verify:

* Database URL
* Database credentials
* Neon/PostgreSQL availability
* SSL configuration
* Network connectivity

---

## Admin Login Does Not Work

Run:

```bash
cd backend
npm run seed
```

Then use:

```text
Email: admin@storerating.com
Password: Admin@12345
```

---

## User Cannot Access Admin Page

Check the user's role.

Only:

```text
admin
```

can access administrative APIs and pages.

---

## Store Owner Dashboard Is Empty

Make sure the store has been assigned to a user with:

```text
role = store_owner
```

and that the store's:

```text
owner_id
```

references that user.

---

## Rating Is Rejected

Make sure the rating is an integer between:

```text
1
```

and

```text
5
```

A user can only have one rating per store. To change an existing rating, the update endpoint is used.

---

# API Summary

| Category     | Endpoint                    | Method | Role          |
| ------------ | --------------------------- | ------ | ------------- |
| Health       | `/health`                   | GET    | Public        |
| Auth         | `/api/auth/register`        | POST   | Public        |
| Auth         | `/api/auth/login`           | POST   | Public        |
| Auth         | `/api/auth/change-password` | PATCH  | Authenticated |
| Admin        | `/api/admin/dashboard`      | GET    | Admin         |
| Admin Users  | `/api/admin/users`          | POST   | Admin         |
| Admin Users  | `/api/admin/users`          | GET    | Admin         |
| Admin Users  | `/api/admin/users/:id`      | GET    | Admin         |
| Admin Stores | `/api/admin/stores`         | POST   | Admin         |
| Admin Stores | `/api/admin/stores`         | GET    | Admin         |
| Stores       | `/api/stores`               | GET    | Authenticated |
| Stores       | `/api/stores/:id`           | GET    | Authenticated |
| Ratings      | `/api/ratings/:storeId`     | POST   | User          |
| Ratings      | `/api/ratings/:storeId`     | PATCH  | User          |
| Owner        | `/api/owner/dashboard`      | GET    | Store Owner   |

---

# Design Principles

The project follows several practical software-engineering principles:

### Separation of Concerns

Frontend UI, API communication, backend controllers, services, middleware, and database configuration are separated.

### Reusable Components

Common UI elements and layout functionality are shared across pages.

### Centralized Authentication

Authentication state is managed through:

```text
AuthContext
```

and API requests are handled through the shared Axios client.

### Centralized Validation

Backend validation is handled through reusable middleware and validators.

### Database Integrity

Foreign keys, unique constraints, and indexes are used to maintain data integrity and improve query performance.

### Role-Based Access

Permissions are based on the authenticated user's role rather than only frontend navigation.

---

# Future Improvements

Potential future enhancements include:

* Store images
* Pagination for large user/store/rating lists
* Email verification
* Password reset via email
* Refresh-token authentication
* More detailed analytics
* Store categories
* Rating comments/reviews
* Advanced search and filtering
* Automated database migrations with version tracking
* Automated tests
* CI/CD pipeline
* Production deployment configuration
* Rate limiting
* Audit logs for administrative actions

---

# License

The backend package declares the:

```text
ISC
```

license.

There is currently no separate repository-level `LICENSE` file.

---

# Assignment Reference

The repository contains the original coding challenge specification:

```text
FullStack Intern Coding Challenge - V1.1.pdf
```

The implementation in this repository is organized around the requirements described in that specification.

---

# Project Summary

StoreRating demonstrates a complete full-stack application with:

```text
React
   +
Vite
   +
Tailwind CSS
   +
Express.js
   +
JWT Authentication
   +
Role-Based Authorization
   +
PostgreSQL
```

The system supports three distinct roles:

```text
ADMIN
 │
 ├── Manage Users
 ├── Manage Stores
 └── View Platform Statistics

USER
 │
 ├── Browse Stores
 ├── View Ratings
 ├── Submit Ratings
 └── Update Ratings

STORE OWNER
 │
 ├── View Assigned Stores
 ├── View Rating Statistics
 ├── View Rating Distribution
 └── View Customer Ratings
```

The result is a modular full-stack store-rating platform designed with a clear separation between the frontend, REST API, business logic, authentication/authorization, and relational database.
