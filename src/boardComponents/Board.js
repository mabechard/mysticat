import React, {Component} from 'react';
import axios from 'axios';
import '../styles/app.css';
import Field from './Field.js';
import Graveyard from './Graveyard.js';
import Deck from './Deck.js';
import Hero from './Hero.js';
import Hand from './Hand.js';
import SurrenderScreenPopUp from './SurrenderScreenPopUp.js';
import EndGameScreen from './EndGameScreen.js';
import PopUpEndOfTurn from './PopUpEndOfTurn.js';
import Battlelog from './Battlelog.js';
import Beforeunload from 'react-beforeunload';
import * as Constantes from '../Constantes.js';

const TIME_BETWEEN_AXIOS_CALLS = 1000;

let players;
let selfIndex;
let self;
let opponent;
let opponentIndex;
let battlelog;

let selectedOpponentFieldCellIndex;

export default class Board extends Component{
	constructor(props){
		super(props);
		this.state ={
			playerId: null,
			isThinkingToGiveUp: false,
			isEndGame: null,
			waitingForOpponentToEndTurn: false,
			actionList : [],
			cellsOfSummonedMinionsThisTurn : [false, false, false, false, false, false, false],
			indexesOfPlayedCardsThisTurn : [false, false, false, false, false, false, false, false, false, false],
			cellsOfAttackingMinion: [false, false, false, false, false, false, false],
			targetMinion:null,
			attackerSelected:null,
			endOfTurn:false,
			surrendering: false,
			selectedCardIndex:null,
			selectedFieldCellIndex:null,
			showBattlelog: false
		};
	}

	componentWillMount(){
		this.setState({gameState: this.props.gameState, isLoaded: true, playerId: this.props.playerId})
		//initializing players main attributes from the gamestate

		players = this.props.gameState.players;
		selfIndex = (players[0].playerId === this.props.playerId) ? 0 : 1;
		opponentIndex = (selfIndex === 0) ? 1 : 0;
		self = players[selfIndex];
		opponent = players[opponentIndex];
		battlelog = this.props.gameState.battlelog;

	}
	changeAttackingSelected(index){
		if(null === this.state.attackerSelected){
			this.setState({attackerSelected : index});
		}else if(index === this.state.attackerSelected ){
			let cellsOfAttackingMinion = this.state.cellsOfAttackingMinion;
			cellsOfAttackingMinion[index]=false
			this.setState({attackerSelected : null});
			this.setState({cellsOfAttackingMinion: cellsOfAttackingMinion});
		}else if(index !== this.state.attackerSelected ){
			let cellsOfAttackingMinion = 	this.state.cellsOfAttackingMinion;
			cellsOfAttackingMinion[this.state.attackerSelected ]=false;
			this.setState({attackerSelected : index, cellsOfAttackingMinion: cellsOfAttackingMinion});
		}
	}

	changeTargetSelected(index){
		if(null!==opponent.field[index]){
			this.setState({targetMinion : index});
			selectedOpponentFieldCellIndex = index;
			this.addAttackAction();
			this.resetAttackingState()
		}
	}

	render(){
	
		return(
			<div id="container" className='orientationSensitive'>
				<Beforeunload onBeforeunload={() => {
					this.addSurrenderAction();
					this.sendActions();
					this.props.disconnectPlayer(); return "Are you sure?"}}/>
				<div id="board">
					<div id="opponentHand" className="hand">
						<Hand players={players} playerIndex={opponentIndex} faceUp={false} />
					</div>
					<div id="opponentHandUnderLayer"></div>
					<Hero id="opponentHero" health={opponent.hero.health} heroName={opponent.heroPortrait} changeTargetSelected={this.changeTargetSelected.bind(this)}/>

					<div id="fieldContainer" className="fieldContainer">
						<Graveyard id="opponentGraveyard" graveyard={opponent.graveyard} identity={"opponent"}/>
						<div id="opponentField" className="battleField">
							<Field players={players} playerIndex={opponentIndex} belongsToSelf={false}
							attackerSelected={this.state.attackerSelected} targetSelected={this.changeTargetSelected.bind(this)}/>
						</div>
						<Deck id="opponentDeck" size={opponent.deck.length}/>
					</div>

					<div id="selfFieldContainer" className="fieldContainer">
						<Graveyard id="selfGraveyard" graveyard={self.graveyard} identity={"self"}/>
						<div id="selfField" className="battleField">
							<Field players={players} playerIndex={selfIndex} belongsToSelf={true} self={self} callBackSelectedMinion={this.retrieveMinionSelectedIndex}
							 cellsOfSummonedMinionsThisTurn={this.state.cellsOfSummonedMinionsThisTurn} cellsOfAttackingMinion={this.state.cellsOfAttackingMinion}
							changeAttackerSelected={this.changeAttackingSelected.bind(this)} attackerSelected={this.state.attackerSelected}/>
						</div>
						<Deck id="selfDeck" size={self.deck.length}/>
					</div>
					<div id="selfFieldUnderLayer"></div>

					<Hero id="selfHero" health={self.hero.health} heroName={self.heroPortrait}/>

					<div id="selfHand" className="hand">
						<Hand players={players} playerIndex={selfIndex} faceUp={true} callBackSelectedCardIndex={this.retrieveCardSelectedIndex}
						cellsOfSummonedMinionsThisTurn ={this.state.cellsOfSummonedMinionsThisTurn} selectedCardIndex = {this.state.selectedCardIndex} />
					</div>
					<button id="buttonEndTurn" onClick={this.sendActions.bind(this)}>Fin de tour</button>
					<PopUpEndOfTurn status={this.state.endOfTurn} />
					<SurrenderScreenPopUp status={this.state.isThinkingToGiveUp} surrender={this.surrender.bind(this)} stayInTheGame={this.surrenderGameConfirmStateChange.bind(this)} />
					<EndGameScreen status={this.state.isEndGame} backToMainMenu={this.backToMainMenu.bind(this)}/>

					<button id="buttonBattlelog" onClick={this.showBattlelogBox.bind(this)}>Battlelog</button>
					<Battlelog status={this.state.showBattlelog} logs={battlelog} />

					<button id="ButtonSurrender" onClick={this.surrenderGameConfirmStateChange.bind(this)}>Abandonner</button>

					<div id="opponentUserName"><p title={opponent.name}>{opponent.name}</p></div>
					<div id="selfUserName"><p title={self.name}>{self.name}</p></div>
					<div id="selfMana"><div>{self.remainingMana}</div></div>
				</div>
			</div>
		);
	}

