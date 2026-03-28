import { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LockScreen = () => {
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate()
  // Handle showing the mock redirection feedback
  const handleLogin = () => {
    setShowToast(true);
    // In a real application, you would trigger your auth redirect logic here
    
  };

  // Auto-hide the toast notification
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false)
        navigate("/signin/volunteer")
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showToast, navigate]);

  return (
    <div className="min-h-screen bg-gray-700 text-black flex items-center justify-center p-4 font-sans selection:bg-red-500/30">
      {/* Main Container */}
      <div className="max-w-md w-full relative">
        
        {/* Glassmorphism Card */}
        <div className="relative overflow-hidden bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl">
          
          {/* Animated Icon Section */}
          <div className="mb-10 flex justify-center">
            <div className="relative">
              {/* Outer Pulse Rings */}
              <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping opacity-25" />
              <div className="absolute inset-0 rounded-full bg-red-500/10 animate-pulse scale-150" />
              
              {/* Icon Inner Circle */}
              <div className="relative flex items-center justify-center w-24 h-24 bg-red-500/10 rounded-full border border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.1)]">
                <Lock 
                  size={44} 
                  className="text-red-500 animate-[lock-shake_0.6s_ease-in-out_infinite_alternate] origin-bottom" 
                />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-4 mb-10">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Access Restricted
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Please sign in to verify your identity and access your dashboard
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button 
              onClick={handleLogin}
              className="w-full bg-white text-black font-bold py-4 px-8 rounded-2xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_10px_20px_rgba(255,255,255,0.05)]"
            >
              Sign In to Continue
            </button>
            
          </div>
        </div>

        {/* Status Notification Toast */}
        <div 
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-4 bg-white/[0.05] backdrop-blur-2xl border border-red-500/30 rounded-2xl shadow-2xl transition-all duration-500 ${
            showToast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-semibold tracking-wide">Redirecting to secure login...</span>
        </div>

      </div>
    </div>
  );
};

export default LockScreen;