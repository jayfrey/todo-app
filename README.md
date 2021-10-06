# Todo Web App

### Tech Stack

* [Node.js](https://nodejs.org/en/)
* [Express.js](https://expressjs.com/)
* [React](https://reactjs.org/)
* [SQLite](https://www.sqlite.org/index.html)

#### Other dependecies
* [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd)
* [bootstrap](https://getbootstrap.com/)
* [axios](https://github.com/axios/axios)

### Requirements
- [x] Entering text in the 'add project' input and hitting enter will add it as an item to the 'todo' list.
- [x] Three columns for 'Todo', 'In Progress', and 'Done' projects.
- [x] Projects should be draggable and sortable within the same column.
- [x] Projects can also be dragged between adjacent columns.
- [x] The total at the top of each column reflects the number of projects.
- [x] The global total reflects the global sum of projects.

### API List
* **GET** api/project/all
* **POST** api/project/get-by-status
* **POST** api/project/add
* **PUT** api/project/update

### Installation
Navigate to the app folder in terminal and run the following commands in sequence.
#### Install Dependencies
```sh
cd todo-app
cd frontend/ && npm install
cd ../backend/ && npm install
```
#### Build Application
```sh
npm run build && npm start
```
### Run Application
Once it's done. Click [here](http://localhost:3001/) to open the application.

### Why Node.js & React? 
Node.js is much prefeable for I/O intensive applications due to its asynchronous event loop, which enables CPU intensive tasks run in background without affecting main event loop. Hence, it would be a great addition for applications that grow over time. With combination of React, provides smoother transition experience between pages. I picked up these techs primarily because they have large community and rich libraries, and learning something new always drive me to go extra mile for the result.

### Run API with Postman
Import the collection [here](https://github.com/jayfrey/todo-app/blob/main/Todo.postman_collection.json)
