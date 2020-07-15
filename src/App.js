import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props){
	super(props);
  	this.state = {
	    deck: [],       // the deck of cards
      dealer: null,   // dealer object
      player: null,   // player object
      gameOver: false,// game status
      message: null   // any message that needs to be displayed
	};
  }
  // generate the deck///////////
  generateDeck() {
	// console.log("Generate deck...");
    const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A']; // the cards that are used
    const suits = ['♦','♣','♥','♠'];                                // these are the special characters for the cards
    const deck = [];                                                // initiated as an empty array
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < suits.length; j++) {
        deck.push({number: cards[i], suit: suits[j]});
      }
    }
	// console.log("generatedDeck()", deck);
    return deck;
  }
  ////////end of generate deck///
  // start a new game ///////////
  startNewGame(type) {
	
    if (type === 'continue') {
      const deck = (this.state.deck.length < 10) ? this.generateDeck() : this.state.deck; // generate aa new deck if less than 10 cards left
      const { updatedDeck, player, dealer } = this.dealCards(deck);                       // deal using the new deck

      this.setState({
		      deck: updatedDeck,
          dealer,
          player,
          gameOver: false,
          message: null
      });
      
    } else {
      const deck = this.generateDeck();
      const { updatedDeck, player, dealer } = this.dealCards(deck);

      this.setState({
		    deck: updatedDeck,
        dealer,
        player,
        gameOver: false,
        message: null
      });
    }
  }
  /////////////end of new game///
  // deal cards//////////////////
  dealCards(deck) {
    const playerCard1 = this.getRandomCard(deck);                     // pick a random card from the players deck
    const dealerCard1 = this.getRandomCard(playerCard1.updatedDeck);  // pick one for the dealer
    const playerCard2 = this.getRandomCard(dealerCard1.updatedDeck);  // player needs another one. The Dealer's is hidden  
    const playerStartingHand = [playerCard1.randomCard, playerCard2.randomCard];
    const dealerStartingHand = [dealerCard1.randomCard, {}];
    
    const player = {
      cards: playerStartingHand,
      count: this.getTotalOfHand(playerStartingHand)
    };
    const dealer = {
      cards: dealerStartingHand,
      count: this.getTotalOfHand(dealerStartingHand)
    };
    
    return {updatedDeck: playerCard2.updatedDeck, player, dealer};
  }
  ///////////end of deal cards///
  // others//////////////////////
  // get a random card from any deck/////
  getRandomCard(deck) {
    const updatedDeck = deck;
    const randomIndex = Math.floor(Math.random() * updatedDeck.length);
    const randomCard = updatedDeck[randomIndex];
    updatedDeck.splice(randomIndex, 1);
    return { randomCard, updatedDeck };
  }
  ////////////////////////random ends////
  // hit goes here///////////
  hit() {
    if (!this.state.gameOver) {
	    const { randomCard, updatedDeck } = this.getRandomCard(this.state.deck);
      const player = this.state.player;
      player.cards.push(randomCard);
      player.count = this.getTotalOfHand(player.cards);

      if (player.count > 21) {// you have gone bust! Game over!!!
          this.setState({ player, gameOver: true, message: 'You have gone bust!' });
      } else {
          this.setState({ deck: updatedDeck, player });
      }
    } else {
      this.setState({ message: 'Game over! Click on "New game" to start playiing again.' });
    }
  }
  // ///////////end of hit//
  // stand goes here///////////////
  stand() {
    if (!this.state.gameOver) {
      // Show dealer's 2nd card
      const randomCard = this.getRandomCard(this.state.deck);
      let deck = randomCard.updatedDeck;
      let dealer = this.state.dealer;
      dealer.cards.pop();
      dealer.cards.push(randomCard.randomCard);
      dealer.count = this.getTotalOfHand(dealer.cards);

      // continue to draw cards until at least 17
      while(dealer.count < 17) {
        const draw = this.dealerDraw(dealer, deck);
        dealer = draw.dealer;
        deck = draw.updatedDeck;
      }

      if (dealer.count > 21) {
        this.setState({
          deck,
          dealer,
          gameOver: true,
          message: 'Dealer bust! You win!'
        });
      } else {
        const winner = this.getWinner(dealer, this.state.player);
        let message;
        
        if (winner === 'dealer') {
          message = 'Dealer wins.';
        } else if (winner === 'player') {
          message = 'You win!';
        } else {
          // it's a draw!
          message = 'Push.';
        }
        
        this.setState({
          deck, 
          dealer,
          gameOver: true,
          message
        });
      } 
    } else {
      this.setState({ message: 'Game over!' });
    }
  }
  //////////////////end of stand///
  // the dealer's second 'secret' card////
  dealerDraw(dealer, deck) {
    const { randomCard, updatedDeck } = this.getRandomCard(deck);
    dealer.cards.push(randomCard);
    dealer.count = this.getTotalOfHand(dealer.cards);
    return { dealer, updatedDeck };
  }
  ////////////////////end of second card//
  // get the total of the face value////
  getTotalOfHand(cards) {
    const rearranged = [];
	  let cardNum = 1;
    cards.forEach(card => {
      // console.log("checking card..." + cardNum, card); cardNum++;
      // special case for 'A'
      if (card.number === 'A') {
        rearranged.push(card);
      } else if (card.number) {
        rearranged.unshift(card);
      }
    });
    
    return rearranged.reduce((total, card) => {
      // calculate the total for the type of card
      // for J Q K and A
      if (card.number === 'J' || card.number === 'Q' || card.number === 'K') {
        return total + 10;
      } else if (card.number === 'A') {
        // if A and exceeds 21 just add 1
        return (total + 11 <= 21) ? total + 11 : total + 1;
      } else {
        // for numbercards just add the number
        return total + card.number;
      }
    }, 0);
  }
  /////////////get total ends///////////
  // check to see who's won//////
  getWinner(dealer, player) {
    if (dealer.count > player.count) {
      return 'dealer';
    } else if (dealer.count < player.count) {
      return 'player';
    } else {
      return 'push';
    }
  }
  ////////////end of getWinner///
  UNSAFE_componentWillMount() {
    this.startNewGame();
    const body = document.querySelector('body');
  }
  ///////////////////////////////
  render(){	
    let dealerCount;
    const card1 = this.state.dealer.cards[0].number;
    const card2 = this.state.dealer.cards[1].number;
    // if there's a card two then it means the dealer has played
    if (card2) {
      dealerCount = this.state.dealer.count;
    } else {
      // just check what card it is to see the initial total
      if (card1 === 'J' || card1 === 'Q' || card1 === 'K') {
        dealerCount = 10;
      } else if (card1 === 'A') {
        dealerCount = 11;
      } else {
        dealerCount = card1;
      }
    }
	  return (
		<div>
		  
        <div>
          <button onClick={() => {this.startNewGame()}}>New Game</button>
          <button data-testid="button-hit" onClick={() => {this.hit()}}>Hit</button>
          <button onClick={() => {this.stand()}}>Stand</button>
        </div>
        
        
        
        {
          this.state.gameOver ?
          <div>
            <button onClick={() => {this.startNewGame('continue')}}>Click to Continue</button>
          </div>
          : null
        }
        <p><strong>You have: { this.state.player.count }</strong></p>

		    <p hidden data-testid="num-cards">{ this.state.player.cards.length }</p>
		    <p hidden data-testid="deck-cards">{ this.state.deck.length }</p>

        <div>
            { this.state.player.cards.map((card, i) => {
              return <Card key={i} number={card.number} suit={card.suit}/>
            }) }
        </div>
        <br/><br/>
        <p><strong>Dealer's Cards: { this.state.dealer.count }</strong></p>
        <div>
            { this.state.dealer.cards.map((card, i) => {
              return <Card key={i} number={card.number} suit={card.suit}/>;
            }) }
        </div>
        <br /><br />
        <p>{ this.state.message }</p>
      </div>
	  );
  }
}
// Card defined here///////////////////////////////////////////////////////
const Card = ({ number, suit }) => {
  const face = (number) ? `${number}${suit}` : null;
  const color = (suit === '♦' || suit === '♥') ? 'red' : '';
  
  return (
    <span>
      <div style={{border:'1px solid black', float: 'left', width: '2em', height:'2.25em', textAlign:'center', borderRadius:'5%'}} className={color}>
        { face }
      </div>
    </span>
  );
};
//////////end of Card definition///////////////////////////////////////////
export default App;
