import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
	ActivityIndicator,
	Alert,
	Pressable,
	ScrollView,
	Text,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
	useCancelOrder,
	useOrderDetail,
} from "../../features/auth/hooks/useOrderDetail";

export default function OrderTrackingScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { data: order, isLoading, isError } = useOrderDetail(id!);
	const cancelOrder = useCancelOrder(id!);

	if (isLoading) {
		return (
			<View className="flex-1 items-center justify-center bg-[#120b08]">
				<ActivityIndicator color="#fb923c" size="large" />
			</View>
		);
	}

	if (isError || !order) {
		return (
			<View className="flex-1 items-center justify-center bg-[#120b08] px-6">
				<Text className="text-2xl font-bold text-white">Order not found</Text>
				<Text className="mt-2 text-center text-base leading-6 text-white/60">
					We couldn&apos;t load that delivery. Try going back to your order history.
				</Text>
				<Pressable
					onPress={() => router.back()}
					className="mt-6 rounded-full bg-orange-500 px-5 py-3"
				>
					<Text className="text-sm font-bold uppercase tracking-[1.2px] text-black">
						Go Back
					</Text>
				</Pressable>
			</View>
		);
	}

	function handleContactRider() {
		Alert.alert(
			"Rider contact",
			`${order!.rider.name}\n${order!.rider.phone}\n${order!.rider.vehicle} • ${order!.rider.plate}`,
		);
	}

	function handleSupport() {
		Alert.alert(
			"Delivery support",
			"We're watching this order. If the ETA slips, support can reach the rider and store for you.",
		);
	}

	function handleCancel() {
		Alert.alert(
			"Cancel order?",
			"Orders can only be cancelled while the kitchen is still preparing them.",
			[
				{ text: "Keep order", style: "cancel" },
				{
					text: "Cancel order",
					style: "destructive",
					onPress: async () => {
						try {
							await cancelOrder.mutateAsync();
						} catch (error: any) {
							Alert.alert(
								"Cancel failed",
								error.message || "We couldn't cancel this order right now.",
							);
						}
					},
				},
			],
		);
	}

	return (
		<View className="flex-1 bg-[#120b08]">
			<ScrollView className="flex-1" contentContainerClassName="px-4 pb-10 pt-14">
				<Pressable
					onPress={() => router.back()}
					style={{ top: insets.top }}
					className="mb-4 h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/20"
				>
					<Ionicons name="arrow-back" size={22} color="white" />
				</Pressable>

				<View className="rounded-[32px] border border-orange-300/10 bg-[#20110d] px-5 py-5">
					<Text className="text-xs font-semibold uppercase tracking-[1.8px] text-orange-200/80">
						Order tracking
					</Text>
					<Text className="mt-2 text-4xl font-bold text-white">
						#{order.id.slice(0, 8)}
					</Text>
					<Text className="mt-2 text-base leading-6 text-white/60">
						{order.statusLabel} • ETA {order.deliveryEta}
					</Text>

					<View className="mt-5 h-2 overflow-hidden rounded-full bg-white/8">
						<View
							className="h-full rounded-full bg-orange-500"
							style={{ width: `${Math.max(8, order.progress * 100)}%` }}
						/>
					</View>
				</View>

				{order.status !== "cancelled" ? (
					<View className="mt-5 rounded-[28px] border border-white/10 bg-[#1a110e] p-5">
						<View className="flex-row items-start justify-between">
							<View className="flex-1 pr-4">
								<Text className="text-xs font-semibold uppercase tracking-[1.6px] text-orange-200/80">
									Assigned rider
								</Text>
								<Text className="mt-2 text-2xl font-bold text-white">
									{order.rider.name}
								</Text>
								<Text className="mt-2 text-base text-white/60">
									{order.rider.vehicle} • {order.rider.plate}
								</Text>
								<Text className="mt-1 text-base text-orange-200/75">
									{order.rider.phone}
								</Text>
							</View>
							<View className="rounded-[22px] border border-orange-300/10 bg-orange-500/10 px-4 py-3">
								<Text className="text-xs uppercase tracking-[1.2px] text-white/45">
									Status
								</Text>
								<Text className="mt-1 text-base font-semibold text-white">
									{order.statusLabel}
								</Text>
							</View>
						</View>

						<View className="mt-4 flex-row gap-3">
							<Pressable
								onPress={handleContactRider}
								className="flex-1 rounded-full bg-orange-500 px-4 py-3"
							>
								<Text className="text-center text-sm font-bold uppercase tracking-[1.2px] text-black">
									Call rider
								</Text>
							</Pressable>
							<Pressable
								onPress={handleSupport}
								className="flex-1 rounded-full border border-white/10 bg-black/20 px-4 py-3"
							>
								<Text className="text-center text-sm font-bold uppercase tracking-[1.2px] text-white">
									Get help
								</Text>
							</Pressable>
						</View>

						{order.canCancel ? (
							<Pressable
								onPress={handleCancel}
								disabled={cancelOrder.isPending}
								className="mt-3 rounded-full border border-red-400/20 bg-red-950/60 px-4 py-3"
							>
								<Text className="text-center text-sm font-bold uppercase tracking-[1.2px] text-red-200">
									{cancelOrder.isPending ? "Cancelling..." : "Cancel order"}
								</Text>
							</Pressable>
						) : null}
					</View>
				) : (
					<View className="mt-5 rounded-[28px] border border-red-400/15 bg-red-950/40 p-5">
						<Text className="text-xs font-semibold uppercase tracking-[1.6px] text-red-200/80">
							Order cancelled
						</Text>
						<Text className="mt-3 text-base leading-6 text-red-100/80">
							This delivery was cancelled before dispatch. If you still want your meal, place a new order from the home screen.
						</Text>
					</View>
				)}

				<View className="mt-5 rounded-[28px] border border-white/10 bg-[#1a110e] p-5">
					<Text className="text-xs font-semibold uppercase tracking-[1.6px] text-orange-200/80">
						Delivery route
					</Text>
					<Text className="mt-3 text-base leading-6 text-white/70">
						{order.deliveryAddress}
					</Text>
					<View className="mt-4 flex-row gap-3">
						<View className="flex-1 rounded-[22px] border border-white/10 bg-black/20 p-4">
							<Text className="text-xs uppercase tracking-[1.2px] text-white/40">
								Zone
							</Text>
							<Text className="mt-2 text-lg font-bold text-white">
								{order.deliveryZone}
							</Text>
						</View>
						<View className="flex-1 rounded-[22px] border border-white/10 bg-black/20 p-4">
							<Text className="text-xs uppercase tracking-[1.2px] text-white/40">
								Delivery fee
							</Text>
							<Text className="mt-2 text-lg font-bold text-white">
								₱{order.deliveryFee.toFixed(2)}
							</Text>
						</View>
					</View>
				</View>

				<View className="mt-5 rounded-[28px] border border-white/10 bg-[#1a110e] p-5">
					<Text className="text-xs font-semibold uppercase tracking-[1.6px] text-orange-200/80">
						Tracking timeline
					</Text>
					<View className="mt-4 gap-4">
						{order.timeline.map((step, index) => {
							const completed = index <= order.activeStepIndex;
							return (
								<View key={step.title} className="flex-row items-start">
									<View className="items-center">
										<View
											className={`h-4 w-4 rounded-full ${
												completed ? "bg-orange-500" : "bg-white/15"
											}`}
										/>
										{index < order.timeline.length - 1 ? (
											<View
												className={`mt-1 w-[2px] flex-1 ${
													completed ? "bg-orange-500/70" : "bg-white/10"
												}`}
												style={{ minHeight: 28 }}
											/>
										) : null}
									</View>
									<View className="ml-4 flex-1 pb-4">
										<Text
											className={`text-base font-semibold ${
												completed ? "text-white" : "text-white/40"
											}`}
										>
											{step.title}
										</Text>
										<Text className="mt-1 text-sm leading-5 text-white/50">
											{step.title === order.statusLabel
												? step.description
												: completed
													? "Completed"
													: step.description}
										</Text>
									</View>
								</View>
							);
						})}
					</View>
				</View>

				<View className="mt-5 rounded-[28px] border border-white/10 bg-[#1a110e] p-5">
					<Text className="text-xs font-semibold uppercase tracking-[1.6px] text-orange-200/80">
						Order summary
					</Text>
					<View className="mt-4 gap-3">
						{order.orderItems.map((item) => (
							<View
								key={item.id}
								className="rounded-[22px] border border-white/8 bg-black/20 p-4"
							>
								<Text className="text-base font-semibold text-white">
									{item.quantity}x {item.productName}
								</Text>
								<Text className="mt-2 text-sm text-white/55">
									Unit ₱{item.unitPrice.toFixed(2)}
								</Text>
								<Text className="mt-1 text-lg font-bold text-orange-300">
									₱{item.lineTotal.toFixed(2)}
								</Text>
							</View>
						))}
					</View>

					<View className="mt-5 border-t border-white/8 pt-4">
						<View className="flex-row items-center justify-between">
							<Text className="text-sm text-white/50">Subtotal</Text>
							<Text className="text-base font-semibold text-white">
								₱{order.subtotal.toFixed(2)}
							</Text>
						</View>
						<View className="mt-2 flex-row items-center justify-between">
							<Text className="text-sm text-white/50">Delivery</Text>
							<Text className="text-base font-semibold text-white">
								₱{order.deliveryFee.toFixed(2)}
							</Text>
						</View>
						<View className="mt-3 flex-row items-center justify-between">
							<Text className="text-sm text-white/50">Placed on</Text>
							<Text className="text-base font-semibold text-white">
								{new Date(order.createdAt).toLocaleString()}
							</Text>
						</View>
						<View className="mt-4 flex-row items-end justify-between">
							<Text className="text-xs font-semibold uppercase tracking-[1.5px] text-orange-200/80">
								Total
							</Text>
							<Text className="text-3xl font-bold text-orange-300">
								₱{order.total.toFixed(2)}
							</Text>
						</View>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}
