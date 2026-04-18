import * as SecureStore from "expo-secure-store";

export type SavedAddress = {
	id: string;
	label: string;
	address: string;
};

const ADDRESS_LIMIT = 3;

function getStorageKey(userId: string) {
	return `saved-addresses:${userId}`;
}

export async function getSavedAddresses(userId: string) {
	const raw = await SecureStore.getItemAsync(getStorageKey(userId));

	if (!raw) {
		return [] as SavedAddress[];
	}

	try {
		const parsed = JSON.parse(raw) as SavedAddress[];
		return parsed.filter((item) => item.address.trim().length > 0);
	} catch {
		return [] as SavedAddress[];
	}
}

export async function persistSavedAddresses(
	userId: string,
	addresses: SavedAddress[],
) {
	await SecureStore.setItemAsync(
		getStorageKey(userId),
		JSON.stringify(addresses.slice(0, ADDRESS_LIMIT)),
	);
}

export async function saveAddressSlot(userId: string, address: string) {
	const trimmed = address.trim();
	if (!trimmed) {
		return [] as SavedAddress[];
	}

	const existing = await getSavedAddresses(userId);
	const duplicate = existing.find(
		(item) => item.address.toLowerCase() === trimmed.toLowerCase(),
	);

	if (duplicate) {
		return existing;
	}

	const nextLabel = ["Home", "Work", "Saved"][existing.length] ?? `Saved ${existing.length + 1}`;
	const updated = [
		{
			id: `${Date.now()}`,
			label: nextLabel,
			address: trimmed,
		},
		...existing,
	].slice(0, ADDRESS_LIMIT);

	await persistSavedAddresses(userId, updated);
	return updated;
}

export async function removeSavedAddress(userId: string, addressId: string) {
	const existing = await getSavedAddresses(userId);
	const updated = existing.filter((item) => item.id !== addressId);
	await persistSavedAddresses(userId, updated);
	return updated;
}

export async function updateSavedAddress(
	userId: string,
	addressId: string,
	nextAddress: Partial<SavedAddress>,
) {
	const existing = await getSavedAddresses(userId);
	const updated = existing.map((item) =>
		item.id === addressId
			? {
					...item,
					...nextAddress,
					label: (nextAddress.label ?? item.label).trim() || item.label,
					address: (nextAddress.address ?? item.address).trim() || item.address,
				}
			: item,
	);

	await persistSavedAddresses(userId, updated);
	return updated;
}
