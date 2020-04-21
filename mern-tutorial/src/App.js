import React, { Component } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000";

class App extends Component {
  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idtoDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
  };

  componentDidMount() {
    this.getData();
    //polling logic check fresh data at set interval, every second
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getData, 60000);
      this.setState({ intervalIsSet: interval });
    }
  }

  getData = () => {
    fetch(`${API_URL}/api/getData`)
      .then((data) => data.json())
      .then((res) => {
        console.log("res data", res.data);
        this.setState({ data: res.data });
      });
  };

  putData = (message) => {
    //put the data fetched from componentDidMount to curren
    let currentIds = this.state.data.map((data) => data.id);
    //start with 0 to check if ids are there
    let idToBeAdded = 0;
    //check it the id is there, if not, then keep incrementing
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }
    //post the new message
    axios
      .post(`${API_URL}/api/putData`, {
        id: idToBeAdded,
        message: message,
      })
      .then(
        ((res) => {
          console.log("message posted", alert("message posted in DB"));
          document.querySelector("input").value = "";
        },
        (err) => {
          console.log(err, "error in putData");
        })
      );
  };

  updateData = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    //make it integer
    parseInt(idToUpdate);
    this.state.data.forEach((item) => {
      if (item.id == idToUpdate) {
        objIdToUpdate = item.id;
      }
    });
    axios.post(`${API_URL}/api/updateData`, {
      id: objIdToUpdate,
      update: { message: updateToApply },
    });
  };

  deleteData = (idToDelete) => {
    parseInt(idToDelete);
    let objIdToDelete = null;
    this.state.data.forEach((data) => {
      if (data.id == idToDelete) {
        //put the id to delet as variable
        objIdToDelete = data._id;
      }
    });
    axios.delete(`${API_URL}/api/deleteData`, {
      data: {
        id: objIdToDelete,
      },
    });
  };

  //clearInterval to stop time
  componentWillMount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  render() {
    const { data } = this.state;
    return (
      <>
        <div className="app">MERN TUTORIAL FOR BACKEND APIs.</div>
        <div>
          <ul>
            {data.length <= 0
              ? "NO ENTRIES YET"
              : data.map((item) => (
                  <li style={{ padding: "10px" }} key={item.message}>
                    <span style={{ color: "gray" }}>id:</span>
                    {item._id}
                    <span style={{ color: "gray" }}>message: </span>
                    {item.message}
                  </li>
                ))}
          </ul>
          {
            //ADD
          }
          <div style={{ padding: "10px" }}>
            <input
              tyep="text"
              placeholder="add a message to the database"
              style={{ width: "200px" }}
              className="input"
              onChange={(e) => {
                e.preventDefault();

                this.setState({ message: e.target.value });
              }}
            />
            <button onClick={() => this.putData(this.state.message)}>
              ADD
            </button>
          </div>
          {
            //DELETE
          }
          <div style={{ padding: "10px" }}>
            <input
              type="text"
              placeholder="put id of item to delete"
              style={{ width: "200px" }}
              className="input"
              onChange={(e) => this.setState({ idToDelete: e.target.value })}
            />
            <button onClick={() => this.deleteData(this.state.idtoDelete)}>
              DELETE
            </button>
          </div>
          {
            //UPDATE
          }
          <div style={{ padding: "10px" }}>
            <input
              type="text"
              placeholder="put id of item to update"
              className="input"
              onChange={(e) => this.setState({ idToUpdate: e.target.value })}
              style={{ width: "200px" }}
            />

            <input
              type="text"
              placeholder="put new message here"
              style={{ width: "200px" }}
              className="input"
              onChange={(e) => this.setState({ updateToApply: e.target.value })}
            />
            <button
              onClick={() =>
                this.updateData(this.state.idToUpdate, this.state.updateToApply)
              }
            >
              UPDATE
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default App;
