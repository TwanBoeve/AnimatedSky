# Animated Sky

## Starting the project for development purpose
### Using Docker 
Starting the project can either be done by running the Dockerfile or by doing this process manually.
To create the docker container, first build it using:
```
$ docker build -t animated-sky .
```
This will build the docker container and give it the tag animated-sky.
Then this container can be start on port 3000 using:
```
$ docker run -p 3000:3000 animated-sky
```

### Running it manually
Alternatively, you can start the project for development by simply using npm. First install the package, then start the server:
```
$ npm i
$ npm start
```