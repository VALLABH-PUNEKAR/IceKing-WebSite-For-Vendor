
import {
  ShoppingBag,

  Boxes,
 
  DollarSign,
  Star,
  ArrowUpRight,
  ArrowDownRight,

  type LucideIcon,
} from "lucide-react";
import PROFILE_MENU from "../components/VendorDashboard/ProfileMenueList";
import { useOutletContext } from "react-router-dom";
interface DashboardOutletContext{
    activePanel:string
    setActivePanel:React.Dispatch<React.SetStateAction<string | null>>
    name:string

}

type StatCard = {
  label: string;
  value: string;
  delta: string;
  up: boolean;
  icon: LucideIcon;
  color: string;
};

type OrderRow = {
  id: string;
  customer: string;
  item: string;
  amount: string;
  status: "Delivered" | "Preparing" | "Out for delivery";
};

type TopFlavor = {
  name: string;
  emoji: string;
  sold: number;
  revenue: string;
};
const STATS: StatCard[] = [
  { label: "Today's Revenue", value: "$1,284", delta: "+12.4%", up: true, icon: DollarSign, color: "#FF69B4" },
  { label: "Orders Today", value: "86", delta: "+5.1%", up: true, icon: ShoppingBag, color: "#6EC6FF" },
  { label: "Avg. Rating", value: "4.8", delta: "+0.2", up: true, icon: Star, color: "#FFD93D" },
  { label: "Low Stock Items", value: "3", delta: "-2", up: false, icon: Boxes, color: "#B388FF" },
];

const RECENT_ORDERS: OrderRow[] = [
  { id: "#IK-3021", customer: "Ava Thompson", item: "Rainbow Scoop x2", amount: "$11.00", status: "Delivered" },
  { id: "#IK-3022", customer: "Liam Carter", item: "Chocolate Blast x1", amount: "$5.00", status: "Preparing" },
  { id: "#IK-3023", customer: "Noah Kim", item: "Mango Magic x3", amount: "$15.60", status: "Out for delivery" },
  { id: "#IK-3024", customer: "Priya Patel", item: "Vanilla Dream x1", amount: "$4.50", status: "Delivered" },
  { id: "#IK-3025", customer: "Ethan Ross", item: "Blueberry Heaven x2", amount: "$9.80", status: "Preparing" },
];

const TOP_FLAVORS: TopFlavor[] = [
  { name: "Rainbow Scoop", emoji: "🌈", sold: 214, revenue: "$1,177" },
  { name: "Chocolate Blast", emoji: "🍫", sold: 189, revenue: "$945" },
  { name: "Strawberry Swirl", emoji: "🍓", sold: 162, revenue: "$777" },
  { name: "Vanilla Dream", emoji: "🍦", sold: 150, revenue: "$675" },
];

const statusStyles: Record<OrderRow["status"], string> = {
  Delivered: "bg-[#E8FAF0] text-[#2E9E5B]",
  Preparing: "bg-[#FFF6DE] text-[#B8860B]",
  "Out for delivery": "bg-[#E9F3FF] text-[#2E7BC7]",
};
function PDashboard(){

    const { activePanel, name, setActivePanel } = useOutletContext<DashboardOutletContext>();
    
    return(
        <div>
            <div className="mb-6">
            <h1 className="iceking-heading text-2xl font-black text-[#5b4a8a]">Welcome back {name} 👋</h1>
            <p className="text-[#8a7db0] text-sm mt-1">Here's how your store is doing today.</p>
          </div>

          {/* Quick action banner for the requested profile actions */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {PROFILE_MENU.map((item) => (
              <button
                key={item.key}
                onClick={() => setActivePanel(item.key)}
                className="dash-card text-left bg-white rounded-2xl p-4 border border-[#F0EAFB] flex items-center gap-3"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FF69B4] to-[#B388FF] flex items-center justify-center flex-shrink-0">
                  <item.icon size={19} color="white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-[#5b4a8a] truncate">{item.label}</p>
                  <p className="text-xs text-[#8a7db0] truncate">{item.description}</p>
                </div>
              </button>
            ))}
          </div>

          {activePanel && (
            <div className="mb-8 bg-white rounded-2xl border border-[#F0EAFB] p-5">
              <div className="flex items-center justify-between mb-1">
                <p className="iceking-heading font-extrabold text-[#5b4a8a]">
                  {PROFILE_MENU.find((p) => p.key === activePanel)?.label}
                </p>
                <button
                  onClick={() => setActivePanel(null)}
                  className="text-xs font-bold text-[#8a7db0] hover:text-[#FF69B4]"
                >
                  Close
                </button>
              </div>
              <p className="text-sm text-[#8a7db0]">
                This panel is a placeholder — wire it up to your{" "}
                {activePanel === "add-members" && "team invite form"}
                {activePanel === "product-analytics" && "analytics API"}
                {activePanel === "inventory-management" && "inventory/stock API"}.
              </p>
            </div>
          )}

          {/* Stat cards */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {STATS.map((s) => (
              <div key={s.label} className="dash-card bg-white rounded-2xl p-5 border border-[#F0EAFB]">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${s.color}1F` }}
                  >
                    <s.icon size={18} color={s.color} />
                  </div>
                  <span
                    className={`flex items-center gap-0.5 text-xs font-extrabold ${
                      s.up ? "text-[#2E9E5B]" : "text-[#E4574A]"
                    }`}
                  >
                    {s.up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                    {s.delta}
                  </span>
                </div>
                <p className="text-2xl font-black text-[#5b4a8a]">{s.value}</p>
                <p className="text-xs text-[#8a7db0] font-semibold mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Orders + top flavors */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent orders */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-[#F0EAFB] p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="iceking-heading font-extrabold text-[#5b4a8a]">Recent Orders</p>
                <button className="text-xs font-bold text-[#FF69B4]">View all</button>
              </div>
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm min-w-[480px]">
                  <thead>
                    <tr className="text-left text-[#8a7db0] text-xs uppercase">
                      <th className="font-bold py-2 px-2">Order</th>
                      <th className="font-bold py-2 px-2">Customer</th>
                      <th className="font-bold py-2 px-2">Item</th>
                      <th className="font-bold py-2 px-2">Amount</th>
                      <th className="font-bold py-2 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_ORDERS.map((o) => (
                      <tr key={o.id} className="border-t border-[#F3F0FF]">
                        <td className="py-3 px-2 font-bold text-[#5b4a8a]">{o.id}</td>
                        <td className="py-3 px-2 text-[#6b5f92]">{o.customer}</td>
                        <td className="py-3 px-2 text-[#6b5f92]">{o.item}</td>
                        <td className="py-3 px-2 font-bold text-[#5b4a8a]">{o.amount}</td>
                        <td className="py-3 px-2">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusStyles[o.status]}`}>
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top flavors */}
            <div className="bg-white rounded-2xl border border-[#F0EAFB] p-5">
              <p className="iceking-heading font-extrabold text-[#5b4a8a] mb-4">Top Flavors</p>
              <div className="space-y-3">
                {TOP_FLAVORS.map((f) => (
                  <div key={f.name} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F7F5FF] flex items-center justify-center text-xl flex-shrink-0">
                      {f.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#5b4a8a] truncate">{f.name}</p>
                      <p className="text-xs text-[#8a7db0]">{f.sold} sold</p>
                    </div>
                    <p className="text-sm font-extrabold text-[#FF69B4] flex-shrink-0">{f.revenue}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
    )

}
export default PDashboard