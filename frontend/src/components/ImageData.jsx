import '../global.css'
import {useContext, useEffect, useRef} from 'react'
import {ImageContext} from './Upload'
import ToolBar from './ToolBar'

const ImageData = () => {
    const { imageDataRef, selectedImageIndex, imageData, setImageData, metaData, setMetaData } = useContext(ImageContext);
    function toDateTimeLocal(DateTime){
      const DateTimeArray = DateTime.replace(' ', ":").split(":")
      const Year = DateTimeArray[0]
      const Month = DateTimeArray[1]
      const Day = DateTimeArray[2]
      const Hour = DateTimeArray[3]
      const Minute =  DateTimeArray[4]
      return `${Year}-${Month}-${Day}T${Hour}:${Minute}`
    }

    function handleClick(){
      fetch('http://localhost:8000/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image_data: imageData[selectedImageIndex].image})
      })
      .then(response => {
        if (response.ok) {
          console.log('recieved');
        } else {
          console.log('Error translating image');
        }
      })
      .catch(error => {
        console.log(error);
      });
    }

    function handleReduceGlare(){
      fetch('http://localhost:8000/reduce_glare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          image_name: imageData[selectedImageIndex].name,
          image_data:  imageData[selectedImageIndex].image,
          action:"reduce_glare"})
      })
      .then(response => {
        
        if (response.ok) {
          console.log("reduce glare response recieved");
          return response.json();
        
        } else {
          console.log('Error translating image');
        }
      })
      .catch(error => {
        console.log(error);
      })
      .then(transformedImage=>{
        console.log(transformedImage);
        setImageData(img_data => {
          return img_data.map((imageObj, index)=>{
            if (index===selectedImageIndex){
              return {
                ...imageObj,
                image: transformedImage.image
              }}
            else {
              return imageObj
            }
            })
          })
        })
      .catch(error=>{
        console.log(error)
      })
    }


    function handleRejected(){
      imageData[selectedImageIndex].Rejected=true
    }

    return (
        selectedImageIndex>0 ? (
            <div className="imageDataContainer" ref={imageDataRef}>
              <div className="imageDataForm">
                 <h2 className="imageDataFormTitle">Image Data</h2>
                 <div className="imageDataFormContent">
                <div className="imageDataFormRow">
                    <label className="imageDataFormLabel" htmlFor="name">Name:</label>
                    <input className="imageDataFormInput" type="text" id="name" name="name" value={imageData[selectedImageIndex].name} />
                </div>
                <div className="imageDataFormRow">
                    <label className="imageDataFormLabel" htmlFor="gps">GPS:</label>
                    <input className="input" type="text" id="gps" name="gps" value={imageData[selectedImageIndex].latGPS ? 
                            `${imageData[selectedImageIndex].latGPS.toFixed(3)} , ${imageData[selectedImageIndex].longGPS.toFixed(3)}`
                            : "not available"} />
                </div>
                <div className="imageDataFormRow">
                    <label className="imageDataFormLabel" htmlFor="datetime">Date/Time:</label>
                    <input className="imageDataFormInput" type="datetime-local" id="datetime" name="datetime" value={imageData[selectedImageIndex].metadata ? 
                        toDateTimeLocal(imageData[selectedImageIndex].metadata.DateTime)
                        : "not available"}  />
                </div>
                <div className="imageDataFormRow">
                    <label className="imageDataFormLabel" htmlFor="contributer">Contributer:</label>
                    <input className="imageDataFormInput" type="text" id="contributer" name="contributer" value={imageData[selectedImageIndex].Contributer} />
                </div>
              </div>

              <div className="imageDataDisplay">
              </div>
              </div>
              <div className="imageDataImageContainer">
              <div className="imageDataImage">
                <img src={imageData[Number(selectedImageIndex)].image} className="thumbnail"  style={{width:'200px', height:'200px'}}/>
              </div>
              <div className="imageDataImageManipulationButtons">
                      <ToolBar handleReduceGlare={handleReduceGlare} handleRejected={handleRejected}/>
              </div>
              </div>
              <div className="imageDataTimeStamp">
              <div style={{fontSize:"50px",color:"var(--text-color)"}}>{imageData[selectedImageIndex].city}</div>
            <div style={{fontSize:"20px",color:"var(--text-color)"}}>{`${imageData[selectedImageIndex].district} - ${imageData[selectedImageIndex].country}`}</div>
            {
              imageData[selectedImageIndex].metadata ? 
              <>
              <div style={{fontSize:"70px",color:"var(--text-color)"}}>{imageData[selectedImageIndex].metadata.DateTime.split(" ")[1]}</div>
              <div style={{fontSize:"30px",color:"var(--text-color)"}}>{imageData[selectedImageIndex].metadata.DateTime.split(" ")[0]}</div>  
              </>
              : "not available"
            }
              </div>
              <button onClick={handleClick}>send image</button>
            </div>
          ) : (
            <div className="ImageDataContainer" ref={imageDataRef}>
              <h3>no image selected</h3>
            </div>
          )

    )}
    export default ImageData