import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../hooks/useAuth";
import {
	canCancelOrder,
	getAssignedRider,
	getDeliveryProgress,
	getDeliveryQuote,
	getDeliveryStatusLabel,
	getTrackingStepIndex,
	trackingSteps,
} from "../../cart/utils/delivery";
import type { Order } from "./useOrders";

export type OrderDetail = Order & {
	activeStepIndex: number;
	canCancel: boolean;
	rider: ReturnType<typeof getAssignedRider>;
	timeline: typeof trackingSteps;
};

async function fetchOrderDetail(orderId: string): Promise<OrderDetail> {
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
		.eq("id", orderId)
		.single();

	if (error) {
		console.error("Error fetching order detail:", error);
		throw error;
	}

	const order = data as any;
	const quote = getDeliveryQuote(order.delivery_address || "");
	const activeStepIndex = getTrackingStepIndex(order.status, order.created_at);

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
		activeStepIndex,
		canCancel: canCancelOrder(order.status, order.created_at),
		rider: getAssignedRider(order.id),
		timeline: trackingSteps,
		orderItems: (order.order_items || []).map((item: any) => ({
			id: item.id,
			productName: item.product_name,
			quantity: item.quantity,
			unitPrice: Number(item.unit_price),
			lineTotal: Number(item.line_total),
		})),
	};
}

export function useOrderDetail(orderId: string) {
	return useQuery({
		queryKey: ["order-detail", orderId],
		queryFn: () => fetchOrderDetail(orderId),
		enabled: !!orderId,
	});
}

async function cancelOrder(orderId: string, userId: string) {
	const { error } = await supabase
		.from("orders")
		.update({
			status: "cancelled",
			updated_at: new Date().toISOString(),
		} as never)
		.eq("id", orderId)
		.eq("user_id", userId);

	if (error) {
		console.error("Error cancelling order:", error);
		throw error;
	}
}

export function useCancelOrder(orderId: string) {
	const { user } = useAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			if (!user) {
				throw new Error("Please sign in to manage this order.");
			}

			await cancelOrder(orderId, user.id);
		},
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["order-detail", orderId] }),
				queryClient.invalidateQueries({ queryKey: ["user-orders", user?.id] }),
			]);
		},
	});
}
