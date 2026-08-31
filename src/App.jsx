import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion'
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Blocks,
  Home,
  MousePointer2,
  MoveUpRight,
  PenTool,
  ShoppingBag,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react'
import campaignNexo from './assets/campaign-nexo.webp'
import wordmark from './assets/wordmark-nexotechh.png'
import './App.css'

const services = [
  { icon: Blocks, title: 'Sites institucionais', text: 'Presenças digitais que traduzem a essência e a autoridade da sua marca.' },
  { icon: Target, title: 'Landing pages', text: 'Páginas estratégicas, construídas para transformar atenção em resultado.' },
  { icon: ShoppingBag, title: 'E-commerce', text: 'Experiências de compra rápidas, intuitivas e feitas para escalar.' },
  { icon: Zap, title: 'Alta conversão', text: 'Estratégia, conteúdo e interface trabalhando juntos em cada clique.' },
  { icon: PenTool, title: 'Design & identidade', text: 'Sistemas visuais consistentes para marcas que querem ser lembradas.' },
  { icon: MousePointer2, title: 'Experiências interativas', text: 'Movimento e tecnologia para criar conexões que ficam na memória.' },
]

const projects = [
  { name: 'Noma', type: 'Hospitalidade', color: '#b7ff3c', tagline: 'Uma pausa fora do comum.', theme: 'light' },
  { name: 'Atria', type: 'Arquitetura', color: '#ff6b3d', tagline: 'Espaços que respiram futuro.', theme: 'dark' },
  { name: 'Nuvem', type: 'Tecnologia', color: '#7b61ff', tagline: 'Complexidade, simplificada.', theme: 'violet' },
  { name: 'Vela', type: 'Moda', color: '#ff5da2', tagline: 'Vestir também é dizer.', theme: 'dark' },
  { name: 'Kuro', type: 'Fotografia', color: '#f4f4ef', tagline: 'O silêncio entre as imagens.', theme: 'dark' },
  { name: 'Pulso', type: 'Saúde & Fitness', color: '#38e1ff', tagline: 'Movimento vira hábito.', theme: 'violet' },
]

const narrativeChapters = [
  ['01', 'Toda grande presença começa com uma ideia.', 'IMAGINAR'],
  ['02', 'Estratégia transforma intenção em direção.', 'ESTRUTURAR'],
  ['03', 'Design e tecnologia dão forma ao impossível.', 'CRIAR'],
  ['04', 'Uma experiência pronta para ganhar o mundo.', 'LANÇAR'],
]

const DESK_FRAME_COUNT = 240
const DESK_SEQUENCE_VERSION = 1

function CinematicDeskScene({ progress }) {
  const canvasRef = useRef(null)
  const framesRef = useRef([])
  const currentFrameRef = useRef(0)
  const [loaded, setLoaded] = useState(0)

  const drawFrame = (index) => {
    const canvas = canvasRef.current
    const image = framesRef.current[index]
    if (!canvas || !image?.complete || !image.naturalWidth) return

    const rect = canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const width = Math.round(rect.width * dpr)
    const height = Math.round(rect.height * dpr)
    if (!width || !height) return
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
    }

    const context = canvas.getContext('2d')
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
    const sourceWidth = width / scale
    const sourceHeight = height / scale
    const sourceX = (image.naturalWidth - sourceWidth) / 2
    const sourceY = (image.naturalHeight - sourceHeight) / 2
    context.clearRect(0, 0, width, height)
    context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height)
  }

  useEffect(() => {
    let active = true
    framesRef.current = Array.from({ length: DESK_FRAME_COUNT }, (_, index) => {
      const image = new Image()
      image.src = `/frames/desk/frame-${String(index + 1).padStart(3, '0')}.webp?v=${DESK_SEQUENCE_VERSION}`
      image.onload = () => {
        if (!active) return
        setLoaded((value) => Math.min(value + 1, DESK_FRAME_COUNT))
        if (index === 0 || index === currentFrameRef.current) drawFrame(index)
      }
      return image
    })

    const onResize = () => drawFrame(currentFrameRef.current)
    window.addEventListener('resize', onResize)
    return () => {
      active = false
      window.removeEventListener('resize', onResize)
    }
  }, [])

  useMotionValueEvent(progress, 'change', (latest) => {
    const nextFrame = Math.min(DESK_FRAME_COUNT - 1, Math.round(latest * (DESK_FRAME_COUNT - 1)))
    if (nextFrame === currentFrameRef.current) return
    currentFrameRef.current = nextFrame
    requestAnimationFrame(() => drawFrame(nextFrame))
  })

  return (
    <div className="desk-film">
      <canvas
        ref={canvasRef}
        className="desk-film-canvas"
        aria-label="Desenvolvedor digitando código em um teclado, filmado à noite"
      />
      <div className="film-light-leak" />
      <div className="film-scanline" />
      <div className="film-vignette" />
      <div className="film-grain" />
      <div className={`frame-loader ${loaded === DESK_FRAME_COUNT ? 'complete' : ''}`}>
        <span style={{ width: `${(loaded / DESK_FRAME_COUNT) * 100}%` }} />
      </div>
    </div>
  )
}

