
import React, {Component} from 'react';
import '../styles/app.css';
import axios from 'axios';
import * as Constantes from '../Constantes.js';


export default class Login extends Component{
	constructor(props){
		super(props);
		this.state={
			username:'',
			password:'',
			errorMessage:''
		}
		this.handleChangeUsername = this.handleChangeUsername.bind(this);
		this.handleChangePassword = this.handleChangePassword.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	render(){
		return (<div id="loginForm" className="container">
					<div className="boiteConnexion card-container">
						<img alt="profile-img" id="profile-img" className="profile-img-card" src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" />
						<p id="profile-name" className="profile-name-card"></p>
						<h3 id="titlePageConnexion"> Login </h3>
						<form className="form-signin" onSubmit={this.handleSubmit}>
								<span id="reauth-email" className="reauth-email"></span>
								<input className="form-control" placeholder="Nom d'utilisateur" type="text" name="username" id="username" ref="username" onChange={this.handleChangeUsername} required autoFocus/>
								<input className="form-control" placeholder="Mot de passe" type="password" name="password" id="password" ref="password" onChange={this.handleChangePassword} required/>
										<input className="btn btn-lg btn-primary btn-block btn-signin" type="Submit" onClick={this.handleClick} value="Login" readOnly={true} /> <input className="btn btn-lg btn-primary btn-block btn-signin" type="reset" value="Reset"/><br />
										<a className="changeConnexionMode" onClick={this.changeSignUpMode.bind(this)} >Cliquez ici pour vous inscrire</a>
										<p className="errorMessage">{this.state.errorMessage}</p>
							</form>
						</div>
			</div>)
	}

	attemptConnection(){
		const data = {username: this.state.username, password: this.state.password}
		axios({
				method:'post',
				url:'http://'+window.location.hostname+':'+Constantes.PORT_NUMBER+'/attemptConnection',
				responseType:'json',
				headers: {'Access-Control-Allow-Origin': "true"},
				data: data
			})
				.then((response)=>{
					if(response.data!==null){
						this.props.connectPlayer(response.data, this.state.username);
					}else{
							this.setState({errorMessage: "Échec, le nom d'utilisateur et le mot de passe que vous avez entré ne correspondent pas."});
					}
				})
				.catch(error => {
					console.log('Error fetching and parsing data', error);
				});
	}

	handleSubmit(event){
		event.preventDefault();
	}

	handleChangeUsername(event){
		this.setState({username: event.target.value});
	}

	handleChangePassword(event){
		this.setState({password: event.target.value});
	}

	handleClick(event){
		this.attemptConnection();
	}

	changeSignUpMode(){
		this.props.changeSignUpMode();
		}
}
