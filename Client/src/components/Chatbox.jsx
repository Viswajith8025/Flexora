import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageSquare, User, Check, CheckCheck, MoreVertical, Phone, Video, Smile, Paperclip } from "lucide-react";

const ChatBox = ({ jobId, withUserId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (jobId && withUserId) {
      const fetchMessages = async () => {
        setIsLoading(true);
        try {
          const { data } = await api.getMessages(jobId, withUserId);
          setMessages(data);
        } catch (error) {
          console.error("Chat fetch error:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMessages();
    }
  }, [jobId, withUserId]);

  const handleSend = async () => {
    if (!text.trim()) return;
    const messageText = text.trim();
    setText("");
    inputRef.current?.focus();

    try {
      const { data } = await api.sendMessage({
        jobId,
        receiverId: withUserId,
        text: messageText,
      });
      setMessages((prev) => [...prev, data.message]);
    } catch (error) {
      console.error("Send error:", error);
      setText(messageText);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const d = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString([], { day: "numeric", month: "short" });
  };

  const groupedMessages = messages.reduce((groups, msg) => {
    const date = formatDate(msg.timestamp || msg.createdAt);
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-[32px] overflow-hidden border border-slate-900 shadow-2xl relative">
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent scale-[2]" />
      </div>

      {/* Header */}
      <div className="px-6 py-4 bg-slate-900/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
             <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
               <User size={20} />
             </div>
             <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-slate-900 rounded-full" />
          </div>
          <div>
            <p className="flex-label text-white !text-sm">{withUserId ? "Direct Message" : "Support"}</p>
            <p className="flex-meta text-green-500 lowercase">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <button className="text-slate-600 hover:text-white transition-colors hidden sm:block">
              <Video size={18} />
           </button>
           <button className="text-slate-600 hover:text-white transition-colors hidden sm:block">
              <Phone size={18} />
           </button>
           <button className="text-slate-600 hover:text-white transition-colors">
              <MoreVertical size={18} />
           </button>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-8 space-y-6 z-10 scroll-smooth custom-scrollbar"
      >
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-slate-900 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-10">
            <div className="w-20 h-20 rounded-[32px] bg-slate-900/50 border border-slate-800 flex items-center justify-center mb-8">
              <MessageSquare size={32} className="text-slate-700" />
            </div>
            <h3 className="flex-title-sm !text-lg mb-2 uppercase">No messages yet</h3>
            <p className="flex-meta italic lowercase opacity-60">Send a message to get started.</p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date} className="space-y-6">
              {/* Date divider */}
              <div className="flex items-center gap-6">
                <div className="flex-1 h-px bg-slate-900" />
                <span className="flex-meta uppercase !text-[9px] px-3 py-1 bg-slate-900/50 rounded-full border border-slate-800 tracking-widest">{date}</span>
                <div className="flex-1 h-px bg-slate-900" />
              </div>

              <AnimatePresence initial={false}>
                {msgs.map((msg, i) => {
                  const isMe = msg.sender?.toString() === currentUser?.id;
                  const prevMsg = msgs[i - 1];
                  const nextMsg = msgs[i + 1];
                  const isFirst = !prevMsg || prevMsg.sender?.toString() !== msg.sender?.toString();
                  const isLast = !nextMsg || nextMsg.sender?.toString() !== msg.sender?.toString();

                  return (
                    <motion.div
                      key={msg._id || i}
                      initial={{ opacity: 0, x: isMe ? 8 : -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className={`flex items-end gap-3 ${isMe ? "justify-end" : "justify-start"} ${isLast ? "mb-6" : "mb-1"}`}
                    >
                      <div className={`max-w-[85%] sm:max-w-[70%] group`}>
                        <div
                          className={`relative px-5 py-3.5 flex-label !text-[13px] leading-relaxed transition-all shadow-lg ${
                            isMe
                              ? `bg-blue-600 text-white ${isFirst ? "rounded-t-3xl" : "rounded-t-lg"} ${isLast ? "rounded-bl-3xl rounded-br-lg" : "rounded-b-lg"}`
                              : `bg-slate-900 text-slate-100 border border-white/5 ${isFirst ? "rounded-t-3xl" : "rounded-t-lg"} ${isLast ? "rounded-br-3xl rounded-bl-lg" : "rounded-b-lg"}`
                          }`}
                        >
                          {msg.text}
                          
                          <div className={`mt-2 flex items-center gap-2 ${isMe ? "justify-end" : "justify-start"} opacity-40 group-hover:opacity-100 transition-opacity`}>
                             <span className="text-[9px] font-black uppercase tracking-tighter">
                               {formatTime(msg.timestamp || msg.createdAt)}
                             </span>
                             {isMe && <CheckCheck size={12} className="text-white" />}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="px-6 py-5 bg-slate-900/80 backdrop-blur-md border-t border-white/5 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button className="text-slate-600 hover:text-white transition-colors shrink-0">
             <Paperclip size={20} />
          </button>
          
          <div className="flex-1 relative group">
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Message..."
              className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-5 pr-12 py-4 flex-label text-white placeholder-slate-700 focus:outline-none focus:border-blue-600 transition-all font-medium shadow-inner"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 hover:text-blue-500 transition-colors">
               <Smile size={20} />
            </button>
          </div>

          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
              text.trim()
                ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20 active:scale-95"
                : "bg-slate-950 text-slate-800 border border-white/5 cursor-not-allowed"
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
