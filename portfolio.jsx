import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#ffffff",
  bg2: "#f7f7f7",
  bg3: "#f0f0f0",
  border: "#e4e4e4",
  border2: "#d0d0d0",
  ink: "#111111",
  ink2: "#444444",
  ink3: "#888888",
  teal: "#0d9488",
  tealD: "#0a7a70",
  tealL: "#e6f7f5",
};

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400&display=swap');
`;

const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #fff; color: #111; font-family: 'Inter', sans-serif; overflow-x: hidden; }

  @keyframes up { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:none; } }
  @keyframes photoin { from { opacity:0; transform:scale(.93); } to { opacity:1; transform:none; } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes marquee { from { transform:translateX(0); } to { transform:translateX(-50%); } }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
  @keyframes fadein { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }

  .anim-up-1 { animation: up .55s .05s ease both; }
  .anim-up-2 { animation: up .55s .12s ease both; }
  .anim-up-3 { animation: up .55s .20s ease both; }
  .anim-up-4 { animation: up .55s .28s ease both; }
  .anim-photo { animation: photoin .7s .1s ease both; }
  .anim-badge { animation: up .6s .5s ease both; }
  .anim-stats { animation: up .55s .32s ease both; }

  .reveal { opacity:0; transform:translateY(20px); transition:opacity .55s ease,transform .55s ease; }
  .reveal.in { opacity:1; transform:none; }

  .strip-track { animation: marquee 30s linear infinite; }
  .strip-track:hover { animation-play-state: paused; }

  .hero-ring {
    position:absolute; inset:-10px; border-radius:50%;
    border:2px dashed #d0d0d0;
    animation: spin 20s linear infinite;
    pointer-events:none;
  }
  .dot-live { animation: pulse 2.2s infinite; }
  .pub-pane-enter { animation: fadein .3s ease; }

  /* scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #f7f7f7; }
  ::-webkit-scrollbar-thumb { background: #d0d0d0; border-radius: 3px; }
`;

/* ─── DATA ──────────────────────────────────────────────────── */
const PUBS = [
  {
    year: "2024", venue: "Nature Human Behaviour",
    title: "The Extended Epistemic Agent: Cognition Beyond the Skull",
    authors: "A. Mercer · C. Hoffmann · R. Delacroix · Nat. Hum. Behav. 8, 1102–1118",
    abstract: "We propose a framework in which epistemic agency extends into material environments, social networks, and institutional structures. Drawing on 40 years of experimental data, we argue cognitive science must abandon methodological individualism — with direct implications for education, science policy, and AI design.",
    tags: ["Extended Mind", "Epistemology", "Theory"],
  },
  {
    year: "2023", venue: "Psychological Review",
    title: "Distributed Inference in Scientific Communities: A Network Analysis",
    authors: "A. Mercer · T. Yamamoto · Psychol. Rev. 130(4), 887–912",
    abstract: "Network analysis of 80 years of cognitive science literature shows high-impact discoveries emerge from communities with bridging positions between dense clusters and modulated openness to external influence. The sociology of communities is part of the cognitive machinery of science.",
    tags: ["Network Analysis", "Science of Science", "Collaboration"],
  },
  {
    year: "2022", venue: "Cognition",
    title: "Gesture, Metaphor, and the Scaffolding of Abstract Thought",
    authors: "A. Mercer · Cognition 221, 104992",
    abstract: "Spontaneous co-speech gesture does not merely accompany thought — it constitutes it. Three controlled studies show that preventing gesture impairs formation of novel conceptual connections, particularly in problems requiring analogical transfer across domains.",
    tags: ["Gesture", "Embodied Cognition", "Experiment"],
  },
  {
    year: "2021", venue: "Mind & Language",
    title: "Institutional Memory and Cognitive Scaffolding in Long-Lived Organizations",
    authors: "A. Mercer · S. Brandt · Mind & Lang. 36(3), 401–428",
    abstract: "Combining ethnographic fieldwork with computational modelling, we show institutional memory is a genuine cognitive phenomenon with measurable capacity, bandwidth, and fidelity constraints — not merely a metaphor for cultural continuity.",
    tags: ["Institutional Cognition", "Memory", "Organizations"],
  },
  {
    year: "2019", venue: "Philosophy of Science",
    title: "Against Methodological Individualism in Cognitive Science",
    authors: "A. Mercer · Phil. Sci. 86(5), 948–971",
    abstract: "A sustained argument that cognitive science's commitment to individual-level explanation is not a methodological preference but an unjustified metaphysical assumption. I outline an alternative programme for genuinely social cognitive science.",
    tags: ["Philosophy", "Methodology", "Social Cognition"],
  },
];

