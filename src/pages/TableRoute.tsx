import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Card, Input } from '../components/ui'
import { useAuthUid } from '../hooks/useAuth'
import { firebaseConfigured } from '../firebase'
import { getStoredName, rememberTable, setStoredName } from '../lib/localMemory'
import { claimCharacter, findCharacterByName, findMyCharacter, listenTable } from '../lib/store'
import type { Character, GameTable } from '../types'
import { CharacterCreate } from './CharacterCreate'
import { GMDashboard } from './GMDashboard'
import { PlayerView } from './PlayerView'

export function TableRoute() {
  const { code = '' } = useParams()
  const tableId = code.toUpperCase()
  const uid = useAuthUid()
  const [table, setTable] = useState<GameTable | null | undefined>(undefined)
  const [name, setName] = useState<string | null>(null)
  const [myCharacter, setMyCharacter] = useState<Character | null | undefined>(undefined)

  useEffect(() => {
    if (!firebaseConfigured) return
    return listenTable(tableId, setTable)
  }, [tableId])

  useEffect(() => {
    setName(getStoredName(tableId))
  }, [tableId])

  const isGM = Boolean(uid && table && table.gmUid === uid)

  useEffect(() => {
    if (!uid || !table || isGM || !name) return
    let cancelled = false
    setMyCharacter(undefined)
    async function resolve() {
      const mine = await findMyCharacter(tableId, uid!)
      if (mine) {
        if (!cancelled) setMyCharacter(mine)
        return
      }
      // Não achou personagem pelo uid deste navegador — talvez o jogador
      // esteja voltando de outro dispositivo. Se já existe um personagem
      // com esse nome na mesa, assume que é a mesma pessoa e "reivindica"
      // a ficha em vez de criar uma nova.
      const existing = await findCharacterByName(tableId, name!)
      if (existing) {
        await claimCharacter(tableId, existing.id, uid!)
        if (!cancelled) setMyCharacter({ ...existing, ownerUid: uid! })
        return
      }
      if (!cancelled) setMyCharacter(null)
    }
    resolve()
    return () => {
      cancelled = true
    }
  }, [uid, table, tableId, isGM, name])

  useEffect(() => {
    if (table && name) {
      rememberTable({ tableId: table.id, tableName: table.name, characterName: name, isGM })
    }
  }, [table, name, isGM])

  if (!firebaseConfigured) {
    return (
      <div className="mx-auto max-w-lg p-6">
        <Card className="border-amber-700/50 bg-amber-950/20 p-4 text-sm text-amber-200">
          Firebase não configurado. Veja o README para configurar o arquivo .env.
        </Card>
      </div>
    )
  }

  if (table === undefined || !uid) {
    return <p className="p-8 text-center text-orange-300/60">Carregando mesa...</p>
  }
  if (table === null) {
    return <p className="p-8 text-center text-red-300">Mesa "{tableId}" não encontrada. Confira o código com o mestre.</p>
  }

  if (isGM) {
    return <GMDashboard table={table} />
  }

  if (!name) {
    return (
      <NamePrompt
        tableName={table.name}
        onSubmit={(n) => {
          setStoredName(tableId, n)
          setName(n)
        }}
      />
    )
  }

  if (myCharacter === undefined) {
    return <p className="p-8 text-center text-orange-300/60">Procurando seu personagem...</p>
  }
  if (myCharacter === null) {
    return <CharacterCreate table={table} uid={uid} characterName={name} onCreated={setMyCharacter} />
  }
  return <PlayerView table={table} characterId={myCharacter.id} />
}

function NamePrompt({ tableName, onSubmit }: { tableName: string; onSubmit: (name: string) => void }) {
  const [value, setValue] = useState('')
  return (
    <div className="mx-auto max-w-sm p-8">
      <Card className="flex flex-col gap-3 p-5">
        <p className="text-orange-200">
          Entrando na mesa <b>{tableName}</b>. Qual é o nome do seu personagem?
        </p>
        <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Nome do personagem" />
        <Button variant="primary" disabled={!value.trim()} onClick={() => onSubmit(value.trim())}>
          Continuar
        </Button>
      </Card>
    </div>
  )
}
