import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth, firebaseConfigured, initAuth } from '../firebase'

let started = false

/** A sessão atual, acompanhando as trocas: o mesmo navegador pode começar
 * anônimo (jogador) e virar conta de mestre depois, sem recarregar a página. */
export function useAuthUser(): User | null {
  const [user, setUser] = useState<User | null>(auth?.currentUser ?? null)

  useEffect(() => {
    if (!firebaseConfigured || !auth) return
    if (!started) {
      started = true
      initAuth()
    }
    return onAuthStateChanged(auth, setUser)
  }, [])

  return user
}

export function useAuthUid(): string | null {
  return useAuthUser()?.uid ?? null
}

/** Entrou com e-mail e senha (não é uma sessão anônima). */
export function isRegisteredGM(user: User | null): boolean {
  return Boolean(user && !user.isAnonymous)
}
