import "../global.css";
import { useContext, useEffect, useRef, useState } from "react";
import { ImageContext } from "./Upload";
import ToolBar from "./ToolBar";


const ImageData = (props) => {
  const [imageAttributes,setImageAttributes] = useState([])
  
  const {
    imageDataRef,
    commentRef,
    selectedImageIndex,
    imageData,
    setImageData,
    metaData,
    setMetaData,
    pane,
    setFiles,
    imageSetData,
    setImageSetData,
    setShowComment,
    showComment,
    ipAdress,
  } = useContext(ImageContext);

  useEffect(()=>{
    if(imageData !==null){
      const initImageAttributes = imageData.map((img)=>{
        return {
        rotationAngle:0,
        brightness:1,
        scale:1,
        action:[]
        }
        })
        setImageAttributes(initImageAttributes)
    }

  },[imageData, ImageContext])


  function toDateLocal(Date){
    const DateArray = Date.split(":");
    const Year = DateArray[0];
    const Month = DateArray[1];
    const Day = DateArray[2];
    return `${Year}-${Month}-${Day}`
  }
  function toTimeLocal(Time){
    const TimeArray = Time.split(":");
    const Hour = TimeArray[0];
    const Minute =TimeArray[1];
    const Second = TimeArray[2];
    return `${Hour}:${Minute}`
  }
  function toDateTimeLocal(Date, Time) {
    Date = Date.replaceAll('-', ':');
    const DateArray = Date.split(":");
    const TimeArray = Time.split(":");
    const Year =DateArray[0];
    const Month = DateArray[1];
    const Day = DateArray[2];
    const Hour = TimeArray[0];
    const Minute = TimeArray[1];
    return `${Year}:${Month}:${Day} ${Hour}:${Minute}`;
  }

  function handleReduceGlareClient(){
    console.log('reduce glare')
    // set selected attributes, and get image element
    const selectedImageAttributes = imageAttributes[selectedImageIndex]
    console.log(selectedImageAttributes)
    const image_element = document.getElementById(`image_${selectedImageIndex}`)
    const display_image_element = document.getElementById(`displayimage_${selectedImageIndex}`)
    let newBrightness = 1
    let newAction = []
    // if i find the image element, add brightness , add action, and reduce brightness by css
    if (image_element && display_image_element){
      newBrightness = selectedImageAttributes.brightness - 0.1;  // reduce brightness by 10% 
      newAction = selectedImageAttributes.action 
      newAction.push(`reduce_brightness:${newBrightness}`)
      image_element.style.filter = `brightness(${newBrightness})`;
      display_image_element.style.filter = `brightness(${newBrightness})`;
    }
    // update the imageattributes hook with updated rotation angle and action
    const updatedImageAttributes = [...imageAttributes];
    updatedImageAttributes[selectedImageIndex] = {
      ... selectedImageAttributes,
      brightness: newBrightness,
      action: newAction
    }
    setImageAttributes(updatedImageAttributes)
  }
  
  function handleResizeClient(){
    console.log('resize image')
    
    // set selected attributes, and get image element
    const selectedImageAttributes = imageAttributes[selectedImageIndex]
    console.log(selectedImageAttributes)
    const image_element = document.getElementById(`image_${selectedImageIndex}`)
    const display_image_element = document.getElementById(`displayimage_${selectedImageIndex}`)
    let newScale = 1
    let newAction = []

    // if i find the image element, new scale, add action, and scale css by new scale
    if (image_element && display_image_element){
      newScale = selectedImageAttributes.scale + 0.1;  // Add 10% to the current scale
      newAction = selectedImageAttributes.action 
      newAction.push(`scale_image:${newScale}`)
      image_element.style.transform = `scale(${newScale})`;
      display_image_element.style.transform = `scale(${newScale})`;
    }
    // update the imageattributes hook with updated rotation angle and action
    const updatedImageAttributes = [...imageAttributes];
    updatedImageAttributes[selectedImageIndex] = {
      ... selectedImageAttributes,
      scale: newScale,
      action: newAction
    }
    setImageAttributes(updatedImageAttributes)
  }

  function handleRotateClient(){
    console.log('rotate image')
    
    // set selected attributes, and get image element
    const selectedImageAttributes = imageAttributes[selectedImageIndex]
    const image_element = document.getElementById(`image_${selectedImageIndex}`)
    const display_image_element = document.getElementById(`displayimage_${selectedImageIndex}`)
    let newRotationAngle = 0
    let newAction = []

    // if i find the image element, add new rotation angle, add action, and rotate css by rotation angle
    if (image_element && display_image_element){
      newRotationAngle = selectedImageAttributes.rotationAngle + 90;  // Add 90 to the current rotation angle
      newAction = selectedImageAttributes.action 
      newAction.push(`rotate_image:${newRotationAngle}`)
      image_element.style.transform = `rotate(${newRotationAngle}deg)`;
      display_image_element.style.transform = `rotate(${newRotationAngle}deg)`;
    }
    // update the imageattributes hook with updated rotation angle and action
    const updatedImageAttributes = [...imageAttributes];
    updatedImageAttributes[selectedImageIndex] = {
      ... selectedImageAttributes,
      rotationAngle: newRotationAngle,
      action: newAction
    }
    setImageAttributes(updatedImageAttributes)
  }
  function handleRotate() {
    fetch(`http://${ipAdress}:8000/rotate_image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_name: imageData[selectedImageIndex].name,
        image_data: imageData[selectedImageIndex].image,
        action: "rotate_image",
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("rotate_image response recieved");
          return response.json();
        } else {
          console.log("Error translating image");
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .then((transformedImage) => {
        console.log(transformedImage);
        setImageData((img_data) => {
          return img_data.map((imageObj, index) => {
            if (index === selectedImageIndex) {
              return {
                ...imageObj,
                image: transformedImage.image,
              };
            } else {
              return imageObj;
            }
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function handleReduceGlare() {
    fetch(`http://${ipAdress}:8000/reduce_glare`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_name: imageData[selectedImageIndex].name,
        image_data: imageData[selectedImageIndex].image,
        action: "reduce_glare",
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("reduce glare response recieved");
          return response.json();
        } else {
          console.log("Error translating image");
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .then((transformedImage) => {
        console.log(transformedImage);
        setImageData((img_data) => {
          return img_data.map((imageObj, index) => {
            if (index === selectedImageIndex) {
              return {
                ...imageObj,
                image: transformedImage.image,
              };
            } else {
              return imageObj;
            }
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function handleComment(){
      setShowComment(prevState => !prevState);
    }
    function handleCommentArea(e) {
      const updatedImageData = imageData.map((imageObj, index) => {
        if (index === selectedImageIndex) {
          return {
            ...imageObj,
            Comment: e.target.value,
          };
        } else {
          return imageObj;
        }
      });
      setImageData(updatedImageData);
    }
  function handleSubmit() {
    fetch(`http://${ipAdress}:8000/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageData: imageData,
        imageSetData: imageSetData,
        imageAttributes: imageAttributes
      }),
    })
    .then((response) => {
      if (response.ok) {
        console.log("submit recieved");
        return response.json();
      } else {
        console.log("sumbit not recieved");
      }
    })
    .then(()=>{
      window.alert('Files submited to database')
      setFiles(null);
    })
    .catch((error) => {
      console.log(error);
    })
  }
  function handleRejected() {
    console.log("reject image");
    imageData[selectedImageIndex].Rejected = true;
    // Get the thumbnailCard element of the selected image
    const thumbNailContainer = document.querySelector(
      `#thumbNailContainer_${selectedImageIndex}`
    );

    // Update the style of the thumbnailCard element to reflect the rejected status
    thumbNailContainer.classList.add("thumbNailCard_rejected");
    thumbNailContainer.classList.remove("thumbNailContainer");
  }


  return selectedImageIndex >= 0 && imageData != null? (
    <div className="imageDataContainer" ref={imageDataRef}>
      <div className="imageSetDataForm">
        <h2 className="imageDataFormTitle">Submit Image Set</h2>
        <div className="imageDataFormContent">
          <div className="imageDataFormRow">
            <label className="imageDataFormLabel" htmlFor="name">
              Image Set Name:
            </label>
            <input
              className="imageDataFormInput"
              type="text"
              id="name"
              name="name"
              value={imageSetData.imageSetName}
              onChange={(e) => {
                setImageSetData({
                  ...imageSetData,
                  imageSetName: e.target.value,
                });
              }}
            />
          </div>
          <div className="imageDataFormRow">
            <label className="imageDataFormLabel" htmlFor="contributer">
              Contributer:
            </label>
            <input
              className="imageDataFormInput"
              type="text"
              id="contributer"
              name="contributer"
              value={imageSetData.Contributer}
              onChange={(e) => {
                setImageSetData({
                  ...imageSetData,
                  Contributer: e.target.value,
                });
              }}
            />
          </div>
          <div className="imageDataFormRowSubmission">
            <button 
              className="imageDataFormButton"
              onClick={handleSubmit}>Submit</button>
            <button
              className="imageDataFormButton"
              onClick={() => {
                setFiles(null);
              }}
            >
              Cancle
            </button>
          </div>
          <div className="imageDataFormLabel">Submit could take up to a few minutes</div>
        </div>
      </div>
      <div className="imageDataForm">
        <h2 className="imageDataFormTitle">MetaData - Edit</h2>
        <div className="imageDataFormContent">
          <div className="imageDataFormRow">
            <label className="imageDataFormLabel" htmlFor="name">
              Name:
            </label>
            <div className="imageDataFormLabelUnits"></div>
            <input
              className="imageDataFormInput"
              type="text"
              id="name"
              name="name"
              value={imageData[selectedImageIndex].name}
              onChange={(e) => {
                const imageObj = imageData[selectedImageIndex];
                const updatedImageObj = { ...imageObj, name: e.target.value };
                imageData[selectedImageIndex] = updatedImageObj;
                setImageData([...imageData]);
              }}
            />
          </div>
          <div className="imageDataFormRow">
            <label className="imageDataFormLabel" htmlFor="gps">
              GPS:
            </label>
            <div className="imageDataFormLabelUnits">lat,long</div>
            <input
              className="imageDataFormInput"
              type="text"
              id="gps"
              name="gps"
              value={
                imageData[selectedImageIndex].latGPS
                  ? `${imageData[selectedImageIndex].latGPS.toFixed(
                      3
                    )} , ${imageData[selectedImageIndex].longGPS.toFixed(3)}`
                  : "0,0"
              }
              onChange={(e) => {
                const latGPS = imageData[selectedImageIndex].latGPS
                const longGPS = imageData[selectedImageIndex].longGPS
                const newLatGPS = parseFloat(e.target.value.split(",")[0]);
                const newLongGPS = parseFloat(e.target.value.split(",")[1]);
                const imageObj = imageData[selectedImageIndex];
                const updatedImageObj = { ...imageObj, latGPS: newLatGPS, longGPS: newLongGPS };
                imageData[selectedImageIndex] = updatedImageObj;
                setImageData([...imageData]);
              }}
            />
          </div>
          <div className="imageDataFormRow">
            <label className="imageDataFormLabel" htmlFor="date">
              Date:
            </label>
            <div className="imageDataFormLabelUnits">(YYYY-MM-DD)</div>
            <input
              className="imageDataFormInput"
              type="date-local"
              id="date"
              name="date"
              value={
                imageData[selectedImageIndex].metadata
                  ? toDateLocal(
                    imageData[selectedImageIndex].metadata.DateTime.split(" ")[0]
                    )
                  : "not available"
              }
              onChange={(e) => {
                const updatedImageData = [...imageData];
                const newDate = e.target.value;
                const Time = imageData[selectedImageIndex].metadata.DateTime.split(" ")[1];
                updatedImageData[selectedImageIndex] = {
                  ...updatedImageData[selectedImageIndex],
                  metadata: {
                    ...updatedImageData[selectedImageIndex].metadata,
                    DateTime: toDateTimeLocal(newDate, Time),
                  },
                };
                setImageData(updatedImageData);
              }}
            />
          </div>
          <div className="imageDataFormRow">
            <label className="imageDataFormLabel" htmlFor="time">
              Time:
            </label>
            <div className="imageDataFormLabelUnits">(HH:MM)</div>
            <input
              className="imageDataFormInput"
              type="time-local"
              id="time"
              name="time"
              value={
                imageData[selectedImageIndex].metadata
                  ? toTimeLocal(
                      imageData[selectedImageIndex].metadata.DateTime.split(" ")[1]
                    )
                  : "not available"
              }
              onChange={(e) => {
                const updatedImageData = [...imageData];
                const updatedSelectedImage = updatedImageData[selectedImageIndex];
                const newTime = e.target.value;
                const Date = imageData[selectedImageIndex].metadata.DateTime.split(" ")[0];

                updatedImageData[selectedImageIndex] = {
                  ...updatedImageData[selectedImageIndex],
                  metadata: {
                    ...updatedImageData[selectedImageIndex].metadata,
                    DateTime: toDateTimeLocal(Date,newTime),
                  },
                };
                setImageData(updatedImageData);
              }}
            />
          </div>
          <div className="imageDataFormRow">
            <label className="imageDataFormLabel" htmlFor="contributer">
              Contributer:
            </label>
            <div className="imageDataFormLabelUnits"></div>
            <input
              className="imageDataFormInput"
              type="text"
              id="contributer"
              name="contributer"
              value={imageData[selectedImageIndex].Contributer}
              onChange={(e) => {
                const imageObj = imageData[selectedImageIndex];
                const updatedImageObj = {
                  ...imageObj,
                  Contributer: e.target.value,
                };
                imageData[selectedImageIndex] = updatedImageObj;
                setImageData([...imageData]);
              }}
            />
          </div>
        </div>

        <div className="imageDataDisplay"></div>
      </div>
      <div className="imageDataImageContainer">
        <div className="imageDataImage">
          <img
            src={imageData[Number(selectedImageIndex)].image}
            className="thumbnail"
            style={{ width: "200px", height: "200px" }}
            id={`displayimage_${selectedImageIndex}`}
          />
        </div>
        <div className="imageDataImageManipulationButtons">
          <ToolBar
            handleReduceGlare={handleReduceGlareClient}
            handleRejected={handleRejected}
            handleRotate={handleRotateClient}
            handleComment={handleComment}
            handleResize={handleResizeClient}
          />
        </div>
        {
          showComment ? (  
          <div className="commentContainer">
          <textarea id="commentArea" name="commentArea" rows="4"  onChange={handleCommentArea} >
            {imageData[selectedImageIndex].Comment}
          </textarea>
          </div>
          )
          :null
        }
      </div>
    </div>
  ) : (
    <div className="ImageDataContainer" ref={imageDataRef}>
      <h3>no image selected</h3>
    </div>
  );
};
export default ImageData;
