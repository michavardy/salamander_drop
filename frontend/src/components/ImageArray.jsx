import '../global.css'
import React, {useState, useEffect, useContext} from 'react'
import {ImageContext} from './Upload'
import EXIF from 'exif-js';
import GoogleMapReact from 'google-map-react';
import { LinearProgress, Typography } from '@material-ui/core';



const Thumbnail = ({ index, setSelectedImageIndex, image, name })=>{

    return(
        <div className="thumbNailContainer" id={`thumbNailContainer_${index}`}>
            <div className="thumbnailCard" onClick={()=>{setSelectedImageIndex(Number(index))}}>
            <img src={image} className="thumbnail"  style={{width:'200px', height:'200px'}}/>
                <h3 className="thumbnailName">{name}</h3>
            </div>
            
        </div>
    )
}

const ImageArray = (props) => {
    const { stageMessage, progress, setStageMessage, setProgress, files, imageDataCollapsed, imageData, setImageData, setSelectedImageIndex, selectedImageIndex } = useContext(ImageContext);


    function renderGrid(){
        console.log("imageData")
        console.log(Object.values(imageData))
        setStageMessage('Render Loaded Images')
        
        return (

            <div className="imageGridContainer">
              {Object.values(imageData).map((imageObj, index, arr) => {
                setProgress(100*(index / arr.length));
                return <Thumbnail 
                    key={imageObj.index} 
                    image={imageObj.image} 
                    name={imageObj.name} 
                    index={imageObj.index} 
                    setSelectedImageIndex={setSelectedImageIndex}
                    />
              })}
            </div>
          );
    }

    function renderLoadingBar(){
        return(
            <div loadingBarContainer>
                <LinearProgress value={progress}/>
                <Typography variant="caption" color="textSecondary"> {stageMessage}</Typography>
            </div>
        )
    }




function dmsToDecimal(degrees, minutes, seconds, direction){
    return new Promise((resolve, reject) => {
        try{
            let decimal = degrees + minutes/60 + seconds/3600;
            if (direction === "S" || direction === "W") {decimal = -decimal;}
            resolve (decimal);
        }
        catch{
            reject(null)
        }})}

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

    
    async function geoFetch ( gps_latitude, gps_longitude){
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${gps_latitude},${gps_longitude}&key=AIzaSyDAl5UCGrZAxSUDeWqIkIH5oqsDF-CRKWs`;
        const response =  await fetch(url);
        const json = await response.json();
        return json;
    }


    async function handleRemoveBackground(image, name){
        const response = await fetch('http://localhost:8000/remove_background', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            image_name: name,
            image_data: image,
            action:"remove_background"})
        })
        const json = await response.json()
        return json.image
      }
    
    
    async function extractImages() {
        const imageObj = await Promise.all(files.map((file, index) => {
          return loadImages(file, index);
        }));
        const imageDataObj = await Promise.allSettled(imageObj).then((result) => {
          const resolvedImageObj = result.filter((res) => res.status === "fulfilled").map((res) => {
            const imageObj = res.value;
            const metadata = extractMetadataFromBase64Image(imageObj.image);
            return {
              ...imageObj,
              Contributer: "NA",
              Rejected:false,
              metadata: metadata,
            };
          });
          //setImageData(resolvedImageObj);
          return resolvedImageObj
        });
        const imageDataDecimalGPS = await Promise.all(imageDataObj.map(async (obj)=>{
            try{
                const latGPS = await dmsToDecimal(obj.metadata.GPSLatitude[0],obj.metadata.GPSLatitude[1],obj.metadata.GPSLatitude[2], obj.metadata.GPSLatitudeRef)
                const longGPS = await dmsToDecimal(obj.metadata.GPSLongitude[0],obj.metadata.GPSLongitude[1],obj.metadata.GPSLongitude[2], obj.metadata.GPSLongitudeRef)
                return {
                    ...obj,
                    latGPS,
                    longGPS
                }
            }
            catch{
                return{
                    ...obj,
                    latGPS:null,
                    longGPS:null  
                }
            }}))
        const imageDataGeo = await Promise.all(imageDataDecimalGPS.map(async (obj)=>{
            try {
                const Geo = await geoFetch(obj.latGPS, obj.longGPS)
                return{
                    ...obj,
                    geo:Geo,
                    city: Geo.results[0].address_components[1].short_name,
                    district: Geo.results[0].address_components[3].short_name,
                    country: Geo.results[Geo.results.length - 1].formatted_address
                }
            }
            catch {
                return {
                    ...obj,
                    geo:null,
                    city:null,
                    district:null,
                    country:null
                }
            }
        }))
        const removeBackground = await Promise.all(imageDataGeo.map(async (obj)=>{
            try {
                const rbg = await handleRemoveBackground(obj.image, obj.name)
                return {
                  ...obj,
                  image: rbg
                }
              } catch (error) {
                console.log('error removing background')
                console.error(error)
                return {
                  ...obj
                }
              }

            }))
        setImageData(removeBackground);
            
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
            : 
            <div className="loadingImages"> 
                <h1>no images uploaded</h1>
                
            </div>
            }
        </div>
    )}
  
  export default ImageArray