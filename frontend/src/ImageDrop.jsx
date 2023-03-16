import React, {useState, useEffect, useRef} from 'react';
import './ImageDrop.css';
import Icon from './Icon';



function LoadingBar({file}){
    return(
        <div className="LoadingBar">
            <h3>{file.name}</h3>
            <h3>{(file.size/ 1000000).toFixed(2)}MB</h3>
        </div>
    )

}

const ImageDrop = () => {
    const ref = useRef(null);
    const [imageArray, setImageArray] = useState([])
    const [loadedImageArray, setLoadedImageArray] = useState([])
    const [isDragging, setIsDragging] = useState(false)
    const [progress, setProgress] = useState(0);

    //useEffect(()=>{loadImages()},[imageArray])
    useEffect(()=>{loadImages()},[imageArray])
    useEffect(()=>{console.log(loadedImageArray)},[loadedImageArray])
    
    function handleSubmit(event){
        event.preventDefault();
        fetch('http://localhost/8000',{
            method: 'POST',
            headers: {
                "Content-Type":'application/json'
            },
            body: JSON.stringify({images:loadedImageArray})
        }).then(response => {
            alert(response);
        }).catch(error => {
            alert(error)
        });
    }

    function loadImages(){
        
        for (let i=0; i < imageArray.length; i++){
            
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataURL = reader.result;
                setLoadedImageArray(prevArray=> [...prevArray, dataURL])
                setProgress(((i + 1) / imageArray.length) * 100);
            };
            reader.readAsDataURL(imageArray[i]);
        }
    }
    function handleFileChange(event){
        setImageArray(Array.from(event.target.files))
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
        setImageArray(Array.from(event.dataTransfer.files))
    }
    return (
    <div className="Container">
        <div className="Title">Upload Images</div>
        <div className="DropBox" 
            onDragOver={handleDragOver} 
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}>
            <div className="DropImage">
                <Icon/>
            </div>
            <input type="file"  onChange={handleFileChange} multiple/>
            <div className="DropText">click to upload or drag and drop files</div>
        </div>
        <div className="Loading" ref={ref}>
        {imageArray.length > 0 && (
            imageArray.map((image,index)=>(
                <LoadingBar key={index} file={image}/>
            ))
        )}
        </div>
        <div className="CTRL_Buttons">
            <button className="CTRL_Button" onClick={()=>{setImageArray([])}}>Cancle</button>
            <button className="CTRL_Button" onClick={handleSubmit}>Submit</button>
        </div>
    </div>
  )
}

export default ImageDrop