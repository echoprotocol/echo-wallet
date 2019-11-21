import React from 'react';
import PropTypes from 'prop-types';

class Toggle extends React.Component {

	constructor() {
		super();

		this.state = {
			checked: false,
		};

		this.onToggle = this.onToggle.bind(this);
	}

	onToggle() {
		this.setState({
			checked: !this.state.checked,
		});
	}

	render() {
		const { label } = this.props;
		const { checked } = this.state;
		return (

			<div className="toggle-wrap">
				<button onKeyPress={this.onToggle} onClick={this.onToggle} className="toggle">
					<span className={`slider ${this.state.checked && 'checked'}`} />
				</button>
				{
					label &&
					<div className="toggle-label">
						{checked ? 'On' : 'Off'}
					</div>
				}
			</div>
		);
	}

}

Toggle.propTypes = {
	label: PropTypes.bool,
};

Toggle.defaultProps = {
	label: true,
};


export default Toggle;
