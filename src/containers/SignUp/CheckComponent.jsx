import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';


class CheckComponent extends React.Component {

	constructor(props) {
		super(props);
		const { intl } = props;
		const ch1 = intl.formatMessage({ id: 'sign_page.register_account_page.checkboxes.first' });
		const ch2 = intl.formatMessage({ id: 'sign_page.register_account_page.checkboxes.second' });
		const ch3 = intl.formatMessage({ id: 'sign_page.register_account_page.checkboxes.third' });
		this.state = {
			checkList: [
				{
					id: 1,
					text: ch1,
					checked: false,
				},
				{
					id: 2,
					text: ch2,
					checked: false,
				},
				{
					id: 3,
					text: ch3,
					checked: false,
				},
			],
		};
	}

	onChange(e, index) {
		const { checkList } = this.state;
		checkList[index].checked = e.target.checked;
		this.setState({ checkList });

		this.props.setValue('accepted', !checkList.find((i) => !i.checked));
	}

	render() {
		const { checkList } = this.state;
		const { loading } = this.props;

		return (
			<div className="check-list">
				{
					checkList.map(({ id, text, checked }, index) => (
						<div className="check small" key={id}>
							<input type="checkbox" id={id} checked={checked} onChange={(e) => this.onChange(e, index)} disabled={loading} />
							<label className="label" htmlFor={id}>
								<span className="label-text">{text}</span>
							</label>
						</div>
					))
				}
			</div>
		);
	}

}

CheckComponent.propTypes = {
	setValue: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
	intl: PropTypes.any.isRequired,
};

export default injectIntl(CheckComponent);

