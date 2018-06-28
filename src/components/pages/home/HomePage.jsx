import React from 'react';
import ModalSignIn from '../../modals/SignIn';

class HomePage extends React.Component {


	render() {
		return (
			<div>
				Home page content 22323
				<ModalSignIn
					show={true}
					onClose={() => this.updateState({ displayedModal: null })}
					container={this}
				/>
			</div>
		);
	}

}

export default HomePage;




