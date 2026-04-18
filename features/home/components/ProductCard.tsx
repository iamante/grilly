import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import Animated, {
	FadeInDown,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";

export type ProductCardProps = {
	id: string;
	name: string;
	description: string;
	price: number;
	rating: number;
	imageUrl: string;
	category?: string;
};

export function ProductCard({
	id,
	name,
	description,
	price,
	rating,
	imageUrl,
	category,
}: ProductCardProps) {
	const router = useRouter();
	const pressed = useSharedValue(0);
	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{
				scale: withSpring(pressed.value ? 0.985 : 1, {
					damping: 18,
					stiffness: 220,
				}),
			},
		],
		opacity: withSpring(pressed.value ? 0.94 : 1, {
			damping: 18,
			stiffness: 220,
		}),
	}));
	const badges = [
		rating >= 4.8 ? "Popular" : null,
		price <= 99 ? "Sulit" : null,
		category === "Drinks" ? "Refreshing" : null,
	].filter(Boolean) as string[];

	return (
		<Animated.View entering={FadeInDown.duration(450)}>
			<Pressable
				onPress={() => router.push(`/product/${id}`)}
				onPressIn={() => {
					pressed.value = 1;
				}}
				onPressOut={() => {
					pressed.value = 0;
				}}
			>
				<Animated.View
					style={animatedStyle}
					className="mb-4 overflow-hidden rounded-[30px] border border-orange-200/10 bg-neutral-950"
				>
					<View className="relative">
				<Image
					source={{ uri: imageUrl }}
					className="h-52 w-full"
					resizeMode="cover"
				/>
				<View className="absolute inset-0 bg-black/30" />
				<View className="absolute left-4 right-4 top-4 flex-row items-start justify-between">
					<View className="rounded-full border border-white/15 bg-black/45 px-3 py-1">
						<Text className="text-xs font-semibold uppercase tracking-[1.8px] text-orange-200">
							{category ?? "Featured"}
						</Text>
					</View>
					<View className="rounded-full border border-white/15 bg-black/45 px-3 py-1">
						<Text className="text-sm font-semibold text-amber-300">
							★ {rating.toFixed(1)}
						</Text>
					</View>
				</View>
				<View className="absolute bottom-4 left-4 right-4">
					<Text className="text-2xl font-bold text-white">{name}</Text>
					<Text className="mt-1 text-sm text-white/75" numberOfLines={2}>
						{description}
					</Text>
					{badges.length > 0 ? (
						<View className="mt-3 flex-row flex-wrap gap-2">
							{badges.map((badge) => (
								<View
									key={badge}
									className="rounded-full border border-white/10 bg-black/35 px-3 py-1"
								>
									<Text className="text-[11px] font-semibold uppercase tracking-[1.1px] text-orange-100">
										{badge}
									</Text>
								</View>
							))}
						</View>
					) : null}
				</View>
					</View>

					<View className="flex-row items-center justify-between px-4 py-4">
						<View>
							<Text className="text-xs uppercase tracking-[1.6px] text-neutral-500">
								Starting at
							</Text>
							<Text className="mt-1 text-3xl font-bold text-orange-400">
								₱{price.toFixed(0)}
							</Text>
						</View>

						<View className="rounded-full bg-orange-500 px-4 py-3">
							<Text className="text-sm font-bold uppercase tracking-[1.2px] text-black">
								Add to Cart
							</Text>
						</View>
					</View>
				</Animated.View>
			</Pressable>
		</Animated.View>
	);
}
