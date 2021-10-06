import React from "react";
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


const dict = {
  'to_do' : {
    'list' : 'toDoList',
    'count' : 'toDoCount'
  },
  'in_progress' : {
    'list' : 'inProgressList',
    'count' : 'inProgressCount'
  },
  'done' : {
    'list' : 'doneList',
    'count' : 'doneCount'
  }
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

  fetchProjects = () => {

    Object.keys(list).map( (key, index) => {    
      this.getProjectByStatus({'status': key});
    });
  }

  getProjectByStatus = (req) => {
    axios.post('/api/project/get-by-status', req)
    .then( res => {
      this.setState({
        [dict[req.status]["list"]]: res.data.data,
        [dict[req.status]["count"]]: res.data.count
      });
      this.updateTotalProject();
    });
  }

  addProject = (req) => {
    axios.post('/api/project/add', req)
    .then( res => {

    });
  }

  sort = (items, status) => {
    items.map( (item, index) => {
      // if(item.position != index || item.status != status) {
        const req = {
          id: item.id,
          status: status,
          position: index
        };
        axios.put('/api/project/update', req)
        .then( res => {

        });
      // }
    })
  }

  updateTotalProject = () => {
    this.setState({
      totalProjects: this.state.toDoCount + this.state.inProgressCount + this.state.doneCount
    });
  }

  move = (source, destination) => {
    var sourceStatus = source.droppableId.replace("-","_");
    var sourceList = Array.from(this.state[list[sourceStatus]]);
    var sourcePos = source.index;

    var desStatus = destination.droppableId.replace("-","_");
    var desList = Array.from(this.state[list[desStatus]]);
    var desPos = destination.index;

    const [removed] = sourceList.splice(sourcePos, 1);
    desList.splice(desPos, 0, removed);

    this.sort(sourceList, sourceStatus);
    this.sort(desList, desStatus);

    this.setState({
      [dict[sourceStatus]["list"]]: sourceList,
      [dict[desStatus]["list"]]: desList,
      [dict[sourceStatus]["count"]]: this.state[count[sourceStatus]]-1,
      [dict[desStatus]["count"]]: this.state[[count[desStatus]]]+1,
    });
  }

  reorder = (source, destination) => {
    var sourcePos = source.index;
    var desStatus = destination.droppableId.replace("-","_");
    var desList = Array.from(this.state[list[desStatus]]);
    var desPos = destination.index;
    const [removed] = desList.splice(sourcePos, 1);
    desList.splice(desPos, 0, removed);

    this.sort(desList, desStatus);
    this.setState({
      [dict[desStatus]["list"]]: desList
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
    const { source, destination } = result;
    
    if (!destination) {
        return;
    }

    if (source.droppableId === destination.droppableId) {
        this.reorder(source, destination);
    } else {
        this.move(source, destination);
    }
  };

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
                    <Draggable draggableId={"draggable-" + item.id} key={item.id} index={index}>
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