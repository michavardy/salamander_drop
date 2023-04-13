import '../global.css'
import {useContext} from 'react'
import {ImageContext} from './Upload'

const ImageData = (props) => {
    const { imageDataRef } = useContext(ImageContext);
    return (
        <div className="ImageDataContainer" ref={imageDataRef}>
            imageData
        </div>
    )}
    export default ImageData