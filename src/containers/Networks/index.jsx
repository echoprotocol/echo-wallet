import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Form, Button } from 'semantic-ui-react';
import classnames from 'classnames';

import { NETWORKS } from '../../constants/GlobalConstants';

import { saveNetwork } from '../../actions/GlobalActions';

import AddCustomForm from './AddCustomForm';

class Networks extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			network: props.network,
			showCustom: false,
		};
	}

	onChangeNetwork(network) {
		this.setState({ network, showCustom: false });
	}

	onSaveNetwork(e) {
		e.preventDefault();

		if (this.state.network.name === this.props.network.name) {
			return;
		}

		this.props.saveNetwork(this.state.network);
	}

	onShowCustom() {
		this.setState({ network: { name: 'custom' }, showCustom: true });
	}

	render() {
		const { history } = this.props;
		const { network: { name }, showCustom } = this.state;

		return (
			<div className="sign-scroll-fix">
				<Form className="main-form">
					<div className="form-info">
						<h3>Networks</h3>
					</div>
					<div className="field-wrap">
						<div className="radio-list">
							{
								NETWORKS.map((network) => (
									<div className="radio" key={network.name} >
										<input
											type="radio"
											id={network.name}
											name="network"
											onChange={(e) => this.onChangeNetwork(network, e)}
											checked={name === network.name}
										/>
										<label className="label" htmlFor={network.name}>
											<span className="label-text">{network.name}</span>
										</label>
									</div>
								))
							}
							<div className="radio">
								<input
									type="radio"
									id="custom"
									name="network"
									onChange={(e) => this.onShowCustom(e)}
									checked={name === 'custom'}
								/>
								<label className="label" htmlFor="custom">
									<span className="label-text">custom</span>
								</label>
							</div>
						</div>
						<AddCustomForm showCustom={showCustom} />
					</div>
					<Button
						basic
						type="submit"
						color="orange"
						className={classnames('error-wrap')}
						content="Save"
						onClick={(e) => this.onSaveNetwork(e)}
						disabled={name === this.props.network.name}
					/>
					<span className="sign-nav">
                        Return to
						<a href="#" className="link orange pointer" onClick={history.goBack} onKeyPress={history.goBack}>Back</a>
					</span>
				</Form>
			</div>
		);
	}

}

Networks.propTypes = {
	history: PropTypes.object.isRequired,
	network: PropTypes.object.isRequired,
	saveNetwork: PropTypes.func.isRequired,
};

export default withRouter(connect(
	(state) => ({
		network: state.global.getIn(['network']).toJS(),
	}),
	(dispatch) => ({
		saveNetwork: (network) => dispatch(saveNetwork(network)),
	}),
)(Networks));
