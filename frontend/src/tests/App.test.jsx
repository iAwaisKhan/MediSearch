import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';
import { LangProvider } from '../context/LangContext';
import '@testing-library/jest-dom';

test('renders App component', () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <LangProvider>
          <App />
        </LangProvider>
      </AuthProvider>
    </BrowserRouter>
  );
  
  // Checking if the Navbar logo text exists (assuming Navbar is rendered in App)
  const logoElements = screen.getAllByText(/MediSearch/i);
  expect(logoElements.length).toBeGreaterThan(0);
});
