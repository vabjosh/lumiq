import { useState, useEffect, useRef } from "react";

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
// Palette: Soft Sage & Stone — calm, natural, internationally readable
// Typography: Cormorant Garamond (display) + DM Sans (body) — elegant pairing
// Accessibility: WCAG 2.1 AA contrast ratios throughout

const T = {
  // Core palette
  sage:       "#3d6b52",
  sage2:      "#4e8068",
  sage3:      "#6a9d82",
  sagePale:   "#e8f2ec",
  sageLight:  "#f0f7f3",
  stone:      "#7a7060",
  stonePale:  "#f5f2ed",
  stoneDark:  "#3a3428",
  ink:        "#1c1c1a",
  inkSoft:    "#3d3a34",
  muted:      "#8a8478",
  rule:       "#e4ddd4",
  white:      "#ffffff",
  bg:         "#f8f5f0",
  // Accents
  gold:       "#b5860a",
  goldPale:   "#fef6e0",
  rose:       "#8b3a3a",
  rosePale:   "#faeaea",
  sky:        "#2a5f8a",
  skyPale:    "#e4eef8",
};

// ── MOCK DATA ─────────────────────────────────────────────────────────────────
const POSTS = [
  { id:1, type:"morning_quote", date:"2026-05-31", quote:"The mind is not a vessel to be filled, but a fire to be kindled.", author:"Plutarch", author_role:"Greek Philosopher, 46–119 AD", theme:"curiosity", category:"wisdom", likes:142, shares:38, platforms:{linkedin:true,x:true,instagram:true} },
  { id:2, type:"evening_news", date:"2026-05-31", headline:"Scientists restore vision to blind patients using AI retinal implants", source:"Nature Medicine", summary:"Six patients who hadn't seen faces in years now can, using AI-enhanced retinal implants that translate camera input into electrical signals.", quote:"The most beautiful thing we can experience is the mysterious.", quote_author:"Albert Einstein", quote_author_role:"Physicist & Nobel Laureate", category:"science", likes:289, shares:94, platforms:{linkedin:true,x:true,instagram:true} },
  { id:3, type:"morning_quote", date:"2026-05-30", quote:"You are never too old to set another goal or to dream a new dream.", author:"C.S. Lewis", author_role:"Author & Scholar", theme:"resilience", category:"motivation", likes:201, shares:67, platforms:{linkedin:true,x:true,instagram:true} },
  { id:4, type:"evening_news", date:"2026-05-30", headline:"Amazon rainforest sees record reforestation — 2M trees planted by local communities", source:"BBC Earth", summary:"Indigenous-led reforestation across Brazil planted 2 million trees in 90 days, the fastest community-driven effort ever recorded.", quote:"In every walk with nature, one receives far more than he seeks.", quote_author:"John Muir", quote_author_role:"Naturalist & Conservationist", category:"environment", likes:334, shares:112, platforms:{linkedin:true,x:true,instagram:true} },
  { id:5, type:"morning_quote", date:"2026-05-29", quote:"It always seems impossible until it's done.", author:"Nelson Mandela", author_role:"Nobel Peace Prize Laureate", theme:"courage", category:"courage", likes:178, shares:55, platforms:{linkedin:true,x:false,instagram:true} },
  { id:6, type:"evening_news", date:"2026-05-29", headline:"16-year-old invents low-cost water purifier now deployed in 40 villages", source:"CNN Heroes", summary:"A teenager from Kenya developed a solar-powered purifier from local materials costing $12, now serving over 40 rural villages.", quote:"The young do not know enough to be prudent, and therefore attempt the impossible.", quote_author:"Pearl S. Buck", quote_author_role:"Nobel Prize-winning Author", category:"youth", likes:445, shares:189, platforms:{linkedin:true,x:true,instagram:true} },
  { id:7, type:"morning_quote", date:"2026-05-28", quote:"We do not need magic to transform our world. We carry all the power we need inside ourselves already.", author:"J.K. Rowling", author_role:"Author", theme:"empowerment", category:"empowerment", likes:267, shares:78, platforms:{linkedin:true,x:true,instagram:true} },
  { id:8, type:"evening_news", date:"2026-05-28", headline:"Coral reef restoration achieves 70% recovery in Great Barrier Reef section", source:"Australian Institute of Marine Science", summary:"A coral gardening project achieved 70% coverage recovery in a 50-hectare section previously declared bleached beyond recovery.", quote:"Look deep into nature, and then you will understand everything better.", quote_author:"Albert Einstein", quote_author_role:"Physicist & Nobel Laureate", category:"environment", likes:398, shares:143, platforms:{linkedin:true,x:true,instagram:true} },
  { id:9, type:"morning_quote", date:"2026-05-27", quote:"The only way to do great work is to love what you do.", author:"Steve Jobs", author_role:"Co-founder of Apple", theme:"passion", category:"passion", likes:312, shares:88, platforms:{linkedin:true,x:true,instagram:true} },
  { id:10, type:"evening_news", date:"2026-05-27", headline:"Gene therapy cures rare childhood disease with 100% efficacy in trials", source:"The Lancet", summary:"A gene therapy developed over 12 years has shown 100% efficacy in clinical trials for a rare metabolic disorder affecting children globally.", quote:"Science is a way of thinking much more than it is a body of knowledge.", quote_author:"Carl Sagan", quote_author_role:"Astronomer & Author", category:"science", likes:521, shares:201, platforms:{linkedin:true,x:true,instagram:true} },
];

