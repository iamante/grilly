import { ScrollView, Text, View } from "react-native";
import { useCartStore } from "../../stores/cartStore";

export default function CartTabScreen() {
	const items = useCartStore((s) => s.items);
	const increment = useCartStore((s) => s.increment);
	const decrement = useCartStore((s) => s.decrement);
	const removeItem = useCartStore((s) => s.removeItem);
	const totalPrice = useCartStore((s) => s.totalPrice());

	return (
		<ScrollView className="flex-1 bg-black px-4 pt-14">
			<Text className="text-4xl font-bold text-white">Your Cart</Text>

			<View className="mt-5 gap-3">
				{items.length === 0 ? (
					<Text className="text-zinc-400">Your cart is empty.</Text>
				) : (
					items.map((item) => (
						<View
							key={item.id}
							className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4"
						>
							<Text className="text-xl font-semibold text-white">
								{item.name}
							</Text>
							<Text className="mt-1 text-orange-500">
								₱{item.price.toFixed(2)}
							</Text>

							<View className="mt-3 flex-row items-center justify-between">
								<View className="flex-row items-center gap-3">
									<Text
										className="rounded-lg bg-zinc-800 px-3 py-1 text-white"
										onPress={() => decrement(item.id)}
									>
										-
									</Text>
									<Text className="text-white">{item.quantity}</Text>
									<Text
										className="rounded-lg bg-zinc-800 px-3 py-1 text-white"
										onPress={() => increment(item.id)}
									>
										+
									</Text>
								</View>

								<Text
									className="rounded-lg bg-red-950 px-3 py-1 text-red-300"
									onPress={() => removeItem(item.id)}
								>
									Remove
								</Text>
							</View>
						</View>
					))
				)}
			</View>

			<View className="mt-6 mb-8 rounded-2xl border border-orange-500 bg-zinc-900 p-4">
				<Text className="text-lg text-zinc-300">Total</Text>
				<Text className="text-3xl font-bold text-orange-500">
					₱{totalPrice.toFixed(2)}
				</Text>
			</View>
		</ScrollView>
	);
}
