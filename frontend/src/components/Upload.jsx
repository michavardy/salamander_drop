import ImageArray from "./ImageArray";
import ImageData from "./ImageData";
import { useState, createContext, useRef, useContext, useEffect } from "react";

import "../global.css";

export const ImageContext = createContext({});

const CollapseButton = () => {
  const {
    pane,
    imageDataCollapsed,
    setImageDataCollapsed,
    imageDataRef,
    setPane,
  } = useContext(ImageContext);
  function CollapseImageData() {
    setImageDataCollapsed(true);
    setPane("imageData");
    imageDataRef.current.style.display = "flex";
  }
  function CollapseImageSetData() {
    //setImageDataCollapsed(!imageDataCollapsed)
    setImageDataCollapsed(true);
    setPane("imageSetData");
    imageDataRef.current.style.display = "flex";
  }
  useEffect(() => {
    if (imageDataCollapsed) {
      imageDataRef.current.style.display = "none";
    } else {
      imageDataRef.current.style.display = "flex";
    }
  }, [imageDataCollapsed]);
  useEffect(() => {
    const imageDataForm = document.querySelector(".imageDataForm");
    const imageDataImage = document.querySelector(".imageDataImage");
    const imageDataImageManipulationButtons = document.querySelector(
      ".imageDataImageManipulationButtons"
    );
    const imageDataTimeStamp = document.querySelector(".imageDataTimeStamp");
    const imageSetDataForm = document.querySelector(".imageSetDataForm");

    if (pane === "imageData") {
      if (
        imageDataForm &&
        imageDataImage &&
        imageDataImageManipulationButtons &&
        imageDataTimeStamp
      ) {
        imageDataForm.style.display = "flex";
        imageDataImage.style.display = "flex";
        imageDataImageManipulationButtons.style.display = "flex";
        imageDataTimeStamp.style.display = "flex";
      }

      if (imageSetDataForm) {
        imageSetDataForm.style.display = "none";
      }
    } else if (pane === "imageSetData") {
      if (
        imageDataForm &&
        imageDataImage &&
        imageDataImageManipulationButtons &&
        imageDataTimeStamp
      ) {
        imageDataForm.style.display = "none";
        imageDataImage.style.display = "none";
        imageDataImageManipulationButtons.style.display = "none";
        imageDataTimeStamp.style.display = "none";
      }
      const imageSetDataForm = document.querySelector(".imageSetDataForm");
      if (imageSetDataForm) {
        imageSetDataForm.style.display = "flex";
      }
    }
  }, [pane]);
  return (
    <div className="collapseButtonContainer">
      <button className="collapseButton" onClick={CollapseImageData}>
        Image Data
      </button>
      <button className="collapseButton" onClick={CollapseImageSetData}>
        Image Set Data
      </button>
    </div>
  );
};

export function handleFetchImage(img, img_name, action) {
  fetch(`http://localhost:8000/${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_name: img_name,
      image_data: img,
      action: action,
    }),
  })
    .then((response) => {
      if (response.ok) {
        console.log(`${action} transformation image recieved`);
        return response.json();
      } else {
        console.log("Error translating image");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

const Upload = (props) => {
  const [imageDataCollapsed, setImageDataCollapsed] = useState(true);
  const [imageData, setImageData] = useState(null);
  const imageDataRef = useRef(null);
  const files = props.files || [];
  const setFiles = props.setFiles;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedImageData, setSelectedImageData] = useState(null);
  const [metaData, setMetaData] = useState(null);
  const [pane, setPane] = useState("imageData");
  const [stageMessage, setStageMessage] = useState("no images loaded");
  const [progress, setProgress] = useState(0);
  const [imageSetData, setImageSetData] = useState({
    imageSetName: "",
    Contributer: "",
  });

  const ContextValue = {
    imageDataCollapsed: imageDataCollapsed,
    setImageDataCollapsed: setImageDataCollapsed,
    imageDataRef: imageDataRef,
    imageData: imageData,
    setImageData: setImageData,
    files: files,
    setFiles: setFiles,
    selectedImageData: selectedImageData,
    setSelectedImageData: setSelectedImageData,
    selectedImageIndex: selectedImageIndex,
    setSelectedImageIndex: setSelectedImageIndex,
    metaData: metaData,
    setMetaData: setMetaData,
    setPane: setPane,
    pane: pane,
    progress: progress,
    setProgress: setProgress,
    stageMessage: stageMessage,
    setStageMessage: setStageMessage,
    imageSetData: imageSetData,
    setImageSetData: setImageSetData,
  };

  console.log("init context");
  console.log(ContextValue);

  return (
    <div className="uploadContainer">
      <ImageContext.Provider value={ContextValue}>
        <ImageArray />
        <CollapseButton />
        <ImageData />
      </ImageContext.Provider>
    </div>
  );
};

export default Upload;