function ScrollNarrative({ progress }) {
  const [activeChapter, setActiveChapter] = useState(0)

  useMotionValueEvent(progress, 'change', (latest) => {
    const nextChapter = Math.min(narrativeChapters.length - 1, Math.floor(latest * narrativeChapters.length))
    setActiveChapter((current) => current === nextChapter ? current : nextChapter)
  })

  const [number, text, label] = narrativeChapters[activeChapter]

  return (
    <div className="scroll-narrative">
      <div className="narrative-rail">
        {narrativeChapters.map((chapter, index) => (
          <i className={index <= activeChapter ? 'active' : ''} key={chapter[0]} />
        ))}
      </div>
      <motion.div
        className="narrative-content"
        key={number}
        initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <span>{number} — {label}</span>
        <strong>{text}</strong>
      </motion.div>
    </div>
  )
}

function CampaignBanner() {
  return (
    <section className="campaign" aria-label="Campanha NEXO Studio">
      <motion.img
        src={campaignNexo}
        alt="Campanha editorial da NEXO Studio: modelo segurando um laptop com um site premium na tela, sobre fundo verde fluo"
        initial={{ opacity: 0, scale: 1.02 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        loading="lazy"
      />
    </section>
  )
}

const codeLines = [
  [['kw', 'import'], ['pl', ' { motion } '], ['kw', 'from'], ['str', " 'framer-motion'"]],
  [['kw', 'import'], ['str', " './App.css'"]],
  [['pl', '']],
  [['kw', 'export default function'], ['cmp', ' Hero'], ['pl', '() {']],
  [['kw', '  return'], ['pl', ' (']],
  [['pl', '    <'], ['tag', 'section'], ['attr', ' className'], ['pl', '='], ['str', '"hero"'], ['pl', '>']],
  [['pl', '      <'], ['cmp', 'motion.h1'], ['pl', '']],
  [['attr', '        initial'], ['pl', '={{ opacity: '], ['num', '0'], ['pl', ', y: '], ['num', '40'], ['pl', ' }}']],
  [['attr', '        animate'], ['pl', '={{ opacity: '], ['num', '1'], ['pl', ', y: '], ['num', '0'], ['pl', ' }}']],
  [['attr', '        transition'], ['pl', '={{ duration: '], ['num', '0.9'], ['pl', ' }}']],
  [['pl', '      >']],
  [['pl', '        Sites que <'], ['tag', 'em'], ['pl', '>transformam</'], ['tag', 'em'], ['pl', '> negócios.']],
  [['pl', '      </'], ['cmp', 'motion.h1'], ['pl', '>']],
  [['pl', '      <'], ['tag', 'a'], ['attr', ' className'], ['pl', '='], ['str', '"button"'], ['pl', '>Quero meu site</'], ['tag', 'a'], ['pl', '>']],
  [['pl', '    </'], ['tag', 'section'], ['pl', '>']],
  [['pl', '  )']],
  [['pl', '}']],
]

function CodeShowcase() {
  return (
    <div className="showcase-stack">
      <motion.div
        className="mock-window"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mock-bar"><i /><i /><i /><span>nexotechh.com</span></div>
        <div className="mock-page">
          <div className="mock-nav">
            <b>N</b>
            <div className="mock-links"><i /><i /><i /><i /></div>
            <span className="mock-pill">Contato</span>
          </div>
          <div className="mock-hero">
            <div className="mock-copy">
              <small>ESTÚDIO DIGITAL INDEPENDENTE</small>
              <h4>Sites que <em>transformam</em> negócios.</h4>
              <span className="mock-cta">Quero meu site →</span>
            </div>
            <div className="mock-art" />
          </div>
          <div className="mock-row"><div className="mock-card" /><div className="mock-card" /><div className="mock-card" /></div>
        </div>
      </motion.div>

      <motion.div
        className="code-window"
        initial={{ opacity: 0, y: 70 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="code-bar">
          <i /><i /><i />
          <span>hero.jsx — nexotechh.com</span>
          <em>UTF-8 · JSX</em>
        </div>
        <pre className="code-body">
          {codeLines.map((line, index) => (
            <motion.div
              className="code-line"
              key={index}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + index * 0.07, duration: 0.35 }}
            >
              <span className="ln">{String(index + 1).padStart(2, '0')}</span>
              {line.map(([type, text], segment) => (
                <span key={segment} className={`tk-${type}`}>{text}</span>
              ))}
            </motion.div>
          ))}
          <span className="code-caret" />
        </pre>
      </motion.div>
    </div>
  )
}

function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 42 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function Counter({ value, suffix = '' }) {
  const ref = useRef()
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let frame
    const start = performance.now()
    const animate = (time) => {
      const progress = Math.min((time - start) / 1300, 1)
      setCount(Math.round((1 - Math.pow(1 - progress, 3)) * value))
      if (progress < 1) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [isInView, value])

  return <strong ref={ref}>{count}{suffix}</strong>
}

function WorkCarousel() {
  const count = projects.length
  const [active, setActive] = useState(1)
  const [viewport, setViewport] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1280))
  const go = (direction) => setActive((current) => (current + direction + count) % count)

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'ArrowRight') go(1)
      if (event.key === 'ArrowLeft') go(-1)
    }
    const onResize = () => setViewport(window.innerWidth)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const spacing = viewport < 640 ? 165 : viewport < 1024 ? 270 : 350
  const activeProject = projects[active]

  return (
    <div className="work-carousel">
      <motion.div
        className="carousel-stage"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.14}
        onDragEnd={(_, info) => {
          if (info.offset.x < -60 || info.velocity.x < -400) go(1)
          else if (info.offset.x > 60 || info.velocity.x > 400) go(-1)
        }}
      >
        {projects.map((project, index) => {
          const offset = index - active
          return (
            <motion.article
              key={project.name}
              className={`fan-card ${project.theme} ${offset === 0 ? 'active' : ''}`}
              style={{ '--accent-project': project.color, zIndex: 10 - Math.abs(offset) }}
              animate={{
                x: offset * spacing,
                y: Math.abs(offset) * 30,
                rotate: offset * 6,
                scale: offset === 0 ? 1 : Math.max(0.86, 0.93 - Math.abs(offset) * 0.02),
                opacity: Math.abs(offset) > 2 ? 0 : 1,
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 26 }}
              onClick={() => setActive(index)}
            >
              <span className="fan-num">0{index + 1}</span>
              <div className={`fan-body ${project.image ? 'has-shot' : ''}`}>
                {project.image ? (
                  <img className="fan-shot" src={project.image} alt={`Hero do site ${project.name}`} draggable={false} />
                ) : (
                  <div className="fan-orbit">
                    <div className="orbit-ring" />
                    <div className="orbit-core" />
                  </div>
                )}
                <span className="fan-logo">{project.name}®</span>
                <p>{project.tagline}</p>
              </div>
              <span className="fan-name">{project.name}</span>
            </motion.article>
          )
        })}
      </motion.div>

      <div className="carousel-hint">ARRASTE · CLIQUE · SETAS DO TECLADO</div>

      <div className="carousel-footer">
        <div className="carousel-index">
          <strong>{String(active + 1).padStart(2, '0')}</strong> / {String(count).padStart(2, '0')}
        </div>
        <div className="carousel-caption">
          <motion.h3
            key={activeProject.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeProject.name}
          </motion.h3>
          <span>2026 · {activeProject.type}</span>
          <div className="carousel-dots">
            {projects.map((project, index) => (
              <i key={project.name} className={index === active ? 'on' : ''} onClick={() => setActive(index)} />
            ))}
          </div>
        </div>
        <div className="carousel-arrows">
          <button onClick={() => go(-1)} aria-label="Projeto anterior"><ArrowLeft size={17} /></button>
          <button onClick={() => go(1)} aria-label="Próximo projeto"><ArrowRight size={17} /></button>
        </div>
      </div>
    </div>
  )
}

