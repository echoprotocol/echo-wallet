import React from 'react';
import { connect } from 'react-redux';
// import { Form, Button } from 'semantic-ui-react';


class TabLogs extends React.Component {

	render() {
		return (
			<div className="tab-content">
				<ul className="logs-list">
					<li>
						<div className="col">Topics:</div>
						<div className="col">
							<div className="topic-item">
								<span className="num">[0]</span>
                                0x3eesdsd12qse1234nb234h2b34b234b23423423e3242342323423423e3242342
							</div>
							<div className="topic-item"><span className="num">[1]</span>
                                0x3eesdsd12qse1234nb234h2b34b234b23242342323423423e324234234234
							</div>
							<div className="topic-item">
								<span className="num">[2]</span>
                                0x3eesdsd12qse1234nb234h2b34b234b23423423e3223423423e324234234234
							</div>
						</div>
					</li>
					<li>
						<div className="col data">Data:</div>
						<div className="col">
							<div className="data-item">
								<span className="arrow">➡</span>
                                0000000000000000000000000000000000000000000000000dsff3dsd223212sd32
							</div>
							<div className="data-item">
								<span className="arrow">➡</span>
                                00000000000000000000000000000000000000000000000dsffsd223212sd32
							</div>
							<div className="data-item">
								<span className="arrow">➡</span>
                                00000000000000000000000000000000000000000000000dsff21sd223212sd32
							</div>
						</div>
					</li>
				</ul>
			</div>
		);
	}

}

export default connect()(TabLogs);
