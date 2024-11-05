import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function Dashboard() {
  const [username, setUsername] = useState(""); // Current user's username
  const [recipient, setRecipient] = useState(""); // Recipient's username
  const [message, setMessage] = useState(""); // Message to send
  const [messages, setMessages] = useState([]); // Store incoming messages

  // On component mount, prompt user for a username
  useEffect(() => {
    const username = localStorage.getItem("username") || "";
    if (username) {
      setUsername(username);
      socket.emit("login", username);
    }
    // Send the username to the server
  }, []);

  // Listen for messages from the server
  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { from: data.from, message: data.message, to: data.to },
      ]);
    });

    // Cleanup the socket listener when the component unmounts
    return () => {
      socket.off("message");
    };
  }, []);

  // Handle sending a message
  const handleSendMessage = () => {
    if (recipient && message) {
      socket.emit("sendMessage", { to: recipient, message });

      const username = localStorage.getItem("username") || "";

      setMessages((prevMessages) => [
        ...prevMessages,
        { from: username, message: message, to: recipient },
      ]);

      setMessage(""); // Clear message input after sending
    }
  };

  return (
    <div>
      <h1>Chat Dashboard</h1>
      <div>
        <h2>Logged in as: {username}</h2>
      </div>

      <div>
        <input
          type="text"
          placeholder="Recipient Username"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>

      <div>
        <h3>Messages</h3>
        {messages.map((msg, index) => {
          return (
            <div key={index}>
              <strong>{msg.from}:</strong> {msg.message}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