const PROJECTS = [
  { num:"01", status:"live", period:"2023–present", collab:"w/ LSE, Johns Hopkins", teal:false,
    title:"The Minds We Share: Collective Intelligence in Crisis Response",
    desc:"Multi-site longitudinal study of how emergency response teams adapt cognitive strategies under radical uncertainty, using wearable sensors and structured debriefs." },
  { num:"02", status:"live", period:"2022–present", collab:"w/ MPI Leipzig", teal:true,
    title:"Inscription and Understanding: How Scientific Diagrams Shape Reasoning",
    desc:"Experimental programme investigating how the visual properties of scientific diagrams alter inferences and the hypotheses scientists generate." },
  { num:"03", status:"done", period:"2019–2022", collab:"w/ Oxford STS Group", teal:false,
    title:"The Epistemic Life of Laboratories: Ethnography of Knowledge-Making",
    desc:"Three-year ethnographic study of two elite research labs examining how tacit knowledge is transmitted and institutionalised through daily practice." },
  { num:"04", status:"done", period:"2018–2021", collab:"ERC Consolidator Grant", teal:true,
    title:"Cognitive Prosthetics in the Digital Age: Tools, Cognition, Agency",
    desc:"Empirical and philosophical examination of how digital tools transform the cognitive capacities and epistemic responsibilities of their users." },
  { num:"05", status:"live", period:"2024–present", collab:"w/ UC Berkeley, Tokyo U.", teal:false,
    title:"Language, Thought, and the Limits of Linguistic Relativity",
    desc:"Cross-linguistic experimental study testing whether grammatical features of native language shape non-verbal reasoning in mathematically structured domains." },
  { num:"06", status:"done", period:"2016–2019", collab:"w/ Santa Fe Institute", teal:true,
    title:"The Social Structure of Scientific Consensus Formation",
    desc:"Computational study of how scientific consensus emerges and fails — modelling belief propagation through disciplinary networks under varying evidence conditions." },
];

const POSITIONS = [
  { period:"2020 – Present", role:"Associate Professor of Cognitive Science", org:"University of Oxford, Faculty of Philosophy",
    desc:"Leading the Distributed Cognition Lab; supervising doctoral students; PI on two ERC-funded projects. Introduced undergraduate modules in Philosophy of Cognitive Science and Epistemology of AI." },
  { period:"2016 – 2020", role:"Research Fellow", org:"Max Planck Institute for Human Cognitive and Brain Sciences",
    desc:"Foundational experimental work on gesture and abstract thought; co-led the Collective Intelligence research unit; coordinated two international collaborative consortia." },
  { period:"2014 – 2016", role:"Postdoctoral Researcher", org:"University of California, Berkeley",
    desc:"Institute of Cognitive and Brain Sciences. Developed theoretical foundations for the extended epistemic agency framework; published first major solo monograph." },
];

const EDUCATION = [
  { period:"2010 – 2014", role:"DPhil, Cognitive Science & Philosophy", org:"University of Cambridge, King's College",
    desc:"Thesis: Minds Without Borders: Towards a Social Epistemology of Cognition. Awarded with Distinction." },
  { period:"2008 – 2010", role:"MPhil, Philosophy of Mind", org:"University of Edinburgh",
    desc:"Specialisation in embodied and enactive cognitive science. Dissertation on metacognition in collaborative reasoning. Distinction." },
  { period:"2005 – 2008", role:"BA (Hons), Philosophy & Psychology", org:"University of Bristol",
    desc:"First Class Honours. Dean's Award for Academic Excellence." },
];

const SKILLS_A = [
  { name:"Experimental Design", level:"Expert",    w:95 },
  { name:"Qualitative / Ethnographic", level:"Expert", w:90 },
  { name:"Network Analysis",    level:"Proficient", w:80 },
  { name:"Bayesian Modelling",  level:"Proficient", w:72 },
];
const SKILLS_B = [
  { name:"R / Stan",  level:"Expert",    w:88, teal:true },
  { name:"Python",    level:"Proficient", w:75, teal:true },
  { name:"German",    level:"Fluent",     w:85, teal:true },
  { name:"French",    level:"Working",    w:60, teal:true },
];

