import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { account } from '../appwrite.js';

const AppWrapper = () => {
  useEffect(() => {
   
    const checkUserSession = async () => {
      try {
        const user = await account.get();
        console.log('Logged in user:', user);
      } catch (error) {
        console.log('No user session found:', error);
      }
    };

    checkUserSession();
  }, []);

  return <App />;
};


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>,
);


