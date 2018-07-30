import React from 'react';
import { Segment, Sidebar } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SidebarMenu from '../../components/SideMenu/index';
import Header from '../../components/Header/index';
import Footer from '../../components/Footer/index';
import TableComponent from './TableComponent';

import { hideBar } from '../../actions/GlobalActions';


class Activity extends React.Component {

	componentWillMount() {
		this.props.hideBar(this.props.visibleBar);
	}
	render() {
		return (
			<Sidebar.Pushable as={Segment}>
				<SidebarMenu />
				<Sidebar.Pusher
					dimmed={this.props.visibleBar}
					onClick={() => this.props.hideBar()}
				>
					<Segment basic className="wrapper">
						<Header curentUserId={this.props.userId} />
						<TableComponent curentUserId={this.props.userId} />
						<Footer />
					</Segment>
				</Sidebar.Pusher>
			</Sidebar.Pushable>
		);
	}

}

Activity.propTypes = {
	userId: PropTypes.string,
	visibleBar: PropTypes.bool.isRequired,
	hideBar: PropTypes.func.isRequired,
};

Activity.defaultProps = {
	userId: '',
};

export default connect(
	(state) => ({
		visibleBar: state.global.get('visibleBar'),
		userId: state.global.getIn(['activeUser', 'id']),
	}),
	(dispatch) => ({
		hideBar: (value) => dispatch(hideBar()),
	}),
)(Activity);
