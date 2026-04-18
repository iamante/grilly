import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Pressable,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAuth } from "../../../hooks/useAuth";

export function AuthForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLogin, setIsLogin] = useState(true);
	const [loading, setLoading] = useState(false);
	const [cooldownSeconds, setCooldownSeconds] = useState(0);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const { signInWithPassword, signUp, signInWithOAuth } = useAuth();

	useEffect(() => {
		if (cooldownSeconds <= 0) {
			return;
		}

		const timer = setTimeout(() => {
			setCooldownSeconds((current) => current - 1);
		}, 1000);

		return () => clearTimeout(timer);
	}, [cooldownSeconds]);

	function getFriendlyAuthError(message: string) {
		const normalized = message.toLowerCase();

		if (normalized.includes("user already registered")) {
			return "That email is already registered. Try signing in instead.";
		}

		if (normalized.includes("password should be at least")) {
			return "Your password is too short. Use at least 6 characters.";
		}

		if (normalized.includes("invalid email")) {
			return "Please enter a valid email address.";
		}

		if (normalized.includes("database error saving new user")) {
			return "Supabase could not finish creating your account. Check your auth settings or database trigger setup.";
		}

		if (
			normalized.includes("email rate limit exceeded") ||
			normalized.includes("rate limit")
		) {
			return "Too many signup email attempts were made. Wait a bit before trying again.";
		}

		return message;
	}

	async function handleAuth() {
		if (!email || !password) {
			Alert.alert("Error", "Please fill in all fields");
			return;
		}

		if (!isLogin) {
			if (cooldownSeconds > 0) {
				Alert.alert(
					"Please Wait",
					`Try registering again in ${cooldownSeconds} second${
						cooldownSeconds === 1 ? "" : "s"
					}.`,
				);
				return;
			}

			if (password.length < 6) {
				Alert.alert("Weak Password", "Use a password with at least 6 characters.");
				return;
			}

			if (password !== confirmPassword) {
				Alert.alert("Password Mismatch", "Passwords do not match.");
				return;
			}
		}

		setLoading(true);
		try {
			const { error } = isLogin
				? await signInWithPassword(email, password)
				: await signUp(email, password);

			if (error) {
				if (error.message.toLowerCase().includes("rate limit")) {
					setCooldownSeconds(60);
				}
				Alert.alert("Auth Error", getFriendlyAuthError(error.message));
			} else if (!isLogin) {
				Alert.alert(
					"Account Created",
					"Your account was created. If email confirmation is enabled in Supabase, check your inbox before signing in.",
				);
			}
		} catch (err: any) {
			Alert.alert("Error", err.message || "An unexpected error occurred");
		} finally {
			setLoading(false);
		}
	}

	async function handleSocialAuth(provider: "google" | "facebook") {
		try {
			const { error } = await signInWithOAuth(provider);
			if (error) Alert.alert("OAuth Error", error.message);
		} catch (err: any) {
			Alert.alert("Error", err.message || "An unexpected error occurred");
		}
	}

	return (
		<Animated.View entering={FadeInDown.duration(500)} className="gap-6">
			<View className="rounded-[28px] border border-orange-300/10 bg-orange-500/10 p-4">
				<View className="flex-row rounded-full border border-white/8 bg-black/20 p-1">
					<Pressable
						onPress={() => {
							setIsLogin(true);
							setPassword("");
							setConfirmPassword("");
						}}
						className={`flex-1 rounded-full px-4 py-3 ${
							isLogin ? "bg-orange-500" : "bg-transparent"
						}`}
					>
						<Text
							className={`text-center text-xs font-bold uppercase tracking-[1.3px] ${
								isLogin ? "text-black" : "text-white/55"
							}`}
						>
							Sign In
						</Text>
					</Pressable>
					<Pressable
						onPress={() => {
							setIsLogin(false);
							setPassword("");
							setConfirmPassword("");
						}}
						className={`flex-1 rounded-full px-4 py-3 ${
							!isLogin ? "bg-orange-500" : "bg-transparent"
						}`}
					>
						<Text
							className={`text-center text-xs font-bold uppercase tracking-[1.3px] ${
								!isLogin ? "text-black" : "text-white/55"
							}`}
						>
							Register
						</Text>
					</Pressable>
				</View>

				<View className="mt-4 flex-row gap-3">
					<View className="flex-1 rounded-[22px] border border-white/8 bg-black/20 p-4">
						<Text className="text-[11px] uppercase tracking-[1.2px] text-white/40">
							Access
						</Text>
						<Text className="mt-2 text-lg font-bold text-white">
							{isLogin ? "Fast reorder" : "Fresh account"}
						</Text>
					</View>
					<View className="flex-1 rounded-[22px] border border-white/8 bg-black/20 p-4">
						<Text className="text-[11px] uppercase tracking-[1.2px] text-white/40">
							Benefit
						</Text>
						<Text className="mt-2 text-lg font-bold text-white">
							{isLogin ? "Track every delivery" : "Save addresses"}
						</Text>
					</View>
				</View>
			</View>

			<View className="gap-4">
				<View className="gap-2">
					<Text className="text-xs font-semibold uppercase tracking-[1.8px] text-orange-200/60">
						Email Address
					</Text>
					<View className="flex-row items-center rounded-[22px] border border-white/10 bg-[#160f0c] px-5 py-4">
						<Ionicons name="mail-outline" size={20} color="#9a8d86" />
						<TextInput
							className="ml-3 flex-1 text-base text-white"
							placeholder="grillmaster@email.com"
							placeholderTextColor="#9a8d86"
							value={email}
							onChangeText={setEmail}
							autoCapitalize="none"
							keyboardType="email-address"
						/>
					</View>
				</View>

				<View className="gap-2">
					<Text className="text-xs font-semibold uppercase tracking-[1.8px] text-orange-200/60">
						Password
					</Text>
					<View className="flex-row items-center rounded-[22px] border border-white/10 bg-[#160f0c] px-5 py-4">
						<Ionicons name="lock-closed-outline" size={20} color="#9a8d86" />
						<TextInput
							className="ml-3 flex-1 text-base text-white"
							placeholder="••••••••"
							placeholderTextColor="#9a8d86"
							value={password}
							onChangeText={setPassword}
							secureTextEntry={!showPassword}
						/>
						<Pressable onPress={() => setShowPassword((current) => !current)}>
							<Ionicons
								name={showPassword ? "eye-off-outline" : "eye-outline"}
								size={20}
								color="#9a8d86"
							/>
						</Pressable>
					</View>
				</View>

				{!isLogin ? (
					<View className="gap-2">
						<Text className="text-xs font-semibold uppercase tracking-[1.8px] text-orange-200/60">
							Confirm Password
						</Text>
						<View className="flex-row items-center rounded-[22px] border border-white/10 bg-[#160f0c] px-5 py-4">
							<Ionicons name="shield-checkmark-outline" size={20} color="#9a8d86" />
							<TextInput
								className="ml-3 flex-1 text-base text-white"
								placeholder="••••••••"
								placeholderTextColor="#9a8d86"
								value={confirmPassword}
								onChangeText={setConfirmPassword}
								secureTextEntry={!showConfirmPassword}
							/>
							<Pressable
								onPress={() =>
									setShowConfirmPassword((current) => !current)
								}
							>
								<Ionicons
									name={
										showConfirmPassword ? "eye-off-outline" : "eye-outline"
									}
									size={20}
									color="#9a8d86"
								/>
							</Pressable>
						</View>
					</View>
				) : null}
			</View>

			<TouchableOpacity
				onPress={handleAuth}
				disabled={loading || (!isLogin && cooldownSeconds > 0)}
				activeOpacity={0.8}
				className={`mt-2 flex-row items-center justify-center rounded-full py-4 ${
					loading || (!isLogin && cooldownSeconds > 0)
						? "bg-orange-800/60"
						: "bg-orange-500"
				}`}
			>
				{loading ? (
					<ActivityIndicator color="#000" />
				) : (
					<>
						<Text className="text-base font-bold uppercase tracking-[1.5px] text-black">
							{isLogin
								? "Sign Into The Grill"
								: cooldownSeconds > 0
									? `Try Again In ${cooldownSeconds}s`
									: "Join The Fireline"}
						</Text>
						{cooldownSeconds <= 0 ? (
							<Ionicons
								name="chevron-forward"
								size={18}
								color="black"
								style={{ marginLeft: 8 }}
							/>
						) : null}
					</>
				)}
			</TouchableOpacity>

			<View className="rounded-[22px] border border-white/8 bg-[#160f0c] px-4 py-4">
				<Text className="text-sm leading-6 text-white/55">
					{isLogin
						? "Sign in to manage saved addresses, follow delivery progress, and reorder faster."
						: "Create an account to save delivery details, track orders, and keep your grill profile ready."}
				</Text>
			</View>

			<View className="flex-row items-center gap-4 px-2">
				<View className="h-[1px] flex-1 bg-white/5" />
				<Text className="text-[10px] font-bold uppercase tracking-[1px] text-white/20">
					Or Continue With
				</Text>
				<View className="h-[1px] flex-1 bg-white/5" />
			</View>

			<View className="flex-row gap-4">
				<TouchableOpacity
					onPress={() => handleSocialAuth("google")}
					className="flex-1 flex-row items-center justify-center rounded-[20px] border border-white/10 bg-white/5 py-4"
				>
					<Ionicons name="logo-google" size={20} color="white" />
					<Text className="ml-3 text-sm font-semibold text-white">Google</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => handleSocialAuth("facebook")}
					className="flex-1 flex-row items-center justify-center rounded-[20px] border border-white/10 bg-white/5 py-4"
				>
					<Ionicons name="logo-facebook" size={20} color="white" />
					<Text className="ml-3 text-sm font-semibold text-white">Facebook</Text>
				</TouchableOpacity>
			</View>

			<Text className="text-center text-sm leading-6 text-white/35">
				{isLogin ? "New here? Switch to register above." : "Already have an account? Switch back to sign in above."}
			</Text>
		</Animated.View>
	);
}
