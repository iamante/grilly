import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useHomeUiStore } from "../../../stores/homeUiStore";

export type HomeProduct = {
	id: string;
	name: string;
	description: string;
	price: number;
	rating: number;
	category: string;
	imageUrl: string;
};

const mockProducts: HomeProduct[] = [
	{
		id: "1",
		name: "Pork Barbeque Skewers",
		description: "Tender marinated pork grilled to perfection, 3 sticks",
		price: 120,
		rating: 4.8,
		category: "BBQ",
		imageUrl:
			"https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop",
	},
	{
		id: "2",
		name: "Chicken Inasal",
		description: "Grilled chicken marinated in calamansi and annatto",
		price: 180,
		rating: 4.7,
		category: "BBQ",
		imageUrl:
			"https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1200&auto=format&fit=crop",
	},
	{
		id: "3",
		name: "Grilled Milkfish (Bangus)",
		description: "Whole bangus stuffed with tomatoes and onions",
		price: 200,
		rating: 4.8,
		category: "Ihaw",
		imageUrl:
			"https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
	},
	{
		id: "4",
		name: "Buko Juice",
		description: "Fresh young coconut juice",
		price: 60,
		rating: 4.8,
		category: "Drinks",
		imageUrl:
			"https://images.unsplash.com/photo-1561047029-3000c68339ca?q=80&w=1200&auto=format&fit=crop",
	},
];

async function fetchHomeProducts(): Promise<HomeProduct[]> {
	return Promise.resolve(mockProducts);
}

export function useHomeFeed() {
	const searchQuery = useHomeUiStore((s) => s.searchQuery);
	const selectedCategory = useHomeUiStore((s) => s.selectedCategory);

	const {
		data = [],
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["home-feed-products"],
		queryFn: fetchHomeProducts,
	});

	const filteredProducts = useMemo(() => {
		return data.filter((item) => {
			const byCategory = selectedCategory
				? item.category === selectedCategory
				: true;
			const bySearch = searchQuery
				? `${item.name} ${item.description}`
						.toLowerCase()
						.includes(searchQuery.toLowerCase())
				: true;
			return byCategory && bySearch;
		});
	}, [data, searchQuery, selectedCategory]);

	return {
		products: filteredProducts,
		isLoading,
		isError,
	};
}
