import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, isConfigured, NOT_CONFIGURED_MESSAGE, TABLES } from '../lib/supabase'

const AuthContext = createContext(null)

const notConfigured = () => ({ error: { message: NOT_CONFIGURED_MESSAGE } })

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(isConfigured)

  useEffect(() => {
    if (!supabase) return undefined
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session)
      setLoading(false)
    })

    // One single listener for the whole app (the original attached a new one on every click).
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
      setLoading(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const user = session?.user ?? null
  const meta = user?.user_metadata ?? {}
  const profile = user
    ? {
        id: user.id,
        email: user.email,
        name: meta.displayName || meta.full_name || meta.name || user.email?.split('@')[0] || '',
        number: meta.number || meta.phone || '',
        avatar: meta.avatar_url || meta.picture || '',
        createdAt: user.created_at,
        provider: user.app_metadata?.provider || 'email',
      }
    : null

  const signIn = useCallback(async (email, password) => {
    if (!supabase) return notConfigured()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }, [])

  const signUp = useCallback(async ({ name, email, password, number }) => {
    if (!supabase) return notConfigured()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: { displayName: name, number },
      },
    })
    if (error) return { data, error }

    // Mirror the user in the `user` table, as the original project did.
    // Not fatal: with email confirmation on, there is no session yet and RLS may reject it.
    const { error: dbError } = await supabase.from(TABLES.users).insert({ name, email, number })
    if (dbError) console.warn('Could not store user row:', dbError.message)

    return { data, error: null, hasSession: Boolean(data?.session) }
  }, [])

  const signOut = useCallback(async () => {
    if (!supabase) return notConfigured()
    const { error } = await supabase.auth.signOut()
    return { error }
  }, [])

  const signInWithProvider = useCallback(async (provider) => {
    if (!supabase) return notConfigured()
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    })
    return { error }
  }, [])

  const updateProfile = useCallback(
    async ({ name, number }) => {
      if (!supabase) return notConfigured()
      const { error } = await supabase.auth.updateUser({ data: { displayName: name, number } })
      if (error) return { error }
      // Best-effort sync with the `user` table.
      if (user?.email) {
        const { error: dbError } = await supabase.from(TABLES.users).update({ name, number }).eq('email', user.email)
        if (dbError) console.warn('Could not sync user row:', dbError.message)
      }
      return { error: null }
    },
    [user?.email],
  )

  const updatePassword = useCallback(async (password) => {
    if (!supabase) return notConfigured()
    const { error } = await supabase.auth.updateUser({ password })
    return { error }
  }, [])

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      isConfigured,
      signIn,
      signUp,
      signOut,
      signInWithProvider,
      updateProfile,
      updatePassword,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session, loading, signIn, signUp, signOut, signInWithProvider, updateProfile, updatePassword],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
