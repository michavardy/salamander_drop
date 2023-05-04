import React, { useState } from "react";
import Upload from "./components/Upload";
import Landing from "./components/Landing";
import "./global.css";

const App = () => {
  const [files, setFiles] = useState(null);
  return (
    <div className="appContainer">
      <div className="appBody">
        {files ? (
          <Upload files={files} setFiles={setFiles} />
        ) : (
          <Landing setFiles={setFiles} />
        )}
      </div>
    </div>
  );
};

export default App;
