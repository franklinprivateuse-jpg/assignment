import { useState, useRef, useEffect, type FormEvent } from 'react';
import { useChat } from '../../hooks/useChat';
import styles from './Messaging.module.css';
import layout from '../page.module.css';

/** Messaging page — chat interface backed by the portfolio API */
const Messaging: React.FC = () => {
  const { messages, sendMessage, clearMessages, loading, error } = useChat();
  const [input, setInput] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the newest message whenever the list changes
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle form submission: send trimmed message and clear input.
  // The !loading guard prevents duplicate submits while a request is in flight.
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed && !loading) {
      sendMessage(trimmed);
      setInput('');
    }
  };

  return (
    <div className={layout.container}>
      <h1 className={layout.title}>Messaging</h1>
      <p className={layout.subtitle}>
        Send a message and get an auto-reply
      </p>
      {/* Privacy note: tells visitors their messages are saved and viewable
          by the site owner — keeps the chat transparent */}
      <p className={styles.privacyNote}>
        Note: the site owner can see your messages. Please do not share personal or sensitive information.
      </p>
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
        {/* Error banner sits between the message list and the input area so
            it is visible without covering existing messages */}
        {error && <div className={styles.errorMessage}>{error}</div>}
        <form className={styles.inputArea} onSubmit={handleSubmit}>
          {/* Disable input while sending: gives clear feedback that the
              previous message is still being processed */}
          <input
            type="text"
            className={styles.inputField}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            aria-label="Type a message"
            disabled={loading}
          />
          {/* Button label changes to show progress instead of a spinner —
              lighter than adding a spinner component */}
          <button type="submit" className={styles.sendButton} disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
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