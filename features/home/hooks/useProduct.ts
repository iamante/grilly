import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";

export type Product = {
	id: string;
	name: string;
	description: string;
	price: number;
	rating: number;
	category: string;
	imageUrl: string;
};

async function fetchProduct(id: string): Promise<Product> {
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
		.eq("id", id)
		.eq("is_active", true)
		.single();

	if (error) {
		console.error("Error fetching product:", error);
		throw error;
	}

	if (!data) {
		throw new Error("Product not found");
	}

	return {
		id: data.id,
		name: data.name,
		description: data.description || "",
		price: Number(data.price),
		rating: Number(data.rating),
		category: (data.categories as any)?.name || "Uncategorized",
		imageUrl:
			data.image_url ||
			"https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop",
	};
}

export function useProduct(id: string) {
	return useQuery({
		queryKey: ["product", id],
		queryFn: () => fetchProduct(id),
		enabled: !!id,
	});
}
