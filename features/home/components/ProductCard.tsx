import { Image, Pressable, Text, View } from "react-native";

export type ProductCardProps = {
	id: string;
	name: string;
	description: string;
	price: number;
	rating: number;
	imageUrl: string;
	onPress?: (id: string) => void;
};

export function ProductCard({
	id,
	name,
	description,
	price,
	rating,
	imageUrl,
	onPress,
}: ProductCardProps) {
	return (
		<Pressable
			onPress={() => onPress?.(id)}
			className="mb-3 flex-row overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900"
		>
			<Image
				source={{ uri: imageUrl }}
				className="h-28 w-28"
				resizeMode="cover"
			/>
			<View className="flex-1 p-3">
				<Text className="text-xl font-semibold text-white">{name}</Text>
				<Text className="mt-1 text-base text-zinc-300" numberOfLines={2}>
					{description}
				</Text>
				<View className="mt-2 flex-row items-center justify-between">
					<Text className="text-3xl font-bold text-orange-500">
						₱{price.toFixed(2)}
					</Text>
					<View className="rounded-xl bg-zinc-800 px-3 py-1">
						<Text className="text-base text-yellow-400">
							⭐ {rating.toFixed(1)}
						</Text>
					</View>
				</View>
			</View>
		</Pressable>
	);
}