	addSummonAction = (selectedIndex) => {
		let wereTheseCardsPlayedThisTurn = this.state.indexesOfPlayedCardsThisTurn;
		let wasThisCardAlreadyPlayedThisTurn = wereTheseCardsPlayedThisTurn[this.state.selectedCardIndex];

		let areTheseCellsAboutToBeSummonedOn = this.state.cellsOfSummonedMinionsThisTurn;
		let wasAMinionAlreadyPlayedOnThisCell = areTheseCellsAboutToBeSummonedOn[selectedIndex];
		let manaCost = self.hand[this.state.selectedCardIndex].manaCost;
		let selfMana = self.remainingMana;

		if(
			false===wasThisCardAlreadyPlayedThisTurn
			&& true===(selfMana>=manaCost)
			&& true===(null===self.field[selectedIndex])
			&& false===wasAMinionAlreadyPlayedOnThisCell){

			wereTheseCardsPlayedThisTurn[this.state.selectedCardIndex] = true;
			areTheseCellsAboutToBeSummonedOn[selectedIndex] = true;

			self.field[selectedIndex] =({canAttack:false, cardReference:self.hand[this.state.selectedCardIndex],
				description: self.hand[this.state.selectedCardIndex].description,
				health:self.hand[this.state.selectedCardIndex].initialHealth,
				name:self.hand[this.state.selectedCardIndex].name,
				power:self.hand[this.state.selectedCardIndex].initialPower,
				speed:self.hand[this.state.selectedCardIndex].initialSpeed});

			self.hand[this.state.selectedCardIndex].isSummoned = true;

			this.setState({indexesOfPlayedCardsThisTurn: wereTheseCardsPlayedThisTurn,
										cellsOfSummonedMinionsThisTurn : areTheseCellsAboutToBeSummonedOn});
			let actions = this.state.actionList;
			actions.push({ 	playerIndex : selfIndex,
							indexOfCardInHand : this.state.selectedCardIndex,
							fieldCellWhereTheMinionIsBeingSummoned : selectedIndex
						});
			this.setState({ actionList: actions ,
			selectedCardIndex: null})

			self.remainingMana = selfMana - manaCost;
		}
	}

	addAttackAction = () => {
		let cellsOfAttackingMinion = this.state.cellsOfAttackingMinion;
		let hasThisMinionAlreadyAttacked = cellsOfAttackingMinion[this.state.attackerSelected];
		let isThereAMinionOnThisCell = (null!==self.field[this.state.attackerSelected]);
		let isThereAnOpponentMinionThere = (null!==opponent.field[selectedOpponentFieldCellIndex]);
		if(isThereAMinionOnThisCell && isThereAnOpponentMinionThere && hasThisMinionAlreadyAttacked){
			this.setState({cellsOfAttackingMinion: cellsOfAttackingMinion});
			let actions = this.state.actionList;
			actions.push({ 	playerIndex : selfIndex,
							attackingMinionIndex : this.state.attackerSelected,
							speed : self.field[this.state.attackerSelected].speed,
							targetIndex: selectedOpponentFieldCellIndex
						});
			this.setState({ actionList: actions })
		}
	}

	addSurrenderAction = () => {
		let actions = this.state.actionList;
		actions.push({ 	playerIndex : selfIndex,
						field : 'Abandonner'
					});
		this.setState({ actionList: actions })
	}

