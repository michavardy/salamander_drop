import SvgGenerator from "./SvgGenerator";
import { ImageContext } from "./Upload";
import { useContext } from "react";

const ToolBar = (props) => {
  return (
    <div className="toolBarContainer">
      <SvgGenerator
        path={"Rotate"}
        scale={10}
        fill={"#f2f2f2"}
        callBack={props.handleRotate}
        description="Rotate Image"
      />
      <SvgGenerator
        path={"Light"}
        scale={10}
        fill={"#f2f2f2"}
        callBack={props.handleReduceGlare}
        description="Reduce Glare"
      />
      <SvgGenerator
        path={"Resize"}
        scale={10}
        fill={"#f2f2f2"}
        callBack={props.handleResize}
        description="Resize Image"
      />
      <SvgGenerator
        path={"Comment"}
        scale={10}
        fill={"#f2f2f2"}
        callBack={props.handleComment}
        description="add comment"
      />
      <SvgGenerator
        path={"Rejected"}
        scale={10}
        fill={"#f2f2f2"}
        callBack={props.handleRejected}
        description="Reject Image"
      />
    </div>
  );
};

export default ToolBar;
