import '../global.css'
import React, {useState, useEffect, useContext} from 'react'
import {ImageContext} from './Upload'


const Thumbnail = (props)=>{

    return(
        <div className="thumbNailContainer">
            <div className="thumbnailCard" onClick={()=>{props.setSelectedImageIndex(props.index)}}>
            <img src={props.image} className="thumbnail"  style={{width:'200px', height:'200px'}}/>
                <h3 className="thumbnailName">{props.name}</h3>
            </div>
            
        </div>
    )
}

const ImageArray = () => {
    const { files, imageDataCollapsed, imageData, setImageData, setSelectedImageIndex, selectedImageIndex } = useContext(ImageContext);
    
    function addMetaData(){
        setImageData(()=>({...imageData, Contributer:"NA"}))
    }

    function renderGrid(){
        console.log("imageData")
        console.log(Object.values(imageData))

        return (

            <div className="imageGridContainer">
              {Object.values(imageData).map((imageObj) => (
                <Thumbnail key={imageObj.index} image={imageObj.image} name={imageObj.name} index={imageObj.index} setSelectedImageIndex={setSelectedImageIndex}/>
              ))}
            </div>
          );
    }
    function loadImages(file, index){
        return new Promise((resolve, reject)=>{
            const reader = new FileReader();
            reader.onload=(event)=>{
                const dataURL = reader.result;
                const imageObj = {
                    "index":index,
                    "name":file.name,
                    "size":file.size,
                    "type":file.type,
                    "image":dataURL 
                };
                resolve(imageObj);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
        });
    }

    async function extractImages(){
        const imageObj = await Promise.all(files.map((file, index)=>{return loadImages(file, index)}))
        Promise.allSettled(imageObj).then((result)=>{
            const resolvedImageObj = result.filter((res) => res.status === "fulfilled").map((res) => res.value);
            setImageData(resolvedImageObj);
        })}

    useEffect(()=>{extractImages()},[files])
    useEffect(()=>{},[imageData])
    useEffect(()=>{console.log('selected image index'); console.log(selectedImageIndex)}, [selectedImageIndex])
    

    return (
        <div className="imageArrayContainer">
            {
            imageData ? (
                renderGrid()
            )
            : <h1>no images uploaded</h1>
            }
        </div>
    )}
  
  export default ImageArray