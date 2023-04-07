import React, {useState, useEffect} from 'react'
import LazyLoad from 'react-lazy-load';
import CircularProgress, { CircularProgressProps} from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import './global.css';

const Thumbnail = (props) => {
    return(
        <div className='thumbnailContainer'>
            <LazyLoad height={100}>
                <img className='image' src={props.img.image} alt="thumbnail" onClick={()=>{props.setSelectImage(props.img)}} style={{width: "100px", height: "100px"}}/>
            </LazyLoad>
            <div className="imgData">
                <div className="imgName">{props.img.name}</div>
                <div className="imgSize">{Math.round(props.img.size / 100000)} Mb</div>
            </div>

        </div>
    )
}

function CircularProgressWithLabel(props) {
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress variant="determinate" {...props} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="caption"
            component="div"
            color="text.secondary"
          >{`${Math.round(props.value)}%`}</Typography>
        </Box>
      </Box>
    );
  }

const Images = (props) => {
    const [imageData, setImageData] = useState(null)
    const [progress, setProgress] = useState(0)

    function loadImages(file, index){
        return new Promise((resolve, reject)=>{
            const reader = new FileReader();
            reader.onload=(event)=>{
                const dataURL = reader.result;
                const imageObj = {
                    "index":index,
                    "name":file.name,
                    "size":file.size,
                    "type":file.type,
                    "image":dataURL,
                    "contributer":"NA" 
                };
                resolve(imageObj);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
        });
    }

    async function extractImages(){
        const imageObj = await Promise.all(props.files.map((file, index)=>{return loadImages(file, index)}))
        Promise.allSettled(imageObj).then((result)=>{
            const resolvedImageObj = result.filter((res) => res.status === "fulfilled").map((res) => res.value);
            setImageData(resolvedImageObj);
        })}
    
        useEffect(()=>{extractImages()},[props])
        useEffect(()=>{console.log(imageData)},[imageData])
    
        return ( 
        <div className="imagesContainer">
            <div className="imagesRender">
            {
            imageData ? (
                imageData
                    .reduce((rows, img, index)=>{
                        // Group the images into rows of 6
                        const rowIndex = Math.floor(index / 6)
                        if (!rows[rowIndex]) {
                            rows[rowIndex] = [];
                          }
                          rows[rowIndex].push(img);
                          return rows;
                    },[])
                    .map((row, rowIndex)=>(
                        // Render each row of images as a <div> with class 'imageRow'
                        <div className='imageRow' key={rowIndex}>
                            {row.map((img, index)=>(
                                // Render each thumbnail as a <Thumbnail> component with a unique key
                                <Thumbnail img={img} key={index} setSelectImage={props.setSelectImage} selectImage={props.selectImage}/>
                            ))}
                        </div>
                    ))
            )
            : 
            <div>
                <CircularProgressWithLabel value={progress} />
                <h1>images loading</h1>
            </div>
            }
            </div>
            <div className="imagesCtrlButtons">
                <button className='imageButton' onClick={()=>{props.setFiles(null)}}>cancle</button>
                <button className='imageButton' onClick={()=>{console.log(props)}}>debug</button>
                <button className='imageButton'>submit</button>
            </div>
        </div>
     );
}
 
export default Images;