import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useCartStore } from "../../stores/cartStore";

export default function TabsLayout() {
	const totalItems = useCartStore((s) => s.totalItems());

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				sceneStyle: {
					backgroundColor: "#120b08",
				},
				tabBarStyle: {
					backgroundColor: "#140d0a",
					borderTopColor: "rgba(255,255,255,0.06)",
					height: 78,
					paddingTop: 10,
					paddingBottom: 14,
				},
				tabBarActiveTintColor: "#fb923c",
				tabBarInactiveTintColor: "#9a8d86",
				tabBarLabelStyle: {
					fontSize: 11,
					fontWeight: "700",
					letterSpacing: 0.6,
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color, size, focused }) => (
						<Ionicons
							name={focused ? "flame" : "flame-outline"}
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="search"
				options={{
					title: "Search",
					tabBarIcon: ({ color, size, focused }) => (
						<Ionicons
							name={focused ? "search" : "search-outline"}
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="cart"
				options={{
					title: "Cart",
					tabBarBadge: totalItems > 0 ? totalItems : undefined,
					tabBarBadgeStyle: {
						backgroundColor: "#fb923c",
						color: "#120b08",
						fontWeight: "700",
					},
					tabBarIcon: ({ color, size, focused }) => (
						<Ionicons
							name={focused ? "bag-handle" : "bag-handle-outline"}
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="account"
				options={{
					title: "Account",
					tabBarIcon: ({ color, size, focused }) => (
						<Ionicons
							name={focused ? "person-circle" : "person-circle-outline"}
							size={size}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
