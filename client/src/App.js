import React, { Component, Fragment } from "react";
import "./App.css";
import * as html2canvas from "html2canvas";
import jspdf from "jspdf";
import axios from "axios";
import FileSaver from "file-saver";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "black",
      paint: false,
      x: 0,
      y: 0,
    };

    this.canva = React.createRef();
  }
  onChangeColor = (event) => {
    this.setState({
      color: event.target.value,
    });
    console.log(event.target.value);
  };
  componentDidMount() {
    this.resize();

    document.addEventListener("mousedown", this.startPainting);
    document.addEventListener("mouseup", this.stopPainting);
    document.addEventListener("mousemove", this.paint);
    window.addEventListener("resize", this.resize);
  }

  //Resize the canvas according to the window size
  resize = () => {
    let canvas = this.canva.current;
    let ctx = canvas.getContext("2d");
    ctx.canvas.width = window.innerWidth * 0.95;
    ctx.canvas.height = window.innerHeight * 0.65;
  };

  //Get the position of the mouse
  getPosition = (event) => {
    let canva = this.canva.current;
    this.setState({
      x: event.clientX - canva.offsetLeft,
      y: event.clientY - canva.offsetTop,
    });

  };

  //on mousedown, start painting
  startPainting = (event) => {
    this.setState({
      paint: true,
    });
    console.log(this.state.paint);
    this.getPosition(event);
  };

  //on mouseup, stop painting
  stopPainting = () => {
    this.setState({
      paint: false,
    });
  };

  //while the mousedown and drag, paint
  paint = (event) => {
    if (!this.state.paint) return;
    let canva = this.canva.current;
    let ctx = canva.getContext("2d");
    //console.log(ctx);

    ctx.beginPath();

    ctx.lineWidth = 5;

    // Sets the end of the lines drawn
    // to a round shape.
    ctx.lineCap = "round";

    ctx.strokeStyle = this.state.color;

    ctx.moveTo(this.state.x, this.state.y);

    this.getPosition(event);

    ctx.lineTo(this.state.x, this.state.y);
    ctx.stroke();
  };

  //download the pdf
  pdfDownload = () => {
    const input = this.canva.current;
    html2canvas(input).then((canvas) => {
      // const imgData = canvas.toDataUrl('image/jpeg');
      var base64URL = canvas.toDataURL("image/jpeg");
      //document.body.appendChild(canvas);
      //console.log(base64URL);

      const uri = base64URL.split(";base64,");
      var data = JSON.stringify({
        data: uri[1],
      });

      axios({
        url: "https://canvadraw.herokuapp.com/api/file",
        method: "POST",
        data: data,
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          const path = response.data.path;
          axios({
            url: "https://canvadraw.herokuapp.com/api/send",
            method: "GET",
            responseType: 'blob',
            headers: {Accept: 'application/pdf'},
            params: { path: path },
          }).then((resp) => {
            console.log("hii", resp.data);

            // window.open(resp.data, '_blank');
            const file = new Blob([resp.data]);
            const fileURL = window.URL.createObjectURL(file);
            // window.open(URL.createObjectURL(resp.data));
            const link = document.createElement("a");
            link.href = fileURL;
            link.download = "myfile.pdf";
            //link.setAttribute("download", "myfile.pdf");
            document.body.append(link);
            link.click();
            link.remove();
          });
        })
        .catch((err) => {
          console.log("error1", err);
        });
    });
  };

  render() {
    return (
      <Fragment>
        <h1>Canvas | Draw anything you want</h1>
        <hr />
        <div onChange={this.onChangeColor}>
          <input
            type="radio"
            name="color"
            value="black"
            style={{ backgroundColor: "black" }}
          />
          Black
          <input
            type="radio"
            name="color"
            value="red"
            style={{ color: "red" }}
          />
          Red
          <input type="radio" name="color" value="blue" />
          Blue
          <input type="radio" name="color" value="green" />
          Green
          <input type="radio" name="color" value="yellow" />
          Yellow
        </div>
        <br />
        <canvas
          id="canvas"
          style={{ border: "1px solid" }}
          ref={this.canva}
        ></canvas>
        <br />
        <button style={{ marginTop: "5vh" }} onClick={this.pdfDownload}>
          Save PDF
        </button>
      </Fragment>
    );
  }
}

export default App;
