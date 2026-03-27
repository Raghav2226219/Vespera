import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowLeft, Crown } from "lucide-react";

const PremiumPlans = () => {
  const navigate = useNavigate();

  const plans = [
    {
      id: "free",
      name: "Explorer",
      price: "$0",
      period: "/forever",
      description: "Perfect for getting started and exploring Vespera's features.",
      features: [
        "Up to 3 active boards",
        "Basic task management",
        "Standard collaboration",
        "Community support",
      ],
      ctaText: "Current Plan",
      gradient: "from-gray-700 to-gray-600",
      buttonStyle: "bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700",
    },
    {
      id: "pro",
      name: "Pro",
      price: "$9",
      period: "/month",
      description: "Ideal for power users who need advanced tools and flexibility.",
      features: [
        "Unlimited boards",
        "Advanced task automations",
        "Priority email support",
        "Custom templates",
        "Advanced user permissions",
      ],
      ctaText: "Upgrade to Pro",
      gradient: "from-lime-400 via-green-500 to-emerald-600",
      buttonStyle: "bg-gradient-to-r from-lime-400 to-emerald-500 text-gray-900 font-bold hover:shadow-[0_0_20px_rgba(52,211,153,0.5)]",
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$29",
      period: "/month",
      description: "For large teams requiring ultimate control, security, and support.",
      features: [
        "Everything in Pro",
        "Dedicated account manager",
        "Single Sign-On (SSO)",
        "Audit logs and reporting",
        "24/7 dedicated support",
        "Unlimited cloud storage",
      ],
      ctaText: "Contact Sales",
      gradient: "from-yellow-300 via-amber-400 to-orange-500",
      buttonStyle: "bg-gradient-to-r from-yellow-300 to-amber-500 text-gray-900 font-bold hover:shadow-[0_0_20px_rgba(251,191,36,0.5)]",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1914] via-[#132d1f] to-[#193a29] text-white overflow-hidden relative font-sans p-6 md:p-12">
      
      {/* 💫 Ambient Background Lights */}
      <motion.div
        animate={{ x: [0, 40, -40, 0], y: [0, -30, 30, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-[400px] h-[400px] bg-lime-500/10 blur-[150px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -50, 50, 0], y: [0, 50, -50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-400/10 blur-[150px] rounded-full pointer-events-none"
      />

      {/* Nav & Header */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-10">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-yellow-200/80 hover:text-yellow-400 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold text-lg hidden sm:block">Back</span>
          </motion.button>
          
          <div className="flex items-center gap-3">
             <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-lime-300 drop-shadow-[0_0_15px_rgba(255,255,150,0.5)]">
              Vespera <span className="text-white drop-shadow-none">Plans</span>
            </h1>
            <Crown className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_10px_rgba(255,255,100,0.8)]" />
          </div>
          <div className="w-10"></div> {/* Spacer to center the title better */}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mt-4 mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Unleash Your Full <br />
            <span className="bg-gradient-to-r from-lime-300 via-green-300 to-emerald-300 bg-clip-text text-transparent">
              Productivity Potential
            </span>
          </h2>
          <p className="text-lg text-yellow-200/60 leading-relaxed">
            Choose the perfect plan to streamline your workflow, manage tasks efficiently, and collaborate seamlessly with your team.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className={`relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center overflow-hidden
                ${plan.popular ? "shadow-[0_0_30px_rgba(52,211,153,0.15)] md:-mt-6 md:mb-6" : ""}
              `}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 w-full left-0 bg-gradient-to-r from-lime-400 to-emerald-500 text-gray-900 font-bold text-sm py-1">
                  Most Popular
                </div>
              )}

              {/* Card Header */}
              <h3 className={`text-2xl font-bold mt-4 bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent drop-shadow-sm`}>
                {plan.name}
              </h3>
              <div className="mt-4 flex items-end justify-center mb-6">
                <span className="text-5xl font-extrabold text-white">{plan.price}</span>
                <span className="text-lg text-gray-400 ml-1 mb-1">{plan.period}</span>
              </div>
              <p className="text-gray-300 text-sm mb-8 px-4">
                {plan.description}
              </p>

              {/* Features List */}
              <div className="flex-1 w-full flex flex-col items-start gap-4 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 text-left">
                    <CheckCircle2 className="w-5 h-5 text-lime-400 shrink-0 mt-0.5" />
                    <span className="text-gray-200 text-sm whitespace-pre-line">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => {
                  if (plan.id !== "free") navigate(`/checkout/${plan.id}`);
                }}
                className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${plan.buttonStyle}`}
              >
                {plan.ctaText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PremiumPlans;
