import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   LUMIQ Control Panel  v3
   Palette  : Clean white + sage accent
   Type     : Plus Jakarta Sans (system-safe)
   Numbers  : Tabular, consistent
   Layout   : Generous white space, clear hierarchy
   A11y     : WCAG 2.1 AA throughout
───────────────────────────────────────────── */

const C = {
  bg:        "#f9faf8",
  surface:   "#ffffff",
  sage:      "#2d6a4f",
  sage2:     "#40916c",
  sage3:     "#74c69d",
  sagePale:  "#d8f3dc",
  sageLight: "#f0faf4",
  border:    "#e8ede9",
  borderMid: "#d0d9d2",
  ink:       "#111814",
  inkSoft:   "#374840",
  muted:     "#7a8c82",
  mutedLight:"#a8b8b0",
  gold:      "#b07d2a",
  goldPale:  "#fdf6e3",
  rose:      "#8b3a3a",
  rosePale:  "#fdf0f0",
  sky:       "#2a5f8a",
  skyPale:   "#eff6ff",
  white:     "#ffffff",
  sidebar:   "#1a2420",
  sidebarAct:"rgba(116,198,157,0.12)",
  sidebarTxt:"rgba(240,245,242,0.42)",
  sidebarHi: "#74c69d",
};

/* ── category colours ── */
const CAT = {
  science:    { bg:"#eff6ff", fg:"#1d4ed8", bd:"#bfdbfe" },
  environment:{ bg:"#f0fdf4", fg:"#15803d", bd:"#bbf7d0" },
  youth:      { bg:"#fffbeb", fg:"#b45309", bd:"#fde68a" },
  wisdom:     { bg:"#f8f7f4", fg:"#44403c", bd:"#d6d3d1" },
  motivation: { bg:"#fff7ed", fg:"#c2410c", bd:"#fed7aa" },
  courage:    { bg:"#fdf2f2", fg:"#991b1b", bd:"#fecaca" },
  empowerment:{ bg:"#f0fdf4", fg:"#166534", bd:"#bbf7d0" },
  passion:    { bg:"#fdf4ff", fg:"#7e22ce", bd:"#e9d5ff" },
};

/* ── mock data ── */
const POSTS = [
  { id:1,  type:"morning_quote", date:"2026-05-31", quote:"The mind is not a vessel to be filled, but a fire to be kindled.", author:"Plutarch", author_role:"Greek Philosopher, 46–119 AD", theme:"curiosity", category:"wisdom", likes:142, shares:38, platforms:{linkedin:true,x:true,instagram:true} },
  { id:2,  type:"evening_news",  date:"2026-05-31", headline:"Scientists restore vision to blind patients using AI retinal implants", source:"Nature Medicine", summary:"Six patients who hadn't seen faces in years now can, using AI-enhanced retinal implants that translate camera input into electrical signals the brain can interpret.", quote:"The most beautiful thing we can experience is the mysterious.", quote_author:"Albert Einstein", quote_author_role:"Physicist & Nobel Laureate", category:"science", likes:289, shares:94, platforms:{linkedin:true,x:true,instagram:true} },
  { id:3,  type:"morning_quote", date:"2026-05-30", quote:"You are never too old to set another goal or to dream a new dream.", author:"C.S. Lewis", author_role:"Author & Scholar", theme:"resilience", category:"motivation", likes:201, shares:67, platforms:{linkedin:true,x:true,instagram:true} },
  { id:4,  type:"evening_news",  date:"2026-05-30", headline:"Amazon rainforest sees record reforestation — 2M trees in 90 days", source:"BBC Earth", summary:"Indigenous-led reforestation across Brazil planted 2 million trees in 90 days, the fastest community-driven effort ever recorded.", quote:"In every walk with nature, one receives far more than he seeks.", quote_author:"John Muir", quote_author_role:"Naturalist & Conservationist", category:"environment", likes:334, shares:112, platforms:{linkedin:true,x:true,instagram:true} },
  { id:5,  type:"morning_quote", date:"2026-05-29", quote:"It always seems impossible until it's done.", author:"Nelson Mandela", author_role:"Nobel Peace Prize Laureate", theme:"courage", category:"courage", likes:178, shares:55, platforms:{linkedin:true,x:false,instagram:true} },
  { id:6,  type:"evening_news",  date:"2026-05-29", headline:"16-year-old invents $12 water purifier now serving 40 villages", source:"CNN Heroes", summary:"A teenager from Kenya developed a solar-powered purifier from local materials, now deployed across 40 rural villages.", quote:"The young do not know enough to be prudent, and therefore attempt the impossible.", quote_author:"Pearl S. Buck", quote_author_role:"Nobel Prize-winning Author", category:"youth", likes:445, shares:189, platforms:{linkedin:true,x:true,instagram:true} },
  { id:7,  type:"morning_quote", date:"2026-05-28", quote:"We do not need magic to transform our world. We carry all the power we need inside ourselves already.", author:"J.K. Rowling", author_role:"Author", theme:"empowerment", category:"empowerment", likes:267, shares:78, platforms:{linkedin:true,x:true,instagram:true} },
  { id:8,  type:"evening_news",  date:"2026-05-28", headline:"Coral reef restoration achieves 70% recovery in Great Barrier Reef section", source:"AIMS", summary:"A coral gardening project achieved 70% coverage recovery in a 50-hectare section previously declared bleached beyond recovery.", quote:"Look deep into nature, and then you will understand everything better.", quote_author:"Albert Einstein", quote_author_role:"Physicist & Nobel Laureate", category:"environment", likes:398, shares:143, platforms:{linkedin:true,x:true,instagram:true} },
  { id:9,  type:"morning_quote", date:"2026-05-27", quote:"The only way to do great work is to love what you do.", author:"Steve Jobs", author_role:"Co-founder, Apple", theme:"passion", category:"passion", likes:312, shares:88, platforms:{linkedin:true,x:true,instagram:true} },
  { id:10, type:"evening_news",  date:"2026-05-27", headline:"Gene therapy cures rare childhood disease with 100% efficacy in trials", source:"The Lancet", summary:"A gene therapy developed over 12 years showed 100% efficacy in clinical trials for a rare metabolic disorder affecting children globally.", quote:"Science is a way of thinking much more than it is a body of knowledge.", quote_author:"Carl Sagan", quote_author_role:"Astronomer & Author", category:"science", likes:521, shares:201, platforms:{linkedin:true,x:true,instagram:true} },
];

