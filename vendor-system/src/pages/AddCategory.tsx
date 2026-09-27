import React, { useState } from "react";
import {
  Tag,
  Link2,
  AlignLeft,
  FolderTree,
  Check,
  RefreshCw,
} from "lucide-react";
import { useLocation,useNavigate} from "react-router-dom";
import api from "../api";

/* ============================================================
   IceKing — Add New Category Page (Web, React + TypeScript)
   Fields map directly to the `categories` table schema:

     name         varchar(100)  NOT NULL  UNIQUE
     slug         varchar(120)  NOT NULL  UNIQUE
     description  text          NULL
    emoji        varchar(10)   NULL
     parent_id    int           NULL      (FK -> categories.id)
     is_active    tinyint(1)    NULL      default 1

   Same shell (sidebar + topbar) as the other vendor pages.
   ============================================================ */

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

/* ---------------- Types ---------------- */


// Mirrors the `categories` table row shape used for the parent_id dropdown.


type CategoryForm = {
  name: string;
  slug: string;
  description: string;
  image_url: string;
  parent_category: string; // "" means no parent (root category)
  isActive: boolean;
};

const EMOJI_OPTIONS = [
  "🥐",
  "🥤",
  "🍫",
  "🎂",
  "🍰",
  "☕",
  "🍮",
  "🧁",
  "👨‍👩‍👧‍👦",
  "🍦",
  "🧊",
  "🧃",
  "🍧",
  "🎉",
  "🍹",
  "🍨",
];

