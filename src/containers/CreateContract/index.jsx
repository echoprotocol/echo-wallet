import React from 'react';
import { connect } from 'react-redux';
import { Form, Segment, Sidebar } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import Header from '../../components/Header/index';
import Footer from '../../components/Footer/index';
import SidebarMenu from '../../components/SideMenu/index';
import FormComponent from './FormComponent';
import ButtonComponent from './ButtonComponent';

import { hideBar } from '../../actions/GlobalActions';

class CreateContract extends React.Component {

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
						<Header onToggleSidebar={this.toggleSidebar} />
						<div className="content center-mode ">
							<Form className="main-form">
								<FormComponent />
								<ButtonComponent />
							</Form>
						</div>
						<Footer />
					</Segment>
				</Sidebar.Pusher>
			</Sidebar.Pushable>
		);
	}

}
CreateContract.propTypes = {
	visibleBar: PropTypes.bool.isRequired,
	hideBar: PropTypes.func.isRequired,
};

export default connect(
	(state) => ({
		visibleBar: state.global.get('visibleBar'),
	}),
	(dispatch) => ({
		hideBar: () => dispatch(hideBar()),
	}),
)(CreateContract);
