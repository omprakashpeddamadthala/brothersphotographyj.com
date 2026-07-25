# GitHub Actions CI/CD Pipeline Guide

This repository includes automated GitHub Actions workflows for continuous integration, clean testing, building, and pushing Docker images to Docker Hub.

---

## 🚀 Workflow Overview

Location: [docker-ci-cd.yml](file:///d:/brothersphotography.com/brothersphotographyj.com/.github/workflows/docker-ci-cd.yml)

### 1. Backend Pipeline (`backend`)
- **Environment**: Java 17 (Eclipse Temurin JDK)
- **Steps**:
  1. Checkout code
  2. Setup JDK 17 & Maven dependency caching
  3. Clean compile & test (`mvn clean package`)
  4. Docker Login & BuildX setup
  5. Build & Push Docker image to Docker Hub repository:
     - `omprakashornold/brothersphotographyj-backend:latest`
     - `omprakashornold/brothersphotographyj-backend:${{ github.sha }}`

### 2. Frontend Pipeline (`frontend`)
- **Environment**: Node.js 20 & Nginx 1.27 Alpine
- **Steps**:
  1. Checkout code
  2. Setup Node.js 20 & npm caching
  3. Clean build (`npm ci && npm run build`)
  4. Docker Login & BuildX setup
  5. Build & Push Docker image to Docker Hub repository:
     - `omprakashornold/brothersphotographyj-frontend:latest`
     - `omprakashornold/brothersphotographyj-frontend:${{ github.sha }}`

---

## 🔑 Required GitHub Secrets

To allow GitHub Actions to push Docker images to your Docker Hub account, add these two Secrets to your GitHub repository (**Settings > Secrets and variables > Actions**):

| Secret Name | Description | Example Value |
| :--- | :--- | :--- |
| `DOCKERHUB_USERNAME` | Your Docker Hub Username | `omprakashornold` |
| `DOCKERHUB_TOKEN` | Docker Hub Personal Access Token | `dchp_...` |

---

## 🐳 Docker Hub Repositories

- **Backend Image**: `omprakashornold/brothersphotographyj-backend`
- **Frontend Image**: `omprakashornold/brothersphotographyj-frontend`

To pull and run locally:
```bash
# Pull images
docker pull omprakashornold/brothersphotographyj-backend:latest
docker pull omprakashornold/brothersphotographyj-frontend:latest

# Run containers
docker run -d -p 8080:8080 --name backend-api omprakashornold/brothersphotographyj-backend:latest
docker run -d -p 80:80 --name frontend-app omprakashornold/brothersphotographyj-frontend:latest
```
