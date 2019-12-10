import React from "react";
import { Animate } from "react-move";

class AnimatedProgressProvider extends React.Component {
	constructor(props) {
		super(props);
		this.state ={
			isAnimated: false
		}
		this.interval = null;
	}

	static defaultProps = {
		valueStart: 0
	};

  componentDidMount() {
    if (this.props.repeat) {
      this.interval = window.setInterval(() => {
        this.setState({
          isAnimated: !this.state.isAnimated
        });
      }, this.props.duration * 1000);
    } else {
      this.setState({
        isAnimated: !this.state.isAnimated
      });
    }
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  render() {
    return (
      <Animate
        start={() => ({
          value: this.props.valueStart
        })}
        update={() => ({
          value: [
            this.state.isAnimated ? this.props.valueEnd : this.props.valueStart
          ],
          timing: {
            duration: this.props.duration * 1000,
            ease: this.props.easingFunction
          }
        })}
      >
        {({ value }) => this.props.children(value)}
      </Animate>
    );
  }
}

export default AnimatedProgressProvider;