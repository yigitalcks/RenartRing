export interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
}

export const products: Product[] = Array.from({ length: 100 }).map((_, i) => ({
  id: i + 1,
  name: `Ürün ${i + 1}`,
  price: (Math.random() * 500 + 100).toFixed(0),
  image: `https://via.placeholder.com/150?text=Ürün+${i + 1}`,
}));