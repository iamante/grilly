import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useCartStore } from "../../stores/cartStore";

export default function TabsLayout() {
	const totalItems = useCartStore((s) => s.totalItems());

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor: "#09090b",
					borderTopColor: "#27272a",
				},
				tabBarActiveTintColor: "#f97316",
				tabBarInactiveTintColor: "#a1a1aa",
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="home-outline" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="search"
				options={{
					title: "Search",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="search-outline" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="cart"
				options={{
					title: "Cart",
					tabBarBadge: totalItems > 0 ? totalItems : undefined,
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="cart-outline" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="account"
				options={{
					title: "Account",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="person-outline" size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
