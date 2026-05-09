import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// ── ICONS (inline SVGs to avoid import issues) ──────────────────────────────
const Icon = {
  Leaf: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>,
  ArrowRight: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
  MapPin: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  Cpu: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2M9 2v2M2 15h2M2 9h2M15 20v2M9 20v2M20 15h2M20 9h2"/></svg>,
  TrendingUp: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  Zap: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Truck: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect x="9" y="11" width="14" height="10" rx="2"/><circle cx="12" cy="21" r="1"/><circle cx="20" cy="21" r="1"/></svg>,
  BarChart: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  Heart: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
  Users: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Globe: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>,
  Sparkles: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/></svg>,
  Quote: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 2v8c0 1 0 4 3 4z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 2v8c0 1 0 4 3 4z"/></svg>,
  FileText: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>,
  CheckCircle: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Star: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Shield: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  BookOpen: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  Brain: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/></svg>,
  ShoppingBag: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  Lightbulb: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>,
  Rocket: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>,
  Sprout: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 1 1.5 4.7c-1.7 0-3-.3-4.1-1.1-.9-.7-1.7-1.9-2.3-4.1 2.5-.3 4 .1 4.9.5z"/></svg>,
  Instagram: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  Youtube: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><polygon points="10 15 15 12 10 9 10 15"/></svg>,
  Linkedin: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
  Twitter: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>,
  Facebook: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
  ExternalLink: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  Phone: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.54 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Mail: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
};

// ── ANIMATED NUMBER ───────────────────────────────────────────────────────────
function AnimatedNumber({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 60;
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(start));
    }, 25);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ── PROGRESS BAR ─────────────────────────────────────────────────────────────
