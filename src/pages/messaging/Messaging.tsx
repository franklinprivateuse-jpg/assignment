import { useState, type FormEvent } from 'react';
import { useChat } from '../../hooks/useChat';
import styles from './Messaging.module.css';
import layout from '../page.module.css';

/** Messaging page — simple chat interface with auto-reply bot */
const Messaging: React.FC = () => {
  const { messages, sendMessage } = useChat();
  const [input, setInput] = useState('');

  // Handle form submission: send trimmed message and clear input
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed) {
      sendMessage(trimmed);
      setInput('');
    }
  };

  return (
    <div className={layout.container}>
      <h1 className={layout.title}>Messaging</h1>
      <p className={layout.subtitle}>Send a message and get an auto-reply</p>
      <div className={styles.chatContainer}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>No messages yet. Say hello!</div>
        ) : (
          <div className={styles.messageList}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={msg.sender === 'user' ? styles.messageUser : styles.messageBot}
              >
                {msg.text}
              </div>
            ))}
          </div>
        )}
        <form className={styles.inputArea} onSubmit={handleSubmit}>
          <input
            type="text"
            className={styles.inputField}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit" className={styles.sendButton}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Messaging;