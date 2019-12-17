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
					<div className="dropdown-item-title">
						{i.title}
					</div>
					<div className="dropdown-item-link">
						<a
							href={i.link}
							target="_blank"
							rel="noreferrer noopener"
						>
							{i.link}
						</a>
					</div>
				</div>
			);
			return {
				value: i.title,
				key: i.link,
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
				link: 'http://savedurl.com/123451',
			},
			{
				title: '192.168.0.2',
				link: 'http://savedurl.com/123452',
			},
			{
				title: '192.168.0.5',
				link: 'http://savedurl.com/1s23451',
			},
		];
		return (
			<div className="ip-url-dropdown-wrap">
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
			</div>
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
