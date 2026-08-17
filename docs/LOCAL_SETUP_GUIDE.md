# Local Setup Guide — Backend & Frontend

This guide provides step-by-step instructions to run the **Java 17 Spring Boot Backend API** and the **React 19 Frontend Web Application & Admin Panel** on your local machine.

---

## 📋 Prerequisites

Before starting, ensure you have the following installed on your system:

- **Java JDK 17** or higher (`java -version`)
- **Apache Maven 3.8+** (`mvn -version`)
- **Node.js 18+** & **npm 9+** (`node -v`, `npm -v`)
- **PostgreSQL 14+** (Local or Manus-managed instance)
- **Git** (`git --version`)

---

## 🚀 Part 1: Running the Java 17 Spring Boot Backend

### Step 1: Navigate to the Backend Folder

```bash
cd backend
```

### Step 2: Verify Configuration

The backend reads PostgreSQL and integration credentials from secure environment variables. Local development defaults to `localhost:5432/brothersphotography_db`; Manus-managed deployments should provide the same variables through their secure environment configuration.

> 🔒 **Note**: `application-local.yml` is gitignored to protect secret database passwords and API keys.

### Step 3: Build & Compile the Backend

```bash
mvn clean compile
```

### Step 4: Run the Backend Application

```bash
mvn spring-boot:run
```

Once started, the backend server will run at:
- **Base API URL**: `http://localhost:8080/api/v1`
- **Swagger OpenAPI 3 UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI Json Docs**: `http://localhost:8080/v3/api-docs`

---

## 🎨 Part 2: Running the React 19 Frontend & Admin Panel

### Step 1: Open a New Terminal & Navigate to the Frontend Folder

```bash
cd frontend
```

### Step 2: Install Node Dependencies

```bash
npm install
```

### Step 3: Start the Vite Local Development Server

```bash
npm run dev
```

The frontend development server will launch at:
- **Public Website**: `http://localhost:5173/`
- **CMS Admin Panel**: `http://localhost:5173/admin`
- **Admin Login**: `http://localhost:5173/admin/login`

---

## 🔑 Initial Admin Credentials

When the backend starts for the first time, it automatically bootstraps the initial super administrator user into the PostgreSQL database:

| Field | Initial Bootstrap Value |
| :--- | :--- |
| **Admin Login URL** | `http://localhost:5173/admin/login` |
| **Email** | `admin@brothersphotographyj.com` |
| **Password** | `Admin@123456` |
| **Role** | `ROLE_ADMIN` |

> You can also click **"Sign In with Google OAuth 2.0"** on the login page to authenticate via Google.

---

## 🐳 Part 3: Running Everything via Docker Compose (Optional)

If you prefer to run PostgreSQL, the Java Backend, and the React Frontend simultaneously using Docker:

```bash
# Run from the root directory
docker-compose up --build
```

- **Frontend Website & Admin**: `http://localhost`
- **Backend Swagger API**: `http://localhost:8080/swagger-ui.html`
- **PostgreSQL Database**: `localhost:5432`

---

## 🔍 Useful Scripts & Commands

### Frontend Scripts (`cd frontend`)

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Starts Vite dev server with hot reload |
| `npm run build` | Runs TypeScript compilation & builds static assets in `dist/` |
| `npm run preview` | Previews production build locally |
| `npm run lint` | Runs `oxlint` for fast code linting |
| `npm run typecheck` | Validates TypeScript types across frontend |

### Backend Scripts (`cd backend`)

| Command | Purpose |
| :--- | :--- |
| `mvn spring-boot:run` | Runs backend API locally |
| `mvn clean package` | Compiles & builds executable JAR file |
| `mvn test` | Runs Spring Boot unit & integration tests |
