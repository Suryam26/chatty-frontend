# Use an official node runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the current directory contents into the container
COPY . .

# Build the app
RUN npm run build

# Serve the app
RUN npm install -g serve
CMD ["npx", "serve", "-s", "build"]

# Expose port
EXPOSE 3000
