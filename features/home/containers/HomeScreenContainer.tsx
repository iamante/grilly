import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useHomeUiStore } from "../../../stores/homeUiStore";
import { useCartStore } from "../../../stores/cartStore";
import { ProductCard } from "../components/ProductCard";
import { useHomeFeed } from "../hooks/useHomeFeed";

const categories = ["BBQ", "Ihaw", "Street Food", "Sides", "Drinks"];

export function HomeScreenContainer() {
	const { products, isLoading } = useHomeFeed();
	const searchQuery = useHomeUiStore((s) => s.searchQuery);
	const selectedCategory = useHomeUiStore((s) => s.selectedCategory);
  const setSearchQuery = useHomeUiStore((s) => s.setSearchQuery);
  const setSelectedCategory = useHomeUiStore((s) => s.setSelectedCategory);
  const addItem = useCartStore((s) => s.addItem);

	return (
		<ScrollView className="flex-1 bg-black px-4 pt-14">
			<Text className="text-5xl font-bold text-white">Grilly 🔥</Text>
			<Text className="mt-2 text-xl text-orange-400">
				Authentic Filipino BBQ Delivery
			</Text>

			<TextInput
				className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 text-lg text-white"
				placeholder="Search for BBQ, isaw, drinks..."
				placeholderTextColor="#71717a"
				value={searchQuery}
				onChangeText={setSearchQuery}
			/>

			<Text className="mt-6 text-4xl font-semibold text-white">Categories</Text>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				className="mt-4"
			>
				<View className="flex-row gap-3">
					{categories.map((category) => {
						const active = selectedCategory === category;
						return (
							<Text
								key={category}
								onPress={() => setSelectedCategory(active ? null : category)}
								className={`rounded-full border px-4 py-2 text-base ${
									active
										? "border-orange-500 bg-orange-500 text-black"
										: "border-zinc-700 bg-zinc-900 text-zinc-200"
								}`}
							>
								{category}
							</Text>
						);
					})}
				</View>
			</ScrollView>

			<Text className="mt-6 text-4xl font-semibold text-white">
				Today&apos;s Specials
			</Text>

			<View className="mt-4 pb-8">
				{isLoading ? (
					<ActivityIndicator color="#f97316" />
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
              onPress={() =>
                addItem({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  imageUrl: product.imageUrl,
                })
              }
						/>
					))
				)}
			</View>
		</ScrollView>
	);
}
