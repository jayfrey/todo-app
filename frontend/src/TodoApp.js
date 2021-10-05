import React from "react";
import axios from 'axios';

const status = {
  'toDoList' : 'to_do',
  'inProgressList' : 'in_progress',
  'doneList' : 'done'
};

const count = {
  'toDoList' : 'toDoCount',
  'inProgressList' : 'inProgressCount',
  'doneList' : 'doneCount'
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

    Object.keys(status).map( (key, index) => {
      console.log(key);
      console.log(index);
      console.log(status[key]);
    
      this.getProjectByStatus({'status': status[key]}, key);
    });
  }

  getProjectByStatus = async (req, key) => {
    axios.post('/api/project/get-by-status', req)
    .then( res => {
      console.log(res);
      this.setState({
        [key]: res.data.data,
        [count[key]]: res.data.count
      });
      this.updateTotalProject();
    });
  }

  addProject = async (req) => {
    console.log(req);
    axios.post('/api/project/add', req)
    .then( res => {

    });
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
    this.getProjectByStatus({'status': status['toDoList']}, 'toDoList');
    this.setState(state => ({
      projectName: ''
    }));
  }

  render() {
    return (
      <div className="container-fluid">
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
                />
              </div>
              <div className="col-auto">
                <button className="btn btn-outline-dark">
                  Add Project
                </button>
              </div>
            </form>
          </div>
          <div class="p-2">
            <h3>{this.state.totalProjects}</h3>
          </div>
        </div>
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
    );
  }
}

class ProjectList extends React.Component {
  render() {
    return (
      <div className="col-4">
        <div className="card">
          <div className="card-header">
            <div className="d-flex">
              <div className="me-auto p-2"><h3>{this.props.title}</h3></div>
              <div className="p-2">{this.props.total}</div>
            </div>
          </div>
          <ul className="list-group list-group-flush">
            {this.props.items.map(item => (
              <li className="list-group-item" key={item.id}>{item.name}-{item.status}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default TodoApp;