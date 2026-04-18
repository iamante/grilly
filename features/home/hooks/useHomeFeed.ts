import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { supabase } from "../../../lib/supabase";
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

async function fetchHomeProducts(): Promise<HomeProduct[]> {
	const { data, error } = await supabase
		.from("products")
		.select(`
			id,
			name,
			description,
			price,
			rating,
			image_url,
			categories (
				name
			)
		`)
		.eq("is_active", true);

	if (error) {
		console.error("Error fetching products:", error);
		throw error;
	}

	return (data || []).map((item: any) => ({
		id: item.id,
		name: item.name,
		description: item.description || "",
		price: Number(item.price),
		rating: Number(item.rating),
		category: item.categories?.name || "Uncategorized",
		imageUrl:
			item.image_url ||
			"https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop",
	}));
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
