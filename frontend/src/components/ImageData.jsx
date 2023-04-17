import '../global.css'
import {useContext, useEffect, useRef} from 'react'
import {ImageContext} from './Upload'

const ImageData = () => {
    const { imageDataRef, selectedImageIndex, imageData, setImageData, metaData, setMetaData } = useContext(ImageContext);
    
    useEffect(()=>{
      if (imageData == null){
        return
      }
      const updatedMetaData = imageData.map((img)=>{return ({...img, Contributer:"NA"})})
      setMetaData(()=>{updatedMetaData})
      console.log('metaData')
      console.log(metaData)
    },[imageData])

    return (
        selectedImageIndex ? (
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
                    <input className="input" type="text" id="gps" name="gps" defaultValue="37.7749° N, 122.4194° W" />
                </div>
                <div className="imageDataFormRow">
                    <label className="imageDataFormLabel" htmlFor="datetime">Date/Time:</label>
                    <input className="imageDataFormInput" type="datetime-local" id="datetime" name="datetime" defaultValue="2023-04-16T14:30" />
                </div>
                <div className="imageDataFormRow">
                    <label className="imageDataFormLabel" htmlFor="contributer">Contributer:</label>
                    <input className="imageDataFormInput" type="text" id="contributer" name="contributer" defaultValue="Jane Smith" />
                </div>
              </div>

              <div className="imageDataDisplay">
              </div>
              </div>
              <div className="imageDataImage">
                <img src={imageData[selectedImageIndex].image} className="thumbnail"  style={{width:'200px', height:'200px'}}/>
              </div>
            </div>
          ) : (
            <div className="ImageDataContainer" ref={imageDataRef}>
              <h3>no image selected</h3>
            </div>
          )

    )}
    export default ImageData