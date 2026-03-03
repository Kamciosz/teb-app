import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../../store/chatStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Send, Paperclip } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';

interface MessageListProps {
  messages: any[];
}

const MessageList = ({ messages }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.sender_id === 'me' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] rounded-lg p-3 ${
              message.sender_id === 'me'
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-white border border-gray-200 rounded-bl-none'
            }`}
          >
            {message.sender_id !== 'me' && (
              <p className="text-xs font-semibold mb-1 text-gray-500">
                {message.sender?.full_name || 'Użytkownik'}
              </p>
            )}
            <p className="text-sm">{message.content}</p>
            {message.image_url && (
              <img src={message.image_url} alt="Uploaded" className="mt-2 rounded-lg max-h-48" />
            )}
            <p className={`text-[10px] mt-1 ${message.sender_id === 'me' ? 'text-blue-200' : 'text-gray-400'}`}>
              {formatDistanceToNow(new Date(message.created_at), { addSuffix: true, locale: pl })}
            </p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export const ChatWindow = () => {
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { messages, sendMessage } = useChatStore();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !file) return;

    await sendMessage(input, file || undefined);
    setInput('');
    setFile(null);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Rozmowa</h2>
        <span className="text-xs text-green-500 font-medium">Online</span>
      </div>

      <MessageList messages={messages} />

      <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-200 flex items-center space-x-2">
        <Button variant="ghost" size="sm" type="button" className="text-gray-500">
          <Paperclip size={20} />
          <input
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </Button>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Napisz wiadomość..."
          className="flex-1"
        />
        <Button type="submit" size="sm" disabled={!input.trim() && !file}>
          <Send size={20} />
        </Button>
      </form>
    </div>
  );
};
