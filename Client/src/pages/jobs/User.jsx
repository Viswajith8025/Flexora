import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Search,
  FileText,
  UserCheck,
  Clock,
  DollarSign,
  Shield,
  CheckCircle,
  HelpCircle,
  MessageSquare,
  Phone,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserRoles = () => {
  const { user: currentUser } = useAuth();

  const steps = [
    {
      step: 1,
      icon: <Search className="h-6 w-6 text-white" />,
      title: "Browse Jobs",
      description: currentUser 
        ? "Search available flexible jobs anytime" 
        : "Login required to browse jobs"
    },
    {
      step: 2,
      icon: <FileText className="h-6 w-6 text-white" />,
      title: "Review Details",
      description: "Check job requirements, pay rate, and schedule"
    },
    {
      step: 3,
      icon: <UserCheck className="h-6 w-6 text-white" />,
      title: "Apply Instantly",
      description: currentUser
        ? "One-click application with your profile"
        : "Login to apply for jobs"
    },
    {
      step: 4,
      icon: <CheckCircle className="h-6 w-6 text-white" />,
      title: "Get Hired",
      description: "Receive confirmation and job details"
    }
  ];

  const features = [
    {
      icon: <Clock className="h-8 w-8 text-blue-600" />,
      title: "Flexible Scheduling",
      description: "Choose jobs that fit your availability"
    },
    {
      icon: <DollarSign className="h-8 w-8 text-blue-600" />,
      title: "Transparent Pay",
      description: "Know your earnings before you apply"
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Secure Platform",
      description: "Verified employers and safe payments"
    },
    {
      icon: <UserCheck className="h-8 w-8 text-blue-600" />,
      title: "Profile Badges",
      description: "Stand out with verified skills and ratings"
    }
  ];

  const helpResources = [
    {
      icon: <HelpCircle className="h-6 w-6 text-blue-600" />,
      title: "Help Center",
      description: "Find answers to common questions",
      link: "/helpcenter"
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-blue-600" />,
      title: "Live Support Chat",
      description: "Chat with our support team",
      link: currentUser ? "/messaging" : "/flexoraauth"
    },
    {
      icon: <Phone className="h-6 w-6 text-blue-600" />,
      title: "Phone Support",
      description: "Call us at (555) 123-4567",
      link: "tel:5551234567"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How to Apply for Jobs on Flexora
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Your complete guide to finding and securing temporary work
            </p>

            {/* CTA BUTTON */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {currentUser ? (
                <Link
                  to="/jobs"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition font-semibold text-lg"
                >
                  Browse Jobs <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <Link
                  to="/flexoraauth"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition font-semibold text-lg"
                >
                  Login to Find Jobs
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* APPLICATION PROCESS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            4 Simple Steps to Get Hired
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our streamlined process makes finding work quick and easy
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center 
                text-white font-bold text-xl z-10">
                {step.step}
              </div>

              <div className="bg-white p-8 rounded-xl h-full pt-12 shadow-sm hover:shadow-md transition text-center">
                <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>

                {/* APPLY BUTTON */}
                {step.step === 3 && (
                  <Link
                    to={currentUser ? "/jobs" : "/flexoraauth"}
                    className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition"
                  >
                    {currentUser ? "Apply for Jobs" : "Login to Apply"}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WHY WORKERS LOVE FLEXORA */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Workers Love Flexora
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Features designed to make your job search easier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HELP RESOURCES */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Help?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're here to support your job search
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {helpResources.map((item, idx) => (
              <Link
                key={idx}
                to={item.link}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition group"
              >
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4 group-hover:bg-blue-200 transition">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Working?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of workers finding flexible opportunities
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={currentUser ? "/jobs" : "/flexoraauth"}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition font-semibold text-lg flex items-center justify-center"
            >
              {currentUser ? (
                <>Browse Jobs <ArrowRight className="ml-2 h-5 w-5" /></>
              ) : (
                <>Login to Browse Jobs</>
              )}
            </Link>

            <Link
              to="/flexoraauth"
              className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition font-semibold text-lg"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRoles;
