import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { AuthForm } from "../../features/auth/components/AuthForm";
import { useOrders } from "../../features/auth/hooks/useOrders";
import { ProfileForm } from "../../features/auth/components/ProfileForm";

export default function AccountTabScreen() {
	const router = useRouter();
	const { user, loading: authLoading, signOut } = useAuth();
	const { data: orders = [], isLoading: ordersLoading } = useOrders();
	const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");

	const loading = authLoading;

	return (
		<ScrollView className="flex-1 bg-[#120b08]" contentContainerClassName="px-4 pb-10 pt-14">
			<View className="rounded-[32px] border border-white/8 bg-[#20110d] px-5 py-5">
				<Text className="text-xs font-semibold uppercase tracking-[1.8px] text-orange-200/80">
					Account
				</Text>
				<Text className="mt-2 text-4xl font-bold text-white">
					Your grill profile
				</Text>
				<Text className="mt-2 text-base leading-6 text-white/65">
					Manage sign-in, saved orders, and the details tied to your delivery
					account.
				</Text>
			</View>

			{loading ? (
				<View className="mt-6 rounded-[28px] border border-white/10 bg-black/20 px-5 py-10">
					<ActivityIndicator color="#fb923c" />
					<Text className="mt-4 text-center text-base text-white/60">
						Loading account...
					</Text>
				</View>
			) : user ? (
				<>
					<View className="mt-6 rounded-[28px] border border-white/10 bg-[#1a110e] p-5">
						<View className="flex-row items-center justify-between">
							<View>
								<Text className="text-xs font-semibold uppercase tracking-[1.6px] text-orange-200/80">
									Signed in as
								</Text>
								<Text className="mt-2 text-xl font-bold text-white">
									{user.email}
								</Text>
							</View>
							<Text
								className="rounded-full bg-red-950/60 px-4 py-2 text-xs font-semibold uppercase tracking-[1.2px] text-red-200"
								onPress={() => signOut()}
							>
								Sign Out
							</Text>
						</View>
					</View>

					<View className="mt-8 flex-row gap-4 border-b border-white/5 pb-4">
						<Pressable onPress={() => setActiveTab("orders")}>
							<Text className={`text-sm font-bold uppercase tracking-[1.2px] ${activeTab === "orders" ? "text-orange-400" : "text-white/40"}`}>
								Orders
							</Text>
						</Pressable>
						<Pressable onPress={() => setActiveTab("profile")}>
							<Text className={`text-sm font-bold uppercase tracking-[1.2px] ${activeTab === "profile" ? "text-orange-400" : "text-white/40"}`}>
								Profile Settings
							</Text>
						</Pressable>
					</View>

					{activeTab === "orders" ? (
						<View className="mt-6">
							<Text className="text-xs font-semibold uppercase tracking-[1.8px] text-orange-200/80">
								Order History
							</Text>
							
							{ordersLoading ? (
								<ActivityIndicator className="mt-10" color="#fb923c" />
							) : orders.length === 0 ? (
								<View className="mt-4 rounded-[28px] border border-white/10 bg-black/20 px-5 py-10">
									<Text className="text-center text-base text-white/60">
										No orders placed yet. Time to fire up the grill!
									</Text>
								</View>
							) : (
								<View className="mt-4 gap-4">
									{orders.map((order) => (
										<Pressable
											key={order.id}
											onPress={() => router.push(`/order/${order.id}` as never)}
											className="rounded-[28px] border border-white/10 bg-[#1a110e] p-5"
										>
											<View className="flex-row items-center justify-between">
												<Text className="text-xs font-bold uppercase tracking-[1.2px] text-white/40">
													#{order.id.slice(0, 8)}
												</Text>
												<View className="rounded-full bg-orange-500/10 px-3 py-1">
													<Text className="text-xs font-bold uppercase text-orange-300">
														{order.statusLabel}
													</Text>
												</View>
											</View>

											<View className="mt-4">
												<View className="h-2 overflow-hidden rounded-full bg-white/8">
													<View
														className="h-full rounded-full bg-orange-500"
														style={{ width: `${Math.max(8, order.progress * 100)}%` }}
													/>
												</View>
												<View className="mt-3 flex-row items-center justify-between">
													<Text className="text-sm text-white/55">
														ETA {order.deliveryEta}
													</Text>
													<Text className="text-sm text-orange-200/70">
														{order.deliveryZone}
													</Text>
												</View>
												<Text className="mt-2 text-sm leading-5 text-white/55">
													Deliver to: {order.deliveryAddress}
												</Text>
											</View>
											
											<View className="mt-4">
												{order.orderItems.map((item) => (
													<Text key={item.id} className="text-base text-white/80">
														{item.quantity}x {item.productName}
													</Text>
												))}
											</View>

											<View className="mt-5 flex-row items-center justify-between border-t border-white/5 pt-4">
												<Text className="text-sm text-white/40">
													{new Date(order.createdAt).toLocaleDateString()}
												</Text>
												<View className="items-end">
													<Text className="text-xs uppercase tracking-[1.2px] text-white/35">
														Delivery ₱{order.deliveryFee.toFixed(2)}
													</Text>
													<Text className="mt-1 text-lg font-bold text-orange-400">
														₱{order.total.toFixed(2)}
													</Text>
												</View>
											</View>
										</Pressable>
									))}
								</View>
							)}
						</View>
					) : (
						<View className="mt-6">
							<Text className="mb-4 text-xs font-semibold uppercase tracking-[1.8px] text-orange-200/80">
								Your Details
							</Text>
							<View className="rounded-[28px] border border-white/10 bg-[#1a110e] p-5">
								<ProfileForm />
							</View>
						</View>
					)}
				</>
			) : (
				<View className="mt-6 overflow-hidden rounded-[32px] border border-white/10 bg-[#1a110e]">
					<View className="border-b border-white/8 bg-orange-500/10 px-5 py-5">
						<Text className="text-xs font-semibold uppercase tracking-[1.8px] text-orange-200/80">
							Welcome back
						</Text>
						<Text className="mt-2 text-3xl font-bold text-white">
							Sign in to your grill account
						</Text>
						<Text className="mt-3 text-base leading-6 text-white/60">
							Track active deliveries, save your favorite drop-off points, and keep checkout fast.
						</Text>
					</View>
					<View className="p-5">
						<View className="mb-6 flex-row gap-3">
							<View className="flex-1 rounded-[22px] border border-white/8 bg-black/20 p-4">
								<Text className="text-[11px] uppercase tracking-[1.2px] text-white/35">
									Orders
								</Text>
								<Text className="mt-2 text-lg font-bold text-white">
									Live tracking
								</Text>
							</View>
							<View className="flex-1 rounded-[22px] border border-white/8 bg-black/20 p-4">
								<Text className="text-[11px] uppercase tracking-[1.2px] text-white/35">
									Checkout
								</Text>
								<Text className="mt-2 text-lg font-bold text-white">
									Saved addresses
								</Text>
							</View>
						</View>
					<AuthForm />
					</View>
				</View>
			)}
		</ScrollView>
	);
}
