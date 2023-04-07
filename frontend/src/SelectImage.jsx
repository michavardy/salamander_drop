import React, {useState, useEffect, useRef, useContext} from 'react'
import SvgGenerator from './SvgGenerator'
import EXIF from 'exif-js';
import GoogleMapReact from 'google-map-react';



const Modal = (props) => {
    const {stateContext, setStateContext} = useContext(props.context)
    
    return (
            <div className="modalContent">
                <button className="close" onClick={()=>{
                    props.modalRef.current.style.display = 'None';
                    props.selectImageBodyRef.current.style.display='flex';
                    }}>x</button>
                <h1 className="formTitle"> Edit Image Data</h1>
                <div className="modalForm">
                    <div className="formLine">
                    <label className="formLabel" htmlFor="imageName">Image Name: </label>
                    <input className="formInput" type="text" id="imageName" value={stateContext.selectImage.name} onChange={(event)=>{setStateContext({...stateContext, selectImage:{...stateContext.selectImage, name: event.target.value}})}}></input>
                    </div>
                    <div className="formLine">
                    <label className="formLabel" htmlFor="imageDateTime">Image Date Time: </label>
                    <input className="formInput" type="text" id="imageDateTime" value={stateContext.dateTime} onChange={(event)=>{setStateContext({...stateContext, dateTime:event.target.value})}}></input>
                    </div>
                    <div className="formLine">
                    <label className="formLabel" htmlFor="imageContributer">Image Contributer: </label>
                    <input className="formInput" type="text" id="imageContributer" value={stateContext.contributer} onChange={(event)=>{setStateContext({...stateContext, contributer:event.target.value})}}></input>
                    </div>
                </div>
                <div className="formSubmit">
                    <button className="formSubmit" onClick={()=>{}}>Submit</button>
                </div>

            </div>
    );
  };  



