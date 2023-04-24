import SvgGenerator from './SvgGenerator'

const ToolBar = (props) => {

    return(
        <div className="toolBarContainer">
            <SvgGenerator path={"Rotate"} scale={10} fill={'#f2f2f2'} callBack={()=>{}}/>
            <SvgGenerator path={"Light"} scale={10} fill={'#f2f2f2'} callBack={props.handleReduceGlare}/>
            <SvgGenerator path={"Resize"} scale={10} fill={'#f2f2f2'} callBack={()=>{}}/>
            <SvgGenerator path={"Comment"} scale={10} fill={'#f2f2f2'} callBack={()=>{}}/>
            <SvgGenerator path={"Rejected"} scale={10} fill={'#f2f2f2'} callBack={()=>{}}/>
        </div>

    );
}

export default ToolBar;