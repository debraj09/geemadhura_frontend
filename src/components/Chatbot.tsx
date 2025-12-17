// components/ConversationalLeadForm.tsx (Fixed version)
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, X, Minimize2, Maximize2, Bot, User, ChevronDown, Calendar, Building, MapPin, User as UserIcon, Briefcase, Check, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ConversationStep {
  id: string;
  question: string;
  type: 'welcome' | 'choice' | 'input' | 'confirmation';
  options?: string[];
  field?: keyof LeadData;
  icon?: React.ReactNode;
}

interface LeadData {
  name: string;
  businessType: string;
  phone: string;
  serviceNeeded: string;
  location: string;
  email?: string;
}

export const ConversationalLeadForm = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [leadData, setLeadData] = useState<LeadData>({
    name: '',
    businessType: '',
    phone: '',
    serviceNeeded: '',
    location: '',
    email: ''
  });
  const [conversation, setConversation] = useState<Array<{
    id: string;
    text: string;
    sender: 'bot' | 'user';
    timestamp: Date;
    isOption?: boolean;
    isAction?: boolean;
  }>>([]);
  const [isFormComplete, setIsFormComplete] = useState(false);
  
  const conversationContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [chatHeight, setChatHeight] = useState(500);
  
  // Operating hours: Mon-Sat, 9 AM - 7 PM
  const operatingHours = {
    days: [1, 2, 3, 4, 5, 6], // Monday to Saturday (0=Sunday, 1=Monday, ...)
    startHour: 9,
    endHour: 19,
    timezone: 'Asia/Kolkata'
  };
  
  const [isWithinOperatingHours, setIsWithinOperatingHours] = useState(true);
  
  const conversationSteps: ConversationStep[] = [
    {
      id: 'welcome',
      question: "Hi! 👋 Welcome to Geemadhura Innovations. How can we help you today?",
      type: 'welcome'
    },
    {
      id: 'service',
      question: "Which service are you interested in?",
      type: 'choice',
      options: ['FSSAI License', 'Fire Safety NOC', 'Factory License', 'Homestay Registration', 'GST Registration', 'ISO Certification', 'Other'],
      field: 'serviceNeeded',
      icon: <Briefcase size={16} />
    },
    {
      id: 'business',
      question: "What type of business do you have?",
      type: 'choice',
      options: ['Restaurant/Food Service', 'Manufacturing', 'Retail', 'Hotel/Hospitality', 'Consultancy', 'Startup', 'Other'],
      field: 'businessType',
      icon: <Building size={16} />
    },
    {
      id: 'location',
      question: "Where is your business located?",
      type: 'choice',
      options: ['Kolkata', 'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Other City'],
      field: 'location',
      icon: <MapPin size={16} />
    },
    {
      id: 'name',
      question: "Great! What's your name?",
      type: 'input',
      field: 'name',
      icon: <UserIcon size={16} />
    },
    {
      id: 'phone',
      question: "Please share your phone number for our expert to contact you:",
      type: 'input',
      field: 'phone',
      icon: <Phone size={16} />
    }
  ];
  
  // Check operating hours
  useEffect(() => {
    const checkOperatingHours = () => {
      const now = new Date();
      const localTime = new Date(now.toLocaleString('en-US', { timeZone: operatingHours.timezone }));
      const day = localTime.getDay();
      const hour = localTime.getHours();
      
      const isWithinDays = operatingHours.days.includes(day);
      const isWithinHours = hour >= operatingHours.startHour && hour < operatingHours.endHour;
      
      setIsWithinOperatingHours(isWithinDays && isWithinHours);
    };
    
    checkOperatingHours();
    const interval = setInterval(checkOperatingHours, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Initialize conversation
  useEffect(() => {
    if (isOpen && !isMinimized && conversation.length === 0) {
      const welcomeMessage = {
        id: '1',
        text: conversationSteps[0].question,
        sender: 'bot' as const,
        timestamp: new Date()
      };
      setConversation([welcomeMessage]);
      
      setTimeout(() => {
        setConversation(prev => [...prev, {
          id: 'quick-replies',
          text: "Quick Start: Select a service to begin",
          sender: 'bot',
          timestamp: new Date(),
          isOption: true
        }]);
      }, 500);
    }
  }, [isOpen, isMinimized]);
  
  // Check if form is complete when phone is submitted
  useEffect(() => {
    const allFieldsFilled = 
      leadData.serviceNeeded && 
      leadData.businessType && 
      leadData.location && 
      leadData.name && 
      leadData.phone;
    
    if (allFieldsFilled && !isFormComplete) {
      setIsFormComplete(true);
      // Don't trigger confirmation here - let handleInputSubmit handle it
    }
  }, [leadData, isFormComplete]);
  
  // Auto-scroll
  useEffect(() => {
    if (conversationContainerRef.current && !isMinimized) {
      conversationContainerRef.current.scrollTop = conversationContainerRef.current.scrollHeight;
    }
  }, [conversation, isMinimized]);
  
  // Focus input when input step is active
  useEffect(() => {
    if (currentStepData?.type === 'input' && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [currentStep]);
  
  // Dynamic height
  useEffect(() => {
    const getChatHeight = () => {
      if (typeof window === 'undefined') return 500;
      const screenHeight = window.innerHeight;
      if (screenHeight < 600) return 350;
      if (screenHeight < 768) return 400;
      if (screenHeight < 1024) return 450;
      return 500;
    };
    
    setChatHeight(getChatHeight());
    
    const handleResize = () => setChatHeight(getChatHeight());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleOptionSelect = (option: string, stepIndex: number) => {
    const step = conversationSteps[stepIndex];
    if (step.field) {
      setLeadData(prev => ({ ...prev, [step.field!]: option }));
    }
    
    // Add user's selection to conversation
    const userMessage = {
      id: Date.now().toString(),
      text: option,
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    setConversation(prev => [...prev, userMessage]);
    
    // Bot response with next question
    setTimeout(() => {
      if (stepIndex < conversationSteps.length - 1) {
        const nextStep = conversationSteps[stepIndex + 1];
        const botMessage = {
          id: (Date.now() + 1).toString(),
          text: nextStep.question,
          sender: 'bot' as const,
          timestamp: new Date(),
          isOption: nextStep.type === 'choice'
        };
        
        setConversation(prev => [...prev, botMessage]);
        setCurrentStep(stepIndex + 1);
      }
    }, 500);
  };
  
  const handleInputSubmit = (value: string, stepIndex: number) => {
    const step = conversationSteps[stepIndex];
    if (step.field) {
      setLeadData(prev => ({ ...prev, [step.field!]: value }));
    }
    
    const userMessage = {
      id: Date.now().toString(),
      text: value,
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    setConversation(prev => [...prev, userMessage]);
    
    setTimeout(() => {
      // Check if this was the phone input (last step)
      if (step.field === 'phone') {
        // Show confirmation immediately after phone submission
        showConfirmation();
      } else if (stepIndex < conversationSteps.length - 1) {
        const nextStep = conversationSteps[stepIndex + 1];
        const botMessage = {
          id: (Date.now() + 1).toString(),
          text: nextStep.question,
          sender: 'bot' as const,
          timestamp: new Date(),
          isOption: nextStep.type === 'choice'
        };
        
        setConversation(prev => [...prev, botMessage]);
        setCurrentStep(stepIndex + 1);
      }
    }, 500);
  };
  
  const showConfirmation = () => {
    // First, update currentStep to prevent showing input again
    setCurrentStep(conversationSteps.length); // Set beyond last step
    
    const confirmationText = `✅ **Thank you! Here's a summary of your information:**
    
• **Service Needed:** ${leadData.serviceNeeded}
• **Business Type:** ${leadData.businessType}
• **Location:** ${leadData.location}
• **Name:** ${leadData.name}
• **Phone:** ${leadData.phone}`;
    
    const botMessage = {
      id: 'confirmation-message',
      text: confirmationText,
      sender: 'bot' as const,
      timestamp: new Date()
    };
    
    setConversation(prev => [...prev, botMessage]);
    
    // Show action buttons after confirmation
    setTimeout(() => {
      const actionMessage = {
        id: 'action-buttons',
        text: "What would you like to do next?",
        sender: 'bot' as const,
        timestamp: new Date(),
        isOption: true,
        isAction: true
      };
      setConversation(prev => [...prev, actionMessage]);
    }, 800);
  };
  
  const handleQuickStart = (service: string) => {
    setLeadData(prev => ({ ...prev, serviceNeeded: service }));
    
    const userMessage = {
      id: Date.now().toString(),
      text: service,
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    setConversation(prev => [...prev, userMessage]);
    
    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: conversationSteps[1].question, // Go to next question
        sender: 'bot' as const,
        timestamp: new Date(),
        isOption: true
      };
      
      setConversation(prev => [...prev, botMessage]);
      setCurrentStep(1);
    }, 500);
  };
  
  const handleApplyNow = () => {
    // Save lead data
    const leadInfo = {
      ...leadData,
      timestamp: new Date().toISOString(),
      action: 'apply_now'
    };
    localStorage.setItem('geemadhura_lead', JSON.stringify(leadInfo));
    
    const userMessage = {
      id: Date.now().toString(),
      text: 'Apply Now',
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    setConversation(prev => [...prev, userMessage]);
    
    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: "✅ Perfect! Taking you to our services page to start your application...",
        sender: 'bot' as const,
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, botMessage]);
      
      setTimeout(() => {
        setIsOpen(false);
        resetConversation();
        navigate('/services');
      }, 1500);
    }, 500);
  };
  
  const handleTalkToExpert = () => {
    const leadInfo = {
      ...leadData,
      timestamp: new Date().toISOString(),
      action: 'talk_to_expert'
    };
    localStorage.setItem('geemadhura_lead', JSON.stringify(leadInfo));
    
    const userMessage = {
      id: Date.now().toString(),
      text: 'Talk to Expert',
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    setConversation(prev => [...prev, userMessage]);
    
    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: "📞 Excellent choice! Our expert will call you shortly. Taking you to our contact page...",
        sender: 'bot' as const,
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, botMessage]);
      
      setTimeout(() => {
        setIsOpen(false);
        resetConversation();
        navigate('/contact');
      }, 1500);
    }, 500);
  };
  
  const resetConversation = () => {
    setCurrentStep(0);
    setLeadData({
      name: '',
      businessType: '',
      phone: '',
      serviceNeeded: '',
      location: '',
      email: ''
    });
    setConversation([]);
    setIsFormComplete(false);
  };
  
  const phoneNumbers = ['+91 96090 30792', '+91 96090 30832', '+91 96090 30833'];
  const whatsappNumber = '+919609030792';
  
  const handleCall = (number: string) => {
    window.location.href = `tel:${number.replace(/\s/g, '')}`;
  };
  
  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hello Geemadhura! I need assistance with:\n\n` +
      `Service: ${leadData.serviceNeeded || 'Not specified'}\n` +
      `Business: ${leadData.businessType || 'Not specified'}\n` +
      `Location: ${leadData.location || 'Not specified'}\n` +
      `Name: ${leadData.name || 'Not provided'}`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };
  
  const currentStepData = currentStep < conversationSteps.length ? conversationSteps[currentStep] : null;
  
  // Check if we should show input field
  const shouldShowInput = currentStepData?.type === 'input' && !isFormComplete;
  
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
          aria-label="Open lead form"
        >
          <Bot size={28} className="text-[#00283A]" />
          {!isOpen && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
            />
          )}
        </motion.button>
      </div>
      
      {/* Chat Window */}
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
            {/* Header */}
            <div className="flex-shrink-0 p-4 flex items-center justify-between border-b border-gray-700" style={{backgroundColor: '#00283A'}}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F2C445] flex items-center justify-center">
                  <Bot size={20} className="text-[#00283A]" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Geemadhura Assistant</h3>
                  <p className="text-xs text-gray-300">Lead Generation Form</p>
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
                  onClick={() => {
                    setIsOpen(false);
                    resetConversation();
                  }}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X size={18} className="text-white" />
                </button>
              </div>
            </div>
            
            {!isMinimized && (
              <>
                {/* Operating Hours Notice */}
                {!isWithinOperatingHours && (
                  <div className="px-4 py-2 bg-yellow-900/30 border-b border-yellow-700/50">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-yellow-400" />
                      <p className="text-xs text-yellow-200">
                        Outside business hours (Mon-Sat, 9 AM - 7 PM). We'll respond when we reopen.
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Conversation Container */}
                <div 
                  ref={conversationContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
                  style={{ maxHeight: 'calc(100% - 180px)' }}
                >
                  {conversation.map((message) => (
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
                        } ${message.isOption ? 'w-full max-w-full' : ''}`}
                        style={{
                          backgroundColor: message.sender === 'user' ? '#F2C445' : 
                                         message.isOption ? '#1a3a4d' : '#1a3a4d',
                          color: message.sender === 'user' ? '#00283A' : 'white'
                        }}
                      >
                        {!message.isOption ? (
                          <>
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
                          </>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-sm mb-2">{message.text}</p>
                            
                            {/* Quick Start Buttons */}
                            {message.id === 'quick-replies' && (
                              <div className="grid grid-cols-2 gap-2">
                                {['FSSAI License', 'Fire Safety NOC', 'Factory License', 'Talk to Expert'].map((option, idx) => (
                                  <motion.button
                                    key={idx}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                      if (option === 'Talk to Expert') {
                                        setLeadData(prev => ({ ...prev, serviceNeeded: 'Expert Consultation' }));
                                        const userMsg = {
                                          id: Date.now().toString(),
                                          text: option,
                                          sender: 'user' as const,
                                          timestamp: new Date()
                                        };
                                        setConversation(prev => [...prev, userMsg]);
                                        setTimeout(() => {
                                          const botMsg = {
                                            id: (Date.now() + 1).toString(),
                                            text: "I see you'd like to talk to an expert. Let me collect some details first:",
                                            sender: 'bot' as const,
                                            timestamp: new Date(),
                                            isOption: true
                                          };
                                          setConversation(prev => [...prev, botMsg]);
                                          setCurrentStep(1);
                                        }, 500);
                                      } else {
                                        handleQuickStart(option);
                                      }
                                    }}
                                    className="px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 justify-center"
                                    style={{
                                      backgroundColor: '#F2C445',
                                      color: '#00283A'
                                    }}
                                  >
                                    {option === 'Talk to Expert' ? (
                                      <Phone size={14} />
                                    ) : (
                                      <Briefcase size={14} />
                                    )}
                                    {option}
                                  </motion.button>
                                ))}
                              </div>
                            )}
                            
                            {/* Regular Choice Buttons */}
                            {currentStepData?.type === 'choice' && currentStepData.options && message.id !== 'quick-replies' && (
                              <div className="grid grid-cols-2 gap-2">
                                {currentStepData.options.map((option, idx) => (
                                  <motion.button
                                    key={idx}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleOptionSelect(option, currentStep)}
                                    className="px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 justify-center"
                                    style={{
                                      backgroundColor: '#F2C445',
                                      color: '#00283A'
                                    }}
                                  >
                                    {currentStepData.icon}
                                    {option}
                                  </motion.button>
                                ))}
                              </div>
                            )}
                            
                            {/* Action Buttons (Apply Now & Talk to Expert) */}
                            {message.isAction && (
                              <div className="grid grid-cols-2 gap-3 mt-3">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={handleApplyNow}
                                  className="px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                                  style={{
                                    backgroundColor: '#10B981',
                                    color: 'white'
                                  }}
                                >
                                  <Check size={18} />
                                  Apply Now
                                  <ExternalLink size={16} className="ml-1" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={handleTalkToExpert}
                                  className="px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                                  style={{
                                    backgroundColor: '#F2C445',
                                    color: '#00283A'
                                  }}
                                >
                                  <Phone size={18} />
                                  Talk to Expert
                                  <ExternalLink size={16} className="ml-1" />
                                </motion.button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Current Step Input - ONLY show if we're at an input step AND form is not complete */}
                  {shouldShowInput && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {currentStepData.icon}
                        <p className="text-sm text-gray-300">{currentStepData.question}</p>
                      </div>
                      <div className="flex gap-2">
                        <input
                          ref={inputRef}
                          type={currentStepData.field === 'phone' ? 'tel' : 'text'}
                          placeholder={currentStepData.field === 'phone' ? 'Enter your phone number' : 'Type your answer...'}
                          className="flex-1 px-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F2C445]"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                              handleInputSubmit(e.currentTarget.value, currentStep);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            if (inputRef.current?.value.trim()) {
                              handleInputSubmit(inputRef.current.value, currentStep);
                              inputRef.current.value = '';
                            }
                          }}
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: '#F2C445'
                          }}
                          aria-label="Submit"
                        >
                          <ChevronDown size={18} className="text-[#00283A] rotate-270" />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </div>
                
                {/* Progress Indicator */}
                <div className="flex-shrink-0 px-4 py-2 border-t border-gray-700 bg-[#00283A]">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-[#F2C445] h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: isFormComplete 
                            ? '100%' 
                            : `${((currentStep + (leadData.phone ? 0.5 : 0)) / conversationSteps.length) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 ml-3">
                      {isFormComplete ? 'Complete ✓' : `${currentStep + 1}/${conversationSteps.length}`}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-center">
                    {isWithinOperatingHours 
                      ? "🕘 Available: Mon-Sat, 9 AM - 7 PM" 
                      : "⏸️ We'll respond during business hours"}
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

// Export for backward compatibility
export { ConversationalLeadForm as Chatbot };