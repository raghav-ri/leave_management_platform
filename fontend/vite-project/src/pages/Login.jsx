import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/axios";
import {
  Mail, Lock, ArrowRight, Sparkles, Shield,
  CalendarCheck, Clock, CheckCircle, Users, TrendingUp
} from "lucide-react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);} }
  @keyframes fadeIn   { from{opacity:0;}to{opacity:1;} }
  @keyframes floatY   { 0%,100%{transform:translateY(0);}50%{transform:translateY(-14px);} }
  @keyframes floatY2  { 0%,100%{transform:translateY(0);}50%{transform:translateY(-9px);} }
  @keyframes floatY3  { 0%,100%{transform:translateY(0);}50%{transform:translateY(-18px);} }
  @keyframes pulse-gold {
    0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,0.4);}
    50%{box-shadow:0 0 0 10px rgba(212,175,55,0);}
  }
  @keyframes spin-slow { to { transform: rotate(360deg); } }
  @keyframes shimmer-bar {
    0%{transform:translateX(-100%);}100%{transform:translateX(400%);}
  }

  /* ── ROOT LAYOUT ── */
  .auth-root {
    display: flex;
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    background: #0a0c14;
  }

  /* ══════════════════════════════════
     LEFT PANEL  — 70%
  ══════════════════════════════════ */
  .left-panel {
    flex: 0 0 70%;
    position: relative;
    overflow: hidden;
    background: linear-gradient(145deg, #0d0f1e 0%, #121828 45%, #0b1020 100%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 44px 56px 40px;
  }

  /* subtle grid */
  .left-panel::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(212,175,55,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(212,175,55,0.04) 1px, transparent 1px);
    background-size: 56px 56px;
    pointer-events: none;
  }

  /* gold radial glow top-right */
  .left-panel::after {
    content: '';
    position: absolute; top: -120px; right: -80px;
    width: 520px; height: 520px; border-radius: 50%;
    background: radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 65%);
    pointer-events: none;
  }

  /* blue radial glow bottom-left */
  .lp-glow-bl {
    position: absolute; bottom: -100px; left: -80px;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(30,60,140,0.2) 0%, transparent 65%);
    pointer-events: none;
  }

  /* ── Brand bar top ── */
  .lp-brand {
    display: flex; align-items: center; gap: 10px;
    position: relative; z-index: 2;
    animation: fadeIn 0.5s ease both;
  }
  .lp-brand-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, #d4af37, #f5d060);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 16px rgba(212,175,55,0.3);
  }
  .lp-brand-name {
    font-family: 'Playfair Display', serif;
    font-size: 16px; font-weight: 700; color: #f0e6c8;
    letter-spacing: -0.01em;
  }
  .lp-brand-tag {
    font-size: 10px; font-weight: 600; color: rgba(212,175,55,0.4);
    letter-spacing: 0.15em; text-transform: uppercase;
  }

  /* ── Center hero area ── */
  .lp-hero {
    position: relative; z-index: 2;
    flex: 1;
    display: flex; flex-direction: column;
    justify-content: center;
    padding: 40px 0;
  }

  .lp-tagline-sup {
    font-size: 11px; font-weight: 600;
    color: rgba(212,175,55,0.5);
    letter-spacing: 0.2em; text-transform: uppercase;
    margin-bottom: 18px;
    display: flex; align-items: center; gap: 10px;
  }
  .lp-tagline-sup::before {
    content: ''; display: block;
    width: 28px; height: 2px;
    background: linear-gradient(90deg,#d4af37,transparent);
  }

  .lp-heading {
    font-family: 'Playfair Display', serif;
    font-size: clamp(32px, 3.8vw, 52px);
    font-weight: 900; color: #f0e6c8;
    letter-spacing: -0.03em; line-height: 1.1;
    margin-bottom: 22px;
  }
  .lp-heading span { color: #d4af37; }

  .lp-desc {
    font-size: 15px; color: rgba(240,230,200,0.38);
    line-height: 1.75; max-width: 520px;
    margin-bottom: 44px;
  }

  /* ── Feature cards row ── */
  .lp-features {
    display: flex; gap: 14px; flex-wrap: wrap;
    margin-bottom: 48px;
  }
  .feat-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(212,175,55,0.12);
    border-radius: 16px; padding: 18px 20px;
    min-width: 145px; flex: 1;
    transition: transform 0.25s, border-color 0.25s;
    cursor: default;
  }
  .feat-card:hover {
    transform: translateY(-3px);
    border-color: rgba(212,175,55,0.28);
  }
  .feat-icon {
    width: 34px; height: 34px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 12px;
  }
  .feat-label {
    font-size: 12px; font-weight: 700; color: rgba(240,230,200,0.7);
    letter-spacing: 0.02em; margin-bottom: 3px;
  }
  .feat-sub { font-size: 11px; color: rgba(240,230,200,0.3); line-height: 1.5; }

  /* ── Floating stat orbs ── */
  .stat-orbs {
    position: absolute; right: 0; top: 50%; transform: translateY(-50%);
    display: flex; flex-direction: column; gap: 16px;
    pointer-events: none;
  }
  .stat-orb {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(212,175,55,0.15);
    border-radius: 14px; padding: 14px 18px;
    backdrop-filter: blur(8px);
    min-width: 130px;
  }
  .stat-orb:nth-child(1) { animation: floatY 5s ease-in-out infinite; }
  .stat-orb:nth-child(2) { animation: floatY2 6.5s ease-in-out infinite 1s; }
  .stat-orb:nth-child(3) { animation: floatY3 4.5s ease-in-out infinite 2s; }

  .stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 24px; font-weight: 900; color: #d4af37;
    letter-spacing: -0.02em; line-height: 1;
    margin-bottom: 3px;
  }
  .stat-lbl { font-size: 11px; color: rgba(240,230,200,0.35); font-weight: 500; }

  /* ── Progress bars ── */
  .lp-stats-row {
    display: flex; gap: 28px; flex-wrap: wrap;
  }
  .stat-bar-wrap { flex: 1; min-width: 120px; }
  .stat-bar-label {
    display: flex; justify-content: space-between;
    font-size: 11px; color: rgba(240,230,200,0.4); font-weight: 500;
    margin-bottom: 6px;
  }
  .stat-bar-track {
    height: 4px; border-radius: 2px;
    background: rgba(255,255,255,0.07);
    overflow: hidden; position: relative;
  }
  .stat-bar-fill {
    height: 100%; border-radius: 2px;
    background: linear-gradient(90deg, #d4af37, #f5d060);
    position: relative;
  }
  .stat-bar-fill::after {
    content: '';
    position: absolute; top:0; left:0; bottom:0; width:40px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
    animation: shimmer-bar 2.5s ease-in-out infinite;
  }

  /* ── Left footer ── */
  .lp-footer {
    position: relative; z-index: 2;
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;
  }
  .lp-footer-copy {
    font-size: 11px; color: rgba(240,230,200,0.2);
    letter-spacing: 0.04em;
  }
  .lp-footer-links { display: flex; gap: 18px; }
  .lp-footer-link {
    font-size: 11px; color: rgba(240,230,200,0.18);
    text-decoration: none; letter-spacing: 0.03em;
    transition: color 0.2s;
  }
  .lp-footer-link:hover { color: rgba(212,175,55,0.55); }

  /* ══════════════════════════════════
     RIGHT PANEL — 30%
  ══════════════════════════════════ */
  .right-panel {
    flex: 0 0 30%;
    background: #0f111e;
    border-left: 1px solid rgba(212,175,55,0.1);
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .rp-form-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 48px 36px 32px;
  }

  /* ── Form top logo ── */
  .rp-logo {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 40px;
    animation: fadeUp 0.4s ease both;
  }
  .rp-logo-icon {
    width: 38px; height: 38px; border-radius: 11px;
    background: linear-gradient(135deg, #d4af37, #f5d060);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 16px rgba(212,175,55,0.35);
    animation: pulse-gold 3s ease-in-out infinite;
  }
  .rp-logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 14px; font-weight: 700; color: #f0e6c8;
  }
  .rp-logo-sub { font-size: 10px; color: rgba(212,175,55,0.4); letter-spacing: 0.06em; }

  /* ── Heading ── */
  .rp-heading {
    font-family: 'Playfair Display', serif;
    font-size: 26px; font-weight: 900; color: #f0e6c8;
    letter-spacing: -0.025em; margin-bottom: 6px;
    animation: fadeUp 0.4s ease 0.05s both;
  }
  .rp-sub {
    font-size: 13px; color: rgba(240,230,200,0.32);
    margin-bottom: 36px; line-height: 1.6;
    animation: fadeUp 0.4s ease 0.08s both;
  }

  /* ── Inputs ── */
  .rp-field { margin-bottom: 16px; animation: fadeUp 0.4s ease 0.1s both; }
  .rp-label {
    display: block; font-size: 10px; font-weight: 700;
    color: rgba(212,175,55,0.55); letter-spacing: 0.12em;
    text-transform: uppercase; margin-bottom: 7px;
  }
  .rp-input-wrap { position: relative; }
  .rp-input-icon {
    position: absolute; left: 14px; top: 50%;
    transform: translateY(-50%); pointer-events: none;
  }
  .rp-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(212,175,55,0.18);
    border-radius: 11px;
    padding: 13px 14px 13px 42px;
    color: #f0e6c8; font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    outline: none; transition: all 0.3s ease;
  }
  .rp-input::placeholder { color: rgba(240,230,200,0.2); }
  .rp-input:focus {
    border-color: rgba(212,175,55,0.6);
    background: rgba(212,175,55,0.05);
    box-shadow: 0 0 0 3px rgba(212,175,55,0.08);
  }

  /* ── Submit button ── */
  .rp-btn {
    width: 100%; margin-top: 24px; margin-bottom: 0;
    background: linear-gradient(135deg, #d4af37 0%, #f5d060 50%, #b8963e 100%);
    background-size: 200% auto;
    color: #1a1508; border: none; border-radius: 11px;
    padding: 14px; font-size: 13px; font-weight: 700;
    font-family: 'DM Sans', sans-serif; letter-spacing: 0.06em;
    text-transform: uppercase; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 9px;
    box-shadow: 0 4px 18px rgba(212,175,55,0.28), inset 0 1px 0 rgba(255,255,255,0.25);
    transition: all 0.4s ease;
    animation: fadeUp 0.4s ease 0.18s both;
  }
  .rp-btn:hover:not(:disabled) {
    background-position: right center;
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(212,175,55,0.42);
  }
  .rp-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ── Divider ── */
  .rp-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(212,175,55,0.18), transparent);
    margin: 28px 0;
  }

  /* ── Link ── */
  .rp-link-text { font-size: 12px; color: rgba(240,230,200,0.28); text-align: center; }
  .rp-link { color: #d4af37; font-weight: 600; text-decoration: none; transition: color 0.2s; }
  .rp-link:hover { color: #f5d060; }

  /* ── Right footer ── */
  .rp-footer {
    padding: 20px 36px;
    border-top: 1px solid rgba(212,175,55,0.08);
    display: flex; flex-direction: column; align-items: center; gap: 8px;
  }
  .rp-footer-copy {
    font-size: 10px; color: rgba(212,175,55,0.28);
    letter-spacing: 0.07em; font-weight: 500;
    display: flex; align-items: center; gap: 5px;
  }
  .rp-footer-links { display: flex; gap: 14px; }
  .rp-footer-link {
    font-size: 10px; color: rgba(240,230,200,0.15);
    text-decoration: none; letter-spacing: 0.03em; transition: color 0.2s;
  }
  .rp-footer-link:hover { color: rgba(212,175,55,0.5); }

  /* Responsive: stack on small screens */
  @media (max-width: 900px) {
    .left-panel { display: none; }
    .right-panel { flex: 1; border-left: none; }
  }
`;

const features = [
  { icon: CalendarCheck, color: "#d4af37", bg: "rgba(212,175,55,0.12)", label: "Leave Tracking", sub: "Real-time status updates on all requests" },
  { icon: Clock,         color: "#60a5fa", bg: "rgba(96,165,250,0.12)", label: "Pending Alerts", sub: "Instant notifications for approvals" },
  { icon: Users,         color: "#4ade80", bg: "rgba(74,222,128,0.1)",  label: "Team Overview", sub: "Monitor team availability at a glance" },
  { icon: TrendingUp,    color: "#f472b6", bg: "rgba(244,114,182,0.1)", label: "Analytics",     sub: "Leave trends and usage insights" },
];

const stats = [
  { num: "98%", lbl: "Approval Rate" },
  { num: "2.4k", lbl: "Active Users" },
  { num: "14s",  lbl: "Avg. Response" },
];

const bars = [
  { label: "Leave Approvals", val: "87%", width: 87 },
  { label: "On-time Reviews", val: "94%", width: 94 },
  { label: "Employee Satisfaction", val: "92%", width: 92 },
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("name", res.data.user.name || "");
      toast.success("Welcome back!");
      const { role } = res.data.user;
      if (role === "admin") navigate("/admin");
      else if (role === "manager") navigate("/manager");
      else navigate("/employee");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <>
      <style>{css}</style>
      <div className="auth-root">

        {/* ══ LEFT PANEL 70% ══ */}
        <div className="left-panel">
          <div className="lp-glow-bl" />

          {/* Brand */}
          <div className="lp-brand">
            <div className="lp-brand-icon">
              <Shield size={18} color="#1a1508" strokeWidth={2.5} />
            </div>
            <div>
              <div className="lp-brand-name">HR Leave Portal</div>
              <div className="lp-brand-tag">Enterprise Edition</div>
            </div>
          </div>

          {/* Hero content */}
          <div className="lp-hero">
            <div className="lp-tagline-sup">Workforce Management Platform</div>
            <h1 className="lp-heading">
              Streamline Your<br />
              <span>Leave Management</span><br />
              Effortlessly
            </h1>
            <p className="lp-desc">
              A unified platform for employees, managers, and HR admins to handle leave requests,
              approvals, and workforce planning — all in one elegant dashboard.
            </p>

            {/* Feature cards */}
            <div className="lp-features">
              {features.map(({ icon: Icon, color, bg, label, sub }) => (
                <div key={label} className="feat-card">
                  <div className="feat-icon" style={{ background: bg }}>
                    <Icon size={16} color={color} />
                  </div>
                  <div className="feat-label">{label}</div>
                  <div className="feat-sub">{sub}</div>
                </div>
              ))}
            </div>

            {/* Progress bars */}
            <div className="lp-stats-row">
              {bars.map(b => (
                <div key={b.label} className="stat-bar-wrap">
                  <div className="stat-bar-label"><span>{b.label}</span><span style={{ color:"#d4af37" }}>{b.val}</span></div>
                  <div className="stat-bar-track">
                    <div className="stat-bar-fill" style={{ width: `${b.width}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Floating stat orbs — right side */}
            <div className="stat-orbs">
              {stats.map(s => (
                <div key={s.lbl} className="stat-orb">
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-lbl">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Left footer */}
          <div className="lp-footer">
            <span className="lp-footer-copy">© {new Date().getFullYear()} HR Leave Portal. All rights reserved.</span>
            <div className="lp-footer-links">
              {["Privacy Policy", "Terms of Service", "Support"].map(item => (
                <a key={item} href="#" className="lp-footer-link">{item}</a>
              ))}
            </div>
          </div>
        </div>

        {/* ══ RIGHT PANEL 30% ══ */}
        <div className="right-panel">
          <div className="rp-form-area">

            {/* Mini logo */}
            <div className="rp-logo">
              <div className="rp-logo-icon">
                <Shield size={17} color="#1a1508" strokeWidth={2.5} />
              </div>
              <div>
                <div className="rp-logo-text">HR Leave Portal</div>
                <div className="rp-logo-sub">Secure Access</div>
              </div>
            </div>

            <div className="rp-heading">Welcome Back</div>
            <p className="rp-sub">Sign in to access your HR dashboard</p>

            {/* Email */}
            <div className="rp-field">
              <label className="rp-label">Email Address</label>
              <div className="rp-input-wrap">
                <Mail size={14} color="rgba(212,175,55,0.4)" className="rp-input-icon" />
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="rp-input"
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>

            {/* Password */}
            <div className="rp-field" style={{ marginBottom: 0 }}>
              <label className="rp-label">Password</label>
              <div className="rp-input-wrap">
                <Lock size={14} color="rgba(212,175,55,0.4)" className="rp-input-icon" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="rp-input"
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>

            <button className="rp-btn" onClick={handleLogin} disabled={loading}>
              {loading ? "Authenticating..." : <><span>Sign In</span><ArrowRight size={15} strokeWidth={2.5} /></>}
            </button>

            <div className="rp-divider" />

            <p className="rp-link-text">
              New to the platform?{" "}
              <a href="/register" className="rp-link">Create an account</a>
            </p>
          </div>

          {/* Right footer — fixed at bottom of panel */}
          <footer className="rp-footer">
            <div className="rp-footer-copy">
              <Sparkles size={10} color="rgba(212,175,55,0.4)" />
              © {new Date().getFullYear()} HR Leave Portal
            </div>
            <div className="rp-footer-links">
              {["Privacy", "Terms", "Support"].map(item => (
                <a key={item} href="#" className="rp-footer-link">{item}</a>
              ))}
            </div>
          </footer>
        </div>

      </div>
    </>
  );
}