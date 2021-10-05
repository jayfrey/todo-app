import React from "react";
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const list = {
  'to_do' : 'toDoList',
  'in_progress' : 'inProgressList',
  'done' : 'doneList'
};

const count = {
  'to_do' : 'toDoCount',
  'in_progress' : 'inProgressCount',
  'done' : 'doneCount'
};

class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      toDoList: [], 
      inProgressList: [], 
      doneList: [],
      toDoCount: 0,
      inProgressCount: 0,
      doneCount: 0,
      totalProjects: 0,
      projectName: '' 
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.fetchProjects();
    
  }

  fetchProjects = async () => {

    Object.keys(list).map( (key, index) => {    
      this.getProjectByStatus({'status': key});
    });
  }

  getProjectByStatus = async (req) => {
    axios.post('/api/project/get-by-status', req)
    .then( res => {
      console.log(res);
      this.setState({
        [list[req.status]]: res.data.data,
        [count[req.status]]: res.data.count
      });
      this.updateTotalProject();
    });
  }

  addProject = async (req) => {
    axios.post('/api/project/add', req)
    .then( res => {

    });
  }

  updateProject = async (req) => {
    axios.put('/api/project/update', req)
    .then( res => {

    });
  }

  reorder = (list, startIndex, endIndex) => {
    console.log('onDragEnd');
    console.log('startIndex: ' + startIndex);
    console.log('endIndex: ' + endIndex);
    const result = Array.from(list);
    console.log('result: ' + JSON.stringify(result));
    const [removed] = result.splice(startIndex, 1);
    console.log('result 1st splice: ' + JSON.stringify(result));
    result.splice(endIndex, 0, removed);
    console.log('result 2nd splice: ' + JSON.stringify(result));
  }

  updateTotalProject = async () => {
    this.setState({
      totalProjects: this.state.toDoCount + this.state.inProgressCount + this.state.doneCount
    });
  }

  handleChange(e) {
    this.setState({ projectName: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.projectName.length === 0) {
      return;
    }
    const newItem = {
      name: this.state.projectName,
      status: 'to_do'
    };

    this.addProject(newItem);
    this.getProjectByStatus({'status': 'to_do'});
    this.setState(state => ({
      projectName: ''
    }));
  }

  onDragEnd = (result) => {
    console.log("onDragEnd");
    console.log('result: ' + JSON.stringify(result));
    const { source, destination } = result;
    // dropped outside the list
    if (!destination) {
        return;
    }

    if (source.droppableId === destination.droppableId) {

        console.log("same");
    } else {
        console.log("diff");

        // const request = {
        //   id: result.draggableId.split("-")[1],
        //   status: destination.droppableId.replace("-","_"),
        //   position: destination.index
        // }

        // console.log(request);
        // this.updateProject(request);
        this.move(source, destination);
        
        // this.fetchProjects();
    }
  };

  move = (source, destination) => {
      var sourceStatus = source.droppableId.replace("-","_");
      var sourceList = Array.from(this.state[list[sourceStatus]]);
      var sourcePos = source.index;
      console.log('sourceList: ' + JSON.stringify(sourceList));
      console.log('sourcePos: ' + JSON.stringify(sourcePos));


      var desStatus = destination.droppableId.replace("-","_");
      var desList = Array.from(this.state[list[desStatus]]);
      var desPos = destination.index;
      console.log('desList: ' + JSON.stringify(desList));
      console.log('desPos: ' + JSON.stringify(desPos));



      const [removed] = sourceList.splice(sourcePos, 1);
      console.log('sourceList: ' + JSON.stringify(sourceList));
      desList.splice(desPos, 0, removed);

      this.setState({
        [list[sourceStatus]]: sourceList,
        [list[desStatus]]: desList,
        [count[sourceStatus]]: this.state[count[sourceStatus]]-1,
        [count[desStatus]]: this.state[[count[desStatus]]]+1,
      });
  }

  render() {
    return (
      <div className="container-fluid p-5">
        <div className="d-flex mb-3">
          <div className="me-auto p-2">
            <form className="row g-3" onSubmit={this.handleSubmit}>
              <div className="col-auto">
                <label htmlFor="new-todo" className="form-control-plaintext">
                  Project Title
                </label>
              </div>
              <div className="col-auto">
                <input
                  className="form-control"
                  id="new-todo"
                  placeholder="title"
                  onChange={this.handleChange}
                  value={this.state.projectName}
                  autoFocus
                />
              </div>
              <div className="col-auto">
                <button className="btn btn-outline-dark">
                  Add Project
                </button>
              </div>
            </form>
          </div>
          <div class="d-flex flex-row p-2">
            <h1>{this.state.totalProjects}</h1>
            <h6>total</h6>
          </div>
        </div>
        <DragDropContext
          onDragEnd={this.onDragEnd}>
          <div class="row">
            <ProjectList 
              items={this.state.toDoList} 
              total={this.state.toDoCount} 
              title='To Do' />
            <ProjectList 
              items={this.state.inProgressList}
              total={this.state.inProgressCount}  
              title='In Progress' />
            <ProjectList 
              items={this.state.doneList}
              total={this.state.doneCount}  
              title='Done' />
          </div>
        </DragDropContext>
      </div>
    );
  }
}

class ProjectList extends React.Component {
  render() {
    const type = this.props.title.toLowerCase().replace(" ","-");
    return (
      <div className="col-4">
        <Droppable 
          droppableId={type}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={{ backgroundColor: snapshot.isDraggingOver ? 'blue' : 'grey' }}
              {...provided.droppableProps}>
              <div className="card">
                <div className="card-header">
                  <div className="d-flex">
                    <div className="me-auto p-2"><h3>{this.props.title}</h3></div>
                    <div className="p-2">{this.props.total}</div>
                  </div>
                </div>
                <ul className="list-group list-group-flush">
                  {this.props.items.map( (item, index) => (
                    <Draggable draggableId={"draggable-" + item.id} key={item.id} index={item.position}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}>
                          <li className="list-group-item" key={item.id}>{item.name}</li>
                        </div>
                      )}
                    </Draggable>
                  ))}
                </ul>
              </div>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
  }
}

export default TodoApp;