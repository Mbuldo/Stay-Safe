import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Bot, RefreshCcw, SendHorizonal, UserRound } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api from '../services/api';

type ChatRole = 'user' | 'assistant';

interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface AIStatusData {
  configured: boolean;
  provider: string;
  model: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Hello. I can help with sexual and reproductive health questions, prevention planning, and next-step guidance.',
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [aiStatus, setAiStatus] = useState<AIStatusData | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const data = (await api.getAIStatus()) as AIStatusData;
        setAiStatus(data);
      } catch (_error) {
        setAiStatus(null);
      }
    };

    loadStatus();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, sending]);

  const canSend = useMemo(() => input.trim().length > 0 && !sending, [input, sending]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const nextMessages = [...messages, { role: 'user' as const, content: text }];
    setMessages(nextMessages);
    setInput('');
    setError('');
    setSending(true);

    try {
      const history = nextMessages
        .filter(message => message.role === 'user' || message.role === 'assistant')
        .map(message => ({ role: message.role, content: message.content }));
      const response = (await api.chatWithAI(text, history)) as { message: string };
      setMessages(current => [
        ...current,
        { role: 'assistant', content: response.message || 'No response received.' },
      ]);
    } catch (err: any) {
      setError(err?.message || 'Failed to reach the AI assistant.');
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await sendMessage();
  };

  const clearConversation = () => {
    setMessages([
      {
        role: 'assistant',
        content:
          'Conversation cleared. Ask a new SRH question when you are ready.',
      },
    ]);
    setError('');
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
        <button
          type="button"
          onClick={clearConversation}
          className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <RefreshCcw className="h-4 w-4" />
          Clear chat
        </button>
      </div>

      <section className="rounded-[22px] bg-[#1f2d63] px-8 py-8 text-white">
        <p className="text-xs tracking-[0.14em] text-slate-300 uppercase">AI Support</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">AI Assistant</h1>
        <p className="mt-2 text-sm text-slate-200">
          Ask for practical guidance, prevention tips, and next steps.
        </p>
        <p className="mt-4 text-xs text-slate-300">
          {aiStatus?.configured
            ? `Connected to ${aiStatus.provider} (${aiStatus.model}).`
            : 'Live AI is currently unavailable. Fallback guidance may be used.'}
        </p>
      </section>

      <section className="rounded-[22px] border border-slate-200 bg-white shadow-sm">
        <div className="max-h-[55vh] space-y-4 overflow-y-auto p-6 md:p-8">
          {messages.map((message, index) => (
            <motion.article
              key={`${message.role}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' ? (
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f5f0ff] text-[#1f2d63]">
                  <Bot className="h-4 w-4" />
                </span>
              ) : null}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  message.role === 'assistant'
                    ? 'border border-slate-200 bg-slate-50 text-slate-700'
                    : 'bg-[#1f2d63] text-white'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div className="prose prose-sm max-w-none prose-headings:font-display prose-headings:text-[#111a3d] prose-p:text-slate-700 prose-li:text-slate-700 prose-strong:text-[#111a3d] prose-a:text-[#1f2d63]">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  message.content
                )}
              </div>

              {message.role === 'user' ? (
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#e84874] text-white">
                  <UserRound className="h-4 w-4" />
                </span>
              ) : null}
            </motion.article>
          ))}

          {sending ? (
            <p className="text-sm text-slate-500">Assistant is thinking...</p>
          ) : null}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="border-t border-slate-200 bg-slate-50 p-4 md:p-5"
        >
          {error ? (
            <div className="mb-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
          <div className="flex gap-3">
            <input
              value={input}
              onChange={event => setInput(event.target.value)}
              placeholder="Ask a question..."
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#1f2d63]/50 focus:ring-2 focus:ring-[#1f2d63]/15"
            />
            <button
              type="submit"
              disabled={!canSend}
              className="inline-flex items-center gap-2 rounded-md bg-[#e84874] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#d73a65] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <SendHorizonal className="h-4 w-4" />
              Send
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
