# CI/CD and Secure Deployment Configuration

This repository uses GitHub Actions to build, test, and publish the backend and frontend Docker images. Runtime credentials are intentionally not committed to the repository.

## GitHub Actions secrets

Configure these repository secrets under **Settings → Secrets and variables → Actions** when Docker image publishing is required:

| Secret | Purpose |
|---|---|
| `DOCKERHUB_USERNAME` | Docker registry username |
| `DOCKERHUB_TOKEN` | Docker registry access token with image push permission |

## Manus-managed PostgreSQL runtime variables

Configure the following variables in the target Manus backend environment. Do not place real values in source files, documentation, or commits:

```properties
SPRING_PROFILES_ACTIVE=prod
PORT=8080
SPRING_DATASOURCE_URL=jdbc:postgresql://<manus-db-host>:<port>/<database>?sslmode=require
SPRING_DATASOURCE_USERNAME=<database-user>
SPRING_DATASOURCE_PASSWORD=<database-password>
HIBERNATE_DDL_AUTO=validate
APP_DATABASE_INITIALIZER_ENABLED=false
```

The local development defaults remain `localhost:5432/brothersphotography_db` with the standard local PostgreSQL user. The production database connection must be supplied through secure environment variables.

## Optional application variables

Configure these values through the target environment’s secret manager when the corresponding integrations are enabled:

```properties
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
JWT_SECRET=<long-random-secret>
JWT_EXPIRATION_MS=86400000
ALLOWED_ORIGINS=https://<manus-frontend-domain>,http://localhost:5173
ADMIN_INITIAL_EMAIL=<admin-email>
ADMIN_INITIAL_PASSWORD=<temporary-admin-password>
```

## Frontend API configuration

For a same-origin deployment, use:

```properties
VITE_API_BASE_URL=/api/v1
```

For local development, the frontend may override this value with `VITE_API_BASE_URL=http://localhost:8080/api/v1`.
