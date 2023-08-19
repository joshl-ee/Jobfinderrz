import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders phone number label', () => {
  render(<App />);
  const linkElement = screen.getByText(/Phone Number/i);
  expect(linkElement).toBeInTheDocument();
});