const HONOURS = [
  { year:"2024", name:"William James Prize, APA" },
  { year:"2022", name:"Philip Leverhulme Prize" },
  { year:"2019", name:"ERC Consolidator Grant (€1.9M)" },
  { year:"2017", name:"BPS Book Award" },
  { year:"2014", name:"Fulbright Senior Scholarship" },
];

const STRIP_ITEMS = [
  "Extended Mind","Epistemology","Collective Intelligence","Philosophy of Mind",
  "Embodied Cognition","Science Studies","Network Analysis","Bayesian Modelling",
  "R / Stan","Ethnography","Distributed Cognition","Cognitive Science",
];

/* ─── HOOKS ─────────────────────────────────────────────────── */
function useScrollSpy() {
  const [active, setActive] = useState("hero");
  useEffect(() => {
    const ids = ["hero","research","projects","cv"];
    const handler = () => {
      let cur = "hero";
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 90) cur = id;
      });
      setActive(cur);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return active;
}

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); }
    }, { threshold: 0.08 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/* ─── SMALL COMPONENTS ──────────────────────────────────────── */
const Mono = ({ children, style = {} }) => (
  <span style={{ fontFamily:"'JetBrains Mono',monospace", ...style }}>{children}</span>
);

const Tag = ({ children, teal }) => (
  <span style={{
    fontSize:11.5, fontWeight:500, padding:"4px 12px", borderRadius:6,
    background: teal ? COLORS.tealL : COLORS.bg3,
    color: teal ? COLORS.teal : COLORS.ink2,
    border: `1px solid ${teal ? COLORS.tealL : COLORS.border}`,
    fontFamily:"'Inter',sans-serif",
  }}>{children}</span>
);

/* ─── NAV ───────────────────────────────────────────────────── */
function Nav({ active }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = ["hero","research","projects","cv"];
  const labels = { hero:"About", research:"Research", projects:"Projects", cv:"CV" };

  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:900,
      height:58, display:"flex", alignItems:"center", padding:"0 56px",
      background:"rgba(255,255,255,0.92)",
      backdropFilter:"blur(18px)", WebkitBackdropFilter:"blur(18px)",
      borderBottom:`1px solid ${COLORS.border}`,
      boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.06)" : "none",
      transition:"box-shadow .3s",
    }}>
      <a href="#hero" style={{
        fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:800,
        color:COLORS.ink, textDecoration:"none", letterSpacing:"-0.03em",
      }}>
        Dr. A. <span style={{ color:COLORS.teal }}>Mercer</span>
      </a>
      <div style={{ display:"flex", gap:2, marginLeft:"auto" }}>
        {links.map(id => (
          <a key={id} href={`#${id}`} style={{
            fontSize:13, fontWeight:500, textDecoration:"none",
            padding:"6px 14px", borderRadius:6,
            background: active === id ? COLORS.tealL : "transparent",
            color: active === id ? COLORS.teal : COLORS.ink3,
            transition:"background .15s, color .15s",
          }}>{labels[id]}</a>
        ))}
      </div>
    </nav>
  );
}

