import React, {useState, useEffect} from 'react'
import Landing from './Landing'
import Images from './Images'
import SelectImage from './SelectImage'
import Logo from './images/SalamanderImage'
import './global.css';


const App = () => {
  const [files, setFiles] = useState(null)
  const [selectImage, setSelectImage] = useState(null)
  return (
    <div className="appContainer">
      <div className="logo"><Logo/></div>
      <div className="appBody">
        {
          files && (selectImage == null) ? (<Images files={files} setSelectImage={setSelectImage} setFiles={setFiles} selectImage={selectImage}/>)
          : (files && selectImage) !== null ? (<SelectImage/>)
          : (<Landing setFiles={setFiles}/>)
        }
        </div>
    </div>
  )
}

export default App