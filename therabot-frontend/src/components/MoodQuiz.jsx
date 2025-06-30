import React, { useState } from 'react';
import { submitMood } from '../api/api';
import './MoodQuiz.css';



const questions = [
  {
    question: 'How would you describe your current mood?',
    options: [
      { value: 'excited', emoji: '😃', label: 'Excited' },
      { value: 'happy', emoji: '😊', label: 'Happy' },
      { value: 'neutral', emoji: '😐', label: 'Neutral' },
      { value: 'anxious', emoji: '😟', label: 'Anxious' },
      { value: 'sad', emoji: '😔', label: 'Sad' },
      { value: 'angry', emoji: '😠', label: 'Angry' }
    ],
    type: 'emoji'
  },
  {
    question: 'How was your sleep last night?',
    options: [
      { value: 'great', label: 'Great (7+ hours)' },
      { value: 'ok', label: 'Okay (5-6 hours)' },
      { value: 'poor', label: 'Poor (<5 hours)' },
      { value: 'none', label: 'Hardly slept' }
    ],
    type: 'radio'
  },
  {
    question: 'How would you rate your energy level today?',
    options: [
      { value: 'high', label: 'High energy' },
      { value: 'medium', label: 'Moderate energy' },
      { value: 'low', label: 'Low energy' },
      { value: 'drained', label: 'Completely drained' }
    ],
    type: 'radio'
  },
  {
    question: 'Have you experienced any of these today? (Select all that apply)',
    options: [
      { value: 'stress', label: 'Stress' },
      { value: 'headache', label: 'Headache' },
      { value: 'social', label: 'Social interaction' },
      { value: 'exercise', label: 'Exercise' },
      { value: 'creativity', label: 'Creative activity' }
    ],
    type: 'checkbox',
    multiSelect: true
  }
];

export default function MoodQuiz() {
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleMultiSelect = (index, value) => {
    const updated = [...answers];
    const currentValues = updated[index] ? updated[index].split(',') : [];
    
    if (currentValues.includes(value)) {
      updated[index] = currentValues.filter(v => v !== value).join(',');
    } else {
      updated[index] = [...currentValues, value].join(',');
    }
    
    setAnswers(updated);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateMood = () => {
    // More sophisticated mood calculation
    const moodMap = {
      excited: 2,
      happy: 1,
      neutral: 0,
      anxious: -1,
      sad: -2,
      angry: -2
    };

    const sleepMap = {
      great: 1,
      ok: 0,
      poor: -1,
      none: -2
    };

    const energyMap = {
      high: 1,
      medium: 0,
      low: -1,
      drained: -2
    };

    const activityWeights = {
      stress: -1,
      headache: -1,
      social: 0.5,
      exercise: 1,
      creativity: 1
    };

    let score = 0;
    
    // Mood score
    if (answers[0]) score += moodMap[answers[0]] || 0;
    
    // Sleep score
    if (answers[1]) score += sleepMap[answers[1]] || 0;
    
    // Energy score
    if (answers[2]) score += energyMap[answers[2]] || 0;
    
    // Activities score
    if (answers[3]) {
      const activities = answers[3].split(',');
      activities.forEach(activity => {
        score += activityWeights[activity] || 0;
      });
    }

    // Determine result based on score
    if (score >= 3) return { emoji: '😄', message: 'You\'re feeling amazing today! Keep it up!', color: '#4CAF50' };
    if (score >= 1) return { emoji: '🙂', message: 'You\'re doing pretty well today!', color: '#8BC34A' };
    if (score >= -1) return { emoji: '😐', message: 'You seem neutral today. Maybe try something uplifting?', color: '#FFC107' };
    if (score >= -3) return { emoji: '😕', message: 'You might be feeling a bit down. TheraBot can help!', color: '#FF9800' };
    return { emoji: '😟', message: 'You seem to be having a tough time. Consider talking to someone.', color: '#F44336' };
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const moodResult = calculateMood();
    setResult(moodResult);

    const token = localStorage.getItem('token');
    if (token) {
      try {
        await submitMood({ 
          answers, 
          moodResult,
          timestamp: new Date().toISOString() 
        }, token);
      } catch (error) {
        console.error('Error submitting mood:', error);
      }
    }
    
    setIsSubmitting(false);
  };

  const isNextDisabled = () => {
    const currentQ = questions[currentQuestion];
    if (currentQ.multiSelect) {
      return !answers[currentQuestion] || answers[currentQuestion].split(',').length === 0;
    }
    return !answers[currentQuestion];
  };

  return (
    <div className="mood-quiz-container">
      <div className="quiz-header">
        <h2>Daily Mood Check-In</h2>
        <p className="progress-indicator">Question {currentQuestion + 1} of {questions.length}</p>
      </div>
      
      {result ? (
        <div className="mood-result" style={{ backgroundColor: result.color }}>
          <div className="result-emoji">{result.emoji}</div>
          <h3>{result.message}</h3>
          <p>Your responses have been recorded.</p>
          <button 
            className="retake-button" 
            onClick={() => {
              setAnswers(Array(questions.length).fill(''));
              setCurrentQuestion(0);
              setResult(null);
            }}
          >
            Check In Again
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mood-quiz-form">
          <div className="question-block">
            <h3>{questions[currentQuestion].question}</h3>
            
            {questions[currentQuestion].type === 'emoji' ? (
              <div className="emoji-options">
                {questions[currentQuestion].options.map(option => (
                  <label 
                    key={option.value} 
                    className={`emoji-option ${answers[currentQuestion] === option.value ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name={`q${currentQuestion}`}
                      value={option.value}
                      checked={answers[currentQuestion] === option.value}
                      onChange={() => handleChange(currentQuestion, option.value)}
                      hidden
                    />
                    <span className="emoji">{option.emoji}</span>
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            ) : questions[currentQuestion].multiSelect ? (
              <div className="checkbox-options">
                {questions[currentQuestion].options.map(option => (
                  <label key={option.value} className="checkbox-option">
                    <input
                      type="checkbox"
                      name={`q${currentQuestion}`}
                      value={option.value}
                      checked={answers[currentQuestion]?.split(',').includes(option.value)}
                      onChange={() => handleMultiSelect(currentQuestion, option.value)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            ) : (
              <div className="radio-options">
                {questions[currentQuestion].options.map(option => (
                  <label key={option.value} className="radio-option">
                    <input
                      type="radio"
                      name={`q${currentQuestion}`}
                      value={option.value}
                      checked={answers[currentQuestion] === option.value}
                      onChange={() => handleChange(currentQuestion, option.value)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            )}
          </div>
          
          <div className="navigation-buttons">
            {currentQuestion > 0 && (
              <button type="button" className="nav-button prev" onClick={prevQuestion}>
                Previous
              </button>
            )}
            
            {currentQuestion < questions.length - 1 ? (
              <button 
                type="button" 
                className="nav-button next" 
                onClick={nextQuestion}
                disabled={isNextDisabled()}
              >
                Next
              </button>
            ) : (
              <button 
                type="submit" 
                className="submit-button" 
                disabled={isNextDisabled() || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'See My Mood'}
              </button>
            )}
          </div>
        </form>
      )}
      
      {!result && (
        <div className="progress-tracker">
          {questions.map((_, index) => (
            <div 
              key={index} 
              className={`progress-dot ${index === currentQuestion ? 'active' : ''} ${answers[index] ? 'answered' : ''}`}
              onClick={() => setCurrentQuestion(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}