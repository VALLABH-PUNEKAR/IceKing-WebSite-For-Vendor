import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";

import {Link} from 'react-router-dom';
import type { Product } from "../components/VendorProducts/Products";
import ProductCard from "../components/VendorProducts/ProductCard";
import type { SpringPageResponse } from "../components/VendorProducts/SpringPageResponse";
import api from "../api";
import ProductRow from "../components/VendorProducts/ProductRow";

/* ============================================================
   IceKing — Vendor Products Page (Web, React + TypeScript)
   Same shell (sidebar + topbar) as VendorDashboard, "Products"
   active in the nav. Grid/list toggle, search, category and
   status filters, add/edit/delete actions.
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
/* ================= Product card (grid view) ================= */


/* ================= Product row (list view) ================= */


/* ================= Main page ================= */
export default function VendorProducts() {
 
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [product,setProducts]=useState<Product[]>([]);
  useEffect(()=>{
    const fetchProducts=async(page:number)=>{
      try {
      const response = await api.get<SpringPageResponse>("/products/all", {
        params: {
          page: page,
          size: 10, // Display 10 items per page
        },
      });

      setProducts(response.data.content);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.number);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }

    }
    fetchProducts(currentPage)

  },[currentPage])
  const totalProducts = product.length;
  const inStock = product.filter((p) => p.qty >50).length;
  const lowStock = product.filter((p) => p.qty<50).length;
  const outOfStock = product.filter((p) => p.qty === 0).length;

  return (
    <div className="iceking-root min-h-screen w-full bg-[#FBF9FF] flex">
      <GlobalStyles />
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto dash-scrollbar px-5 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="iceking-heading text-2xl font-black text-[#5b4a8a]">Your Products</h2>
              <p className="text-[#8a7db0] text-sm mt-1">Manage flavors, pricing, and availability.</p>
            </div>
            <Link to={"/dashboard/Addproducts"} className="flex items-center gap-2 bg-gradient-to-r from-[#FF69B4] to-[#B388FF] text-white font-extrabold text-sm px-5 py-2.5 rounded-full shadow-md">
              <Plus size={16} /> Add Product
            </Link>
          </div>

          {/* Summary stats */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Products", value: totalProducts, color: "#B388FF" },
              { label: "In Stock", value: inStock, color: "#2E9E5B" },
              { label: "Low Stock", value: lowStock, color: "#B8860B" },
              { label: "Out of Stock", value: outOfStock, color: "#E4574A" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-[#F0EAFB] p-4">
                <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs text-[#8a7db0] font-semibold mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filters bar */}
          <div className="bg-white rounded-2xl border border-[#F0EAFB] p-4 mb-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-[#F7F5FF] rounded-full px-4 h-10 flex-1 min-w-[180px]">
              <Search size={16} className="text-[#b7aed4]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent outline-none text-sm text-[#5b4a8a] font-semibold placeholder:text-[#b7aed4] placeholder:font-normal w-full"
              />
            </div>
            <button className="flex items-center gap-1.5 text-xs font-bold text-[#5b4a8a] bg-[#F7F5FF] px-3.5 h-10 rounded-full">
              <SlidersHorizontal size={14} /> More Filters
            </button>

            <div className="flex items-center gap-1 bg-[#F7F5FF] rounded-full p-1 ml-auto">
              <button
                onClick={() => setView("grid")}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${view === "grid" ? "bg-white shadow text-[#FF69B4]" : "text-[#8a7db0]"}`}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${view === "list" ? "bg-white shadow text-[#FF69B4]" : "text-[#8a7db0]"}`}
              >
                <ListIcon size={15} />
              </button>
            </div>
          </div>

          {/* Product grid / list */}
          {product.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#F0EAFB] p-12 text-center">
              <p className="text-4xl mb-3">🍦</p>
              <p className="font-bold text-[#5b4a8a]">No products match your filters</p>
              <p className="text-sm text-[#8a7db0] mt-1">Try a different search or category.</p>
            </div>
          ) : view === "grid" ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {product.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#F0EAFB] p-5 overflow-x-auto">
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr className="text-left text-[#8a7db0] text-xs uppercase">
                    <th className="font-bold py-2 px-2">Product</th>
                    <th className="font-bold py-2 px-2">Category</th>
                    <th className="font-bold py-2 px-2">Price</th>
                    <th className="font-bold py-2 px-2">Stock</th>
                    <th className="font-bold py-2 px-2">Status</th>
                    <th className="font-bold py-2 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {product.map((p) => (
                    <ProductRow key={p.id} product={p} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 bg-[#F7F5FF] text-[#5b4a8a] font-bold rounded-xl disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm font-bold text-[#8a7db0]">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages - 1}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 bg-[#FF69B4] text-white font-bold rounded-xl disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
