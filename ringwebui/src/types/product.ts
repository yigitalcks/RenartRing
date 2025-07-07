export interface Rings {
  data: Ring[];
  goldData: GoldData;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

export interface Ring {
  ringId: number; 
  name: string;
  popularityScore: number;
  weight: number;
  images: {
    yellow: string;
    rose: string;
    white: string;
  };
}

export interface GoldData {
  price: number;
  lastUpdatedUtc: string;
}