const CAL = {
  "2026-05-31":{m:true,e:true}, "2026-05-30":{m:true,e:true},
  "2026-05-29":{m:true,e:true}, "2026-05-28":{m:true,e:true},
  "2026-05-27":{m:true,e:true}, "2026-05-26":{m:true,e:true},
  "2026-05-25":{m:true,e:false},"2026-05-24":{m:true,e:true},
  "2026-05-23":{m:true,e:true}, "2026-05-22":{m:false,e:true},
  "2026-05-21":{m:true,e:true}, "2026-05-20":{m:true,e:true},
};

/* ── tiny icon set ── */
const Ico = ({ n, s=16 }) => {
  const d = {
    sun:    "M12 3v1m0 16v1M4.22 4.22l.7.7m12.17 12.17.7.7M3 12h1m16 0h1M4.92 19.07l.7-.7M18.36 5.64l.7-.7M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
    moon:   "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
    heart:  null,
    share:  null,
    grid:   null,
    cal:    null,
    dash:   null,
    check:  "M20 6 9 17l-5-5",
    close:  "M18 6 6 18M6 6l12 12",
    li:     null,
    ig:     null,
    tw:     null,
    left:   "m15 18-6-6 6-6",
    right:  "m9 18 6-6-6-6",
    plus:   "M12 5v14M5 12h14",
    bot:    null,
    info:   "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm0-7v-4m0-4h.01",
    search: "m21 21-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
    map:    "M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4zm7-4v16m8-12v16",
  };
  const special = {
    heart: <svg aria-hidden width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    share: <svg aria-hidden width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
    grid:  <svg aria-hidden width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>,
    cal:   <svg aria-hidden width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    dash:  <svg aria-hidden width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="2" y="3" width="6" height="8" rx="1"/><rect x="10" y="3" width="12" height="4" rx="1"/><rect x="10" y="11" width="12" height="8" rx="1"/><rect x="2" y="15" width="6" height="6" rx="1"/></svg>,
    li:    <svg aria-hidden width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
    ig:    <svg aria-hidden width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/></svg>,
    tw:    <svg aria-hidden width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    bot:   <svg aria-hidden width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M12 2a3 3 0 0 1 3 3v6H9V5a3 3 0 0 1 3-3z"/><circle cx="9" cy="16" r="1" fill="currentColor"/><circle cx="15" cy="16" r="1" fill="currentColor"/></svg>,
  };
  if (special[n]) return special[n];
  return d[n] ? <svg aria-hidden width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d={d[n]}/></svg> : null;
};

/* ── animated counter ── */
const Count = ({ to, ms=1400 }) => {
  const [v, setV] = useState(0);
  const r = useRef();
  useEffect(() => {
    const t0 = performance.now();
    const tick = now => {
      const p = Math.min((now-t0)/ms, 1);
      setV(Math.round((1-Math.pow(1-p,3))*to));
      if (p<1) r.current = requestAnimationFrame(tick);
    };
    r.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(r.current);
  }, [to, ms]);
  return <>{v.toLocaleString("en-US")}</>;
};

