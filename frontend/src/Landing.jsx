import React from 'react'
import './global.css';
import Upload from './images/UploadImage'


const Landing = () => {
    return (
        <div className="landingContainer">
        <div className="landingTitle">upload Images</div>
        <div className="uploadTargetArea">
            <div className="uploadImage"><Upload/></div>
            <div className="instructionText">click to upload or drag and drop files</div>
        </div>
        </div> 
    );
}
 
export default Landing;