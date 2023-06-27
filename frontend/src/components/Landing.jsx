import React, {useState} from 'react'
import '../global.css';
import Upload from '../images/UploadImage'


const Landing = (props) => {
    const [isDragging, setIsDragging] = useState(false)



    function handleFileChange(event){
        const selectedFiles = Array.from(event.target.files);
        const imageFiles = []
        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            if (file.type.startsWith('image/')) {
              imageFiles.push(file);
            }
          }
        if (imageFiles.length > 0) {
            props.setFiles(imageFiles);
          } else {
            // Show warning message and navigate back to the first page
            alert('No image files were selected!');
            // Perform any necessary navigation back to the first page here
          }

    }
    function handleDragOver(event){
        event.preventDefault();
        setIsDragging(true);
    }

    function handleDragEnter(event){
        event.preventDefault();
        setIsDragging(true);
    }
    function handleDragLeave(event){
        event.preventDefault();
        setIsDragging(false);
    }
    function handleDrop(event){
        event.preventDefault();
        setIsDragging(false);
        props.setFiles(Array.from(event.dataTransfer.files))
    }
    return (
        <div className="landingContainer">
        <div className="landingTitle">upload Images</div>
        <div className="uploadTargetArea"
        onDragOver={handleDragOver} 
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        >
            <div className="uploadImage"><Upload/></div>
            <div className="inputContainer">
            <input className="fileInput" type="file"  onChange={handleFileChange} multiple/>
            <div className="instructionText">click to upload or drag and drop files</div>
            </div>
        </div>
        </div> 
    );
}
 
export default Landing;