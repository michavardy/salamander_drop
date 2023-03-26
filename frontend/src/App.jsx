import React, {useState} from 'react'


const App = () => {
  const [images, setImages] = useState(null)
  const [selectImage, setSelectImage] = useState(null)

  return (
    <div className="appContainer">
      {
      images ? (
        <h1>Images</h1>
      )
      : selectImage ? (
        <h1>selectImage</h1>
      )
      : (<h1>landing</h1>)
    }
    </div>
  )
}

export default App