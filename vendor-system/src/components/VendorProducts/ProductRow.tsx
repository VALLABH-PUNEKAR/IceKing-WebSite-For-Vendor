import {Pencil,Trash2} from 'lucide-react'
import type{ Product } from "./Products";
function ProductRow({ product }: { product: Product }) {
  return (
    <tr className="border-t border-[#F3F0FF]">
      <td className="py-3 px-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F7F5FF] flex items-center justify-center text-lg flex-shrink-0">
            {product.image}
          </div>
          <span className="font-bold text-[#5b4a8a] text-sm">{product.name}</span>
        </div>
      </td>
      <td className="py-3 px-2 text-sm text-[#6b5f92]">{product.categoryName}</td>
      <td className="py-3 px-2 text-sm font-bold text-[#5b4a8a]">${product.price.toFixed(2)}</td>
      <td className="py-3 px-2 text-sm text-[#6b5f92]">{product.qty}</td>
      <td className="py-3 px-2">
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F7F5FF] text-[#5b4a8a] hover:bg-[#EDE7FA]">
            <Pencil size={13} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#FFF0F0] text-[#E4574A] hover:bg-[#FFE1E1]">
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
}
export default ProductRow