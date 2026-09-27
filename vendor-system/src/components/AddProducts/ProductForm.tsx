export type ProductForm = {
  name: string;
  slug: string;
  categoryId: number;
  image: File | null;
  price: string;
  discountPrice: string;
  stockQuantity: string;
  description: string;
  isActive: boolean;
};