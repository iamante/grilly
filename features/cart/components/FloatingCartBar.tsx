import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCartStore } from "../../../stores/cartStore";

export function FloatingCartBar() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const totalItems = useCartStore((s) => s.totalItems());
	const totalPrice = useCartStore((s) => s.totalPrice());

	if (totalItems === 0) {
		return null;
	}

	return (
		<Animated.View
			entering={FadeInUp.duration(260)}
			style={{ bottom: insets.bottom + 14 }}
			className="absolute left-4 right-4"
		>
			<Pressable
				onPress={() => router.push("/(tabs)/cart")}
				className="overflow-hidden rounded-[26px] border border-orange-300/15 bg-[#19100d]"
			>
				<View className="flex-row items-center justify-between bg-orange-500/8 px-5 py-4">
					<View className="flex-row items-center gap-3">
						<View className="h-12 w-12 items-center justify-center rounded-full bg-orange-500">
							<Ionicons name="bag-handle" size={22} color="#120b08" />
						</View>
						<View>
							<Text className="text-xs font-semibold uppercase tracking-[1.6px] text-orange-200/80">
								Ready to checkout
							</Text>
							<Text className="mt-1 text-lg font-bold text-white">
								{totalItems} item{totalItems === 1 ? "" : "s"} • ₱
								{totalPrice.toFixed(0)}
							</Text>
						</View>
					</View>

					<View className="rounded-full bg-orange-500 px-4 py-3">
						<Text className="text-sm font-bold uppercase tracking-[1.2px] text-black">
							View Cart
						</Text>
					</View>
				</View>
			</Pressable>
		</Animated.View>
	);
}
