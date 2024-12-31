import { useEffect, useState } from "react";
import { Questions } from "./data.js";
import "./quiz.css";

function Quiz() {
  const [ind, setInd] = useState(0);
  const [end, setEnd] = useState(false);
  const [count, setCount] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [heartClass, setHeartClass] = useState("heart");

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount === 1) {
          clearInterval(timer);
          setHeartClass("heart burst"); // Trigger the burst animation
          setTimeout(() => {
            handleNextQuestion();
            setHeartClass("heart"); // Reset the heart for the next question
          }, 500); // Wait for the burst animation to complete
          return 10;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Clear the timer when `ind` changes
  }, [ind]);

  const handleNextQuestion = () => {
    if (ind < Questions.length - 1) {
      setInd((prevInd) => prevInd + 1);
      setCount(10);
      setSelectedAnswer(null); // Reset selected answer for the next question
    } else {
      setEnd(true);
    }
  };

  const handleAnswerClick = (isCorrect, index) => {
    setSelectedAnswer({ isCorrect, index });
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handleRestartQuiz = () => {
    setInd(0);
    setEnd(false);
    setCount(10);
    setSelectedAnswer(null);
    setScore(0);
  };

  return (
    <div className="main_div">
      <h1>Quiz App</h1>
      <div className="progress-bar-container">
    <div
      className="progress-bar"
      style={{ width: `${(count / 10) * 100}%` }}
    ></div>
  </div>

      {!end ? (
        <div>
          <h2>Time Remaining: 00:{count < 10 ? `0${count}` : count}</h2>
          <div className="heart-container">
            <img className={heartClass} src="https://img.freepik.com/premium-photo/3d-human-heart-internal-organs-with-blood-vessels-medical-science_1007521-6613.jpg" width='100px' alt="Heart Animation" />
          </div>
          <h3>Score: {score}</h3>
          <h2>{Questions[ind].questionText}</h2>
          <div className="answers">
            {Questions[ind].answerOptions.map((item, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(item.isCorrect, index)}
                className={`answer-button ${
                  selectedAnswer
                    ? item.isCorrect
                      ? "correct"
                      : selectedAnswer.index === index && !item.isCorrect
                      ? "incorrect"
                      : ""
                    : ""
                }`}
              >
                {item.answerText}
              </button>
            ))}
          </div>

          {/* Feedback Section */}
          {selectedAnswer !== null && (
            <p
              className={`feedback ${
                selectedAnswer.isCorrect ? "correct-feedback" : "incorrect-feedback"
              }`}
            >
              {selectedAnswer.isCorrect
                ? "Correct!"
                : "Incorrect. The correct answer is highlighted."}
            </p>
          )}

          <div className="navigation-buttons">
            <button
              onClick={handleNextQuestion}
              disabled={ind === Questions.length - 1}
              className="nav-button"
            >
              Next Question
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2>Quiz Completed!</h2>
          <p>Your Score: {score}/{Questions.length}</p>
          <button onClick={handleRestartQuiz} className="restart-button">
            Restart Quiz
          </button>
        </div>
      )}
    </div>
  );
}

export default Quiz;

