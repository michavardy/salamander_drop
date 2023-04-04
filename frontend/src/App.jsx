import React, {useState, useEffect} from 'react'
import Landing from './Landing'
import Images from './Images'
import SelectImageEdit from './SelectImage'
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
          : (files && selectImage) !== null ? (<SelectImageEdit setSelectImage={setSelectImage} selectImage={selectImage}/>)
          : (<Landing setFiles={setFiles}/>)
        }
        </div>
    </div>
  )
}

export default App