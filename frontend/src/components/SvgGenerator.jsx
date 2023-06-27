import Icons from '../images/icons.json'

const SvgGenerator = (props) => {

  const handleMouseEnter = () => {
    // Show description on hover
    const description = document.getElementById(`${props.path}-description`);
    if (description) {
      description.style.display = 'block';
    }
  };

  const handleMouseLeave = () => {
    // Hide description when not hovering
    const description = document.getElementById(`${props.path}-description`);
    if (description) {
      description.style.display = 'none';
    }
  };

    return (
      <div className="icon-container">
      <div 
      className='icon' 
      onClick={props.callBack}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={`${props.scale}mm`}
          height={`${props.scale}mm`}
          version="1.1"
          viewBox={`0 0 ${props.scale} ${props.scale}`}
        >
            <g
            transform={`scale(${props.scale})`}> 
              <path
                fill={props.fill} 
                strokeWidth={props.scale / 10}
                d={Icons.paths[props.path]}
              ></path>
            </g>
        </svg>
        </div>
        <div 
        className="iconDescription" 
        id={`${props.path}-description`} 
        style={{ display: 'none' }}>
        {props.description}
      </div>
        </div>
        )
}
export default SvgGenerator;