/* ---------------- Slug helper ---------------- */
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
type AddCategoryProps = {
  onCancel?: () => void;
  onSave?: (category: CategoryForm) => void;
};
interface CategoryState{
  id:number|string
  name:string
}
export default function AddCategory({ onCancel, onSave }: AddCategoryProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CategoryForm, string>>>({});
  const clocation=useLocation()
  const category=(clocation.state as CategoryState[])||[];
  const navigate=useNavigate()

  const [form, setForm] = useState<CategoryForm>({
    name: "",
    slug: "",
    description: "",
    image_url: "🍦",
    parent_category: "",
    isActive: true,
  });

  const update = <K extends keyof CategoryForm>(key: K, value: CategoryForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNameChange = (value: string) => {
    update("name", value);
    // Auto-generate the slug from the name (varchar(120), NOT NULL, UNIQUE)
    // unless the vendor has manually edited the slug field themselves.
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

  const validate = (): boolean => {
    const next: Partial<Record<keyof CategoryForm, string>> = {};
    if (!form.name.trim()) next.name = "Name is required.";
    else if (form.name.length > 100) next.name = "Name must be 100 characters or fewer.";
    if (!form.slug.trim()) next.slug = "Slug is required.";
    else if (form.slug.length > 120) next.slug = "Slug must be 120 characters or fewer.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    // Hook this up to POST /categories.
    const res = await api.post("/store/cat", form);
    console.log(res.data);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      onSave?.(form);
      navigate("/dashboard/Addproducts")
      setTimeout(() => setSaved(false), 2500);
    }, 900);
  };

  return (
    <div className="iceking-root min-h-screen w-full bg-[#FBF9FF] flex">
      <GlobalStyles />
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto dash-scrollbar px-5 lg:px-8 py-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h1 className="iceking-heading text-2xl font-black text-[#5b4a8a]">Add New Category</h1>
              <p className="text-[#8a7db0] text-sm mt-1">
                Organize your flavors into categories customers can browse.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Preview thumbnail */}
              <div className="bg-white rounded-2xl border border-[#F0EAFB] p-5 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#F7F5FF] flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <span className="text-4xl">{form.image_url}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-[#5b4a8a] truncate">
                    {form.name || "Category name"}
                  </p>
                  <p className="text-xs text-[#8a7db0] truncate">
                    /{form.slug || "category-slug"}
                  </p>
                </div>
                <span
                  className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
                    form.isActive ? "bg-[#E8FAF0] text-[#2E9E5B]" : "bg-[#F3F0FF] text-[#8a7db0]"
                  }`}
                >
                  {form.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="bg-white rounded-2xl border border-[#F0EAFB] p-5 space-y-4">
                {/* name — varchar(100) NOT NULL UNIQUE */}
                <Field label="Category Name" required hint="Must be unique. Max 100 characters.">
                  <div
                    className={`field-input bg-[#F7F5FF] border-2 rounded-2xl px-4 h-12 flex items-center gap-2.5 transition-all ${
                      errors.name ? "border-[#FFB4B4]" : "border-transparent"
                    }`}
                  >
                    <Tag size={16} className="text-[#B388FF] flex-shrink-0" />
                    <input
                      required
                      maxLength={100}
                      value={form.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g. Popsicles"
                      className="w-full bg-transparent outline-none text-sm font-semibold text-[#5b4a8a] placeholder:text-[#b7aed4] placeholder:font-normal"
                    />
                  </div>
                  {errors.name && <p className="text-xs text-[#E4574A] mt-1.5">{errors.name}</p>}
                </Field>

                {/* slug — varchar(120) NOT NULL UNIQUE */}
                <Field label="Slug" required hint="Used in the category URL. Auto-generated from the name, but you can edit it. Max 120 characters.">
                  <div
                    className={`field-input bg-[#F7F5FF] border-2 rounded-2xl px-4 h-12 flex items-center gap-2.5 transition-all ${
                      errors.slug ? "border-[#FFB4B4]" : "border-transparent"
                    }`}
                  >
                    <Link2 size={16} className="text-[#B388FF] flex-shrink-0" />
                    <span className="text-[#b7aed4] text-sm font-semibold flex-shrink-0">/</span>
                    <input
                      required
                      maxLength={120}
                      value={form.slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      placeholder="popsicles"
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
                  {errors.slug && <p className="text-xs text-[#E4574A] mt-1.5">{errors.slug}</p>}
                </Field>

                {/* description — text, nullable */}
                <Field label="Description" hint="Optional. Shown on the category page.">
                  <div className="field-input bg-[#F7F5FF] border-2 border-transparent rounded-2xl px-4 py-3 flex items-start gap-2.5 transition-all">
                    <AlignLeft size={16} className="text-[#B388FF] flex-shrink-0 mt-0.5" />
                    <textarea
                      value={form.description}
                      onChange={(e) => update("description", e.target.value)}
                      placeholder="Cool off with our frozen-on-a-stick treats..."
                      rows={3}
                      className="w-full bg-transparent outline-none text-sm font-semibold text-[#5b4a8a] placeholder:text-[#b7aed4] placeholder:font-normal resize-none"
                    />
                  </div>
                </Field>

                {/* emoji — category icon */}
                <Field label="Category Icon" hint="Choose an icon to represent this category.">
                  <div className="grid grid-cols-10 gap-2 max-w-sm">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        type="button"
                        key={emoji}
                        onClick={() => update("image_url", emoji)}
                        className={`aspect-square rounded-xl flex items-center justify-center text-xl border-2 transition-colors ${
                          form.image_url === emoji ? "border-[#FF69B4] bg-[#FFE1EC]" : "border-transparent bg-[#F7F5FF]"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </Field>

                {/* parent_id — int, nullable, FK */}
                <Field label="Parent Category" hint="Optional. Leave as “None” to make this a top-level category.">
                  <div className="field-input bg-[#F7F5FF] border-2 border-transparent rounded-2xl px-4 h-12 flex items-center gap-2.5 transition-all">
                    <FolderTree size={16} className="text-[#B388FF] flex-shrink-0" />
                    <select
                      value={form.parent_category}
                      onChange={(e) => update("parent_category", e.target.value)}
                      className="w-full appearance-none bg-transparent outline-none text-sm font-semibold text-[#5b4a8a] cursor-pointer"
                    >
                      <option value="">None (top-level category)</option>
                      {category.map((c) => (
                        <option value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </Field>

                {/* is_active — tinyint(1), default 1 */}
                <div className="flex items-center justify-between bg-[#F7F5FF] rounded-2xl px-4 py-3.5">
                  <div>
                    <p className="text-sm font-extrabold text-[#5b4a8a]">Active</p>
                    <p className="text-xs text-[#8a7db0] mt-0.5">Visible to customers when turned on</p>
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
                  disabled={saving}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#FF69B4] to-[#B388FF] text-white font-extrabold text-sm px-6 py-3 rounded-full shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : saved ? (
                    <>
                      <Check size={16} /> Saved!
                    </>
                  ) : (
                    "Save Category"
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
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
