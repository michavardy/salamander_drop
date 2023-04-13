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
    const imageDataRef = useRef(null);

    
    const ContextValue = {
        imageDataCollapsed:imageDataCollapsed,
        setImageDataCollapsed:setImageDataCollapsed,
        imageDataRef:imageDataRef
    }

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