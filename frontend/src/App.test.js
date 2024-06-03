import { render, screen } from '@testing-library/react';
import App from './App';

test('renders CupGPT header', () => {
  render(<App />);
  const headerElement = screen.getByText(/CupGPT Coding Monkey Wizard/i);
  expect(headerElement).toBeInTheDocument();
});
