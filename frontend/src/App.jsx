import React, { useState, useEffect } from "react";
import Upload from "./components/Upload";
import Landing from "./components/Landing";
import "./global.css";

const App = () => {

  const [files, setFiles] = useState(null);
  const [ipAdress, setIpAdress] = useState(window.location.hostname);
  useEffect(() => {
    setIpAdress(window.location.hostname), []
  })
  return (
    <div className="appContainer">
      <div className="appBody">
        {files ? (
          <Upload files={files} setFiles={setFiles} ipAdress={ipAdress} />
        ) : (
          <Landing setFiles={setFiles} />
        )}
      </div>
    </div>
  );
};

export default App;
