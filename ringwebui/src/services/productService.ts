import type { Rings } from '../types/product';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchRings = async (page: number): Promise<Rings> => {

  const url = `https://${API_BASE_URL}/rings?page=${page}`;

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
      goldData: {
        price: 0,
        lastUpdatedUtc: "",
      },
      pagination: {
        currentPage: page,
        pageSize: 4,
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false,
      },
    };
  }
};
