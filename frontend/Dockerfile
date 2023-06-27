#########################################
            ## Stage 1 ## build
#########################################

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
COPY ./src/images/* ./src/images/

# copy components
COPY ./src/components/* ./src/components/

# copy fonts
COPY ./public/din_fonts/* ./public/din_fonts/

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Copy node modules
# COPY ./node_modules* ./

# Install the dependencies in the container
RUN npm install

# Expose port 3000 so that the container can be accessed over HTTP
EXPOSE 3000

# Build React Static
RUN npm run build

# for development only 
#CMD ["/bin/bash"]
#docker build -t frontend .
#docker run -it --rm frontend sh
#########################################
            ## Stage 2 ## serve
#########################################

# Stage 2: Serve the built application
FROM nginx:alpine

# Copy the mime.types file to the Nginx configuration directory
#COPY mime.types /etc/nginx/mime.types

# Copy the built static files to the appropriate location in the image
COPY --from=build /build /usr/share/nginx/html

# Copy the Nginx configuration file to the appropriate location in the image
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 3000 so that the container can be accessed over HTTP
EXPOSE 3000

# Start the nginx server
CMD ["nginx", "-g", "daemon off;"]