/* ─── HERO ──────────────────────────────────────────────────── */
function Hero() {
  return (
    <section id="hero" style={{
      minHeight:"100vh", paddingTop:58,
      display:"flex", flexDirection:"column",
      position:"relative", overflow:"hidden",
      background:COLORS.bg,
    }}>
      {/* grid lines */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:`linear-gradient(${COLORS.border} 1px,transparent 1px),linear-gradient(90deg,${COLORS.border} 1px,transparent 1px)`,
        backgroundSize:"120px 120px", opacity:.5,
      }}/>

      {/* main content */}
      <div style={{
        flex:1, display:"grid", gridTemplateColumns:"1fr auto",
        alignItems:"center", gap:56, padding:"88px 56px 64px",
        position:"relative",
      }}>
        <div>
          {/* eyebrow */}
          <div className="anim-up-1" style={{
            display:"inline-flex", alignItems:"center", gap:8,
            fontFamily:"'JetBrains Mono',monospace", fontSize:11,
            color:COLORS.teal, background:COLORS.tealL,
            padding:"5px 14px", borderRadius:100, marginBottom:28,
          }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:COLORS.teal, display:"inline-block" }}/>
            Associate Professor · University of Oxford
          </div>

          {/* headline */}
          <h1 className="anim-up-2" style={{
            fontFamily:"'Syne',sans-serif", fontWeight:800,
            fontSize:"clamp(56px,7vw,100px)", lineHeight:.97,
            letterSpacing:"-0.045em", color:COLORS.ink,
          }}>
            Studying the<br/>
            Architecture<br/>
            of <span style={{ color:COLORS.teal }}>Human</span> Thought
          </h1>

          {/* sub */}
          <p className="anim-up-3" style={{
            fontSize:17, color:COLORS.ink3, lineHeight:1.75,
            maxWidth:520, marginTop:28, marginBottom:44,
          }}>
            Cognitive scientist working at the intersection of philosophy of mind,
            experimental psychology, and the science of science — asking how knowledge
            is made through tools, communities, and institutions.
          </p>

          {/* buttons */}
          <div className="anim-up-4" style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <a href="#research" style={{
              display:"inline-flex", alignItems:"center", gap:8,
              background:COLORS.ink, color:"#fff",
              fontSize:14, fontWeight:600,
              padding:"13px 26px", borderRadius:100, textDecoration:"none",
              boxShadow:"0 2px 14px rgba(0,0,0,.15)",
              transition:"background .2s",
            }}
            onMouseEnter={e=>e.currentTarget.style.background=COLORS.teal}
            onMouseLeave={e=>e.currentTarget.style.background=COLORS.ink}
            >View Research →</a>

            {["Download CV","Google Scholar ↗"].map(label => (
              <a key={label} href="#" style={{
                display:"inline-flex", alignItems:"center",
                background:"transparent", color:COLORS.ink2,
                fontSize:14, fontWeight:500,
                padding:"13px 26px", borderRadius:100, textDecoration:"none",
                border:`1.5px solid ${COLORS.border2}`,
                transition:"background .2s, border-color .2s",
              }}
              onMouseEnter={e=>{ e.currentTarget.style.background=COLORS.bg2; e.currentTarget.style.borderColor=COLORS.ink3; }}
              onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor=COLORS.border2; }}
              >{label}</a>
            ))}
          </div>
        </div>

        {/* photo */}
        <div className="anim-photo" style={{ position:"relative", flexShrink:0 }}>
          <div className="hero-ring"/>
          <div style={{
            width:290, height:290, borderRadius:"50%",
            background:COLORS.bg3, border:`4px solid ${COLORS.bg}`,
            boxShadow:"0 8px 40px rgba(0,0,0,.1)",
            display:"flex", alignItems:"center", justifyContent:"center",
            overflow:"hidden", position:"relative",
          }}>
            <span style={{
              fontFamily:"'Syne',sans-serif", fontSize:68, fontWeight:800,
              color:COLORS.border2, letterSpacing:"-0.05em",
            }}>AM</span>
          </div>
          {/* badge */}
          <div className="anim-badge" style={{
            position:"absolute", bottom:8, right:-16,
            background:COLORS.bg, border:`1px solid ${COLORS.border}`,
            borderRadius:100, padding:"7px 16px 7px 10px",
            display:"flex", alignItems:"center", gap:10,
            boxShadow:"0 4px 16px rgba(0,0,0,.08)",
            fontSize:13, fontWeight:600, color:COLORS.ink,
          }}>
            <div style={{
              width:28, height:28, borderRadius:"50%", background:COLORS.ink,
              display:"flex", alignItems:"center", justifyContent:"center",
              color:"#fff", fontFamily:"'Syne',sans-serif", fontSize:10, fontWeight:800,
            }}>OU</div>
            Dr. A. Mercer
          </div>
        </div>
      </div>

      {/* stats */}
      <div className="anim-stats" style={{
        borderTop:`1px solid ${COLORS.border}`,
        display:"flex", alignItems:"center", padding:"0 56px",
      }}>
        {[
          { n:"28",    label:"Publications",    teal:false },
          { n:"4",     label:"Monographs",      teal:true  },
          { n:"6",     label:"Active Projects", teal:false },
          { n:"1.4k+", label:"Citations",       teal:true  },
        ].map((s, i) => (
          <div key={i} style={{
            padding:"28px 52px 28px 0", marginRight:52,
            borderRight: i < 3 ? `1px solid ${COLORS.border}` : "none",
          }}>
            <div style={{
              fontFamily:"'Syne',sans-serif", fontSize:38, fontWeight:800,
              letterSpacing:"-0.05em", lineHeight:1,
              color: s.teal ? COLORS.teal : COLORS.ink,
            }}>{s.n}</div>
            <div style={{
              fontFamily:"'JetBrains Mono',monospace",
              fontSize:11, color:COLORS.ink3, marginTop:4,
            }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── STRIP ─────────────────────────────────────────────────── */
function Strip() {
  const items = [...STRIP_ITEMS, ...STRIP_ITEMS];
  return (
    <div style={{
      borderTop:`1px solid ${COLORS.border}`,
      borderBottom:`1px solid ${COLORS.border}`,
      background:COLORS.bg2, overflow:"hidden",
      padding:"13px 0", position:"relative",
    }}>
      <div style={{
        position:"absolute", top:0, bottom:0, left:0, width:80, zIndex:2,
        background:`linear-gradient(90deg,${COLORS.bg2},transparent)`, pointerEvents:"none",
      }}/>
      <div style={{
        position:"absolute", top:0, bottom:0, right:0, width:80, zIndex:2,
        background:`linear-gradient(-90deg,${COLORS.bg2},transparent)`, pointerEvents:"none",
      }}/>
      <div className="strip-track" style={{ display:"flex", width:"max-content" }}>
        {items.map((item, i) => (
          <span key={i} style={{
            display:"inline-flex", alignItems:"center", gap:10,
            padding:"0 28px",
            fontFamily:"'JetBrains Mono',monospace", fontSize:12.5,
            color:COLORS.ink3, whiteSpace:"nowrap",
            borderRight:`1px solid ${COLORS.border}`,
            cursor:"default",
          }}
          onMouseEnter={e=>{ e.currentTarget.style.color=COLORS.teal; e.currentTarget.querySelector(".sd").style.background=COLORS.teal; }}
          onMouseLeave={e=>{ e.currentTarget.style.color=COLORS.ink3; e.currentTarget.querySelector(".sd").style.background=COLORS.border2; }}
          >
            <span className="sd" style={{ width:5, height:5, borderRadius:"50%", background:COLORS.border2, display:"inline-block", transition:"background .2s" }}/>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── SECTION HEADER ────────────────────────────────────────── */
function SecHeader({ num, title, meta, teal }) {
  return (
    <div style={{
      display:"flex", alignItems:"center",
      padding:"0 56px", height:58,
      borderBottom:`1px solid ${COLORS.border}`, gap:14,
    }}>
      <span style={{
        fontFamily:"'JetBrains Mono',monospace", fontSize:10.5,
        padding:"4px 12px", borderRadius:100,
        background: teal ? COLORS.tealL : COLORS.bg3,
        color: teal ? COLORS.teal : COLORS.ink3,
      }}>{num}</span>
      <h2 style={{
        fontFamily:"'Syne',sans-serif", fontSize:19, fontWeight:800,
        letterSpacing:"-0.03em", color:COLORS.ink,
      }}>{title}</h2>
      <span style={{
        fontFamily:"'JetBrains Mono',monospace",
        fontSize:11, color:COLORS.ink3, marginLeft:"auto",
      }}>{meta}</span>
    </div>
  );
}

/* ─── TIMELINE ENTRY ────────────────────────────────────────── */
function TlEntry({ period, role, org, desc }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ paddingLeft:28, paddingBottom:40, position:"relative" }}>
      {/* dot */}
      <div style={{
        position:"absolute", left:-5, top:14,
        width:11, height:11, borderRadius:"50%",
        background:COLORS.bg, border:`2px solid ${COLORS.teal}`,
        boxShadow: hov ? `0 0 0 7px ${COLORS.tealL}` : `0 0 0 4px ${COLORS.tealL}`,
        transition:"box-shadow .2s",
      }}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      />
      <Mono style={{ fontSize:10.5, color:COLORS.teal, marginBottom:6, display:"block" }}>{period}</Mono>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:21, fontWeight:800, letterSpacing:"-0.03em", color:COLORS.ink, lineHeight:1.2, marginBottom:4 }}>{role}</div>
      <div style={{ fontSize:14, fontStyle:"italic", color:COLORS.ink3, marginBottom:10 }}>{org}</div>
      <p style={{ fontSize:14.5, lineHeight:1.8, color:COLORS.ink2, maxWidth:580 }}>{desc}</p>
    </div>
  );
}

/* ─── SKILL BAR ─────────────────────────────────────────────── */
function SkillBar({ name, level, w, teal, animate }) {
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:14, color:COLORS.ink2, marginBottom:6 }}>
        {name}
        <Mono style={{ fontSize:10, color:COLORS.ink3 }}>{level}</Mono>
      </div>
      <div style={{ height:3, background:COLORS.bg3, borderRadius:100, overflow:"hidden" }}>
        <div style={{
          height:"100%", borderRadius:100,
          background: teal ? COLORS.teal : COLORS.ink,
          width: animate ? `${w}%` : "0%",
          transition:"width 1s cubic-bezier(.4,0,.2,1)",
        }}/>
      </div>
    </div>
  );
}

/* ─── RESEARCH ──────────────────────────────────────────────── */
function Research() {
  const [sel, setSel] = useState(0);
  const pub = PUBS[sel];
  return (
    <section id="research" style={{ borderTop:`1px solid ${COLORS.border}` }}>
      <SecHeader num="§ 01" title="Research & Publications" meta="28 papers · 4 books" teal />
      <div style={{ display:"grid", gridTemplateColumns:"300px 1fr" }}>
        {/* list */}
        <div style={{ borderRight:`1px solid ${COLORS.border}` }}>
          {PUBS.map((p, i) => (
            <div key={i} onClick={() => setSel(i)} style={{
              padding:"18px 24px",
              borderBottom:`1px solid ${COLORS.border}`,
              cursor:"pointer", position:"relative", overflow:"hidden",
              background: sel === i ? COLORS.tealL : "transparent",
              transition:"background .18s",
            }}
            onMouseEnter={e=>{ if(sel!==i) e.currentTarget.style.background=COLORS.bg2; }}
            onMouseLeave={e=>{ if(sel!==i) e.currentTarget.style.background="transparent"; }}
            >
              {/* left bar */}
              <div style={{
                position:"absolute", left:0, top:0, bottom:0, width:3,
                background:COLORS.teal,
                transform: sel === i ? "scaleY(1)" : "scaleY(0)",
                transformOrigin:"top", transition:"transform .22s ease",
              }}/>
              <Mono style={{ fontSize:10, color:COLORS.teal, marginBottom:4, display:"block" }}>{p.year}</Mono>
              <div style={{ fontSize:13, lineHeight:1.45, color: sel===i ? COLORS.ink : COLORS.ink2, fontWeight: sel===i ? 500 : 400 }}>{p.title}</div>
            </div>
          ))}
        </div>

        {/* detail */}
        <div key={sel} className="pub-pane-enter" style={{ padding:"48px 56px" }}>
          <div style={{
            display:"inline-block", fontFamily:"'JetBrains Mono',monospace",
            fontSize:11, padding:"4px 12px", borderRadius:100,
            background:COLORS.tealL, color:COLORS.teal, marginBottom:22,
          }}>{pub.venue} · {pub.year}</div>
          <h3 style={{
            fontFamily:"'Syne',sans-serif", fontSize:"clamp(22px,2.4vw,34px)", fontWeight:800,
            letterSpacing:"-0.035em", color:COLORS.ink, lineHeight:1.15, marginBottom:10,
          }}>{pub.title}</h3>
          <Mono style={{ fontSize:11, color:COLORS.ink3, marginBottom:26, display:"block" }}>{pub.authors}</Mono>
          <p style={{
            fontSize:15.5, lineHeight:1.85, color:COLORS.ink2,
            borderLeft:`3px solid ${COLORS.tealL}`, paddingLeft:18,
            maxWidth:640, marginBottom:26,
          }}>{pub.abstract}</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:26 }}>
            {pub.tags.map((t,i) => <Tag key={i} teal={i===0}>{t}</Tag>)}
          </div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {["Full Text","DOI","Cite","Preprint"].map((label,i) => (
              <a key={label} href="#" style={{
                fontSize:13, fontWeight:600, padding:"9px 20px", borderRadius:8,
                textDecoration:"none", transition:"all .18s",
                background: i===0 ? COLORS.ink : "transparent",
                color: i===0 ? "#fff" : COLORS.ink2,
                border: i===0 ? `1.5px solid ${COLORS.ink}` : `1.5px solid ${COLORS.border2}`,
              }}
              onMouseEnter={e=>{ if(i===0){e.currentTarget.style.background=COLORS.teal;e.currentTarget.style.borderColor=COLORS.teal;}else{e.currentTarget.style.background=COLORS.bg2;} }}
              onMouseLeave={e=>{ if(i===0){e.currentTarget.style.background=COLORS.ink;e.currentTarget.style.borderColor=COLORS.ink;}else{e.currentTarget.style.background="transparent";} }}
              >{label}</a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── PROJECTS ──────────────────────────────────────────────── */
function ProjectCard({ proj, delay }) {
  const ref = useReveal();
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} className="reveal" style={{
      borderRight: "1px solid " + COLORS.border,
      borderBottom: "1px solid " + COLORS.border,
      padding:"40px 36px", position:"relative", overflow:"hidden",
      background: hov ? COLORS.bg2 : COLORS.bg,
      transition:"background .2s",
      transitionDelay: `${delay}s`,
    }}
    onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
    >
      {/* top bar */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:3,
        background: proj.teal ? COLORS.teal : COLORS.ink,
        transform: hov ? "scaleX(1)" : "scaleX(0)",
        transformOrigin:"left", transition:"transform .3s ease",
      }}/>
      <div style={{
        fontFamily:"'Syne',sans-serif", fontSize:64, fontWeight:800,
        letterSpacing:"-0.06em", lineHeight:1, marginBottom:12,
        color: hov
          ? (proj.teal ? "rgba(13,148,136,.15)" : "rgba(0,0,0,.1)")
          : (proj.teal ? "rgba(13,148,136,.07)" : "rgba(0,0,0,.06)"),
        transition:"color .2s",
      }}>{proj.num}</div>
      <div style={{
        display:"inline-flex", alignItems:"center", gap:6,
        fontFamily:"'JetBrains Mono',monospace", fontSize:10.5,
        color: proj.status==="live" ? COLORS.teal : COLORS.ink3,
        marginBottom:14,
      }}>
        <span className={proj.status==="live" ? "dot-live" : ""} style={{
          width:6, height:6, borderRadius:"50%", flexShrink:0,
          background: proj.status==="live" ? COLORS.teal : COLORS.border2,
          display:"inline-block",
        }}/>
        {proj.status==="live" ? "Ongoing" : "Complete"} · {proj.period}
      </div>
      <h3 style={{
        fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:800,
        letterSpacing:"-0.025em", color:COLORS.ink, lineHeight:1.3, marginBottom:12,
      }}>{proj.title}</h3>
      <p style={{ fontSize:14, lineHeight:1.75, color:COLORS.ink3, marginBottom:24 }}>{proj.desc}</p>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", borderTop:`1px solid ${COLORS.border}`, paddingTop:14 }}>
        <Mono style={{ fontSize:10.5, color:COLORS.ink3 }}>{proj.collab}</Mono>
        <a href="#" style={{
          width:32, height:32, borderRadius:8,
          display:"flex", alignItems:"center", justifyContent:"center",
          border:`1.5px solid ${COLORS.border2}`,
          color:COLORS.ink2, textDecoration:"none", fontSize:14,
          background: hov ? (proj.teal ? COLORS.teal : COLORS.ink) : "transparent",
          borderColor: hov ? (proj.teal ? COLORS.teal : COLORS.ink) : COLORS.border2,
          color: hov ? "#fff" : COLORS.ink2,
          transition:"all .2s",
        }}>→</a>
      </div>
    </div>
  );
}

function Projects() {
  return (
    <section id="projects" style={{ borderTop:`1px solid ${COLORS.border}` }}>
      <SecHeader num="§ 02" title="Projects & Case Studies" meta="6 active · 12 completed" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)" }}>
        {PROJECTS.map((p, i) => <ProjectCard key={i} proj={p} delay={i * 0.07} />)}
      </div>
    </section>
  );
}

