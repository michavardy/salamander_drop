# Use the official Node.js 14 image as the base image
FROM node:14 AS build

# make public / src directories
RUN mkdir ./public
RUN mkdir ./src
RUN mkdir ./node_modules
RUN mkdir ./src/images
RUN mkdir /src/components
RUN mkdir ./public/din_fonts

# Copy babelrc
COPY .babelrc ./

# Copy webpack.config
COPY webpack.config.js ./

# Copy Public
COPY ./public/* ./public/

# Copy src
COPY ./src/* ./src/

# copy images
COPY ./src/images/* ./src/images

# copy components
COPY ./src/components/* ./src/components

# copy fonts
COPY ./public/din_fonts/* ./public/din_fonts

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Copy node modules
# COPY ./node_modules* ./

# Install the dependencies in the container
RUN npm install

# Expose port 3000 so that the container can be accessed over HTTP
EXPOSE 3000

# Start npm server
CMD ["npm", "start"]