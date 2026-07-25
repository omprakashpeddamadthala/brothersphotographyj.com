# GitHub Actions CI/CD & Railway Live Deployment Guide

This repository features automated GitHub Actions workflows for continuous integration, clean testing, building multi-stage Docker images, pushing to Docker Hub, and triggering instant Railway live deployments.

---

## 🚀 Workflow Pipeline Architecture

Location: [.github/workflows/docker-ci-cd.yml](file:///d:/brothersphotography.com/brothersphotographyj.com/.github/workflows/docker-ci-cd.yml)

### 1. Backend Service Pipeline
- **Clean Build**: JDK 17 (Eclipse Temurin) + Maven (`mvn clean package`)
- **Docker Push**: `omprakashornold/brothersphotographyj-backend:latest`
- **Railway Deployment**: Triggers Railway to pull the latest Docker image and deploy live to production.

### 2. Frontend Service Pipeline
- **Clean Build**: Node.js 20 + Vite (`npm install && npm run build`)
- **Docker Push**: `omprakashornold/brothersphotographyj-frontend:latest`
- **Railway Deployment**: Triggers Railway to pull the latest Nginx image and deploy live to production.

---

## 🔑 GitHub Repository Secrets Configuration

To enable automated Docker Hub pushing & Railway deployments, go to your GitHub repository (**Settings > Secrets and variables > Actions**) and add:

| Secret Name | Required / Optional | Description | Example |
| :--- | :--- | :--- | :--- |
| `DOCKERHUB_USERNAME` | **Required** | Docker Hub Username | `omprakashornold` |
| `DOCKERHUB_TOKEN` | **Required** | Docker Hub Personal Access Token | `dchp_...` |
| `RAILWAY_BACKEND_WEBHOOK_URL` | Optional (Recommended) | Railway Backend Service Deploy Webhook | `https://backboard.railway.app/deploy/...` |
| `RAILWAY_FRONTEND_WEBHOOK_URL` | Optional (Recommended) | Railway Frontend Service Deploy Webhook | `https://backboard.railway.app/deploy/...` |
| `RAILWAY_TOKEN` | Optional | Railway API Project Token | `ral_...` |

---

## ⚙️ Railway Live Environment Variables

Set these environment variables inside your Railway Service Dashboard (**Service > Variables**):

### 1. Railway Backend Service Variables
```properties
SPRING_PROFILES_ACTIVE=prod
PORT=8080
SPRING_DATASOURCE_URL=postgresql://altaria.proxy.rlwy.net:45572/railway
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=bjZTBmmEqgEgNOdyJzAZcDDgPgfGkGpA
HIBERNATE_DDL_AUTO=update

CLOUDINARY_CLOUD_NAME=brothersphotographyj
CLOUDINARY_API_KEY=brothersphotographyj
CLOUDINARY_API_SECRET=b08qKDml1Ws5jyykoMT6-STrVP4

JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250655368566D5971
JWT_EXPIRATION_MS=86400000

ALLOWED_ORIGINS=https://brothersphotographyj.com,https://your-frontend-domain.up.railway.app,http://localhost:5173

ADMIN_INITIAL_EMAIL=admin@brothersphotographyj.com
ADMIN_INITIAL_PASSWORD=Admin@123456
```

### 2. Railway Frontend Service Variables
```properties
VITE_API_BASE_URL=https://your-backend-domain.up.railway.app/api/v1
```

---

## 📌 How to Obtain Railway Deploy Webhooks

1. Open your [Railway Dashboard](https://railway.app).
2. Select your **Backend** service > Go to **Settings** tab.
3. Scroll to **Deploy Triggers** / **Deploy Webhook**.
4. Copy the URL and add it to GitHub Secrets as `RAILWAY_BACKEND_WEBHOOK_URL`.
5. Repeat for your **Frontend** service and add as `RAILWAY_FRONTEND_WEBHOOK_URL`.
