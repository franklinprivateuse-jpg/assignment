import { useState, useRef, useEffect, type FormEvent } from 'react';
import { useChat } from '../../hooks/useChat';
import styles from './Messaging.module.css';
import layout from '../page.module.css';

/** Messaging page — chat interface with keyword-based auto-reply and localStorage persistence */
const Messaging: React.FC = () => {
  const { messages, sendMessage, clearMessages } = useChat();
  const [input, setInput] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the newest message whenever the list changes
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
            <div ref={messageEndRef} />
          </div>
        )}
        <form className={styles.inputArea} onSubmit={handleSubmit}>
          <input
            type="text"
            className={styles.inputField}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            aria-label="Type a message"
          />
          <button type="submit" className={styles.sendButton}>
            Send
          </button>
          {messages.length > 0 && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={clearMessages}
              aria-label="Clear all messages"
            >
              Clear
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Messaging;