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
        imageDataImageManipulationButtons 
      ) {
        imageDataForm.style.display = "flex";
        imageDataImage.style.display = "flex";
        imageDataImageManipulationButtons.style.display = "flex";
      }

      if (imageSetDataForm) {
        imageSetDataForm.style.display = "none";
      }
    } else if (pane === "imageSetData") {
      if (
        imageDataForm &&
        imageDataImage &&
        imageDataImageManipulationButtons

      ) {
        imageDataForm.style.display = "none";
        imageDataImage.style.display = "none";
        imageDataImageManipulationButtons.style.display = "none";
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
        Edit
      </button>
      <button className="collapseButton" onClick={CollapseImageSetData}>
        Submit
      </button>
    </div>
  );
};


const Upload = (props) => {
const [imageDataCollapsed, setImageDataCollapsed] = useState(true);
const [imageData, setImageData] = useState(null);
const imageDataRef = useRef(null);
const commentRef = useRef(null);
const files = props.files || [];
const setFiles = props.setFiles;
const ipAdress = props.ipAdress;
const [selectedImageIndex, setSelectedImageIndex] = useState(0);
const [selectedImageData, setSelectedImageData] = useState(null);
const [metaData, setMetaData] = useState(null);
const [pane, setPane] = useState("imageData");
const [stageMessage, setStageMessage] = useState("no images loaded");
const [progress, setProgress] = useState(0);
const [showComment, setShowComment] = useState(false);
const [imageSetData, setImageSetData] = useState({
  imageSetName: "",
  Contributer: "",
});
const [imageAttributes, setImageAttibutes] = useState([])


const ContextValue = {
  imageDataCollapsed: imageDataCollapsed,
  setImageDataCollapsed: setImageDataCollapsed,
  imageDataRef: imageDataRef,
  imageData: imageData,
  setImageData: setImageData,
  files: files,
  setFiles: setFiles,
  ipAdress: ipAdress,
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
  commentRef: commentRef,
  showComment: showComment,
  setShowComment: setShowComment,
  imageAttributes: imageAttributes, 
  setImageAttibutes, setImageAttibutes
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
