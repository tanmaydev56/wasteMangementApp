import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { account } from '../appwrite.js'; 

const AppWrapper = () => {
  useEffect(() => {
    // Check user session
    const checkUserSession = async () => {
      try {
        const user = await account.get();
        console.log('Logged in user:', user);
      } catch (error) {
        console.log('No user session found:', error);
      }
    };

    checkUserSession();

    // Dynamically inject chatbot script
    const loadChatbotScript = () => {
      // Add chatbot config script
      const scriptConfig = document.createElement('script');
      scriptConfig.innerHTML = `
        window.embeddedChatbotConfig = {
          chatbotId: "4hgAiK1bIjPvI98gYRWW8",
          domain: "www.chatbase.co"
        }
      `;
      document.body.appendChild(scriptConfig);

      // Add chatbot embed script
      const script = document.createElement('script');
      script.src = "https://www.chatbase.co/embed.min.js";
      script.setAttribute('chatbotId', "4hgAiK1bIjPvI98gYRWW8");
      script.setAttribute('domain', "www.chatbase.co");
      script.defer = true;
      document.body.appendChild(script);
    };

    loadChatbotScript();
  }, []);

  return <App />;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
);
