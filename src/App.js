import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faPlay, faPause, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime === 0) {
            audioRef.current.play();
            if (isSession) {
              setIsSession(false);
              return breakLength * 60;
            } else {
              setIsSession(true);
              return sessionLength * 60;
            }
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, isSession, breakLength, sessionLength]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    clearInterval(timerRef.current);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setIsRunning(false);
    setIsSession(true);
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const adjustLength = (type, adjustment) => {
    if (!isRunning) {
      if (type === 'break') {
        const newBreakLength = breakLength + adjustment;
        if (newBreakLength > 0 && newBreakLength <= 60) {
          setBreakLength(newBreakLength);
        }
      } else {
        const newSessionLength = sessionLength + adjustment;
        if (newSessionLength > 0 && newSessionLength <= 60) {
          setSessionLength(newSessionLength);
          if (!isRunning) setTimeLeft(newSessionLength * 60);
        }
      }
    }
  };

  return (
    <div className="pomodoro-app">
      <Container>
        <Card className="text-center shadow-lg">
          <Card.Header className="bg-primary text-white">
            <h1>Pomodoro Clock</h1>
          </Card.Header>
          <Card.Body>
            <Row className="mb-4">
              <Col>
                <h3 id="break-label">Break Length</h3>
                <div className="d-flex justify-content-center align-items-center">
                  <Button 
                    id="break-decrement" 
                    variant="outline-danger" 
                    onClick={() => adjustLength('break', -1)}
                  >
                    <FontAwesomeIcon icon={faArrowDown} />
                  </Button>
                  <span id="break-length" className="mx-3">{breakLength}</span>
                  <Button 
                    id="break-increment" 
                    variant="outline-success" 
                    onClick={() => adjustLength('break', 1)}
                  >
                    <FontAwesomeIcon icon={faArrowUp} />
                  </Button>
                </div>
              </Col>
              <Col>
                <h3 id="session-label">Session Length</h3>
                <div className="d-flex justify-content-center align-items-center">
                  <Button 
                    id="session-decrement" 
                    variant="outline-danger" 
                    onClick={() => adjustLength('session', -1)}
                  >
                    <FontAwesomeIcon icon={faArrowDown} />
                  </Button>
                  <span id="session-length" className="mx-3">{sessionLength}</span>
                  <Button 
                    id="session-increment" 
                    variant="outline-success" 
                    onClick={() => adjustLength('session', 1)}
                  >
                    <FontAwesomeIcon icon={faArrowUp} />
                  </Button>
                </div>
              </Col>
            </Row>

            <Card className="timer-display mb-4">
              <Card.Body>
                <h2 id="timer-label">{isSession ? 'Session' : 'Break'}</h2>
                <div id="time-left" className="display-4">
                  {formatTime(timeLeft)}
                </div>
              </Card.Body>
            </Card>

            <div className="timer-controls">
              <Button 
                id="start_stop" 
                variant="primary" 
                className="mx-2"
                onClick={handleStartStop}
              >
                <FontAwesomeIcon icon={isRunning ? faPause : faPlay} />
              </Button>
              <Button 
                id="reset" 
                variant="danger" 
                onClick={handleReset}
              >
                <FontAwesomeIcon icon={faRotateRight} />
              </Button>
            </div>

            <audio 
              id="beep" 
              ref={audioRef} 
              src="/path/to/beep-sound.mp3"
            />
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default App;