const navItems = [
  { href: '#inicio', label: 'Início', icon: Home },
  { href: '#sobre', label: 'Sobre', icon: Sparkles },
  { href: '#servicos', label: 'Serviços', icon: Blocks },
  { href: '#projetos', label: 'Projetos', icon: PenTool },
  { href: '#processo', label: 'Processo', icon: Zap },
  { href: '#contato', label: 'Contato', icon: ArrowUpRight, accent: true },
]

function navLinePath(cx, width, height) {
  const y = height - 3
  const inset = 18
  const half = 40
  const left = Math.max(inset + 2, cx - half)
  const right = Math.min(width - inset - 2, cx + half)
  const top = 15
  return [
    `M ${inset} ${y}`,
    `L ${left} ${y}`,
    `C ${left + 10} ${y} ${left} ${top} ${left + 20} ${top}`,
    `L ${right - 20} ${top}`,
    `C ${right} ${top} ${right - 10} ${y} ${right} ${y}`,
    `L ${width - inset} ${y}`,
  ].join(' ')
}

function SiteHeader() {
  const pillRef = useRef(null)
  const itemRefs = useRef([])
  const [active, setActive] = useState(0)
  const [hover, setHover] = useState(null)
  const [pillSize, setPillSize] = useState({ w: 520, h: 72 })
  const current = hover ?? active
  const cx = useSpring(80, { stiffness: 320, damping: 28, mass: 0.6 })
  const pathD = useTransform(cx, (x) => navLinePath(x, pillSize.w, pillSize.h))
  const peakY = 15

  const measure = (index) => {
    const pill = pillRef.current
    const item = itemRefs.current[index]
    if (!pill || !item) return
    const pillBox = pill.getBoundingClientRect()
    const itemBox = item.getBoundingClientRect()
    setPillSize({ w: pillBox.width, h: pillBox.height })
    cx.set(itemBox.left - pillBox.left + itemBox.width / 2)
  }

  useEffect(() => {
    const id = requestAnimationFrame(() => measure(current))
    return () => cancelAnimationFrame(id)
  }, [current])

  useEffect(() => {
    const ids = navItems.map((item) => item.href.slice(1))
    const onScroll = () => {
      let next = 0
      ids.forEach((id, i) => {
        const section = document.getElementById(id)
        if (section && section.getBoundingClientRect().top < window.innerHeight * 0.42) next = i
      })
      setActive((prev) => (prev === next ? prev : next))
    }
    const onResize = () => measure(hover ?? active)
    const ro = new ResizeObserver(() => measure(hover ?? active))
    if (pillRef.current) ro.observe(pillRef.current)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    onScroll()
    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [hover, active])

  return (
    <header className="nav">
      <nav ref={pillRef} className="nav-pill" onMouseLeave={() => setHover(null)}>
        <svg className="nav-line" aria-hidden="true">
          <defs>
            <filter id="nav-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <motion.path d={pathD} fill="none" stroke="#b8ff37" strokeWidth="2.4" strokeLinecap="round" />
          <motion.circle cx={cx} cy={peakY} r="4.5" fill="#b8ff37" filter="url(#nav-glow)" />
        </svg>
        {navItems.map((item, index) => {
          const Icon = item.icon
          const on = index === current
          return (
            <a
              key={item.href}
              ref={(node) => { itemRefs.current[index] = node }}
              href={item.href}
              className={`nav-item${item.accent ? ' accent' : ''}${on ? ' on' : ''}`}
              onMouseEnter={() => setHover(index)}
              onFocus={() => setHover(index)}
              onClick={() => setActive(index)}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{item.label}</span>
            </a>
          )
        })}
      </nav>
    </header>
  )
}

function App() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll()
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })
  const heroY = useTransform(scrollYProgress, [0, 0.18], [0, 150])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.16], [1, 0])
  const filmProgress = useTransform(heroProgress, [0, 0.82], [0, 1])
  const heroStageScale = useTransform(heroProgress, [0.82, 1], [1, 0.96])
  const heroVeilOpacity = useTransform(heroProgress, [0.82, 0.98], [0, 0.68])

  return (
    <div className="site-shell">
      <motion.div className="scroll-progress" style={{ scaleX: smoothProgress }} />

      <SiteHeader />

      <main>
        <section className="hero-section" id="inicio" ref={heroRef}>
          <div className="hero-sticky">
            <a className="hero-brand" href="#inicio" aria-label="Nexo Techh — início">
              <img className="brand-word" src={wordmark} alt="NEXOTECHH" />
            </a>
            <motion.div className="hero-stage" style={{ scale: heroStageScale }}>
            <motion.div className="hero-copy" style={{ y: heroY, opacity: heroOpacity }}>
            <motion.div
              className="eyebrow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              <span className="pulse-dot" /> ESTÚDIO DIGITAL INDEPENDENTE
            </motion.div>
            <h1>
              <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
                Sites que
              </motion.span>
              <motion.span className="outline-text" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}>
                transformam
              </motion.span>
              <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}>
                negócios.
              </motion.span>
            </h1>
            <motion.div className="hero-bottom" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }}>
              <p>Criamos experiências digitais modernas, rápidas e memoráveis para marcas que querem se destacar.</p>
              <div className="hero-actions">
                <a className="button primary" href="#contato">Quero meu site <ArrowDownRight size={18} /></a>
                <a className="text-link" href="#projetos">Conheça nosso trabalho <span>↘</span></a>
              </div>
            </motion.div>
            </motion.div>
            <div className="hero-canvas">
              <CinematicDeskScene progress={filmProgress} />
            </div>
            <ScrollNarrative progress={filmProgress} />
            <div className="scroll-hint"><span>ROLE PARA CONTROLAR O FILME</span><i /></div>
            <motion.div className="hero-exit-veil" style={{ opacity: heroVeilOpacity }} />
            </motion.div>
          </div>
        </section>

        <section className="manifesto section" id="sobre">
          <Reveal className="section-label"><span>01</span> SOBRE NÓS</Reveal>
          <div className="manifesto-grid">
            <Reveal>
              <h2>Não criamos apenas sites.<br /><em>Criamos presença digital.</em></h2>
            </Reveal>
            <Reveal delay={0.15} className="manifesto-copy">
              <p>Unimos estratégia, design, tecnologia e movimento para criar experiências que representam a essência de cada negócio — e transformam visitantes em clientes.</p>
              <a className="text-link" href="#processo">Descubra como pensamos <span>↗</span></a>
            </Reveal>
          </div>
          <div className="stats">
            <Reveal className="stat"><Counter value={47} suffix="+" /><span>Projetos entregues</span></Reveal>
            <Reveal delay={0.08} className="stat"><Counter value={100} suffix="%" /><span>Design personalizado</span></Reveal>
            <Reveal delay={0.16} className="stat"><Counter value={3} suffix="x" /><span>Mais engajamento</span></Reveal>
            <Reveal delay={0.24} className="stat"><Counter value={98} suffix="/100" /><span>Performance média</span></Reveal>
          </div>
        </section>

        <section className="services section" id="servicos">
          <Reveal className="section-label"><span>02</span> O QUE FAZEMOS</Reveal>
          <div className="section-heading">
            <Reveal><h2>Ideias ganham forma.<br /><span>Marcas ganham força.</span></h2></Reveal>
            <Reveal delay={0.1}><p>Do primeiro insight ao último pixel, construímos experiências completas e conectadas.</p></Reveal>
          </div>
          <div className="services-grid">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <motion.article
                  className="service-card"
                  key={service.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06, duration: 0.6 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="service-top"><Icon size={25} /><span>0{index + 1}</span></div>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                  <ArrowUpRight className="service-arrow" />
                </motion.article>
              )
            })}
          </div>
        </section>

        <section className="work section" id="projetos">
          <Reveal className="section-label"><span>03</span> TRABALHOS SELECIONADOS</Reveal>
          <div className="section-heading work-heading">
            <Reveal><h2>Projetos que<br /><span>falam por si.</span></h2></Reveal>
            <Reveal delay={0.1}><p>Estratégia e expressão visual em projetos pensados para pessoas — e construídos para resultados.</p></Reveal>
          </div>
          <WorkCarousel />
        </section>

        <div className="marquee" aria-hidden="true">
          <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}>
            DESIGN <Sparkles /> TECNOLOGIA <Sparkles /> EXPERIÊNCIA <Sparkles /> DESIGN <Sparkles /> TECNOLOGIA <Sparkles /> EXPERIÊNCIA <Sparkles />
          </motion.div>
        </div>

        <CampaignBanner />

        <section className="difference section">
          <Reveal className="section-label"><span>04</span> NOSSO DIFERENCIAL</Reveal>
          <div className="difference-grid">
            <Reveal className="difference-title">
              <p className="tiny">O PADRÃO NÃO É O NOSSO PADRÃO.</p>
              <h2>Por que ter<br />um site <em>comum?</em></h2>
            </Reveal>
            <div className="feature-list">
              {['Design sob medida', 'Performance de verdade', 'Movimento com propósito', 'SEO desde a estrutura', 'Experiência que converte'].map((item, index) => (
                <motion.div
                  className="feature-row"
                  key={item}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <span>0{index + 1}</span><strong>{item}</strong><MoveUpRight />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="showcase section">
          <Reveal className="section-label"><span>05</span> POR DENTRO DO CÓDIGO</Reveal>
          <div className="section-heading">
            <Reveal><h2>Design que você vê.<br /><span>Código que você sente.</span></h2></Reveal>
            <Reveal delay={0.1}><p>Cada interface nasce escrita à mão — sem templates, sem construtores de página. O resultado: leveza, precisão e performance.</p></Reveal>
          </div>
          <CodeShowcase />
        </section>

        <section className="process section" id="processo">
          <Reveal className="section-label"><span>06</span> NOSSO PROCESSO</Reveal>
          <div className="section-heading">
            <Reveal><h2>Do conceito<br /><span>ao lançamento.</span></h2></Reveal>
            <Reveal delay={0.1}><p>Um processo claro, colaborativo e sem ruído. Você acompanha cada decisão do início ao fim.</p></Reveal>
          </div>
          <div className="process-line">
            {[
              ['01', 'Estratégia', 'Entendemos seu negócio, público e objetivos.'],
              ['02', 'Design', 'Criamos identidade, interface e experiência.'],
              ['03', 'Desenvolvimento', 'Código rápido, responsivo e interativo.'],
              ['04', 'Lançamento', 'Testamos, publicamos e preparamos para crescer.'],
            ].map(([num, title, text], index) => (
              <Reveal className="process-step" delay={index * 0.1} key={num}>
                <span className="step-dot" />
                <span className="step-number">{num}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="final-cta" id="contato">
          <div className="cta-glow" />
          <Reveal className="cta-inner">
            <span className="eyebrow"><i className="pulse-dot" /> TEM UMA IDEIA?</span>
            <h2>Seu próximo site<br />pode ser <em>diferente.</em></h2>
            <p>Vamos transformar sua ideia em uma experiência digital que as pessoas realmente lembram.</p>
            <a className="button lime" href="mailto:ola@nexotechh.com">Começar um projeto <ArrowUpRight /></a>
          </Reveal>
        </section>
      </main>

      <footer>
        <div className="footer-brand">
          <a className="brand" href="#inicio"><img className="brand-word footer-word" src={wordmark} alt="NEXOTECHH" /></a>
          <p>Design. Tecnologia. Experiência.</p>
        </div>
        <div className="footer-links">
          <div><span>NAVEGAÇÃO</span><a href="#sobre">Sobre</a><a href="#servicos">Serviços</a><a href="#projetos">Projetos</a></div>
          <div><span>CONTATO</span><a href="mailto:ola@nexotechh.com">ola@nexotechh.com</a><a href="#contato">WhatsApp</a><a href="#contato">Instagram</a></div>
        </div>
        <div className="footer-bottom"><span>© 2026 NEXO TECHH</span><span>BRASIL — ATENDIMENTO GLOBAL</span><a href="#inicio">VOLTAR AO TOPO ↑</a></div>
      </footer>
    </div>
  )
}

export default App
