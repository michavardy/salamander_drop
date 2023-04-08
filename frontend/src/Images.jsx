import React, {useState, useEffect, useContext} from 'react'
import LazyLoad from 'react-lazy-load';
import CircularProgress, { CircularProgressProps} from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import './global.css';

const Thumbnail = (props) => {
    const {stateContext, setStateContext} = useContext(props.context)
    return(
        <div className='thumbnailContainer'>
            <LazyLoad height={100}>
                <img className='image' src={props.img.image} alt="thumbnail" onClick={()=>{setStateContext({... stateContext, selectImage:props.img})}} style={{width: "100px", height: "100px"}}/>
            </LazyLoad>
            <div className="imgData">
                <div className="imgName">{props.img.name}</div>
                <div className="imgSize">{Math.round(props.img.size / 100000)} Mb</div>
            </div>

        </div>
    )
}


const Images = (props) => {
    const {stateContext, setStateContext} = useContext(props.context)
    
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
        
        const imageObj = await Promise.all(stateContext.files.map((file, index)=>{return loadImages(file, index)}))

        Promise.allSettled(imageObj).then((result)=>{
            const resolvedImageObj = result.filter((res) => res.status === "fulfilled").map((res) => res.value);
            console.log('images from file')
            console.log(resolvedImageObj)
            setStateContext({...stateContext, imagesFromFile: resolvedImageObj})
        })}
    
    useEffect(()=>{
       if (stateContext.imagesFromFile){} 
       else{extractImages()} 
       },[props])



    
        return ( 
        <div className="imagesContainer">
            <div className="imagesRender">
            {
            stateContext.imagesFromFile ? (
                stateContext.imagesFromFile
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
                                <Thumbnail img={img} key={index} context={props.context}/>
                            ))}
                        </div>
                    ))
            )
            : 
            <div>
                <h1>images loading</h1>
            </div>
            }
            </div>
            <div className="imagesCtrlButtons">
                <button className='imageButton' onClick={()=>{setStateContext({...stateContext, files:null})}}>cancle</button>
                <button className='imageButton'>submit</button>
            </div>
        </div>
     );
}
 
export default Images;