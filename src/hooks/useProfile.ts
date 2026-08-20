import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface FarmerProfile {
  id: string;
  full_name: string;
  mobile: string | null;
  village: string | null;
  district: string | null;
  state: string | null;
  language: string;
  farm_name: string | null;
  farm_size: string | null;
  main_crop: string | null;
  soil_type: string | null;
  setup_complete: boolean;
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<FarmerProfile | null> => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return null;
      const { data, error } = await supabase.from("profiles").select("*").eq("id", auth.user.id).maybeSingle();
      if (error) throw error;
      return (data as FarmerProfile | null) ?? null;
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<FarmerProfile>) => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Not signed in");
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: auth.user.id, ...patch, updated_at: new Date().toISOString() })
        .eq("id", auth.user.id);
      if (error) throw error;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["profile"] }),
  });
}