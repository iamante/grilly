import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	Image,
	NativeScrollEvent,
	NativeSyntheticEvent,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	useWindowDimensions,
	View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { FloatingCartBar } from "../../cart/components/FloatingCartBar";
import { useCartStore } from "../../../stores/cartStore";
import { useHomeUiStore } from "../../../stores/homeUiStore";
import { ProductCard } from "../components/ProductCard";
import { useHomeFeed, type HomeProduct } from "../hooks/useHomeFeed";
import { useCategories } from "../hooks/useCategories";

const trendSuggestions = ["Pork BBQ", "Inasal", "Family Tray", "Calamansi"];
const categoryEmojis: Record<string, string> = {
	BBQ: "🔥",
	Ihaw: "🍢",
	"Street Food": "🌙",
	Sides: "🍚",
	Drinks: "🥤",
};
const palette = {
	page: "#130c09",
	surface: "#211512",
	surfaceAlt: "#18100d",
	card: "#2a1915",
	cardDeep: "#1d1210",
	border: "rgba(255,255,255,0.08)",
	borderWarm: "rgba(251,146,60,0.16)",
	amber: "#f59e0b",
	orange: "#fb923c",
	sand: "#f5d7b8",
	textSoft: "rgba(255,245,238,0.68)",
};

export function HomeScreenContainer() {
	const router = useRouter();
	const { products, isLoading: isLoadingProducts } = useHomeFeed();
	const { data: categoriesData = [], isLoading: isLoadingCategories } = useCategories();
	const categories = categoriesData.map(c => c.name);
	const isLoading = isLoadingProducts || isLoadingCategories;
	const { width } = useWindowDimensions();
	const searchQuery = useHomeUiStore((s) => s.searchQuery);
	const selectedCategory = useHomeUiStore((s) => s.selectedCategory);
	const setSearchQuery = useHomeUiStore((s) => s.setSearchQuery);
	const setSelectedCategory = useHomeUiStore((s) => s.setSelectedCategory);
	const [activeHeroIndex, setActiveHeroIndex] = useState(0);
	const heroScrollRef = useRef<ScrollView | null>(null);
	const featuredProducts = products.slice(0, 3);
	const quickPicks = products.slice(3, 7);
	const firelineFavorites = products
		.filter((product) => product.category === "BBQ" || product.category === "Ihaw")
		.slice(0, 4);
	const streetFoodLine = products
		.filter(
			(product) =>
				product.category === "Street Food" || product.category === "Sides",
		)
		.slice(0, 4);
	const drinksAndCooldowns = products
		.filter((product) => product.category === "Drinks")
		.slice(0, 3);
	const heroCardWidth = Math.max(width - 64, 280);

	useEffect(() => {
		if (featuredProducts.length <= 1) {
			return;
		}

		const interval = setInterval(() => {
			setActiveHeroIndex((current) => {
				const next = (current + 1) % featuredProducts.length;
				heroScrollRef.current?.scrollTo({
					x: next * (heroCardWidth + 16),
					animated: true,
				});
				return next;
			});
		}, 3600);

		return () => {
			clearInterval(interval);
		};
	}, [featuredProducts.length, heroCardWidth]);

	function handleHeroScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
		const nextIndex = Math.round(
			event.nativeEvent.contentOffset.x / (heroCardWidth + 16),
		);
		if (!Number.isNaN(nextIndex)) {
			setActiveHeroIndex(nextIndex);
		}
	}

	return (
		<View className="flex-1" style={{ backgroundColor: palette.page }}>
			<ScrollView className="flex-1" contentContainerClassName="pb-36">
				<View className="px-4 pt-14">
				<Animated.View
					entering={FadeInDown.duration(320)}
					className="mb-4 flex-row items-center justify-between rounded-[24px] px-4 py-3"
					style={{
						backgroundColor: palette.surfaceAlt,
						borderColor: palette.border,
						borderWidth: 1,
					}}
				>
					<View>
						<Text className="text-[11px] font-semibold uppercase tracking-[1.5px]" style={{ color: palette.sand }}>
							Deliver to
						</Text>
						<Text className="mt-1 text-sm font-bold text-white">
							Makati City • 25-35 min
						</Text>
					</View>
					<View className="rounded-full px-3 py-2" style={{ backgroundColor: "rgba(245, 158, 11, 0.12)" }}>
						<Text className="text-[11px] font-bold uppercase tracking-[1.1px]" style={{ color: palette.amber }}>
							Free Delivery
						</Text>
					</View>
				</Animated.View>
				<Animated.View
					entering={FadeInDown.duration(420)}
					className="overflow-hidden rounded-[34px] pb-6 pt-5"
					style={{
						backgroundColor: palette.surface,
						borderColor: palette.borderWarm,
						borderWidth: 1,
					}}
				>
					<View className="absolute -right-10 -top-10 h-40 w-40 rounded-full" style={{ backgroundColor: "rgba(251,146,60,0.14)" }} />
					<View className="absolute -left-10 bottom-0 h-28 w-28 rounded-full" style={{ backgroundColor: "rgba(245,158,11,0.10)" }} />

					<View className="px-5">
						<View className="flex-row items-center justify-between">
						<View className="rounded-full px-3 py-1" style={{ backgroundColor: "rgba(251,146,60,0.10)", borderColor: palette.borderWarm, borderWidth: 1 }}>
							<Text className="text-xs font-semibold uppercase tracking-[1.8px]" style={{ color: palette.sand }}>
								Grill House
							</Text>
						</View>
						<View className="rounded-full px-3 py-1" style={{ backgroundColor: "rgba(0,0,0,0.18)", borderColor: palette.border, borderWidth: 1 }}>
							<Text className="text-xs font-medium text-white/80">
								Fastest slots tonight
							</Text>
						</View>
						</View>

						<Text className="mt-5 text-5xl font-bold leading-[56px] text-white">
							Smoky Filipino
						</Text>
						<Text className="text-5xl font-bold leading-[56px]" style={{ color: palette.orange }}>
							BBQ, on demand.
						</Text>

						<Text className="mt-4 max-w-[300px] text-base leading-6" style={{ color: palette.textSoft }}>
							Charred skewers, inasal, bangus, and cold drinks packed for late
							lunches and midnight cravings.
						</Text>
						<View className="mt-5 flex-row gap-2">
							<View className="rounded-full px-3 py-2" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
								<Text className="text-[11px] font-semibold uppercase tracking-[1.1px]" style={{ color: palette.textSoft }}>
									4.9 avg rating
								</Text>
							</View>
							<View className="rounded-full px-3 py-2" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
								<Text className="text-[11px] font-semibold uppercase tracking-[1.1px]" style={{ color: palette.textSoft }}>
									1k+ monthly orders
								</Text>
							</View>
						</View>
					</View>

					{featuredProducts.length > 0 ? (
						<>
							<ScrollView
								ref={heroScrollRef}
								horizontal
								pagingEnabled={false}
								decelerationRate="fast"
								snapToInterval={heroCardWidth + 16}
								snapToAlignment="start"
								showsHorizontalScrollIndicator={false}
								contentContainerClassName="gap-4 px-5"
								className="mt-6"
								onMomentumScrollEnd={handleHeroScrollEnd}
							>
								{featuredProducts.map((product, index) => (
									<Pressable
										key={product.id}
									onPress={() => router.push(`/product/${product.id}`)}
									style={{ width: heroCardWidth }}
									className="rounded-[30px] p-5"
									style={{
										backgroundColor:
											index === activeHeroIndex ? "rgba(251,146,60,0.14)" : palette.cardDeep,
										borderColor:
											index === activeHeroIndex ? palette.borderWarm : palette.border,
										borderWidth: 1,
									}}
								>
										<View className="flex-row items-start justify-between">
											<View className="rounded-full px-3 py-1" style={{ backgroundColor: "rgba(0,0,0,0.20)", borderColor: palette.border, borderWidth: 1 }}>
												<Text className="text-xs font-semibold uppercase tracking-[1.6px]" style={{ color: palette.sand }}>
													{index === 0 ? "Spotlight plate" : product.category}
												</Text>
											</View>
											<Text className="rounded-full px-3 py-1 text-sm font-semibold" style={{ backgroundColor: "rgba(0,0,0,0.20)", color: palette.amber }}>
												★ {product.rating.toFixed(1)}
											</Text>
										</View>

										<Text className="mt-5 text-3xl font-bold leading-10 text-white">
											{product.name}
										</Text>
										<Text className="mt-3 text-base leading-6" style={{ color: palette.textSoft }}>
											{product.description}
										</Text>

										<View className="mt-6 flex-row items-end justify-between">
											<View>
												<Text className="text-xs uppercase tracking-[1.2px] text-white/45">
													Starting at
												</Text>
											<Text className="mt-1 text-4xl font-bold" style={{ color: palette.orange }}>
												₱{product.price.toFixed(0)}
											</Text>
										</View>
										<Text className="rounded-full px-4 py-3 text-sm font-bold uppercase tracking-[1.2px] text-black" style={{ backgroundColor: palette.amber }}>
											View details
										</Text>
									</View>
									</Pressable>
								))}
							</ScrollView>

							<View className="mt-4 flex-row items-center justify-center gap-2">
								{featuredProducts.map((product, index) => (
									<View
										key={product.id}
										className={`rounded-full ${
											index === activeHeroIndex
												? "h-2.5 w-8"
												: "h-2.5 w-2.5"
										}`}
										style={{
											backgroundColor:
												index === activeHeroIndex ? palette.orange : "rgba(255,255,255,0.20)",
										}}
									/>
								))}
							</View>
						</>
					) : null}

					<View className="mt-6 flex-row gap-3 px-5">
						<View className="flex-1 rounded-[24px] p-4" style={{ backgroundColor: "rgba(0,0,0,0.18)", borderColor: palette.border, borderWidth: 1 }}>
							<Text className="text-xs uppercase tracking-[1.6px] text-white/45">
								Delivery
							</Text>
							<Text className="mt-2 text-2xl font-bold text-white">
								25 mins
							</Text>
							<Text className="mt-1 text-sm text-white/55">Hot-off-the-grill</Text>
						</View>
						<View className="flex-1 rounded-[24px] p-4" style={{ backgroundColor: "rgba(251,146,60,0.10)", borderColor: palette.borderWarm, borderWidth: 1 }}>
							<Text className="text-xs uppercase tracking-[1.6px]" style={{ color: palette.sand }}>
								Today
							</Text>
							<Text className="mt-2 text-2xl font-bold" style={{ color: palette.orange }}>
								Free drink
							</Text>
							<Text className="mt-1 text-sm" style={{ color: palette.sand }}>
								Orders over ₱399
							</Text>
						</View>
					</View>
				</Animated.View>

				<Animated.View
					entering={FadeInDown.delay(60).duration(420)}
					className="mt-5 rounded-[28px] px-4 py-4"
					style={{ backgroundColor: "rgba(0,0,0,0.18)", borderColor: palette.border, borderWidth: 1 }}
				>
					<Text className="text-xs font-semibold uppercase tracking-[1.8px]" style={{ color: palette.sand }}>
						Search the grill
					</Text>
					<TextInput
						className="mt-3 rounded-[22px] px-5 py-4 text-lg text-white"
						style={{ backgroundColor: palette.cardDeep, borderColor: palette.border, borderWidth: 1 }}
						placeholder="Search for BBQ, isaw, drinks..."
						placeholderTextColor="#9a8d86"
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						className="mt-4"
					>
						<View className="flex-row gap-2">
							{trendSuggestions.map((item) => (
								<Pressable
									key={item}
									onPress={() => setSearchQuery(item)}
									className="rounded-full px-3 py-2"
									style={{ backgroundColor: palette.card, borderColor: palette.border, borderWidth: 1 }}
								>
									<Text className="text-xs font-semibold uppercase tracking-[1.1px]" style={{ color: palette.sand }}>
										{item}
									</Text>
								</Pressable>
							))}
						</View>
					</ScrollView>
				</Animated.View>

				<Animated.View entering={FadeInDown.delay(120).duration(420)} className="mt-6">
					<View className="flex-row items-end justify-between">
						<View>
							<Text className="text-xs font-semibold uppercase tracking-[1.8px]" style={{ color: palette.sand }}>
								Explore
							</Text>
							<Text className="mt-1 text-3xl font-bold text-white">
								Menu moods
							</Text>
						</View>
						<Text className="text-sm text-white/50">
							{products.length} result{products.length === 1 ? "" : "s"}
						</Text>
					</View>

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
										className="rounded-full px-5 py-3 text-sm font-semibold uppercase tracking-[1.2px]"
										style={{
											backgroundColor: active ? palette.amber : palette.cardDeep,
											borderColor: active ? palette.amber : palette.border,
											borderWidth: 1,
										}}
									>
										<Text style={{ color: active ? "#130c09" : "#f4e7dc" }}>
											{categoryEmojis[category] ? `${categoryEmojis[category]} ` : ""}
											{category}
										</Text>
									</Text>
								);
							})}
						</View>
					</ScrollView>
				</Animated.View>

				<Animated.View
					entering={FadeInDown.delay(150).duration(420)}
					className="mt-6 overflow-hidden rounded-[30px] p-4"
					style={{ backgroundColor: "rgba(251,146,60,0.10)", borderColor: palette.borderWarm, borderWidth: 1 }}
				>
					<View className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-yellow-300/10" />
					<View className="flex-row items-end justify-between">
						<View>
							<Text className="text-xs font-semibold uppercase tracking-[1.6px]" style={{ color: palette.sand }}>
								Deals for you
							</Text>
							<Text className="mt-1 text-2xl font-bold text-white">
								Free delivery + drink
							</Text>
						</View>
						<Text className="rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[1.2px]" style={{ backgroundColor: "rgba(0,0,0,0.18)", color: palette.sand }}>
							Limited
						</Text>
					</View>
					<Text className="mt-3 text-base leading-6" style={{ color: palette.textSoft }}>
						Use code <Text className="font-bold" style={{ color: palette.orange }}>GRILLY25</Text> for
						free delivery and a house drink on orders above ₱399.
					</Text>
					<View className="mt-4 flex-row gap-2">
						<View className="rounded-full px-3 py-2" style={{ backgroundColor: "rgba(0,0,0,0.18)" }}>
							<Text className="text-[11px] font-bold uppercase tracking-[1.1px]" style={{ color: palette.sand }}>
								Applies tonight
							</Text>
						</View>
						<View className="rounded-full px-3 py-2" style={{ backgroundColor: "rgba(0,0,0,0.18)" }}>
							<Text className="text-[11px] font-bold uppercase tracking-[1.1px]" style={{ color: palette.sand }}>
								Stack with bundles
							</Text>
						</View>
					</View>
				</Animated.View>

				<Animated.View entering={FadeInDown.delay(180).duration(420)} className="mt-7">
					<View className="flex-row items-end justify-between">
						<View>
							<Text className="text-xs font-semibold uppercase tracking-[1.8px] text-orange-200/80">
								Editor&apos;s cut
							</Text>
							<Text className="mt-1 text-3xl font-bold text-white">
								Featured tonight
							</Text>
						</View>
						<Text className="text-sm text-white/45">Swipe the fireline</Text>
					</View>

					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						className="mt-4"
					>
						<View className="flex-row gap-4">
							{featuredProducts.map((product, index) => (
								<Pressable
									key={product.id}
									onPress={() => router.push(`/product/${product.id}`)}
									className={`w-72 rounded-[30px] border px-5 py-5 ${
										index === 0
											? "border-orange-300/15 bg-orange-500/12"
											: "border-white/10 bg-[#1a110e]"
									}`}
								>
									<View className="relative -mx-5 -mt-5 mb-5 h-40 overflow-hidden rounded-t-[30px]">
										<Image
											source={{ uri: product.imageUrl }}
											className="h-full w-full"
											resizeMode="cover"
										/>
										<View className="absolute inset-0 bg-black/30" />
										<View className="absolute left-4 right-4 top-4 flex-row items-center justify-between">
											<Text className="rounded-full bg-black/25 px-3 py-1 text-xs font-semibold uppercase tracking-[1.3px] text-orange-100">
												{index === 0 ? "Chef recommendation" : product.category}
											</Text>
											<Text className="rounded-full bg-black/25 px-3 py-1 text-sm font-semibold text-amber-300">
												★ {product.rating.toFixed(1)}
											</Text>
										</View>
									</View>
									<Text className="text-2xl font-bold text-white">
										{product.name}
									</Text>
									<Text className="mt-2 text-base leading-6 text-white/65">
										{product.description}
									</Text>

									<View className="mt-5 flex-row items-end justify-between">
										<View>
											<Text className="text-xs uppercase tracking-[1.2px] text-white/45">
												From
											</Text>
											<Text className="mt-1 text-3xl font-bold text-orange-300">
												₱{product.price.toFixed(0)}
											</Text>
										</View>
										<View className="rounded-full bg-orange-500 px-4 py-3">
											<Text className="text-sm font-bold uppercase tracking-[1.1px] text-black">
												View
											</Text>
										</View>
									</View>
								</Pressable>
							))}
						</View>
					</ScrollView>
				</Animated.View>

				<Animated.View
					entering={FadeInDown.delay(240).duration(420)}
					className="mt-7 flex-row gap-3"
				>
					<View className="flex-1 rounded-[28px] border border-white/10 bg-[#1a110e] p-4">
						<Text className="text-xs font-semibold uppercase tracking-[1.6px] text-orange-200/75">
							Group order
						</Text>
						<Text className="mt-2 text-2xl font-bold text-white">
							Bundle up
						</Text>
						<Text className="mt-2 text-sm leading-5 text-white/60">
							Mix skewers, rice, and drinks for barkada nights.
						</Text>
					</View>
					<View className="flex-1 rounded-[28px] border border-orange-300/10 bg-orange-500/10 p-4">
						<Text className="text-xs font-semibold uppercase tracking-[1.6px] text-orange-200/75">
							Peak hour
						</Text>
						<Text className="mt-2 text-2xl font-bold text-white">
							6PM rush
						</Text>
						<Text className="mt-2 text-sm leading-5 text-white/60">
							Order early for the fastest delivery slot tonight.
						</Text>
					</View>
				</Animated.View>

				<Animated.View
					entering={FadeInDown.delay(300).duration(420)}
					className="mt-7 flex-row items-end justify-between"
				>
					<View>
						<Text className="text-xs font-semibold uppercase tracking-[1.8px] text-orange-200/80">
							Signature picks
						</Text>
						<Text className="mt-1 text-3xl font-bold text-white">
							Today&apos;s specials
						</Text>
					</View>
					<Text className="text-sm text-white/45">Fresh off the fire</Text>
				</Animated.View>

				{quickPicks.length > 0 ? (
					<Animated.View
						entering={FadeInDown.delay(360).duration(420)}
						className="mt-4 rounded-[30px] border border-white/8 bg-black/20 p-4"
					>
						<View className="flex-row items-end justify-between">
							<View>
								<Text className="text-xs font-semibold uppercase tracking-[1.6px] text-orange-200/75">
									Quick picks
								</Text>
								<Text className="mt-1 text-2xl font-bold text-white">
									Add-on favorites
								</Text>
							</View>
							<Text className="text-sm text-white/40">Built for combos</Text>
						</View>

						<View className="mt-4 gap-3">
							{quickPicks.map((product) => (
								<Pressable
									key={product.id}
									onPress={() => router.push(`/product/${product.id}`)}
									className="flex-row items-center justify-between rounded-[24px] border border-white/8 bg-[#1a110e] px-4 py-4"
								>
									<View className="flex-1 pr-4">
										<Text className="text-lg font-bold text-white">
											{product.name}
										</Text>
										<Text className="mt-1 text-sm text-white/55" numberOfLines={2}>
											{product.description}
										</Text>
									</View>
									<View className="items-end">
										<Text className="text-xs uppercase tracking-[1.2px] text-white/40">
											From
										</Text>
										<Text className="mt-1 text-xl font-bold text-orange-300">
											₱{product.price.toFixed(0)}
										</Text>
									</View>
								</Pressable>
							))}
						</View>
					</Animated.View>
				) : null}

				<Animated.View entering={FadeInDown.delay(420).duration(420)} className="mt-4">
					{isLoading ? (
						<View className="rounded-[28px] border border-white/10 bg-black/20 px-4 py-10">
							<ActivityIndicator color="#fb923c" />
							<Text className="mt-4 text-center text-white/55">
								Preparing the menu...
							</Text>
						</View>
					) : products.length === 0 ? (
						<View className="rounded-[28px] border border-white/10 bg-black/20 px-5 py-10">
							<Text className="text-center text-2xl font-bold text-white">
								No matches yet
							</Text>
							<Text className="mt-2 text-center text-base leading-6 text-white/60">
								Try a broader search or switch categories to uncover more grill
								favorites.
							</Text>
						</View>
					) : (
						<View className="gap-5">
							{firelineFavorites.length > 0 ? (
								<CuratedRow
									title="Fireline favorites"
									subtitle="Big grill energy"
									products={firelineFavorites}
								/>
							) : null}

							{streetFoodLine.length > 0 ? (
								<View className="rounded-[30px] border border-white/8 bg-black/20 p-4">
									<View className="flex-row items-end justify-between">
										<View>
											<Text className="text-xs font-semibold uppercase tracking-[1.6px] text-orange-200/75">
												After dark
											</Text>
											<Text className="mt-1 text-2xl font-bold text-white">
												Street food line
											</Text>
										</View>
										<Text className="text-sm text-white/40">Snackable heat</Text>
									</View>

									<View className="mt-4 gap-3">
										{streetFoodLine.map((product) => (
											<Pressable
												key={product.id}
												onPress={() => router.push(`/product/${product.id}`)}
												className="rounded-[24px] border border-white/8 bg-[#1a110e] px-4 py-4"
											>
												<View className="flex-row items-start justify-between">
													<View className="flex-1 pr-4">
														<Text className="text-lg font-bold text-white">
															{product.name}
														</Text>
														<Text className="mt-1 text-sm text-white/55">
															{product.description}
														</Text>
													</View>
													<View className="items-end">
														<Text className="rounded-full bg-orange-500/12 px-3 py-1 text-xs font-semibold uppercase tracking-[1.2px] text-orange-200">
															{product.category}
														</Text>
														<Text className="mt-3 text-xl font-bold text-orange-300">
															₱{product.price.toFixed(0)}
														</Text>
													</View>
												</View>
											</Pressable>
										))}
									</View>
								</View>
							) : null}

							{drinksAndCooldowns.length > 0 ? (
								<CuratedRow
									title="Cool-down pairings"
									subtitle="Drinks and resets"
									products={drinksAndCooldowns}
								/>
							) : null}

							<View>
								<Text className="mb-4 text-xs font-semibold uppercase tracking-[1.8px] text-orange-200/80">
									Full showcase
								</Text>
								{products.map((product) => (
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
								))}
							</View>
						</View>
					)}
				</Animated.View>
				</View>
			</ScrollView>
			<FloatingCartBar />
		</View>
	);
}

