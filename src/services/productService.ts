import type { Ring } from '../types/product';

export interface Rings {
  data: Ring[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

const API_BASE_URL = "http://localhost:5268/api"; 

/**
 * Backend API'sinden yüzük verilerini çeker.
 * @param page Getirilecek sayfa numarası.
 * @returns API'den gelen veriyi içeren bir Promise.
 */
export const fetchRings = async (page: number): Promise<Rings> => {
  const url = `${API_BASE_URL}/rings?page=${page}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API call failed : ${response.status}`);
    }

    const data: Rings = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch rings:", error);
    return {
      data: [],
      pagination: {
        currentPage: page,
        pageSize: 4, // Hardcoded
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false,
      },
    };
  }
};