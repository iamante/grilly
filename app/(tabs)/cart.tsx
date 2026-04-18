import { useRouter } from "expo-router";
import {
	ActivityIndicator,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useCartStore } from "../../stores/cartStore";
import { useCheckout } from "../../features/cart/hooks/useCheckout";

export default function CartTabScreen() {
	const router = useRouter();
	const items = useCartStore((s) => s.items);
	const increment = useCartStore((s) => s.increment);
	const decrement = useCartStore((s) => s.decrement);
	const removeItem = useCartStore((s) => s.removeItem);
	const totalItems = useCartStore((s) => s.totalItems());
	const {
		deliveryAddress,
		setDeliveryAddress,
		deliveryNote,
		setDeliveryNote,
		savedAddresses,
		selectSavedAddress,
		saveCurrentAddress,
		removeSavedAddress,
		deliveryFee,
		deliveryEta,
		deliveryZone,
		subtotal,
		total,
		handleCheckout,
		loading,
	} = useCheckout();

	async function handlePlaceOrder() {
		const orderId = await handleCheckout();
		if (!orderId) {
			return;
		}

		router.push(`/order/${orderId}` as never);
	}

	return (
		<ScrollView className="flex-1 bg-[#120b08]" contentContainerClassName="px-4 pb-10 pt-14">
			<View className="rounded-[32px] border border-white/8 bg-[#20110d] px-5 py-5">
				<Text className="text-xs font-semibold uppercase tracking-[1.8px] text-orange-200/80">
					Checkout
				</Text>
				<Text className="mt-2 text-4xl font-bold text-white">Your tray</Text>
				<Text className="mt-2 text-base leading-6 text-white/65">
					{totalItems > 0
						? `${totalItems} item${totalItems === 1 ? "" : "s"} lined up for prep and delivery.`
						: "Build your tray with smoky favorites from the home screen."}
				</Text>
			</View>

			<View className="mt-5 rounded-[28px] border border-orange-300/10 bg-orange-500/10 p-4">
				<Text className="text-xs font-semibold uppercase tracking-[1.6px] text-orange-200/80">
					Delivery summary
				</Text>
				<View className="mt-3 flex-row gap-3">
					<View className="flex-1 rounded-[22px] border border-white/10 bg-black/20 p-4">
						<Text className="text-xs uppercase tracking-[1.2px] text-white/45">
							ETA
						</Text>
						<Text className="mt-2 text-2xl font-bold text-white">
							{deliveryEta}
						</Text>
					</View>
					<View className="flex-1 rounded-[22px] border border-white/10 bg-black/20 p-4">
						<Text className="text-xs uppercase tracking-[1.2px] text-white/45">
							Zone
						</Text>
						<Text className="mt-2 text-lg font-bold text-white">
							{deliveryZone}
						</Text>
					</View>
				</View>
			</View>

			<View className="mt-5 rounded-[28px] border border-white/8 bg-[#1a110e] p-5">
				<Text className="text-xs font-semibold uppercase tracking-[1.8px] text-orange-200/80">
					Drop-off details
				</Text>
				<View className="mt-4 flex-row items-center justify-between">
					<Text className="text-sm text-white/55">Saved addresses</Text>
					<Pressable
						onPress={saveCurrentAddress}
						className="rounded-full border border-orange-300/20 bg-orange-500/10 px-3 py-2"
					>
						<Text className="text-xs font-semibold uppercase tracking-[1.2px] text-orange-200">
							Save current
						</Text>
					</Pressable>
				</View>
				{savedAddresses.length > 0 ? (
					<View className="mt-3 gap-3">
						{savedAddresses.map((address) => {
							const selected = deliveryAddress.trim() === address.address;
							return (
								<Pressable
									key={address.id}
									onPress={() => selectSavedAddress(address.address)}
									className={`rounded-[22px] border p-4 ${
										selected
											? "border-orange-300/30 bg-orange-500/12"
											: "border-white/10 bg-black/20"
									}`}
								>
									<View className="flex-row items-start justify-between">
										<View className="flex-1 pr-3">
											<Text className="text-xs font-semibold uppercase tracking-[1.2px] text-orange-200/80">
												{address.label}
											</Text>
											<Text className="mt-2 text-base leading-6 text-white/80">
												{address.address}
											</Text>
										</View>
										<Pressable
											onPress={() => removeSavedAddress(address.id)}
											className="rounded-full border border-red-400/15 bg-red-950/50 px-3 py-2"
										>
											<Text className="text-[11px] font-semibold uppercase tracking-[1.2px] text-red-200">
												Remove
											</Text>
										</Pressable>
									</View>
								</Pressable>
							);
						})}
					</View>
				) : (
					<Text className="mt-3 text-sm leading-6 text-white/45">
						Save up to three drop-off points for faster checkout.
					</Text>
				)}
				<TextInput
					className="mt-4 rounded-[22px] border border-white/10 bg-black/20 px-5 py-4 text-base text-white"
					placeholder="House number, street, barangay, city"
					placeholderTextColor="#9a8d86"
					value={deliveryAddress}
					onChangeText={setDeliveryAddress}
					multiline
				/>
				<TextInput
					className="mt-4 rounded-[22px] border border-white/10 bg-black/20 px-5 py-4 text-base text-white"
					placeholder="Delivery note, landmark, gate code, rider instructions"
					placeholderTextColor="#9a8d86"
					value={deliveryNote}
					onChangeText={setDeliveryNote}
					multiline
				/>
			</View>

			<View className="mt-6 gap-4">
				{items.length === 0 ? (
					<View className="rounded-[28px] border border-white/10 bg-black/20 px-5 py-10">
						<Text className="text-center text-2xl font-bold text-white">
							Your cart is empty
						</Text>
						<Text className="mt-2 text-center text-base leading-6 text-white/60">
							Add skewers, seafood, or drinks to start your order.
						</Text>
					</View>
				) : (
					items.map((item) => (
						<View
							key={item.uniqueId}
							className="rounded-[28px] border border-white/10 bg-[#1a110e] p-4"
						>
							<View className="flex-row items-start justify-between">
								<View className="flex-1 pr-4">
									<Text className="text-2xl font-bold text-white">
										{item.name}
									</Text>
									<View className="mt-1 flex-row flex-wrap items-center gap-1.5">
										<Text className="text-xs font-medium text-orange-200/60">
											{item.customizations.heatLevel} Heat
										</Text>
										<Text className="text-xs text-white/20">•</Text>
										<Text className="text-xs font-medium text-orange-200/60">
											{item.customizations.sauce}
										</Text>
										{item.customizations.extraRice && (
											<>
												<Text className="text-xs text-white/20">•</Text>
												<Text className="text-xs font-medium text-orange-200/60">
													Extra Rice
												</Text>
											</>
										)}
										{item.customizations.extraAtchara && (
											<>
												<Text className="text-xs text-white/20">•</Text>
												<Text className="text-xs font-medium text-orange-200/60">
													Extra Atchara
												</Text>
											</>
										)}
									</View>
									<Text className="mt-2 text-sm uppercase tracking-[1.4px] text-orange-300/80">
										₱{item.price.toFixed(2)} each
									</Text>
								</View>
								<Text
									className="rounded-full border border-red-400/20 bg-red-950/60 px-3 py-2 text-xs font-semibold uppercase tracking-[1.2px] text-red-200"
									onPress={() => removeItem(item.uniqueId)}
								>
									Remove
								</Text>
							</View>

							<View className="mt-5 flex-row items-center justify-between">
								<View className="flex-row items-center gap-3">
									<Text
										className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-lg font-bold text-white"
										onPress={() => decrement(item.uniqueId)}
									>
										−
									</Text>
									<View className="min-w-[56px] rounded-full bg-orange-500 px-4 py-2">
										<Text className="text-center text-base font-bold text-black">
											{item.quantity}
										</Text>
									</View>
									<Text
										className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-lg font-bold text-white"
										onPress={() => increment(item.uniqueId)}
									>
										+
									</Text>
								</View>

								<View>
									<Text className="text-right text-xs uppercase tracking-[1.2px] text-white/45">
										Line total
									</Text>
									<Text className="mt-1 text-2xl font-bold text-orange-400">
										₱{(item.price * item.quantity).toFixed(2)}
									</Text>
								</View>
							</View>
						</View>
					))
				)}
			</View>

			<View className="mt-6 rounded-[30px] border border-orange-300/10 bg-orange-500/10 px-5 py-5">
				<View className="gap-3">
					<View className="flex-row items-center justify-between">
						<Text className="text-sm text-white/60">Subtotal</Text>
						<Text className="text-base font-semibold text-white">
							₱{subtotal.toFixed(2)}
						</Text>
					</View>
					<View className="flex-row items-center justify-between">
						<Text className="text-sm text-white/60">Delivery fee</Text>
						<Text className="text-base font-semibold text-white">
							₱{deliveryFee.toFixed(2)}
						</Text>
					</View>
					<View className="h-px bg-white/10" />
					<View className="flex-row items-end justify-between">
						<View>
							<Text className="text-xs font-semibold uppercase tracking-[1.8px] text-orange-200/80">
								Order total
							</Text>
							<Text className="mt-2 text-4xl font-bold text-orange-300">
								₱{total.toFixed(2)}
							</Text>
						</View>
						<TouchableOpacity
							onPress={handlePlaceOrder}
							disabled={loading || items.length === 0}
							className={`rounded-full px-5 py-3 ${
								loading || items.length === 0 ? "bg-orange-800/50" : "bg-orange-500"
							}`}
						>
							{loading ? (
								<ActivityIndicator color="#000" />
							) : (
								<Text className="text-sm font-bold uppercase tracking-[1.2px] text-black">
									Place Order
								</Text>
							)}
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</ScrollView>
	);
}
