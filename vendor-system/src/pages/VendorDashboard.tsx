import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  Menu,
  X,
  Search,
  type LucideIcon,
} from "lucide-react";
import { Outlet } from "react-router-dom";
import api from "../api";

import type { NavKey } from "../components/VendorDashboard/NavKey";

import ProfileMenu from '../components/VendorDashboard/ProfileMenu' 

import Sidebar from "../components/VendorDashboard/Sidebar";
import MobileSidebar from "../components/VendorDashboard/MobileSidebar";

/* ============================================================
   IceKing — Vendor Dashboard (Web, React + TypeScript)
   Same candy theme, "business tool" tone as VendorLogin.
   Profile menu (top-right) surfaces: Add Members,
   Product Analytics, Inventory Management.
   ============================================================ */

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800;900&family=Nunito:wght@400;600;700;800&display=swap');
      .iceking-root { font-family: 'Nunito', sans-serif; }
      .iceking-heading { font-family: 'Poppins', sans-serif; }
      .dash-card { transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease; }
      .dash-card:hover { transform: translateY(-4px); box-shadow: 0 16px 32px -10px rgba(179,136,255,0.28); }
      .dash-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
      .dash-scrollbar::-webkit-scrollbar-thumb { background: #EDE7FA; border-radius: 8px; }
    `}</style>
  );
}
/* ================= Main dashboard ================= */
export default function VendorDashboard() {
  const [activeNav, setActiveNav] = useState<NavKey>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [name,setName]=useState<String>("");
  const [email,setEmail]=useState<String>("");
  useEffect(()=>{
    const fetchName=async()=>{
      const n=await api.get("store/name")
      
      setName(n.data);

    }
    const fetchEmail=async()=>{
      const e=await api.get("store/email")
      setEmail(e.data);

    }
    
  fetchName();
  fetchEmail();
  },[])

  const handleProfileSelect = (key: string) => {
    setActivePanel(key);
  };

  return (
    <div className="iceking-root h-screen w-full overflow-hidden bg-[#FBF9FF] flex">
      <GlobalStyles />

      {/* ---------- Sidebar (desktop) ---------- */}
      <aside className="hidden lg:flex lg:flex-col lg:h-screen w-64 shrink-0 bg-white border-r border-[#F0EAFB] px-5 py-6">
        <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
        
      </aside>

      {/* ---------- Sidebar (mobile drawer) ---------- */}
      {sidebarOpen && (
        <MobileSidebar activeNav={activeNav} setSidebarOpen={setSidebarOpen} setActiveNav={setActiveNav}/>
      )}

      {/* ---------- Main content ---------- */}
      <div className="flex-1 min-w-0 min-h-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#F0EAFB] px-5 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button className="lg:hidden text-[#5b4a8a]" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-[#F7F5FF] rounded-full px-4 h-10 flex-1 max-w-sm">
              <Search size={16} className="text-[#b7aed4]" />
              <input
                placeholder="Search orders, products..."
                className="bg-transparent outline-none text-sm text-[#5b4a8a] font-semibold placeholder:text-[#b7aed4] placeholder:font-normal w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button className="relative w-10 h-10 rounded-full bg-[#F7F5FF] flex items-center justify-center">
              <Bell size={18} className="text-[#5b4a8a]" />
              <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[#FF69B4]" />
            </button>
            <ProfileMenu onSelect={handleProfileSelect} name={name} email={email} />
          </div>
        </header>

        {/* Scrollable body */}
        <main className="flex-1 min-h-0 overflow-y-auto dash-scrollbar px-5 lg:px-8 py-6">
          <Outlet context={{activePanel,name,setActivePanel}}/>
          
        </main>
      </div>
    </div>
  );
}
