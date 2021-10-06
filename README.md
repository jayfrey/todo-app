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

### Run Application
```sh
cd todo-app

cd backend/ && npm run build && npm start
```

### Run API with Postman
Import the collection [here](https://github.com/jayfrey/todo-app/blob/main/Todo.postman_collection.json)
