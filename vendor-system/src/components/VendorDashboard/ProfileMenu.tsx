import { useState, useRef, useEffect } from "react";
import {LogOut,ChevronDown} from "lucide-react"
import { useNavigate } from "react-router-dom";
import PROFILE_MENU from "./ProfileMenueList";
interface ProfileMenuProps {
  onSelect: (key: string) => void;
  name?: String; // Optional or required string
  email?:String;
}

function ProfileMenu({onSelect,name,email}: ProfileMenuProps) 
{
  
  const navigate=useNavigate()
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const handleLogOut=()=>{
    localStorage.clear()
    navigate("/")
  }

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-[#F7F5FF] transition-colors"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF69B4] to-[#B388FF] flex items-center justify-center text-white font-extrabold text-sm">
          SC
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-extrabold text-[#5b4a8a] leading-tight">IceKing</p>
          <p className="text-xs text-[#8a7db0] leading-tight">{name}</p>
        </div>
        <ChevronDown size={16} className={`text-[#8a7db0] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-[#EDE7FA] p-3 z-50">
          <div className="px-3 py-2 border-b border-[#F3F0FF] mb-2">
            <p className="text-sm font-extrabold text-[#5b4a8a]">IceKing</p>
            <p className="text-xs text-[#8a7db0]">{email}</p>
          </div>

          {PROFILE_MENU.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                onSelect(item.key);
                setOpen(false);
              }}
              className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F7F5FF] transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-[#F3F0FF] flex items-center justify-center flex-shrink-0">
                <item.icon size={17} color="#B388FF" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#5b4a8a]">{item.label}</p>
                <p className="text-xs text-[#8a7db0]">{item.description}</p>
              </div>
            </button>
          ))}

          <div className="border-t border-[#F3F0FF] mt-2 pt-2">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#FFF0F0] transition-colors text-left" onClick={handleLogOut}>
              <div className="w-9 h-9 rounded-xl bg-[#FFF0F0] flex items-center justify-center flex-shrink-0">
                <LogOut size={17} color="#E4574A" />
              </div>
              <p className="text-sm font-bold text-[#E4574A]">Log Out</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default ProfileMenu