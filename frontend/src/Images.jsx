import React, {useState, useEffect} from 'react'
import './global.css';

const Thumbnail = (props) => {
    return(
        <div className='thumbnailContainer'>
            <img className='image' src={props.img.image} alt="thumbnail" onClick={()=>{props.setSelectImage(props.img)}} style={{width: "100px", height: "100px"}}/>
            <div className="imgData">
                <div className="imgName">{props.img.name}</div>
                <div className="imgSize">{Math.round(props.img.size / 100000)} Mb</div>
            </div>

        </div>
    )
}
const Images = (props) => {
    const [imageData, setImageData] = useState(null)

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
                    "image":dataURL 
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
        //useEffect(()=>{console.log(imageData)},[imageData])
    
        return ( 
        <div className="imagesContainer">
            <div className="imagesRender">
            {
            //imageData ? imageData.map((img, index)=> <Thumbnail img={img} key={index}/>)
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

            : <h1> image data not loaded</h1>
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