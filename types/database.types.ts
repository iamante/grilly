// Placeholder for Supabase generated types
// Run: npm run db:types after supabase link
export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export interface Database {
	public: {
		Tables: {
			profiles: {
				Row: {
					id: string;
					full_name: string | null;
					phone: string | null;
					avatar_url: string | null;
					default_address: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id: string;
					full_name?: string | null;
					phone?: string | null;
					avatar_url?: string | null;
					default_address?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					full_name?: string | null;
					phone?: string | null;
					avatar_url?: string | null;
					default_address?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "profiles_id_fkey";
						columns: ["id"];
						isOneToOne: true;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
				];
			};
			categories: {
				Row: {
					id: string;
					name: string;
					icon_emoji: string | null;
					sort_order: number;
					created_at: string;
				};
				// ... more table definitions
			};
			// products, carts, cart_items, orders, order_items definitions follow same pattern
		};
		Views: {};
		Functions: {};
		Enums: {};
		CompositeTypes: {};
	};
}
