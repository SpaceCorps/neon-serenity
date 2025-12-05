import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storage';
import { BarChart2 } from 'lucide-react';

const MainScreen = () => {
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState(null); // 'emotional' | 'background' | null

    const handleLog = (type) => {
        storageService.logEvent(type);
        setFeedback(type);

        // Reset feedback animation after a short delay
        setTimeout(() => {
            setFeedback(null);
        }, 1000);
    };

    return (
        <div className="main-screen">
            <button
                className="stats-button"
                onClick={() => navigate('/stats')}
                aria-label="View Statistics"
            >
                <BarChart2 size={24} color="var(--text-color)" />
            </button>

            <div className="container">
                <h1 className="title">How are you feeling?</h1>

                <div className="buttons-container">
                    <button
                        className={`log-button emotional ${feedback === 'emotional' ? 'active' : ''}`}
                        onClick={() => handleLog('emotional')}
                    >
                        <div className="glow"></div>
                        <span className="label">Emotional</span>
                    </button>

                    <button
                        className={`log-button background ${feedback === 'background' ? 'active' : ''}`}
                        onClick={() => handleLog('background')}
                    >
                        <div className="glow"></div>
                        <span className="label">Background</span>
                    </button>
                </div>

                {feedback && (
                    <div className="feedback-message">
                        Logged {feedback} anxiety.
                    </div>
                )}
            </div>

            <style>{`
        .main-screen {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
        }

        .stats-button {
          position: absolute;
          top: 2rem;
          right: 2rem;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          padding: 0.8rem;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(5px);
        }

        .stats-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3rem;
          width: 100%;
          max-width: 600px;
        }

        .title {
          font-size: 2rem;
          font-weight: 300;
          opacity: 0.8;
          margin: 0;
          text-align: center;
        }

        .buttons-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          width: 100%;
        }

        @media (min-width: 768px) {
          .buttons-container {
            flex-direction: row;
          }
        }

        .log-button {
          flex: 1;
          height: 120px;
          border: none;
          border-radius: 20px;
          font-size: 1.5rem;
          font-weight: 600;
          color: white;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 1);
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .log-button:active {
          transform: scale(0.95);
        }

        .log-button.emotional {
          border-color: rgba(255, 0, 85, 0.3);
          box-shadow: 0 4px 30px rgba(255, 0, 85, 0.1);
        }

        .log-button.emotional:hover {
          box-shadow: 0 0 20px rgba(255, 0, 85, 0.4);
          border-color: var(--accent-hot);
        }

        .log-button.emotional .glow {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, rgba(255, 0, 85, 0.2) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .log-button.emotional:hover .glow {
          opacity: 1;
        }

        .log-button.background {
          border-color: rgba(0, 210, 255, 0.3);
          box-shadow: 0 4px 30px rgba(0, 210, 255, 0.1);
        }

        .log-button.background:hover {
          box-shadow: 0 0 20px rgba(0, 210, 255, 0.4);
          border-color: var(--accent-cool);
        }

        .log-button.background .glow {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, rgba(0, 210, 255, 0.2) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .log-button.background:hover .glow {
          opacity: 1;
        }

        .feedback-message {
          position: absolute;
          bottom: 2rem;
          text-align: center;
          font-size: 0.9rem;
          opacity: 0.7;
          animation: fadeUp 0.3s ease-out;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 0.7; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default MainScreen;
