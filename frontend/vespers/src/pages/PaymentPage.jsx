import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CreditCard, Smartphone, QrCode, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { getCardNetwork, BANK_BINS } from "../utils/bankDetails";

const PremiumPlansStatic = [
  {
    id: "pro",
    name: "Pro",
    price: 9,
    period: "/month",
    description: "Ideal for power users who need advanced tools and flexibility.",
    features: ["Unlimited boards", "Advanced task automations", "Priority email support"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 29,
    period: "/month",
    description: "For large teams requiring ultimate control, security, and support.",
    features: ["Everything in Pro", "Single Sign-On (SSO)", "24/7 dedicated support"],
  },
];

const PaymentPage = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const plan = PremiumPlansStatic.find((p) => p.id === planId) || PremiumPlansStatic[0];

  const [activeTab, setActiveTab] = useState("card");
  
  // Real-time Detection States
  const [detectedBank, setDetectedBank] = useState(null);
  const [detectedNetwork, setDetectedNetwork] = useState(null);
  
  // Card Details State
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [isFlipped, setIsFlipped] = useState(false);

  // UPI State
  const [upiId, setUpiId] = useState("");

  const handleCardInput = (e) => {
    let { name, value } = e.target;
    if (name === "number") {
      value = value.replace(/\D/g, "").slice(0, 16);
      
      // Perform instantaneous real-time detection on raw string
      const raw = value;
      setDetectedNetwork(getCardNetwork(raw));
      
      if (raw.length >= 6) {
        setDetectedBank(BANK_BINS[raw.substring(0, 6)] || null);
      } else {
        setDetectedBank(null);
      }

      value = value.replace(/(\d{4})/g, "$1 ").trim();
    }
    if (name === "expiry") {
      value = value.replace(/\D/g, "").slice(0, 4);
      if (value.length > 2) {
        value = `${value.slice(0, 2)}/${value.slice(2)}`;
      }
    }
    if (name === "cvv") value = value.replace(/\D/g, "").slice(0, 3);
    
    setCardData({ ...cardData, [name]: value });
  };

  const handlePayment = (e) => {
    e.preventDefault();
    alert(`Processing payment via ${activeTab.toUpperCase()}...`);
    // After payment logic...
  };

  // UI Components inside PaymentPage
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1914] via-[#132d1f] to-[#193a29] text-white flex justify-center items-center p-4 sm:p-8 font-sans relative overflow-hidden">
      
      {/* 💫 Ambient Lights */}
      <motion.div
        animate={{ x: [0, 50, -50, 0], y: [0, -40, 40, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-lime-500/10 blur-[150px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -60, 60, 0], y: [0, 60, -60, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none"
      />

      <div className="max-w-6xl w-full bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row overflow-hidden relative z-10">
        
        {/* Left Panel: Order Summary */}
        <div className="w-full lg:w-1/3 bg-[#0d1f18]/80 p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-between relative">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition mb-10 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold tracking-wide text-sm">Return</span>
            </button>
            
            <div className="mb-2 text-lime-400 font-bold tracking-widest text-xs uppercase">Order Summary</div>
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-emerald-400 mb-6 drop-shadow-sm">
              {plan.name} Plan
            </h2>
            <p className="text-emerald-200/60 leading-relaxed text-sm mb-8 pr-4">
              {plan.description}
            </p>

            <div className="space-y-4 mb-8">
              {plan.features.slice(0, 3).map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-sm text-gray-300 font-medium">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
            <div className="flex justify-between items-end mb-2">
              <span className="text-gray-400 text-sm font-medium">Billed {plan.period.replace("/", "")}</span>
              <span className="text-3xl font-extrabold text-white">${plan.price}</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400/80 text-xs mt-4">
              <ShieldCheck className="w-4 h-4" />
              <span>Secure 256-bit encrypted checkout</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Payment Interaction */}
        <div className="w-full lg:w-2/3 p-8 lg:p-12 relative flex flex-col">
          
          <h3 className="text-xl font-bold mb-6 text-white/90">Select Payment Method</h3>
          
          {/* Method Tabs */}
          <div className="flex gap-4 mb-10 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: "card", label: "Credit Card", icon: CreditCard },
              { id: "upi", label: "UPI ID", icon: Smartphone },
              { id: "qr", label: "Scan QR", icon: QrCode },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 font-semibold text-sm whitespace-nowrap border ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-lime-500/20 to-emerald-500/20 border-lime-400/50 text-lime-300 shadow-[0_0_20px_rgba(163,230,53,0.15)]"
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-lime-400" : ""}`} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dynamic Forms via AnimatePresence */}
          <div className="flex-1 relative w-full h-full min-h-[350px]">
            <AnimatePresence mode="wait">
              
              {/* === CARD TAB === */}
              {activeTab === "card" && (
                <motion.form
                  key="card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handlePayment}
                  className="w-full h-full flex flex-col xl:flex-row gap-10"
                >
                  {/* Left: Input Fields */}
                  <div className="flex-1 space-y-5">
                    <div>
                      <label className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1.5 block pl-1">Card Number</label>
                      <input
                        type="text"
                        name="number"
                        placeholder="0000 0000 0000 0000"
                        value={cardData.number}
                        onChange={handleCardInput}
                        maxLength={19}
                        required
                        className="w-full bg-[#11241c] text-white placeholder-gray-500 border border-emerald-500/20 rounded-xl px-4 py-3 focus:outline-none focus:border-lime-400 focus:shadow-[0_0_15px_rgba(163,230,53,0.1)] transition-all font-mono tracking-widest text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1.5 block pl-1">Cardholder Name</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="JOHN DOE"
                        value={cardData.name}
                        onChange={handleCardInput}
                        required
                        className="w-full bg-[#11241c] text-white placeholder-gray-500 border border-emerald-500/20 rounded-xl px-4 py-3 focus:outline-none focus:border-lime-400 focus:shadow-[0_0_15px_rgba(163,230,53,0.1)] transition-all font-medium uppercase text-sm"
                      />
                    </div>
                    <div className="flex gap-5">
                      <div className="w-1/2">
                        <label className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1.5 block pl-1">Expiry Date</label>
                        <input
                          type="text"
                          name="expiry"
                          placeholder="MM/YY"
                          value={cardData.expiry}
                          onChange={handleCardInput}
                          maxLength={5}
                          required
                          className="w-full bg-[#11241c] text-white placeholder-gray-500 border border-emerald-500/20 rounded-xl px-4 py-3 focus:outline-none focus:border-lime-400 focus:shadow-[0_0_15px_rgba(163,230,53,0.1)] transition-all font-mono tracking-widest text-sm"
                        />
                      </div>
                      <div className="w-1/2">
                        <label className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1.5 block pl-1">CVV</label>
                        <input
                          type="text"
                          name="cvv"
                          placeholder="123"
                          value={cardData.cvv}
                          onChange={handleCardInput}
                          onFocus={() => setIsFlipped(true)}
                          onBlur={() => setIsFlipped(false)}
                          maxLength={3}
                          required
                          className="w-full bg-[#11241c] text-white placeholder-gray-500 border border-emerald-500/20 rounded-xl px-4 py-3 focus:outline-none focus:border-lime-400 focus:shadow-[0_0_15px_rgba(163,230,53,0.1)] transition-all font-mono tracking-widest text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right: Awesome 3D Animated Card */}
                  <div className="flex-1 flex justify-center items-start mt-4 xl:mt-0 perspective-1000">
                    <motion.div
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                      style={{ transformStyle: "preserve-3d" }}
                      className="w-full max-w-[340px] h-[215px] relative rounded-2xl shadow-2xl"
                    >
                      {/* FRONT FACE */}
                      <div 
                        style={{ backfaceVisibility: "hidden" }}
                        className={`absolute inset-0 w-full h-full bg-gradient-to-tr ${detectedBank?.gradient || "from-gray-900 via-emerald-950 to-[#07150f]"} rounded-2xl p-6 flex flex-col justify-between border ${detectedBank ? "border-white/20" : "border-lime-500/30"} overflow-hidden shadow-[inset_0_0_20px_rgba(255,255,255,0.08)] transition-all duration-700`}
                      >
                        {/* Shimmer line */}
                        <div className="absolute top-0 left-0 w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full translate-y-full hover:animate-[shine_3s_ease-out_infinite] pointer-events-none" />
                        
                        {/* BANK NAME ANCHOR */}
                        <div className="flex justify-between items-start z-10 w-full mb-1">
                          <div className={`text-[12px] font-extrabold tracking-widest uppercase opacity-95 transition-colors ${detectedBank?.textDark ? "text-gray-900" : "text-white"}`}>
                            {detectedBank?.name || "VESPERA"}
                          </div>
                        </div>

                        <div className="flex justify-between items-start z-10 w-full">
                          {/* Card Chip */}
                          <div className="w-11 h-8 rounded-md bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 flex items-center justify-center opacity-90 shadow-[0_2px_5px_rgba(0,0,0,0.3)] border border-yellow-600/50">
                            <div className="w-7 h-5 border border-yellow-700/40 rounded-sm flex flex-col justify-between py-[2px]">
                               <div className="w-full h-[1px] bg-yellow-700/40"></div>
                               <div className="w-full h-[1px] bg-yellow-700/40"></div>
                            </div>
                          </div>
                          
                          {/* Brand Logo Display */}
                          <div className="h-9 flex items-center justify-end min-w-[60px]">
                            {detectedNetwork === "Visa" && (
                              <svg viewBox="0 0 300 98" className={`w-14 h-auto drop-shadow-sm transition-colors ${detectedBank?.textDark ? "fill-[#00579F]" : "fill-white"}`}>
                                <path d="M129.8 2.05H108.6L95.5 83H116.7L129.8 2.05zM224 2.05H206C201.2 2.05 197.6 4.35 195.4 9.15L166 83H188.4L192.9 70.3H220.2L222.8 83H242.8L224 2.05zM199.1 52.8L209.4 24.3L215.3 52.8H199.1zM91.8 2.05H72.4C67.6 2.05 64 4.15 62 8.55L31.3 83H53.5L57.9 70.3H90.2L91.8 83H111.8L91.8 2.05z" />
                              </svg>
                            )}
                            {detectedNetwork === "Mastercard" && (
                              <svg className="w-12 h-8 opacity-90 drop-shadow-md" viewBox="0 0 48 32" fill="none">
                                <circle cx="16" cy="16" r="16" fill="#EA001B"/>
                                <circle cx="32" cy="16" r="16" fill="#F79E1B" fillOpacity="0.9"/>
                              </svg>
                            )}
                            {detectedNetwork === "Amex" && (
                              <div className="bg-blue-500 text-white font-bold text-[11px] px-2 py-1 rounded shadow-sm border border-white/20 tracking-wider">AMEX</div>
                            )}
                            {detectedNetwork === "RuPay" && (
                              <div className="flex text-[15px] font-extrabold italic bg-white/90 px-2 py-[2px] rounded-sm shadow-sm">
                                <span className="text-[#F26422]">Ru</span><span className="text-[#008940]">Pay</span>
                              </div>
                            )}
                            {detectedNetwork === "Discover" && (
                              <div className="text-orange-500 font-extrabold italic text-sm drop-shadow-sm bg-white/90 px-2 py-[2px] rounded-sm">DISCOVER</div>
                            )}
                            {!detectedNetwork && (
                              <svg className="w-14 h-9 opacity-40 drop-shadow-none" viewBox="0 0 48 32" fill="none">
                                <circle cx="16" cy="16" r="16" fill="#FACC15" fillOpacity="0.5"/>
                                <circle cx="32" cy="16" r="16" fill="#A3E635" fillOpacity="0.5"/>
                              </svg>
                            )}
                          </div>
                        </div>

                        <div className="z-10 mt-auto">
                          <div className={`font-mono text-[22px] tracking-[0.14em] mb-4 drop-shadow-md transition-colors ${detectedBank?.textDark ? "text-gray-900" : "text-white/95"}`}>
                            {cardData.number || "•••• •••• •••• ••••"}
                          </div>
                          <div className="flex justify-between items-end w-full">
                            <div className="flex flex-col">
                              <span className={`text-[9px] uppercase tracking-widest mb-1 transition-colors ${detectedBank?.textDark ? "text-gray-700 font-bold" : "text-emerald-200/50"}`}>Cardholder</span>
                              <span className={`uppercase tracking-widest text-sm font-semibold overflow-hidden text-ellipsis whitespace-nowrap max-w-[170px] transition-colors ${detectedBank?.textDark ? "text-gray-900" : "text-white/90"}`}>
                                {cardData.name || "YOUR NAME"}
                              </span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className={`text-[9px] uppercase tracking-widest mb-1 transition-colors ${detectedBank?.textDark ? "text-gray-700 font-bold" : "text-emerald-200/50"}`}>Expires</span>
                              <span className={`font-mono text-sm tracking-wider transition-colors ${detectedBank?.textDark ? "text-gray-900" : "text-white/90"}`}>
                                {cardData.expiry || "MM/YY"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* BACK FACE */}
                      <div 
                        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                        className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-2xl flex flex-col border border-white/10 overflow-hidden"
                      >
                        <div className="w-full h-12 bg-black/90 mt-6 shadow-sm" />
                        <div className="px-6 flex-1 flex flex-col justify-center">
                          <div className="text-[10px] font-bold uppercase text-gray-500 mb-1 tracking-widest text-right pr-2">CVV</div>
                          <div className="w-full h-10 bg-white/90 rounded flex items-center justify-end px-3 shadow-inner">
                            <span className="font-mono text-gray-900 italic font-extrabold tracking-widest">{cardData.cvv || "•••"}</span>
                          </div>
                        </div>
                        <div className="px-6 pb-5 text-[8.5px] text-gray-500/80 leading-snug">
                          This payment card is issued by Vespera Financials. Use is governed by the terms outlined in the Cardholder Agreement. Non-transferable.
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.form>
              )}


              {/* === UPI TAB === */}
              {activeTab === "upi" && (
                <motion.form
                  key="upi"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handlePayment}
                  className="w-full h-full flex flex-col justify-center items-center"
                >
                  <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 p-8 rounded-3xl w-full max-w-md text-center shadow-[0_0_40px_rgba(0,0,0,0.3)] backdrop-blur-md relative overflow-hidden group">
                    <div className="absolute inset-0 bg-lime-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    
                    <Smartphone className="w-12 h-12 text-lime-400 mx-auto mb-6 opacity-90 drop-shadow-[0_0_10px_rgba(163,230,53,0.5)]" />
                    <h4 className="text-xl font-bold mb-2">Enter UPI ID</h4>
                    <p className="text-gray-400 text-sm mb-8 px-4">A payment request will be sent to your UPI app. Approve it to complete the transaction.</p>
                    
                    <div className="relative mb-8 text-left">
                      <label className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1.5 block pl-1">Virtual Payment Address (VPA)</label>
                      <input
                        type="text"
                        placeholder="yourname@bank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        required
                        className="w-full bg-[#0d1f18] text-white placeholder-gray-500 border border-emerald-500/30 rounded-xl px-5 py-4 focus:outline-none focus:border-lime-400 focus:shadow-[0_0_20px_rgba(163,230,53,0.2)] transition-all font-medium text-lg text-center tracking-wide"
                      />
                    </div>
                  </div>
                </motion.form>
              )}


              {/* === QR CODE TAB === */}
              {activeTab === "qr" && (
                <motion.div
                  key="qr"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full flex flex-col justify-center items-center"
                >
                  <div className="bg-white p-8 rounded-3xl w-full max-w-sm text-center shadow-[0_0_50px_rgba(163,230,53,0.15)] relative group">
                    <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-lime-400/50 transition-colors duration-500 pointer-events-none" />
                    
                    <h4 className="text-lg font-bold text-gray-900 mb-6">Scan to Pay</h4>
                    
                    <div className="bg-white p-2 rounded-2xl mx-auto inline-block border-[4px] border-emerald-100 relative shadow-inner">
                      {/* Generates an actual scannable UPI string for Indian UPI apps using qrcode.react */}
                      <QRCodeSVG 
                        value={`upi://pay?pa=vespera@upi&pn=Vespera&am=${plan.price}&cu=USD`} 
                        size={200}
                        bgColor={"#ffffff"}
                        fgColor={"#052e16"}
                        level={"H"}
                        includeMargin={false}
                        imageSettings={{
                          src: "https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg",
                          x: undefined,
                          y: undefined,
                          height: 40,
                          width: 60,
                          excavate: true,
                        }}
                      />
                    </div>

                    <p className="text-sm text-gray-500 mt-6 font-medium">Use any supported scanner app</p>
                    <div className="w-full h-1 bg-gray-100 rounded-full mt-6 overflow-hidden">
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 300, ease: "linear" }}
                        className="h-full bg-lime-400"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Code expires in 5:00</p>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Secure Checkout Button Footer */}
          {activeTab !== "qr" && (
            <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
               <button
                  type="submit"
                  onClick={handlePayment}
                  className="px-10 py-4 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-500 text-gray-900 font-extrabold tracking-wide hover:from-lime-300 hover:to-emerald-400 hover:shadow-[0_0_30px_rgba(163,230,53,0.4)] transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto text-lg flex items-center justify-center gap-2"
                >
                  Pay ${plan.price} Securely
                  <ShieldCheck className="w-5 h-5" />
                </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
