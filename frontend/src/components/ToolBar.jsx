import SvgGenerator from './SvgGenerator'
import {ImageContext} from './Upload'
import {useContext} from 'react'


const ToolBar = (props) => {
    return(
        <div className="toolBarContainer">

            <SvgGenerator path={"Rotate"} scale={10} fill={'#f2f2f2'} callBack={props.handleRotate}/>
            <SvgGenerator path={"Light"} scale={10} fill={'#f2f2f2'} callBack={props.handleReduceGlare}/>
            <SvgGenerator path={"Resize"} scale={10} fill={'#f2f2f2'} callBack={()=>{}}/>
            <SvgGenerator path={"Comment"} scale={10} fill={'#f2f2f2'} callBack={()=>{}}/>
            <SvgGenerator path={"Rejected"} scale={10} fill={'#f2f2f2'} callBack={props.handleRejected}/>
        </div>

    );
}

export default ToolBar;