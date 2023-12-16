FROM node:alpine
# The working directory is the location where the files and folders are created, modified, or deleted by the commands
WORKDIR /usr/src/app
# Copy every thing from specified directory (base is where Dockerfile locate) to specified directory (base is where WORKDIR locate)
COPY package.json . 
RUN npm install
COPY . .
EXPOSE 5000
# Command to run after building container
CMD [ "npm", "run", "start" ]
