
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';    // default import, no curly braces
import Signup from './components/auth/Signup';  // default import, no curly braces
import ChatBot from './components/ChatBot';
import Dashboard from './pages/Dashboard';
import MoodQuiz from './components/MoodQuiz';
import Welcome from './pages/Welcome';
import BreathingGame from './components/games/BreathingGame';
import CatchTheSmile from './components/games/CatchTheSmile';
import PopTheBubbles from './components/games/PopTheBubbles';
import MemoryMatchGame from './components/games/MemoryMatchGame';
import GamesHub from './pages/GamesHub';
import Diary from './pages/Diary';
import News from './pages/News';
function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Welcome />} />  
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat" element={<ChatBot />} />
        <Route path="/mood-quiz" element={<MoodQuiz />} />

        <Route path="/dashboard" element={<Dashboard />} /> {/* default route */}
        <Route path="/games" element={<GamesHub />} />
        <Route path="/games/breathing" element={<BreathingGame />} />
        <Route path="/games/smile" element={<CatchTheSmile />} />
        <Route path="/games/bubbles" element={<PopTheBubbles />} />
        <Route path="/games/memory" element={<MemoryMatchGame />} />


        <Route path="/diary" element={<Diary />} />
        <Route path="/news" element={<News />} />



        
        {/* <Route path="/mood-quiz" element={<MoodQuiz />} /> */}
        {/* Optional: Add this if you create a Chat component */}
        {/* <Route path="/chat" element={<Chat />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
