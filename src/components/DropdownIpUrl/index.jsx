import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import classnames from 'classnames';

class DropdownIpUrl extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			searchText: '',
		};
	}

	onSearch(e) {
		this.setState({ searchText: e.target.value });
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
		const { searchText } = this.state;

		const { status } = this.props;

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
					className="ip-url-dropdown"
					searchQuery={searchText}
					closeOnChange
					icon={false}
					onSearchChange={(e) => this.onSearch(e)}
					text={searchText}
					selection
					onBlur={() => {}}
					options={this.renderList(options)}
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
};

DropdownIpUrl.defaultProps = {
	status: '',
};

export default DropdownIpUrl;