const CAL = {
  "2026-05-31":{m:true,e:true}, "2026-05-30":{m:true,e:true},
  "2026-05-29":{m:true,e:true}, "2026-05-28":{m:true,e:true},
  "2026-05-27":{m:true,e:true}, "2026-05-26":{m:true,e:true},
  "2026-05-25":{m:true,e:false}, "2026-05-24":{m:true,e:true},
  "2026-05-23":{m:true,e:true}, "2026-05-22":{m:false,e:true},
  "2026-05-21":{m:true,e:true}, "2026-05-20":{m:true,e:true},
};

const CAT = {
  science:    { bg:T.skyPale,   fg:T.sky,   border:"#b8d4f0" },
  environment:{ bg:T.sagePale,  fg:T.sage,  border:"#b8d8c4" },
  youth:      { bg:T.goldPale,  fg:T.gold,  border:"#f0dfa0" },
  wisdom:     { bg:"#f0ede8",   fg:T.stoneDark, border:"#d4ccc0" },
  motivation: { bg:"#faeee8",   fg:"#7a4020", border:"#e8c8b0" },
  courage:    { bg:T.rosePale,  fg:T.rose,  border:"#e8b8b8" },
  empowerment:{ bg:T.sagePale,  fg:T.sage2, border:"#b8d8c4" },
  passion:    { bg:"#f8eaf0",   fg:"#7a3060", border:"#e0b8d0" },
};

// ── ICONS ─────────────────────────────────────────────────────────────────────
const I = ({ n, s=16 }) => ({
  sun:      <svg aria-hidden width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  moon:     <svg aria-hidden width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  heart:    <svg aria-hidden width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  share:    <svg aria-hidden width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  grid:     <svg aria-hidden width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  cal:      <svg aria-hidden width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  dash:     <svg aria-hidden width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="3" width="6" height="8" rx="1"/><rect x="10" y="3" width="12" height="4" rx="1"/><rect x="10" y="11" width="12" height="8" rx="1"/><rect x="2" y="15" width="6" height="6" rx="1"/></svg>,
  check:    <svg aria-hidden width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  x:        <svg aria-hidden width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  li:       <svg aria-hidden width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>,
  ig:       <svg aria-hidden width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>,
  tw:       <svg aria-hidden width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  cl:       <svg aria-hidden width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>,
  cr:       <svg aria-hidden width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
  plus:     <svg aria-hidden width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  robot:    <svg aria-hidden width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M12 2a3 3 0 0 1 3 3v6H9V5a3 3 0 0 1 3-3z"/><circle cx="9" cy="16" r="1" fill="currentColor"/><circle cx="15" cy="16" r="1" fill="currentColor"/></svg>,
  map:      <svg aria-hidden width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  info:     <svg aria-hidden width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  search:   <svg aria-hidden width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
})[n] || null;

// ── ANIMATED COUNTER ──────────────────────────────────────────────────────────
const Counter = ({ target, duration=1600, suffix="" }) => {
  const [val, setVal] = useState(0);
  const ref = useRef();
  useEffect(() => {
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * target));
      if (p < 1) ref.current = requestAnimationFrame(tick);
    };
    ref.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current);
  }, [target, duration]);
  return <span>{val.toLocaleString()}{suffix}</span>;
};

