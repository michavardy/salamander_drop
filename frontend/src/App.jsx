import React, {useState} from 'react'
import Landing from './Landing'
import Images from './Images'
import SelectImage from './SelectImage'
import Logo from './images/SalamanderImage'
import './global.css';


const App = () => {
  const [images, setImages] = useState(null)
  const [selectImage, setSelectImage] = useState(null)

  return (
    <div className="appContainer">
      <div className="logo"><Logo/></div>
      <div className="appBody">
        {
          images ? (<Images/>)
          : selectImage ? (<SelectImage/>)
          : (<Landing/>)
        }
        </div>
    </div>
  )
}

export default App