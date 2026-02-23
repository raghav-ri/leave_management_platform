import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import {
  User, Mail, Lock, ArrowRight, Sparkles, Shield,
  CalendarCheck, Clock, CheckCircle, Users, Star, Zap
} from "lucide-react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp  { from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);} }
  @keyframes fadeIn  { from{opacity:0;}to{opacity:1;} }
  @keyframes floatY  { 0%,100%{transform:translateY(0);}50%{transform:translateY(-12px);} }
  @keyframes floatY2 { 0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);} }
  @keyframes floatY3 { 0%,100%{transform:translateY(0);}50%{transform:translateY(-16px);} }
  @keyframes pulse-gold { 0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,0.4);}50%{box-shadow:0 0 0 10px rgba(212,175,55,0);} }
  @keyframes shimmer-bar { 0%{transform:translateX(-100%);}100%{transform:translateX(400%);} }
  @keyframes tick-in { from{opacity:0;transform:scale(0.5);}to{opacity:1;transform:scale(1);} }

  /* ── ROOT ── */
  .auth-root {
    display: flex; min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    background: #0a0c14;
  }

  /* ══ LEFT PANEL 70% ══ */
  .left-panel {
    flex: 0 0 70%;
    position: relative; overflow: hidden;
    background: linear-gradient(145deg, #0d0f1e 0%, #121828 45%, #0b1020 100%);
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 44px 56px 40px;
  }
  .left-panel::before {
    content: ''; position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(212,175,55,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(212,175,55,0.04) 1px, transparent 1px);
    background-size: 56px 56px; pointer-events: none;
  }
  .left-panel::after {
    content: ''; position: absolute; top: -120px; left: -80px;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(212,175,55,0.09) 0%, transparent 65%);
    pointer-events: none;
  }
  .lp-glow-br {
    position: absolute; bottom: -100px; right: -80px;
    width: 480px; height: 480px; border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 65%);
    pointer-events: none;
  }

  /* Brand */
  .lp-brand {
    display: flex; align-items: center; gap: 10px;
    position: relative; z-index: 2; animation: fadeIn 0.5s ease both;
  }
  .lp-brand-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, #d4af37, #f5d060);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 16px rgba(212,175,55,0.3);
  }
  .lp-brand-name { font-family:'Playfair Display',serif; font-size:16px; font-weight:700; color:#f0e6c8; }
  .lp-brand-tag  { font-size:10px; font-weight:600; color:rgba(212,175,55,0.4); letter-spacing:0.15em; text-transform:uppercase; }

  /* Hero */
  .lp-hero {
    position: relative; z-index: 2; flex: 1;
    display: flex; flex-direction: column; justify-content: center;
    padding: 40px 0;
  }
  .lp-tagline-sup {
    font-size: 11px; font-weight: 600; color: rgba(212,175,55,0.5);
    letter-spacing: 0.2em; text-transform: uppercase;
    margin-bottom: 18px; display: flex; align-items: center; gap: 10px;
  }
  .lp-tagline-sup::before {
    content: ''; display: block; width: 28px; height: 2px;
    background: linear-gradient(90deg,#d4af37,transparent);
  }
  .lp-heading {
    font-family: 'Playfair Display', serif;
    font-size: clamp(30px, 3.5vw, 48px);
    font-weight: 900; color: #f0e6c8;
    letter-spacing: -0.03em; line-height: 1.12; margin-bottom: 20px;
  }
  .lp-heading span { color: #d4af37; }
  .lp-desc {
    font-size: 15px; color: rgba(240,230,200,0.37);
    line-height: 1.75; max-width: 500px; margin-bottom: 40px;
  }

  /* Steps / onboarding visual */
  .lp-steps { display: flex; flex-direction: column; gap: 16px; margin-bottom: 44px; }
  .step-row {
    display: flex; align-items: flex-start; gap: 16px;
    padding: 16px 18px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(212,175,55,0.1);
    border-radius: 14px;
    transition: border-color 0.25s, transform 0.25s;
    cursor: default;
  }
  .step-row:hover { border-color: rgba(212,175,55,0.24); transform: translateX(4px); }
  .step-num {
    width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #d4af37, #f5d060);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 800; color: #1a1508;
    box-shadow: 0 2px 10px rgba(212,175,55,0.3);
    margin-top: 1px;
  }
  .step-title { font-size: 13px; font-weight: 700; color: rgba(240,230,200,0.8); margin-bottom: 3px; }
  .step-desc  { font-size: 12px; color: rgba(240,230,200,0.32); line-height: 1.55; }

  /* Floating stat orbs */
  .stat-orbs {
    position: absolute; right: 0; top: 50%; transform: translateY(-50%);
    display: flex; flex-direction: column; gap: 14px; pointer-events: none;
  }
  .stat-orb {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(212,175,55,0.14);
    border-radius: 14px; padding: 13px 17px; backdrop-filter: blur(8px); min-width: 130px;
  }
  .stat-orb:nth-child(1){animation:floatY 5s ease-in-out infinite;}
  .stat-orb:nth-child(2){animation:floatY2 6.5s ease-in-out infinite 1s;}
  .stat-orb:nth-child(3){animation:floatY3 4.5s ease-in-out infinite 2s;}
  .stat-num { font-family:'Playfair Display',serif; font-size:23px; font-weight:900; color:#d4af37; letter-spacing:-0.02em; line-height:1; margin-bottom:3px; }
  .stat-lbl  { font-size:11px; color:rgba(240,230,200,0.33); font-weight:500; }

  /* Benefit checklist */
  .benefit-list { display: flex; gap: 10px; flex-wrap: wrap; }
  .benefit-item {
    display: flex; align-items: center; gap: 7px;
    font-size: 12px; color: rgba(240,230,200,0.45);
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(212,175,55,0.1);
    border-radius: 999px; padding: 6px 14px;
  }
  .benefit-item svg { animation: tick-in 0.4s ease both; }

  /* Left footer */
  .lp-footer {
    position: relative; z-index: 2;
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;
  }
  .lp-footer-copy { font-size:11px; color:rgba(240,230,200,0.2); letter-spacing:0.04em; }
  .lp-footer-links { display:flex; gap:18px; }
  .lp-footer-link { font-size:11px; color:rgba(240,230,200,0.18); text-decoration:none; letter-spacing:0.03em; transition:color 0.2s; }
  .lp-footer-link:hover { color:rgba(212,175,55,0.55); }

  /* ══ RIGHT PANEL 30% ══ */
  .right-panel {
    flex: 0 0 30%;
    background: #0f111e;
    border-left: 1px solid rgba(212,175,55,0.1);
    display: flex; flex-direction: column;
    min-height: 100vh;
  }
  .rp-form-area {
    flex: 1; display: flex; flex-direction: column;
    justify-content: center; padding: 44px 36px 28px;
  }

  /* Mini logo */
  .rp-logo { display:flex; align-items:center; gap:10px; margin-bottom:36px; animation:fadeUp 0.4s ease both; }
  .rp-logo-icon {
    width:38px; height:38px; border-radius:11px;
    background:linear-gradient(135deg,#d4af37,#f5d060);
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 4px 16px rgba(212,175,55,0.35);
    animation:pulse-gold 3s ease-in-out infinite;
  }
  .rp-logo-text { font-family:'Playfair Display',serif; font-size:14px; font-weight:700; color:#f0e6c8; }
  .rp-logo-sub  { font-size:10px; color:rgba(212,175,55,0.4); letter-spacing:0.06em; }

  .rp-heading { font-family:'Playfair Display',serif; font-size:24px; font-weight:900; color:#f0e6c8; letter-spacing:-0.025em; margin-bottom:5px; animation:fadeUp 0.4s ease 0.05s both; }
  .rp-sub { font-size:12px; color:rgba(240,230,200,0.3); margin-bottom:30px; line-height:1.6; animation:fadeUp 0.4s ease 0.08s both; }

  .rp-field { margin-bottom:14px; animation:fadeUp 0.4s ease 0.1s both; }
  .rp-label { display:block; font-size:10px; font-weight:700; color:rgba(212,175,55,0.52); letter-spacing:0.12em; text-transform:uppercase; margin-bottom:6px; }
  .rp-input-wrap { position:relative; }
  .rp-input-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); pointer-events:none; }
  .rp-input {
    width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(212,175,55,0.17);
    border-radius:10px; padding:12px 13px 12px 40px; color:#f0e6c8; font-size:13px;
    font-family:'DM Sans',sans-serif; outline:none; transition:all 0.3s ease;
  }
  .rp-input::placeholder { color:rgba(240,230,200,0.2); }
  .rp-input:focus { border-color:rgba(212,175,55,0.58); background:rgba(212,175,55,0.05); box-shadow:0 0 0 3px rgba(212,175,55,0.08); }

  /* Select */
  .rp-select {
    width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(212,175,55,0.17);
    border-radius:10px; padding:12px 13px; color:#f0e6c8; font-size:13px;
    font-family:'DM Sans',sans-serif; outline:none; cursor:pointer; appearance:none; transition:all 0.3s;
  }
  .rp-select option { background:#0f111e; color:#f0e6c8; }
  .rp-select:focus { border-color:rgba(212,175,55,0.58); box-shadow:0 0 0 3px rgba(212,175,55,0.08); }

  .rp-btn {
    width:100%; margin-top:22px;
    background:linear-gradient(135deg,#d4af37 0%,#f5d060 50%,#b8963e 100%); background-size:200% auto;
    color:#1a1508; border:none; border-radius:10px; padding:13px;
    font-size:13px; font-weight:700; font-family:'DM Sans',sans-serif; letter-spacing:0.06em;
    text-transform:uppercase; cursor:pointer;
    display:flex; align-items:center; justify-content:center; gap:8px;
    box-shadow:0 4px 18px rgba(212,175,55,0.27), inset 0 1px 0 rgba(255,255,255,0.25);
    transition:all 0.4s ease; animation:fadeUp 0.4s ease 0.2s both;
  }
  .rp-btn:hover:not(:disabled) { background-position:right center; transform:translateY(-2px); box-shadow:0 8px 28px rgba(212,175,55,0.4); }
  .rp-btn:disabled { opacity:0.5; cursor:not-allowed; }

  .rp-divider { height:1px; background:linear-gradient(90deg,transparent,rgba(212,175,55,0.17),transparent); margin:26px 0; }
  .rp-link-text { font-size:12px; color:rgba(240,230,200,0.27); text-align:center; }
  .rp-link { color:#d4af37; font-weight:600; text-decoration:none; transition:color 0.2s; }
  .rp-link:hover { color:#f5d060; }

  /* Right footer */
  .rp-footer {
    padding:18px 36px;
    border-top:1px solid rgba(212,175,55,0.08);
    display:flex; flex-direction:column; align-items:center; gap:7px;
  }
  .rp-footer-copy { font-size:10px; color:rgba(212,175,55,0.27); letter-spacing:0.07em; font-weight:500; display:flex; align-items:center; gap:5px; }
  .rp-footer-links { display:flex; gap:14px; }
  .rp-footer-link { font-size:10px; color:rgba(240,230,200,0.14); text-decoration:none; letter-spacing:0.03em; transition:color 0.2s; }
  .rp-footer-link:hover { color:rgba(212,175,55,0.5); }

  @media (max-width: 900px) {
    .left-panel { display:none; }
    .right-panel { flex:1; border-left:none; }
  }
`;

const steps = [
  { title: "Create your account",       desc: "Fill in your name, email, and a secure password to get started." },
  { title: "Verify & get access",       desc: "Your account is reviewed by an admin who will assign your role." },
  { title: "Submit leave requests",     desc: "Apply for leaves instantly with date selection and reason." },
  { title: "Track approvals in real time", desc: "Stay informed with live status updates on all your requests." },
];

const stats = [
  { num: "2.4k", lbl: "Active Users" },
  { num: "98%",  lbl: "Approval Rate" },
  { num: "< 1m", lbl: "Setup Time" },
];

const benefits = ["Free to join", "No credit card", "Instant access", "Secure & private"];

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "employee" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      toast.success("Account created — please login");
      navigate("/");
    } catch {
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleRegister(); };

  return (
    <>
      <style>{css}</style>
      <div className="auth-root">

        {/* ══ LEFT PANEL 70% ══ */}
        <div className="left-panel">
          <div className="lp-glow-br" />

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

          {/* Hero */}
          <div className="lp-hero">
            <div className="lp-tagline-sup">Join Thousands of Employees</div>
            <h1 className="lp-heading">
              Your Journey Starts<br />
              With a <span>Simple</span><br />
              Registration
            </h1>
            <p className="lp-desc">
              Create your free account in under a minute and gain instant access to the most
              intuitive HR leave management platform available today.
            </p>

            {/* Onboarding steps */}
            <div className="lp-steps">
              {steps.map((s, i) => (
                <div key={i} className="step-row">
                  <div className="step-num">{i + 1}</div>
                  <div>
                    <div className="step-title">{s.title}</div>
                    <div className="step-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Benefits pills */}
            <div className="benefit-list">
              {benefits.map(b => (
                <div key={b} className="benefit-item">
                  <CheckCircle size={11} color="#4ade80" />
                  {b}
                </div>
              ))}
            </div>

            {/* Floating stat orbs */}
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
                <div className="rp-logo-sub">Create Account</div>
              </div>
            </div>

            <div className="rp-heading">Get Started</div>
            <p className="rp-sub">Fill in your details to create your employee account</p>

            {/* Name */}
            <div className="rp-field">
              <label className="rp-label">Full Name</label>
              <div className="rp-input-wrap">
                <User size={13} color="rgba(212,175,55,0.4)" className="rp-input-icon" />
                <input name="name" type="text" placeholder="John Smith" className="rp-input" onChange={handleChange} onKeyDown={handleKeyDown} />
              </div>
            </div>

            {/* Email */}
            <div className="rp-field">
              <label className="rp-label">Email Address</label>
              <div className="rp-input-wrap">
                <Mail size={13} color="rgba(212,175,55,0.4)" className="rp-input-icon" />
                <input name="email" type="email" placeholder="you@company.com" className="rp-input" onChange={handleChange} onKeyDown={handleKeyDown} />
              </div>
            </div>

            {/* Password */}
            <div className="rp-field">
              <label className="rp-label">Password</label>
              <div className="rp-input-wrap">
                <Lock size={13} color="rgba(212,175,55,0.4)" className="rp-input-icon" />
                <input name="password" type="password" placeholder="••••••••" className="rp-input" onChange={handleChange} onKeyDown={handleKeyDown} />
              </div>
            </div>

            {/* Role — employee only */}
            <div className="rp-field" style={{ marginBottom: 0 }}>
              <label className="rp-label">Role</label>
              <select name="role" value={form.role} className="rp-select" onChange={handleChange}>
                <option value="employee">Employee</option>
              </select>
            </div>

            <button className="rp-btn" onClick={handleRegister} disabled={loading}>
              {loading ? "Creating account..." : <><span>Create Account</span><ArrowRight size={15} strokeWidth={2.5} /></>}
            </button>

            <div className="rp-divider" />

            <p className="rp-link-text">
              Already have an account?{" "}
              <a href="/" className="rp-link">Sign in</a>
            </p>
          </div>

          {/* Right footer — sits naturally at bottom */}
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