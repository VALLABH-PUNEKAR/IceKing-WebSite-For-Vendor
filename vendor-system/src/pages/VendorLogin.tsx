import React, { useEffect, useState } from "react";
import { useNavigate} from 'react-router-dom';
import axios from "axios";
import api from "../api";
import {
  Store,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  TrendingUp,
  Package,
  Wallet,
  ShieldCheck,
  BadgeCheck,
  type LucideIcon,
} from "lucide-react";

/* ============================================================
   IceKing — Vendor / Partner Login (Web, React + TypeScript)
   Same candy theme as the customer landing page, reframed for
   business partners: calmer, more "dashboard" trust signals,
   split hero + form layout.
   ============================================================ */

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800;900&family=Nunito:wght@400;600;700;800&display=swap');
      .iceking-root { font-family: 'Nunito', sans-serif; }
      .iceking-heading { font-family: 'Poppins', sans-serif; }

      @keyframes vendor-float {
        0% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-14px) rotate(4deg); }
        100% { transform: translateY(0px) rotate(0deg); }
      }
      @keyframes vendor-bg-pan {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .vendor-bg-animate { background-size: 200% 200%; animation: vendor-bg-pan 14s ease infinite; }
      .vendor-float { animation: vendor-float 5s ease-in-out infinite; }
      .vendor-input:focus-within {
        border-color: #B388FF;
        box-shadow: 0 0 0 4px rgba(179,136,255,0.15);
      }
      .vendor-btn { transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease; }
      .vendor-btn:hover { transform: scale(1.03); }
    `}</style>
  );
}


type Perk = {
  icon: LucideIcon;
  label: string;
};

const perks: Perk[] = [
  { icon: TrendingUp, label: "Track sales & payouts in real time" },
  { icon: Package, label: "Manage flavors, stock & orders in one place" },
  { icon: Wallet, label: "Get paid weekly, straight to your bank" },
  { icon: ShieldCheck, label: "Secure, verified partner network" },
];

export default function VendorLogin() {
  const navigate=useNavigate()
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [remember, setRemember] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [message,setMessage]=useState<string>("");
  const [res,setRes]=useState<boolean>(false);

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
     try{
            const request=await api.post('auth/login',{ email, password })
            const {token,role}=request.data

           
            if(token &&( role=="OWNER" || role=="STAFF") ){
                localStorage.setItem("userToken",token)
                localStorage.setItem("role",role)
                setRes(true)
                setMessage("Login SuccessFull")
                
                navigate('/dashboard')
                
            }
            else if(role=="CUSTOMER"){
              setRes(true)
              setMessage("You are Not Authorize to Access")
            }
            else{
                setRes(true)
                const {message}=request.data;
                setMessage(message)
            
            }
        }
        catch(err){
            console.log("Server error",err)
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                setRes(true);
                setMessage("Invalid Username or Password");
            } else {
            
                setRes(true);
                setMessage("Something went wrong. Please try again later.");
            }
        }
    setSubmitting(true);
    // Hook this up to your vendor auth API.
    setTimeout(() => setSubmitting(false), 1200);
  };

  return (
    <div className="iceking-root min-h-screen w-full bg-[#F7kF5FF] flex">
      <GlobalStyles />

      {/* ---------- Left: brand / value panel ---------- */}
      <div className="vendor-bg-animate hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#B388FF] via-[#FF69B4] to-[#6EC6FF] flex-col justify-between p-12 xl:p-16">
        <span className="vendor-float absolute top-16 left-16 text-4xl opacity-90">🍦</span>
        <span className="vendor-float absolute top-1/3 right-16 text-3xl opacity-80" style={{ animationDelay: "0.6s" }}>🍭</span>
        <span className="vendor-float absolute bottom-1/3 left-24 text-2xl opacity-80" style={{ animationDelay: "1.1s" }}>✨</span>
        <span className="vendor-float absolute bottom-24 right-24 text-3xl opacity-80" style={{ animationDelay: "0.3s" }}>🍧</span>

        <div className="relative z-10">
          <div className="iceking-heading flex items-center gap-2 text-3xl font-extrabold text-white">
            <span>🍦</span> IceKing <span className="text-base font-bold text-white/80 ml-1">Partners</span>
          </div>

          <h1 className="iceking-heading text-3xl xl:text-4xl font-black text-white mt-16 leading-tight max-w-md">
            Grow your ice cream business with IceKing
          </h1>
          <p className="text-white/85 mt-4 max-w-sm text-base">
            Join hundreds of local shops and trucks reaching families every day on IceKing.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          {perks.map((p) => (
            <div key={p.label} className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <p.icon size={20} color="white" strokeWidth={2.4} />
              </div>
              <span className="text-white font-bold text-sm">{p.label}</span>
            </div>
          ))}
        </div>

        <div className="relative z-10 flex items-center gap-2 text-white/75 text-xs font-semibold">
          <BadgeCheck size={16} /> Trusted by 500+ verified vendors
        </div>
      </div>

      {/* ---------- Right: login form ---------- */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          {/* Mobile-only logo */}
          <div className="iceking-heading flex lg:hidden items-center gap-2 text-2xl font-extrabold text-[#FF69B4] mb-8 justify-center">
            🍦 IceKing <span className="text-sm font-bold text-[#8a7db0] ml-1">Partners</span>
          </div>

          <div className="mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF69B4] to-[#B388FF] flex items-center justify-center mb-5 shadow-lg shadow-[#B388FF]/30">
              <Store size={26} color="white" strokeWidth={2.2} />
            </div>
            <h2 className="iceking-heading text-2xl sm:text-3xl font-black text-[#5b4a8a]">
              Vendor Login
            </h2>
            <p className="text-[#8a7db0] mt-2 text-sm">
              Sign in to manage your store, orders, and flavors.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Business ID / Email */}
            <div>
              <label className="block text-xs font-extrabold text-[#5b4a8a] mb-1.5 uppercase tracking-wide">
                Business Email or Vendor ID
              </label>
              <div className="vendor-input flex items-center gap-3 bg-white border-2 border-[#EDE7FA] rounded-2xl px-4 h-13 py-3.5 transition-all duration-200">
                <Mail size={18} className="text-[#B388FF] flex-shrink-0" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="vendor@yourshop.com"
                  className="w-full bg-transparent outline-none text-[#5b4a8a] font-semibold placeholder:text-[#b7aed4] placeholder:font-normal text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-extrabold text-[#5b4a8a] mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="vendor-input flex items-center gap-3 bg-white border-2 border-[#EDE7FA] rounded-2xl px-4 h-13 py-3.5 transition-all duration-200">
                <Lock size={18} className="text-[#B388FF] flex-shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-transparent outline-none text-[#5b4a8a] font-semibold placeholder:text-[#b7aed4] placeholder:font-normal text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="flex-shrink-0 text-[#b7aed4] hover:text-[#8a7db0]"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {
            res&&<div className="flex justify-center bg-green-200 font-bold text-blue-500 rounded-lg">
            <label>{message}</label>
            </div>
            }

            {/* Remember / forgot */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-sm text-[#6b5f92] font-semibold cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#FF69B4]"
                />
                Keep me signed in
              </label>
              <a href="#" className="text-sm font-bold text-[#FF69B4] hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="vendor-btn w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF69B4] to-[#B388FF] text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-[#B388FF]/30 disabled:opacity-70 mt-2"
            >
              {submitting ? "Signing in..." : "Sign In to Dashboard"}
              {!submitting && <ArrowRight size={18} />}
            </button>
          </form>
          <p className="text-center text-xs text-[#b7aed4] mt-8">
            Need help?{" "}
            <a href="#" className="font-bold text-[#8a7db0] hover:text-[#FF69B4]">
              Contact vendor support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
