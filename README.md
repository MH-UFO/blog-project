A beautiful , simple and responsive blog website built by Mohammad Hosein Khajeh Mansouri.

## Features
- Responsive
- Beautiful
- Simple
- Easy to use
- Mobile friendly
- adding new blogs
- editing blogs
- deleting blogs
- both dark mode and light mode

## Technologies
- HTML
- CSS
- JavaScript
- node.js
- npm modules(express , body-parser , ejs)
- PostgresSQL

## Installation
- Clone the repository
- Install the dependencies(npm i)
- change the db code in index.js to your own database code(database , password , port)
- run this code in postgresql:
```
CREATE TABLE blogs(
    id SERIAL PRIMARY KEY,
    title TEXT,
    author VARCHAR(60),
    article TEXT,
);
```
- npm start
- Go to localhost:3000
- 