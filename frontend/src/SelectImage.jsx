import React, {useState, useEffect, useRef} from 'react'
import SvgGenerator from './SvgGenerator'
import EXIF from 'exif-js';
import GoogleMapReact from 'google-map-react';



const Modal = (props) => {
    console.log("modal props")
    console.log(props)
    
    function handleChange(event){
        console.log('modal text box')
        console.log(event)
    }
    return (
            <div className="modalContent">
                <button className="close" onClick={()=>{
                    props.modalRef.current.style.display = 'None';
                    props.selectImageBodyRef.current.style.display='flex';
                    }}>x</button>
                <h1> Edit Data</h1>
                <div className="modalForm">
                    <label for="imageName">Image Name: </label>
                    <input type="text" id="imageName" value={props.} onChange={handleChange}></input>
                </div>

            </div>
    );
  };  



const ToolBar = (props) => {
    const [rotation, setRotation] = useState(0);
    const [scale, setScale] = useState(1);
    const [imageRef, setImageRef] = useState(null)

    useEffect(()=>{
        if (props){
            setImageRef(props.imageRef)
        }
    },[props])
    useEffect(() => {
        console.log(rotation);
      }, [rotation]);
    useEffect(() => {
        console.log(scale);
      }, [scale]);
      useEffect(() => {
        console.log(props.showModal);
      }, [props.showModal]);
    return(
        <div className="toolBarContainer">
        {imageRef ? 

            (
            <div>
            <SvgGenerator path={"Rotate"} scale={10} fill={'#f2f2f2'} callBack={()=>{ 
                setRotation(rot => rot + 90);
                imageRef.current.style.transform = `rotate(${rotation}deg)`;}}/>
            <SvgGenerator path={"Light"} scale={10} fill={'#f2f2f2'} callBack={()=>{}}/>
            <SvgGenerator path={"Resize"} scale={10} fill={'#f2f2f2'} callBack={()=>{
                setScale(scl => scl + 0.1);
                imageRef.current.style.transform = `scale(${scale})`
            }}/>
            <SvgGenerator path={"Comment"} scale={10} fill={'#f2f2f2'} callBack={()=>{}}/>
            <SvgGenerator path={"Rejected"} scale={10} fill={'#f2f2f2'} callBack={()=>{}}/>
            <SvgGenerator path={"Approve"} scale={10} fill={'#f2f2f2'} callBack={()=>{}}/>
            <SvgGenerator path={"Edit"} scale={10} fill={'#f2f2f2'} callBack={()=>{
                props.setShowModal(prevState => !prevState);
                props.modalRef.current.style.display = 'flex';
                props.selectImageBodyRef.current.style.display='none';

            }}/>
            <SvgGenerator path={"Approve"} scale={10} fill={'#f2f2f2'} callBack={()=>{}}/>
            </div>)
            :
            <div></div>
        }
        </div>

    );
}

