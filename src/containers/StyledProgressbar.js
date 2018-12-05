import React from 'react';
import "./StyledProgressbar.css";
import status_feed from "./assets/status_feed.png";
import status_shower from "./assets/status_shower.png";
import status_sleep from "./assets/status_sleep.png";

class StyledProgressBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: 0
    };
  }

  timer_inc() {
    this.setState(state => ({
         timer: state.timer + 1
    }));
  }

  componentDidMount() {
    this.interval = setInterval(() => {
         this.timer_inc();
    }, 500);
  }

  render() {
    // Size of the enclosing square
    const sqSize = this.props.sqSize;
    // SVG centers the stroke width on the radius, subtract out so circle fits in square
    const radius = (this.props.sqSize - this.props.strokeWidth) / 2;
    // Enclose cicle in a circumscribing square
    const viewBox = `0 0 ${sqSize} ${sqSize}`;
    // Arc length at 100% coverage is the circle circumference
    const dashArray = radius * Math.PI * 2;
    // Scale 100% coverage overlay with the actual percent
    var dashOffset;
    if (this.props.percentage<=0) {
      // dashOffset = dashArray;
      if (this.state.timer%2===0) dashOffset = dashArray;
      else dashOffset = 0;
    } else {
      dashOffset = dashArray - dashArray * this.props.percentage / this.props.h;
    }
    
    const status = this.props.status; 
    var url;
    if (status==="1") {
      url = "url(#image1)";
    } else
    if (status==="2") {
      url = "url(#image2)";
    }  else
    if (status==="3") {
      url = "url(#image3)";
    }

    return (
        <svg
            width={this.props.sqSize}
            height={this.props.sqSize}
            viewBox={viewBox}>
            <circle
              className="circle-background"
              cx={this.props.sqSize / 2}
              cy={this.props.sqSize / 2}
              r={radius}
              strokeWidth={`${this.props.strokeWidth}px`} />
            <circle
              className="circle-progress"
              cx={this.props.sqSize / 2}
              cy={this.props.sqSize / 2}
              r={radius}
              strokeWidth={`${this.props.strokeWidth}px`}
              // Start progress marker at 12 O'Clock
              transform={`rotate(-90 ${this.props.sqSize / 2} ${this.props.sqSize / 2})`}
              style={{
                strokeDasharray: dashArray,
                strokeDashoffset: -dashOffset
              }} />
            <defs>
              <pattern id="image1" patternUnits="userSpaceOnUse" height="80" width="80">
                <image x="10" y="10" height="80" width="80" xlinkHref={status_feed}></image>
              </pattern>
              <pattern id="image2" patternUnits="userSpaceOnUse" height="80" width="80">
                <image x="10" y="10" height="80" width="80" xlinkHref={status_shower}></image>
              </pattern>
              <pattern id="image3" patternUnits="userSpaceOnUse" height="80" width="80">
                <image x="10" y="10" height="80" width="80" xlinkHref={status_sleep}></image>
              </pattern>
            </defs>
            <circle 
              cx={this.props.sqSize / 2}
              cy={this.props.sqSize / 2}
              r="45"
              fill={url}
            />
        </svg>
    );
  }
}

export default StyledProgressBar;

