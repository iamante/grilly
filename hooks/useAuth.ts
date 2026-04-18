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
			return supabase.auth.signInWithPassword({
				email: email.trim().toLowerCase(),
				password,
			});
		},
		[],
	);

	const signUp = useCallback(async (email: string, password: string) => {
		const normalizedEmail = email.trim().toLowerCase();
		console.log(`Attempting to sign up user: ${normalizedEmail}`);
		
		const result = await supabase.auth.signUp({
			email: normalizedEmail,
			password,
		});

		if (result.error) {
			console.error("Supabase Auth signUp error:", result.error.message);
		} else {
			console.log("Auth signUp successful, user ID:", result.data.user?.id);
		}

		return result;
	}, []);

	const signOut = useCallback(async () => {
		return supabase.auth.signOut();
	}, []);

	const signInWithOAuth = useCallback(async (provider: "google" | "facebook") => {
		return supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: "grillystore://", // Match the scheme in app.json
			},
		});
	}, []);

	return {
		...state,
		signInWithPassword,
		signUp,
		signOut,
		signInWithOAuth,
	};
}
