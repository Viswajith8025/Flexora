import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronDown,
  ChevronUp,
  User,
  Briefcase,
  DollarSign,
  Shield,
  Clock,
  Settings,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  FileText,
  CheckCircle,
  Plus,
  Send
} from 'lucide-react';

const HelpCenter = () => {
  // State management
  const [activeCategory, setActiveCategory] = useState('general');
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [newQuestion, setNewQuestion] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userQuestions, setUserQuestions] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // Set this based on user role
  const [adminReply, setAdminReply] = useState('');

  // FAQ data
  const faqCategories = {
    general: [
      {
        id: 1,
        question: "How do I create an account?",
        answer: "Click on 'Sign Up' at the top right corner and follow the registration process.",
        userSubmitted: false
      },
      {
        id: 2,
        question: "Is there a mobile app available?",
        answer: "Yes, Flexora is available on both iOS and Android devices.",
        userSubmitted: false
      }
    ],
    jobs: [
      {
        id: 3,
        question: "How do I apply for jobs?",
        answer: "Browse available jobs, click on one that interests you, and hit 'Apply Now'.",
        userSubmitted: false
      },
      {
        id: 4,
        question: "Can I save job listings to apply later?",
        answer: "Yes, you can bookmark jobs by clicking the star icon on any listing.",
        userSubmitted: false
      }
    ],
    payments: [
      {
        id: 5,
        question: "How and when do I get paid?",
        answer: "Payments are processed weekly every Friday via your preferred payment method.",
        userSubmitted: false
      },
      {
        id: 6,
        question: "What payment methods are supported?",
        answer: "We support bank transfers, PayPal, and Flexora Wallet payments.",
        userSubmitted: false
      }
    ],
    account: [
      {
        id: 7,
        question: "How do I reset my password?",
        answer: "Click 'Forgot Password' on the login page and follow the instructions sent to your email.",
        userSubmitted: false
      },
      {
        id: 8,
        question: "Can I change my email address?",
        answer: "Yes, go to Account Settings > Personal Information to update your email.",
        userSubmitted: false
      }
    ],
    safety: [
      {
        id: 9,
        question: "How does Flexora ensure my safety?",
        answer: "All users undergo verification and we have 24/7 support for any issues.",
        userSubmitted: false
      },
      {
        id: 10,
        question: "What should I do if I feel unsafe at a job?",
        answer: "Immediately contact our safety team through the emergency button in the app.",
        userSubmitted: false
      }
    ],
    userQuestions: [] // Will be populated with user-submitted questions
  };

  // Toggle question expansion
  const toggleQuestion = (questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  // Submit new question
  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    
    const newUserQuestion = {
      id: Date.now(),
      question: newQuestion,
      answer: '',
      userSubmitted: true,
      email: userEmail,
      date: new Date().toISOString(),
      status: 'pending'
    };
    
    setUserQuestions(prev => [...prev, newUserQuestion]);
    setNewQuestion('');
    setUserEmail('');
    
    // In a real app, you would send this to your backend
    console.log('Question submitted:', newUserQuestion);
  };

  // Admin submit answer
  const handleAdminReply = (questionId) => {
    if (!adminReply.trim()) return;
    
    // Update the question with the admin's answer
    setUserQuestions(prev => 
      prev.map(q => 
        q.id === questionId 
          ? { ...q, answer: adminReply, status: 'answered' } 
          : q
      )
    );
    
    setAdminReply('');
    
    // In a real app, you would send this to your backend
    console.log('Admin reply submitted for question:', questionId);
  };

  // Combine predefined FAQs with user questions
  const allQuestions = {
    ...faqCategories,
    userQuestions: [...faqCategories.userQuestions, ...userQuestions]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-xl">Find answers or contact our support team</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Tabs */}
        <div className="flex overflow-x-auto mb-8 pb-2 space-x-2">
          {Object.keys(faqCategories).map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')}
            </button>
          ))}
          <button
            onClick={() => setActiveCategory('userQuestions')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              activeCategory === 'userQuestions'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Your Questions
          </button>
        </div>

        {/* FAQ List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-12">
          {allQuestions[activeCategory].map(item => (
            <div key={item.id} className="border-b border-gray-200 last:border-b-0">
              <button
                onClick={() => toggleQuestion(item.id)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50"
              >
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  {item.userSubmitted && (
                    <span className={`inline-block w-3 h-3 rounded-full mr-3 ${
                      item.status === 'answered' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></span>
                  )}
                  {item.question}
                </h3>
                {expandedQuestions[item.id] ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {expandedQuestions[item.id] && (
                <div className="px-6 pb-6">
                  <div className="prose prose-blue max-w-none">
                    <p className="text-gray-600">{item.answer || 'Not answered yet'}</p>
                  </div>
                  
                  {/* Admin reply area */}
                  {isAdmin && !item.answer && (
                    <div className="mt-4">
                      <textarea
                        value={adminReply}
                        onChange={(e) => setAdminReply(e.target.value)}
                        placeholder="Type your answer here..."
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        rows="3"
                      />
                      <button
                        onClick={() => handleAdminReply(item.id)}
                        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Submit Answer
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Submit Question Form */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
          <form onSubmit={handleSubmitQuestion}>
            <div className="mb-4">
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
                Your Question
              </label>
              <textarea
                id="question"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows="3"
                placeholder="Type your question here..."
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address (for response)
              </label>
              <input
                type="email"
                id="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="your@email.com"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Submit Question
            </button>
          </form>
        </div>

        {/* Additional Help Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="flex items-center mb-4">
              <MessageSquare className="h-8 w-8 text-blue-600 mr-4" />
              <h3 className="text-xl font-semibold">Live Chat</h3>
            </div>
            <p className="text-gray-600 mb-4">Chat with our support team in real-time</p>
            <button className="text-blue-600 font-medium">Start Chat</button>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="flex items-center mb-4">
              <Phone className="h-8 w-8 text-blue-600 mr-4" />
              <h3 className="text-xl font-semibold">Phone Support</h3>
            </div>
            <p className="text-gray-600 mb-4">Call us at (800) 123-4567</p>
            <button className="text-blue-600 font-medium">Call Now</button>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="flex items-center mb-4">
              <Mail className="h-8 w-8 text-blue-600 mr-4" />
              <h3 className="text-xl font-semibold">Email Us</h3>
            </div>
            <p className="text-gray-600 mb-4">Send us an email at support@flexora.com</p>
            <button className="text-blue-600 font-medium">Send Email</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;