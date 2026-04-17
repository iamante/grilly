import { Text, View } from "react-native";
import { useAuth } from "../../hooks/useAuth";

export default function AccountTabScreen() {
	const { user, loading, signOut } = useAuth();

	return (
		<View className="flex-1 bg-black px-4 pt-14">
			<Text className="text-4xl font-bold text-white">Account</Text>

			{loading ? (
				<Text className="mt-4 text-zinc-400">Loading account...</Text>
			) : user ? (
				<View className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
					<Text className="text-lg text-zinc-300">Logged in as</Text>
					<Text className="mt-1 text-xl font-semibold text-white">
						{user.email}
					</Text>

					<Text
						className="mt-4 rounded-xl bg-red-950 px-4 py-3 text-center text-red-300"
						onPress={() => signOut()}
					>
						Sign Out
					</Text>
				</View>
			) : (
				<View className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
					<Text className="text-zinc-300">
						You are not signed in yet. Add your auth screens next.
					</Text>
				</View>
			)}
		</View>
	);
}
