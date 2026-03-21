import React from 'react';
import Home from './pages/Home';
import { InterviewProvider } from './context/InterviewContext';

function App() {
  return (
    <InterviewProvider>
      <div className="w-full h-full bg-[#030712]">
        <Home />
      </div>
    </InterviewProvider>
  );
}

export default App;

