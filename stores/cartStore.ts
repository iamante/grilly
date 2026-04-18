import { create } from "zustand";

export type Customizations = {
	sauce: string;
	heatLevel: "Mild" | "Original" | "Fire";
	extraRice: boolean;
	extraAtchara: boolean;
};

export type CartItem = {
	id: string;
	uniqueId: string;
	name: string;
	price: number;
	imageUrl: string;
	quantity: number;
	customizations: Customizations;
};

type CartState = {
	items: CartItem[];
	addItem: (item: Omit<CartItem, "quantity" | "uniqueId">) => void;
	removeItem: (uniqueId: string) => void;
	increment: (uniqueId: string) => void;
	decrement: (uniqueId: string) => void;
	clearCart: () => void;
	totalItems: () => number;
	totalPrice: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
	items: [],
	addItem: (item) =>
		set((state) => {
			const uniqueId = `${item.id}-${JSON.stringify(item.customizations)}`;
			const existing = state.items.find((i) => i.uniqueId === uniqueId);
			if (existing) {
				return {
					items: state.items.map((i) =>
						i.uniqueId === uniqueId ? { ...i, quantity: i.quantity + 1 } : i,
					),
				};
			}
			return { items: [...state.items, { ...item, uniqueId, quantity: 1 }] };
		}),
	removeItem: (uniqueId) =>
		set((state) => ({
			items: state.items.filter((i) => i.uniqueId !== uniqueId),
		})),
	increment: (uniqueId) =>
		set((state) => ({
			items: state.items.map((i) =>
				i.uniqueId === uniqueId ? { ...i, quantity: i.quantity + 1 } : i,
			),
		})),
	decrement: (uniqueId) =>
		set((state) => ({
			items: state.items
				.map((i) =>
					i.uniqueId === uniqueId ? { ...i, quantity: i.quantity - 1 } : i,
				)
				.filter((i) => i.quantity > 0),
		})),
	clearCart: () => set({ items: [] }),
	totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
	totalPrice: () =>
		get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));
