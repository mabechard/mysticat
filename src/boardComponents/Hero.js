import React, {Component} from 'react';

export default class Hero extends Component{
	constructor(props){
		super(props);
		this.state={heroName:"zorroHero"};
	}

	componentWillMount(){
		this.setState({heroName: this.props.heroName});
	}

	render(){
		let heroId = this.props.id;
		let health = this.props.health;

		if("selfHero" === heroId){
			return(<div className="heroContainer">
						<div id={heroId} className={"hero " + this.state.heroName}>
							<div id="selfHealth" className="heroHealth">
								{health}
							</div>
						</div>
				  </div>);
		}
		else if("opponentHero" === heroId){
			if(true ===this.props.attackerSelected){}
			return(<div id={heroId} className={"hero " + this.state.heroName} onClick={()=>{this.props.changeTargetSelected(-1)}}>
						<div id="opponentHealth" className="heroHealth">
							{health}
						</div>
					</div>);
		}
	}
}