/* ── tag chip ── */
const Tag = ({ label, fg, bg, bd }) => (
  <span style={{ display:"inline-block", padding:"2px 9px", borderRadius:4, fontSize:10, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", background:bg, color:fg, border:`1px solid ${bd}` }}>
    {label}
  </span>
);

/* ── divider ── */
const HR = () => <div style={{ height:1, background:C.border, margin:"0" }}/>;

/* ═══════════════════════════════════════════
   PIN CARD
═══════════════════════════════════════════ */
const PinCard = ({ post, onClick }) => {
  const [liked, setLiked] = useState(false);
  const cat = CAT[post.category] || CAT.wisdom;
  const am = post.type==="morning_quote";

  return (
    <article onClick={()=>onClick(post)} role="button" tabIndex={0}
      onKeyDown={e=>e.key==="Enter"&&onClick(post)}
      aria-label={am ? `Quote by ${post.author}` : post.headline}
      style={{ background:C.surface, borderRadius:12, border:`1px solid ${C.border}`, overflow:"hidden", cursor:"pointer", marginBottom:14, transition:"box-shadow .2s, transform .2s" }}
      onMouseEnter={e=>{ e.currentTarget.style.boxShadow="0 8px 28px rgba(17,24,20,.08)"; e.currentTarget.style.transform="translateY(-2px)"; }}
      onMouseLeave={e=>{ e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform="none"; }}
    >
      {/* top accent bar */}
      <div style={{ height:3, background: am ? C.gold : C.sage }}/>

      <div style={{ padding:"18px 18px 0" }}>
        {/* meta row */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ color: am ? C.gold : C.sage, display:"flex" }}><Ico n={am?"sun":"moon"} s={12}/></span>
            <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.08em", color: am ? C.gold : C.sage, textTransform:"uppercase" }}>
              {am ? "Morning Quote" : "Evening News"}
            </span>
          </div>
          <span style={{ fontSize:10, color:C.mutedLight }}>{post.date}</span>
        </div>

        {am ? (
          <>
            <p style={{ fontFamily:"Georgia,'Times New Roman',serif", fontSize:15, fontStyle:"italic", color:C.ink, lineHeight:1.6, margin:"0 0 10px" }}>
              "{post.quote}"
            </p>
            <p style={{ fontSize:11, fontWeight:700, color:C.inkSoft, margin:"0 0 4px" }}>— {post.author}</p>
            <p style={{ fontSize:10, color:C.muted, margin:"0 0 14px" }}>{post.author_role}</p>
            <Tag label={post.theme} fg={cat.fg} bg={cat.bg} bd={cat.bd}/>
          </>
        ) : (
          <>
            <Tag label={post.category} fg={cat.fg} bg={cat.bg} bd={cat.bd}/>
            <p style={{ fontFamily:"Georgia,'Times New Roman',serif", fontSize:15, fontWeight:700, color:C.ink, lineHeight:1.45, margin:"10px 0 6px" }}>
              {post.headline}
            </p>
            <p style={{ fontSize:11, color:C.muted, margin:"0 0 10px" }}>{post.source}</p>
            <p style={{ fontSize:12, color:C.inkSoft, lineHeight:1.65, margin:"0 0 12px", fontWeight:300 }}>{post.summary}</p>
            <div style={{ background:C.sageLight, borderLeft:`2px solid ${C.sage3}`, borderRadius:"0 6px 6px 0", padding:"8px 12px", marginBottom:14 }}>
              <p style={{ fontFamily:"Georgia,serif", fontSize:12, fontStyle:"italic", color:C.inkSoft, margin:0, lineHeight:1.55 }}>"{post.quote}"</p>
              <p style={{ fontSize:10, fontWeight:700, color:C.sage2, margin:"5px 0 0" }}>— {post.quote_author}</p>
            </div>
          </>
        )}
      </div>

      {/* footer */}
      <HR/>
      <div style={{ padding:"10px 18px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", gap:14 }}>
          <button onClick={e=>{ e.stopPropagation(); setLiked(l=>!l); }}
            aria-label={liked?"Unlike":"Like"}
            style={{ display:"flex", alignItems:"center", gap:4, background:"none", border:"none", cursor:"pointer", fontSize:12, color:liked?"#dc2626":C.muted, padding:0, fontWeight:600, fontFamily:"inherit" }}>
            <Ico n="heart" s={12}/> {post.likes+(liked?1:0)}
          </button>
          <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:C.muted }}>
            <Ico n="share" s={12}/> {post.shares}
          </span>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {post.platforms?.linkedin  && <span style={{ color:"#0077b5" }} aria-label="LinkedIn"><Ico n="li" s={12}/></span>}
          {post.platforms?.x         && <span style={{ color:C.inkSoft }} aria-label="X"><Ico n="tw" s={12}/></span>}
          {post.platforms?.instagram && <span style={{ color:"#e1306c" }} aria-label="Instagram"><Ico n="ig" s={12}/></span>}
        </div>
      </div>
    </article>
  );
};

