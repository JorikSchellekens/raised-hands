import React, { useState, useEffect } from "react";
import "./App.css";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:3001";

function App() {
  const [raisedHands, setRaisedHands] = useState([]);
  const [name, setName] = useState("");
  const socketRef = React.useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(ENDPOINT);

    socketRef.current.on("raisedHands", (data) => {
      setRaisedHands(data);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const raiseHand = () => {
    const timestamp = new Date().toISOString();
    socketRef.current.emit("raiseHand", { name, timestamp });
  };

  const resolveHand = (index) => {
    socketRef.current.emit("resolveHand", index);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="App">
      <h1>Raised Hands Queue</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
      />
      <button onClick={raiseHand}>Raise Hand</button>
      <ul>
        {raisedHands.map((hand, index) => (
          <li key={index}>
            {hand.name} - {formatTimestamp(hand.timestamp)}
            <button onClick={() => resolveHand(index)}>Resolve</button>
          </li>
        ))}
      </ul>
      <div className="banner">Made for Nethermind MANAGERS</div>
    </div>
  );
}

export default App;

