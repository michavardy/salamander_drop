import "../global.css";
import React, { useState, useEffect, useContext, useRef } from "react";
import { ImageContext } from "./Upload";
import EXIF from "exif-js";
import GoogleMapReact from "google-map-react";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const Thumbnail = ({ index, setSelectedImageIndex, image, name, setShowComment}) => {
  return (
    <div className="thumbNailContainer" id={`thumbNailContainer_${index}`}>
      <div
        className="thumbnailCard"
        id={`thumbnailCard_${index}`}
        onClick={() => {
          setSelectedImageIndex(Number(index));
          setShowComment(false)
        }}
      >
        <img
          src={image}
          className="thumbnail"
          style={{ width: "200px", height: "200px" }}
          id={`image_${index}`}
        />
        <h3 className="thumbnailName">{name}</h3>
      </div>
    </div>
  );
};

const RenderLoadingBar = ({ progress, stageMessage }) => {
  function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="h6" color="white">{`${Math.round(
            props.value
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <div className="loadingBarContainer">

<Box sx={{ width: "100%", mt: 2 }}>
        <LinearProgressWithLabel value={progress} sx={{ width: "100%" }} />
      </Box>
      <Typography variant="h6" color="white" sx={{ mt: 2 }}>
        {stageMessage}
      </Typography>

    </div>
  );
};

const ImageArray = (props) => {
  const {
    stageMessage,
    progress,
    setStageMessage,
    setProgress,
    files,
    imageDataCollapsed,
    imageData,
    setImageData,
    setSelectedImageIndex,
    selectedImageIndex,
    showComment,
    setShowComment,
    ipAdress
  } = useContext(ImageContext);
  const [loading, setLoading] = useState(true);
  const [responseCount, setResponseCount] = useState(0);
  const totalRequests = files.length;

  useEffect(() => {
    if (responseCount === totalRequests) {
      setLoading(false);
    }
  }, [responseCount, totalRequests]);

  useEffect(() => {
    setProgress((responseCount / totalRequests) * 100);
  }, [responseCount, totalRequests]);


  function render() {
    if (loading) {
      return (
        <RenderLoadingBar progress={progress} stageMessage={stageMessage} />
      );
    } else {
      return renderGrid();
    }
  }

  function renderGrid() {
    console.log("imageData");
    console.log(Object.values(imageData));
    setStageMessage("Render Loaded Images");

    return (
      <div className="imageGridContainer">
        {Object.values(imageData).map((imageObj, index, arr) => {
          setProgress(100 * (index / arr.length));
          return (
            <Thumbnail
              key={imageObj.index}
              image={imageObj.image}
              name={imageObj.name}
              index={imageObj.index}
              setSelectedImageIndex={setSelectedImageIndex}
              setShowComment={setShowComment}
            />
          );
        })}
      </div>
    );
  }

  function dmsToDecimal(degrees, minutes, seconds, direction) {
    return new Promise((resolve, reject) => {
      try {
        let decimal = degrees + minutes / 60 + seconds / 3600;
        if (direction === "S" || direction === "W") {
          decimal = -decimal;
        }
        resolve(decimal);
      } catch {
        reject(null);
      }
    });
  }

  const extractMetadataFromBase64Image = (base64Image) => {
    const binaryImage = atob(base64Image.split(",")[1]); // convert base64 to binary
    const buffer = new ArrayBuffer(binaryImage.length); // create an ArrayBuffer from binary data
    const view = new Uint8Array(buffer); // create a view to access the buffer
    for (let i = 0; i < binaryImage.length; i++) {
      view[i] = binaryImage.charCodeAt(i); // copy binary data to the buffer
    }
    const exifData = EXIF.readFromBinaryFile(buffer); // read EXIF data from buffer
    return exifData;
  };

  function loadImages(file, index) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataURL = reader.result;
        const imageObj = {
          index: index,
          name: file.name,
          size: file.size,
          type: file.type,
          image: dataURL,
        };
        resolve(imageObj);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function geoFetch(gps_latitude, gps_longitude) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${gps_latitude},${gps_longitude}&key=AIzaSyDAl5UCGrZAxSUDeWqIkIH5oqsDF-CRKWs`;
    const response = await fetch(url);
    const json = await response.json();
    return json;
  }


  async function extractImages() {
    const imageObj = await Promise.all(
      files.map((file, index, arr) => {
        return loadImages(file, index);
      })
    );
    setProgress(0);
    setStageMessage('extracting image data')
    const imageDataObj = await Promise.allSettled(imageObj).then((result) => {
      const resolvedImageObj = result
        .filter((res) => res.status === "fulfilled")
        .map((res,index,arr) => {
          setProgress( Math.round(100 * index / arr.length))
          const imageObj = res.value;
          const metadata = extractMetadataFromBase64Image(imageObj.image);
          return {
            ...imageObj,
            Contributer: "NA",
            Comment:"",
            Rejected: false,
            metadata: metadata,
            action: [],

          };
        });

      return resolvedImageObj;
    });
    setProgress(0)
    setStageMessage('extracting image GPS')
    const imageDataDecimalGPS = await Promise.all(
      imageDataObj.map(async (obj,index,arr) => {
        setProgress(Math.round(100 * (index / arr.length)))
        try {
          const latGPS = await dmsToDecimal(
            obj.metadata.GPSLatitude[0],
            obj.metadata.GPSLatitude[1],
            obj.metadata.GPSLatitude[2],
            obj.metadata.GPSLatitudeRef
          );
          const longGPS = await dmsToDecimal(
            obj.metadata.GPSLongitude[0],
            obj.metadata.GPSLongitude[1],
            obj.metadata.GPSLongitude[2],
            obj.metadata.GPSLongitudeRef
          );
          return {
            ...obj,
            latGPS,
            longGPS,
          };
        } catch {
          return {
            ...obj,
            latGPS: 0.0,
            longGPS: 0.0,
          };
        }
      })
    );
    
    setProgress(0)
    setStageMessage('extracting image Geo Location')
    const imageDataGeo = await Promise.all(
      imageDataDecimalGPS.map(async (obj, index, arr) => {
        setProgress( Math.round(100 * index / arr.length))
        try {
          const Geo = await geoFetch(obj.latGPS, obj.longGPS);
          return {
            ...obj,
            geo: Geo,
            city: Geo.results[0].address_components[1].short_name,
            district: Geo.results[0].address_components[3].short_name,
            country: Geo.results[Geo.results.length - 1].formatted_address,
          };
        } catch {
          return {
            ...obj,
            geo: null,
            city: null,
            district: null,
            country: null,
          };
        }
      })
    );
    setImageData(imageDataGeo);
    setLoading(false);
  }

  useEffect(() => {
    extractImages();
  }, [files]);
  useEffect(()=>{
    console.log('show comment');
    console.log(showComment)
  }, [showComment])
  useEffect(() => {}, [imageData]);
  useEffect(() => {
    console.log("selected image index");
    console.log(selectedImageIndex);
  }, [selectedImageIndex]);

  return <div className="imageArrayContainer">{render()}</div>;
};

export default ImageArray;
