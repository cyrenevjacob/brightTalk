import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('Components check', () => {
	test('Renders the main component', () => {
		render(<App/>);
		// screen.debug();	
	});
	
	test('Renders \'You have:\'', () => {
	  // arrange
	  const { getByText } = render(<App />);
	  // assert
	  const dElement = getByText(/You have:/i);
	  expect(dElement).toBeInTheDocument();
	});

	test('Renders \'Dealer\'s Cards:\'', () => {
	  // arrange
	  	const { getByText } = render(<App />);
	  // assert
	  	const dElement = getByText(/Dealer's Cards:/i);
	  	expect(dElement).toBeInTheDocument();
	});
	
    test('Checks the number of cards of the player. Should be 2', () => {
	 	const { getByTestId } = render(<App />);
	 	expect(getByTestId('num-cards')).toHaveTextContent('2');
	
  	});
	test('Checks the number of cards in the deck. 52 in all. 2 with the player and 1 with dealer. So should be 49.', () => {
	 	const { getByTestId } = render(<App />);
	 	expect(getByTestId('deck-cards')).toHaveTextContent('49');
	
  	});
	
});

describe('Functions Test', () => {
  // test for the hit callback//////////////////
  test('Checks to see if Hit increases the number of cards of the player by 1', () => {
	const { getByTestId } = render(<App />);
	fireEvent.click(getByTestId('button-hit'))
	expect(getByTestId('num-cards')).toHaveTextContent('3');
	
  });
  // test for the stand callback//////////////////
  test('Calls the Stand callback handler', () => {
    const onClick = jest.fn();
 
    render(
      <button onClick={onClick}>
        Stand
      </button>
    );
 
    fireEvent.click(screen.getByText('Stand'), {
      target: { value: 'JavaScript' },
    });
 
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});