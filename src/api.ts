import axios from "axios";
import { ApiResponse, Character } from "./types";

const API_BASE_URL = "https://rickandmortyapi.com/api";

export const fetchCharacters = async (page: number): Promise<ApiResponse> => {
  const { data } = await axios.get(`${API_BASE_URL}/character`, {
    params: { page },
  });
  return data;
};

export const fetchCharacterById = async (id: number): Promise<Character> => {
  const { data } = await axios.get(`${API_BASE_URL}/character/${id}`);
  return data;
};