// ── PILL ──────────────────────────────────────────────────────────────────────
const Pill = ({ label, color, bg, border }) => (
  <span style={{ display:"inline-block", padding:"2px 10px", borderRadius:20, fontSize:10, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", background:bg, color, border:`1px solid ${border}`, fontFamily:"'DM Mono', 'Space Mono', monospace" }}>
    {label}
  </span>
);

// ── PINTEREST CARD ────────────────────────────────────────────────────────────
const PinCard = ({ post, onClick }) => {
  const [liked, setLiked] = useState(false);
  const cat = CAT[post.category] || CAT.wisdom;
  const isMorning = post.type === "morning_quote";

  return (
    <article
      onClick={() => onClick(post)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onClick(post)}
      aria-label={isMorning ? `Morning quote by ${post.author}` : `Evening news: ${post.headline}`}
      style={{ background:T.white, borderRadius:16, overflow:"hidden", cursor:"pointer", border:`1px solid ${T.rule}`, transition:"transform 0.2s ease, box-shadow 0.2s ease", marginBottom:16, breakInside:"avoid" }}
      onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 10px 32px rgba(60,80,60,0.1)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}
    >
      {/* Colour header */}
      <div style={{ background:cat.bg, padding:"22px 20px 18px", borderBottom:`1px solid ${cat.border}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, fontWeight:700, letterSpacing:"0.1em", color:cat.fg, textTransform:"uppercase", fontFamily:"monospace" }}>
            {isMorning ? <I n="sun" s={11}/> : <I n="moon" s={11}/>}
            {isMorning ? "Morning" : "Evening"}
          </span>
          <span style={{ fontSize:10, color:T.muted, fontFamily:"monospace" }}>{post.date}</span>
        </div>
        {isMorning ? (
          <div>
            <p style={{ fontFamily:"'Cormorant Garamond', 'Georgia', serif", fontSize:17, fontStyle:"italic", color:T.ink, lineHeight:1.5, margin:0 }}>"{post.quote}"</p>
            <p style={{ fontSize:12, color:cat.fg, fontWeight:600, marginTop:10, fontFamily:"monospace", letterSpacing:"0.03em" }}>— {post.author}</p>
            <p style={{ fontSize:11, color:T.muted, marginTop:2, fontFamily:"monospace" }}>{post.author_role}</p>
          </div>
        ) : (
          <div>
            <Pill label={post.category} color={cat.fg} bg={cat.bg} border={cat.border}/>
            <p style={{ fontFamily:"'Cormorant Garamond', 'Georgia', serif", fontSize:16, fontWeight:700, color:T.ink, lineHeight:1.4, margin:"10px 0 4px" }}>{post.headline}</p>
            <p style={{ fontSize:11, color:T.muted, fontFamily:"monospace" }}>{post.source}</p>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding:"16px 20px" }}>
        {isMorning ? (
          <p style={{ fontSize:13, color:T.inkSoft, lineHeight:1.7, margin:"0 0 14px", fontWeight:300 }}>
            <em style={{ fontStyle:"italic", opacity:0.6 }}>Theme: {post.theme}</em>
          </p>
        ) : (
          <div>
            <p style={{ fontSize:13, color:T.inkSoft, lineHeight:1.7, margin:"0 0 12px", fontWeight:300 }}>{post.summary}</p>
            <div style={{ background:T.sageLight, borderLeft:`2px solid ${T.sage3}`, padding:"8px 12px", marginBottom:14, borderRadius:"0 8px 8px 0" }}>
              <p style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:13, fontStyle:"italic", color:T.inkSoft, margin:0, lineHeight:1.5 }}>"{post.quote}"</p>
              <p style={{ fontSize:11, color:T.sage, fontWeight:600, margin:"4px 0 0", fontFamily:"monospace" }}>— {post.quote_author}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:12, borderTop:`1px solid ${T.rule}` }}>
          <div style={{ display:"flex", gap:12 }}>
            <button
              onClick={e => { e.stopPropagation(); setLiked(!liked); }}
              aria-label={liked ? "Unlike" : "Like"}
              style={{ display:"flex", alignItems:"center", gap:4, background:"none", border:"none", cursor:"pointer", fontSize:12, color:liked ? T.rose : T.muted, padding:0, fontWeight:600, fontFamily:"inherit" }}
            >
              <I n="heart" s={12}/> {post.likes + (liked?1:0)}
            </button>
            <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:T.muted }}>
              <I n="share" s={12}/> {post.shares}
            </span>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            {post.platforms?.linkedin && <span style={{ color:"#0077b5" }} aria-label="LinkedIn"><I n="li" s={13}/></span>}
            {post.platforms?.x && <span style={{ color:T.ink }} aria-label="X"><I n="tw" s={13}/></span>}
            {post.platforms?.instagram && <span style={{ color:"#e1306c" }} aria-label="Instagram"><I n="ig" s={13}/></span>}
          </div>
        </div>
      </div>
    </article>
  );
};

// ── MODAL ────────────────────────────────────────────────────────────────────
const Modal = ({ post, onClose }) => {
  useEffect(() => {
    if (!post) return;
    const handler = e => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [post, onClose]);

  if (!post) return null;
  const cat = CAT[post.category] || CAT.wisdom;
  const isMorning = post.type === "morning_quote";

  return (
    <div role="dialog" aria-modal="true" aria-label="Post detail" style={{ position:"fixed", inset:0, background:"rgba(28,28,26,0.5)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20, backdropFilter:"blur(4px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background:T.white, borderRadius:20, maxWidth:520, width:"100%", maxHeight:"88vh", overflow:"auto", boxShadow:"0 24px 80px rgba(28,28,26,0.2)", border:`1px solid ${T.rule}` }}>
        <div style={{ background:cat.bg, padding:"32px 32px 28px", borderBottom:`1px solid ${cat.border}`, position:"relative" }}>
          <button onClick={onClose} aria-label="Close" style={{ position:"absolute", top:16, right:16, background:"rgba(28,28,26,0.07)", border:"none", borderRadius:"50%", width:32, height:32, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:T.inkSoft }}>
            <I n="x" s={14}/>
          </button>
          <div style={{ fontSize:10, color:cat.fg, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:"monospace", marginBottom:16, display:"flex", alignItems:"center", gap:6 }}>
            {isMorning ? <I n="sun" s={12}/> : <I n="moon" s={12}/>}
            {isMorning ? "Morning Quote" : "Evening News"} · {post.date}
          </div>
          {isMorning ? (
            <>
              <p style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:24, fontStyle:"italic", color:T.ink, lineHeight:1.4, margin:"0 0 12px" }}>"{post.quote}"</p>
              <p style={{ fontSize:13, color:cat.fg, fontWeight:700, fontFamily:"monospace" }}>— {post.author}<span style={{ fontWeight:400, color:T.muted }}>, {post.author_role}</span></p>
            </>
          ) : (
            <>
              <Pill label={post.category} color={cat.fg} bg="transparent" border={cat.border}/>
              <p style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:20, fontWeight:700, color:T.ink, lineHeight:1.35, margin:"12px 0 6px" }}>{post.headline}</p>
              <p style={{ fontSize:12, color:T.muted, fontFamily:"monospace" }}>{post.source}</p>
            </>
          )}
        </div>
        <div style={{ padding:"24px 32px 32px" }}>
          {isMorning ? (
            <div style={{ background:T.sageLight, borderRadius:12, padding:16, marginBottom:20 }}>
              <p style={{ fontSize:10, color:T.sage, fontWeight:700, fontFamily:"monospace", letterSpacing:"0.1em", marginBottom:6 }}>THEME · {post.theme?.toUpperCase()}</p>
            </div>
          ) : (
            <>
              <p style={{ fontSize:15, color:T.inkSoft, lineHeight:1.8, marginBottom:16, fontWeight:300 }}>{post.summary}</p>
              <div style={{ background:T.sageLight, borderLeft:`3px solid ${T.sage3}`, borderRadius:"0 12px 12px 0", padding:"14px 18px", marginBottom:16 }}>
                <p style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:16, fontStyle:"italic", color:T.ink, margin:"0 0 6px", lineHeight:1.5 }}>"{post.quote}"</p>
                <p style={{ fontSize:12, color:T.sage, fontWeight:700, fontFamily:"monospace", margin:0 }}>— {post.quote_author}<span style={{ fontWeight:400, color:T.muted }}>, {post.quote_author_role}</span></p>
              </div>
            </>
          )}
          <div style={{ paddingTop:16, borderTop:`1px solid ${T.rule}` }}>
            <p style={{ fontSize:10, color:T.muted, fontFamily:"monospace", letterSpacing:"0.1em", marginBottom:10 }}>PUBLISHED TO</p>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {post.platforms?.linkedin && <span style={{ display:"flex", alignItems:"center", gap:6, background:"#e8f0fa", color:"#0077b5", padding:"6px 14px", borderRadius:20, fontSize:12, fontWeight:600 }}><I n="li" s={13}/> LinkedIn</span>}
              {post.platforms?.x && <span style={{ display:"flex", alignItems:"center", gap:6, background:"#f0f0f0", color:T.ink, padding:"6px 14px", borderRadius:20, fontSize:12, fontWeight:600 }}><I n="tw" s={13}/> X</span>}
              {post.platforms?.instagram && <span style={{ display:"flex", alignItems:"center", gap:6, background:"#fce8f0", color:"#e1306c", padding:"6px 14px", borderRadius:20, fontSize:12, fontWeight:600 }}><I n="ig" s={13}/> Instagram</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── STAT CARD ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, note }) => (
  <div style={{ background:T.white, borderRadius:14, padding:"20px 18px", border:`1px solid ${T.rule}` }}>
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
      <span style={{ fontSize:10, color:T.muted, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", fontFamily:"monospace" }}>{label}</span>
      <span style={{ color:T.sage, opacity:0.7 }}><I n={icon} s={15}/></span>
    </div>
    <div style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:34, fontWeight:700, color:T.ink, lineHeight:1 }}>
      <Counter target={typeof value === "number" ? value : 0} />
    </div>
    {note && <p style={{ fontSize:11, color:T.muted, marginTop:6, fontFamily:"monospace" }}>{note}</p>}
  </div>
);

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
const Dashboard = () => (
  <div>
    {/* Status banner */}
    <div style={{ background:T.sage, borderRadius:14, padding:"18px 22px", marginBottom:24, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:38, height:38, background:"rgba(255,255,255,0.15)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}><I n="robot" s={19}/></div>
        <div>
          <p style={{ color:"#fff", fontWeight:700, fontSize:14, margin:0, letterSpacing:"0.01em" }}>LUMIQ Agent · Running</p>
          <p style={{ color:"rgba(255,255,255,0.6)", fontSize:11, margin:0, fontFamily:"monospace" }}>🌅 7:00 AM · 🌆 7:00 PM · LinkedIn, X, Instagram</p>
        </div>
      </div>
      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
        <div style={{ width:8, height:8, borderRadius:"50%", background:"#a8f0c0", boxShadow:"0 0 6px rgba(168,240,192,0.6)" }}/>
        <span style={{ fontSize:11, color:"rgba(255,255,255,0.8)", fontFamily:"monospace" }}>Live</span>
      </div>
    </div>

    {/* Note: sample data */}
    <div style={{ background:T.goldPale, border:`1px solid #f0dfa0`, borderRadius:12, padding:"10px 16px", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
      <span style={{ color:T.gold }}><I n="info" s={14}/></span>
      <p style={{ fontSize:12, color:"#7a5a00", margin:0, fontFamily:"monospace" }}>
        <strong>Sample data</strong> — Metrics below are illustrative. Live figures will populate once your Anthropic API key is added and agents begin running.
      </p>
    </div>

    {/* Stats grid */}
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12, marginBottom:24 }}>
      <StatCard label="Total Posts" value={47} icon="grid" note="Since launch"/>
      <StatCard label="Total Likes" value={8234} icon="heart" note="Across platforms"/>
      <StatCard label="Total Shares" value={2891} icon="share" note="Organic reach"/>
      <StatCard label="Day Streak" value={23} icon="cal" note="Consecutive days"/>
      <StatCard label="Platforms" value={3} icon="map" note="LinkedIn · X · Instagram"/>
      <StatCard label="This Week" value={14} icon="dash" note="Posts published"/>
    </div>

    {/* Platform health */}
    <div style={{ background:T.white, borderRadius:14, padding:22, border:`1px solid ${T.rule}`, marginBottom:16 }}>
      <h2 style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:18, fontWeight:700, color:T.ink, marginBottom:16 }}>Platform Status</h2>
      {[
        { name:"LinkedIn", icon:"li", color:"#0077b5", bg:"#e8f0fa", posts:47 },
        { name:"X (Twitter)", icon:"tw", color:T.ink, bg:"#f0f0f0", posts:45 },
        { name:"Instagram", icon:"ig", color:"#e1306c", bg:"#fce8f0", posts:47 },
      ].map(p => (
        <div key={p.name} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background:T.bg, borderRadius:10, marginBottom:8 }}>
          <div style={{ width:34, height:34, background:p.bg, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", color:p.color }}><I n={p.icon} s={15}/></div>
          <div style={{ flex:1 }}>
            <p style={{ fontSize:13, fontWeight:600, color:T.ink, margin:0 }}>{p.name}</p>
            <p style={{ fontSize:11, color:T.muted, margin:0, fontFamily:"monospace" }}>{p.posts} posts published</p>
          </div>
          <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:T.sage, fontWeight:700, background:T.sagePale, padding:"4px 10px", borderRadius:20, border:`1px solid ${T.rule}` }}>
            <I n="check" s={11}/> Connected
          </span>
        </div>
      ))}
    </div>

    {/* Roadmap */}
    <div style={{ background:T.white, borderRadius:14, padding:22, border:`1px solid ${T.rule}` }}>
      <h2 style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:18, fontWeight:700, color:T.ink, marginBottom:4 }}>Roadmap</h2>
      <p style={{ fontSize:12, color:T.muted, fontFamily:"monospace", marginBottom:20 }}>What exists today and what is planned — full transparency.</p>
      {[
        { phase:"Phase 1 · Now", title:"Core agent + SPA", done:true, items:["Daily quote agent (7am)", "Daily news agent (7pm)", "LinkedIn, X, Instagram posting", "Dashboard + Feed + Calendar"] },
        { phase:"Phase 2 · Next", title:"Portal & flash cards", done:false, items:["lumiq.app public website", "Flash card learning system", "3 learning paths (Prompt Engineering)", "SEO & search console"] },
        { phase:"Phase 3 · Later", title:"Community & intelligence", done:false, items:["Contributor system", "Adaptive learning paths", "Knowledge graph / map", "Multi-language support"] },
      ].map((r, i) => (
        <div key={i} style={{ display:"flex", gap:16, marginBottom:i<2?20:0, paddingBottom:i<2?20:0, borderBottom:i<2?`1px solid ${T.rule}`:"none" }}>
          <div style={{ width:10, height:10, borderRadius:"50%", marginTop:5, flexShrink:0, background:r.done?T.sage:T.rule, border:`2px solid ${r.done?T.sage:T.rule}` }}/>
          <div>
            <p style={{ fontSize:10, color:r.done?T.sage:T.muted, fontFamily:"monospace", fontWeight:700, letterSpacing:"0.08em", marginBottom:4 }}>{r.phase}</p>
            <p style={{ fontSize:14, fontWeight:700, color:T.ink, marginBottom:8 }}>{r.title}</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {r.items.map(it => (
                <span key={it} style={{ fontSize:11, background:r.done?T.sagePale:T.stonePale, color:r.done?T.sage:T.stone, padding:"3px 10px", borderRadius:20, fontFamily:"monospace", border:`1px solid ${r.done?T.rule:T.rule}` }}>
                  {r.done && "✓ "}{it}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ── FEED VIEW ─────────────────────────────────────────────────────────────────
const Feed = ({ onCard }) => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = POSTS.filter(p => {
    const mt = filter==="all" || (filter==="morning"&&p.type==="morning_quote") || (filter==="evening"&&p.type==="evening_news") || filter===p.category;
    const ms = !search || (p.quote||p.headline||"").toLowerCase().includes(search.toLowerCase()) || (p.author||p.quote_author||"").toLowerCase().includes(search.toLowerCase());
    return mt && ms;
  });

  const cols = [filtered.filter((_,i)=>i%3===0), filtered.filter((_,i)=>i%3===1), filtered.filter((_,i)=>i%3===2)];
  const filters = [{k:"all",l:"All"},{k:"morning",l:"🌅 Morning"},{k:"evening",l:"🌆 Evening"},{k:"science",l:"Science"},{k:"environment",l:"Nature"},{k:"wisdom",l:"Wisdom"},{k:"youth",l:"Youth"},{k:"courage",l:"Courage"}];

  return (
    <div>
      {/* Search */}
      <div style={{ position:"relative", marginBottom:14 }}>
        <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:T.muted }}><I n="search" s={15}/></span>
        <input
          value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search quotes, news, authors…"
          aria-label="Search posts"
          style={{ width:"100%", padding:"11px 16px 11px 42px", borderRadius:12, border:`1.5px solid ${T.rule}`, fontSize:14, outline:"none", background:T.white, fontFamily:"inherit", color:T.ink, boxSizing:"border-box" }}
          onFocus={e=>e.target.style.borderColor=T.sage}
          onBlur={e=>e.target.style.borderColor=T.rule}
        />
      </div>
      {/* Filters */}
      <div role="group" aria-label="Filter posts" style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:20 }}>
        {filters.map(f => (
          <button key={f.k} onClick={()=>setFilter(f.k)} aria-pressed={filter===f.k} style={{ padding:"6px 14px", borderRadius:50, border:"1.5px solid", fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.15s ease", borderColor:filter===f.k?T.sage:T.rule, background:filter===f.k?T.sage:T.white, color:filter===f.k?"#fff":T.inkSoft, fontFamily:"inherit" }}>
            {f.l}
          </button>
        ))}
      </div>
      <p style={{ fontSize:11, color:T.muted, marginBottom:18, fontFamily:"monospace" }}>{filtered.length} posts</p>
      {/* Masonry */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, alignItems:"start" }}>
        {cols.map((col,i) => <div key={i}>{col.map(p=><PinCard key={p.id} post={p} onClick={onCard}/>)}</div>)}
      </div>
    </div>
  );
};

// ── CALENDAR ──────────────────────────────────────────────────────────────────
const Calendar = () => {
  const [cur, setCur] = useState({y:2026,m:4});
  const [sel, setSel] = useState(null);
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const first = new Date(cur.y, cur.m, 1).getDay();
  const total = new Date(cur.y, cur.m+1, 0).getDate();
  const key = d => `${cur.y}-${String(cur.m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const prev = () => setCur(p=>p.m===0?{y:p.y-1,m:11}:{y:p.y,m:p.m-1});
  const next = () => setCur(p=>p.m===11?{y:p.y+1,m:0}:{y:p.y,m:p.m+1});
  const selPosts = sel ? POSTS.filter(p=>p.date===key(sel)) : [];
  const posted = Object.values(CAL).filter(Boolean).length;
  const streak = 23;

  return (
    <div>
      {/* Mini stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:24 }}>
        {[
          { label:"Posts this month", val:posted },
          { label:"Current streak", val:streak+" days" },
          { label:"Completion rate", val:"96%" },
        ].map(s => (
          <div key={s.label} style={{ background:T.white, border:`1px solid ${T.rule}`, borderRadius:12, padding:"16px 18px", textAlign:"center" }}>
            <div style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:28, fontWeight:700, color:T.sage }}>{s.val}</div>
            <div style={{ fontSize:11, color:T.muted, fontFamily:"monospace", marginTop:4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div style={{ background:T.white, borderRadius:16, padding:24, border:`1px solid ${T.rule}` }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <h2 style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:22, fontWeight:700, color:T.ink, margin:0 }}>
            {MONTHS[cur.m]} {cur.y}
          </h2>
          <div style={{ display:"flex", gap:6 }}>
            <button onClick={prev} aria-label="Previous month" style={{ background:T.bg, border:`1px solid ${T.rule}`, borderRadius:8, width:32, height:32, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:T.inkSoft }}><I n="cl" s={15}/></button>
            <button onClick={next} aria-label="Next month" style={{ background:T.bg, border:`1px solid ${T.rule}`, borderRadius:8, width:32, height:32, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:T.inkSoft }}><I n="cr" s={15}/></button>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display:"flex", gap:16, marginBottom:16 }}>
          {[{c:T.gold,l:"Morning quote"},{c:T.sage,l:"Evening news"},{c:T.rule,l:"No post"}].map(x=>(
            <span key={x.l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:T.muted }}>
              <span style={{ width:8, height:8, borderRadius:"50%", background:x.c, display:"inline-block" }}/>
              {x.l}
            </span>
          ))}
        </div>

        {/* Day names */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4, marginBottom:4 }}>
          {DAYS.map(d=><div key={d} style={{ textAlign:"center", fontSize:10, color:T.muted, fontWeight:700, letterSpacing:"0.08em", fontFamily:"monospace", padding:"4px 0" }}>{d}</div>)}
        </div>

        {/* Days */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4 }}>
          {Array(first).fill(null).map((_,i)=><div key={`e${i}`}/>)}
          {Array(total).fill(null).map((_,i)=>{
            const d=i+1, k=key(d), data=CAL[k], isSel=sel===d, isToday=k==="2026-05-31";
            return (
              <button key={d} onClick={()=>setSel(isSel?null:d)} aria-label={`${MONTHS[cur.m]} ${d}`} aria-pressed={isSel} style={{ borderRadius:10, padding:"8px 4px", cursor:"pointer", background:isSel?T.sage:isToday?T.sageLight:"transparent", border:isToday?`1.5px solid ${T.sage3}`:`1px solid transparent`, textAlign:"center", minHeight:52, transition:"all 0.15s ease", fontFamily:"inherit" }}
              onMouseEnter={e=>{ if(!isSel) e.currentTarget.style.background=T.sageLight; }}
              onMouseLeave={e=>{ if(!isSel) e.currentTarget.style.background=isToday?T.sageLight:"transparent"; }}
              >
                <div style={{ fontSize:12, fontWeight:600, color:isSel?"#fff":isToday?T.sage:T.inkSoft, marginBottom:6 }}>{d}</div>
                {data&&<div style={{ display:"flex", justifyContent:"center", gap:3 }}>
                  {data.m&&<span style={{ width:6,height:6,borderRadius:"50%",background:isSel?"rgba(255,255,255,0.8)":T.gold,display:"block" }}/>}
                  {data.e&&<span style={{ width:6,height:6,borderRadius:"50%",background:isSel?"rgba(255,255,255,0.6)":T.sage3,display:"block" }}/>}
                </div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day */}
      {sel && (
        <div style={{ marginTop:16, background:T.white, borderRadius:14, padding:20, border:`1px solid ${T.rule}` }}>
          <h3 style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:17, fontWeight:700, marginBottom:14, color:T.ink }}>
            {MONTHS[cur.m]} {sel}, {cur.y}
          </h3>
          {selPosts.length===0 ? (
            <p style={{ color:T.muted, fontSize:13, textAlign:"center", padding:"20px 0", fontFamily:"monospace" }}>No posts recorded for this day</p>
          ) : selPosts.map(p=>{
            const cat=CAT[p.category]||CAT.wisdom;
            return (
              <div key={p.id} style={{ background:T.bg, borderRadius:10, padding:14, display:"flex", gap:12, alignItems:"flex-start", marginBottom:10, border:`1px solid ${T.rule}` }}>
                <div style={{ width:34,height:34,borderRadius:8,background:cat.bg,display:"flex",alignItems:"center",justifyContent:"center",color:cat.fg,flexShrink:0 }}>
                  {p.type==="morning_quote"?<I n="sun" s={15}/>:<I n="moon" s={15}/>}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:10, color:cat.fg, fontWeight:700, fontFamily:"monospace", letterSpacing:"0.08em", marginBottom:4 }}>
                    {p.type==="morning_quote"?"MORNING QUOTE":"EVENING NEWS"}
                  </p>
                  <p style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:14, fontStyle:"italic", color:T.ink, margin:0, lineHeight:1.5 }}>
                    "{p.type==="morning_quote"?p.quote:p.headline}"
                  </p>
                  <p style={{ fontSize:11,color:T.muted,margin:"4px 0 0",fontFamily:"monospace" }}>
                    {p.type==="morning_quote"?p.author:p.source}
                  </p>
                </div>
                <div style={{ display:"flex",gap:8,fontSize:11,color:T.muted,flexShrink:0 }}>
                  <span style={{ display:"flex",alignItems:"center",gap:3 }}><I n="heart" s={11}/>{p.likes}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── ROOT APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("dashboard");
  const [modal, setModal] = useState(null);

  const nav = [
    { k:"dashboard", l:"Dashboard", i:"dash" },
    { k:"feed",      l:"Posts",     i:"grid" },
    { k:"calendar",  l:"Calendar",  i:"cal"  },
  ];

  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"'DM Sans', 'Nunito', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&family=DM+Mono&display=swap" rel="stylesheet"/>

      {/* Sidebar */}
      <nav aria-label="Main navigation" style={{ position:"fixed", left:0, top:0, bottom:0, width:210, background:T.stoneDark, zIndex:100, display:"flex", flexDirection:"column", padding:"24px 14px" }}>
        {/* Logo */}
        <div style={{ marginBottom:36, paddingLeft:8 }}>
          <div style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:28, fontWeight:700, color:"#f5f2ed", letterSpacing:-0.5, lineHeight:1 }}>
            LUM<span style={{ color:"#a8c8b4" }}>IQ</span>
          </div>
          <div style={{ fontFamily:"'DM Mono', monospace", fontSize:9, color:"rgba(245,242,237,0.3)", letterSpacing:"0.25em", marginTop:4 }}>CONTROL PANEL</div>
        </div>

        {/* Nav items */}
        <div style={{ flex:1 }}>
          {nav.map(n => (
            <button key={n.k} onClick={()=>setView(n.k)} aria-current={view===n.k?"page":undefined} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:10, border:"none", cursor:"pointer", marginBottom:4, textAlign:"left", background:view===n.k?"rgba(168,200,180,0.15)":"transparent", color:view===n.k?"#a8c8b4":"rgba(245,242,237,0.45)", fontSize:13, fontWeight:view===n.k?600:400, fontFamily:"inherit", transition:"all 0.15s ease" }}
            onMouseEnter={e=>{ if(view!==n.k) e.currentTarget.style.background="rgba(245,242,237,0.06)"; }}
            onMouseLeave={e=>{ if(view!==n.k) e.currentTarget.style.background="transparent"; }}
            >
              <I n={n.i} s={16}/> {n.l}
              {n.k==="feed" && <span style={{ marginLeft:"auto", background:"rgba(245,242,237,0.08)", borderRadius:20, padding:"1px 8px", fontSize:10, fontFamily:"monospace", color:"rgba(245,242,237,0.4)" }}>{POSTS.length}</span>}
            </button>
          ))}
        </div>

        {/* Agent status */}
        <div style={{ background:"rgba(168,200,180,0.12)", borderRadius:12, padding:"14px 12px", border:"1px solid rgba(168,200,180,0.2)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:"#a8f0c0" }}/>
            <span style={{ fontSize:10, color:"#a8c8b4", fontWeight:700, fontFamily:"monospace", letterSpacing:"0.1em" }}>AGENT LIVE</span>
          </div>
          <p style={{ fontSize:10, color:"rgba(245,242,237,0.35)", margin:0, fontFamily:"monospace", lineHeight:1.7 }}>
            🌅 7:00 AM · Quote<br/>
            🌆 7:00 PM · News<br/>
            3 platforms active
          </p>
        </div>
      </nav>

      {/* Main */}
      <main style={{ marginLeft:210, padding:"32px 28px 56px" }}>
        {/* Top bar */}
        <header style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28 }}>
          <div>
            <h1 style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:28, fontWeight:700, color:T.ink, margin:0, lineHeight:1 }}>
              {view==="dashboard"&&"Dashboard"}
              {view==="feed"&&"Posts Feed"}
              {view==="calendar"&&"Calendar"}
            </h1>
            <p style={{ fontSize:11, color:T.muted, margin:"6px 0 0", fontFamily:"monospace" }}>
              {new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
            </p>
          </div>
          <button style={{ display:"flex", alignItems:"center", gap:8, background:T.sage, color:"#fff", border:"none", borderRadius:10, padding:"10px 18px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
            <I n="plus" s={15}/> New Post
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
