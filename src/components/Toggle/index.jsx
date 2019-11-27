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
		this.props.onChange();
	}

	render() {
		const { label } = this.props;
		const { checked } = this.state;
		return (

			<div className="toggle-wrap">
				<button onClick={this.onToggle} className="toggle">
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
	onChange: PropTypes.func,
};

Toggle.defaultProps = {
	label: true,
	onChange: () => { },
};


export default Toggle;
