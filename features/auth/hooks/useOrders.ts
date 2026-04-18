import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../hooks/useAuth";
import {
	getDeliveryProgress,
	getDeliveryQuote,
	getDeliveryStatusLabel,
} from "../../cart/utils/delivery";

export type OrderItem = {
	id: string;
	productName: string;
	quantity: number;
	unitPrice: number;
	lineTotal: number;
};

export type Order = {
	id: string;
	status: string;
	statusLabel: string;
	progress: number;
	subtotal: number;
	deliveryFee: number;
	total: number;
	deliveryAddress: string;
	deliveryEta: string;
	deliveryZone: string;
	createdAt: string;
	orderItems: OrderItem[];
};

async function fetchUserOrders(userId: string): Promise<Order[]> {
	const { data, error } = await supabase
		.from("orders")
		.select(`
			id,
			status,
			subtotal,
			delivery_fee,
			total,
			delivery_address,
			created_at,
			order_items (
				id,
				product_name,
				quantity,
				unit_price,
				line_total
			)
		`)
		.eq("user_id", userId)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching orders:", error);
		throw error;
	}

	return (data || []).map((order: any) => {
		const quote = getDeliveryQuote(order.delivery_address || "");
		return {
		id: order.id,
		status: order.status,
		statusLabel: getDeliveryStatusLabel(order.status, order.created_at),
		progress: getDeliveryProgress(order.status, order.created_at),
		subtotal: Number(order.subtotal),
		deliveryFee: Number(order.delivery_fee),
		total: Number(order.total),
		deliveryAddress: order.delivery_address,
		deliveryEta: quote.etaLabel,
		deliveryZone: quote.zoneLabel,
		createdAt: order.created_at,
		orderItems: (order.order_items || []).map((item: any) => ({
			id: item.id,
			productName: item.product_name,
			quantity: item.quantity,
			unitPrice: Number(item.unit_price),
			lineTotal: Number(item.line_total),
		})),
		};
	});
}

export function useOrders() {
	const { user } = useAuth();

	return useQuery({
		queryKey: ["user-orders", user?.id],
		queryFn: () => fetchUserOrders(user!.id),
		enabled: !!user,
	});
}
