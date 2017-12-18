# chat-app-api
A very simple NodeJS app that provides chat data, that currently only has 3 users by default,

## Installation
After cloning the repo and entering the folder, run the following command
```
npm install
```

## Startup
The following command will start the app on **http://localhost:8888**
```
node index.js
```

## Usage 
#### /login/:username
Login in as the given user (current users are: stefan, joe, rewaz). This will set a cookie so that all subsequent requests are from that user.

#### /chats/
Get a list of all the chats that user has between his buddies. The chats will only show the last message

#### /chats/:buddy
Get the entire conversation between the cookie-logged-in user and their buddy

#### / 
An endpoint to say who is logged in, this is user-friendly not data.

#### *
Any other endpoint will cause a 404 not found

## Debug
Something weird happening? Check the command line, it will provide info on all requests the app recieved
