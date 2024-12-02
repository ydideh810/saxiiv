import React from 'react';
import { Terminal } from './components/Terminal';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <Terminal />
    </LanguageProvider>
  );
}

export default App;