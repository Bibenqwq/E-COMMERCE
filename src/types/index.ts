export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  type: string;
  price: number;
  originalPrice?: number;
  description: string;
  longDescription: string;
  colors: ProductColor[];
  sizes: number[];
  stock: number;
  badge?: 'new' | 'bestseller' | 'sale';
  images: string[];
  specs: ProductSpec[];
  has3D?: boolean;
  popularity: number;
  dateAdded: string;
}

export interface CartItem {
  product: Product;
  selectedColor: ProductColor;
  selectedSize: number;
  quantity: number;
}