const ToolBar = (props) => {
    const {stateContext, setStateContext} = useContext(props.context)

    useEffect(()=>{
        if (props){
            setStateContext({...stateContext, imageRef:props.imageRef})
        }
    },[props])
    useEffect(() => {
        console.log(stateContext.rotation);
      }, [stateContext.rotation]);
    useEffect(() => {
        console.log(stateContext.scale);
      }, [stateContext.scale]);
      useEffect(() => {
        console.log(stateContext.showModal);
      }, [stateContext.showModal]);
    return(
        <div className="toolBarContainer">
        {stateContext.imageRef ? 
            (
            <div>
            <SvgGenerator path={"Rotate"} scale={10} fill={'#f2f2f2'} callBack={()=>{ 
                setStateContext({...stateContext, rotation:rot => rot + 90})
                stateContext.imageRef.current.style.transform = `rotate(${stateContext.rotation}deg)`;}}/>
            <SvgGenerator path={"Light"} scale={10} fill={'#f2f2f2'} callBack={()=>{}}/>
            <SvgGenerator path={"Resize"} scale={10} fill={'#f2f2f2'} callBack={()=>{
                setStateContext({...stateContext, scale:scl => scl + 0.1})
                stateContext.imageRef.current.style.transform = `scale(${stateContext.scale})`
            }}/>
            <SvgGenerator path={"Comment"} scale={10} fill={'#f2f2f2'} callBack={()=>{}}/>
            <SvgGenerator path={"Rejected"} scale={10} fill={'#f2f2f2'} callBack={()=>{
                setStateContext({...stateContext, approved:false}
            }}/>
            <SvgGenerator path={"Approve"} scale={10} fill={'#f2f2f2'} callBack={()=>{
                setStateContext({...stateContext, approved:true}
            }}/>
            <SvgGenerator path={"Edit"} scale={10} fill={'#f2f2f2'} callBack={()=>{
                setStateContext({...stateContext, showModal:prevState => !prevState});
                props.modalRef.current.style.display = 'flex';
                props.selectImageBodyRef.current.style.display='none';
            }}/>
            </div>)
            :
            <div></div>
        }
        </div>

    );
}

const RenderDateTimeComponent = (props) => {
    const {stateContext, setStateContext} = useContext(props.context)
    useEffect(() => {
        async function fetchGeo() {
          try {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${stateContext.GPS.Latitude},${stateContext.GPS.Longitude}&key=AIzaSyDAl5UCGrZAxSUDeWqIkIH5oqsDF-CRKWs`;
            const response = await fetch(url);
            const json = await response.json();
            setStateContext({...stateContext, geo:json})
          } catch (error) {
            console.log(error);
          }
        }
        if (stateContext.GPS && stateContext.GPS.Latitude && stateContext.GPS.Longitude){
            fetchGeo();}}, [props])
    useEffect(()=>{
        if (stateContext.geo){
            const cty = stateContext.geo.results[0].address_components[1].short_name
            const dstrct = stateContext.geo.results[0].address_components[3].short_name
            const ctry = stateContext.geo.results[stateContext.geo.results.length - 1].formatted_address
            setStateContext({...stateContext, 
                city:cty,
                district:dstrct,
                country:ctry
                })
        }
    },[stateContext.geo])

    return(
        <div className="DateTimeContainer">
            <div style={{fontSize:"50px",color:"var(--text-color)"}}>{stateContext.city}</div>
            <div style={{fontSize:"20px",color:"var(--text-color)"}}>{`${stateContext.district} - ${stateContext.country}`}</div>
            <div style={{fontSize:"70px",color:"var(--text-color)"}}>{stateContext.DateTime.split(" ")[1]}</div>
            <div style={{fontSize:"30px",color:"var(--text-color)"}}>{stateContext.DateTime.split(" ")[0]}</div>  
        </div>
    )
}

const RenderMapComponent = (props) => {
    return(
        <div className="MapContainer">
             <Map context={context}/>
        </div>
    )
}

const AnyReactComponent = ({ text }) => <div>{text}</div>;

function Map(props) {
    const {stateContext, setStateContext} = useContext(props.context)
    const [latitude, setLatitude] = useState(null)
    const [longitude, setLongitude] = useState(null)
    useEffect(()=>{
        if (stateContext.GPS){
            setLatitude(stateContext.GPS.Latitude)
            setLongitude(stateContext.GPS.Longitude)
        }

    }, [props])

    const defaultCenter = {lat: 33.0287, lng: 35.3946};
    const defaultZoom = 10;
  
    return (
      <div style={{ height: '30vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyDAl5UCGrZAxSUDeWqIkIH5oqsDF-CRKWs' }}
          defaultCenter={defaultCenter}
          defaultZoom={defaultZoom}
        />
        { latitude && longitude ?
                <AnyReactComponent
                lat={latitude}
                lng={longitude}
                text="My Marker"
              />
            : <AnyReactComponent/>
        }
        </div>
    );
  }


const extractMetadataFromBase64Image = (base64Image) => {
    const binaryImage = atob(base64Image.split(',')[1]); // convert base64 to binary
    const buffer = new ArrayBuffer(binaryImage.length); // create an ArrayBuffer from binary data
    const view = new Uint8Array(buffer); // create a view to access the buffer
    for (let i = 0; i < binaryImage.length; i++) {
        view[i] = binaryImage.charCodeAt(i); // copy binary data to the buffer
      }
      const exifData = EXIF.readFromBinaryFile(buffer); // read EXIF data from buffer
      return exifData;
}

const extractDateTimeFromMetaData = (md) => {
    if (md && md.DateTime) {
        return md.DateTime;
    } else {
        return null;
    }
}

const dmsToDecimal = (degrees, minutes, seconds, direction) => {
    let decimal = degrees + minutes/60 + seconds/3600;
    if (direction === "S" || direction === "W") {
      decimal = -decimal;
    }
    return decimal;
}

const extractGPSFromMetaData = (md) => {
    if (md && md.GPSLatitude && md.GPSLongitude) {
        return {
            "Latitude": [md.GPSLatitude[0].valueOf(), md.GPSLatitude[1].valueOf(), md.GPSLatitude[2].valueOf(), md.GPSLatitudeRef],
            "Longitude": [md.GPSLongitude[0].valueOf(), md.GPSLongitude[1].valueOf(), md.GPSLongitude[2].valueOf(), md.GPSLongitudeRef]
        }
            
    } else {
        return null;
    }
}


const SelectImage = (props) => {
    const {stateContext, setStateContext} = useContext(props.context)
    const imageRef = useRef(null);
    const modalRef = useRef(null);
    const selectImageBodyRef = useRef(null)

    useEffect(()=>{
        const md = extractMetadataFromBase64Image(stateContext.selectImage.image);
        setStateContext({...stateContext, metaData: md})
    },[props])
    useEffect(()=>{
        const dt = extractDateTimeFromMetaData(stateContext.metaData)
        setStateContext({...stateContext, dateTime: dt})
    },[stateContext.metaData])
    useEffect(()=>{
        const gps = extractGPSFromMetaData(stateContext.metaData)
        setStateContext({...stateContext, GPSDMS: gps})

    },[stateContext.metaData])
    useEffect(()=>{
        if (stateContext.GPSDMS){
            const gps = {}

            for (const [key,val] of Object.entries(stateContext.GPSDMS)){
                const degrees = val[0];
                const minutes = val[1];
                const seconds = val[2];
                const direction = val[3];
                const decimal = dmsToDecimal(degrees, minutes, seconds, direction);
                gps[key] = decimal
            }
            setStateContext({...stateContext, GPS: gps})
        }
        else{
            setStateContext({...stateContext, GPS: null})
        }

    },[stateContext.GPSDMS])

    return ( 
        <div className='selectImageContainer'>
            <div className="ModalContainer" ref={modalRef}>
            {
                stateContext.showModal ? 
                <Modal  modalRef={modalRef} selectImageBodyRef={selectImageBodyRef} context={context}/>
                : <div></div>
            }

            </div>
            <div className="selectImageBody" ref={selectImageBodyRef}>
            <div className='metaDataContainer'>
                <div className="map">
                {stateContext.GPS ? <div>
                    <RenderMapComponent context={context}/>
                    </div> : <h1> No GPS data in Image</h1> }
                </div>
                <div className="dateTimePlace">
                    {stateContex.dateTime ? <RenderDateTimeComponent context={context}/> : <h1> No Date Time data in Image</h1> }
                </div>
            </div>
            <div className='selectImage'>
            <img className='image' src={stateContext.selectImage.image} alt={stateContext.selectImage.name}  style={{width: "500px", height: "500px"}} ref={imageRef}/>
            </div>
            <div className="editControls">
                <ToolBar imageRef={imageRef}  modalRef={modalRef} selectImageBodyRef={selectImageBodyRef} context={context}/>
            </div>
            </div>
            <div className="imagesCtrlButtons">
                <button className='imageButton' onClick={()=>{setStateContext({...stateContext, selectImage:null})}}>cancle</button>
                <button className='imageButton'>save</button>
            </div>
        </div>
     );
}
 
export default SelectImage;