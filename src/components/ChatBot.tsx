/* eslint-disable @typescript-eslint/naming-convention */
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import resumeContent from '../data/resume.md?raw';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const SYSTEM_PROMPT = `You are a helpful assistant embedded in Hưng Phạm's personal portfolio website. You ONLY answer questions about Hưng based on the resume content provided below.

If the user asks anything unrelated to Hưng's resume (his background, skills, experience, education, projects, or contact info), politely decline and say you can only answer questions about Hưng Phạm.

Always respond in plain text. Do not use markdown formatting — no bold (**), no italics (*), no bullet points with asterisks, no headers with #. Write naturally in sentences or simple lists using dashes if needed.

Always respond in the same language the user is writing in.

Here is Hưng's resume:

${resumeContent}`;

const ChatBot = () => {
  const { t } = useTranslation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      const inButton = buttonRef.current?.contains(e.target as Node);
      const inPanel = panelRef.current?.contains(e.target as Node);
      if (!inButton && !inPanel) setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const updatedMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: SYSTEM_PROMPT }],
            },
            contents: updatedMessages.map((m) => ({
              role: m.role === 'user' ? 'user' : 'model',
              parts: [{ text: m.content }],
            })),
          }),
        }
      );

      if (response.status === 429) {
        setMessages((prev) => [
          ...prev,
          { role: 'bot', content: t('chatbot_rate_limit') },
        ]);
        return;
      }

      const data = await response.json();
      const botReply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        t('chatbot_no_answer');
      setMessages((prev) => [...prev, { role: 'bot', content: botReply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: t('chatbot_error') },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const panel = (
    <div
      ref={panelRef}
      className={`card-paper corners fixed inset-x-3 bottom-4 z-[9999] flex h-[65vh] flex-col overflow-hidden sm:inset-auto sm:right-4 sm:top-16 sm:h-[28rem] sm:w-[21rem] ${
        themeMode === 'dark' ? 'dark' : ''
      }`}
      style={{
        color: 'var(--ink-900)',
        background: 'var(--paper-0)',
        border: '1px solid var(--rule-strong)',
        borderRadius: 2,
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <span className="corner-tl" aria-hidden="true" />
      <span className="corner-br" aria-hidden="true" />

      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          color: 'var(--paper-0)',
          background: 'var(--ink-900)',
        }}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="t-display-italic grid h-7 w-7 shrink-0 place-items-center text-lg leading-none"
            style={{ border: '1px solid currentColor' }}
          >
            Q
          </span>
          <div className="min-w-0 leading-none">
            <div className="t-display-italic truncate text-[17px] leading-5">The Quill</div>
            <div className="t-mono mt-1 truncate text-[9px] uppercase tracking-[0.16em] opacity-70">
              ASK ABOUT HUNG
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="grid h-8 w-8 shrink-0 place-items-center opacity-70 transition-opacity hover:opacity-100"
          style={{
            color: 'var(--paper-0)',
          }}
          aria-label="Close chatbot"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-3">
        {messages.length === 0 && (
          <p className="t-display-italic mx-auto mt-5 max-w-[16rem] px-4 text-center text-sm leading-6 text-ink-500">
            {t('chatbot_greeting')}
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div
                className="t-mono mb-1 text-[9px] uppercase tracking-[0.18em] text-ink-500"
              >
                {msg.role === 'user' ? 'YOU' : 'QUILL'}
              </div>
              <div
                className="whitespace-pre-wrap px-3 py-2 leading-relaxed"
                style={{
                  color: msg.role === 'user' ? 'var(--paper-0)' : 'var(--ink-900)',
                  fontFamily:
                    msg.role === 'user' ? 'var(--font-ui)' : 'var(--font-display)',
                  fontSize: msg.role === 'user' ? 13 : 15,
                  fontStyle: msg.role === 'user' ? 'normal' : 'italic',
                  background:
                    msg.role === 'user' ? 'var(--ink-900)' : 'var(--paper-1)',
                  border:
                    msg.role === 'user' ? '1px solid var(--ink-900)' : '1px solid var(--rule)',
                  borderRadius: 2,
                }}
              >
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div
              className="px-3 py-2"
              style={{
                background: 'var(--paper-1)',
                border: '1px solid var(--rule)',
                borderRadius: 2,
              }}
            >
              <div className="flex items-center gap-1" aria-label="Chatbot loading">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="h-1.5 w-1.5 animate-bounce rounded-full"
                    style={{
                      animationDelay: `${delay}ms`,
                      background: 'var(--ink-500)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div
        className="flex gap-2 p-3"
        style={{ borderTop: '1px solid var(--rule)' }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder={t('chatbot_placeholder')}
          className="input-ms min-w-0 flex-1 text-base sm:text-sm"
        />
        <button
          type="button"
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className="btn-ink grid shrink-0 place-items-center px-3 py-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Send message"
        >
          -&gt;
        </button>
      </div>
    </div>
  );

  return (
    <div ref={buttonRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="grid place-items-center"
        aria-label="Toggle chatbot"
        aria-pressed={isOpen}
        style={{
          width: 36,
          height: 36,
          color: 'var(--ink-900)',
          fontFamily: 'var(--font-display)',
          fontSize: 18,
          fontStyle: 'italic',
          background: 'var(--paper-1)',
          border: '1px solid var(--rule-strong)',
          borderRadius: 2,
          boxShadow: 'var(--shadow-press)',
          cursor: 'pointer',
        }}
      >
        Q
      </button>

      {isOpen && createPortal(panel, document.body)}
    </div>
  );
};

export default ChatBot;
