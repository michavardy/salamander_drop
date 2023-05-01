import ImageArray from './ImageArray'
import ImageData from './ImageData'
import ImageSetData from './ImageSetData'
import {useState, createContext, useRef, useContext, useEffect} from 'react'

import '../global.css'

export const ImageContext = createContext({});


const CollapseButton = () => {
    const { imageDataCollapsed, setImageDataCollapsed, imageDataRef, setPane } = useContext(ImageContext);
    function CollapseImageData(){
        setImageDataCollapsed(!imageDataCollapsed)
        setImageDataCollapsed(false)        
        setPane('imageData')
    }
    function CollapseImageSetData(){
      //setImageDataCollapsed(!imageDataCollapsed)
      setImageDataCollapsed(false)
      setPane('imageSetData');
      imageDataRef.current.style.display = 'flex'
  }
    useEffect(()=>{
        if (imageDataCollapsed){
            imageDataRef.current.style.display = 'none';
        }
        else{
            imageDataRef.current.style.display = 'flex';
        }
    },[imageDataCollapsed])
    return(
        <div className="collapseButtonContainer">
            <button className="collapseButton" onClick={CollapseImageData}>Image Data</button>
            <button className="collapseButton" onClick={CollapseImageSetData}>Image Set Data</button>
        </div>
    )
}


export function handleFetchImage(img, img_name, action){
    fetch(`http://localhost:8000/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        image_name: img_name,
        image_data:  img,
        action: action})
  })
  .then(response => {
    if (response.ok) {
      console.log(`${action} transformation image recieved`);
      return response.json();
    
    } else {
      console.log('Error translating image');
    }
  })
  .catch(error=>{
    console.log(error)
  })
}

const Upload = (props) => {
    const [imageDataCollapsed, setImageDataCollapsed] = useState(true)
    const [imageData, setImageData] = useState(null)
    const imageDataRef = useRef(null);
    const files = props.files || []
    const setFiles = props.setFiles
    const [selectedImageIndex, setSelectedImageIndex] = useState(null)
    const [selectedImageData, setSelectedImageData] = useState(null)
    const [metaData, setMetaData] = useState(null)
    const [pane, setPane] = useState('imageData')
    
    const ContextValue = {
        imageDataCollapsed:imageDataCollapsed,
        setImageDataCollapsed:setImageDataCollapsed,
        imageDataRef:imageDataRef,
        imageData:imageData,
        setImageData:setImageData,
        files:files,
        setFiles:setFiles,
        selectedImageData:selectedImageData,
        setSelectedImageData:setSelectedImageData,
        selectedImageIndex:selectedImageIndex,
        setSelectedImageIndex:setSelectedImageIndex,
        metaData:metaData,
        setMetaData:setMetaData,
        setPane:setPane,
        pane:pane
    }

    console.log('init context')
    console.log(ContextValue)

    return (
        <div className="uploadContainer">
            <ImageContext.Provider value={ContextValue}>
                <ImageArray />
                <CollapseButton/>
                {pane === 'imageData'
                ? <ImageData />
                : null}
                {pane==='imageSetData'
                ? <ImageSetData/>
                : null}
                
            </ImageContext.Provider>
        </div>
    )}
  
  export default Upload