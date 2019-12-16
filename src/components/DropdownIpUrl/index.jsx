import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import classnames from 'classnames';

class DropdownIpUrl extends React.Component {

	onSearch(e) {
		this.props.setFormValue('ipOrUrl', e.target.value);
	}

	renderList(options) {

		return options.map((i) => {
			const content = (
				<div className="dropdown-item">
					{
						i.type === 'ip' ?
							<div className={classnames(i.type)} >
								{i.title}
							</div> :
							<a
								href={i.title}
								target="_blank"
								rel="noreferrer noopener"
								className={classnames(i.type)}
							>
								{i.title}
							</a>
					}
				</div>
			);
			return {
				value: i.title,
				key: i.title,
				content,
			};
		});

	}


	render() {
		const { status, loading, signupOptionsForm } = this.props;

		const ipOrUrl = signupOptionsForm.get('ipOrUrl');

		const options = [
			{
				title: '192.168.0.4',
				type: 'ip',
			},
			{
				title: 'http://savedurl.com/123451',
				type: 'url',
			},
		];
		return (
			<React.Fragment>
				<Dropdown
					floating
					search
					fluid
					disabled={loading}
					className="ip-url-dropdown"
					searchQuery={ipOrUrl.value}
					closeOnChange
					icon={false}
					onSearchChange={(e) => this.onSearch(e)}
					text={ipOrUrl.value}
					selection
					onBlur={() => {}}
					options={this.renderList(options)}
					noResultsMessage={undefined}
				/>
				{
					status &&
						<span className={classnames('value-status', `icon-${status}`)} />
				}
			</React.Fragment>
		);
	}

}

DropdownIpUrl.propTypes = {
	status: PropTypes.string,
	loading: PropTypes.bool.isRequired,
	setFormValue: PropTypes.func.isRequired,
	signupOptionsForm: PropTypes.object.isRequired,
};

DropdownIpUrl.defaultProps = {
	status: '',
};

export default DropdownIpUrl;
