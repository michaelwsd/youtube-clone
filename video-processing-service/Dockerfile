# Builder a docker image for development (not production) purposes

# specifies the base image for the container
FROM node:18

# specify working directory in the container, commands will be executed relative to this directory
WORKDIR /app

# install ffmpeg
# apt-get is the command to install, update or remove software packages on Ubuntu (Debian-based distribution)
RUN apt-get update && apt-get install -y ffmpeg 

# copy files from package.json and package-lock.json
COPY package*.json .

# install all dependencies listed in package.json into the container
# run this after copying package.json
RUN npm install

# copy all remaining application files into the container's working directory
# first . is the source location, where Dockerfile is located
# second . is the destination inside the Docker image, which is /app
COPY . .

# inform Docker that container will listen on port 3000
EXPOSE 3000 

# run app (running app is CMD, execute commands is RUN, only one CMD allowed)
CMD ["npm", "start"]


