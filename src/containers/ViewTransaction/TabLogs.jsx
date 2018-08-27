import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropdown from '../../components/Dropdown';

class TabLogs extends React.Component {

	renderLog(item, key) {
		const { dataLog, topics } = this.props;

		const options = [
			{
				text: 'hex',
				value: 'hex',
			},
			{
				text: 'id',
				value: 'id',
			},
		];

		return (
			<React.Fragment key={key}>
				<li key={`${item.data}topics`}>
					<div className="col">Topics:</div>
					<div className="col">
						{
							item.log.map((topic, i) => {
								const convertedTopic = topics.find((val) => i === val.id);

								return (
									<div className="topic-item" key={`${item.data}${topic}`}>
										<span className="num">[{i}]</span>
										{ i !== 0 && <Dropdown data={topic} component={i} variativeOptions={options} />}
										{convertedTopic ? convertedTopic.value : `0x${topic}`}
									</div>
								);
							})
						}
					</div>
				</li>
				<li key={`${item.data}data`}>
					<div className="col data">Data:</div>
					<div className="col">
						<div className="data-item">
							<Dropdown data={item.data} component="dataLog" />
							<span className="arrow">→</span>
							{dataLog || `0x${item.data}`}
						</div>
					</div>
				</li>
			</React.Fragment>
		);
	}


	render() {
		const { details } = this.props.data;

		return (
			<div className="tab-content">
				<ul className="logs-list">
					{details.tr_receipt.log.map((log, i) => this.renderLog(log, i))}
				</ul>
			</div>
		);
	}

}

TabLogs.propTypes = {
	data: PropTypes.object.isRequired,
	dataLog: PropTypes.any,
	topics: PropTypes.array.isRequired,
};

TabLogs.defaultProps = {
	dataLog: '',
};

export default connect(
	(state) => ({
		dataLog: state.converter.get('data'),
		topics: state.converter.get('topics').toJS(),
	}),
	() => ({}),
)(TabLogs);
