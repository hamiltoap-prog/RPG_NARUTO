import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GMAccount } from '../components/GMAccount'
import { ThemeToggle } from '../components/ThemeToggle'
import { Button, Card, Input, SectionTitle } from '../components/ui'
import { useAuthUser } from '../hooks/useAuth'
import { firebaseConfigured } from '../firebase'
import { getRecentTables, rememberTable, setStoredName } from '../lib/localMemory'
import { createTable, getTableByCode } from '../lib/store'

type Mode = 'menu' | 'player' | 'gm' | 'create'

export function Home() {
  const user = useAuthUser()
  const uid = user?.uid ?? null
  const navigate = useNavigate()
  const recent = getRecentTables()
  const [mode, setMode] = useState<Mode>('menu')

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <div className="flex justify-end">
        <ThemeToggle />
      </div>
      <header className="mt-10 text-center">
        <p className="font-display text-[11px] font-medium uppercase tracking-[0.5em] text-[color:var(--orange)]">
          RPG de Naruto
        </p>
        <h1 className="hero-title mt-2 font-display text-6xl font-bold uppercase sm:text-7xl">Mesa Ninja</h1>
        <div className="ornament mt-4 text-[10px]">◆</div>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-orange-300/70">
          Fichas, dados, combate e a tela do mestre — tudo ao vivo, no mesmo lugar, para o seu grupo jogar junto.
        </p>
      </header>

      {!firebaseConfigured && (
        <Card className="border-[color:var(--orange)] p-4 text-sm text-orange-200">
          Firebase ainda não está configurado neste ambiente. Preencha o arquivo <code className="text-white">.env</code> com
          as chaves do seu projeto (veja <code className="text-white">.env.example</code> e o README) para criar ou entrar
          em mesas.
        </Card>
      )}

      {mode === 'menu' && (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <MenuCard
              icon="◈"
              title="Entrar como Jogador"
              desc="Código da mesa e o nome do seu personagem"
              onClick={() => setMode('player')}
            />
            <MenuCard icon="✦" title="Entrar como Mestre" desc="Sua conta de mestre e as suas mesas" onClick={() => setMode('gm')} />
            <MenuCard icon="⛩" title="Criar uma Mesa" desc="Comece uma campanha nova agora" onClick={() => setMode('create')} />
          </div>

          {recent.length > 0 && (
            <Card className="flex flex-col gap-2 p-5">
              <SectionTitle>Mesas recentes neste navegador</SectionTitle>
              <div className="mt-1 flex flex-col gap-1.5">
                {recent.map((t) => (
                  <button
                    key={t.tableId}
                    onClick={() => navigate(`/t/${t.tableId}`)}
                    className="group flex items-center justify-between border border-[color:var(--line)] bg-[color:var(--surface-well)] px-3 py-2 text-left text-sm transition hover:border-[color:var(--orange)]"
                  >
                    <span className="text-white">{t.tableName}</span>
                    <span className="font-display text-xs uppercase tracking-[0.12em] text-orange-300/50 transition group-hover:text-[color:var(--orange)]">
                      {t.isGM ? 'Mestre' : 'Jogador'} · {t.characterName}
                    </span>
                  </button>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {mode === 'player' && <PlayerEntry uid={uid} onBack={() => setMode('menu')} />}
      {mode === 'gm' && (
        <div className="flex flex-col gap-3">
          <BackLink onBack={() => setMode('menu')} />
          <GMAccount />
        </div>
      )}
      {mode === 'create' && <CreateTable uid={uid} email={user?.email ?? undefined} onBack={() => setMode('menu')} />}

      <p className="mt-4 text-center font-display text-[11px] uppercase tracking-[0.3em] text-orange-400/25">
        Mesa Ninja · sistema da casa
      </p>
    </div>
  )
}

function MenuCard({ icon, title, desc, onClick }: { icon: string; title: string; desc: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="chamfer group relative border border-[color:var(--line)] bg-[color:var(--surface-card)] p-5 text-left transition-colors duration-150 hover:border-[color:var(--orange)] hover:bg-[color:var(--surface-card-hover)]"
    >
      <span className="edge-top pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity group-hover:opacity-100" />
      <span className="flex h-7 items-center font-display text-2xl leading-none text-[color:var(--orange)]">{icon}</span>
      <p className="mt-3 font-display text-sm font-semibold uppercase tracking-[0.12em] text-white">{title}</p>
      <p className="mt-1.5 text-xs leading-relaxed text-orange-300/60">{desc}</p>
    </button>
  )
}

function BackLink({ onBack }: { onBack: () => void }) {
  return (
    <button
      onClick={onBack}
      className="self-start font-display text-xs uppercase tracking-[0.16em] text-orange-300/60 transition hover:text-[color:var(--orange)]"
    >
      ← voltar
    </button>
  )
}

function PlayerEntry({ uid, onBack }: { uid: string | null; onBack: () => void }) {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function enter() {
    if (!uid || !code.trim() || !name.trim()) return
    setBusy(true)
    setError('')
    try {
      const table = await getTableByCode(code.trim())
      if (!table) {
        setError('Mesa não encontrada. Confira o código com o mestre.')
        return
      }
      setStoredName(table.id, name.trim())
      rememberTable({ tableId: table.id, tableName: table.name, characterName: name.trim(), isGM: table.gmUid === uid })
      navigate(`/t/${table.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar na mesa.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card className="flex flex-col gap-3 p-5">
      <BackLink onBack={onBack} />
      <SectionTitle>Entrar como jogador</SectionTitle>
      <p className="text-xs leading-relaxed text-orange-300/60">
        Se o personagem já existe nesta mesa, escreva o nome dele exatamente como está e você cai direto na ficha — de
        qualquer computador ou celular. Nome novo abre a criação de personagem.
      </p>
      <Input placeholder="Nome do seu personagem" value={name} onChange={(e) => setName(e.target.value)} />
      <Input
        placeholder="Código da mesa"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        className="uppercase tracking-[0.3em]"
      />
      <Button variant="primary" disabled={!uid || !code.trim() || !name.trim() || busy} onClick={enter}>
        {busy ? 'Entrando...' : 'Entrar na mesa'}
      </Button>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </Card>
  )
}

function CreateTable({ uid, email, onBack }: { uid: string | null; email?: string; onBack: () => void }) {
  const navigate = useNavigate()
  const [gmName, setGmName] = useState('')
  const [tableName, setTableName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function create() {
    if (!uid || !gmName.trim()) return
    setBusy(true)
    setError('')
    try {
      const table = await createTable(gmName.trim(), uid, tableName.trim(), email)
      setStoredName(table.id, gmName.trim())
      rememberTable({ tableId: table.id, tableName: table.name, characterName: gmName.trim(), isGM: true })
      navigate(`/t/${table.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar mesa.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card className="flex flex-col gap-3 p-5">
      <BackLink onBack={onBack} />
      <SectionTitle>Criar uma mesa</SectionTitle>
      <p className="text-xs leading-relaxed text-orange-300/60">
        A mesa nasce com um código de quatro letras — é ele que você passa para o grupo. Depois de criar, abra{' '}
        <b className="text-white">Entrar como Mestre</b> e cadastre e-mail e senha: é isso que devolve a mesa para você em
        outro aparelho.
      </p>
      <Input placeholder="Seu nome (mestre)" value={gmName} onChange={(e) => setGmName(e.target.value)} />
      <Input placeholder="Nome da mesa (opcional)" value={tableName} onChange={(e) => setTableName(e.target.value)} />
      <Button variant="primary" disabled={!uid || !gmName.trim() || busy} onClick={create}>
        {busy ? 'Criando...' : 'Criar mesa'}
      </Button>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </Card>
  )
}
