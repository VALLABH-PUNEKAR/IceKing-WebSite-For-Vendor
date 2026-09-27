import React, { useEffect, useState } from "react";
import {
  AlignLeft,
  Check,
  Image as ImageIcon,
  Link2,
  Plus,
  RefreshCw,
} from "lucide-react";
import {Link} from "react-router-dom";
import api from "../api";
import type { ProductForm } from "../components/AddProducts/ProductForm";
import { handleUpload } from "../components/AddProducts/SecureImageUpload";



function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800;900&family=Nunito:wght@400;600;700;800&display=swap');
      .iceking-root { font-family: 'Nunito', sans-serif; }
      .iceking-heading { font-family: 'Poppins', sans-serif; }
      .dash-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
      .dash-scrollbar::-webkit-scrollbar-thumb { background: #EDE7FA; border-radius: 8px; }
      .field-input:focus-within {
        border-color: #B388FF;
        box-shadow: 0 0 0 4px rgba(179,136,255,0.15);
      }
    `}</style>
  );
}
function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

/* ---------------- Small field wrapper ---------------- */
function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-extrabold text-[#5b4a8a] mb-1.5 uppercase tracking-wide">
        {label} {required && <span className="text-[#FF69B4]">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-[#b7aed4] mt-1.5">{hint}</p>}
    </div>
  );
}

/* ================= Main page ================= */
type AddProductProps = {
  onCancel?: () => void;
  onSave?: (product: ProductForm) => void;
};
interface CATEGORIES{
  id:number|string
  name:string

}
export default function AddProduct({ onCancel, onSave }: AddProductProps) {
  const [category,setCategory]=useState<CATEGORIES[]>([])
  useEffect(()=>{
    const fetchCategory=async()=>{
      const res=await api.get("/store/cat")
        setCategory(res.data)
    }
    fetchCategory()
  },[])
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const [form, setForm] = useState<ProductForm>({
    name: "",
    slug: "",
    categoryId: 0,
    image: null,
    price: "",
    discountPrice: "",
    stockQuantity: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    if (!form.image) {
      setImagePreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(form.image);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [form.image]);

  const update = <K extends keyof ProductForm>(key: K, value: ProductForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNameChange = (value: string) => {
    update("name", value);
    if (!slugTouched) {
      update("slug", slugify(value));
    }
  };

  const handleSlugChange = (value: string) => {
    setSlugTouched(true);
    update("slug", slugify(value));
  };

  const regenerateSlug = () => {
    setSlugTouched(false);
    update("slug", slugify(form.name));
  };

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    // Hook this up to your create-product API.
    let imagePath="";

    // 1. Upload image to Supabase if a File is selected
    if (form.image && form.image instanceof File) {
      // Pass form and setForm, handleUpload updates form.image to the filePath string
      imagePath = await handleUpload({ form, setForm }); 
    } else if (typeof form.image === "string") {
      imagePath = form.image;
    }

    // 2. Prepare the payload with the stored image path string
    const payload = {
      ...form,
      image: imagePath,
    };

    // 3. Send product data to Spring Boot API
    const response = await api.post("/store/product", payload);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      onSave?.(form);
      setTimeout(() => setSaved(false), 2500);
    }, 900);
  };

  const isValid =
    form.name.trim().length > 0 &&
    form.slug.trim().length > 0 &&
    form.price.trim().length > 0 &&
    form.stockQuantity.trim().length > 0;

  return (
    <div className="iceking-root min-h-screen w-full bg-[#FBF9FF] flex">
      <GlobalStyles />
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto dash-scrollbar px-5 lg:px-8 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="iceking-heading text-2xl font-black text-[#5b4a8a]">Add New Product</h1>
              <p className="text-[#8a7db0] text-sm mt-1">Add a new flavor to your storefront.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-[#F0EAFB] p-5 space-y-4">
                  <Field label="Product Name" required>
                    <div className="field-input bg-[#F7F5FF] border-2 border-transparent rounded-2xl px-4 h-12 flex items-center transition-all">
                      <input
                        required
                        value={form.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="e.g. Cotton Candy Swirl"
                        className="w-full bg-transparent outline-none text-sm font-semibold text-[#5b4a8a] placeholder:text-[#b7aed4] placeholder:font-normal"
                      />
                    </div>
                  </Field>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Category">
                      <select
                        value={form.categoryId}
                        onChange={(e) => update("categoryId", Number(e.target.value))}
                        className="w-full appearance-none bg-[#F7F5FF] border-2 border-transparent rounded-2xl px-4 h-12 text-sm font-semibold text-[#5b4a8a] outline-none cursor-pointer"
                      >
                        <option value="">None </option>
                        {category.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      <Link
                        to={"/dashboard/Addcategory"}
                        state={category}
                        type="button"
                        className="flex items-center gap-1.5 text-xs font-extrabold text-[#FF69B4] mt-2"
                      >
                        <Plus size={14} /> Add New Category
                      </Link>
                    </Field>

                    <Field label="Product Image" hint="Upload a JPG, PNG, or WEBP image.">
                      <label
                        htmlFor="product-image"
                        className="field-input bg-[#F7F5FF] border-2 border-transparent rounded-2xl px-3 h-12 flex items-center gap-3 transition-all cursor-pointer"
                      >
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Product preview"
                            className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <ImageIcon size={18} className="text-[#B388FF] flex-shrink-0" />
                        )}
                        <span className="text-sm font-semibold text-[#8a7db0] truncate">
                          {form.image?.name || "Choose an image"}
                        </span>
                        <input
                          id="product-image"
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(e) => update("image", e.target.files?.[0] ?? null)}
                          className="sr-only"
                        />
                      </label>
                    </Field>

                    <Field label="Price (INR)" required>
                      <div className="field-input bg-[#F7F5FF] border-2 border-transparent rounded-2xl px-4 h-12 flex items-center gap-1 transition-all">
                        <span className="text-[#8a7db0] font-bold text-sm">₹</span>
                        <input
                          required
                          type="number"
                          step="0.01"
                          min="0"
                          value={form.price}
                          onChange={(e) => update("price", e.target.value)}
                          placeholder="4.50"
                          className="w-full bg-transparent outline-none text-sm font-semibold text-[#5b4a8a] placeholder:text-[#b7aed4] placeholder:font-normal"
                        />
                      </div>
                    </Field>

                    <Field label="Discount Price (INR)">
                      <div className="field-input bg-[#F7F5FF] border-2 border-transparent rounded-2xl px-4 h-12 flex items-center gap-1 transition-all">
                        <span className="text-[#8a7db0] font-bold text-sm">₹</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={form.discountPrice}
                          onChange={(e) => update("discountPrice", e.target.value)}
                          placeholder="3.50"
                          className="w-full bg-transparent outline-none text-sm font-semibold text-[#5b4a8a] placeholder:text-[#b7aed4] placeholder:font-normal"
                        />
                      </div>
                    </Field>

                    <Field label="Stock Quantity" hint="You can adjust this later from Inventory Management">
                      <div className="field-input bg-[#F7F5FF] border-2 border-transparent rounded-2xl px-4 h-12 flex items-center transition-all">
                        <input
                          required
                          type="number"
                          min="0"
                          value={form.stockQuantity}
                          onChange={(e) => update("stockQuantity", e.target.value)}
                          placeholder="100"
                          className="w-full bg-transparent outline-none text-sm font-semibold text-[#5b4a8a] placeholder:text-[#b7aed4] placeholder:font-normal"
                        />
                      </div>
                    </Field>
                  </div>

                  <Field label="Slug" required hint="Used in the product URL. Auto-generated from the name, but you can edit it. Max 120 characters.">
                    <div className="field-input bg-[#F7F5FF] border-2 border-transparent rounded-2xl px-4 h-12 flex items-center gap-2.5 transition-all">
                      <Link2 size={16} className="text-[#B388FF] flex-shrink-0" />
                      <span className="text-[#b7aed4] text-sm font-semibold flex-shrink-0">/</span>
                      <input
                        required
                        maxLength={120}
                        value={form.slug}
                        onChange={(e) => handleSlugChange(e.target.value)}
                        placeholder="cotton-candy-swirl"
                        className="w-full bg-transparent outline-none text-sm font-semibold text-[#5b4a8a] placeholder:text-[#b7aed4] placeholder:font-normal"
                      />
                      <button
                        type="button"
                        onClick={regenerateSlug}
                        className="flex-shrink-0 text-[#8a7db0] hover:text-[#B388FF]"
                        title="Regenerate from name"
                      >
                        <RefreshCw size={14} />
                      </button>
                    </div>
                  </Field>

                  <Field label="Description" hint="Tell customers what makes this flavor special">
                    <div className="field-input bg-[#F7F5FF] border-2 border-transparent rounded-2xl px-4 py-3 flex items-start gap-2.5 transition-all">
                      <AlignLeft size={16} className="text-[#B388FF] flex-shrink-0 mt-0.5" />
                      <textarea
                        value={form.description}
                        onChange={(e) => update("description", e.target.value)}
                        placeholder="Creamy vanilla base swirled with rainbow sprinkles and a hint of..."
                        rows={4}
                        className="w-full bg-transparent outline-none text-sm font-semibold text-[#5b4a8a] placeholder:text-[#b7aed4] placeholder:font-normal resize-none"
                      />
                    </div>
                  </Field>

                  <div className="flex items-center justify-between bg-[#F7F5FF] rounded-2xl px-4 py-3.5">
                    <div>
                      <p className="text-sm font-extrabold text-[#5b4a8a]">Available for sale</p>
                      <p className="text-xs text-[#8a7db0] mt-0.5">Show this product to customers</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => update("isActive", !form.isActive)}
                      className={`w-12 h-7 rounded-full flex items-center px-1 transition-colors flex-shrink-0 ${
                        form.isActive ? "bg-[#7EE8A6] justify-end" : "bg-[#EDE7FA] justify-start"
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-white shadow" />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={!isValid || saving}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#FF69B4] to-[#B388FF] text-white font-extrabold text-sm px-6 py-3 rounded-full shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? "Saving..." : saved ? (
                      <>
                        <Check size={16} /> Saved!
                      </>
                    ) : (
                      "Save Product"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={onCancel}
                    className="text-sm font-bold text-[#8a7db0] hover:text-[#5b4a8a] px-4 py-3"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