/* ─── CV ────────────────────────────────────────────────────── */
function CV() {
  const [tab, setTab] = useState("pos");
  const [barsAnimated, setBarsAnimated] = useState(false);

  const handleTab = (t) => {
    setTab(t);
    if (t === "skl") setTimeout(() => setBarsAnimated(true), 60);
  };

  const tabs = [
    { id:"pos", label:"Positions" },
    { id:"edu", label:"Education" },
    { id:"skl", label:"Skills & Methods" },
  ];

  return (
    <section id="cv" style={{ borderTop:`1px solid ${COLORS.border}` }}>
      <SecHeader num="§ 03" title="Curriculum Vitae" meta="Experience · Education · Skills" teal />
      <div style={{ display:"grid", gridTemplateColumns:"260px 1fr" }}>
        {/* sidebar */}
        <div style={{ borderRight:`1px solid ${COLORS.border}`, background:COLORS.bg2, padding:"32px 0" }}>
          <Mono style={{ fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.ink3, padding:"0 24px 12px", borderBottom:`1px solid ${COLORS.border}`, marginBottom:8, display:"block" }}>Navigate</Mono>
          {tabs.map(t => (
            <div key={t.id} onClick={() => handleTab(t.id)} style={{
              display:"flex", alignItems:"center", gap:10,
              padding:"12px 24px", fontSize:13.5, fontWeight:500,
              cursor:"pointer",
              borderLeft:`3px solid ${tab===t.id ? COLORS.teal : "transparent"}`,
              background: tab===t.id ? COLORS.tealL : "transparent",
              color: tab===t.id ? COLORS.teal : COLORS.ink2,
              transition:"all .18s",
            }}
            onMouseEnter={e=>{ if(tab!==t.id) e.currentTarget.style.background=COLORS.bg3; }}
            onMouseLeave={e=>{ if(tab!==t.id) e.currentTarget.style.background="transparent"; }}
            >
              <span style={{ width:7, height:7, borderRadius:"50%", flexShrink:0, background: tab===t.id ? COLORS.teal : COLORS.border2 }}/>
              {t.label}
            </div>
          ))}

          {/* honours */}
          <div style={{ marginTop:24, borderTop:`1px solid ${COLORS.border}`, padding:"20px 24px 0" }}>
            <Mono style={{ fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.ink3, marginBottom:16, display:"block" }}>Honours & Awards</Mono>
            {HONOURS.map((h,i) => (
              <div key={i} style={{ marginBottom:14 }}>
                <Mono style={{ fontSize:10, color:COLORS.teal }}>{h.year}</Mono>
                <div style={{ fontSize:13, lineHeight:1.4, color:COLORS.ink2, marginTop:2 }}>{h.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* main */}
        <div style={{ padding:"48px 52px" }}>
          {/* positions */}
          {tab === "pos" && (
            <div key="pos" className="pub-pane-enter">
              <div style={{ position:"relative" }}>
                <div style={{ position:"absolute", left:0, top:14, bottom:0, width:1, background:COLORS.border }}/>
                {POSITIONS.map((p,i) => <TlEntry key={i} {...p}/>)}
              </div>
            </div>
          )}

          {/* education */}
          {tab === "edu" && (
            <div key="edu" className="pub-pane-enter">
              <div style={{ position:"relative" }}>
                <div style={{ position:"absolute", left:0, top:14, bottom:0, width:1, background:COLORS.border }}/>
                {EDUCATION.map((e,i) => <TlEntry key={i} {...e}/>)}
              </div>
            </div>
          )}

          {/* skills */}
          {tab === "skl" && (
            <div key="skl" className="pub-pane-enter" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:44 }}>
              <div>
                <Mono style={{ fontSize:10.5, letterSpacing:"0.08em", textTransform:"uppercase", color:COLORS.ink3, marginBottom:20, paddingBottom:10, borderBottom:`1px solid ${COLORS.border}`, display:"block" }}>Research Methods</Mono>
                {SKILLS_A.map((s,i) => <SkillBar key={i} {...s} animate={barsAnimated}/>)}
              </div>
              <div>
                <Mono style={{ fontSize:10.5, letterSpacing:"0.08em", textTransform:"uppercase", color:COLORS.teal, marginBottom:20, paddingBottom:10, borderBottom:`1px solid ${COLORS.border}`, display:"block" }}>Technical & Languages</Mono>
                {SKILLS_B.map((s,i) => <SkillBar key={i} {...s} animate={barsAnimated}/>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{
      background:COLORS.ink, padding:"32px 56px",
      display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12,
    }}>
      {[
        <span>© 2026 <span style={{ color:COLORS.teal }}>Dr. A. Mercer</span> · University of Oxford</span>,
        <span>Dept. of Cognitive Sciences</span>,
        <span>No tracking · No ads</span>,
      ].map((c, i) => (
        <p key={i} style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, letterSpacing:"0.05em", color:"rgba(255,255,255,.3)" }}>{c}</p>
      ))}
    </footer>
  );
}

/* ─── ROOT ──────────────────────────────────────────────────── */
export default function Portfolio() {
  const active = useScrollSpy();

  return (
    <>
      <style>{FONTS}{GLOBAL_CSS}</style>
      <Nav active={active} />
      <Hero />
      <Strip />
      <Research />
      <Projects />
      <CV />
      <Footer />
    </>
  );
}
