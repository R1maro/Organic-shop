export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount: number;
  final_price: number;
  quantity: number;
  sku: string;
  status: number;
  category_id: number;
  formatted_price: string;
  formatted_final_price: string;
  image_url: string;
  category: {
    id: number;
    name: string;
  };
}
export interface ProductsResponse {
  data: Product[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}
interface Category {
  id: number;
  name: string;
}

export interface ProductFormProps {
  categories: Category[];
  action: (formData: FormData) => Promise<void>;
  initialData?: {
    name?: string;
    description?: string;
    price?: number;
    discount?: number;
    quantity?: number;
    sku?: string;
    category_id?: number;
    status?: boolean;
    image_url?: string;
  };
}