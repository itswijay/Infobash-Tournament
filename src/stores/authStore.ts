import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { AuthState, User } from '@/types'

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  signOut: () => void
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isLoading: false,
        isAuthenticated: false,

        setUser: (user) =>
          set(
            {
              user,
              isAuthenticated: !!user,
              isLoading: false,
            },
            false,
            'auth/setUser'
          ),

        setLoading: (isLoading) => set({ isLoading }, false, 'auth/setLoading'),

        signOut: () =>
          set(
            {
              user: null,
              isAuthenticated: false,
              isLoading: false,
            },
            false,
            'auth/signOut'
          ),
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
)
