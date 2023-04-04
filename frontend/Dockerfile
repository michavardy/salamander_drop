# Use the official Node.js 14 image as the base image
FROM node:14 AS build

# make public / src directories
RUN mkdir ./public
RUN mkdir ./src
RUN mkdir ./node_modules

# Copy babelrc
COPY .babelrc ./

# Copy webpack.config
COPY webpack.config.js ./

# Copy Public
COPY ./public/* ./public/

# Copy src
COPY ./src/* ./src/

# Copy the package.json and package-lock.json files to the container
COPY ./package*.json ./

# Copy node modules
#COPY ./node_modules* ./
# Install the dependencies in the container
RUN npm install

# Expose port 3000 so that the container can be accessed over HTTP
EXPOSE 3000

# Start npm server
CMD ["npm", "start"]
