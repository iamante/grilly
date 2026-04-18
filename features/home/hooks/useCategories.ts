import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";

export type Category = {
	id: string;
	name: string;
	iconEmoji: string | null;
	sortOrder: number;
};

async function fetchCategories(): Promise<Category[]> {
	const { data, error } = await supabase
		.from("categories")
		.select("id, name, icon_emoji, sort_order")
		.order("sort_order", { ascending: true });

	if (error) {
		console.error("Error fetching categories:", error);
		throw error;
	}

	return (data || []).map((item) => ({
		id: item.id,
		name: item.name,
		iconEmoji: item.icon_emoji,
		sortOrder: item.sort_order,
	}));
}

export function useCategories() {
	return useQuery({
		queryKey: ["categories"],
		queryFn: fetchCategories,
	});
}
