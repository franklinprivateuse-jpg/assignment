import { useState, useCallback } from 'react';

/** A single chat message from either the user or the bot */
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

/** Predefined auto-reply messages picked at random */
const AUTO_REPLIES: string[] = [
  'Thanks for your message!',
  'I will get back to you soon.',
  'That is a great question!',
  'Let me think about that.',
  'Good to hear from you!',
];

// Auto-incrementing ID generator for messages
let nextId = 1;

function generateId(): number {
  return nextId++;
}

/** Pick a random reply from the AUTO_REPLIES pool */
function pickRandomReply(): string {
  return AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
}

/**
 * Custom hook for a simple chat interface.
 * Appends a user message and an auto-reply on each send.
 */
export function useChat(): {
  messages: Message[];
  sendMessage: (text: string) => void;
} {
  const [messages, setMessages] = useState<Message[]>([]);

  // Send a user message and immediately append a bot auto-reply
  const sendMessage = useCallback((text: string) => {
    const userMsg: Message = {
      id: generateId(),
      text,
      sender: 'user',
    };

    const botMsg: Message = {
      id: generateId(),
      text: pickRandomReply(),
      sender: 'bot',
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
  }, []);

  return { messages, sendMessage };
}