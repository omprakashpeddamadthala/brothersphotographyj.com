#!/bin/sh
# Generate env.js with runtime environment variables
echo "Generating env.js with VITE_API_BASE_URL=${VITE_API_BASE_URL}"
cat <<EOF > /usr/share/nginx/html/env.js
window.__ENV__ = {
  VITE_API_BASE_URL: "${VITE_API_BASE_URL:-http://localhost:8080/api/v1}"
};
EOF
