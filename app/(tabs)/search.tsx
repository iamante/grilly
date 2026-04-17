import { ScrollView, Text, TextInput, View } from "react-native";
import { ProductCard } from "../../features/home/components/ProductCard";
import { useHomeFeed } from "../../features/home/hooks/useHomeFeed";
import { useCartStore } from "../../stores/cartStore";
import { useHomeUiStore } from "../../stores/homeUiStore";

export default function SearchTabScreen() {
	const { products } = useHomeFeed();
	const searchQuery = useHomeUiStore((s) => s.searchQuery);
	const setSearchQuery = useHomeUiStore((s) => s.setSearchQuery);
	const addItem = useCartStore((s) => s.addItem);

	return (
		<ScrollView className="flex-1 bg-black px-4 pt-14">
			<Text className="text-4xl font-bold text-white">Search</Text>
			<TextInput
				className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 text-lg text-white"
				placeholder="Search for BBQ, isaw, drinks..."
				placeholderTextColor="#71717a"
				value={searchQuery}
				onChangeText={setSearchQuery}
			/>

			<View className="mt-5 pb-8">
				{products.map((product) => (
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
				))}
			</View>
		</ScrollView>
	);
}
