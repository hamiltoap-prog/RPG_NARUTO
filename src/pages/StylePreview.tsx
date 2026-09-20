// Bancada visual: tela de amostra com dados fictícios, para conferir a
// identidade visual (placas, botões, selos, campos) sem depender do Firebase.
// Não está roteada — para usar, adicione temporariamente em App.tsx:
//   <Route path="/preview" element={<StylePreview />} />
// Como nada importa este arquivo, ele não entra no pacote final.
import { Avatar, Badge, Button, Card, Input, SectionTitle, Select, TabChip, Textarea } from '../components/ui'

export function StylePreview() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 p-4 pb-16 lg:grid lg:grid-cols-[1fr_340px] lg:items-start">
      <div className="flex flex-col gap-4">
        <Card className="p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar name="Kaito Uzumaki" size={64} />
              <div>
                <h1 className="font-serif text-2xl text-orange-100">Kaito Uzumaki</h1>
                <p className="text-sm text-orange-300/60">Uzumaki · Especialista em Ninjutsu · Nível 3</p>
                <p className="text-xs text-orange-300/50">Genin · O Turbilhão</p>
              </div>
            </div>
            <Badge tone="warn">Aguardando aprovação: Chakra</Badge>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <p className="text-xs uppercase text-orange-400/60">Pontos de Vida</p>
              <div className="flex items-center gap-2">
                <div className="well h-3 w-40 overflow-hidden rounded-full">
                  <div className="h-full bg-emerald-600" style={{ width: '72%' }} />
                </div>
                <span className="text-sm text-orange-100">18 / 25</span>
              </div>
              <div className="mt-1 flex items-center gap-1">
                <Input type="number" defaultValue={1} className="w-16" />
                <Button variant="danger">− Dano</Button>
                <Button variant="good">+ Cura</Button>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase text-orange-400/60">Chakra</p>
              <div className="flex items-center gap-2">
                <div className="well h-3 w-40 overflow-hidden rounded-full">
                  <div className="h-full bg-sky-500" style={{ width: '45%' }} />
                </div>
                <span className="text-sm text-orange-100">14 / 31</span>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase text-orange-400/60">Classe de Armadura</p>
              <p className="text-xl text-orange-100">15</p>
            </div>
            <div>
              <p className="text-xs uppercase text-orange-400/60">Pontos de Resistência</p>
              <p className="text-xl text-orange-100">16</p>
            </div>
            <div>
              <p className="text-xs uppercase text-orange-400/60">Descanso</p>
              <div className="mt-1 flex gap-1">
                <Button variant="secondary">Curto</Button>
                <Button variant="secondary">Longo</Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col gap-3 p-4">
          <SectionTitle>Ações</SectionTitle>
          <div className="flex gap-1.5">
            <TabChip active className="px-3 py-1 text-xs">
              Teste
            </TabChip>
            <TabChip active={false} className="px-3 py-1 text-xs">
              Ataque
            </TabChip>
            <TabChip active={false} className="px-3 py-1 text-xs">
              Dano
            </TabChip>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <div>
              <p className="mb-1 text-xs text-orange-400/60">Atributo</p>
              <Select defaultValue="int">
                <option value="int">Inteligência</option>
              </Select>
            </div>
            <Input placeholder="Perícia/rótulo (opcional)" className="w-40" />
            <label className="flex items-center gap-1.5 text-xs text-orange-200">
              <input type="checkbox" defaultChecked /> Proficiente
            </label>
            <Button variant="primary">Rolar</Button>
          </div>
          <div className="well rounded-lg p-2 text-sm text-orange-100">
            <Badge tone="good">resultado</Badge>{' '}
            <span className="ml-1">Teste de Ninjutsu: d20(17) + 3 + 3 (prof.) = 23</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <SectionTitle>Atributos</SectionTitle>
            <Button variant="secondary">Editar</Button>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {[
              ['Força', 10, 0],
              ['Destreza', 14, 2],
              ['Constituição', 15, 2],
              ['Inteligência', 16, 3],
              ['Sabedoria', 12, 1],
              ['Carisma', 9, -1],
            ].map(([label, score, mod]) => (
              <div key={String(label)} className="well rounded-lg border border-[color:var(--gold-dark)] p-2 text-center">
                <p className="text-[10px] uppercase text-orange-400/60">{label}</p>
                <p className="font-serif text-lg text-orange-100">{score}</p>
                <p className="text-xs text-orange-300/60">
                  mod. {Number(mod) >= 0 ? '+' : ''}
                  {mod}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge>Ninjutsu</Badge>
            <Badge>Controle de Chakra</Badge>
            <Badge>Furtividade</Badge>
          </div>
        </Card>

        <Card className="p-4">
          <SectionTitle className="mb-2">Anotações (livre, sem aprovação)</SectionTitle>
          <Textarea rows={3} placeholder="Segredos, objetivos, contatos..." />
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <Card className="flex flex-col gap-2 p-4">
          <SectionTitle>Grupo</SectionTitle>
          {[
            ['Hana Hyūga', 'Hyūga · Especialista em Taijutsu · Nv. 3', 88],
            ['Renji Nara', 'Nara · Mestre Estrategista · Nv. 3', 40],
          ].map(([name, sub, pct]) => (
            <div key={String(name)} className="well flex items-center gap-2.5 rounded-lg p-2">
              <Avatar name={String(name)} size={38} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-orange-100">{name}</p>
                <p className="truncate text-xs text-orange-300/50">{sub}</p>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-black/40">
                  <div className={Number(pct) > 50 ? 'h-full bg-emerald-600' : 'h-full bg-amber-500'} style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          ))}
        </Card>

        <Card className="flex flex-col gap-2 p-4">
          <SectionTitle>Registro da Mesa</SectionTitle>
          <div className="flex flex-col gap-1.5">
            {[
              ['21:04', 'Kaito', 'Ataque (Ninjutsu): d20(17) + 3 + 3 = 23'],
              ['21:03', 'Mestre', 'Combate iniciado — ordem: Hana (19), Kaito (14)'],
              ['21:01', 'Hana', 'Solicitou ao mestre: Alterou inventário'],
            ].map(([t, who, text]) => (
              <div key={String(text)} className="well rounded-lg px-2.5 py-1.5 text-xs">
                <span className="text-orange-400/60">{t}</span> <span className="font-semibold text-orange-100">{who}</span>{' '}
                <span className="text-sky-300/80">{text}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
