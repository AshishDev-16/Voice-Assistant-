# Use Node 20 as base
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Expose the API port (Render/Railway use the PORT env var automatically)
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
