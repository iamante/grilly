import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../hooks/useAuth";

export type Profile = {
	id: string;
	fullName: string | null;
	phone: string | null;
	avatarUrl: string | null;
	defaultAddress: string | null;
};

async function fetchProfile(userId: string): Promise<Profile> {
	const { data, error } = await supabase
		.from("profiles")
		.select("id, full_name, phone, avatar_url, default_address")
		.eq("id", userId)
		.single();

	if (error) {
		console.error("Error fetching profile:", error);
		throw error;
	}

	return {
		id: data.id,
		fullName: data.full_name,
		phone: data.phone,
		avatarUrl: data.avatar_url,
		defaultAddress: data.default_address,
	};
}

async function updateProfile(profile: Partial<Profile> & { id: string }) {
	const { error } = await supabase
		.from("profiles")
		.update({
			full_name: profile.fullName,
			phone: profile.phone,
			default_address: profile.defaultAddress,
			avatar_url: profile.avatarUrl,
			updated_at: new Date().toISOString(),
		})
		.eq("id", profile.id);

	if (error) throw error;
}

export function useProfile() {
	const { user } = useAuth();
	const queryClient = useQueryClient();

	const profileQuery = useQuery({
		queryKey: ["profile", user?.id],
		queryFn: () => fetchProfile(user!.id),
		enabled: !!user,
	});

	const updateMutation = useMutation({
		mutationFn: updateProfile,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
			Alert.alert("Success", "Profile updated successfully!");
		},
		onError: (error: any) => {
			Alert.alert("Update Failed", error.message || "Could not update profile.");
		},
	});

	return {
		profile: profileQuery.data,
		isLoading: profileQuery.isLoading,
		isUpdating: updateMutation.isPending,
		updateProfile: updateMutation.mutate,
	};
}
