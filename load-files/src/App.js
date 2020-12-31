import React from "react";
import "./App.css";
import axios from "axios";

function App() {
  const handleDragStart = (e) => e.preventDefault();
  const [text, setText] = React.useState("Перетащите файлы, чтобы добавить их");
  const handleDragEnter = ({ target }) => {
    console.log("enter");
    target.closest(".zone") && target.closest(".zone").classList.add("drag");
    setText("Отпустите файлы, чтобы добавить их");
  };
  const handleDragOver = (e) => e.preventDefault();
  const handleDragLeave = ({ target }) => {
    target.closest(".zone") && target.closest(".zone").classList.remove("drag");
    setText("Перетащите файлы, чтобы добавить их");
  };
  const handleDrop = (e) => {
    console.log("DROP START");
    e.preventDefault();
    e.target.classList.remove("drag");
    const files = [...e.dataTransfer.files];
    console.log(files);
    console.log("DROP FINISH");

    const formData = new FormData();
    files.forEach((file) => {
      formData.append(file.name, file);
    });
    formData.forEach((v, k) => {
      console.log(v, k);
    });
    // axios.post("url", formData)
  };

  return (
    <div className="app">
      <label className="label">
        <div
          className="zone"
          draggable={true}
          onDragStart={handleDragStart}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {text}
        </div>
        <input name="file" type="file" className="input" multiple />
      </label>
    </div>
  );
}

export default App;
