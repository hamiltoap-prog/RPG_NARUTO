/**
 * A cara de um dado.
 *
 * O d6 continua com pontinhos, que é como todo mundo reconhece um dado de RPG.
 * Os outros aparecem com a silhueta da peça real — pirâmide do d4, losango do
 * d8, pipa do d10, o vinte de faces do d20 — e o número no meio, porque num d20
 * ninguém conta pontinho.
 */

const PIP_LAYOUT: Record<number, [number, number][]> = {
  1: [[1, 1]],
  2: [
    [0, 0],
    [2, 2],
  ],
  3: [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  4: [
    [0, 0],
    [0, 2],
    [2, 0],
    [2, 2],
  ],
  5: [
    [0, 0],
    [0, 2],
    [1, 1],
    [2, 0],
    [2, 2],
  ],
  6: [
    [0, 0],
    [0, 2],
    [1, 0],
    [1, 2],
    [2, 0],
    [2, 2],
  ],
}

/** Silhueta de cada dado, em coordenadas 0..100. */
const SHAPES: Record<number, string> = {
  4: '50,4 96,92 4,92',
  8: '50,3 93,50 50,97 7,50',
  10: '50,2 92,38 72,96 28,96 8,38',
  12: '50,2 88,22 96,62 50,98 4,62 12,22',
  20: '50,2 91,26 91,74 50,98 9,74 9,26',
  100: '50,2 91,26 91,74 50,98 9,74 9,26',
}

export function DieFace({
  value,
  sides = 6,
  rolling = false,
  delay = 0,
  size = 56,
}: {
  value: number
  sides?: number
  rolling?: boolean
  delay?: number
  size?: number
}) {
  const tumbling = rolling ? '[animation:dice-tumble_0.45s_linear_infinite]' : ''

  if (sides === 6) {
    const pips = PIP_LAYOUT[Math.min(6, Math.max(1, value))] ?? PIP_LAYOUT[1]
    return (
      <div
        className={`grid grid-cols-3 grid-rows-3 gap-0.5 rounded-sm border-2 p-1.5 transition ${
          rolling
            ? `border-[color:var(--orange)] bg-[color:var(--surface-raised)] ${tumbling}`
            : 'border-white bg-white'
        }`}
        style={{ width: size, height: size, animationDelay: `${delay}ms` }}
        title={`d6: ${value}`}
      >
        {Array.from({ length: 9 }, (_, i) => {
          const row = Math.floor(i / 3)
          const col = i % 3
          const on = pips.some(([r, c]) => r === row && c === col)
          return (
            <span
              key={i}
              className={`h-full w-full rounded-full ${on ? (rolling ? 'bg-[color:var(--orange)]' : 'bg-black') : ''}`}
            />
          )
        })}
      </div>
    )
  }

  const points = SHAPES[sides] ?? SHAPES[20]
  // No d4 o número fica mais para baixo: o topo da pirâmide é fino demais.
  const textY = sides === 4 ? 72 : 58
  return (
    <div
      className={`shrink-0 ${tumbling}`}
      style={{ width: size, height: size, animationDelay: `${delay}ms` }}
      title={`d${sides}: ${value}`}
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <polygon
          points={points}
          fill={rolling ? 'var(--surface-raised)' : '#ffffff'}
          stroke={rolling ? 'var(--orange)' : '#ffffff'}
          strokeWidth={5}
          strokeLinejoin="round"
        />
        <text
          x="50"
          y={textY}
          textAnchor="middle"
          fontSize={value > 99 ? 32 : 40}
          fontWeight="700"
          fill={rolling ? 'var(--orange)' : '#000000'}
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          {value}
        </text>
      </svg>
    </div>
  )
}
