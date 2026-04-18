import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../hooks/useAuth";
import { useCartStore } from "../../../stores/cartStore";
import { getDeliveryQuote } from "../utils/delivery";
import {
	type SavedAddress,
	getSavedAddresses,
	removeSavedAddress,
	saveAddressSlot,
} from "../utils/savedAddresses";

export function useCheckout() {
	const [loading, setLoading] = useState(false);
	const [deliveryAddress, setDeliveryAddress] = useState("");
	const [deliveryNote, setDeliveryNote] = useState("");
	const [addressLoaded, setAddressLoaded] = useState(false);
	const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
	const { user } = useAuth();
	const { items, totalPrice, clearCart } = useCartStore();

	useEffect(() => {
		if (!user || addressLoaded) {
			return;
		}

		let ignore = false;

		(async () => {
			try {
				const { data } = await supabase
					.from("profiles")
					.select("default_address")
					.eq("id", user.id)
					.single();

				if (ignore) {
					return;
				}

				const profile = data as { default_address?: string | null } | null;
				if (profile?.default_address) {
					setDeliveryAddress(profile.default_address);
				}

				const deviceAddresses = await getSavedAddresses(user.id);
				if (!ignore) {
					setSavedAddresses(deviceAddresses);
				}
			} finally {
				if (!ignore) {
					setAddressLoaded(true);
				}
			}
		})();

		return () => {
			ignore = true;
		};
	}, [addressLoaded, user]);

	const quote = useMemo(
		() => getDeliveryQuote(deliveryAddress || "pickup"),
		[deliveryAddress],
	);
	const subtotal = totalPrice();
	const total = subtotal + quote.fee;

	async function handleSaveCurrentAddress() {
		if (!user) {
			Alert.alert("Authentication Required", "Please sign in to save addresses.");
			return;
		}

		if (!deliveryAddress.trim()) {
			Alert.alert("Address Required", "Enter a delivery address before saving it.");
			return;
		}

		const updatedAddresses = await saveAddressSlot(user.id, deliveryAddress);
		setSavedAddresses(updatedAddresses);
		Alert.alert("Saved", "This address is now available for quick checkout.");
	}

	async function handleRemoveSavedAddress(addressId: string) {
		if (!user) {
			return;
		}

		const updatedAddresses = await removeSavedAddress(user.id, addressId);
		setSavedAddresses(updatedAddresses);
	}

	async function handleCheckout() {
		if (!user) {
			Alert.alert("Authentication Required", "Please sign in to place an order.");
			return null;
		}

		if (items.length === 0) {
			Alert.alert("Empty Tray", "Add some grill favorites to your tray first.");
			return null;
		}

		if (!deliveryAddress.trim()) {
			Alert.alert("Delivery Address Required", "Add a delivery address before placing your order.");
			return null;
		}

		setLoading(true);
		try {
			await supabase
				.from("profiles")
				.update({
					default_address: deliveryAddress.trim(),
					updated_at: new Date().toISOString(),
				} as never)
				.eq("id", user.id);

			const { data: order, error: orderError } = await supabase
				.from("orders")
				.insert({
					user_id: user.id,
					status: "pending",
					subtotal,
					delivery_fee: quote.fee,
					total,
					delivery_address: deliveryAddress.trim(),
				} as never)
				.select()
				.single();

			if (orderError) throw orderError;

			const orderItems = items.map((item) => {
				const cust = item.customizations;
				const baseDetails = [`${cust.heatLevel} heat`, cust.sauce];
				const extras = [];
				if (cust.extraRice) extras.push("Extra Rice");
				if (cust.extraAtchara) extras.push("Extra Atchara");

				let formattedName = `${item.name} (${baseDetails.join(", ")})`;
				if (extras.length > 0) {
					formattedName += ` + ${extras.join(" + ")}`;
				}

				if (deliveryNote.trim()) {
					formattedName += ` | Note: ${deliveryNote.trim()}`;
				}

				return {
					order_id: (order as { id: string }).id,
					product_id: item.id,
					product_name: formattedName,
					quantity: item.quantity,
					unit_price: item.price,
					line_total: item.price * item.quantity,
				};
			});

			const { error: itemsError } = await supabase
				.from("order_items")
				.insert(orderItems as never);

			if (itemsError) throw itemsError;

			clearCart();
			setDeliveryNote("");
			return (order as { id: string }).id;
		} catch (error: any) {
			console.error("Checkout error:", error);
			Alert.alert("Checkout Failed", error.message || "Something went wrong.");
			return null;
		} finally {
			setLoading(false);
		}
	}

	return {
		deliveryAddress,
		setDeliveryAddress,
		deliveryNote,
		setDeliveryNote,
		savedAddresses,
		selectSavedAddress: setDeliveryAddress,
		saveCurrentAddress: handleSaveCurrentAddress,
		removeSavedAddress: handleRemoveSavedAddress,
		deliveryFee: quote.fee,
		deliveryEta: quote.etaLabel,
		deliveryZone: quote.zoneLabel,
		subtotal,
		total,
		handleCheckout,
		loading,
	};
}
