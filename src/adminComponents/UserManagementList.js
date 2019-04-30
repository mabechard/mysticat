import React, {Component} from 'react';
import UserManagement from './UserManagement.js';
import '../styles/admin.css';

export default class UserManagementList extends Component{
	constructor(props){
		super(props);
		this.state={

		}
	}

	render(){
		return(
			<div id="containerUserList">
				{this.props.userList.map((user, index) => <UserManagement key={"User" + index} index={index} username={user.userName} id={user.userId} connected={user.isConnected} disconnectPlayerById={this.props.disconnectPlayerById}/>)}
			</div>
		)
	}

	disconnectPlayerById(id){
		this.props.disconnectPlayerById(id);
	}
}
