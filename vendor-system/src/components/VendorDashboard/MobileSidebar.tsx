import NAV_ITEMS from "./NavItems";
import type { NavKey } from "./NavKey";
import {
 
  X,
 
  type LucideIcon,
} from "lucide-react";
interface MProp{
    activeNav:string
    setSidebarOpen:React.Dispatch<React.SetStateAction<boolean>>
    setActiveNav:React.Dispatch<React.SetStateAction<NavKey>>
}
function MobileSidebar({activeNav,setSidebarOpen,setActiveNav}:MProp){
    return(
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white px-5 py-6 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="iceking-heading flex items-center gap-2 text-xl font-extrabold text-[#FF69B4]">
                🍦 IceKing
              </div>
              <button onClick={() => setSidebarOpen(false)}>
                <X size={22} className="text-[#8a7db0]" />
              </button>
            </div>
            <nav className="flex-1 space-y-1">
              {NAV_ITEMS.map((item) => {
                const active = item.key === activeNav;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActiveNav(item.key);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                      active
                        ? "bg-gradient-to-r from-[#FF69B4] to-[#B388FF] text-white shadow-md"
                        : "text-[#6b5f92] hover:bg-[#F7F5FF]"
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>
    )
}
export default MobileSidebar