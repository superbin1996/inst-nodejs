#### list of running containers
```sh
docker ps
```
#### "-a" flag allows list of all containers
```sh
docker ps -a
```
#### list of images locally store on local host
```sh
docker images
```
#### inspect specified image
```sh
docker inspect <imageID>
```
#### Create new version of image. "-f" is used to specify the Dockerfile to use to build the image. '-f' and fileName are optional. "-t" flag allows interact with container shell. '.' is place where stores build context 

- ex: 
```sh
docker build -t nodeapp:v3 -f Dockerfile.dev .
```
#### inspect port mapping configuration of a container
```sh
docker port <containerID>
```

#### `-d` flag allows detach terminal from running container
```sh
docker run -d <imageName>
```

#### `-p` flag allow run container from terminal mapping to specified port. `--name` flag allows naming container.  
```sh
docker run -p <localMachinePort>:<containerPort> --name <containerName> <imageName>
```

#### "-v" flag allows to create a anonymous volume
#### For anonymous volume path, the ":" syntax is to synchronize current local directory to the working dir in container. Placing those inside "" to avoid text convention conflix
```sh
docker run -p 8080:8080 -v "$(pwd):<WORKDIR>" <containerName> <imageName>
```

#### At this ex, the second anonymous volume is to avoid synchronize directory with non-exist folder in local directory
```sh
docker run -p 8080:8080 -v "$(pwd):<WORKDIR>" -v <path> <containerName> <imageName>
```

#### `exec` flag allows execute a command within the container. `-aux` flag allows full process listing of anything inside this container. `/bin/sh` get to WORKDIR to execute code.    

Navigate to WORKDIR in terminal
```sh
docker exec -it <containerID> /bin/sh
```

```sh
docker exec -it <containerID> <commandWantToRun> -aux 
```

```sh
docker exec -it 72c6dba4b10d ps -aux
```

#### run command shell from container
- ex: 
```sh
docker exec -it 72c6dba4b10d sh ps -aux
```

#### restart container
```sh
docker restart <containerID||containerName>
```

#### stop container
```sh
docker stop <containerID||containerName>
```

#### start container
```sh
docker start <containerID||containerName>
```
#### gain access to logging information for a specified container, `-t` allows add timestamps information
```sh
docker logs <containerID> -t
```

#### remove specified container
```sh
docker rm <containerID>
```

#### remove specified image
```sh
docker rmi <imageID>
```

#### clear docker cache
```sh
docker builder prune
```
