import '../global.css'
import React, {useState, useEffect, useContext} from 'react'
import {ImageContext} from './Upload'
import EXIF from 'exif-js';


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
   
const extractMetadataFromBase64Image = (base64Image) => {
    const binaryImage = atob(base64Image.split(',')[1]); // convert base64 to binary
    const buffer = new ArrayBuffer(binaryImage.length); // create an ArrayBuffer from binary data
    const view = new Uint8Array(buffer); // create a view to access the buffer
    for (let i = 0; i < binaryImage.length; i++) {
        view[i] = binaryImage.charCodeAt(i); // copy binary data to the buffer
      }
      const exifData = EXIF.readFromBinaryFile(buffer); // read EXIF data from buffer
      return exifData;
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

    async function extractImages() {
        const imageObj = await Promise.all(files.map((file, index) => {
          return loadImages(file, index);
        }));
      
        Promise.allSettled(imageObj).then((result) => {
          const resolvedImageObj = result.filter((res) => res.status === "fulfilled").map((res) => {
            const imageObj = res.value;
            const metadata = extractMetadataFromBase64Image(imageObj.image);
            return {
              ...imageObj,
              Contributer: "NA",
              metadata: metadata,
            };
          });
          setImageData(resolvedImageObj);
        });
      }

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