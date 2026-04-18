import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	Pressable,
	ScrollView,
	Text,
	View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useProduct } from "../../features/home/hooks/useProduct";
import { useCartStore } from "../../stores/cartStore";

export default function ProductDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { data: product, isLoading, isError } = useProduct(id!);
	const addItem = useCartStore((s) => s.addItem);

	const [sauce, setSauce] = useState("Soy-Calamansi");
	const [heatLevel, setHeatLevel] = useState<"Mild" | "Original" | "Fire">(
		"Original",
	);
	const [extraRice, setExtraRice] = useState(false);
	const [extraAtchara, setExtraAtchara] = useState(false);

	if (isLoading) {
		return (
			<View className="flex-1 items-center justify-center bg-neutral-950">
				<ActivityIndicator size="large" color="#fb923c" />
			</View>
		);
	}

	if (isError || !product) {
		return (
			<View className="flex-1 items-center justify-center bg-neutral-950">
				<Text className="text-white">Product not found</Text>
				<Pressable onPress={() => router.back()} className="mt-4">
					<Text className="text-orange-400">Go Back</Text>
				</Pressable>
			</View>
		);
	}

	const handleAddTray = () => {
		addItem({
			id: product.id,
			name: product.name,
			price: product.price + (extraRice ? 25 : 0) + (extraAtchara ? 15 : 0),
			imageUrl: product.imageUrl,
			customizations: {
				sauce,
				heatLevel,
				extraRice,
				extraAtchara,
			},
		});
		router.back();
	};

	const totalPrice =
		product.price + (extraRice ? 25 : 0) + (extraAtchara ? 15 : 0);

	return (
		<View className="flex-1 bg-neutral-950">
			<ScrollView
				className="flex-1"
				contentContainerStyle={{ paddingBottom: 140 }}
				showsVerticalScrollIndicator={false}
			>
				{/* Hero Image */}
				<View className="relative h-[480px]">
					<Animated.Image
						entering={FadeIn.duration(600)}
						source={{ uri: product.imageUrl }}
						className="h-full w-full"
						resizeMode="cover"
					/>
					<View className="absolute inset-0 bg-black/40" />
					<Pressable
						onPress={() => router.back()}
						style={{ top: insets.top + 10 }}
						className="absolute left-6 h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/50"
					>
						<Ionicons name="arrow-back" size={24} color="white" />
					</Pressable>

					<View className="absolute bottom-10 left-6 right-6">
						<View className="mb-3 self-start rounded-full bg-orange-500/90 px-3 py-1">
							<Text className="text-[10px] font-bold uppercase tracking-[2px] text-black">
								{product.category}
							</Text>
						</View>
						<Text className="text-5xl font-bold leading-[56px] text-white">
							{product.name}
						</Text>
						<View className="mt-4 flex-row items-center">
							<Text className="text-lg font-bold text-amber-400">
								★ {product.rating.toFixed(1)}
							</Text>
							<View className="mx-3 h-4 w-[1px] bg-white/30" />
							<Text className="text-sm text-white/60">25-35 mins</Text>
						</View>
					</View>
				</View>

				{/* Content */}
				<Animated.View
					entering={FadeInDown.delay(200).duration(500)}
					className="p-6"
				>
					<View className="rounded-[28px] border border-orange-300/10 bg-orange-500/10 p-4">
						<View className="flex-row items-center justify-between">
							<Text className="text-xs font-semibold uppercase tracking-[1.6px] text-orange-200/80">
								Limited-time deal
							</Text>
							<Text className="rounded-full bg-black/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[1.4px] text-orange-100">
								Hot
							</Text>
						</View>
						<Text className="mt-2 text-xl font-bold text-white">
							Free delivery when paired with any drink today
						</Text>
						<Text className="mt-2 text-sm leading-6 text-white/65">
							Popular with grilled rice bowls and calamansi coolers between 5PM
							and 8PM.
						</Text>
					</View>

					<View className="mt-5 flex-row gap-3">
						<View className="flex-1 rounded-[24px] border border-white/10 bg-neutral-900 p-4">
							<Text className="text-xs uppercase tracking-[1.4px] text-neutral-500">
								Delivery
							</Text>
							<Text className="mt-2 text-xl font-bold text-white">25-35 min</Text>
							<Text className="mt-1 text-sm text-neutral-500">Fastest slot</Text>
						</View>
						<View className="flex-1 rounded-[24px] border border-white/10 bg-neutral-900 p-4">
							<Text className="text-xs uppercase tracking-[1.4px] text-neutral-500">
								Reviews
							</Text>
							<Text className="mt-2 text-xl font-bold text-white">
								{product.rating.toFixed(1)} / 5
							</Text>
							<Text className="mt-1 text-sm text-neutral-500">Highly reordered</Text>
						</View>
					</View>

					<Text className="text-base leading-6 text-neutral-400">
						{product.description}
					</Text>

					<View className="mt-6 rounded-[24px] border border-white/10 bg-neutral-900 p-4">
						<Text className="text-xs font-semibold uppercase tracking-[1.6px] text-orange-200/80">
							Why people order this
						</Text>
						<View className="mt-3 gap-2">
							<Text className="text-sm text-white/70">
								• Smoky, savory profile that travels well for delivery
							</Text>
							<Text className="text-sm text-white/70">
								• Best paired with extra rice and spiced vinegar
							</Text>
							<Text className="text-sm text-white/70">
								• Frequent pick for barkada trays and late dinners
							</Text>
						</View>
					</View>

					{/* Sauce Selection */}
					<Text className="mt-8 text-xl font-bold text-white">Select Sauce</Text>
					<View className="mt-4 flex-row flex-wrap gap-3">
						{["Soy-Calamansi", "Spicy Vinegar", "Sweet BBQ"].map((s) => (
							<Pressable
								key={s}
								onPress={() => setSauce(s)}
								className={`rounded-2xl border px-5 py-3 ${
									sauce === s
										? "border-orange-500 bg-orange-500/10"
										: "border-neutral-800 bg-neutral-900"
								}`}
							>
								<Text
									className={
										sauce === s ? "font-bold text-orange-400" : "text-neutral-500"
									}
								>
									{s}
								</Text>
							</Pressable>
						))}
					</View>

					{/* Heat Level */}
					<Text className="mt-8 text-xl font-bold text-white">Heat Level</Text>
					<View className="mt-4 flex-row gap-3">
						{["Mild", "Original", "Fire"].map((h) => (
							<Pressable
								key={h}
								onPress={() => setHeatLevel(h as any)}
								className={`flex-1 items-center rounded-2xl border py-4 ${
									heatLevel === h
										? "border-orange-500 bg-orange-500/10"
										: "border-neutral-800 bg-neutral-900"
								}`}
							>
								<Text
									className={
										heatLevel === h
											? "font-bold text-orange-400"
											: "text-neutral-500"
									}
								>
									{h}
								</Text>
							</Pressable>
						))}
					</View>

					{/* Add-ons */}
					<Text className="mt-8 text-xl font-bold text-white">Add-ons</Text>
					<View className="mt-4 gap-3">
						<Pressable
							onPress={() => setExtraRice(!extraRice)}
							className={`flex-row items-center justify-between rounded-2xl border p-5 ${
								extraRice
									? "border-orange-500 bg-orange-500/10"
									: "border-neutral-800 bg-neutral-900"
							}`}
						>
							<View className="flex-row items-center">
								<View
									className={`mr-4 h-6 w-6 items-center justify-center rounded-lg border ${
										extraRice
											? "border-orange-500 bg-orange-500"
											: "border-neutral-700 bg-neutral-800"
									}`}
								>
									{extraRice && (
										<Ionicons name="checkmark" size={16} color="black" />
									)}
								</View>
								<Text
									className={
										extraRice ? "font-bold text-white" : "text-neutral-400"
									}
								>
									Extra Rice
								</Text>
							</View>
							<Text
								className={
									extraRice ? "font-bold text-orange-400" : "text-neutral-500"
								}
							>
								+ ₱25
							</Text>
						</Pressable>

						<Pressable
							onPress={() => setExtraAtchara(!extraAtchara)}
							className={`flex-row items-center justify-between rounded-2xl border p-5 ${
								extraAtchara
									? "border-orange-500 bg-orange-500/10"
									: "border-neutral-800 bg-neutral-900"
							}`}
						>
							<View className="flex-row items-center">
								<View
									className={`mr-4 h-6 w-6 items-center justify-center rounded-lg border ${
										extraAtchara
											? "border-orange-500 bg-orange-500"
											: "border-neutral-700 bg-neutral-800"
									}`}
								>
									{extraAtchara && (
										<Ionicons name="checkmark" size={16} color="black" />
									)}
								</View>
								<Text
									className={
										extraAtchara ? "font-bold text-white" : "text-neutral-400"
									}
								>
									Extra Atchara
								</Text>
							</View>
							<Text
								className={
									extraAtchara ? "font-bold text-orange-400" : "text-neutral-500"
								}
							>
								+ ₱15
							</Text>
						</Pressable>
					</View>
				</Animated.View>
			</ScrollView>

			{/* Sticky Footer */}
			<View
				style={{ paddingBottom: insets.bottom + 20 }}
				className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-neutral-900/95 px-6 pt-6"
			>
				<View className="flex-row items-center justify-between">
					<View>
						<Text className="text-xs uppercase tracking-[2px] text-neutral-500">
							Total Price
						</Text>
						<Text className="mt-1 text-3xl font-bold text-white">
							₱{totalPrice.toFixed(0)}
						</Text>
					</View>
					<View className="flex-row items-center gap-3">
						<Pressable
							onPress={() => router.back()}
							className="rounded-full border border-white/15 bg-neutral-800 px-6 py-5 active:bg-neutral-700"
						>
							<Text className="text-base font-bold uppercase tracking-[1px] text-white">
								Cancel
							</Text>
						</Pressable>
						<Pressable
							onPress={handleAddTray}
							className="rounded-full bg-orange-500 px-8 py-5 active:bg-orange-600"
						>
							<Text className="text-lg font-bold uppercase tracking-[1px] text-black">
								Add to Tray
							</Text>
						</Pressable>
					</View>
				</View>
			</View>
		</View>
	);
}
