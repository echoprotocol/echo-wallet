import React from 'react';
import { Dropdown, Input } from 'semantic-ui-react';
import { connect } from 'react-redux';


class Network extends React.PureComponent {

	constructor() {
		super();
		this.state = {
			checked: 0,
			options: [
				{ text: 'MainNet' },
				{ text: 'TestNet' },
				{ text: 'DevNet' },
			],
		};

	}

	onDropdownChange(e, value) {
		e.preventDefault();
		if (value === 'netCustom') {
			this.setState({ checked: value });
			this.nameInput.focus();
		}
		if (e.type === 'click') {
			this.setState({ checked: value });
			return;
		}
		if (e.keyCode === 13) {
			this.setState({ checked: value });
		}
	}

	render() {

		let options = [
			{
				value: 'networks-header',
				key: 'networks-header',
				className: 'networks-header',
				disabled: true,
				content: 'Choose Network',
			},
		];

		const networks = this.state.options.map(({ text }, index) => ({
			value: index,
			key: index,
			selected: this.state.checked === index,
			className: 'radio',
			tabIndex: 0,
			content: (
				<React.Fragment>
					<input type="radio" onChange={() => {}} checked={this.state.checked === index} name="network" />
					<label className="label" htmlFor="net0">
						<span className="label-text">{text}</span>
					</label>
				</React.Fragment>
			),
		}));

		options = options.concat(networks);
		options.push({
			value: 'netCustom',
			key: 'netCustom',
			selected: this.state.checked === 'netCustom',
			className: 'radio',
			tabIndex: 0,
			content: (
				<div className="field error-wrap" >
					<label htmlFor="Address">Custom Address</label>
					<Input
						type="text"
						name="newName"
						ref={(input) => { this.nameInput = input; }}
						className="label-in-left"
					>
						<input />
						<button
							className="edit-option icon-edit-checked"
						/>
						<button
							className="edit-option icon-edit-close"
						/>
					</Input>

					<span className="error-message">Some error</span>
				</div>

			),
		});

		return (
			<Dropdown
				upward
				options={options}
				onChange={(e, { value }) => this.onDropdownChange(e, value)}
				direction="left"
				text="wss://echo-tmp-wallet.pixelplex.io"
				className="network-dropdown"
				icon={false}
				closeOnChange={false}
			/>
		);


	}

}


export default connect(
	() => ({ }),
	() => ({ }),
)(Network);
