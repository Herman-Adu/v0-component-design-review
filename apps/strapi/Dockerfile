FROM node:20-alpine
WORKDIR /app

# Install dependencies first (layer cache)
COPY package.json ./
RUN npm install --legacy-peer-deps

# Copy application
COPY . .

# Build admin panel
RUN npm run build

EXPOSE 1337
CMD ["npm", "run", "start"]
