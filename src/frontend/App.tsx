import { useState } from "react";
import "./App.css";

function App() {
  const [showDictionary, setShowDictionary] = useState(false);

  const mockDictionary = ["teh → the", "recieve → receive", "adn → and"];

  return (
    <div className="popup-container">
      <h1 className="popup-title">AI Auto-Correct Tool</h1>

      <p className="popup-description">
        Automatically detects spelling mistakes and suggests corrections using
        an AI-powered dictionary.
      </p>

      <button
        className="dictionary-btn"
        onClick={() => setShowDictionary(!showDictionary)}
      >
        {showDictionary ? "Hide Dictionary" : "View Dictionary"}
      </button>

      {showDictionary && (
        <div className="dictionary-panel">
          <h3 className="dictionary-header">Added Words</h3>

          <div className="dictionary-scroll">
            {mockDictionary.length === 0 ? (
              <p className="empty-msg">No words added yet.</p>
            ) : (
              <ul className="dictionary-list">
                {mockDictionary.map((entry, idx) => (
                  <li key={idx} className="dictionary-item">
                    {entry}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
