import { useState, useEffect, useRef } from "react";

// ── MOCK DATA ────────────────────────────────────────────────────────────────
const POSTS = [
  { id:1, type:"morning_quote", date:"2026-05-31", quote:"The mind is not a vessel to be filled, but a fire to be kindled.", author:"Plutarch", author_role:"Greek Philosopher, 46–119 AD", theme:"curiosity", reflection:"Before the week begins, remember every question you ask today is kindling.", category:"wisdom", likes:142, shares:38, platforms:{linkedin:true,x:true,instagram:true} },
  { id:2, type:"evening_news", date:"2026-05-31", headline:"Scientists restore vision to blind patients using AI retinal implants", source:"Nature Medicine", summary:"Six patients who hadn't seen faces in years now can, using AI-enhanced retinal implants.", quote:"The most beautiful thing we can experience is the mysterious.", quote_author:"Albert Einstein", quote_author_role:"Physicist & Nobel Laureate", category:"science", likes:289, shares:94, platforms:{linkedin:true,x:true,instagram:true} },
  { id:3, type:"morning_quote", date:"2026-05-30", quote:"You are never too old to set another goal or to dream a new dream.", author:"C.S. Lewis", author_role:"Author & Scholar", theme:"resilience", reflection:"Every morning is a new permission slip. Use it.", category:"motivation", likes:201, shares:67, platforms:{linkedin:true,x:true,instagram:true} },
  { id:4, type:"evening_news", date:"2026-05-30", headline:"Amazon rainforest sees record reforestation — 2M trees planted by local communities", source:"BBC Earth", summary:"Indigenous-led reforestation across Brazil planted 2 million trees in 90 days, the fastest community-driven effort ever recorded.", quote:"In every walk with nature, one receives far more than he seeks.", quote_author:"John Muir", quote_author_role:"Naturalist & Conservationist", category:"environment", likes:334, shares:112, platforms:{linkedin:true,x:true,instagram:true} },
  { id:5, type:"morning_quote", date:"2026-05-29", quote:"It always seems impossible until it's done.", author:"Nelson Mandela", author_role:"President of South Africa & Nobel Laureate", theme:"courage", reflection:"Whatever feels impossible today — someone once thought that about the thing you've already done.", category:"courage", likes:178, shares:55, platforms:{linkedin:true,x:false,instagram:true} },
  { id:6, type:"evening_news", date:"2026-05-29", headline:"16-year-old invents low-cost water purifier for 40 rural villages", source:"CNN Heroes", summary:"A teenager from Kenya developed a solar-powered purifier from local materials costing $12, now deployed in 40 villages.", quote:"The young do not know enough to be prudent, and therefore they attempt the impossible.", quote_author:"Pearl S. Buck", quote_author_role:"Nobel Prize-winning Author", category:"youth", likes:445, shares:189, platforms:{linkedin:true,x:true,instagram:true} },
  { id:7, type:"morning_quote", date:"2026-05-28", quote:"We do not need magic to transform our world. We carry all of the power we need inside ourselves already.", author:"J.K. Rowling", author_role:"Author", theme:"empowerment", reflection:"The tools are already yours. The question is only whether you'll pick them up.", category:"empowerment", likes:267, shares:78, platforms:{linkedin:true,x:true,instagram:true} },
  { id:8, type:"evening_news", date:"2026-05-28", headline:"Coral reef restoration shows 70% recovery in Great Barrier Reef section", source:"Australian Institute of Marine Science", summary:"A coral gardening project achieved 70% coverage recovery in a 50-hectare section previously declared bleached beyond recovery.", quote:"Look deep into nature, and then you will understand everything better.", quote_author:"Albert Einstein", quote_author_role:"Physicist & Nobel Laureate", category:"environment", likes:398, shares:143, platforms:{linkedin:true,x:true,instagram:true} },
  { id:9, type:"morning_quote", date:"2026-05-27", quote:"The only way to do great work is to love what you do.", author:"Steve Jobs", author_role:"Co-founder of Apple", theme:"passion", reflection:"Work done with love is work that lasts. Find the love in today's work.", category:"passion", likes:312, shares:88, platforms:{linkedin:true,x:true,instagram:true} },
  { id:10, type:"evening_news", date:"2026-05-27", headline:"New drug cures rare childhood disease affecting 1 in 50,000 children", source:"The Lancet", summary:"A gene therapy developed over 12 years has shown 100% efficacy in clinical trials for a rare metabolic disorder affecting children globally.", quote:"Science is a way of thinking much more than it is a body of knowledge.", quote_author:"Carl Sagan", quote_author_role:"Astronomer & Author", category:"science", likes:521, shares:201, platforms:{linkedin:true,x:true,instagram:true} },
];

