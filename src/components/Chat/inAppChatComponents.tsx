import { useState } from 'react';
import { Send, CheckCheck,  LucideArrowLeft, User } from 'lucide-react';
import { useVerifyAuth } from '../Auth/AuthContext';
import type { UserTypes } from '../../interface/interfaces';
import { parseTime, parseZonedDateTime } from '../hooks/ParseDate';

type AccountType = "VOLUNTEER"|"ORGANIZATION"

export interface Message {
  msgId?: string;
  projectId?: number;
  sentBy?: string;
  username?: string;
  sentAt?: string;
  content?: string;
  role?: AccountType
  type?: "chat_message"|"unread_update"
}

const Avatar = ({ className = "", userId, role }: { className?: string; seed?: string ; userId?:string; role?:AccountType; }) => {

  const [imageError, setImageError] = useState(false)

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const profileUrl = `${apiBaseUrl}/${role?.toLowerCase()}/profile/image?userId=${userId}`

  if(imageError){
     return (
      <div
        className={`w-9 h-9 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center flex-shrink-0 ring-2 ring-white shadow-sm ${className}`}
      >
        <User className="text-slate-300 w-4 h-4" />
      </div>
    );
  }

  return ( <img
      src={profileUrl}
      alt="Profile"
      onError={() => setImageError(true)}
      className={`w-9 h-9 rounded-2xl object-cover flex-shrink-0 ring-2 ring-white shadow-sm ${className}`}
    />)
};

export const ThreadHeader = ({
  title,
  onClose,
}: {
  newMessageCount: number;
  title: string;
  onClose: () => void;
}) => (
  <header className="flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-100">
    <button
      onClick={onClose}
      className="group flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-900 text-slate-500 hover:text-white transition-all duration-200 active:scale-95"
    >
      <LucideArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
    </button>

    <div className="flex-1 min-w-0">
      <h2 className="text-sm font-semibold text-slate-900 truncate tracking-tight">{title}</h2>
    </div>

    <div className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-100" title="Active" />
  </header>
);

export const MessageBubble = ({ message }: { message: Message }) => {
  const verifyAuth = useVerifyAuth();
  const isOwn = message.sentBy === verifyAuth?.currentUser?.userId;
  const {role, sentBy} = message
  if (isOwn) {
    return (
      <div className="flex justify-end gap-2.5 mb-5 items-end">
        <div className="flex flex-col items-end max-w-[72%]">
          <span className="text-[10px] text-slate-400 mb-1.5 mr-1 tracking-wide uppercase">
            {parseTime(message.sentAt)}, {parseZonedDateTime(message.sentAt)}
          </span>
          <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl rounded-br-sm shadow-md">
            <p className="text-sm leading-relaxed">{message.content}</p>
            <div className="flex justify-end mt-1.5">
              <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
        </div>
      <Avatar className="mb-0.5" role={role} userId={sentBy} />
      </div>
    );
  }

  return (
    <div className="flex justify-start gap-2.5 mb-5 items-end">
      <Avatar seed={message.username} className="mb-0.5" role={role} userId={sentBy}/>
      <div className="flex flex-col max-w-[72%]">
        <div className="flex items-baseline gap-2 mb-1.5 ml-1">
          <span className="text-xs font-semibold text-slate-700 tracking-tight">
            {message.username}
          </span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wide">
           {parseTime(message.sentAt)}, {parseZonedDateTime(message.sentAt)}
          </span>
        </div>
        <div className="bg-slate-50 border border-slate-100 text-slate-800 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
      </div>
    </div>
  );
};

export const InputArea: React.FC<{ onSend?: (text: string) => void; variant: UserTypes }> = ({
  onSend,
  variant,
}) => {
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSend = async () => {
    if (!text) return;
   try{
    if(onSend)
      onSend(text);
     setText('');
   }catch{
    
   }
    
  };

  return (
    <div className="px-4 py-3 bg-white border-t border-slate-100">
      <div
        className={`flex gap-3 items-end bg-slate-50 rounded-2xl px-4 py-3 transition-all duration-200 ${
          focused ? 'ring-2 ring-slate-900/10 bg-white shadow-sm' : ''
        }`}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={async (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              await handleSend();
            }
          }}
          placeholder="Write a message…"
          rows={2}
          className="resize-none flex-1 bg-transparent focus:outline-none text-sm text-slate-800 placeholder:text-slate-400 leading-relaxed"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 active:scale-95 ${
            text.trim()
              ? variant === 'organization'
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm hover:shadow-md'
                : 'bg-slate-900 hover:bg-slate-700 text-white shadow-sm hover:shadow-md'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      <p className="text-[10px] text-slate-400 mt-1.5 ml-1">
        Enter to send · Shift + Enter for new line
      </p>
    </div>
  );
};