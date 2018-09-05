// Удалить этот файл, если не перейдем обратно к нетворкам в дропдауне

import React from 'react';
import { Dropdown, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { NETWORKS_PATH } from '../../constants/RouterConstants';

class Network extends React.PureComponent {

	constructor() {
		super();
		this.state = {
			options: [
				{ text: 'MainNet' },
				{ text: 'TestNet' },
				{ text: 'DevNet' },
			],
		};
	}

	onDropdownChange(e, value) {
		e.preventDefault();
		e.stopPropagation();
		console.log(e.target);
		if (value === 'netCustom') {
			// this.setState({});
		}
		if (e.type === 'click') {
			// this.setState({ });
			return;
		}
		if (e.keyCode === 13) {
			// this.setState({});
		}
	}

	render() {
		const {
			instance,
		} = this.props;
		let options = [];

		const networks = this.state.options.map(({ text }, index) => ({
			value: index,
			key: index,
			content: (
				<React.Fragment>
					<span className="label-text">{text}</span>
					<Button className="icon-remove" />
				</React.Fragment>
			),
		}));

		options = options.concat(networks);
		options.push({
			value: 'network-link',
			key: 'network-link',
			content: (
				<Link className="network-link" to={NETWORKS_PATH} >
					{instance ? instance.url : ''}
				</Link>
			),
		});

		return (
			<Dropdown
				upward
				options={options}
				onChange={(e, { value }) => this.onDropdownChange(e, value)}
				direction="left"
				closeOnChange={false}
				trigger={
					<span className="status connected"> TestNet </span>
				}
				className="network-dropdown"
				icon={false}
			/>
		);


	}

}
Network.propTypes = {
	instance: PropTypes.any,
};

Network.defaultProps = {
	instance: null,
};

export default connect(
	(state) => ({
		instance: state.echojs.getIn(['system', 'instance']),
	}),
	() => ({ }),
)(Network);
