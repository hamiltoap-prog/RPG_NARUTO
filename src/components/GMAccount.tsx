import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, Button, Card, Input, SectionTitle } from './ui'
import { authErrorMessage, registerGM, sendGMPasswordReset, signInGM, signOutToAnonymous } from '../firebase'
import { isRegisteredGM, useAuthUser } from '../hooks/useAuth'
import { listenGMTables } from '../lib/store'
import type { GMTableEntry } from '../lib/store'

type Mode = 'signin' | 'register'

/**
 * Conta de mestre.
 *
 * Sem conta, o mestre existe só enquanto este navegador guardar a sessão
 * anônima — limpou os dados, perdeu a mesa. Ao criar a conta, o e-mail e a
 * senha são vinculados à sessão anônima atual, então o uid continua o mesmo e
 * as mesas já criadas aqui seguem sendo desta conta.
 */
export function GMAccount() {
  const user = useAuthUser()
  const navigate = useNavigate()
  const registered = isRegisteredGM(user)

  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [open, setOpen] = useState(false)
  const [tables, setTables] = useState<GMTableEntry[]>([])

  useEffect(() => {
    if (!user || !registered) {
      setTables([])
      return
    }
    return listenGMTables(user.uid, setTables)
  }, [user, registered])

  async function submit() {
    setBusy(true)
    setError('')
    setNotice('')
    try {
      if (mode === 'register') {
        await registerGM(email.trim(), password)
        setNotice('Conta criada. Suas mesas deste navegador continuam suas.')
      } else {
        await signInGM(email.trim(), password)
        setNotice('Bem-vindo de volta.')
      }
      setPassword('')
    } catch (err) {
      setError(authErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  async function resetPassword() {
    if (!email.trim()) {
      setError('Escreva seu e-mail acima para receber o link de troca de senha.')
      return
    }
    setBusy(true)
    setError('')
    setNotice('')
    try {
      await sendGMPasswordReset(email.trim())
      setNotice('Enviamos um link de troca de senha para o seu e-mail.')
    } catch (err) {
      setError(authErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  if (registered && user) {
    return (
      <Card className="flex flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SectionTitle>Conta de Mestre</SectionTitle>
          <Badge tone="good">conectado</Badge>
        </div>
        <p className="text-sm text-orange-200">{user.email}</p>

        {tables.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <p className="text-xs uppercase tracking-wide text-orange-400/60">Suas mesas</p>
            {tables.map((t) => (
              <button
                key={t.tableId}
                onClick={() => navigate(`/t/${t.tableId}`)}
                className="well flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition hover:brightness-125"
              >
                <span className="text-orange-100">{t.name}</span>
                <span className="tracking-widest text-[color:var(--gold)]">{t.tableId}</span>
              </button>
            ))}
          </div>
        )}
        {tables.length === 0 && (
          <p className="text-xs text-orange-300/50">
            Nenhuma mesa criada com esta conta ainda. As mesas que você criar aparecem aqui, em qualquer dispositivo.
          </p>
        )}

        <Button variant="ghost" className="self-start" onClick={() => signOutToAnonymous()}>
          Sair da conta
        </Button>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col gap-3 p-5">
      <button className="flex w-full items-center justify-between" onClick={() => setOpen((v) => !v)}>
        <SectionTitle>Conta de Mestre (opcional)</SectionTitle>
        <span className="text-xs text-orange-400/60">{open ? 'fechar' : 'abrir'}</span>
      </button>

      {!open ? (
        <p className="text-xs text-orange-300/60">
          Com uma conta, suas mesas ficam ligadas a você e não a este navegador — dá para mestrar do computador e do celular,
          e nada se perde se você limpar os dados do navegador.
        </p>
      ) : (
        <>
          <div className="flex gap-1.5">
            <Button variant={mode === 'signin' ? 'primary' : 'secondary'} onClick={() => setMode('signin')}>
              Entrar
            </Button>
            <Button variant={mode === 'register' ? 'primary' : 'secondary'} onClick={() => setMode('register')}>
              Criar conta
            </Button>
          </div>

          <Input placeholder="E-mail" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input
            placeholder="Senha"
            type="password"
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary" disabled={busy || !email.trim() || password.length < 6} onClick={submit}>
              {busy ? 'Aguarde...' : mode === 'register' ? 'Criar conta' : 'Entrar'}
            </Button>
            <button className="text-xs text-orange-400 transition hover:text-orange-200" onClick={resetPassword}>
              esqueci a senha
            </button>
          </div>

          {mode === 'register' && (
            <p className="text-xs text-orange-300/60">
              Se você já criou mesas neste navegador, elas continuam suas: a conta é ligada à sessão atual.
            </p>
          )}
          {error && <p className="text-sm text-red-400">{error}</p>}
          {notice && <p className="text-sm text-emerald-300">{notice}</p>}
        </>
      )}
    </Card>
  )
}
