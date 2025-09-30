// Counter.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // For custom matchers like toBeInTheDocument
import WordSearch from './WordSearch';


describe('Word Search Component', () => {
  it('Should render Word Search component', () => {
    render(<WordSearch />);
    expect(screen.getByTestId('count-display')).toHaveTextContent('0');
  });

  it('Writing "Apple" should display list with word apple', () => {
    
  });

  it('Writing "213INEWREEWQ" incorrect word should display empty list', () => {

  });

  it('Display', () => {

  });
});