# Use Node.js LTS as the base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the port (make sure it matches your server, e.g., 5001)
EXPOSE 5001

# Start the server
CMD ["npm", "run", "dev"]