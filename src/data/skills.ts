// Fonte: manual de regras, Capítulo 6 ("Utilizando as Habilidades") — ver docs/rules/08-pericias.md
import type { Skill } from '../types'

export const SKILLS: Skill[] = [
  { name: 'Atletismo', attribute: 'strength', description: 'Escalada, salto ou natação difíceis.' },
  { name: 'Taijutsu', attribute: 'strength', description: 'Aptidão física e conhecimento em manobras de combate corporal.' },
  { name: 'Bukijutsu', attribute: 'strength', description: 'Aptidão física e conhecimento em manejo de armas.' },
  { name: 'Acrobacia', attribute: 'dexterity', description: 'Equilíbrio em superfícies instáveis, saltos, fintas.' },
  { name: 'Prestidigitação', attribute: 'dexterity', description: 'Malabarismo manual — plantar/ocultar objetos, bater carteiras.' },
  { name: 'Furtividade', attribute: 'dexterity', description: 'Esconder-se ou mover-se sem ser notado.' },
  { name: 'Controle de Chakra', attribute: 'constitution', description: 'Capacidade de manipular/focar energia espiritual e física, inclusive em disputas de jutsu.' },
  { name: 'Ofícios', attribute: 'intelligence', description: 'Avaliar, criar ou reparar itens tecnológicos/arquitetônicos.' },
  { name: 'História', attribute: 'intelligence', description: 'Artefatos, clãs, culturas, eventos passados.' },
  { name: 'Investigação', attribute: 'intelligence', description: 'Deduzir localizações, identificar pontos fracos, coletar pistas.' },
  { name: 'Natureza', attribute: 'intelligence', description: 'Terrenos, fauna, flora, ciclos naturais.' },
  { name: 'Ninjutsu', attribute: 'intelligence', description: 'Criar, reconhecer e aprimorar técnicas de Ninjutsu.' },
  { name: 'Lidar com Animais', attribute: 'wisdom', description: 'Acalmar animais domesticados, manobras montado.' },
  { name: 'Genjutsu', attribute: 'wisdom', description: 'Manipular, criar ou dissipar ilusões que afetam os sentidos.' },
  { name: 'Intuição', attribute: 'wisdom', description: 'Determinar intenções verdadeiras, detectar mentiras.' },
  { name: 'Medicina', attribute: 'wisdom', description: 'Diagnosticar doenças, estabilizar companheiros moribundos.' },
  { name: 'Percepção', attribute: 'wisdom', description: 'Agudeza dos sentidos para notar presenças/detalhes ocultos.' },
  { name: 'Sobrevivência', attribute: 'wisdom', description: 'Rastrear alvos, caçar, guiar o grupo em ambientes perigosos.' },
  { name: 'Enganação', attribute: 'charisma', description: 'Esconder a verdade verbalmente ou por ações.' },
  { name: 'Intimidação', attribute: 'charisma', description: 'Influenciar via ameaças/presença física.' },
  { name: 'Atuação', attribute: 'charisma', description: 'Talento para entretenimento — música, dança, oratória.' },
  { name: 'Persuasão', attribute: 'charisma', description: 'Influenciar de forma amigável/diplomática.' },
]