/* ═══════════════════════════════════════════
   MODAL
═══════════════════════════════════════════ */
const Modal = ({ post, onClose }) => {
  useEffect(()=>{
    if (!post) return;
    const h = e => e.key==="Escape" && onClose();
    document.addEventListener("keydown",h);
    return ()=>document.removeEventListener("keydown",h);
  },[post,onClose]);
  if (!post) return null;
  const cat = CAT[post.category]||CAT.wisdom;
  const am = post.type==="morning_quote";
  return (
    <div role="dialog" aria-modal aria-label="Post detail"
      style={{ position:"fixed", inset:0, background:"rgba(17,24,20,.45)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20, backdropFilter:"blur(6px)" }}
      onClick={onClose}>
      <div onClick={e=>e.stopPropagation()}
        style={{ background:C.surface, borderRadius:16, maxWidth:500, width:"100%", maxHeight:"88vh", overflowY:"auto", boxShadow:"0 24px 64px rgba(17,24,20,.18)", border:`1px solid ${C.border}` }}>

        {/* header */}
        <div style={{ padding:"24px 24px 20px", borderBottom:`1px solid ${C.border}`, position:"relative" }}>
          <button onClick={onClose} aria-label="Close"
            style={{ position:"absolute", top:16, right:16, background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, width:30, height:30, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:C.inkSoft }}>
            <Ico n="close" s={14}/>
          </button>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:14 }}>
            <span style={{ color: am?C.gold:C.sage }}><Ico n={am?"sun":"moon"} s={13}/></span>
            <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.08em", color: am?C.gold:C.sage, textTransform:"uppercase" }}>
              {am?"Morning Quote":"Evening News"} · {post.date}
            </span>
          </div>
          {am ? (
            <>
              <p style={{ fontFamily:"Georgia,serif", fontSize:20, fontStyle:"italic", color:C.ink, lineHeight:1.5, margin:"0 0 10px" }}>"{post.quote}"</p>
              <p style={{ fontSize:13, fontWeight:700, color:C.inkSoft, margin:"0 0 2px" }}>— {post.author}</p>
              <p style={{ fontSize:11, color:C.muted }}>{post.author_role}</p>
            </>
          ) : (
            <>
              <Tag label={post.category} fg={cat.fg} bg={cat.bg} bd={cat.bd}/>
              <p style={{ fontFamily:"Georgia,serif", fontSize:18, fontWeight:700, color:C.ink, lineHeight:1.4, margin:"10px 0 4px" }}>{post.headline}</p>
              <p style={{ fontSize:11, color:C.muted }}>{post.source}</p>
            </>
          )}
        </div>

        {/* body */}
        <div style={{ padding:"20px 24px 24px" }}>
          {am ? (
            <div style={{ background:C.sageLight, borderRadius:8, padding:"14px 16px", marginBottom:16 }}>
              <p style={{ fontSize:10, fontWeight:700, color:C.sage, letterSpacing:"0.08em", textTransform:"uppercase", margin:"0 0 4px" }}>Theme</p>
              <Tag label={post.theme} fg={cat.fg} bg={cat.bg} bd={cat.bd}/>
            </div>
          ) : (
            <>
              <p style={{ fontSize:14, color:C.inkSoft, lineHeight:1.75, margin:"0 0 16px", fontWeight:300 }}>{post.summary}</p>
              <div style={{ background:C.sageLight, borderLeft:`2px solid ${C.sage3}`, borderRadius:"0 8px 8px 0", padding:"12px 16px", marginBottom:16 }}>
                <p style={{ fontFamily:"Georgia,serif", fontSize:14, fontStyle:"italic", color:C.inkSoft, margin:0, lineHeight:1.55 }}>"{post.quote}"</p>
                <p style={{ fontSize:11, fontWeight:700, color:C.sage2, margin:"6px 0 0" }}>— {post.quote_author}<span style={{ fontWeight:400, color:C.muted }}>, {post.quote_author_role}</span></p>
              </div>
            </>
          )}
          <HR/>
          <div style={{ paddingTop:16 }}>
            <p style={{ fontSize:10, fontWeight:700, color:C.muted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:10 }}>Published to</p>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {post.platforms?.linkedin  && <span style={{ display:"flex", alignItems:"center", gap:6, background:"#eff6ff", color:"#0077b5", padding:"5px 12px", borderRadius:6, fontSize:12, fontWeight:600, border:"1px solid #bfdbfe" }}><Ico n="li" s={13}/> LinkedIn</span>}
              {post.platforms?.x         && <span style={{ display:"flex", alignItems:"center", gap:6, background:"#f3f4f6", color:C.ink,       padding:"5px 12px", borderRadius:6, fontSize:12, fontWeight:600, border:"1px solid #e5e7eb" }}><Ico n="tw" s={13}/> X</span>}
              {post.platforms?.instagram && <span style={{ display:"flex", alignItems:"center", gap:6, background:"#fdf4ff", color:"#e1306c",   padding:"5px 12px", borderRadius:6, fontSize:12, fontWeight:600, border:"1px solid #e9d5ff" }}><Ico n="ig" s={13}/> Instagram</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════ */
const Dashboard = () => {
  const stats = [
    { label:"Total Posts",   val:47,   sub:"Since launch",       icon:"grid" },
    { label:"Total Likes",   val:8234, sub:"Across platforms",   icon:"heart" },
    { label:"Total Shares",  val:2891, sub:"Organic reach",      icon:"share" },
    { label:"Day Streak",    val:23,   sub:"Consecutive days",   icon:"cal" },
    { label:"Platforms",     val:3,    sub:"LinkedIn · X · IG",  icon:"map" },
    { label:"This Week",     val:14,   sub:"Posts published",    icon:"dash" },
  ];
  const platforms = [
    { name:"LinkedIn",    icon:"li", color:"#0077b5", bg:"#eff6ff", bd:"#bfdbfe", posts:47 },
    { name:"X (Twitter)", icon:"tw", color:C.ink,     bg:"#f3f4f6", bd:"#e5e7eb", posts:45 },
    { name:"Instagram",   icon:"ig", color:"#e1306c", bg:"#fdf4ff", bd:"#e9d5ff", posts:47 },
  ];
  const roadmap = [
    { phase:"Phase 1 · Live now", done:true,  title:"Core agent + control panel",
      items:["Daily quote agent (7 AM)","Daily news agent (7 PM)","LinkedIn, X, Instagram posting","Dashboard · Feed · Calendar"] },
    { phase:"Phase 2 · Next",     done:false, title:"Public portal & flash cards",
      items:["lumiq.app public website","Flash card learning system","3 learning paths","SEO & search console setup"] },
    { phase:"Phase 3 · Later",    done:false, title:"Community & intelligence",
      items:["Contributor system","Adaptive learning paths","Knowledge graph","Multi-language support"] },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>

      {/* agent banner */}
      <div style={{ background:C.sage, borderRadius:10, padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:36, height:36, background:"rgba(255,255,255,0.12)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}><Ico n="bot" s={18}/></div>
          <div>
            <p style={{ color:"#fff", fontWeight:700, fontSize:14, margin:0 }}>LUMIQ Agent · Running</p>
            <p style={{ color:"rgba(255,255,255,0.6)", fontSize:11, margin:0 }}>🌅 7:00 AM · 🌆 7:00 PM · LinkedIn, X, Instagram</p>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:"#86efac" }}/>
          <span style={{ fontSize:11, color:"rgba(255,255,255,0.8)", fontWeight:600 }}>Live</span>
        </div>
      </div>

      {/* sample data notice */}
      <div style={{ background:C.goldPale, border:`1px solid #f0d080`, borderRadius:8, padding:"10px 16px", display:"flex", gap:10, alignItems:"flex-start" }}>
        <span style={{ color:C.gold, flexShrink:0, marginTop:1 }}><Ico n="info" s={14}/></span>
        <p style={{ fontSize:12, color:"#78550a", margin:0, lineHeight:1.6 }}>
          <strong>Sample data.</strong> Live metrics will appear once your Anthropic API key is added and agents begin running.
        </p>
      </div>

      {/* stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12 }}>
        {stats.map(s=>(
          <div key={s.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"18px 20px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <span style={{ fontSize:10, fontWeight:700, color:C.muted, letterSpacing:"0.07em", textTransform:"uppercase" }}>{s.label}</span>
              <span style={{ color:C.sage, opacity:.7 }}><Ico n={s.icon} s={14}/></span>
            </div>
            <div style={{ fontSize:32, fontWeight:700, color:C.ink, lineHeight:1, fontVariantNumeric:"tabular-nums" }}>
              <Count to={s.val}/>
            </div>
            <p style={{ fontSize:11, color:C.muted, margin:"6px 0 0" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* platform status */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
        <div style={{ padding:"16px 20px 14px" }}>
          <h2 style={{ fontSize:15, fontWeight:700, color:C.ink, margin:0 }}>Platform Status</h2>
        </div>
        <HR/>
        <div style={{ padding:"12px 20px 16px", display:"flex", flexDirection:"column", gap:8 }}>
          {platforms.map(p=>(
            <div key={p.name} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:C.bg, borderRadius:8, border:`1px solid ${C.border}` }}>
              <div style={{ width:32, height:32, background:p.bg, border:`1px solid ${p.bd}`, borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", color:p.color }}><Ico n={p.icon} s={14}/></div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13, fontWeight:600, color:C.ink, margin:0 }}>{p.name}</p>
                <p style={{ fontSize:11, color:C.muted, margin:0 }}>{p.posts} posts published</p>
              </div>
              <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:C.sage, fontWeight:700, background:C.sagePale, padding:"3px 10px", borderRadius:5, border:`1px solid ${C.border}` }}>
                <Ico n="check" s={11}/> Connected
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* roadmap */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
        <div style={{ padding:"16px 20px 14px" }}>
          <h2 style={{ fontSize:15, fontWeight:700, color:C.ink, margin:0 }}>Roadmap</h2>
          <p style={{ fontSize:12, color:C.muted, margin:"4px 0 0" }}>What is live today and what is planned — full transparency.</p>
        </div>
        <HR/>
        <div style={{ padding:"16px 20px 20px" }}>
          {roadmap.map((r,i)=>(
            <div key={i} style={{ display:"flex", gap:16, paddingBottom: i<2 ? 20:0, marginBottom: i<2 ? 20:0, borderBottom: i<2 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ paddingTop:3 }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background: r.done ? C.sage : C.border, border:`2px solid ${r.done?C.sage:C.borderMid}`, flexShrink:0 }}/>
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:10, fontWeight:700, color: r.done?C.sage:C.muted, letterSpacing:"0.08em", textTransform:"uppercase", margin:"0 0 4px" }}>{r.phase}</p>
                <p style={{ fontSize:14, fontWeight:700, color:C.ink, margin:"0 0 10px" }}>{r.title}</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {r.items.map(it=>(
                    <span key={it} style={{ fontSize:11, padding:"3px 10px", borderRadius:5, border:`1px solid ${C.border}`, color: r.done?C.sage:C.muted, background: r.done?C.sageLight:C.bg }}>
                      {r.done&&"✓ "}{it}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   FEED
═══════════════════════════════════════════ */
const Feed = ({ onCard }) => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch]  = useState("");
  const filters = [
    {k:"all",l:"All"},{k:"morning",l:"Morning"},{k:"evening",l:"Evening"},
    {k:"science",l:"Science"},{k:"environment",l:"Nature"},
    {k:"wisdom",l:"Wisdom"},{k:"youth",l:"Youth"},{k:"courage",l:"Courage"},
  ];
  const shown = POSTS.filter(p=>{
    const mt = filter==="all" || (filter==="morning"&&p.type==="morning_quote") || (filter==="evening"&&p.type==="evening_news") || filter===p.category;
    const ms = !search || (p.quote||p.headline||"").toLowerCase().includes(search.toLowerCase()) || (p.author||p.quote_author||"").toLowerCase().includes(search.toLowerCase());
    return mt&&ms;
  });
  const [c1,c2,c3] = [shown.filter((_,i)=>i%3===0), shown.filter((_,i)=>i%3===1), shown.filter((_,i)=>i%3===2)];

  return (
    <div>
      {/* search */}
      <div style={{ position:"relative", marginBottom:14 }}>
        <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:C.muted, pointerEvents:"none" }}><Ico n="search" s={15}/></span>
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search quotes, headlines, authors…"
          aria-label="Search posts"
          style={{ width:"100%", padding:"10px 14px 10px 38px", borderRadius:8, border:`1.5px solid ${C.border}`, fontSize:13, outline:"none", background:C.surface, color:C.ink, fontFamily:"inherit", boxSizing:"border-box" }}
          onFocus={e=>e.target.style.borderColor=C.sage2}
          onBlur={e=>e.target.style.borderColor=C.border}
        />
      </div>

      {/* filter pills */}
      <div role="group" aria-label="Filter posts" style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:20 }}>
        {filters.map(f=>(
          <button key={f.k} onClick={()=>setFilter(f.k)} aria-pressed={filter===f.k}
            style={{ padding:"5px 13px", borderRadius:6, border:"1.5px solid", fontSize:12, fontWeight:600, cursor:"pointer", transition:"all .15s", borderColor:filter===f.k?C.sage:C.border, background:filter===f.k?C.sage:C.surface, color:filter===f.k?"#fff":C.inkSoft, fontFamily:"inherit" }}>
            {f.l}
          </button>
        ))}
      </div>

      <p style={{ fontSize:11, color:C.muted, marginBottom:16 }}>{shown.length} posts</p>

      {/* masonry */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, alignItems:"start" }}>
        {[c1,c2,c3].map((col,i)=><div key={i}>{col.map(p=><PinCard key={p.id} post={p} onClick={onCard}/>)}</div>)}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   CALENDAR
═══════════════════════════════════════════ */
const Calendar = () => {
  const [cur, setCur] = useState({y:2026,m:4});
  const [sel, setSel] = useState(null);
  const MN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const DN = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const first = new Date(cur.y,cur.m,1).getDay();
  const total = new Date(cur.y,cur.m+1,0).getDate();
  const key  = d => `${cur.y}-${String(cur.m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const prev = () => setCur(p=>p.m===0?{y:p.y-1,m:11}:{y:p.y,m:p.m-1});
  const next = () => setCur(p=>p.m===11?{y:p.y+1,m:0}:{y:p.y,m:p.m+1});
  const selPosts = sel ? POSTS.filter(p=>p.date===key(sel)) : [];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

      {/* mini stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
        {[{l:"Posts this month",v:"24"},{l:"Current streak",v:"23 days"},{l:"Completion",v:"96%"}].map(s=>(
          <div key={s.l} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"16px 18px", textAlign:"center" }}>
            <div style={{ fontSize:26, fontWeight:700, color:C.sage, lineHeight:1, marginBottom:4 }}>{s.v}</div>
            <div style={{ fontSize:11, color:C.muted }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* calendar card */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
        {/* cal header */}
        <div style={{ padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <h2 style={{ fontSize:16, fontWeight:700, color:C.ink, margin:0 }}>{MN[cur.m]} {cur.y}</h2>
          <div style={{ display:"flex", gap:6 }}>
            <button onClick={prev} aria-label="Previous month" style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, width:30, height:30, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:C.inkSoft }}><Ico n="left" s={14}/></button>
            <button onClick={next} aria-label="Next month"     style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, width:30, height:30, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:C.inkSoft }}><Ico n="right" s={14}/></button>
          </div>
        </div>
        <HR/>

        {/* legend */}
        <div style={{ padding:"10px 20px", display:"flex", gap:16 }}>
          {[{c:C.gold,l:"Morning"},{c:C.sage3,l:"Evening"},{c:C.border,l:"No post"}].map(x=>(
            <span key={x.l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:C.muted }}>
              <span style={{ width:7, height:7, borderRadius:"50%", background:x.c, display:"inline-block", flexShrink:0 }}/>
              {x.l}
            </span>
          ))}
        </div>
        <HR/>

        {/* grid */}
        <div style={{ padding:"12px 16px 16px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, marginBottom:4 }}>
            {DN.map(d=><div key={d} style={{ textAlign:"center", fontSize:10, fontWeight:700, color:C.muted, letterSpacing:"0.06em", padding:"4px 0" }}>{d}</div>)}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3 }}>
            {Array(first).fill(null).map((_,i)=><div key={`e${i}`}/>)}
            {Array(total).fill(null).map((_,i)=>{
              const d=i+1, k=key(d), data=CAL[k], isSel=sel===d, isToday=k==="2026-05-31";
              return (
                <button key={d} onClick={()=>setSel(isSel?null:d)} aria-label={`${MN[cur.m]} ${d}`} aria-pressed={isSel}
                  style={{ borderRadius:8, padding:"6px 2px", cursor:"pointer", background:isSel?C.sage:isToday?C.sageLight:"transparent", border:isToday?`1.5px solid ${C.sage3}`:`1px solid transparent`, textAlign:"center", minHeight:48, transition:"all .15s", fontFamily:"inherit" }}
                  onMouseEnter={e=>{ if(!isSel) e.currentTarget.style.background=C.sageLight; }}
                  onMouseLeave={e=>{ if(!isSel) e.currentTarget.style.background=isToday?C.sageLight:"transparent"; }}
                >
                  <div style={{ fontSize:12, fontWeight:600, color:isSel?"#fff":isToday?C.sage:C.inkSoft, marginBottom:5 }}>{d}</div>
                  {data&&(
                    <div style={{ display:"flex", justifyContent:"center", gap:3 }}>
                      {data.m&&<span style={{ width:5,height:5,borderRadius:"50%",background:isSel?"rgba(255,255,255,.8)":C.gold,display:"block" }}/>}
                      {data.e&&<span style={{ width:5,height:5,borderRadius:"50%",background:isSel?"rgba(255,255,255,.6)":C.sage3,display:"block" }}/>}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* selected day */}
      {sel&&(
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
          <div style={{ padding:"14px 20px" }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:C.ink, margin:0 }}>{MN[cur.m]} {sel}, {cur.y}</h3>
          </div>
          <HR/>
          <div style={{ padding:"12px 16px 16px" }}>
            {selPosts.length===0
              ? <p style={{ color:C.muted, fontSize:13, textAlign:"center", padding:"20px 0" }}>No posts recorded for this day.</p>
              : selPosts.map(p=>{
                  const cat=CAT[p.category]||CAT.wisdom; const am=p.type==="morning_quote";
                  return (
                    <div key={p.id} style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:14, display:"flex", gap:12, marginBottom:8 }}>
                      <div style={{ width:32,height:32,borderRadius:7,background:cat.bg,border:`1px solid ${cat.bd}`,display:"flex",alignItems:"center",justifyContent:"center",color:cat.fg,flexShrink:0 }}>
                        <Ico n={am?"sun":"moon"} s={14}/>
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontSize:10, fontWeight:700, color:cat.fg, letterSpacing:"0.08em", textTransform:"uppercase", margin:"0 0 4px" }}>
                          {am?"Morning Quote":"Evening News"}
                        </p>
                        <p style={{ fontFamily:"Georgia,serif", fontSize:13, fontStyle:"italic", color:C.ink, margin:0, lineHeight:1.5, overflow:"hidden", textOverflow:"ellipsis", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
                          "{am?p.quote:p.headline}"
                        </p>
                        <p style={{ fontSize:10, color:C.muted, margin:"4px 0 0" }}>{am?p.author:p.source}</p>
                      </div>
                      <div style={{ display:"flex", gap:8, fontSize:11, color:C.muted, flexShrink:0, alignItems:"center" }}>
                        <span style={{ display:"flex", alignItems:"center", gap:3 }}><Ico n="heart" s={10}/>{p.likes}</span>
                      </div>
                    </div>
                  );
                })
            }
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   ROOT
═══════════════════════════════════════════ */
export default function App() {
  const [view, setView]   = useState("dashboard");
  const [modal, setModal] = useState(null);
  const nav = [{k:"dashboard",l:"Dashboard",i:"dash"},{k:"feed",l:"Posts",i:"grid"},{k:"calendar",l:"Calendar",i:"cal"}];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>

      {/* sidebar */}
      <nav aria-label="Main navigation" style={{ position:"fixed", left:0, top:0, bottom:0, width:200, background:C.sidebar, zIndex:100, display:"flex", flexDirection:"column", padding:"22px 12px" }}>
        <div style={{ marginBottom:32, paddingLeft:8 }}>
          <div style={{ fontSize:22, fontWeight:800, color:"#e8f0ec", letterSpacing:"-0.5px", lineHeight:1 }}>
            LUM<span style={{ color:C.sage3 }}>IQ</span>
          </div>
          <div style={{ fontSize:9, color:"rgba(240,245,242,.28)", letterSpacing:"0.25em", marginTop:5, textTransform:"uppercase" }}>Control Panel</div>
        </div>

        <div style={{ flex:1 }}>
          {nav.map(n=>(
            <button key={n.k} onClick={()=>setView(n.k)} aria-current={view===n.k?"page":undefined}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:9, padding:"9px 10px", borderRadius:7, border:"none", cursor:"pointer", marginBottom:2, textAlign:"left", background:view===n.k?C.sidebarAct:"transparent", color:view===n.k?C.sidebarHi:C.sidebarTxt, fontSize:13, fontWeight:view===n.k?600:400, fontFamily:"inherit", transition:"all .15s" }}
              onMouseEnter={e=>{ if(view!==n.k) e.currentTarget.style.color="rgba(240,245,242,.7)"; }}
              onMouseLeave={e=>{ if(view!==n.k) e.currentTarget.style.color=C.sidebarTxt; }}
            >
              <Ico n={n.i} s={15}/> {n.l}
              {n.k==="feed"&&<span style={{ marginLeft:"auto", background:"rgba(240,245,242,.07)", borderRadius:4, padding:"1px 7px", fontSize:10, color:"rgba(240,245,242,.35)" }}>{POSTS.length}</span>}
            </button>
          ))}
        </div>

        <div style={{ background:"rgba(116,198,157,.08)", borderRadius:8, padding:"12px 10px", border:"1px solid rgba(116,198,157,.15)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#86efac" }}/>
            <span style={{ fontSize:9, color:C.sage3, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" }}>Agent Live</span>
          </div>
          <p style={{ fontSize:10, color:"rgba(240,245,242,.35)", margin:0, lineHeight:1.8 }}>
            🌅 7:00 AM · Quote<br/>
            🌆 7:00 PM · News<br/>
            3 platforms
          </p>
        </div>
      </nav>

      {/* main */}
      <main style={{ marginLeft:200, padding:"32px 32px 56px", maxWidth:1200 }}>
        <header style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:28 }}>
          <div>
            <h1 style={{ fontSize:24, fontWeight:700, color:C.ink, margin:0, lineHeight:1 }}>
              {view==="dashboard"&&"Dashboard"}
              {view==="feed"&&"Posts Feed"}
              {view==="calendar"&&"Calendar"}
            </h1>
            <p style={{ fontSize:11, color:C.muted, margin:"6px 0 0" }}>
              {new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
            </p>
          </div>
          <button style={{ display:"flex", alignItems:"center", gap:7, background:C.sage, color:"#fff", border:"none", borderRadius:8, padding:"9px 16px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", flexShrink:0 }}>
            <Ico n="plus" s={14}/> New Post
          </button>
        </header>

        {view==="dashboard" && <Dashboard/>}
        {view==="feed"      && <Feed onCard={setModal}/>}
        {view==="calendar"  && <Calendar/>}
      </main>

      <Modal post={modal} onClose={()=>setModal(null)}/>
    </div>
  );
}