const RenderDateTimeComponent = (props) => {
    const [geo, setGeo] = useState(null);
    const [city, setCity] = useState(null);
    const [district, setDistrict] = useState(null);
    const [country, setCountry] = useState(null);
    useEffect(() => {
        async function fetchGeo() {
          try {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${props.GPS.Latitude},${props.GPS.Longitude}&key=AIzaSyDAl5UCGrZAxSUDeWqIkIH5oqsDF-CRKWs`;
            const response = await fetch(url);
            const json = await response.json();
            console.log(json)
            setGeo(json)
          } catch (error) {
            console.log(error);
          }
        }
        if (props.GPS && props.GPS.Latitude && props.GPS.Longitude){
            fetchGeo();}}, [props])
    useEffect(()=>{
        if (geo){
            console.log(geo)
            const cty = geo.results[0].address_components[1].short_name
            setCity(cty);
            const dstrct = geo.results[0].address_components[3].short_name
            setDistrict(dstrct);
            const ctry = geo.results[geo.results.length - 1].formatted_address
            setCountry(ctry)
        }
    },[geo])

    return(
        <div className="DateTimeContainer">
            <div style={{fontSize:"50px",color:"var(--text-color)"}}>{city}</div>
            <div style={{fontSize:"20px",color:"var(--text-color)"}}>{`${district} - ${country}`}</div>
            <div style={{fontSize:"70px",color:"var(--text-color)"}}>{props.DateTime.split(" ")[1]}</div>
            <div style={{fontSize:"30px",color:"var(--text-color)"}}>{props.DateTime.split(" ")[0]}</div>  
        </div>
    )
}

const RenderMapComponent = (props) => {
    return(
        <div className="MapContainer">
             <Map />
        </div>
    )
}

const AnyReactComponent = ({ text }) => <div>{text}</div>;

function Map(props) {
    const [latitude, setLatitude] = useState(null)
    const [longitude, setLongitude] = useState(null)
    useEffect(()=>{
        if (props.GPS){
            setLatitude(props.GPS.Latitude)
            setLongitude(props.GPS.Longitude)
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
    const imageRef = useRef(null);
    const modalRef = useRef(null);
    const selectImageBodyRef = useRef(null)
    const [metaData, setMetaData] = useState(null)
    const [DateTime, setDateTime] = useState(null)
    const [GPSDMS, setGPSDMS] = useState(null)
    const [GPS, setGPS] = useState(null)
    const [showModal, setShowModal] = useState(false)

    useEffect(()=>{
        const md = extractMetadataFromBase64Image(props.selectImage.image);
        setMetaData(md);
    },[props])
    useEffect(()=>{
        const dt = extractDateTimeFromMetaData(metaData)
        setDateTime(dt);
    },[metaData])
    useEffect(()=>{
        const gps = extractGPSFromMetaData(metaData)
        setGPSDMS(gps);
    },[metaData])
    useEffect(()=>{
        if (GPSDMS){
            const gps = {}
            console.log(GPSDMS)
            for (const [key,val] of Object.entries(GPSDMS)){
                const degrees = val[0];
                const minutes = val[1];
                const seconds = val[2];
                const direction = val[3];
                const decimal = dmsToDecimal(degrees, minutes, seconds, direction);
                gps[key] = decimal
            }
            setGPS(gps)
        }
        else{
            setGPS(null) 
        }

    },[GPSDMS])


    
    return ( 
        <div className='selectImageContainer'>
            <div className="ModalContainer" ref={modalRef}>
            {
                showModal ? 
                <Modal imgData={props.selectImage} DateTime={DateTime} GPS={GPS} modalRef={modalRef} selectImageBodyRef={selectImageBodyRef}/>
                : <div></div>
            }

            </div>
            <div className="selectImageBody" ref={selectImageBodyRef}>
            <div className='metaDataContainer'>
                <div className="map">
                {GPS ? <div>
                    <RenderMapComponent/>
                    </div> : <h1> No GPS data in Image</h1> }
                </div>
                <div className="dateTimePlace">
                    {DateTime ? <RenderDateTimeComponent DateTime={DateTime} GPS={GPS}/> : <h1> No Date Time data in Image</h1> }
                </div>
            </div>
            <div className='selectImage'>
            <img className='image' src={props.selectImage.image} alt={props.selectImage.name}  style={{width: "500px", height: "500px"}} ref={imageRef}/>
            </div>
            <div className="editControls">
                <ToolBar imageRef={imageRef} showModal={showModal} setShowModal={setShowModal} modalRef={modalRef} selectImageBodyRef={selectImageBodyRef}/>
            </div>
            </div>
            <div className="imagesCtrlButtons">
                <button className='imageButton' onClick={()=>{props.setSelectImage(null)}}>cancle</button>
                <button className='imageButton' onClick={()=>{console.log(props)}}>debug</button>
                <button className='imageButton'>save</button>
            </div>
        </div>
     );
}
 
export default SelectImage;