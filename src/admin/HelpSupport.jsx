import React, { useState } from 'react';
import { 
  FiMail, 
  FiPhone, 
  FiMessageSquare, 
  FiChevronDown 
} from 'react-icons/fi';

const HelpSupport = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: 'How do I get started with the AI chat?',
      answer: 'To get started, simply sign up for an account, choose your preferred AI model, and start chatting! You can customize your experience through the settings page.',
    },
    {
      question: 'What AI models are available?',
      answer: 'We currently support GPT-4, GPT-3.5 Turbo, and Claude. Each model has its own strengths and use cases. You can switch between models in the settings.',
    },
    {
      question: 'How do I manage my API keys?',
      answer: 'You can manage your API keys in the Settings page under the API Settings section. Make sure to keep your keys secure and never share them.',
    },
    {
      question: 'What are the usage limits?',
      answer: 'Usage limits vary based on your subscription plan. Free users have basic access, while premium users enjoy higher limits and additional features.',
    },
  ];

  const handleContactFormChange = (field) => (event) => {
    setContactForm({
      ...contactForm,
      [field]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: Send contact form to backend
    console.log('Submitting contact form:', contactForm);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow">
                <button
                  className="w-full px-4 py-3 flex items-center justify-between text-left"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <FiChevronDown className={`h-5 w-5 text-gray-500 transform transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Contact Support
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <FiMail className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-600">support@example.com</span>
              </div>
              <div className="flex items-center">
                <FiPhone className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-600">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <FiMessageSquare className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-600">Live Chat Available</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Send us a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={handleContactFormChange('name')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={handleContactFormChange('email')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={handleContactFormChange('subject')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  value={contactForm.message}
                  onChange={handleContactFormChange('message')}
                  rows={4}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport; 