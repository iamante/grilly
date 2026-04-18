import { create } from "zustand";

type HomeUiState = {
	searchQuery: string;
	selectedCategory: string | null;
	setSearchQuery: (query: string) => void;
	setSelectedCategory: (category: string | null) => void;
};

export const useHomeUiStore = create<HomeUiState>((set) => ({
	searchQuery: "",
	selectedCategory: null,
	setSearchQuery: (query) => set({ searchQuery: query }),
	setSelectedCategory: (category) => set({ selectedCategory: category }),
}));
