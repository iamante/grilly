import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Pressable,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useAuth } from "../../../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import {
	type SavedAddress,
	getSavedAddresses,
	removeSavedAddress,
	saveAddressSlot,
	updateSavedAddress,
} from "../../cart/utils/savedAddresses";

export function ProfileForm() {
	const { user } = useAuth();
	const { profile, isLoading, isUpdating, updateProfile } = useProfile();
	const [fullName, setFullName] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
	const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
	const [addressLabelDraft, setAddressLabelDraft] = useState("");
	const [addressDraft, setAddressDraft] = useState("");

	useEffect(() => {
		if (profile) {
			setFullName(profile.fullName || "");
			setPhone(profile.phone || "");
			setAddress(profile.defaultAddress || "");
		}
	}, [profile]);

	useEffect(() => {
		if (!user) {
			return;
		}

		let ignore = false;

		(async () => {
			const entries = await getSavedAddresses(user.id);
			if (!ignore) {
				setSavedAddresses(entries);
			}
		})();

		return () => {
			ignore = true;
		};
	}, [user]);

	if (isLoading) {
		return <ActivityIndicator color="#fb923c" />;
	}

	function handleUpdate() {
		if (!profile) return;
		updateProfile({
			id: profile.id,
			fullName,
			phone,
			defaultAddress: address,
		});
	}

	async function handleSaveCurrentAddress() {
		if (!user || !address.trim()) {
			return;
		}

		const updated = await saveAddressSlot(user.id, address);
		setSavedAddresses(updated);
	}

	async function handleRemoveSavedAddress(addressId: string) {
		if (!user) {
			return;
		}

		const updated = await removeSavedAddress(user.id, addressId);
		setSavedAddresses(updated);

		if (editingAddressId === addressId) {
			setEditingAddressId(null);
			setAddressLabelDraft("");
			setAddressDraft("");
		}
	}

	function handleStartEditing(entry: SavedAddress) {
		setEditingAddressId(entry.id);
		setAddressLabelDraft(entry.label);
		setAddressDraft(entry.address);
	}

	async function handleSaveAddressEdits() {
		if (!user || !editingAddressId) {
			return;
		}

		const updated = await updateSavedAddress(user.id, editingAddressId, {
			label: addressLabelDraft,
			address: addressDraft,
		});
		setSavedAddresses(updated);
		setEditingAddressId(null);
		setAddressLabelDraft("");
		setAddressDraft("");
	}

	function handleUseAsDefault(nextAddress: string) {
		setAddress(nextAddress);
	}

	return (
		<View className="gap-5">
			<View className="gap-2">
				<Text className="text-xs font-semibold uppercase tracking-[1.8px] text-orange-200/80">
					Full Name
				</Text>
				<TextInput
					className="rounded-[22px] border border-white/10 bg-[#1c1310] px-5 py-4 text-base text-white"
					placeholder="Juan Dela Cruz"
					placeholderTextColor="#9a8d86"
					value={fullName}
					onChangeText={setFullName}
				/>
			</View>

			<View className="gap-2">
				<Text className="text-xs font-semibold uppercase tracking-[1.8px] text-orange-200/80">
					Phone Number
				</Text>
				<TextInput
					className="rounded-[22px] border border-white/10 bg-[#1c1310] px-5 py-4 text-base text-white"
					placeholder="0917XXXXXXX"
					placeholderTextColor="#9a8d86"
					value={phone}
					onChangeText={setPhone}
					keyboardType="phone-pad"
				/>
			</View>

			<View className="gap-2">
				<Text className="text-xs font-semibold uppercase tracking-[1.8px] text-orange-200/80">
					Delivery Address
				</Text>
				<TextInput
					className="rounded-[22px] border border-white/10 bg-[#1c1310] px-5 py-4 text-base text-white"
					placeholder="House number, Street, Barangay, City"
					placeholderTextColor="#9a8d86"
					value={address}
					onChangeText={setAddress}
					multiline
					numberOfLines={2}
				/>
			</View>

			<View className="rounded-[24px] border border-white/10 bg-[#140d0a] p-4">
				<View className="flex-row items-center justify-between">
					<View className="flex-1 pr-4">
						<Text className="text-xs font-semibold uppercase tracking-[1.8px] text-orange-200/80">
							Saved Addresses
						</Text>
						<Text className="mt-2 text-sm leading-6 text-white/50">
							Keep up to three delivery spots ready for faster checkout.
						</Text>
					</View>
					<Pressable
						onPress={handleSaveCurrentAddress}
						className="rounded-full border border-orange-300/20 bg-orange-500/10 px-3 py-2"
					>
						<Text className="text-xs font-semibold uppercase tracking-[1.2px] text-orange-200">
							Save current
						</Text>
					</Pressable>
				</View>

				{savedAddresses.length === 0 ? (
					<Text className="mt-4 text-sm leading-6 text-white/40">
						No saved addresses yet. Save your current delivery address to reuse it at checkout.
					</Text>
				) : (
					<View className="mt-4 gap-3">
						{savedAddresses.map((entry) => {
							const isDefault = address.trim() === entry.address;
							return (
								<View
									key={entry.id}
									className={`rounded-[20px] border p-4 ${
										isDefault
											? "border-orange-300/30 bg-orange-500/10"
											: "border-white/10 bg-[#1c1310]"
									}`}
								>
									<View className="flex-row items-start justify-between gap-3">
										<View className="flex-1">
											<Text className="text-xs font-semibold uppercase tracking-[1.2px] text-orange-200/80">
												{entry.label}
											</Text>
											<Text className="mt-2 text-base leading-6 text-white/80">
												{entry.address}
											</Text>
										</View>
										{isDefault ? (
											<View className="rounded-full bg-orange-500 px-3 py-1.5">
												<Text className="text-[11px] font-bold uppercase tracking-[1.1px] text-black">
													Default
												</Text>
											</View>
										) : null}
									</View>

									<View className="mt-4 flex-row flex-wrap gap-2">
										<Pressable
											onPress={() => handleUseAsDefault(entry.address)}
											className="rounded-full bg-orange-500 px-3 py-2"
										>
											<Text className="text-[11px] font-bold uppercase tracking-[1.1px] text-black">
												Use as default
											</Text>
										</Pressable>
										<Pressable
											onPress={() => handleStartEditing(entry)}
											className="rounded-full border border-white/10 bg-black/20 px-3 py-2"
										>
											<Text className="text-[11px] font-bold uppercase tracking-[1.1px] text-white">
												Edit
											</Text>
										</Pressable>
										<Pressable
											onPress={() => handleRemoveSavedAddress(entry.id)}
											className="rounded-full border border-red-400/20 bg-red-950/60 px-3 py-2"
										>
											<Text className="text-[11px] font-bold uppercase tracking-[1.1px] text-red-200">
												Remove
											</Text>
										</Pressable>
									</View>
								</View>
							);
						})}
					</View>
				)}

				{editingAddressId ? (
					<View className="mt-4 rounded-[20px] border border-white/10 bg-[#1c1310] p-4">
						<Text className="text-xs font-semibold uppercase tracking-[1.6px] text-orange-200/80">
							Edit saved address
						</Text>
						<TextInput
							className="mt-3 rounded-[18px] border border-white/10 bg-black/20 px-4 py-3 text-base text-white"
							placeholder="Home, Work, Condo"
							placeholderTextColor="#9a8d86"
							value={addressLabelDraft}
							onChangeText={setAddressLabelDraft}
						/>
						<TextInput
							className="mt-3 rounded-[18px] border border-white/10 bg-black/20 px-4 py-3 text-base text-white"
							placeholder="House number, Street, Barangay, City"
							placeholderTextColor="#9a8d86"
							value={addressDraft}
							onChangeText={setAddressDraft}
							multiline
						/>
						<View className="mt-3 flex-row gap-3">
							<Pressable
								onPress={handleSaveAddressEdits}
								className="flex-1 rounded-full bg-orange-500 px-4 py-3"
							>
								<Text className="text-center text-sm font-bold uppercase tracking-[1.1px] text-black">
									Save edits
								</Text>
							</Pressable>
							<Pressable
								onPress={() => {
									setEditingAddressId(null);
									setAddressLabelDraft("");
									setAddressDraft("");
								}}
								className="flex-1 rounded-full border border-white/10 bg-black/20 px-4 py-3"
							>
								<Text className="text-center text-sm font-bold uppercase tracking-[1.1px] text-white">
									Cancel
								</Text>
							</Pressable>
						</View>
					</View>
				) : null}
			</View>

			<TouchableOpacity
				onPress={handleUpdate}
				disabled={isUpdating}
				className="mt-2 items-center justify-center rounded-full bg-orange-500 py-4"
			>
				{isUpdating ? (
					<ActivityIndicator color="#000" />
				) : (
					<Text className="text-base font-bold uppercase tracking-[1.2px] text-black">
						Save Profile
					</Text>
				)}
			</TouchableOpacity>
		</View>
	);
}
