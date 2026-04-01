import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthStore {
  isOpen: boolean;
  mode: "login" | "signup";
  user: User | null;
  profile: { full_name: string; email: string; phone: string; avatar_url: string } | null;
  isAdmin: boolean;
  loading: boolean;
  setOpen: (open: boolean) => void;
  setMode: (mode: "login" | "signup") => void;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (name: string, email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
  checkAdmin: (userId: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isOpen: false,
  mode: "login",
  user: null,
  profile: null,
  isAdmin: false,
  loading: true,
  setOpen: (open) => set({ isOpen: open }),
  setMode: (mode) => set({ mode }),

  initialize: async () => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null;
      set({ user, loading: false });
      if (user) {
        // Use setTimeout to avoid potential deadlock with Supabase client
        setTimeout(() => {
          get().fetchProfile(user.id);
          get().checkAdmin(user.id);
        }, 0);
      } else {
        set({ profile: null, isAdmin: false });
      }
    });

    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user ?? null;
    set({ user, loading: false });
    if (user) {
      await get().fetchProfile(user.id);
      await get().checkAdmin(user.id);
    }
  },

  fetchProfile: async (userId) => {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, email, phone, avatar_url")
      .eq("user_id", userId)
      .single();
    if (data) set({ profile: data });
  },

  checkAdmin: async (userId) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    set({ isAdmin: !!data });
  },

  login: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    set({ isOpen: false });
    return { error: null };
  },

  signup: async (name, email, password) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) return { error: error.message };
    set({ isOpen: false });
    return { error: null };
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, isAdmin: false });
  },
}));
