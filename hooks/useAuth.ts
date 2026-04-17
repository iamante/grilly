import type { Session, User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type AuthState = {
	session: Session | null;
	user: User | null;
	loading: boolean;
};

export function useAuth() {
	const [state, setState] = useState<AuthState>({
		session: null,
		user: null,
		loading: true,
	});

	useEffect(() => {
		let isMounted = true;

		supabase.auth.getSession().then(({ data, error }) => {
			if (!isMounted) return;
			if (error) {
				setState({ session: null, user: null, loading: false });
				return;
			}
			setState({
				session: data.session,
				user: data.session?.user ?? null,
				loading: false,
			});
		});

		const { data: subscription } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setState({
					session,
					user: session?.user ?? null,
					loading: false,
				});
			},
		);

		return () => {
			isMounted = false;
			subscription.subscription.unsubscribe();
		};
	}, []);

	const signInWithPassword = useCallback(
		async (email: string, password: string) => {
			return supabase.auth.signInWithPassword({ email, password });
		},
		[],
	);

	const signUp = useCallback(async (email: string, password: string) => {
		return supabase.auth.signUp({ email, password });
	}, []);

	const signOut = useCallback(async () => {
		return supabase.auth.signOut();
	}, []);

	return {
		...state,
		signInWithPassword,
		signUp,
		signOut,
	};
}
