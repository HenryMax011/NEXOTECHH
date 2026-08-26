import sharp from 'sharp'
import { mkdir, rm } from 'node:fs/promises'
import { join } from 'node:path'

const WIDTH = 1280
const HEIGHT = 720
const FRAME_COUNT = 240
const outputDir = join(process.cwd(), 'public', 'frames', 'studio')

const code = [
  "import { motion } from 'framer-motion'",
  "import './experience.css'",
  '',
  'export function DigitalExperience() {',
  '  return (',
  '    <main className="experience">',
  '      <motion.div className="ambient" />',
  '      <nav>',
  '        <Logo />',
  '        <Menu />',
  '      </nav>',
  '      <section className="hero">',
  '        <span>ESTÚDIO DIGITAL</span>',
  '        <h1>Ideas become',
  '          <em>experiences.</em>',
  '        </h1>',
  '        <p>Design, motion and technology</p>',
  '        <MagneticButton>Start a project</MagneticButton>',
  '      </section>',
  '      <InteractiveOrb strength={0.85} />',
  '    </main>',
  '  )',
  '}',
]

const escapeXml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')

const ease = (value) => 1 - Math.pow(1 - Math.max(0, Math.min(1, value)), 3)
const phase = (progress, start, end) => ease((progress - start) / (end - start))

function codeRows(progress) {
  const totalChars = code.join('\n').length
  const visibleChars = Math.floor(totalChars * Math.min(1, progress * 1.18))
  let remaining = visibleChars

  return code.map((line, index) => {
    const visible = line.slice(0, Math.max(0, remaining))
    remaining -= line.length + 1
    const y = 169 + index * 18
    const color = line.includes('className')
      ? '#b8ff37'
      : line.includes('motion') || line.includes('Interactive')
        ? '#c9a7ff'
        : line.includes('<') || line.includes('>')
          ? '#70d7ff'
          : '#b6bac6'

    return `<text x="92" y="${y}" fill="${color}" opacity="${visible ? 1 : .18}" font-family="Consolas, monospace" font-size="11">
      <tspan fill="#4f5360">${String(index + 1).padStart(2, '0')}</tspan>
      <tspan dx="14">${escapeXml(visible || ' ')}</tspan>
    </text>`
  }).join('')
}

