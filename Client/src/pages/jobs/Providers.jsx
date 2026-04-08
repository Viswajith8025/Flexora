import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Users,
  Clock,
  DollarSign,
  Shield,
  CheckCircle,
  Settings,
  UserCheck,
  ArrowRight,
} from 'lucide-react';

const Providers = () => {
  const features = [
    {
      icon: <Users className="h-6 w-6 text-blue-400" />,
      title: "Access to Skilled Workers",
      description: "Connect with thousands of pre-vetted professionals ready to work",
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-400" />,
      title: "Quick Hiring",
      description: "Fill positions in hours, not days or weeks",
    },
    {
      icon: <DollarSign className="h-6 w-6 text-blue-400" />,
      title: "Competitive Rates",
      description: "Set your own budget and find workers within your price range",
    },
    {
      icon: <Shield className="h-6 w-6 text-blue-400" />,
      title: "Reliable & Secure",
      description: "Background-checked workers and secure payment processing",
    },
  ];

  const steps = [
    { step: "01", icon: <Briefcase className="h-5 w-5" />, title: "Post Your Job", description: "Create a detailed job listing in minutes after logging in" },
    { step: "02", icon: <UserCheck className="h-5 w-5" />, title: "Review Applicants", description: "Browse profiles and select the best candidates" },
    { step: "03", icon: <Settings className="h-5 w-5" />, title: "Hire & Coordinate", description: "Confirm workers and share job details through our secure chat" },
    { step: "04", icon: <CheckCircle className="h-5 w-5" />, title: "Complete & Pay", description: "Job completion and payment processing through the platform" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      {/* Hero */}
      <section className="relative z-10 pt-28 pb-24 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8"
          >
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-white/60 text-[11px] font-bold uppercase tracking-widest">For Employers</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-7xl font-black tracking-tighter leading-[0.9] mb-6"
          >
            Hire Skilled Workers<br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent italic">On Demand</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed mb-12"
          >
            Find reliable staff for your events, projects, and short-term needs. Post a job and get applications within hours.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/flexoraauth"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 text-sm uppercase tracking-widest"
            >
              Login to Post Jobs <ArrowRight size={16} />
            </Link>
            <Link
              to="/flexoraauth"
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 text-sm uppercase tracking-widest"
            >
              Create Employer Account
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.3em] mb-3">Why Flexora</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Why Businesses Choose <span className="italic text-white/40">Flexora</span></h2>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white/5 border border-white/5 hover:border-blue-500/30 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="font-black text-white text-sm uppercase tracking-tight mb-2">{feature.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.3em] mb-3">Process</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">How Flexora Works <span className="italic text-white/40">for Employers</span></h2>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {steps.map((step, index) => (
              <motion.div key={index} variants={itemVariants} className="relative">
                <div className="bg-white/5 border border-white/5 hover:border-white/10 rounded-3xl p-6 h-full transition-all duration-300">
                  <div className="text-4xl font-black text-white/5 mb-4 tracking-tighter">{step.step}</div>
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-4">
                    {step.icon}
                  </div>
                  <h3 className="font-black text-white text-sm uppercase tracking-tight mb-2">{step.title}</h3>
                  <p className="text-white/40 text-xs leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-3 z-10 text-white/20">
                    <ArrowRight size={16} />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
            Ready to Find Your <span className="italic text-blue-400">Perfect Staff?</span>
          </h2>
          <p className="text-white/40 text-sm mb-10 leading-relaxed">
            Join businesses who trust Flexora for their on-demand staffing needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/flexoraauth"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 text-sm uppercase tracking-widest"
            >
              Get Started Free <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Providers;
