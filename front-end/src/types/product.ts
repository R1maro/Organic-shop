export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount: number;
  final_price: number;
  quantity: number;
  shipping_time: string;
  status: number;
  category_id: number;
  formatted_price: string;
  formatted_final_price: string;
  image_urls: string;
  display_photo_url: string;
  display_photo_index: number;
  full_image_url: string | null;
  category: {
    id: number;
    name: string;
  };
  in_wishlist?: boolean;
}

export interface ProductApiData {
  name: string;
  description: string;
  price: number;
  discount: number;
  quantity: number;
  shipping_time: string;
  category_id: number;
  status: number;
  images?: File[];
  display_photo_index: number;
}

export interface ProductFormData {
  id?: number;
  name: string;
  description: string;
  price: number;
  discount: number;
  quantity: number;
  shipping_time: string;
  category_id: number;
  status: boolean;
  image_urls?: string;
  display_photo_index?: number;
}
export interface ProductCreateUpdateData {
  name: string | null;
  description: string | null;
  price: number;
  discount: number;
  quantity: number;
  shipping_time: string | null;
  category_id: number;
  status: number;
  images?: File[];
}

interface Category {
  id: number;
  name: string;
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

export interface SingleProductResponse{
  data:Product;
}
interface Category {
  id: number;
  name: string;
}

export type FormAction = (formData: FormData) => Promise<void>;
export interface ProductFormProps {
  categories: Category[];
  action: FormAction;
  initialData?: ProductFormData;
}
export interface ProductImage {
  id: number;
  url: string;
  thumb: string;
}

export interface ProductDetail extends Product {
  category_name: string | null;
  images: ProductImage[];
}