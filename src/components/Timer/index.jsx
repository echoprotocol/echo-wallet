import React from 'react';
import PropTypes from 'prop-types';

class Timer extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			counter: null,
			done: false,
		};
	}

	componentWillMount() {
		this.setState({
			counter: this.props.countdown,
		});
	}


	componentDidMount() {

		this.myInterval = setInterval(() => {
			this.setState(({ counter }) => ({
				counter: counter - 1,
			}));
		}, 1000);
	}


	componentDidUpdate() {
		if (this.state.counter === 0) {
			clearInterval(this.myInterval);
			this.hideTimmer();
		}
	}

	hideTimmer() {
		this.setState({
			counter: null,
			done: true,
		});
	}

	render() {
		const { counter, done } = this.state;

		return (

			done ?
				null :
				<div className="timer">
					{counter}
				</div>
		);
	}

}

Timer.propTypes = {
	countdown: PropTypes.number,
};

Timer.defaultProps = {
	countdown: 12,
};

export default Timer;
