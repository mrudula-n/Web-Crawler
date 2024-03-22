# Use an official Node runtime as a parent image
FROM node:21.7.1

# Set the working directory in the container
# It's common to use /usr/src/app as the full path for clarity and convention
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Correct the CMD to run your application as you specified
CMD ["node", "src/index.js"]