const CALENDAR_DATA = {
  "2026-05-31":{morning:true,evening:true},
  "2026-05-30":{morning:true,evening:true},
  "2026-05-29":{morning:true,evening:true},
  "2026-05-28":{morning:true,evening:true},
  "2026-05-27":{morning:true,evening:true},
  "2026-05-26":{morning:true,evening:true},
  "2026-05-25":{morning:true,evening:false},
  "2026-05-24":{morning:true,evening:true},
  "2026-05-23":{morning:true,evening:true},
  "2026-05-22":{morning:false,evening:true},
  "2026-05-21":{morning:true,evening:true},
  "2026-05-20":{morning:true,evening:true},
};

const STATS = { totalPosts:47, totalLikes:8234, totalShares:2891, streak:23, platforms:3, thisWeek:14 };

// ── CATEGORY COLORS ──────────────────────────────────────────────────────────
const CAT_COLORS = {
  science:    { bg:"#e8f4fd", accent:"#1a7bc4", dot:"#1a7bc4" },
  environment:{ bg:"#e8f5ee", accent:"#2e7d52", dot:"#2e7d52" },
  youth:      { bg:"#fef9e7", accent:"#d4ac0d", dot:"#d4ac0d" },
  wisdom:     { bg:"#f5f0ff", accent:"#7c5cbf", dot:"#7c5cbf" },
  motivation: { bg:"#fff3e8", accent:"#e07020", dot:"#e07020" },
  courage:    { bg:"#fdecea", accent:"#c0392b", dot:"#c0392b" },
  empowerment:{ bg:"#e8faf0", accent:"#1a8c52", dot:"#1a8c52" },
  passion:    { bg:"#fce8f0", accent:"#c0306a", dot:"#c0306a" },
};

// ── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 16 }) => {
  const icons = {
    sun: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
    moon: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
    heart: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    share: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
    grid: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    gauge: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2C6.5 2 2 6.5 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10C22 6.5 17.5 2 12 2z"/><polyline points="12 6 12 12 16 14"/></svg>,
    fire: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c0 0-6 5-6 11a6 6 0 0 0 12 0c0-6-6-11-6-11zm0 15a3 3 0 0 1-3-3c0-2.5 3-6 3-6s3 3.5 3 6a3 3 0 0 1-3 3z"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    linkedin: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>,
    instagram: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>,
    twitter: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    chevLeft: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>,
    chevRight: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
    quote: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>,
    news: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8z"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    robot: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M12 2a3 3 0 0 1 3 3v6H9V5a3 3 0 0 1 3-3z"/><circle cx="9" cy="16" r="1" fill="currentColor"/><circle cx="15" cy="16" r="1" fill="currentColor"/><line x1="8" y1="21" x2="8" y2="23"/><line x1="16" y1="21" x2="16" y2="23"/></svg>,
  };
  return icons[name] || null;
};

