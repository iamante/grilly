import { ScrollView, Text, TextInput, View } from "react-native";
import { FloatingCartBar } from "../../features/cart/components/FloatingCartBar";
import { ProductCard } from "../../features/home/components/ProductCard";
import { useHomeFeed } from "../../features/home/hooks/useHomeFeed";
import { useHomeUiStore } from "../../stores/homeUiStore";

export default function SearchTabScreen() {
	const { products } = useHomeFeed();
	const searchQuery = useHomeUiStore((s) => s.searchQuery);
	const setSearchQuery = useHomeUiStore((s) => s.setSearchQuery);

	return (
		<View className="flex-1 bg-[#120b08]">
			<ScrollView className="flex-1" contentContainerClassName="px-4 pb-36 pt-14">
				<View className="rounded-[32px] border border-white/8 bg-[#20110d] px-5 py-5">
				<Text className="text-xs font-semibold uppercase tracking-[1.8px] text-orange-200/80">
					Discover
				</Text>
				<Text className="mt-2 text-4xl font-bold leading-[42px] text-white">
					Find your next
				</Text>
				<Text className="text-4xl font-bold leading-[42px] text-orange-400">
					grilled favorite
				</Text>

				<TextInput
					className="mt-5 rounded-[22px] border border-white/10 bg-[#1a110e] px-5 py-4 text-lg text-white"
					placeholder="Search for BBQ, isaw, drinks..."
					placeholderTextColor="#9a8d86"
					value={searchQuery}
					onChangeText={setSearchQuery}
				/>
				</View>

				<View className="mt-5 rounded-[28px] border border-orange-300/10 bg-orange-500/10 p-4">
					<Text className="text-xs font-semibold uppercase tracking-[1.6px] text-orange-200/75">
						Trending right now
					</Text>
					<Text className="mt-1 text-xl font-bold text-white">
						Inasal meals, barkada bundles, and cold calamansi drinks
					</Text>
				</View>

				<View className="mt-6 flex-row items-end justify-between">
				<View>
					<Text className="text-xs font-semibold uppercase tracking-[1.8px] text-orange-200/80">
						Results
					</Text>
					<Text className="mt-1 text-3xl font-bold text-white">
						{searchQuery ? "Search matches" : "Full menu"}
					</Text>
				</View>
				<Text className="text-sm text-white/50">
					{products.length} item{products.length === 1 ? "" : "s"}
				</Text>
				</View>

				<View className="mt-4">
				{products.length === 0 ? (
					<View className="rounded-[28px] border border-white/10 bg-black/20 px-5 py-10">
						<Text className="text-center text-2xl font-bold text-white">
							Nothing turned up
						</Text>
						<Text className="mt-2 text-center text-base leading-6 text-white/60">
							Try a different keyword and the grill will open back up.
						</Text>
					</View>
				) : (
					products.map((product) => (
						<ProductCard
							key={product.id}
							id={product.id}
							name={product.name}
							description={product.description}
							price={product.price}
							rating={product.rating}
							imageUrl={product.imageUrl}
							category={product.category}
						/>
					))
				)}
				</View>
			</ScrollView>
			<FloatingCartBar />
		</View>
	);
}
