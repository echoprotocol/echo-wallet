import React from 'react';
import { connect } from 'react-redux';
import { Table, Form, Button } from 'semantic-ui-react';
import classnames from 'classnames';
// import PropTypes from 'prop-types';


class Voting extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
		};
	}

	render() {
		return (
			<div className="voting-wrap">
				<div className="proxy-wrap">
					<div className="proxy-head">
						<h3>Proxy</h3>
						<Button
							basic
							className="green"
							content="Save"
						/>
					</div>
					<div className="description">
                        You may delegate your votes to another account.
                        That means another account will be able to vote on your behalf.
					</div>
					<Form className="horizontal-input">
						<Form.Field
							className={classnames({ error: false })}
						>
							<p className="i-title">Account Name</p>
							<input
								type="text"
								name="account-name"
								className="ui input"
							/>
							{false && <span className="error-message">error-message</span>}
						</Form.Field>
					</Form>
				</div>
				<div className="main-table-wrap">
					<h3>Committee Members</h3>
					<Table structured fixed className="main-table">
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>Name</Table.HeaderCell>
								<Table.HeaderCell>Votes</Table.HeaderCell>
								<Table.HeaderCell>info</Table.HeaderCell>
								<Table.HeaderCell>
									<span className="th-voting">Voting</span>
								</Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							<Table.Row>
								<Table.Cell >
                                    valik21
								</Table.Cell>
								<Table.Cell>
                                    456 323 000
								</Table.Cell>
								<Table.Cell>
									<div className="link">http://info.com/125hlKXEemMDVG</div>
								</Table.Cell>
								<Table.Cell>
									<div className="voted-wrap">
										<i className="voted icon-voted" />
										<Button
											basic
											className="capitalize"
											content="cancel"
										/>
									</div>
								</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell >
                                    valik21
								</Table.Cell>
								<Table.Cell>
                                    456 323 000
								</Table.Cell>
								<Table.Cell>
									<div className="link">http://info.com/125hlKXEemMDVG</div>
								</Table.Cell>
								<Table.Cell>
									<Button
										basic
										className="main-btn capitalize"
										content="vote"
									/>
									<Button
										basic
										className="capitalize"
										content="cancel"
									/>
								</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell >
                                    valik21
								</Table.Cell>
								<Table.Cell>
                                    456 323 000
								</Table.Cell>
								<Table.Cell>
									<div className="link">http://info.com/125hlKXEemMDVG</div>
								</Table.Cell>
								<Table.Cell>
									<Button
										basic
										className="main-btn capitalize"
										content="vote"
									/>
									<Button
										basic
										className="capitalize"
										content="cancel"
									/>
								</Table.Cell>
							</Table.Row>
						</Table.Body>
					</Table>
				</div>
				<div className="main-table-wrap air">
					<h3>Backup Committee Members</h3>
					<Table structured fixed className="main-table">
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>Name</Table.HeaderCell>
								<Table.HeaderCell>Votes</Table.HeaderCell>
								<Table.HeaderCell>info</Table.HeaderCell>
								<Table.HeaderCell>
									<span className="th-voting">Voting</span>
								</Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							<Table.Row>
								<Table.Cell >
                                    valik21
								</Table.Cell>
								<Table.Cell>
                                    456 323 000
								</Table.Cell>
								<Table.Cell>
									<div className="link">http://info.com/125hlKXEemMDVG</div>
								</Table.Cell>
								<Table.Cell>
									<Button className="btn-lock icon-lock" />
								</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell >
                                    valik21
								</Table.Cell>
								<Table.Cell>
                                    456 323 000
								</Table.Cell>
								<Table.Cell>
									<div className="link">http://info.com/125hlKXEemMDVG</div>
								</Table.Cell>
								<Table.Cell>
									<Button className="btn-lock icon-lock" />
								</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell >
                                    valik21
								</Table.Cell>
								<Table.Cell>
                                    456 323 000
								</Table.Cell>
								<Table.Cell>
									<div className="link">http://info.com/125hlKXEemMDVG</div>
								</Table.Cell>
								<Table.Cell>
									<Button className="btn-lock icon-lock" />
								</Table.Cell>
							</Table.Row>
						</Table.Body>
					</Table>
				</div>
			</div>
		);
	}

}

Voting.propTypes = {};

Voting.defaultProps = {};

export default connect()(Voting);
