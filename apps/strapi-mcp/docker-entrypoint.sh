#!/bin/sh
set -e

# Validate required env vars
if [ -z "${STRAPI_MCP_API_URL}" ] || [ -z "${STRAPI_MCP_API_KEY}" ]; then
  echo "ERROR: STRAPI_MCP_API_URL and STRAPI_MCP_API_KEY must be set" >&2
  exit 1
fi

# Write config from env vars — never touches host filesystem or git
mkdir -p /root/.mcp
cat > /root/.mcp/strapi-mcp-server.config.json << EOF
{
  "v0local": {
    "api_url": "${STRAPI_MCP_API_URL}",
    "api_key": "${STRAPI_MCP_API_KEY}",
    "version": "5.*"
  }
}
EOF

echo "strapi-mcp: config written for ${STRAPI_MCP_API_URL}" >&2
echo "strapi-mcp: container ready — awaiting MCP sessions via docker exec" >&2

# Keep container alive; MCP client connects with:
#   docker exec -i v0_strapi_mcp strapi-mcp-server
exec sleep infinity