// ── PINTEREST CARD ────────────────────────────────────────────────────────────
const PinCard = ({ post, onClick }) => {
  const [liked, setLiked] = useState(false);
  const cat = CAT_COLORS[post.category] || CAT_COLORS.wisdom;
  const isMorning = post.type === "morning_quote";

  return (
    <div onClick={() => onClick(post)} style={{
      background: "#fff",
      borderRadius: 20,
      overflow: "hidden",
      cursor: "pointer",
      boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      marginBottom: 16,
      breakInside: "avoid",
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.13)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)"; }}
    >
      {/* Color header */}
      <div style={{ background: cat.bg, padding: "24px 20px 20px", position: "relative" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom: 12 }}>
          <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, fontWeight:700, letterSpacing:2, color: cat.accent, textTransform:"uppercase", fontFamily:"'Space Mono', monospace" }}>
            <span style={{ color: cat.accent }}>{isMorning ? <Icon name="sun" size={12}/> : <Icon name="moon" size={12}/>}</span>
            {isMorning ? "Morning" : "Evening"}
          </span>
          <span style={{ fontSize:11, color:"#aaa", fontFamily:"monospace" }}>{post.date}</span>
        </div>

        {isMorning ? (
          <div>
            <div style={{ color: cat.accent, marginBottom:8, opacity:0.5 }}><Icon name="quote" size={18}/></div>
            <p style={{ fontFamily:"'Lora', Georgia, serif", fontSize:16, fontStyle:"italic", color:"#1a1a1a", lineHeight:1.55, margin:0 }}>
              "{post.quote}"
            </p>
            <p style={{ fontSize:12, color: cat.accent, fontWeight:700, marginTop:10, fontFamily:"monospace", letterSpacing:0.5 }}>
              — {post.author}
            </p>
          </div>
        ) : (
          <div>
            <div style={{ display:"flex", gap:6, marginBottom:8 }}>
              <span style={{ fontSize:10, background: cat.accent, color:"#fff", padding:"2px 8px", borderRadius:20, fontWeight:700, letterSpacing:1, textTransform:"uppercase", fontFamily:"monospace" }}>{post.category}</span>
            </div>
            <p style={{ fontFamily:"'Lora', Georgia, serif", fontSize:15, fontWeight:700, color:"#1a1a1a", lineHeight:1.4, margin:0 }}>{post.headline}</p>
            <p style={{ fontSize:11, color:"#888", marginTop:6, fontFamily:"monospace" }}>{post.source}</p>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding:"16px 20px" }}>
        {isMorning ? (
          <p style={{ fontSize:13, color:"#666", lineHeight:1.65, margin:"0 0 14px", fontWeight:300 }}>{post.reflection}</p>
        ) : (
          <div>
            <p style={{ fontSize:13, color:"#666", lineHeight:1.65, margin:"0 0 12px", fontWeight:300 }}>{post.summary}</p>
            <div style={{ background:"#fafafa", borderLeft:`3px solid ${cat.accent}`, borderRadius:"0 8px 8px 0", padding:"8px 12px", marginBottom:14 }}>
              <p style={{ fontFamily:"'Lora', Georgia, serif", fontSize:12, fontStyle:"italic", color:"#333", margin:0 }}>"{post.quote}"</p>
              <p style={{ fontSize:11, color: cat.accent, margin:"4px 0 0", fontWeight:700, fontFamily:"monospace" }}>— {post.quote_author}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", gap:12 }}>
            <button onClick={e => { e.stopPropagation(); setLiked(!liked); }} style={{
              display:"flex", alignItems:"center", gap:4,
              background:"none", border:"none", cursor:"pointer",
              fontSize:12, color: liked ? "#e04060" : "#aaa", padding:0,
              fontWeight:600
            }}>
              <Icon name="heart" size={13}/> {post.likes + (liked ? 1 : 0)}
            </button>
            <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:"#aaa" }}>
              <Icon name="share" size={13}/> {post.shares}
            </span>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            {post.platforms?.linkedin && <span style={{ color:"#0077b5" }}><Icon name="linkedin" size={13}/></span>}
            {post.platforms?.x && <span style={{ color:"#333" }}><Icon name="twitter" size={13}/></span>}
            {post.platforms?.instagram && <span style={{ color:"#e1306c" }}><Icon name="instagram" size={13}/></span>}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── MODAL ────────────────────────────────────────────────────────────────────
