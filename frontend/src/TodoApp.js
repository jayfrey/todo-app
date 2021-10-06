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
      projectTitle: '' 
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.fetchProjects();
    
  }

  fetchProjects = () => {

    Object.keys(dict).map( (key, index) => {    
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
      this.getProjectByStatus({'status': 'to_do'});
    });
  }

  updateTotalProject = () => {
    this.setState({
      totalProjects: this.state.toDoCount + this.state.inProgressCount + this.state.doneCount
    });
  }

  sort = (items, status) => {
    items.map( (item, index) => {
      if(item.position != index || item.status != status) {
        const req = {
          id: item.id,
          status: status,
          position: index
        };
        axios.put('/api/project/update', req)
        .then( res => {

        });
      }
    })
  }

  move = (source, destination) => {
    var sourceStatus = source.droppableId.replace("-","_");
    var sourceList = Array.from(this.state[dict[sourceStatus]["list"]]);
    var sourcePos = source.index;

    var desStatus = destination.droppableId.replace("-","_");
    var desList = Array.from(this.state[dict[desStatus]["list"]]);
    var desPos = destination.index;

    const [removed] = sourceList.splice(sourcePos, 1);
    desList.splice(desPos, 0, removed);

    this.sort(sourceList, sourceStatus);
    this.sort(desList, desStatus);

    this.setState({
      [dict[sourceStatus]["list"]]: sourceList,
      [dict[desStatus]["list"]]: desList,
      [dict[sourceStatus]["count"]]: this.state[dict[sourceStatus]["count"]]-1,
      [dict[desStatus]["count"]]: this.state[dict[desStatus]["count"]]+1,
    });
  }

  reorder = (source, destination) => {
    var sourcePos = source.index;
    var desStatus = destination.droppableId.replace("-","_");
    var desList = Array.from(this.state[dict[desStatus]["list"]]);
    var desPos = destination.index;
    const [removed] = desList.splice(sourcePos, 1);
    desList.splice(desPos, 0, removed);

    this.sort(desList, desStatus);
    this.setState({
      [dict[desStatus]["list"]]: desList
    });
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

  handleChange(title) {
    this.setState({ projectTitle: title });
  }

  handleSubmit() {
    if (this.state.projectTitle.length === 0) {
      return;
    }
    const newItem = {
      name: this.state.projectTitle,
      status: 'to_do'
    };

    this.addProject(newItem);
    this.setState(state => ({
      projectTitle: ''
    }));
  }

  render() {
    return (
      <DragDropContext
          onDragEnd={this.onDragEnd}>
        <div className="container-fluid p-5">
          <ProjectForm
            projectTitle={this.state.projectTitle}
            totalProjects={this.state.totalProjects}
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}/>
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
        </div>
      </DragDropContext>
    );
  }
}

class ProjectForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.props.handleChange(e.target.value);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.handleSubmit();
  }

  render() {
    return (
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
                value={this.props.projectTitle}
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
          <h1>{this.props.totalProjects}</h1>
          <h6>total</h6>
        </div>
      </div>
    );
  }
}

class ProjectList extends React.Component {
  render() {
    const type = this.props.title.toLowerCase().replace(" ","-");
    return (
      <div className="col-4">
        <div className="card">

          <div className="card-header">
            <div className="d-flex">
              <div className="me-auto p-2"><h3>{this.props.title}</h3></div>
              <div className="p-2">{this.props.total}</div>
            </div>
          </div>

          <Droppable 
            droppableId={type}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}>

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

                {provided.placeholder}
              </div>
            )}
          </Droppable>

        </div>
      </div>
    );
  }
}

export default TodoApp;