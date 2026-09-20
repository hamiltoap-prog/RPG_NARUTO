import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, Button, Card, Input, SectionTitle } from '../components/ui'
import { authErrorMessage, firebaseConfigured, signInGM, signOutToAnonymous } from '../firebase'
import { useAuthUser } from '../hooks/useAuth'
import { deleteTableCompletely, isSuperAdmin, listenAllTables } from '../lib/store'
import type { GameTable } from '../types'

type Access = 'checking' | 'anonymous' | 'denied' | 'granted'

/**
 * Painel do super administrador: uma porta separada do jogo, para olhar e
 * cuidar de todas as mesas. Quem manda é o Firestore (um documento em
 * /superAdmins, criado fora do app) — esta tela só reflete o que as regras
 * já garantem no servidor.
 */
export function AdminPage() {
  const user = useAuthUser()
  const [access, setAccess] = useState<Access>('checking')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [tables, setTables] = useState<GameTable[]>([])

  useEffect(() => {
    let cancelled = false
    async function check() {
      if (!user) {
        setAccess('checking')
        return
      }
      if (user.isAnonymous) {
        setAccess('anonymous')
        return
      }
      const admin = await isSuperAdmin(user.uid)
      if (!cancelled) setAccess(admin ? 'granted' : 'denied')
    }
    check()
    return () => {
      cancelled = true
    }
  }, [user])

  useEffect(() => {
    if (access !== 'granted') return
    return listenAllTables(setTables, (err) => setError(err.message))
  }, [access])

  async function signIn() {
    setBusy(true)
    setError('')
    try {
      await signInGM(email.trim(), password)
      setPassword('')
    } catch (err) {
      setError(authErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  async function removeTable(table: GameTable) {
    if (!confirm(`Apagar a mesa "${table.name}" (${table.code}) e tudo dentro dela? Isso não tem volta.`)) return
    setBusy(true)
    try {
      await deleteTableCompletely(table.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível apagar a mesa.')
    } finally {
      setBusy(false)
    }
  }

  if (!firebaseConfigured) {
    return <p className="p-8 text-center text-amber-200">Firebase não configurado.</p>
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="hero-title font-serif text-3xl font-extrabold">Administração</h1>
        <Link to="/" className="text-sm text-orange-400 transition hover:text-orange-200">
          voltar ao jogo
        </Link>
      </div>

      {access === 'checking' && <p className="text-orange-300/60">Conferindo o crachá...</p>}

      {access === 'anonymous' && (
        <Card className="flex flex-col gap-3 p-5">
          <SectionTitle>Entrar</SectionTitle>
          <Input placeholder="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button variant="primary" disabled={busy || !email.trim() || !password} onClick={signIn}>
            Entrar
          </Button>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </Card>
      )}

      {access === 'denied' && (
        <Card className="flex flex-col gap-3 p-5">
          <p className="text-sm text-orange-200">
            Esta conta ({user?.email}) não tem acesso de administrador. O crachá é um documento em{' '}
            <code className="text-[color:var(--gold)]">/superAdmins/{user?.uid}</code>, criado fora do app.
          </p>
          <Button variant="ghost" className="self-start" onClick={() => signOutToAnonymous()}>
            Sair da conta
          </Button>
        </Card>
      )}

      {access === 'granted' && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-orange-200">
              {user?.email} · <Badge tone="good">administrador</Badge>
            </p>
            <Button variant="ghost" onClick={() => signOutToAnonymous()}>
              Sair da conta
            </Button>
          </div>

          <Card className="flex flex-col gap-2 p-4">
            <SectionTitle>Mesas ({tables.length})</SectionTitle>
            {tables.length === 0 && <p className="text-sm text-orange-300/50">Nenhuma mesa no sistema.</p>}
            {tables.map((t) => (
              <div key={t.id} className="well flex flex-wrap items-center justify-between gap-2 rounded-lg p-3 text-sm">
                <div>
                  <p className="font-semibold text-orange-100">
                    {t.name} <span className="tracking-widest text-[color:var(--gold)]">{t.code}</span>
                  </p>
                  <p className="text-xs text-orange-300/50">
                    Mestre: {t.gmName}
                    {t.gmEmail ? ` (${t.gmEmail})` : ''} · criada em {new Date(t.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/t/${t.id}`} className="text-xs text-orange-400 transition hover:text-orange-200">
                    abrir
                  </Link>
                  <button className="text-xs text-red-400 transition hover:text-red-200" disabled={busy} onClick={() => removeTable(t)}>
                    apagar
                  </button>
                </div>
              </div>
            ))}
          </Card>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </>
      )}
    </div>
  )
}
