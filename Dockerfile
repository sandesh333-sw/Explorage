# Use official Node.js 18 Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependencies files first
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the rest of the application
COPY . .


# Expose app port
EXPOSE 8080

# Start app
CMD ["node", "app.js"]
