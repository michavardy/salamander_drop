import React, {useState, useEffect, createContext} from 'react'
import Landing from './Landing'
import Images from './Images'
import SelectImageEdit from './SelectImage'
import Logo from './images/SalamanderImage'

import './global.css';




const App = () => {
  const context = React.createContext();
  const [stateContext, setStateContext] = useState({
    "files":null, 
    "selectImage":null, 
    "imagesFromFile":null,
    "showModal":false,
    "metaData":null,
    "GPSDMS":null,
    "GPS":null,
    "dateTime":null,
    "contributer":null,
    "geo":null,
    "city":null,
    "district":null,
    "country":null,
    "rotation":0,
    "scale":1,
    "imageRef":null,
    "approved":null
  })

  return (
    <div className="appContainer">
      <div className="logo"><Logo/></div>
      <div className="appBody">
        <context.Provider value={{stateContext, setStateContext}}>
          {
            stateContext.files && (stateContext.selectImage == null) ? (<Images context={context} />)
            : (stateContext.files && stateContext.selectImage) !== null ? (<SelectImageEdit context={context}/>)
            : (<Landing context={context}/>)
          }
        </context.Provider>
        </div>
    </div>
  )
}

export default App