import React, { useState, useEffect } from "react";
import Upload from "./components/Upload";
import Landing from "./components/Landing";
import "./global.css";

const App = () => {
  const checkIpAdress = () => {
    // Check if inside or outside the network
    if (window.location.hostname === 'localhost' || window.location.hostname === '192.168.0.103') {
      setIpAdress('192.168.0.103'); // Internal IP address
    } else {
      setIpAdress('213.57.120.114'); // External IP address
    }
  };

  const [files, setFiles] = useState(null);
  const [ipAdress, setIpAdress] = useState('192.168.0.103');
  useEffect(() => {
    checkIpAdress(), []
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