function ProgressBar({ pct, color }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="w-full bg-gray-700 rounded-full h-2">
      <motion.div
        className={`h-2 rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={inView ? { width: `${pct}%` } : {}}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      />
    </div>
  );
}

// ── NAVBAR ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <motion.nav initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}
      style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:"#fff",
        boxShadow: scrolled ? "0 1px 20px rgba(0,0,0,0.08)" : "none",
        borderBottom: scrolled ? "1px solid #f0f0f0" : "1px solid transparent",
        transition:"all 0.3s" }}>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
          <div style={{ width:34, height:34, background:"#166534", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon.Leaf style={{ width:18, height:18, color:"#fff" }} />
          </div>
          <span style={{ color:"#111827", fontWeight:600, fontSize:15 }}>Vital Victuals</span>
        </div>
        {/* Right nav */}
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button style={{ border:"1px solid #d1d5db", borderRadius:999, padding:"4px 14px", fontSize:14, color:"#374151", background:"none", cursor:"pointer", fontWeight:500 }}>हिंदी</button>
          <button style={{ background:"none", border:"none", color:"#374151", fontWeight:500, fontSize:14, cursor:"pointer", padding:"0 8px" }}>Sign In</button>
          <button style={{ background:"#166534", color:"#fff", fontWeight:600, fontSize:14, padding:"8px 18px", borderRadius:8, border:"none", cursor:"pointer" }}>Get Started</button>
        </div>
      </div>
    </motion.nav>
  );
}

// ── HERO ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ position:"relative", width:"100%", height:"100vh", minHeight:600, overflow:"hidden" }}>
      {/* Background */}
      <div style={{ position:"absolute", inset:0 }}>
        <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1600&q=80"
          alt="volunteers" style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center" }} />
        <div style={{ position:"absolute", inset:0,
          background:"linear-gradient(to right, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.1) 100%)" }} />
      </div>

      {/* Content */}
      <div style={{ position:"relative", zIndex:10, maxWidth:1280, margin:"0 auto", padding:"0 24px", height:"100%", display:"flex", alignItems:"center" }}>
        <div style={{ maxWidth:560, paddingTop:64 }}>
          {/* Badge */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
            style={{ display:"inline-flex", alignItems:"center", gap:8, border:"1px solid rgba(255,255,255,0.3)", borderRadius:999, padding:"6px 14px", marginBottom:24, background:"rgba(0,0,0,0.25)", backdropFilter:"blur(8px)" }}>
            <span style={{ width:8, height:8, background:"#4ade80", borderRadius:"50%", display:"inline-block" }} className="pulse" />
            <span style={{ color:"#fff", fontSize:13, fontWeight:500 }}>AI-Powered Food Redistribution</span>
          </motion.div>

          {/* Headline */}
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}>
            <h1 style={{ fontSize:"clamp(38px,5vw,60px)", fontWeight:900, color:"#fff", lineHeight:1.1, margin:0 }}>
              Give Your Surplus Food
            </h1>
            <h1 style={{ fontSize:"clamp(38px,5vw,60px)", fontWeight:900, color:"#4ade80", lineHeight:1.1, margin:"0 0 20px" }}>
              a Purpose
            </h1>
          </motion.div>

          {/* Subtext */}
          <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
            style={{ color:"rgba(255,255,255,0.85)", fontSize:15, lineHeight:1.7, marginBottom:32, maxWidth:440 }}>
            Smart matching connects surplus food to NGOs, animal shelters &amp; recyclers — using geo-routing, AI demand forecasting, and real-time logistics.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
            style={{ display:"flex", gap:12 }}>
            <button style={{ background:"#166534", color:"#fff", fontWeight:700, fontSize:15, padding:"12px 24px", borderRadius:12, border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
              Join the Mission <Icon.ArrowRight style={{ width:16, height:16 }} />
            </button>
            <button style={{ background:"none", border:"1px solid rgba(255,255,255,0.5)", color:"#fff", fontWeight:700, fontSize:15, padding:"12px 24px", borderRadius:12, cursor:"pointer" }}>
              Sign In
            </button>
          </motion.div>
        </div>

        {/* Floating stat cards */}
        <div style={{ position:"absolute", right:32, bottom:100, display:"flex", flexDirection:"column", gap:10 }}>
          {[
            { icon:"🍽️", val:"206", label:"Meals Served", delay:0.7 },
            { icon:"🌿", val:"51.5 kg", label:"Kg Food Saved", delay:0.85 },
            { icon:"🌍", val:"128.8 kg", label:"Kg CO₂ Reduced", delay:1.0 },
          ].map((s,i) => (
            <motion.div key={i} initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }} transition={{ delay:s.delay }}
              style={{ background:"rgba(255,255,255,0.97)", backdropFilter:"blur(12px)", borderRadius:14, padding:"10px 16px", display:"flex", alignItems:"center", gap:12, minWidth:190, boxShadow:"0 4px 20px rgba(0,0,0,0.15)" }}>
              <div style={{ width:36, height:36, background:"#f3f4f6", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{s.icon}</div>
              <div>
                <div style={{ fontWeight:800, fontSize:15, color:"#111" }}>{s.val}</div>
                <div style={{ fontSize:11, color:"#6b7280" }}>{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Shree Jagannatha floating button */}
      <motion.div initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ delay:1.3 }}
        style={{ position:"fixed", bottom:24, right:24, zIndex:200 }}>
        <button style={{ background:"linear-gradient(135deg,#f97316,#ea580c)", color:"#fff", borderRadius:999, padding:"10px 16px", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:10, boxShadow:"0 4px 20px rgba(249,115,22,0.45)" }}>
          <div style={{ width:30, height:30, background:"rgba(255,255,255,0.2)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🕉️</div>
          <div style={{ textAlign:"left" }}>
            <div style={{ fontSize:12, fontWeight:700, lineHeight:1.2 }}>Shree Jagannatha</div>
            <div style={{ fontSize:11, opacity:0.85, lineHeight:1.2 }}>Divine Food Guide</div>
          </div>
          <span style={{ width:8, height:8, background:"#fcd34d", borderRadius:"50%", display:"inline-block" }} />
        </button>
      </motion.div>
    </section>
  );
}

// ── STATS BANNER ──────────────────────────────────────────────────────────────
function StatsBanner() {
  const stats = [
    { target:206, suffix:"", label:"Meals Served" },
    { target:51, suffix:" kg", label:"Kg Food Saved" },
    { target:128, suffix:" kg", label:"Kg CO₂ Reduced" },
    { target:3, suffix:"", label:"Total Donations" },
  ];
  return (
    <section style={{ background:"linear-gradient(135deg,#15803d 0%,#16a34a 60%,#22c55e 100%)", padding:"48px 24px" }}>
      <div style={{ maxWidth:1280, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24, textAlign:"center" }}>
        {stats.map((s,i) => (
          <motion.div key={i} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}>
            <div style={{ fontSize:"clamp(36px,4vw,52px)", fontWeight:900, color:"#fff", lineHeight:1 }}>
              <AnimatedNumber target={s.target} suffix={s.suffix} />
            </div>
            <div style={{ color:"rgba(255,255,255,0.8)", fontSize:13, fontWeight:500, marginTop:6 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ── PHILOSOPHY ────────────────────────────────────────────────────────────────
function PhilosophySection() {
  return (
    <section style={{ padding:"96px 24px", background:"#fff", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", right:-80, top:-80, width:400, height:400, background:"#f0fdf4", borderRadius:"50%", opacity:0.6 }} />
      <div style={{ maxWidth:960, margin:"0 auto", position:"relative", zIndex:1 }}>
        {/* Badge */}
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          style={{ display:"flex", justifyContent:"center", marginBottom:20 }}>
          <span style={{ border:"1px solid #d1d5db", borderRadius:999, padding:"6px 16px", fontSize:13, color:"#6b7280", display:"inline-flex", alignItems:"center", gap:8 }}>
            <Icon.BookOpen style={{ width:14, height:14 }} /> The Name &amp; The Philosophy
          </span>
        </motion.div>

        <motion.h2 initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.1 }}
          style={{ fontSize:"clamp(28px,4vw,46px)", fontWeight:900, color:"#111827", textAlign:"center", marginBottom:8 }}>
          What does <em style={{ color:"#16a34a", fontStyle:"normal" }}>Vital Victuals</em> mean?
        </motion.h2>
        <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ delay:0.15 }}
          style={{ color:"#9ca3af", textAlign:"center", marginBottom:56, fontSize:14 }}>
          Every word in our name carries centuries of meaning — and a promise.
        </motion.p>

        {/* Word cards */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, marginBottom:56 }}>
          {[
            { icon:<Icon.Heart style={{ width:22,height:22,color:"#fff" }}/>, iconBg:"#22c55e", word:"VITAL", latin:"Latin: vitalis",
              tagline:"Essential to life. Life-giving. Indispensable.", tagColor:"#15803d",
              desc:"Food is not optional. It is not a luxury. It is vital — the single most important resource a human being needs to survive, think, love, and dream. When we say 'Vital', we mean: this matters more than anything." },
            { icon:<Icon.Shield style={{ width:22,height:22,color:"#fff" }}/>, iconBg:"#3b82f6", word:"VICTUALS", latin:"Latin: victualia",
              tagline:"Food supplies. Provisions. The nourishment people carry with them.", tagColor:"#1d4ed8",
              desc:"An old English word — used by sailors, soldiers, and travellers for centuries to mean the food that sustains you on a journey. We chose it because food isn't just a product. It's provisions for life's journey." },
          ].map((card,i) => (
            <motion.div key={i} initial={{ opacity:0, x: i===0?-30:30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:0.2+i*0.1 }}
              style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:20, padding:32, boxShadow:"0 1px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:16 }}>
                <div style={{ width:48, height:48, background:card.iconBg, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{card.icon}</div>
                <div style={{ display:"flex", alignItems:"baseline", gap:12 }}>
                  <span style={{ fontSize:28, fontWeight:900, color:"#111827", letterSpacing:1 }}>{card.word}</span>
                  <span style={{ fontSize:12, color:"#9ca3af", fontStyle:"italic" }}>{card.latin}</span>
                </div>
              </div>
              <p style={{ color:card.tagColor, fontWeight:600, marginBottom:10, fontSize:13 }}>{card.tagline}</p>
              <p style={{ color:"#6b7280", fontSize:13, lineHeight:1.7 }}>{card.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Green combined banner */}
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.4 }}
          style={{ background:"linear-gradient(135deg,#15803d,#16a34a,#22c55e)", borderRadius:28, padding:"60px 48px", textAlign:"center" }}>
          <div style={{ fontSize:"clamp(36px,6vw,80px)", fontWeight:900, color:"rgba(255,255,255,0.2)", letterSpacing:4, marginBottom:16, userSelect:"none" }}>VITAL + VICTUALS</div>
          <div style={{ width:60, height:2, background:"rgba(255,255,255,0.35)", margin:"0 auto 24px" }} />
          <p style={{ color:"#fff", fontSize:"clamp(18px,2.5vw,26px)", fontWeight:700, marginBottom:16 }}>"Life-giving food — food that matters."</p>
          <p style={{ color:"rgba(255,255,255,0.8)", fontSize:14, lineHeight:1.8, maxWidth:560, margin:"0 auto" }}>
            We didn't pick a trendy startup name. We chose words that have meant something real for 600 years — because food insecurity is not new, and neither is our commitment to ending it.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ── ALGORITHMS ────────────────────────────────────────────────────────────────
function AlgorithmsSection() {
  const algos = [
    { icon:<Icon.MapPin style={{ width:18,height:18,color:"#fff" }}/>, bg:"#3b82f6", title:"Haversine Geo-Routing", desc:"Calculates great-circle distance between donors and recipients using the Haversine formula for precise geo-matching within configurable radius." },
    { icon:<Icon.Cpu style={{ width:18,height:18,color:"#fff" }}/>, bg:"#8b5cf6", title:"AI Freshness Classifier", desc:"Multi-layer decision tree classifies food into 3 tiers (NGO/Animal/Recycle) based on cook time, food type, and declared freshness score." },
    { icon:<Icon.TrendingUp style={{ width:18,height:18,color:"#fff" }}/>, bg:"#f97316", title:"Demand Forecasting", desc:"ARIMA + LSTM hybrid model predicts NGO demand 48 hrs ahead using historical intake patterns and seasonal adjustment." },
    { icon:<Icon.Zap style={{ width:18,height:18,color:"#fff" }}/>, bg:"#22c55e", title:"Priority Queue Allocation", desc:"Max-heap priority queue allocates donations by urgency score = f(distance, demand_gap, food_ttl). Runs in O(n log n) ensuring highest-need recipients are served first." },
    { icon:<Icon.Truck style={{ width:18,height:18,color:"#fff" }}/>, bg:"#dc2626", title:"Vehicle Routing (VRP)", desc:"Nearest-neighbour heuristic + 2-opt improvement solves multi-stop courier routes. Integrates live traffic via OSRM — cuts average delivery time by 25%." },
    { icon:<Icon.BarChart style={{ width:18,height:18,color:"#fff" }}/>, bg:"#14b8a6", title:"Impact Scoring Engine", desc:"Weighted composite score (meals saved, CO₂ offset, water saved, economic value) computed for every donation using EPA emission factors and FAO food-water footprint tables." },
  ];
  const bars = [
    { label:"Geo-Routing Precision", pct:98, color:"bg-blue-400" },
    { label:"Freshness Classification", pct:94, color:"bg-purple-400" },
    { label:"Demand Forecast (48 hr)", pct:87, color:"bg-yellow-400" },
    { label:"Priority Allocation", pct:99, color:"bg-green-400" },
    { label:"VRP Route Efficiency", pct:91, color:"bg-pink-400" },
    { label:"Impact Score Validity", pct:96, color:"bg-emerald-400" },
  ];
  return (
    <section style={{ padding:"96px 24px", background:"#0f172a" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ textAlign:"center", marginBottom:64 }}>
          <span style={{ border:"1px solid #374151", borderRadius:999, padding:"6px 16px", fontSize:13, color:"#9ca3af", display:"inline-flex", alignItems:"center", gap:8, marginBottom:20 }}>
            <Icon.Cpu style={{ width:14, height:14 }} /> Core Technology
          </span>
          <h2 style={{ fontSize:"clamp(28px,4vw,46px)", fontWeight:900, color:"#fff", marginBottom:12 }}>Advanced Algorithms</h2>
          <p style={{ color:"#6b7280", fontSize:14, maxWidth:500, margin:"0 auto" }}>Six intelligent systems working in real-time to maximize food utilization and minimize waste.</p>
        </motion.div>

        {/* Cards grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, marginBottom:32 }}>
          {algos.map((a,i) => (
            <motion.div key={i} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.08 }}
              style={{ background:"rgba(30,41,59,0.8)", border:"1px solid #1e293b", borderRadius:20, padding:24 }}>
              <div style={{ width:44, height:44, background:a.bg, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>{a.icon}</div>
              <h3 style={{ color:"#fff", fontWeight:700, fontSize:15, marginBottom:8 }}>{a.title}</h3>
              <p style={{ color:"#6b7280", fontSize:12, lineHeight:1.7 }}>{a.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Accuracy bars */}
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          style={{ background:"rgba(30,41,59,0.6)", border:"1px solid #1e293b", borderRadius:20, padding:32 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:28 }}>
            <Icon.BarChart style={{ width:18, height:18, color:"#4ade80" }} />
            <span style={{ color:"#fff", fontWeight:700, fontSize:16 }}>Real-Time Algorithm Accuracy</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px 48px" }}>
            {bars.map((b,i) => (
              <motion.div key={i} initial={{ opacity:0, x:-10 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:i*0.06 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ color:"#9ca3af", fontSize:12 }}>{b.label}</span>
                  <span style={{ color:"#d1d5db", fontSize:12, fontWeight:600 }}>{b.pct}%</span>
                </div>
                <ProgressBar pct={b.pct} color={b.color} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── HOW IT WORKS ──────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { num:"01", icon:<Icon.ShoppingBag style={{ width:22,height:22,color:"#fff" }}/>, bg:"#22c55e", title:"Post Surplus Food", desc:"Donors list surplus food with details — quantity, type, freshness." },
    { num:"02", icon:<Icon.Brain style={{ width:22,height:22,color:"#fff" }}/>, bg:"#3b82f6", title:"AI Classifies It", desc:"Our smart engine routes it to the best recipient automatically." },
    { num:"03", icon:<Icon.Users style={{ width:22,height:22,color:"#fff" }}/>, bg:"#f97316", title:"NGO / Shelter Claims", desc:"Verified recipients claim and coordinate pickup in minutes." },
    { num:"04", icon:<Icon.Truck style={{ width:22,height:22,color:"#fff" }}/>, bg:"#8b5cf6", title:"Volunteer Delivers", desc:"Volunteers pick up and deliver, tracked end-to-end." },
  ];
  return (
    <section style={{ padding:"96px 24px", background:"#f9fafb" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ textAlign:"center", marginBottom:64 }}>
          <h2 style={{ fontSize:"clamp(28px,4vw,46px)", fontWeight:900, color:"#111827", marginBottom:12 }}>How It Works</h2>
          <p style={{ color:"#6b7280", fontSize:14 }}>Four simple steps — powered by intelligent algorithms running in real-time.</p>
        </motion.div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center" }}>
          {/* Steps */}
          <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
            {steps.map((s,i) => (
              <motion.div key={i} initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}
                style={{ display:"flex", alignItems:"flex-start", gap:20 }}>
                <div style={{ width:56, height:56, background:s.bg, borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{s.icon}</div>
                <div>
                  <p style={{ color:"#9ca3af", fontSize:11, fontWeight:700, letterSpacing:2, marginBottom:4 }}>STEP {s.num}</p>
                  <h3 style={{ color:"#111827", fontWeight:700, fontSize:16, marginBottom:4 }}>{s.title}</h3>
                  <p style={{ color:"#6b7280", fontSize:13, lineHeight:1.6 }}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Image panel */}
          <motion.div initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:0.3 }}
            style={{ borderRadius:24, overflow:"hidden", position:"relative", boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }}>
            <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=700&q=80" alt="delivery" style={{ width:"100%", height:360, objectFit:"cover" }} />
            <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"rgba(0,0,0,0.65)", backdropFilter:"blur(4px)", padding:"16px 20px" }}>
              <p style={{ color:"#fff", fontSize:13, fontWeight:600, marginBottom:10 }}>From donation to delivery in minutes</p>
              <div style={{ display:"flex", gap:8 }}>
                {["1. Smart Match","2. Geo-Route","3. Deliver"].map((l,i) => (
                  <span key={i} style={{ background:"rgba(255,255,255,0.15)", color:"#e5e7eb", fontSize:11, padding:"4px 10px", borderRadius:999 }}>{l}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── WHO CAN DONATE ────────────────────────────────────────────────────────────
function WhoDonates() {
  const donors = [
    { emoji:"🎓", title:"College Messes", desc:"Daily leftovers — 20–100 kg wasted every night" },
    { emoji:"🏨", title:"Hostels", desc:"Evening canteen surplus — ready to donate" },
    { emoji:"🍽️", title:"Restaurants", desc:"End-of-day cooked food" },
    { emoji:"🏡", title:"Weddings & Events", desc:"Functions always have surplus" },
    { emoji:"🏠", title:"Households", desc:"Home-cooked surplus from any family" },
    { emoji:"🏢", title:"Corporates", desc:"Office cafeterias with bulk surplus" },
  ];
  return (
    <section style={{ padding:"96px 24px", background:"#fff" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ textAlign:"center", marginBottom:56 }}>
          <p style={{ color:"#16a34a", fontSize:11, fontWeight:700, letterSpacing:2, marginBottom:12 }}>WHO CAN DONATE</p>
          <h2 style={{ fontSize:"clamp(28px,4vw,46px)", fontWeight:900, color:"#111827", marginBottom:12 }}>Every meal surplus has a home</h2>
          <p style={{ color:"#6b7280", fontSize:14, maxWidth:500, margin:"0 auto" }}>From college messes to wedding caterers — if food is going to waste, we find it a purpose.</p>
        </motion.div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:16, marginBottom:32 }}>
          {donors.map((d,i) => (
            <motion.div key={i} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.07 }}
              style={{ border:"1px solid #e5e7eb", borderRadius:20, padding:20, textAlign:"center", cursor:"pointer", transition:"all 0.2s" }}
              whileHover={{ borderColor:"#86efac", background:"rgba(240,253,244,0.5)", y:-2 }}>
              <div style={{ fontSize:28, marginBottom:10 }}>{d.emoji}</div>
              <h3 style={{ color:"#111827", fontWeight:600, fontSize:12, marginBottom:6 }}>{d.title}</h3>
              <p style={{ color:"#9ca3af", fontSize:11, lineHeight:1.5 }}>{d.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Alert box */}
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          style={{ background:"#fffbeb", border:"1px solid #fde68a", borderRadius:20, padding:24, display:"flex", gap:16 }}>
          <span style={{ fontSize:24, flexShrink:0 }}>💡</span>
          <div>
            <p style={{ color:"#92400e", fontWeight:600, fontSize:13, marginBottom:4 }}>A message to college students &amp; mess managers</p>
            <p style={{ color:"#b45309", fontSize:13, lineHeight:1.7 }}>If food is arranged in a function and it simply goes to waste — what is the use? That food could remove someone's hunger. College hostels and messes waste tons of food daily. 2 clicks on Vital Victuals can change that. Free pickup available.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── MISSION SECTION ───────────────────────────────────────────────────────────
function MissionSection() {
  return (
    <section style={{ padding:"96px 24px", background:"#fff" }}>
      <div style={{ maxWidth:1280, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center" }}>
        {/* Image grid */}
        <motion.div initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
          style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {[
            { src:"https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&q=80", mt:0 },
            { src:"https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&q=80", mt:32 },
            { src:"https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=400&q=80", mt:0 },
            { src:"https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&q=80", mt:16 },
          ].map((img,i) => (
            <div key={i} style={{ borderRadius:18, overflow:"hidden", height:200, marginTop:img.mt }}>
              <img src={img.src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            </div>
          ))}
        </motion.div>

        {/* Text */}
        <motion.div initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:0.15 }}>
          <span style={{ background:"#f3f4f6", color:"#6b7280", fontSize:11, padding:"6px 12px", borderRadius:999, fontWeight:600, display:"inline-block", marginBottom:20 }}>Our Mission</span>
          <h2 style={{ fontSize:"clamp(28px,3.5vw,44px)", fontWeight:900, color:"#111827", lineHeight:1.15, marginBottom:20 }}>No food wasted. No one hungry.</h2>
          <p style={{ color:"#4b5563", fontSize:14, lineHeight:1.8, marginBottom:24 }}>
            In a country like India, where millions sleep hungry every night, food is not just a necessity — it is a blessing. The food we often waste could bring relief, hope, and a smile to someone in need. By donating surplus food, we turn small actions into life-changing support. Every grain of food carries the effort of farmers and the value of life. Sharing it is not just kindness — it is humanity.
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:28 }}>
            {["68M tonnes wasted/year","200M hungry in India","Zero to landfill"].map((t,i) => (
              <span key={i} style={{ border:"1px solid #e5e7eb", color:"#6b7280", fontSize:12, padding:"5px 12px", borderRadius:999 }}>{t}</span>
            ))}
          </div>
          <button style={{ background:"#166534", color:"#fff", fontWeight:700, fontSize:14, padding:"12px 24px", borderRadius:12, border:"none", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8 }}>
            Join the Mission <Icon.ArrowRight style={{ width:16, height:16 }} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

// ── CORE PHILOSOPHY DARK ──────────────────────────────────────────────────────
function CorePhilosophy() {
  return (
    <section style={{ padding:"96px 24px", background:"#0f172a" }}>
      <div style={{ maxWidth:800, margin:"0 auto", textAlign:"center" }}>
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ marginBottom:28 }}>
          <span style={{ border:"1px solid #374151", borderRadius:999, padding:"6px 16px", fontSize:13, color:"#9ca3af", display:"inline-flex", alignItems:"center", gap:8 }}>
            <Icon.Leaf style={{ width:14, height:14, color:"#4ade80" }} /> The Core Philosophy
          </span>
        </motion.div>

        <motion.h2 initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.1 }}
          style={{ fontSize:"clamp(32px,5vw,58px)", fontWeight:900, color:"#fff", lineHeight:1.15, marginBottom:40 }}>
          Every <span style={{ color:"#4ade80" }}>Part</span> of Food<br />is <span style={{ color:"#4ade80" }}>Valued</span>
        </motion.h2>

        <motion.div initial={{ opacity:0, scale:0.5 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ delay:0.3 }}
          style={{ display:"flex", justifyContent:"center", marginBottom:40 }}>
          <div style={{ width:56, height:56, background:"rgba(22,101,52,0.4)", border:"1px solid #166534", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon.Leaf style={{ width:26, height:26, color:"#4ade80" }} />
          </div>
        </motion.div>

        <motion.blockquote initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.4 }}>
          <p style={{ fontSize:"clamp(16px,2vw,22px)", color:"#fff", fontWeight:700, lineHeight:1.6, fontStyle:"italic", marginBottom:16 }}>
            "The idea is radical in its simplicity: food does not become worthless when it's left over. It only becomes worthless when no one bothers to find it a home."
          </p>
          <p style={{ color:"#4ade80", fontWeight:600, fontSize:13 }}>— The founding philosophy of Vital Victuals</p>
        </motion.blockquote>
      </div>
    </section>
  );
}

// ── LIVE ACTIVITY ─────────────────────────────────────────────────────────────
function LiveActivity() {
  const activities = [
    { initials:"R", name:"Rajan Kumar", action:"Rajan Kumar completed delivery of Temple Prasad to Food for All Foundation", time:"3/5/2026, 1:56:44 pm", bg:"#ef4444" },
    { initials:"S", name:"Sharma Caterers", action:"Sharma Caterers donated 18.5kg of Wedding Banquet Surplus — Biryani & Dal", time:"3/5/2026, 12:56:44 pm", bg:"#6b7280" },
    { initials:"S", name:"Sharma Caterers", action:"Food for All Foundation claimed Temple Prasad from Sharma Caterers", time:"3/5/2026, 12:26:44 pm", bg:"#6b7280" },
    { initials:"S", name:"Sharma Caterers", action:"Sharma Caterers donated 25kg of Temple Prasad — Rice & Kheer", time:"3/5/2026, 12:16:44 pm", bg:"#6b7280" },
    { initials:"A", name:"Annapurna Kitchen", action:"Annapurna Kitchen donated 12kg of cooked rice and dal", time:"3/5/2026, 11:30:00 am", bg:"#16a34a" },
  ];
  return (
    <section style={{ padding:"64px 24px", background:"#fff" }}>
      <div style={{ maxWidth:860, margin:"0 auto" }}>
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          style={{ display:"flex", alignItems:"center", gap:10, marginBottom:28 }}>
          <span style={{ width:12, height:12, background:"#22c55e", borderRadius:"50%", display:"inline-block" }} />
          <h2 style={{ color:"#111827", fontWeight:800, fontSize:22 }}>Live Activity</h2>
        </motion.div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {activities.map((a,i) => (
            <motion.div key={i} initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:i*0.07 }}
              style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"14px 16px", background:"#f9fafb", border:"1px solid #f3f4f6", borderRadius:14 }}>
              <div style={{ width:36, height:36, background:a.bg, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ color:"#fff", fontWeight:700, fontSize:13 }}>{a.initials}</span>
              </div>
              <div>
                <p style={{ color:"#374151", fontSize:13, lineHeight:1.6 }}>
                  <strong>{a.name}</strong> · {a.action.replace(a.name + " · ", "").replace(a.name + " ", "")}
                </p>
                <p style={{ color:"#9ca3af", fontSize:11, marginTop:3 }}>{a.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── HUNGER CRISIS ─────────────────────────────────────────────────────────────
function HungerCrisis() {
  const stats = [
    { val:"194M", label:"Indians undernourished", src:"FAO 2023", color:"#f97316", bg:"rgba(124,45,18,0.3)", border:"rgba(154,52,18,0.4)" },
    { val:"68.7M T", label:"food wasted yearly", src:"NABARD", color:"#eab308", bg:"rgba(113,63,18,0.3)", border:"rgba(133,77,14,0.4)" },
    { val:"#111", label:"Global Hunger Index", src:"GHI 2023 (out of 125)", color:"#f87171", bg:"rgba(127,29,29,0.3)", border:"rgba(153,27,27,0.4)" },
    { val:"40%", label:"food lost before eaten", src:"ASSOCHAM", color:"#c084fc", bg:"rgba(88,28,135,0.3)", border:"rgba(107,33,168,0.4)" },
  ];
  return (
    <section style={{ padding:"96px 24px", background:"#0f172a" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ display:"flex", justifyContent:"center", marginBottom:28 }}>
          <span style={{ border:"1px solid rgba(220,38,38,0.5)", background:"rgba(127,29,29,0.25)", borderRadius:999, padding:"6px 16px", fontSize:13, color:"#f87171", display:"inline-flex", alignItems:"center", gap:8 }}>
            <span style={{ width:8, height:8, background:"#ef4444", borderRadius:"50%", display:"inline-block" }} /> The Hunger Crisis Is Real
          </span>
        </motion.div>

        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ textAlign:"center", marginBottom:16 }}>
          <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:900, color:"#fff", lineHeight:1.2 }}>
            We don't ask for <span style={{ color:"#4ade80" }}>money.</span>
          </h2>
          <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:900, color:"#fff", lineHeight:1.2 }}>
            We ask you to <span style={{ color:"#4ade80" }}>understand.</span>
          </h2>
        </motion.div>

        <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ delay:0.2 }}
          style={{ color:"#6b7280", textAlign:"center", fontSize:14, lineHeight:1.8, maxWidth:600, margin:"0 auto 56px" }}>
          India wastes 68 million tonnes of food every year. 194 million people go to bed hungry. These are not statistics — they are people. Here is what the world's media has been saying.
        </motion.p>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:48 }}>
          {stats.map((s,i) => (
            <motion.div key={i} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}
              style={{ background:s.bg, border:`1px solid ${s.border}`, borderRadius:20, padding:28, textAlign:"center" }}>
              <div style={{ fontSize:"clamp(28px,3vw,40px)", fontWeight:900, color:s.color, marginBottom:6 }}>{s.val}</div>
              <div style={{ color:"#d1d5db", fontSize:12, fontWeight:500, marginBottom:4 }}>{s.label}</div>
              <div style={{ color:"#6b7280", fontSize:11 }}>{s.src}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── VOICES THAT MATTER ────────────────────────────────────────────────────────
function VoicesThatMatter() {
  const quotes = [
    { text:'"We have a moral obligation to ensure that food — the most basic human need — does not go to waste while millions starve."', author:"Dr. Amartya Sen", role:"Nobel Laureate, Economist", border:"#22c55e" },
    { text:'"Food waste is a symptom of a broken system. The solution isn\'t charity — it\'s infrastructure that connects surplus to need, instantly."', author:"FAO Director-General", role:"Food and Agriculture Organisation, UN", border:"#eab308" },
    { text:'"India cannot call itself a growing economy when 3,000 of its children die every day due to malnutrition. The food exists. The will to share it must too."', author:"UNICEF India Report", role:"State of Children in India, 2022", border:"#ef4444" },
  ];
  const ctaItems = [
    { icon:<Icon.Heart style={{ width:22,height:22,color:"#f472b6" }}/>, title:"Donate surplus food", desc:"Any amount, any time", bg:"rgba(131,24,67,0.2)" },
    { icon:<Icon.Users style={{ width:22,height:22,color:"#60a5fa" }}/>, title:"Volunteer", desc:"Deliver, sort, coordinate", bg:"rgba(29,78,216,0.2)" },
    { icon:<Icon.Globe style={{ width:22,height:22,color:"#c084fc" }}/>, title:"Spread awareness", desc:"Share on social media", bg:"rgba(109,40,217,0.2)" },
    { icon:<Icon.Sparkles style={{ width:22,height:22,color:"#fbbf24" }}/>, title:"Refer businesses", desc:"Hotels, caterers, schools", bg:"rgba(120,53,15,0.2)" },
  ];
  return (
    <section style={{ padding:"96px 24px", background:"#0f172a" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          style={{ display:"flex", alignItems:"center", gap:10, marginBottom:28 }}>
          <Icon.Quote style={{ width:18, height:18, color:"#6b7280" }} />
          <h2 style={{ color:"#fff", fontWeight:700, fontSize:20 }}>Voices That Matter</h2>
        </motion.div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, marginBottom:56 }}>
          {quotes.map((q,i) => (
            <motion.div key={i} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.12 }}
              style={{ background:"rgba(30,41,59,0.7)", border:"1px solid #1e293b", borderLeft:`4px solid ${q.border}`, borderRadius:20, padding:28 }}>
              <p style={{ color:"#d1d5db", fontSize:13, lineHeight:1.8, fontStyle:"italic", marginBottom:20 }}>{q.text}</p>
              <p style={{ color:"#fff", fontWeight:700, fontSize:13 }}>{q.author}</p>
              <p style={{ color:"#6b7280", fontSize:11, marginTop:2 }}>{q.role}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA box */}
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          style={{ background:"rgba(22,32,52,0.8)", border:"1px solid #1e293b", borderRadius:28, padding:48, textAlign:"center" }}>
          <h2 style={{ color:"#fff", fontSize:"clamp(22px,3vw,36px)", fontWeight:900, marginBottom:12 }}>You can help — without spending a rupee.</h2>
          <p style={{ color:"#6b7280", fontSize:14, marginBottom:40, maxWidth:500, margin:"0 auto 40px" }}>We will never ask you for money. What we need is your food, your time, your voice, and your network.</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:36 }}>
            {ctaItems.map((item,i) => (
              <div key={i} style={{ background:item.bg, border:"1px solid #1e293b", borderRadius:20, padding:20, textAlign:"center" }}>
                <div style={{ display:"flex", justifyContent:"center", marginBottom:10 }}>{item.icon}</div>
                <p style={{ color:"#fff", fontWeight:600, fontSize:13, marginBottom:4 }}>{item.title}</p>
                <p style={{ color:"#6b7280", fontSize:11 }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <button style={{ background:"#16a34a", color:"#fff", fontWeight:700, fontSize:14, padding:"12px 28px", borderRadius:12, border:"none", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8 }}>
            Donate Food Now <Icon.ArrowRight style={{ width:16, height:16 }} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

// ── NEWS SECTION ──────────────────────────────────────────────────────────────
function NewsSection() {
  const news = [
    { abbr:"TH", src:"The Hindu", srcBg:"#dc2626", cat:"Policy", catColor:"#f9a8d4", catBg:"rgba(131,24,67,0.5)", title:"India ranks 111th on Global Hunger Index — below Nigeria and Pakistan", desc:"The 2023 Global Hunger Index places India in the 'serious' category with a score of 28.7, citing high child wasting and stunting rates.", date:"Oct 2023", img:"https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80" },
    { abbr:"ND", src:"NDTV", srcBg:"#2563eb", cat:"Food Waste", catColor:"#fdba74", catBg:"rgba(124,45,18,0.5)", title:"India's wedding and event industry wastes over 30 lakh meals daily", desc:"A NABARD study estimates that celebrations and corporate events generate food waste that could sustain 12 million people for a full year.", date:"Apr 2024", img:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80" },
    { abbr:"TOI", src:"Times of India", srcBg:"#1d4ed8", cat:"Research", catColor:"#d8b4fe", catBg:"rgba(88,28,135,0.5)", title:"74% of Indian household food waste occurs at the consumer level", desc:"Contrary to popular belief, most of India's food waste happens in homes, restaurants, and canteens — not at farms.", date:"Jan 2024", img:"https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80" },
    { abbr:"WFP", src:"WFP India", srcBg:"#0284c7", cat:"Global", catColor:"#93c5fd", catBg:"rgba(29,78,216,0.5)", title:"World Food Programme: Every 4 seconds, someone dies of hunger globally", desc:"Hunger kills more people than AIDS, malaria, and tuberculosis combined. WFP calls for immediate private sector involvement.", date:"2023", img:"https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&q=80" },
    { abbr:"HT", src:"Hindustan Times", srcBg:"#15803d", cat:"NGO", catColor:"#86efac", catBg:"rgba(20,83,45,0.5)", title:"NGOs report 60% of food received from donors doesn't meet quality standards", desc:"A survey of 200 NGOs across India found most donations arrive too late to serve safely — a problem Vital Victuals is designed to solve.", date:"Mar 2024", img:"https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&q=80" },
    { abbr:"FAO", src:"FAO Report", srcBg:"#0d9488", cat:"Economics", catColor:"#5eead4", catBg:"rgba(19,78,74,0.5)", title:"India loses ₹92,000 crore worth of food annually — more than many nations' GDP", desc:"The FAO's India Food Waste Report 2022 documents economic, environmental, and humanitarian costs of the food crisis.", date:"2022", img:"https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80" },
  ];
  return (
    <section style={{ padding:"96px 24px", background:"#0f172a" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          style={{ display:"flex", alignItems:"center", gap:10, marginBottom:36 }}>
          <Icon.FileText style={{ width:18, height:18, color:"#6b7280" }} />
          <h2 style={{ color:"#fff", fontWeight:700, fontSize:20 }}>From the World's Press</h2>
        </motion.div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
          {news.map((item,i) => (
            <motion.div key={i} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.07 }}
              style={{ background:"rgba(30,41,59,0.7)", border:"1px solid #1e293b", borderRadius:20, overflow:"hidden" }}>
              <div style={{ position:"relative", height:148, overflow:"hidden" }}>
                <img src={item.img} alt={item.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.8),transparent 60%)" }} />
                <div style={{ position:"absolute", top:10, left:10, display:"flex", alignItems:"center", gap:6 }}>
                  <div style={{ width:26, height:26, background:item.srcBg, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ color:"#fff", fontSize:10, fontWeight:900 }}>{item.abbr}</span>
                  </div>
                  <span style={{ color:"#fff", fontSize:11, fontWeight:600 }}>{item.src}</span>
                </div>
                <div style={{ position:"absolute", bottom:10, left:10 }}>
                  <span style={{ background:item.catBg, color:item.catColor, fontSize:10, padding:"3px 8px", borderRadius:6, fontWeight:600 }}>{item.cat}</span>
                </div>
              </div>
              <div style={{ padding:20 }}>
                <h3 style={{ color:"#fff", fontWeight:700, fontSize:13, lineHeight:1.5, marginBottom:8 }}>{item.title}</h3>
                <p style={{ color:"#6b7280", fontSize:11, lineHeight:1.7, marginBottom:14 }}>{item.desc}</p>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ color:"#6b7280", fontSize:11 }}>{item.date}</span>
                  <span style={{ color:"#4ade80", fontSize:11, display:"flex", alignItems:"center", gap:4, cursor:"pointer" }}>
                    <Icon.ExternalLink style={{ width:11, height:11 }} /> Source verified
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FOOD BANKS ────────────────────────────────────────────────────────────────
function FoodBanksSection() {
  const banks = [
    { name:"Annamrita Foundation", loc:"Mumbai, Maharashtra", type:"Mid-Day Meal NGO", typeColor:"#ea580c", typeBg:"#fff7ed", cap:"1,40,000 meals/day", needs:"Rice, dal, vegetables", img:"https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80", tags:[] },
    { name:"Aashraya Sewa Samiti", loc:"West Champaran, Bihar", type:"Rural Community Kitchen", typeColor:"#ca8a04", typeBg:"#fefce8", cap:"500 meals/day", needs:"Grains, cooked food", img:"https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80", tags:[] },
    { name:"Hariyali Jaivik Manch", loc:"Sehore, Madhya Pradesh", type:"Rural Grain Bank", typeColor:"#16a34a", typeBg:"#f0fdf4", cap:"200 families/month", needs:"Dry grains & pulses", img:"https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&q=80", tags:[] },
    { name:"Roti Bank Rajasthan", loc:"Jaipur, Rajasthan", type:"City Food Bank", typeColor:"#db2777", typeBg:"#fdf2f8", cap:"2,000 rotis/day", needs:"Chapati, cooked food", img:"https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80", tags:["Urban"] },
    { name:"Goonj Rural Distribution", loc:"Hinterland, Multiple States", type:"Rural Relief Network", typeColor:"#7c3aed", typeBg:"#faf5ff", cap:"5,000 villages/year", needs:"Packaged dry food", img:"https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=400&q=80", tags:["Rural","Verified"] },
    { name:"Jan Ahar Community Mess", loc:"Lucknow, Uttar Pradesh", type:"Government-NGO Kitchen", typeColor:"#0d9488", typeBg:"#f0fdfa", cap:"8,000 meals/day", needs:"Vegetables, grains", img:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80", tags:["Urban","Verified"] },
  ];
  return (
    <section style={{ padding:"96px 24px", background:"#f8fafc" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ marginBottom:48 }}>
          <p style={{ color:"#16a34a", fontSize:11, fontWeight:700, letterSpacing:2, marginBottom:8 }}>FOOD BANKS NEAR YOU</p>
          <h2 style={{ fontSize:"clamp(24px,3.5vw,40px)", fontWeight:900, color:"#111827" }}>Verified Partners Ready to Receive</h2>
        </motion.div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24, marginBottom:28 }}>
          {banks.map((b,i) => (
            <motion.div key={i} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.08 }}
              style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:20, overflow:"hidden", boxShadow:"0 1px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ position:"relative", height:130, overflow:"hidden" }}>
                <img src={b.img} alt={b.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.75),transparent 60%)" }} />
                <div style={{ position:"absolute", bottom:10, left:12 }}>
                  <p style={{ color:"#fff", fontWeight:700, fontSize:13 }}>{b.name}</p>
                  <p style={{ color:"rgba(255,255,255,0.8)", fontSize:10, display:"flex", alignItems:"center", gap:4 }}>
                    <Icon.MapPin style={{ width:10, height:10 }} /> {b.loc}
                  </p>
                </div>
                {b.tags.length > 0 && (
                  <div style={{ position:"absolute", top:10, left:10, display:"flex", gap:6 }}>
                    {b.tags.map((t,j) => (
                      <span key={j} style={{ background: t==="Verified"?"#16a34a":t==="Urban"?"#2563eb":"#ea580c", color:"#fff", fontSize:10, padding:"3px 8px", borderRadius:999, fontWeight:600, display:"flex", alignItems:"center", gap:3 }}>
                        {t==="Verified" && <Icon.CheckCircle style={{ width:10, height:10 }} />} {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ padding:20 }}>
                <span style={{ background:b.typeBg, color:b.typeColor, fontSize:11, padding:"4px 10px", borderRadius:999, fontWeight:600, display:"inline-block", marginBottom:12 }}>{b.type}</span>
                <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:16 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <Icon.Users style={{ width:12, height:12, color:"#9ca3af" }} />
                    <span style={{ color:"#6b7280", fontSize:12 }}>Capacity: <strong style={{ color:"#374151" }}>{b.cap}</strong></span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <Icon.Heart style={{ width:12, height:12, color:"#9ca3af" }} />
                    <span style={{ color:"#6b7280", fontSize:12 }}>Needs: <strong style={{ color:"#374151" }}>{b.needs}</strong></span>
                  </div>
                </div>
                <button style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:10, padding:"9px 0", color:"#16a34a", fontWeight:600, fontSize:12, background:"none", cursor:"pointer" }}>
                  Donate to This Bank
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Register CTA */}
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          style={{ background:"#0f172a", borderRadius:24, padding:"40px 40px", display:"grid", gridTemplateColumns:"1fr auto", gap:40, alignItems:"center" }}>
          <div>
            <span style={{ border:"1px solid #166534", color:"#4ade80", fontSize:11, padding:"4px 12px", borderRadius:999, display:"inline-flex", alignItems:"center", gap:6, marginBottom:14 }}>
              <Icon.Globe style={{ width:11, height:11 }} /> For Food Banks &amp; NGOs
            </span>
            <h3 style={{ color:"#fff", fontSize:22, fontWeight:800, marginBottom:8 }}>Register Your Food Bank</h3>
            <p style={{ color:"#6b7280", fontSize:13, lineHeight:1.7, marginBottom:14, maxWidth:480 }}>Whether you're a village community kitchen or a city-scale NGO — join our network and receive verified surplus food deliveries directly to your door. Free to join. No paperwork.</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {["NGOs","Rural Kitchens","Animal Shelters","School Canteens","Grain Banks"].map(t => (
                <span key={t} style={{ border:"1px solid #374151", color:"#9ca3af", fontSize:11, padding:"4px 10px", borderRadius:999 }}>{t}</span>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10, minWidth:200 }}>
            <button style={{ background:"#16a34a", color:"#fff", fontWeight:700, fontSize:13, padding:"12px 20px", borderRadius:12, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              <Icon.Globe style={{ width:14, height:14 }} /> Register Food Bank
            </button>
            <button style={{ border:"1px solid #374151", color:"#d1d5db", fontWeight:600, fontSize:13, padding:"12px 20px", borderRadius:12, background:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              <Icon.MapPin style={{ width:14, height:14 }} /> Browse Available Food
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── TESTIMONIALS ──────────────────────────────────────────────────────────────
function Testimonials() {
  const reviews = [
    { stars:5, text:'"Vital Victuals changed how we source food. We now receive 3–4 donations daily with zero logistics hassle. The geo-routing is incredibly accurate — every pickup is within 5 km."', name:"Priya Sharma", role:"Annapurna NGO, Delhi", initials:"PS", bg:"#db2777" },
    { stars:5, text:'"After every event we used to throw away 50+ kg of food. Now I donate it in 2 clicks. The AI classifies freshness automatically — I\'ve never had a rejected donation."', name:"Rahul Mehta", role:"Wedding Caterer, Mumbai", initials:"RM", bg:"#2563eb" },
    { stars:5, text:'"Being a volunteer is so rewarding. The app shows me optimized routes, I get ETA updates, and donors always rate me 5 stars. Best social impact experience I\'ve had."', name:"Kavitha Rao", role:"Volunteer, Bangalore", initials:"KR", bg:"#16a34a" },
    { stars:5, text:'"Our 200 animals now eat regularly thanks to Vital Victuals. The freshness classification is spot-on — we only receive food that\'s safe for animals. Incredible platform!"', name:"Mohammad Farhan", role:"Animal Shelter, Hyderabad", initials:"MF", bg:"#ea580c" },
    { stars:5, text:'"Hindi support makes it so easy. Shree Jagannatha AI guides me step by step in Hindi and I\'ve donated 100+ kg of dal and rice through it. Wonderful service!"', name:"Sunita Devi", role:"Community Kitchen, Patna", initials:"SD", bg:"#7c3aed" },
    { stars:5, text:'"The live tracking feature is brilliant. I can see exactly where my donation goes and the NGO gets a notification when food is picked up. True transparency in action."', name:"Arjun Kapoor", role:"Restaurant Owner, Pune", initials:"AK", bg:"#0d9488" },
  ];
  return (
    <section style={{ padding:"96px 24px", background:"#0f172a" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ textAlign:"center", marginBottom:56 }}>
          <h2 style={{ color:"#fff", fontSize:"clamp(24px,3.5vw,40px)", fontWeight:900, marginBottom:8 }}>What Our Community Says</h2>
          {/* Rating */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginTop:12 }}>
            <span style={{ color:"#f59e0b", fontSize:40, fontWeight:900 }}>4.9</span>
            <div>
              <div style={{ display:"flex", gap:2 }}>
                {[1,2,3,4,5].map(s => <Icon.Star key={s} style={{ width:18, height:18, color:"#f59e0b" }} />)}
              </div>
              <p style={{ color:"#6b7280", fontSize:12, marginTop:2 }}>Based on 200+ reviews</p>
            </div>
          </div>
        </motion.div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
          {reviews.map((r,i) => (
            <motion.div key={i} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.08 }}
              style={{ background:"rgba(30,41,59,0.7)", border:"1px solid #1e293b", borderRadius:20, padding:24 }}>
              <div style={{ display:"flex", gap:2, marginBottom:12 }}>
                {[1,2,3,4,5].map(s => <Icon.Star key={s} style={{ width:14, height:14, color:"#f59e0b" }} />)}
              </div>
              <p style={{ color:"#d1d5db", fontSize:13, lineHeight:1.8, fontStyle:"italic", marginBottom:18 }}>{r.text}</p>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:36, height:36, background:r.bg, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ color:"#fff", fontWeight:700, fontSize:12 }}>{r.initials}</span>
                </div>
                <div>
                  <p style={{ color:"#fff", fontWeight:600, fontSize:13 }}>{r.name}</p>
                  <p style={{ color:"#6b7280", fontSize:11 }}>{r.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FOUNDERS / TEAM ───────────────────────────────────────────────────────────
function FoundersSection() {
  const cards = [
    { icon:"🌱", title:"Our Mission", desc:"India wastes ~68 million tonnes of food every year while 200 million people go hungry. We built the platform to fix this gap permanently." },
    { icon:"💡", title:"The Idea", desc:"Shubham & Himanshu's core insight: the problem was never shortage of food — it was always shortage of connection. Build the bridge, and food finds its way." },
    { icon:"🚀", title:"Where We're Headed", desc:"City-by-city across India with AI forecasting, government partnerships, and a clean water mission funded by recycling revenue." },
  ];
  return (
    <section style={{ padding:"96px 24px", background:"#0f172a" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        {/* Appreciate the idea */}
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          style={{ background:"rgba(30,41,59,0.6)", border:"1px solid #1e293b", borderRadius:24, padding:40, textAlign:"center", marginBottom:28 }}>
          <div style={{ width:48, height:48, background:"rgba(22,163,74,0.2)", border:"1px solid #166534", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:20 }}>✨</div>
          <h3 style={{ color:"#fff", fontWeight:800, fontSize:22, marginBottom:12 }}>Appreciate the idea</h3>
          <p style={{ color:"#9ca3af", fontSize:14, lineHeight:1.8, maxWidth:680, margin:"0 auto 16px" }}>
            What Shubham and Himanshu created is not just an app — it is a new way of thinking about food. The idea that every grain of rice, every piece of bread, every drop of oil has value — not just economic value, but moral value. That wasting food in a country where millions go hungry is not just inefficiency; it is something we can and must fix together.
          </p>
          <p style={{ color:"#4ade80", fontSize:13, fontWeight:600 }}>Every donation on this platform is proof that they were right.</p>
        </motion.div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, marginBottom:40 }}>
          {cards.map((c,i) => (
            <motion.div key={i} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.12 }}
              style={{ background:"rgba(30,41,59,0.5)", border:"1px solid #1e293b", borderRadius:20, padding:28 }}>
              <div style={{ fontSize:28, marginBottom:12 }}>{c.icon}</div>
              <h4 style={{ color:"#fff", fontWeight:700, fontSize:15, marginBottom:8 }}>{c.title}</h4>
              <p style={{ color:"#6b7280", fontSize:12, lineHeight:1.7 }}>{c.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Closing quote */}
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          style={{ background:"rgba(30,41,59,0.5)", border:"1px solid #1e293b", borderRadius:24, padding:40, textAlign:"center" }}>
          <p style={{ color:"#fff", fontSize:"clamp(16px,2vw,22px)", fontWeight:700, lineHeight:1.6, fontStyle:"italic", marginBottom:16 }}>
            "We have seen hunger. We have seen the seriousness of food scarcity. That is why we act — not just for today, but to build a world where no basic need goes unmet."
          </p>
          <p style={{ color:"#4ade80", fontSize:13, fontWeight:600 }}>— Himanshu Gupta, CEO &amp; Co-Founder, Vital Victuals</p>
        </motion.div>
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function Footer() {
  const socials = [
    { icon:<Icon.Instagram style={{ width:16,height:16 }}/> },
    { icon:<Icon.Youtube style={{ width:16,height:16 }}/> },
    { icon:<Icon.Linkedin style={{ width:16,height:16 }}/> },
    { icon:<Icon.Twitter style={{ width:16,height:16 }}/> },
    { icon:<Icon.Facebook style={{ width:16,height:16 }}/> },
  ];
  return (
    <footer style={{ background:"#0a0f1a", padding:"64px 24px 32px", borderTop:"1px solid #1e293b" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 2fr", gap:48, marginBottom:48 }}>
          {/* Brand */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <div style={{ width:32, height:32, background:"rgba(255,255,255,0.1)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon.Leaf style={{ width:16, height:16, color:"#4ade80" }} />
              </div>
              <span style={{ color:"#fff", fontWeight:700, fontSize:16 }}>Vital Victuals</span>
            </div>
            <p style={{ color:"#6b7280", fontSize:13, lineHeight:1.7, marginBottom:20 }}>Give your surplus food a purpose. Fighting food waste together across India.</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {socials.map((s,i) => (
                <button key={i} style={{ width:36, height:36, background:"rgba(255,255,255,0.07)", border:"1px solid #1e293b", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:"#9ca3af", cursor:"pointer" }}>
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <p style={{ color:"#fff", fontWeight:700, fontSize:13, marginBottom:16, letterSpacing:1 }}>LINKS</p>
            {["Home","Get Started","Sign In","Browse Listings","Impact Dashboard"].map(l => (
              <p key={l} style={{ color:"#6b7280", fontSize:13, marginBottom:10, cursor:"pointer" }}>{l}</p>
            ))}
          </div>

          {/* Team */}
          <div>
            <p style={{ color:"#fff", fontWeight:700, fontSize:13, marginBottom:16, letterSpacing:1 }}>TEAM</p>
            {[["Himanshu Gupta","CEO"],["Shyam","COO"],["Shubham","CTO"]].map(([n,r]) => (
              <p key={n} style={{ color:"#6b7280", fontSize:13, marginBottom:10 }}>{n} <span style={{ color:"#4b5563" }}>{r}</span></p>
            ))}
          </div>

          {/* Contact */}
          <div>
            <p style={{ color:"#fff", fontWeight:700, fontSize:13, marginBottom:16, letterSpacing:1 }}>CONTACT</p>
            <div style={{ display:"flex", gap:8, marginBottom:10, alignItems:"flex-start" }}>
              <Icon.MapPin style={{ width:14, height:14, color:"#4ade80", marginTop:2, flexShrink:0 }} />
              <p style={{ color:"#6b7280", fontSize:12, lineHeight:1.7 }}>111, Shree Mahaveer Ji (Ground Floor), Shiv Mandir Road, Ramnagar, West Champaran, Bihar — 845106</p>
            </div>
            <div style={{ display:"flex", gap:8, marginBottom:10, alignItems:"center" }}>
              <Icon.Phone style={{ width:13, height:13, color:"#4ade80", flexShrink:0 }} />
              <p style={{ color:"#6b7280", fontSize:12 }}>+91 8434939227</p>
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <Icon.Mail style={{ width:13, height:13, color:"#4ade80", flexShrink:0 }} />
              <p style={{ color:"#6b7280", fontSize:12 }}>vitalvictuals.team@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop:"1px solid #1e293b", paddingTop:24, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <p style={{ color:"#4b5563", fontSize:12 }}>© 2026 Vital Victuals · Himanshu Gupta, Shyam &amp; Shubham · All rights reserved.</p>
          <div style={{ display:"flex", gap:16 }}>
            {["Instagram","YouTube","X.com","LinkedIn","WhatsApp","Telegram"].map(s => (
              <span key={s} style={{ color:"#4b5563", fontSize:11, cursor:"pointer" }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <StatsBanner />
      <PhilosophySection />
      <AlgorithmsSection />
      <HowItWorks />
      <WhoDonates />
      <MissionSection />
      <CorePhilosophy />
      <LiveActivity />
      <HungerCrisis />
    </>
  );
}