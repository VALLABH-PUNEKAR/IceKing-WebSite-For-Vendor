
import {Link} from 'react-router-dom'
import NAV_ITEMS from './NavItems';
import type { NavKey } from './NavKey';

interface NavProps {
  activeNav: String;
  setActiveNav:React.Dispatch<React.SetStateAction<NavKey>>; // Optional or required string
  
}
function Sidebar({activeNav,setActiveNav}:NavProps){
    return(
        <div>
        <div className="iceking-heading flex items-center gap-2 text-2xl font-extrabold text-[#FF69B4] px-2 mb-8">
          🍦 IceKing 
        </div>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = item.key === activeNav;
            return (
              <Link
                key={item.key}
                
                to={item.path}
                onClick={() => setActiveNav(item.key)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                  active
                    ? "bg-gradient-to-r from-[#FF69B4] to-[#B388FF] text-white shadow-md"
                    : "text-[#6b5f92] hover:bg-[#F7F5FF]"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="bg-[#F7F5FF] rounded-2xl p-4 text-center">
          <p className="text-2xl mb-1">🍨</p>
          <p className="text-xs font-bold text-[#5b4a8a]">Need help selling more?</p>
          <button className="mt-2 text-xs font-extrabold text-white bg-gradient-to-r from-[#FF69B4] to-[#B388FF] px-4 py-2 rounded-full">
            View Growth Tips
          </button>
        </div>
        </div>

    )

}
export default Sidebar