function buildFrame(frame) {
  const progress = frame / (FRAME_COUNT - 1)
  const heroIn = phase(progress, .12, .32)
  const orbIn = phase(progress, .3, .52)
  const detailsIn = phase(progress, .52, .75)
  const polish = phase(progress, .72, .96)
  const cursorX = 1060 + Math.sin(progress * Math.PI * 3) * 82
  const cursorY = 480 - Math.cos(progress * Math.PI * 2) * 95
  const orbRotation = progress * 240
  const scanX = -380 + progress * 2000
  const timelineX = 92 + progress * 493

  return `
  <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="#07070a"/>
        <stop offset=".55" stop-color="#12101d"/>
        <stop offset="1" stop-color="#070909"/>
      </linearGradient>
      <radialGradient id="violetGlow">
        <stop stop-color="#754dff" stop-opacity=".9"/>
        <stop offset="1" stop-color="#754dff" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="limeGlow">
        <stop stop-color="#b8ff37" stop-opacity=".65"/>
        <stop offset="1" stop-color="#b8ff37" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="screen" x1="0" y1="0" x2="0" y2="1">
        <stop stop-color="#15171d"/>
        <stop offset="1" stop-color="#090a0e"/>
      </linearGradient>
      <filter id="blur28"><feGaussianBlur stdDeviation="28"/></filter>
      <filter id="blur60"><feGaussianBlur stdDeviation="60"/></filter>
      <filter id="shadow"><feDropShadow dx="0" dy="22" stdDeviation="28" flood-color="#000" flood-opacity=".8"/></filter>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="3" seed="${frame % 9}"/>
        <feColorMatrix type="saturate" values="0"/>
      </filter>
      <clipPath id="monitorClip"><rect x="53" y="72" width="1174" height="580" rx="12"/></clipPath>
      <clipPath id="previewClip"><rect x="635" y="114" width="556" height="500" rx="4"/></clipPath>
    </defs>

    <rect width="1280" height="720" fill="url(#bg)"/>
    <ellipse cx="1080" cy="80" rx="270" ry="160" fill="url(#violetGlow)" filter="url(#blur60)" opacity=".36"/>
    <ellipse cx="190" cy="660" rx="300" ry="110" fill="url(#limeGlow)" filter="url(#blur60)" opacity=".16"/>
    <circle cx="1168" cy="118" r="42" fill="#7b55ff" opacity=".18" filter="url(#blur28)"/>
    <circle cx="78" cy="558" r="26" fill="#b8ff37" opacity=".15" filter="url(#blur28)"/>

    <g filter="url(#shadow)">
      <rect x="35" y="54" width="1210" height="616" rx="24" fill="#050507" stroke="#32333b" stroke-width="2"/>
      <rect x="53" y="72" width="1174" height="580" rx="12" fill="url(#screen)"/>
    </g>

    <g clip-path="url(#monitorClip)">
      <rect x="53" y="72" width="1174" height="42" fill="#1b1d24"/>
      <circle cx="76" cy="93" r="5" fill="#ff5b56"/>
      <circle cx="94" cy="93" r="5" fill="#ffbd2e"/>
      <circle cx="112" cy="93" r="5" fill="#27ca40"/>
      <text x="139" y="98" fill="#7c818e" font-family="Segoe UI, sans-serif" font-size="10">nexo-studio / src / Experience.jsx</text>
      <rect x="53" y="114" width="582" height="538" fill="#0d0f14"/>
      <rect x="53" y="114" width="28" height="538" fill="#111319"/>
      <circle cx="67" cy="142" r="5" fill="#777b87"/>
      <rect x="62" y="164" width="10" height="10" rx="2" fill="#777b87"/>
      <path d="M62 191h10M67 186v10" stroke="#777b87" stroke-width="2"/>

      <rect x="81" y="114" width="554" height="36" fill="#12141a"/>
      <text x="96" y="137" fill="#c7cad2" font-family="Segoe UI, sans-serif" font-size="10">Experience.jsx</text>
      <rect x="92" y="150" width="493" height="1" fill="#222631"/>
      ${codeRows(progress)}
      <rect x="${timelineX}" y="${162 + Math.floor(progress * 21) * 18}" width="2" height="14" fill="#b8ff37" opacity="${Math.floor(frame / 8) % 2 ? .25 : 1}"/>

      <g clip-path="url(#previewClip)">
        <rect x="635" y="114" width="556" height="500" fill="#08080b"/>
        <g opacity="${.15 + polish * .85}">
          <path d="M635 198H1191M635 282H1191M635 366H1191M635 450H1191M635 534H1191" stroke="#fff" stroke-opacity=".055"/>
          <path d="M727 114V614M819 114V614M911 114V614M1003 114V614M1095 114V614" stroke="#fff" stroke-opacity=".055"/>
        </g>
        <ellipse cx="1035" cy="308" rx="${120 + orbIn * 65}" ry="${120 + orbIn * 65}" fill="url(#violetGlow)" opacity="${orbIn * .52}" filter="url(#blur28)"/>
        <ellipse cx="690" cy="580" rx="150" ry="90" fill="url(#limeGlow)" opacity="${polish * .2}" filter="url(#blur28)"/>

        <g transform="translate(0 ${24 - heroIn * 24})" opacity="${heroIn}">
          <rect x="671" y="146" width="22" height="22" fill="#b8ff37" transform="rotate(-7 682 157)"/>
          <text x="678" y="162" fill="#090a09" font-family="Arial" font-size="11" font-weight="700">N</text>
          <text x="701" y="162" fill="#fff" font-family="Arial" font-size="12" font-weight="700">NEXO.</text>
          <text x="1017" y="160" fill="#8d9099" font-family="Arial" font-size="8">WORK   SERVICES   CONTACT</text>
          <text x="674" y="254" fill="#a8abb4" font-family="Arial" font-size="8" letter-spacing="2">DIGITAL EXPERIENCE STUDIO</text>
          <text x="670" y="310" fill="#f7f7f4" font-family="Arial" font-size="48" font-weight="600" letter-spacing="-3">Ideas become</text>
          <text x="670" y="356" fill="none" stroke="#b8ff37" stroke-width="1" font-family="Georgia" font-style="italic" font-size="53">experiences.</text>
          <text x="674" y="400" fill="#8d9099" font-family="Arial" font-size="10">Design, motion and technology for brands</text>
          <text x="674" y="416" fill="#8d9099" font-family="Arial" font-size="10">that refuse to be ordinary.</text>
          <rect x="674" y="448" width="126" height="38" rx="3" fill="#b8ff37"/>
          <text x="691" y="471" fill="#090a09" font-family="Arial" font-size="9" font-weight="700">START A PROJECT  ↗</text>
        </g>

        <g transform="translate(1043 347) rotate(${orbRotation})" opacity="${orbIn}">
          <ellipse rx="92" ry="34" fill="none" stroke="#b8ff37" stroke-opacity=".55" transform="rotate(18)"/>
          <ellipse rx="92" ry="34" fill="none" stroke="#a888ff" stroke-opacity=".65" transform="rotate(78)"/>
          <ellipse rx="92" ry="34" fill="none" stroke="#fff" stroke-opacity=".18" transform="rotate(138)"/>
          <circle r="${34 + Math.sin(progress * 12) * 4}" fill="#7956ff"/>
          <circle cx="-11" cy="-13" r="9" fill="#b8ff37" opacity=".7" filter="url(#blur28)"/>
        </g>

        <g opacity="${detailsIn}" transform="translate(0 ${16 - detailsIn * 16})">
          <rect x="899" y="526" width="129" height="56" rx="5" fill="#12131a" stroke="#2b2d35"/>
          <text x="913" y="547" fill="#777b86" font-family="Arial" font-size="7">PERFORMANCE</text>
          <text x="913" y="571" fill="#fff" font-family="Arial" font-size="20">98<tspan fill="#b8ff37" font-size="9">/100</tspan></text>
          <rect x="1038" y="526" width="129" height="56" rx="5" fill="#12131a" stroke="#2b2d35"/>
          <text x="1052" y="547" fill="#777b86" font-family="Arial" font-size="7">MOTION SYSTEM</text>
          <text x="1052" y="570" fill="#fff" font-family="Arial" font-size="10">FLUID BY DESIGN</text>
        </g>

        <path d="M${cursorX} ${cursorY}l0 20 5-5 5 10 5-2-5-10h8z" fill="#fff" stroke="#09090b" stroke-width="1.5" opacity="${detailsIn}"/>
        <rect x="${scanX}" y="114" width="160" height="500" fill="#fff" opacity=".04" transform="skewX(-18)"/>
      </g>

      <rect x="635" y="114" width="556" height="30" fill="#15171d"/>
      <circle cx="653" cy="129" r="4" fill="#ff5b56"/>
      <circle cx="668" cy="129" r="4" fill="#ffbd2e"/>
      <circle cx="683" cy="129" r="4" fill="#27ca40"/>
      <rect x="743" y="121" width="339" height="16" rx="8" fill="#20232b"/>
      <text x="868" y="132" fill="#747884" font-family="Arial" font-size="7">localhost:5173</text>

      <rect x="53" y="626" width="1174" height="26" fill="#754dff"/>
      <text x="69" y="643" fill="#fff" font-family="Consolas, monospace" font-size="8">◉ main*   ⟳ HMR connected</text>
      <text x="1115" y="643" fill="#fff" font-family="Consolas, monospace" font-size="8">UTF-8   JSX</text>
    </g>

    <path d="M34 640C300 570 900 610 1248 470V720H0V680Z" fill="#050507" opacity=".56"/>
    <g opacity=".72">
      <rect x="438" y="677" width="404" height="21" rx="8" fill="#17181d"/>
      ${Array.from({ length: 22 }, (_, i) => `<rect x="${451 + i * 17}" y="682" width="12" height="7" rx="1.5" fill="#343640"/>`).join('')}
    </g>
    <ellipse cx="640" cy="700" rx="470" ry="28" fill="#000" opacity=".5" filter="url(#blur28)"/>
    <rect width="1280" height="720" filter="url(#grain)" opacity=".055" style="mix-blend-mode:screen"/>
    <rect x="16" y="16" width="1248" height="688" rx="4" fill="none" stroke="#fff" stroke-opacity=".08"/>
    <text x="37" y="42" fill="#fff" fill-opacity=".55" font-family="Consolas, monospace" font-size="8">● REC  /  NEXO BUILD SESSION</text>
    <text x="1168" y="42" fill="#fff" fill-opacity=".45" font-family="Consolas, monospace" font-size="8">${String(Math.floor(frame / 24 / 60)).padStart(2, '0')}:${String(Math.floor(frame / 24) % 60).padStart(2, '0')}:${String(frame % 24).padStart(2, '0')}</text>
  </svg>`
}

async function main() {
  await mkdir(outputDir, { recursive: true })
  await rm(outputDir, { recursive: true, force: true })
  await mkdir(outputDir, { recursive: true })

  const concurrency = 8
  for (let start = 0; start < FRAME_COUNT; start += concurrency) {
    const jobs = []
    for (let frame = start; frame < Math.min(start + concurrency, FRAME_COUNT); frame += 1) {
      const filename = `frame-${String(frame + 1).padStart(3, '0')}.webp`
      jobs.push(
        sharp(Buffer.from(buildFrame(frame)))
          .webp({ quality: 78, effort: 4 })
          .toFile(join(outputDir, filename)),
      )
    }
    await Promise.all(jobs)
    process.stdout.write(`\rRendered ${Math.min(start + concurrency, FRAME_COUNT)}/${FRAME_COUNT}`)
  }

  process.stdout.write('\nDone.\n')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
