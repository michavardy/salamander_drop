import Icons from './images/icons.json'

const SvgGenerator = (props) => {

    return (
      <div className='icon' onClick={props.callBack}>
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
        )
}
export default SvgGenerator;