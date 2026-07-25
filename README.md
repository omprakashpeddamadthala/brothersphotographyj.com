# Brothers Photography — Full Stack Application Architecture

A full-stack, enterprise-grade, CMS-driven web application comprising a **Java 17 Spring Boot Backend REST API** and a **React 19 TypeScript Frontend Application & Admin Panel**.

---

## Project Structure

```text
brothersphotographyj.com/
├── backend/                  # Java 17 Spring Boot REST API Service
│   ├── src/                  # Clean Architecture (Controller, Service, Repository, Entity, DTO, Security)
│   ├── pom.xml               # Maven configuration
│   └── Dockerfile            # Multi-stage Docker build for backend API
│
├── frontend/                 # React 19 + TypeScript + Vite + Admin Panel
│   ├── src/                  # Components, Pages, Admin Panel, CmsContext, Tailwind styles
│   ├── public/               # Static assets & favicons
│   ├── package.json          # Node.js dependencies
│   ├── vite.config.ts        # Vite configuration
│   └── Dockerfile            # Multi-stage Nginx production container
│
├── docker-compose.yml        # Orchestration for PostgreSQL + Backend + Frontend
└── README.md                 # Project documentation
```

---

## 🛠️ Backend Stack (`backend/`)

- **Language**: Java 17
- **Framework**: Spring Boot 3.3.2
- **Database**: PostgreSQL
- **Security**: Spring Security + JWT Authentication + Google OAuth 2.0
- **Cloud Storage**: Cloudinary SDK (Direct image uploads & optimization)
- **Caching**: Spring Cache (`ConcurrentMapCacheManager`)
- **API Docs**: Swagger / OpenAPI 3.0 (`http://localhost:8080/swagger-ui.html`)

### Running Backend Locally

```bash
cd backend
mvn spring-boot:run
```

---

## 🎨 Frontend Stack (`frontend/`)

- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 + Framer Motion
- **CMS Admin Panel**: Accessible at `/admin` (`/admin/login`)
- **State & API**: TanStack React Query + `CmsContext`

### Running Frontend Locally

```bash
cd frontend
npm install
npm run dev
# App runs at http://localhost:5173
```

---

## 🐳 Docker Deployment

To launch PostgreSQL, Backend API, and Frontend Web Application with a single command:

```bash
docker-compose up --build
```

- **Frontend Website & Admin Panel**: `http://localhost`
- **Backend Swagger API Docs**: `http://localhost:8080/swagger-ui.html`
- **PostgreSQL Database**: `localhost:5432`
