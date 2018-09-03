import React from 'react';
import { connect } from 'react-redux';
import { Form, Button } from 'semantic-ui-react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

class Networks extends React.Component {

	constructor() {
		super();

		this.state = {
			showCustom: false,
			networksList: [
				{
					id: 1,
					value: 'MainNet',
				},
				{
					id: 2,
					value: 'TestNet',
				},
				{
					id: 3,
					value: 'DevNet',
				},
				{
					id: 'custom',
					value: 'Custom Network',
				},
			],
		};

	}
	onShowCustom(id) {
		if (id === 'custom') {
			this.setState({ showCustom: true });
		} else {
			this.setState({ showCustom: false });
		}
	}
	render() {
		const { networksList } = this.state;

		return (
			<div className="sign-scroll-fix">
				<Form className="main-form">
					<div className="form-info">
						<h3>Networks</h3>
					</div>
					<div className="field-wrap">
						<div className="radio-list">
							{
								networksList.map(({ id, value }) => (
									<div className="radio" key={id} >
										<input
											type="radio"
											id={id}
											name="network"
											onChange={() => this.onShowCustom(id)}
										/>
										<label
											className="label"
											htmlFor={id}
										>
											<span className="label-text">{value}</span>
										</label>
									</div>
								))
							}
						</div>
						<div className={classnames('custom-network', { active: this.state.showCustom })}>

							<Form.Field className={classnames('error-wrap')}>
								<label htmlFor="address">Address</label>
								<input placeholder="Address" disabled={!this.state.showCustom} name="address" className="ui input" />
								<span className="error-message">asdasd</span>
							</Form.Field>
							<Form.Field className={classnames('error-wrap')}>
								<label htmlFor="name">Name</label>
								<input placeholder="Name" disabled={!this.state.showCustom} name="name" className="ui input" />
								<span className="error-message">asdasd</span>
							</Form.Field>
							<Form.Field className={classnames('error-wrap')}>
								<label htmlFor="registrator">Registrator</label>
								<input placeholder="Registrator" disabled={!this.state.showCustom} name="registrator" className="ui input" />
								<span className="error-message">Registrator error</span>
							</Form.Field>

						</div>


					</div>
					<Button
						basic
						type="submit"
						color="orange"
						className={classnames('error-wrap')}
						content="Save"
					/>
					<span className="sign-nav">
                                Return to
						<Link className="link orange" to="/sign-in">Back</Link>
					</span>
				</Form>
			</div>
		);
	}

}

export default connect(
	() => ({}),
	() => ({}),
)(Networks);