const Modal = ({ post, onClose }) => {
  if (!post) return null;
  const cat = CAT_COLORS[post.category] || CAT_COLORS.wisdom;
  const isMorning = post.type === "morning_quote";

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background:"#fff", borderRadius:24, maxWidth:540, width:"100%", maxHeight:"85vh", overflow:"auto", boxShadow:"0 24px 80px rgba(0,0,0,0.25)" }}>
        <div style={{ background: cat.bg, padding:"32px 32px 28px", borderRadius:"24px 24px 0 0", position:"relative" }}>
          <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"rgba(0,0,0,0.08)", border:"none", borderRadius:"50%", width:32, height:32, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#666" }}>
            <Icon name="x" size={14}/>
          </button>
          <div style={{ fontSize:11, color:cat.accent, fontWeight:700, letterSpacing:2, textTransform:"uppercase", fontFamily:"monospace", marginBottom:16 }}>
            {isMorning ? "🌅 Morning Quote" : "🌆 Evening News"} · {post.date}
          </div>
          {isMorning ? (
            <>
              <p style={{ fontFamily:"'Lora', Georgia, serif", fontSize:22, fontStyle:"italic", color:"#1a1a1a", lineHeight:1.45, margin:"0 0 12px" }}>"{post.quote}"</p>
              <p style={{ fontSize:14, color:cat.accent, fontWeight:700, fontFamily:"monospace" }}>— {post.author}<span style={{ fontWeight:400, color:"#888" }}>, {post.author_role}</span></p>
            </>
          ) : (
            <>
              <p style={{ fontFamily:"'Lora', Georgia, serif", fontSize:20, fontWeight:700, color:"#1a1a1a", lineHeight:1.35, margin:"0 0 8px" }}>{post.headline}</p>
              <p style={{ fontSize:12, color:cat.accent, fontFamily:"monospace" }}>{post.source}</p>
            </>
          )}
        </div>
        <div style={{ padding:"24px 32px 32px" }}>
          {isMorning ? (
            <>
              <p style={{ fontSize:15, color:"#444", lineHeight:1.75, marginBottom:20 }}>{post.reflection}</p>
              <div style={{ background:"#f5f5f5", borderRadius:12, padding:16, marginBottom:20 }}>
                <p style={{ fontSize:11, color:"#aaa", fontFamily:"monospace", marginBottom:6, letterSpacing:1 }}>THEME</p>
                <span style={{ background:cat.bg, color:cat.accent, padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>{post.theme}</span>
              </div>
            </>
          ) : (
            <>
              <p style={{ fontSize:15, color:"#444", lineHeight:1.75, marginBottom:16 }}>{post.summary}</p>
              <div style={{ background:cat.bg, borderLeft:`3px solid ${cat.accent}`, borderRadius:"0 12px 12px 0", padding:"12px 16px", marginBottom:20 }}>
                <p style={{ fontFamily:"'Lora', Georgia, serif", fontSize:14, fontStyle:"italic", color:"#333", margin:"0 0 6px" }}>"{post.quote}"</p>
                <p style={{ fontSize:12, color:cat.accent, fontWeight:700, fontFamily:"monospace", margin:0 }}>— {post.quote_author}<span style={{ fontWeight:400, color:"#888" }}>, {post.quote_author_role}</span></p>
              </div>
              <div style={{ background:"#f5f5f5", borderRadius:12, padding:14, marginBottom:20 }}>
                <p style={{ fontSize:11, color:"#aaa", fontFamily:"monospace", marginBottom:4, letterSpacing:1 }}>WHY IT MATTERS</p>
                <p style={{ fontSize:14, color:"#444", margin:0, fontStyle:"italic" }}>{post.why_it_matters}</p>
              </div>
            </>
          )}
          <div>
            <p style={{ fontSize:11, color:"#aaa", fontFamily:"monospace", marginBottom:10, letterSpacing:1 }}>POSTED TO</p>
            <div style={{ display:"flex", gap:10 }}>
              {post.platforms?.linkedin && <span style={{ display:"flex", alignItems:"center", gap:6, background:"#e8f0fa", color:"#0077b5", padding:"6px 14px", borderRadius:20, fontSize:13, fontWeight:600 }}><Icon name="linkedin" size={14}/> LinkedIn</span>}
              {post.platforms?.x && <span style={{ display:"flex", alignItems:"center", gap:6, background:"#f0f0f0", color:"#333", padding:"6px 14px", borderRadius:20, fontSize:13, fontWeight:600 }}><Icon name="twitter" size={14}/> X</span>}
              {post.platforms?.instagram && <span style={{ display:"flex", alignItems:"center", gap:6, background:"#fce8f0", color:"#e1306c", padding:"6px 14px", borderRadius:20, fontSize:13, fontWeight:600 }}><Icon name="instagram" size={14}/> Instagram</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── CALENDAR VIEW ─────────────────────────────────────────────────────────────
const CalendarView = () => {
  const [month, setMonth] = useState({ year:2026, month:4 }); // May 2026 (0-indexed)
  const [selected, setSelected] = useState(null);

  const getDays = (y, m) => {
    const first = new Date(y, m, 1).getDay();
    const total = new Date(y, m+1, 0).getDate();
    return { first, total };
  };

  const { first, total } = getDays(month.year, month.month);
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const getKey = (d) => {
    const dd = String(d).padStart(2,"0");
    const mm = String(month.month+1).padStart(2,"0");
    return `${month.year}-${mm}-${dd}`;
  };

  const prevMonth = () => setMonth(p => p.month === 0 ? {year:p.year-1,month:11} : {year:p.year,month:p.month-1});
  const nextMonth = () => setMonth(p => p.month === 11 ? {year:p.year+1,month:0} : {year:p.year,month:p.month+1});

  const selectedPosts = selected ? POSTS.filter(p => p.date === getKey(selected)) : [];

  return (
    <div>
      {/* Calendar Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <h2 style={{ fontFamily:"'Lora', Georgia, serif", fontSize:24, fontWeight:700, color:"#1a1a1a" }}>
          {monthNames[month.month]} {month.year}
        </h2>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={prevMonth} style={{ background:"#fff", border:"1.5px solid #eee", borderRadius:10, width:36, height:36, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#666" }}><Icon name="chevLeft" size={16}/></button>
          <button onClick={nextMonth} style={{ background:"#fff", border:"1.5px solid #eee", borderRadius:10, width:36, height:36, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#666" }}><Icon name="chevRight" size={16}/></button>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display:"flex", gap:16, marginBottom:20 }}>
        <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#666" }}><span style={{ width:10, height:10, borderRadius:"50%", background:"#f5b800", display:"inline-block" }}></span> Morning quote</span>
        <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#666" }}><span style={{ width:10, height:10, borderRadius:"50%", background:"#4a6fa5", display:"inline-block" }}></span> Evening news</span>
        <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#666" }}><span style={{ width:10, height:10, borderRadius:"50%", background:"#e0e0e0", display:"inline-block" }}></span> No post</span>
      </div>

      {/* Day names */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:6, marginBottom:6 }}>
        {dayNames.map(d => <div key={d} style={{ textAlign:"center", fontSize:11, color:"#aaa", fontWeight:700, letterSpacing:1, fontFamily:"monospace", padding:"4px 0" }}>{d}</div>)}
      </div>

      {/* Days grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:6 }}>
        {Array(first).fill(null).map((_,i) => <div key={`e${i}`}/>)}
        {Array(total).fill(null).map((_,i) => {
          const day = i+1;
          const key = getKey(day);
          const data = CALENDAR_DATA[key];
          const isSelected = selected === day;
          const today = key === "2026-05-31";

          return (
            <div key={day} onClick={() => setSelected(isSelected ? null : day)} style={{
              borderRadius:12,
              padding:"10px 6px",
              cursor:"pointer",
              background: isSelected ? "#1a1a1a" : today ? "#fef7e0" : "#fff",
              border: today ? "2px solid #f5b800" : isSelected ? "2px solid #1a1a1a" : "1.5px solid #f0f0f0",
              textAlign:"center",
              transition:"all 0.15s ease",
              minHeight:64,
            }}
            onMouseEnter={e => { if(!isSelected) e.currentTarget.style.background="#f5f5f5"; }}
            onMouseLeave={e => { if(!isSelected) e.currentTarget.style.background= today?"#fef7e0":"#fff"; }}
            >
              <div style={{ fontSize:13, fontWeight:700, color: isSelected?"#fff" : today?"#c8860a":"#333", marginBottom:8 }}>{day}</div>
              {data && (
                <div style={{ display:"flex", justifyContent:"center", gap:4 }}>
                  {data.morning && <span style={{ width:7, height:7, borderRadius:"50%", background: isSelected?"#f5b800":"#f5b800", display:"block" }}/>}
                  {data.evening && <span style={{ width:7, height:7, borderRadius:"50%", background: isSelected?"#93b4e0":"#4a6fa5", display:"block" }}/>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected day posts */}
      {selected && (
        <div style={{ marginTop:24, background:"#fafafa", borderRadius:16, padding:20 }}>
          <h3 style={{ fontFamily:"'Lora', Georgia, serif", fontSize:16, fontWeight:700, marginBottom:16, color:"#1a1a1a" }}>
            Posts for {monthNames[month.month]} {selected}
          </h3>
          {selectedPosts.length === 0 ? (
            <p style={{ color:"#aaa", fontSize:14, textAlign:"center", padding:"20px 0" }}>No posts found for this day</p>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {selectedPosts.map(post => {
                const cat = CAT_COLORS[post.category] || CAT_COLORS.wisdom;
                return (
                  <div key={post.id} style={{ background:"#fff", borderRadius:12, padding:16, border:"1.5px solid #eee", display:"flex", gap:14, alignItems:"flex-start" }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:cat.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:cat.accent }}>
                      {post.type === "morning_quote" ? <Icon name="sun" size={16}/> : <Icon name="moon" size={16}/>}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontSize:11, color:cat.accent, fontWeight:700, fontFamily:"monospace", letterSpacing:1, marginBottom:4 }}>
                        {post.type === "morning_quote" ? "MORNING QUOTE" : "EVENING NEWS"}
                      </p>
                      <p style={{ fontFamily:"'Lora', Georgia, serif", fontSize:14, fontStyle:"italic", color:"#333", margin:0, lineHeight:1.5 }}>
                        "{post.type === "morning_quote" ? post.quote : post.headline}"
                      </p>
                      <p style={{ fontSize:12, color:"#888", margin:"4px 0 0", fontFamily:"monospace" }}>
                        {post.type === "morning_quote" ? post.author : post.source}
                      </p>
                    </div>
                    <div style={{ display:"flex", gap:8, fontSize:12, color:"#aaa", flexShrink:0 }}>
                      <span style={{ display:"flex", alignItems:"center", gap:3 }}><Icon name="heart" size={11}/>{post.likes}</span>
                      <span style={{ display:"flex", alignItems:"center", gap:3 }}><Icon name="share" size={11}/>{post.shares}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── ADMIN DASHBOARD ───────────────────────────────────────────────────────────
const Dashboard = () => {
  const statCards = [
    { label:"Total Posts", value:STATS.totalPosts, icon:"news", color:"#1a7bc4", bg:"#e8f4fd" },
    { label:"Total Likes", value:STATS.totalLikes.toLocaleString(), icon:"heart", color:"#c0396a", bg:"#fce8f0" },
    { label:"Total Shares", value:STATS.totalShares.toLocaleString(), icon:"share", color:"#2e7d52", bg:"#e8f5ee" },
    { label:"Day Streak 🔥", value:STATS.streak, icon:"fire", color:"#e07020", bg:"#fff3e8" },
    { label:"Platforms", value:STATS.platforms, icon:"gauge", color:"#7c5cbf", bg:"#f5f0ff" },
    { label:"This Week", value:STATS.thisWeek, icon:"calendar", color:"#c8860a", bg:"#fef7e0" },
  ];

  const recent = POSTS.slice(0,5);

  return (
    <div>
      {/* Agent status */}
      <div style={{ background:"#1a1a1a", borderRadius:20, padding:"20px 24px", marginBottom:28, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:36, height:36, background:"#2e7d52", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>
            <Icon name="robot" size={18}/>
          </div>
          <div>
            <p style={{ color:"#fff", fontWeight:700, fontSize:14, margin:0 }}>LUMIQ Agent · Active</p>
            <p style={{ color:"rgba(255,255,255,0.45)", fontSize:12, margin:0, fontFamily:"monospace" }}>Last run: 7:00 AM · Next: 7:00 PM today</p>
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button style={{ background:"#f5b800", color:"#1a1a1a", border:"none", borderRadius:10, padding:"8px 18px", fontSize:13, fontWeight:700, cursor:"pointer" }}>Run Now</button>
          <button style={{ background:"rgba(255,255,255,0.1)", color:"#fff", border:"none", borderRadius:10, padding:"8px 18px", fontSize:13, cursor:"pointer" }}>Settings</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:12, marginBottom:28 }}>
        {statCards.map(s => (
          <div key={s.label} style={{ background:"#fff", borderRadius:16, padding:"18px 16px", border:"1.5px solid #f0f0f0" }}>
            <div style={{ width:32, height:32, background:s.bg, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", color:s.color, marginBottom:10 }}>
              <Icon name={s.icon} size={16}/>
            </div>
            <div style={{ fontFamily:"'Lora', Georgia, serif", fontSize:26, fontWeight:800, color:"#1a1a1a", lineHeight:1 }}>{s.value}</div>
            <div style={{ fontSize:11, color:"#aaa", marginTop:4, fontFamily:"monospace", letterSpacing:0.5 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Platform health */}
      <div style={{ background:"#fff", borderRadius:20, padding:24, border:"1.5px solid #f0f0f0", marginBottom:20 }}>
        <h3 style={{ fontFamily:"'Lora', Georgia, serif", fontSize:16, fontWeight:700, marginBottom:16, color:"#1a1a1a" }}>Platform Status</h3>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {[
            { name:"LinkedIn", icon:"linkedin", color:"#0077b5", bg:"#e8f0fa", connected:true, posts:47 },
            { name:"X (Twitter)", icon:"twitter", color:"#333", bg:"#f0f0f0", connected:true, posts:45 },
            { name:"Instagram", icon:"instagram", color:"#e1306c", bg:"#fce8f0", connected:true, posts:47 },
          ].map(p => (
            <div key={p.name} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:"#fafafa", borderRadius:12 }}>
              <div style={{ width:32, height:32, background:p.bg, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", color:p.color }}>
                <Icon name={p.icon} size={15}/>
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:14, fontWeight:600, color:"#1a1a1a", margin:0 }}>{p.name}</p>
                <p style={{ fontSize:11, color:"#aaa", margin:0, fontFamily:"monospace" }}>{p.posts} posts published</p>
              </div>
              <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:"#2e7d52", fontWeight:700, background:"#e8f5ee", padding:"4px 10px", borderRadius:20 }}>
                <Icon name="check" size={11}/> Connected
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div style={{ background:"#fff", borderRadius:20, padding:24, border:"1.5px solid #f0f0f0" }}>
        <h3 style={{ fontFamily:"'Lora', Georgia, serif", fontSize:16, fontWeight:700, marginBottom:16, color:"#1a1a1a" }}>Recent Posts</h3>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {recent.map(post => {
            const cat = CAT_COLORS[post.category] || CAT_COLORS.wisdom;
            return (
              <div key={post.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:"#fafafa", borderRadius:12 }}>
                <div style={{ width:36, height:36, background:cat.bg, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", color:cat.accent, flexShrink:0 }}>
                  {post.type === "morning_quote" ? <Icon name="sun" size={16}/> : <Icon name="moon" size={16}/>}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:13, fontWeight:600, color:"#1a1a1a", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {post.type === "morning_quote" ? `"${post.quote.substring(0,50)}..."` : post.headline?.substring(0,55)+"..."}
                  </p>
                  <p style={{ fontSize:11, color:"#aaa", margin:0, fontFamily:"monospace" }}>{post.date} · {post.type === "morning_quote" ? post.author : post.source}</p>
                </div>
                <div style={{ display:"flex", gap:8, fontSize:12, color:"#aaa", flexShrink:0 }}>
                  <span style={{ display:"flex", alignItems:"center", gap:3 }}><Icon name="heart" size={11}/>{post.likes}</span>
                  <span style={{ display:"flex", alignItems:"center", gap:3 }}><Icon name="share" size={11}/>{post.shares}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── FEED VIEW (Pinterest) ─────────────────────────────────────────────────────
const FeedView = ({ onCardClick }) => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = POSTS.filter(p => {
    const matchType = filter === "all" || (filter === "morning" && p.type === "morning_quote") || (filter === "evening" && p.type === "evening_news") || (filter === p.category);
    const matchSearch = !search || (p.quote||p.headline||"").toLowerCase().includes(search.toLowerCase()) || (p.author||p.quote_author||"").toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const col1 = filtered.filter((_,i) => i%3===0);
  const col2 = filtered.filter((_,i) => i%3===1);
  const col3 = filtered.filter((_,i) => i%3===2);

  const filters = [
    { key:"all", label:"All" },
    { key:"morning", label:"🌅 Morning" },
    { key:"evening", label:"🌆 Evening" },
    { key:"science", label:"Science" },
    { key:"environment", label:"Nature" },
    { key:"wisdom", label:"Wisdom" },
    { key:"youth", label:"Youth" },
    { key:"courage", label:"Courage" },
  ];

  return (
    <div>
      {/* Search */}
      <div style={{ marginBottom:16 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search quotes, news, authors..."
          style={{ width:"100%", padding:"12px 18px", borderRadius:12, border:"1.5px solid #eee", fontSize:14, outline:"none", background:"#fff", fontFamily:"inherit" }}
        />
      </div>

      {/* Filter pills */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:24 }}>
        {filters.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding:"7px 16px", borderRadius:50, border:"1.5px solid",
            fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.15s ease",
            borderColor: filter === f.key ? "#1a1a1a" : "#eee",
            background: filter === f.key ? "#1a1a1a" : "#fff",
            color: filter === f.key ? "#fff" : "#666",
          }}>
            {f.label}
          </button>
        ))}
      </div>

      <p style={{ fontSize:12, color:"#aaa", marginBottom:20, fontFamily:"monospace" }}>{filtered.length} posts</p>

      {/* Masonry grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, alignItems:"start" }}>
        <div>{col1.map(p => <PinCard key={p.id} post={p} onClick={onCardClick}/>)}</div>
        <div>{col2.map(p => <PinCard key={p.id} post={p} onClick={onCardClick}/>)}</div>
        <div>{col3.map(p => <PinCard key={p.id} post={p} onClick={onCardClick}/>)}</div>
      </div>
    </div>
  );
};

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function LumiqSPA() {
  const [view, setView] = useState("dashboard");
  const [selectedPost, setSelectedPost] = useState(null);

  const nav = [
    { key:"dashboard", label:"Dashboard", icon:"gauge" },
    { key:"feed", label:"Posts", icon:"grid" },
    { key:"calendar", label:"Calendar", icon:"calendar" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#f5f1eb", fontFamily:"'Nunito', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,400;1,600&family=Nunito:wght@300;400;600;700&family=Space+Mono&display=swap" rel="stylesheet"/>

      {/* Sidebar */}
      <div style={{ position:"fixed", left:0, top:0, bottom:0, width:220, background:"#1a1a1a", zIndex:100, display:"flex", flexDirection:"column", padding:"24px 16px" }}>
        {/* Logo */}
        <div style={{ marginBottom:32, paddingLeft:8 }}>
          <div style={{ fontFamily:"'Lora', Georgia, serif", fontSize:26, fontWeight:700, color:"#fff", letterSpacing:-0.5 }}>
            LUM<span style={{ color:"#f5b800" }}>IQ</span>
          </div>
          <div style={{ fontFamily:"monospace", fontSize:9, color:"rgba(255,255,255,0.3)", letterSpacing:3, marginTop:2 }}>CONTROL PANEL</div>
        </div>

        {/* Nav */}
        <div style={{ flex:1 }}>
          {nav.map(n => (
            <button key={n.key} onClick={() => setView(n.key)} style={{
              width:"100%", display:"flex", alignItems:"center", gap:12,
              padding:"11px 14px", borderRadius:12, border:"none", cursor:"pointer",
              marginBottom:4, textAlign:"left",
              background: view === n.key ? "rgba(245,184,0,0.15)" : "transparent",
              color: view === n.key ? "#f5b800" : "rgba(255,255,255,0.5)",
              fontSize:14, fontWeight: view === n.key ? 700 : 400,
              fontFamily:"inherit",
              transition:"all 0.15s ease",
            }}>
              <Icon name={n.icon} size={17}/>
              {n.label}
              {n.key === "feed" && <span style={{ marginLeft:"auto", background:"rgba(255,255,255,0.08)", borderRadius:20, padding:"1px 8px", fontSize:10, fontFamily:"monospace" }}>{POSTS.length}</span>}
            </button>
          ))}
        </div>

        {/* Agent badge */}
        <div style={{ background:"rgba(46,125,82,0.2)", borderRadius:12, padding:"12px 14px", border:"1px solid rgba(46,125,82,0.3)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:"#4ade80", animation:"none" }}/>
            <span style={{ fontSize:11, color:"#4ade80", fontWeight:700, fontFamily:"monospace" }}>AGENT LIVE</span>
          </div>
          <p style={{ fontSize:10, color:"rgba(255,255,255,0.35)", margin:0, fontFamily:"monospace", lineHeight:1.5 }}>
            🌅 7:00 AM daily<br/>
            🌆 7:00 PM daily<br/>
            3 platforms
          </p>
        </div>
      </div>

      {/* Main content */}
      <div style={{ marginLeft:220, padding:"32px 32px 48px" }}>
        {/* Top bar */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28 }}>
          <div>
            <h1 style={{ fontFamily:"'Lora', Georgia, serif", fontSize:26, fontWeight:700, color:"#1a1a1a", margin:0 }}>
              {view === "dashboard" && "Dashboard"}
              {view === "feed" && "Posts Feed"}
              {view === "calendar" && "Calendar"}
            </h1>
            <p style={{ fontSize:12, color:"#aaa", margin:"4px 0 0", fontFamily:"monospace" }}>
              {new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}
            </p>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button style={{ display:"flex", alignItems:"center", gap:8, background:"#1a1a1a", color:"#fff", border:"none", borderRadius:12, padding:"10px 18px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
              <Icon name="plus" size={15}/> New Post
            </button>
          </div>
        </div>

        {/* Views */}
        {view === "dashboard" && <Dashboard/>}
        {view === "feed" && <FeedView onCardClick={setSelectedPost}/>}
        {view === "calendar" && <CalendarView/>}
      </div>

      {/* Post detail modal */}
      <Modal post={selectedPost} onClose={() => setSelectedPost(null)}/>
    </div>
  );
}