	getInitialGameInstance(){
		axios({
			  method:'get',
			  url:'http://'+window.location.hostname+':'+Constantes.PORT_NUMBER+'/getHardCodedGame',
			  responseType:'json',
			  headers: {'Access-Control-Allow-Origin': "true"}
			})
			  .then((response)=>{
				  this.setState({gameState: response.data, isLoaded: true});
				  this.forceUpdate();
				})
				.catch(error => {
				  console.log('Error fetching and parsing data', error);
				  setTimeout(()=>{
					  this.getInitialGameInstance();
				  }, TIME_BETWEEN_AXIOS_CALLS)
		});
	}

	//Periodically calls the back end to know if both players have posted their actions
	checkIfGameUpdated(){
		const data = this.state.playerId;
		axios({
			  method:'post',
			  url:'http://'+window.location.hostname+':'+Constantes.PORT_NUMBER+'/checkIfGameUpdated',
			  responseType:'json',
			  headers: {'Access-Control-Allow-Origin': "true"},
			  data: data
			})
			  .then((response)=>{
				  if(response.data!==null){
					  	this.setState({gameState: response.data,
							  actionList : [],
							  activeIndex : null,
								cellsOfSummonedMinionsThisTurn: [false, false, false, false, false, false, false],
								indexesOfPlayedCardsThisTurn : [false, false, false, false, false, false, false, false, false, false],
								cellsOfAttackingMinion: [false, false, false, false, false, false, false],
								targetMinion:null,
								attackerSelected:null,
								waitingForOpponentToEndTurn: false,
								endOfTurn:false,
								showBattlelog:false
					  	});
						players = this.state.gameState.players;
						self = this.state.gameState.players[selfIndex];
						opponent = this.state.gameState.players[opponentIndex];
						battlelog = this.state.gameState.battlelog;
						this.selfUserHasWon();
						this.forceUpdate();
				  }
				  else{
						if(true===this.state.waitingForOpponentToEndTurn){
							setTimeout(()=>{
								this.checkIfGameUpdated();
							}, TIME_BETWEEN_AXIOS_CALLS)
						}
				  }
				})
				.catch(error => {
				  console.log('Error fetching and parsing data', error);
				});
	}

	sendActions(){
		this.setState({selectedCardIndex: null});
		const data = {
					gameId: this.state.gameState.gameId,
					playerActions: this.state.actionList,
					playerId: this.state.playerId
			};
		axios({
			  method:'post',
			  url:'http://'+window.location.hostname+':'+Constantes.PORT_NUMBER+'/sendActions',
			  responseType:'json',
			  headers: {'Access-Control-Allow-Origin': "true"},
			  data: data
			})
			  .then((response)=>{
					this.setState({waitingForOpponentToEndTurn:true});
					if(true===this.state.surrendering){
							this.loseGame();
					}
					else{
						this.checkIfGameUpdated();
						this.resetAttackingState();
						this.setState({endOfTurn:true});
					}
				})
				.catch(error => {
				  console.log('Error fetching and parsing data', error);
				});
	}

	resetAttackingState(){
		this.setState({
				targetMinion:null,
				attackerSelected:null
			});
			selectedOpponentFieldCellIndex = null;
	}

	retrieveCardSelectedIndex = (selectedIndex) => {
		if(selectedIndex===this.state.selectedCardIndex){
			this.setState({selectedCardIndex : null})
		}
		else{
			this.setState({selectedCardIndex : selectedIndex})
		}
	}

	retrieveMinionSelectedIndex = (selectedIndex) =>{
		if(null!==this.state.selectedCardIndex && undefined!==this.state.selectedCardIndex){


			this.addSummonAction(selectedIndex);

		}
	}

	cancelActionSubmission(){
			this.setState({waitingForOpponentToEndTurn:false});
	}

	/* methods to surrender/quit the game */
	surrenderGameConfirmStateChange(){
		let status = this.state.isThinkingToGiveUp;
		this.setState({ isThinkingToGiveUp: !status });
	}

	surrender(){
		this.surrenderGameConfirmStateChange();
		this.clearActionList();
		this.addSurrenderAction();
		this.setState({surrendering: true});
		this.sendActions();
	}

	loseGame(){
		this.setState({ isEndGame: 1 });
	}

	winGame(){
		this.setState({ isEndGame: 0 });
	}

	drawGame(){
		this.setState({ isEndGame: -1 });
	}

	selfUserHasWon(){
		if(this.state.gameState.winnerPlayerIndex != null){
			if(this.state.gameState.winnerPlayerIndex === selfIndex){
				this.winGame();
			} else if(this.state.gameState.winnerPlayerIndex === opponentIndex){
				this.loseGame();
			} else {
				this.drawGame();
			}
		}
	}

	showBattlelogBox(){
		if(!this.state.showBattlelog)
			this.setState({ showBattlelog: true });
		else
			this.setState({ showBattlelog: false });
	}

	clearActionList(){
		let actions = this.state.actionList;
		actions.pop();
		this.setState({ actionList : actions });
	}

	backToMainMenu(){
		this.props.endGame();
	}
}