type CuratedRowProps = {
	title: string;
	subtitle: string;
	products: HomeProduct[];
};

function CuratedRow({ title, subtitle, products }: CuratedRowProps) {
	const router = useRouter();
	return (
		<Animated.View entering={FadeInDown.duration(420)} className="rounded-[30px] border border-white/8 bg-black/20 p-4">
			<View className="flex-row items-end justify-between">
				<View>
					<Text className="text-xs font-semibold uppercase tracking-[1.6px] text-orange-200/75">
						{subtitle}
					</Text>
					<Text className="mt-1 text-2xl font-bold text-white">{title}</Text>
				</View>
				<Text className="text-sm text-white/40">Curated lane</Text>
			</View>

			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				className="mt-4"
			>
				<View className="flex-row gap-3">
					{products.map((product) => (
						<Pressable
							key={product.id}
							onPress={() => router.push(`/product/${product.id}`)}
							className="w-52 overflow-hidden rounded-[24px] border border-white/8 bg-[#1a110e] active:opacity-90"
						>
							<View className="relative h-28">
								<Image
									source={{ uri: product.imageUrl }}
									className="h-full w-full"
									resizeMode="cover"
								/>
								<View className="absolute inset-0 bg-black/30" />
								<View className="absolute left-3 top-3 rounded-full bg-black/25 px-3 py-1">
									<Text className="text-[11px] font-semibold uppercase tracking-[1.1px] text-orange-100">
										{product.category}
									</Text>
								</View>
							</View>
							<View className="px-4 py-4">
								<Text className="text-xl font-bold text-white">
									{product.name}
								</Text>
								<Text className="mt-2 text-sm leading-5 text-white/55" numberOfLines={3}>
									{product.description}
								</Text>
								<View className="mt-5 flex-row items-end justify-between">
									<Text className="text-2xl font-bold text-orange-300">
										₱{product.price.toFixed(0)}
									</Text>
									<Text className="text-sm font-semibold text-amber-300">
										★ {product.rating.toFixed(1)}
									</Text>
								</View>
							</View>
						</Pressable>
					))}
				</View>
			</ScrollView>
		</Animated.View>
	);
}
