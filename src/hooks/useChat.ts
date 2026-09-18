import { useState, useCallback } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const AUTO_REPLIES: string[] = [
  'Thanks for your message!',
  'I will get back to you soon.',
  'That is a great question!',
  'Let me think about that.',
  'Good to hear from you!',
];

let nextId = 1;

function generateId(): number {
  return nextId++;
}

function pickRandomReply(): string {
  return AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
}

export function useChat(): {
  messages: Message[];
  sendMessage: (text: string) => void;
} {
  const [messages, setMessages] = useState<Message[]>([]);

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