import {Pencil,Star,Trash2} from "lucide-react"
import type { Product } from "./Products";
type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";
const STATUSES: (StockStatus | "All")[] = ["All", "In Stock", "Low Stock", "Out of Stock"];
const statusStyles: Record<StockStatus, string> = {
  "In Stock": "bg-[#E8FAF0] text-[#2E9E5B]",
  "Low Stock": "bg-[#FFF6DE] text-[#B8860B]",
  "Out of Stock": "bg-[#FFF0F0] text-[#E4574A]",
};
function ProductCard({ product }: { product: Product }) {
  return (
    <div className="dash-card bg-white rounded-2xl border border-[#F0EAFB] overflow-hidden">
      <div className="relative h-28 flex items-center justify-center bg-[#F7F5FF]">
        <img src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"/>
        <span
          className={`absolute top-2.5 right-2.5 text-[10px] font-extrabold px-2 py-1 rounded-full ${[product.name]}`}
        >
          {product.name}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-[#5b4a8a] truncate">{product.name}</p>
            <p className="text-xs text-[#8a7db0]">{product.categoryName}</p>
          </div>
          <p className="text-sm font-black text-[#FF69B4] flex-shrink-0">₹{product.price.toFixed(2)}</p>
        </div>

        <div className="flex items-center justify-between mt-3 text-xs text-[#8a7db0]">
          <span className="flex items-center gap-1">
            <Star size={12} color="#FFD93D" fill="#FFD93D" /> {product.isActive}
          </span>
          
          <span>{product.qty} in stock</span>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-[#5b4a8a] bg-[#F7F5FF] py-2 rounded-xl hover:bg-[#EDE7FA]">
            <Pencil size={13} /> Edit
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#FFF0F0] text-[#E4574A] hover:bg-[#FFE1E1]">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProductCard