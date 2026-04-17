import { create } from "zustand";

export type CartItem = {
	id: string;
	name: string;
	price: number;
	imageUrl: string;
	quantity: number;
};

type CartState = {
	items: CartItem[];
	addItem: (item: Omit<CartItem, "quantity">) => void;
	removeItem: (id: string) => void;
	increment: (id: string) => void;
	decrement: (id: string) => void;
	clearCart: () => void;
	totalItems: () => number;
	totalPrice: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
	items: [],
	addItem: (item) =>
		set((state) => {
			const existing = state.items.find((i) => i.id === item.id);
			if (existing) {
				return {
					items: state.items.map((i) =>
						i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
					),
				};
			}
			return { items: [...state.items, { ...item, quantity: 1 }] };
		}),
	removeItem: (id) =>
		set((state) => ({
			items: state.items.filter((i) => i.id !== id),
		})),
	increment: (id) =>
		set((state) => ({
			items: state.items.map((i) =>
				i.id === id ? { ...i, quantity: i.quantity + 1 } : i,
			),
		})),
	decrement: (id) =>
		set((state) => ({
			items: state.items
				.map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
				.filter((i) => i.quantity > 0),
		})),
	clearCart: () => set({ items: [] }),
	totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
	totalPrice: () =>
		get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));
