// components/Chatbot.tsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, X, Minimize2, Maximize2, Send, Bot, User, ChevronUp, ChevronDown } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const FAQ_QUESTIONS = [
  "What services do you offer?",
  "How much does homestay registration cost?",
  "What documents are required for GST registration?",
  "How long does ISO certification take?",
  "Can you help with FSSAI license?",
  "What is FoSTaC training?",
  "Do you provide service all over India?",
  "What are your business hours?"
];

const BOT_RESPONSES: Record<string, string> = {
  "What services do you offer?": "We offer comprehensive business solutions including Homestay Registration, Trade Licence, FoSTaC Training, GST Registration, ISO Certifications, Pollution Certificates, Factory License, Fire Safety NOC, Bar License, and FSSAI License.",
  "How much does homestay registration cost?": "Homestay registration costs vary based on location and requirements. Please contact our support team for a customized quote specific to your needs.",
  "What documents are required for GST registration?": "For GST registration, you typically need: PAN card, Aadhaar card, proof of business registration, bank account details, address proof, and digital signature. Contact us for detailed guidance.",
  "How long does ISO certification take?": "ISO certification typically takes 15-30 days depending on the organization's readiness and the specific ISO standard. We provide end-to-end assistance throughout the process.",
  "Can you help with FSSAI license?": "Yes! We specialize in FSSAI license registration for food businesses. We handle documentation, application submission, and follow-ups for all FSSAI categories.",
  "What is FoSTaC training?": "FoSTaC (Food Safety Training and Certification) is mandatory training for food business operators in India. We provide FoSTaC training and certification as per FSSAI guidelines.",
  "Do you provide service all over India?": "Yes! We provide services across India including North Bengal, North East, Eastern India, and Western Bengal. We also offer online services nationwide.",
  "What are your business hours?": "Our business hours are Monday-Friday: 9 AM - 6 PM, Saturday: 10 AM - 4 PM. WhatsApp support is available 24/7."
};

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! 👋 I am Geeemadhura assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>(FAQ_QUESTIONS);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const phoneNumbers = [
    '+91 96090 30792',
    '+91 96090 30832',
    '+91 96090 30833'
  ];

  const whatsappNumber = '+919609030792';
  const whatsappMessage = encodeURIComponent('Hello! I need assistance with your services.');

  // Calculate dynamic height based on screen size
  const getChatHeight = () => {
    if (typeof window === 'undefined') return 500;
    
    const screenHeight = window.innerHeight;
    if (screenHeight < 600) return 350;
    if (screenHeight < 768) return 400;
    if (screenHeight < 1024) return 450;
    return 500;
  };

  const [chatHeight, setChatHeight] = useState(getChatHeight());

  // Update height on resize
  useEffect(() => {
    const handleResize = () => {
      setChatHeight(getChatHeight());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [messages]);

  // Auto-scroll when new message is added
  useEffect(() => {
    if (chatContainerRef.current && !isMinimized) {
      const container = chatContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isMinimized]);

  // Filter suggestions based on input
  useEffect(() => {
    if (inputText.trim()) {
      const filtered = FAQ_QUESTIONS.filter(q =>
        q.toLowerCase().includes(inputText.toLowerCase())
      );
      setSuggestedQuestions(filtered.slice(0, 4));
    } else {
      setSuggestedQuestions(FAQ_QUESTIONS.slice(0, 4));
    }
  }, [inputText]);

  const handleSendMessage = (text?: string) => {
    const messageToSend = text || inputText.trim();
    if (!messageToSend) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageToSend,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Clear input if using text input
    if (!text) setInputText('');

    // Bot response with delay
    setTimeout(() => {
      let botResponse = "Thank you for your question! For detailed information, please contact our support team directly.";
      
      // Check for matching FAQ
      for (const [question, answer] of Object.entries(BOT_RESPONSES)) {
        if (messageToSend.toLowerCase().includes(question.toLowerCase().slice(0, 20))) {
          botResponse = answer;
          break;
        }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleCall = (number: string) => {
    window.location.href = `tel:${number.replace(/\s/g, '')}`;
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* WhatsApp Button */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleWhatsApp}
          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
          style={{
            backgroundColor: '#25D366',
            boxShadow: '0 4px 20px rgba(37, 211, 102, 0.3)'
          }}
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle size={28} className="text-white" />
        </motion.button>

        {/* Call Button */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleCall(phoneNumbers[0])}
          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
          style={{
            backgroundColor: '#00283A',
            boxShadow: '0 4px 20px rgba(0, 40, 58, 0.3)'
          }}
          aria-label="Call Support"
        >
          <Phone size={28} className="text-[#F2C445]" />
        </motion.button>

        {/* Chatbot Toggle Button */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center relative"
          style={{
            backgroundColor: '#F2C445',
            boxShadow: '0 4px 20px rgba(242, 196, 69, 0.3)'
          }}
          aria-label="Open chatbot"
        >
          <Bot size={28} className="text-[#00283A]" />
          {/* Notification dot */}
          {!isOpen && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
            />
          )}
        </motion.button>
      </div>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: 1,
              height: isMinimized ? '60px' : `${chatHeight}px`
            }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className={`fixed bottom-24 right-6 z-50 ${
              isMinimized ? 'w-80' : 'w-80 md:w-96'
            } rounded-2xl overflow-hidden shadow-2xl border border-gray-200 flex flex-col`}
            style={{
              backgroundColor: '#00283A',
              maxHeight: '80vh'
            }}
          >
            {/* Chat Header */}
            <div className="flex-shrink-0 p-4 flex items-center justify-between border-b border-gray-700" style={{backgroundColor: '#00283A'}}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F2C445] flex items-center justify-center">
                  <Bot size={20} className="text-[#00283A]" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Geeemadhura Assistant</h3>
                  <p className="text-xs text-gray-300">Typically replies instantly</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label={isMinimized ? "Maximize" : "Minimize"}
                >
                  {isMinimized ? (
                    <Maximize2 size={18} className="text-white" />
                  ) : (
                    <Minimize2 size={18} className="text-white" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X size={18} className="text-white" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Chat Messages Container with scroll */}
                <div 
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
                  style={{ maxHeight: 'calc(100% - 200px)' }}
                >
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, x: message.sender === 'user' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          message.sender === 'user'
                            ? 'rounded-br-none'
                            : 'rounded-bl-none'
                        }`}
                        style={{
                          backgroundColor: message.sender === 'user' ? '#F2C445' : '#1a3a4d',
                          color: message.sender === 'user' ? '#00283A' : 'white'
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {message.sender === 'bot' ? (
                            <Bot size={14} className="text-[#F2C445]" />
                          ) : (
                            <User size={14} />
                          )}
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Scroll to bottom button */}
                {chatContainerRef.current && 
                 chatContainerRef.current.scrollHeight > chatContainerRef.current.clientHeight && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={scrollToBottom}
                    className="absolute right-4 bottom-36 w-8 h-8 rounded-full bg-[#F2C445] flex items-center justify-center shadow-lg"
                    aria-label="Scroll to bottom"
                  >
                    <ChevronDown size={16} className="text-[#00283A]" />
                  </motion.button>
                )}

                {/* Suggested Questions */}
                <div className="flex-shrink-0 p-4 border-t border-gray-700 bg-[#00283A]">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Quick questions:</h4>
                  <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                    {suggestedQuestions.map((question, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleQuickQuestion(question)}
                        className="px-3 py-1.5 text-xs rounded-full transition-colors whitespace-nowrap flex-shrink-0"
                        style={{
                          backgroundColor: '#F2C445',
                          color: '#00283A'
                        }}
                      >
                        {question.length > 30 ? `${question.slice(0, 30)}...` : question}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Input Area */}
                <div className="flex-shrink-0 p-4 border-t border-gray-700 bg-[#00283A]">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your question..."
                      className="flex-1 px-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F2C445]"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSendMessage()}
                      disabled={!inputText.trim()}
                      className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-50"
                      style={{
                        backgroundColor: '#F2C445'
                      }}
                      aria-label="Send message"
                    >
                      <Send size={18} className="text-[#00283A]" />
                    </motion.button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Or contact directly: {phoneNumbers[0]}
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};