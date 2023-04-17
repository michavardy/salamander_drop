import ImageArray from './ImageArray'
import ImageData from './ImageData'
import {useState, createContext, useRef, useContext, useEffect} from 'react'

import '../global.css'

export const ImageContext = createContext({});


const CollapseButton = () => {
    const { imageDataCollapsed, setImageDataCollapsed, imageDataRef } = useContext(ImageContext);
    function CollapseImageData(){
        setImageDataCollapsed(!imageDataCollapsed)
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
        <div className="collapsibleButtonContainer">
            <button className="collapseButton" onClick={CollapseImageData}>:</button>
        </div>
    )
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
        setMetaData:setMetaData
    }

    console.log('init context')
    console.log(ContextValue)

    return (
        <div className="uploadContainer">
            <ImageContext.Provider value={ContextValue}>
                <ImageArray/>
                <CollapseButton/>
                <ImageData/>
            </ImageContext.Provider>
        </div>
    )}
  
  export default Upload