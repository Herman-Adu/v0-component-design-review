FROM node:22-alpine

# Install the MCP server globally so the binary is on PATH
RUN npm install -g @bschauer/strapi-mcp-server@2.8.0 --silent

# Entrypoint generates config from env vars at container start
COPY docker-entrypoint.sh /docker-entrypoint.sh
# Strip Windows CRLF line endings and set executable
RUN sed -i 's/\r//' /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh

# Container stays alive; MCP sessions connect via docker exec -i
ENTRYPOINT ["/docker-entrypoint.sh"]
