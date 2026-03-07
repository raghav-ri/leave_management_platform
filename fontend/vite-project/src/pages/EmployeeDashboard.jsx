import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardCards from "../components/DashboardCards";
import LeaveChart from "../components/LeaveChart";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import {
  CalendarPlus, CheckCircle2, Clock, XCircle, Shield, Sparkles, User,
  Receipt, Sun, Moon, Upload, DollarSign, FileText
} from "lucide-react";

/* ─────────────────────────── CSS ─────────────────────────── */
const makeCSS = (dark) => `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);} }
  @keyframes pulse-soft { 0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,0.3);}50%{box-shadow:0 0 0 8px rgba(212,175,55,0);} }

  .emp-page {
    min-height:100vh; font-family:'DM Sans',sans-serif;
    background-color:${dark?"#111009":"#f7f3ec"};
    background-image:
      radial-gradient(ellipse at 5% 5%,rgba(212,175,55,0.09) 0%,transparent 50%),
      radial-gradient(ellipse at 95% 90%,rgba(220,140,60,0.07) 0%,transparent 50%),
      url("data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zM10 20h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zM10 30h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zM10 40h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2z' fill='%23c8a850' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
    transition: background-color 0.3s ease;
  }

  .emp-content { padding:28px 36px; flex:1; }
  @media(max-width:768px){ .emp-content{ padding:16px 14px; } }

  /* WELCOME BANNER */
  .welcome-banner {
    background:linear-gradient(125deg,#1e1a14 0%,#2e2518 55%,#1a1510 100%);
    border-radius:20px; border:1px solid rgba(212,175,55,0.22);
    padding:26px 32px; margin-bottom:24px;
    display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:14px;
    animation:fadeUp 0.35s ease both; position:relative; overflow:hidden;
  }
  .welcome-banner::after {
    content:''; position:absolute; right:-30px; top:-30px; width:220px; height:220px; border-radius:50%;
    background:radial-gradient(circle,rgba(212,175,55,0.09) 0%,transparent 70%); pointer-events:none;
  }
  .wb-left { display:flex; align-items:center; gap:16px; position:relative; z-index:1; }
  .user-avatar {
    width:50px; height:50px; border-radius:50%;
    background:linear-gradient(135deg,#d4af37,#f5d060);
    display:flex; align-items:center; justify-content:center;
    font-family:'Playfair Display',serif; font-size:19px; font-weight:900; color:#1a1508;
    box-shadow:0 4px 16px rgba(212,175,55,0.4);
    animation:pulse-soft 3s ease-in-out infinite; flex-shrink:0;
  }
  .wb-greeting { font-size:11px; font-weight:600; color:rgba(212,175,55,0.52); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:3px; }
  .wb-name { font-family:'Playfair Display',serif; font-size:21px; font-weight:700; color:#f0e6c8; letter-spacing:-0.02em; margin-bottom:5px; }
  .role-chip { display:inline-flex; align-items:center; gap:5px; background:rgba(212,175,55,0.11); border:1px solid rgba(212,175,55,0.22); border-radius:999px; padding:3px 10px; font-size:10px; font-weight:700; color:#d4af37; letter-spacing:0.07em; text-transform:uppercase; }
  .wb-right { position:relative; z-index:1; text-align:right; display:flex; align-items:center; gap:16px; }
  .wb-date { font-size:12px; color:rgba(240,230,200,0.38); letter-spacing:0.02em; margin-bottom:2px; }
  .wb-time { font-family:'Playfair Display',serif; font-size:26px; font-weight:700; color:#d4af37; letter-spacing:-0.02em; }

  /* THEME TOGGLE */
  .theme-toggle {
    width:42px; height:24px; border-radius:999px; border:1px solid rgba(212,175,55,0.3);
    background:${dark?"rgba(212,175,55,0.18)":"rgba(212,175,55,0.08)"};
    cursor:pointer; position:relative; transition:all 0.3s; flex-shrink:0;
    display:flex; align-items:center; padding:2px;
  }
  .toggle-knob {
    width:18px; height:18px; border-radius:50%;
    background:linear-gradient(135deg,#d4af37,#f5d060);
    position:absolute; transition:all 0.3s;
    left:${dark?"calc(100% - 20px)":"2px"};
    display:flex; align-items:center; justify-content:center;
  }

  /* SECTION TABS */
  .section-tabs { display:flex; gap:4px; margin-bottom:22px; background:${dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.04)"}; border-radius:12px; padding:4px; width:fit-content; animation:fadeUp 0.4s ease 0.05s both; }
  .section-tab { padding:8px 20px; border-radius:9px; font-size:12px; font-weight:700; letter-spacing:0.05em; border:none; cursor:pointer; transition:all 0.22s; font-family:'DM Sans',sans-serif; color:${dark?"rgba(240,230,200,0.4)":"#9a8f84"}; background:transparent; }
  .section-tab.active { background:linear-gradient(135deg,#1e1a14,#2e2518); color:#d4af37; box-shadow:0 2px 8px rgba(0,0,0,0.18); }

  .page-header { margin-bottom:22px; animation:fadeUp 0.4s ease 0.06s both; }
  .gold-accent { width:40px; height:3px; background:linear-gradient(90deg,#d4af37,#f5d060); border-radius:2px; margin-bottom:8px; box-shadow:0 2px 8px rgba(212,175,55,0.3); }
  .page-title { font-family:'Playfair Display',serif; font-weight:900; font-size:27px; color:${dark?"#f0e6c8":"#1a1614"}; letter-spacing:-0.03em; margin-bottom:3px; }
  .page-subtitle { font-size:13px; color:${dark?"#6b6255":"#9a8f84"}; }

  /* APPLY CARD */
  .apply-card {
    background:linear-gradient(135deg,#1e1a14 0%,#2a2318 60%,#1e1a14 100%);
    border-radius:20px; border:1px solid rgba(212,175,55,0.2);
    box-shadow:0 8px 32px rgba(0,0,0,0.14),inset 0 1px 0 rgba(212,175,55,0.1);
    padding:24px 30px; margin-bottom:24px;
    animation:fadeUp 0.4s ease 0.1s both; position:relative; overflow:hidden;
  }
  .apply-card::before { content:''; position:absolute; top:-50%; right:-20%; width:260px; height:260px; border-radius:50%; background:radial-gradient(circle,rgba(212,175,55,0.07) 0%,transparent 70%); pointer-events:none; }
  .apply-card-title { font-family:'Playfair Display',serif; font-weight:700; font-size:16px; color:#f0e6c8; margin-bottom:3px; }
  .apply-card-sub { font-size:12px; color:rgba(240,230,200,0.36); margin-bottom:20px; }
  .form-field-wrap { display:flex; flex-direction:column; gap:5px; }
  .field-label { font-size:10px; font-weight:600; color:rgba(212,175,55,0.58); letter-spacing:0.1em; text-transform:uppercase; }
  .premium-input {
    background:rgba(255,255,255,0.05); border:1px solid rgba(212,175,55,0.2); border-radius:10px;
    padding:10px 13px; font-size:13px; color:#f0e6c8; font-family:'DM Sans',sans-serif; outline:none; transition:all 0.3s ease; width:100%;
  }
  .premium-input::placeholder { color:rgba(240,230,200,0.2); }
  .premium-input:focus { border-color:rgba(212,175,55,0.6); background:rgba(212,175,55,0.06); box-shadow:0 0 0 3px rgba(212,175,55,0.08); }
  .premium-input[type="date"]::-webkit-calendar-picker-indicator { filter:invert(0.7) sepia(1) saturate(0.5); opacity:0.5; }
  .premium-input option { background:#2a2318; color:#f0e6c8; }
  .apply-btn {
    background:linear-gradient(135deg,#d4af37,#f5d060,#b8963e); background-size:200% auto;
    color:#1a1508; border:none; border-radius:10px; padding:11px 24px;
    font-size:12px; font-weight:700; font-family:'DM Sans',sans-serif;
    letter-spacing:0.06em; text-transform:uppercase; cursor:pointer; white-space:nowrap;
    box-shadow:0 4px 16px rgba(212,175,55,0.28),inset 0 1px 0 rgba(255,255,255,0.3);
    transition:all 0.35s ease; margin-top:22px;
  }
  .apply-btn:hover:not(:disabled) { background-position:right center; transform:translateY(-2px); box-shadow:0 8px 28px rgba(212,175,55,0.42); }
  .apply-btn:disabled { opacity:0.5; cursor:not-allowed; }

  /* REIMBURSEMENT CARD — same dark card style */
  .reimb-card {
    background:linear-gradient(135deg,#1a1412 0%,#261e16 60%,#1a1412 100%);
    border-radius:20px; border:1px solid rgba(212,175,55,0.18);
    box-shadow:0 8px 32px rgba(0,0,0,0.16),inset 0 1px 0 rgba(212,175,55,0.08);
    padding:24px 30px; margin-bottom:24px;
    animation:fadeUp 0.4s ease 0.12s both; position:relative; overflow:hidden;
  }
  .reimb-card::before { content:''; position:absolute; top:-40%; left:-10%; width:280px; height:280px; border-radius:50%; background:radial-gradient(circle,rgba(212,175,55,0.05) 0%,transparent 70%); pointer-events:none; }
  .form-row { display:flex; gap:13px; flex-wrap:wrap; align-items:flex-end; }
  @media(max-width:600px){ .form-row{ flex-direction:column; } .form-row .form-field-wrap{ width:100% !important; } }

  /* TABLE CARD */
  .table-card { flex:1; min-width:0; background:${dark?"#1c1914":"#fff"}; border-radius:20px; border:1px solid ${dark?"rgba(212,175,55,0.1)":"rgba(212,175,55,0.1)"}; box-shadow:0 4px 20px rgba(0,0,0,0.05); overflow:hidden; position:relative; }
  .table-card::before { content:''; position:absolute; top:0;left:0;right:0; height:3px; background:linear-gradient(90deg,#d4af37,#f5d060,#d4af37); }
  .table-header { padding:20px 24px 15px; border-bottom:1px solid ${dark?"rgba(212,175,55,0.08)":"#f4f0eb"}; }
  .table-card-title { font-family:'Playfair Display',serif; font-weight:700; font-size:16px; color:${dark?"#f0e6c8":"#1a1614"}; }
  .table-card-sub { font-size:11px; color:${dark?"#6b6255":"#b0a898"}; margin-top:2px; }

  table { width:100%; border-collapse:collapse; }
  thead tr { background:${dark?"rgba(255,255,255,0.03)":"#faf7f2"}; }
  th { padding:11px 22px; text-align:left; font-size:10px; font-weight:700; color:rgba(212,175,55,0.62); letter-spacing:0.12em; text-transform:uppercase; white-space:nowrap; }
  .leave-row { border-top:1px solid ${dark?"rgba(255,255,255,0.04)":"#f4f0eb"}; transition:background 0.18s; }
  .leave-row:hover { background:${dark?"rgba(212,175,55,0.03)":"#faf7f2"}; }
  td { padding:14px 22px; font-size:13px; color:${dark?"#c8bfb0":"#3d3530"}; vertical-align:middle; }
  .status-badge { display:inline-flex; align-items:center; gap:5px; padding:4px 11px; border-radius:999px; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; border:1px solid transparent; }
  .empty-state { text-align:center; padding:44px 24px; color:${dark?"#4a4035":"#b0a898"}; font-size:14px; }
  .bottom-row { display:flex; gap:22px; flex-wrap:wrap; align-items:flex-start; animation:fadeUp 0.45s ease 0.15s both; }

  /* FOOTER */
  .emp-footer { background:#1e1a14; border-top:1px solid rgba(212,175,55,0.1); padding:18px 36px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; }
  .footer-brand { display:flex; align-items:center; gap:7px; }
  .footer-brand-text { font-size:11px; font-weight:600; color:rgba(212,175,55,0.48); letter-spacing:0.12em; text-transform:uppercase; }
  .footer-link { font-size:11px; color:rgba(240,230,200,0.18); text-decoration:none; letter-spacing:0.02em; transition:color 0.2s; }
  .footer-link:hover { color:rgba(212,175,55,0.6); }
  .footer-copy { font-size:11px; color:rgba(240,230,200,0.14); letter-spacing:0.04em; }

  @media(max-width:768px){
    .emp-footer { flex-direction:column; text-align:center; padding:14px; gap:8px; }
    .welcome-banner { padding:18px 18px; }
    .wb-time { font-size:18px; }
    .apply-card, .reimb-card { padding:16px 16px; }
    .bottom-row { flex-direction:column; }
    .section-tabs { width:100%; }
    .section-tab { flex:1; text-align:center; }
  }
`;

const statusConfig = {
  approved: { color:"#16a34a", bg:"#f0fdf4", border:"#bbf7d0", icon:CheckCircle2 },
  pending:  { color:"#b45309", bg:"#fffbeb", border:"#fde68a", icon:Clock },
  rejected: { color:"#dc2626", bg:"#fef2f2", border:"#fecaca", icon:XCircle },
};

const REIMB_CATEGORIES = ["Travel","Food & Meals","Office Supplies","Medical","Training & Education","Internet / Phone","Other"];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [reimbursements, setReimbursements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [submittingReimb, setSubmittingReimb] = useState(false);
  const [now, setNow] = useState(new Date());
  const [activeTab, setActiveTab] = useState("leave"); // "leave" | "reimbursement"
  const [dark, setDark] = useState(() => localStorage.getItem("emp-theme") === "dark");

  // Leave form
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  // Reimbursement form
  const [rAmount, setRAmount] = useState("");
  const [rCategory, setRCategory] = useState("");
  const [rDescription, setRDescription] = useState("");
  const [rDate, setRDate] = useState("");

  const userName = localStorage.getItem("name") || "Employee";
  const initials = userName.split(" ").map(n=>n[0]).slice(0,2).join("").toUpperCase() || "E";

  const logout = () => { localStorage.clear(); navigate("/"); };

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("emp-theme", next ? "dark" : "light");
  };

  // Tick clock
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const fetchLeaves = async () => {
    try { const res = await API.get("/leaves/my"); setLeaves(res.data); }
    catch { toast.error("Failed to fetch leaves"); }
    finally { setLoading(false); }
  };

  const fetchReimbursements = async () => {
    try { const res = await API.get("/reimbursements/my"); setReimbursements(res.data); }
    catch { /* silently fail if endpoint not ready */ }
  };

  const applyLeave = async () => {
    if (!startDate || !endDate || !reason) { toast.error("Please fill all fields"); return; }
    setApplying(true);
    try { await API.post("/leaves/apply", { startDate, endDate, reason }); toast.success("Leave applied successfully"); fetchLeaves(); }
    catch { toast.error("Failed to apply leave"); }
    finally { setApplying(false); }
  };

  const submitReimbursement = async () => {
    if (!rAmount || !rCategory || !rDescription || !rDate) { toast.error("Please fill all reimbursement fields"); return; }
    setSubmittingReimb(true);
    try {
      await API.post("/reimbursements/apply", { amount: rAmount, category: rCategory, description: rDescription, date: rDate });
      toast.success("Reimbursement request submitted!");
      setRAmount(""); setRCategory(""); setRDescription(""); setRDate("");
      fetchReimbursements();
    } catch { toast.error("Failed to submit reimbursement"); }
    finally { setSubmittingReimb(false); }
  };

  useEffect(() => { fetchLeaves(); fetchReimbursements(); }, []);

  const dateStr = now.toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" });

  return (
    <>
      <style>{makeCSS(dark)}</style>
      <div className="emp-page" style={{ display:"flex" }}>
        <Sidebar logout={logout} />
        <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
          <Navbar />
          <div className="emp-content">

            {/* WELCOME BANNER */}
            <div className="welcome-banner">
              <div className="wb-left">
                <div className="user-avatar">{initials}</div>
                <div>
                  <div className="wb-greeting">{getGreeting()}</div>
                  <div className="wb-name">{userName}</div>
                  <div className="role-chip"><User size={9} /> Employee</div>
                </div>
              </div>
              <div className="wb-right">
                <div style={{ textAlign:"right" }}>
                  <div className="wb-date">{dateStr}</div>
                  <div className="wb-time">{timeStr}</div>
                </div>
                {/* Theme toggle */}
                <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
                  <div className="toggle-knob">
                    {dark ? <Moon size={10} color="#1a1508" /> : <Sun size={10} color="#1a1508" />}
                  </div>
                </button>
              </div>
            </div>

            <div className="page-header">
              <div className="gold-accent" />
              <h1 className="page-title">My Dashboard</h1>
              <p className="page-subtitle">Manage your leave and reimbursement requests</p>
            </div>

            {/* SECTION TABS */}
            <div className="section-tabs">
              <button className={`section-tab ${activeTab==="leave"?"active":""}`} onClick={()=>setActiveTab("leave")}>
                📅 Leave Requests
              </button>
              <button className={`section-tab ${activeTab==="reimbursement"?"active":""}`} onClick={()=>setActiveTab("reimbursement")}>
                💰 Reimbursements
              </button>
            </div>

            {loading ? <Loader /> : (
              <>
                <DashboardCards leaves={leaves} />

                {/* ── LEAVE TAB ── */}
                {activeTab === "leave" && (
                  <>
                    <div className="apply-card">
                      <div style={{ display:"flex", alignItems:"center", gap:"11px", marginBottom:"3px" }}>
                        <div style={{ width:"32px",height:"32px",borderRadius:"9px",background:"rgba(212,175,55,0.13)",border:"1px solid rgba(212,175,55,0.24)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                          <CalendarPlus size={15} color="#d4af37" />
                        </div>
                        <div className="apply-card-title">Apply for Leave</div>
                      </div>
                      <p className="apply-card-sub">Submit a new leave request for approval</p>
                      <div className="form-row">
                        <div className="form-field-wrap">
                          <label className="field-label">Start Date</label>
                          <input type="date" className="premium-input" value={startDate} onChange={e=>setStartDate(e.target.value)} />
                        </div>
                        <div className="form-field-wrap">
                          <label className="field-label">End Date</label>
                          <input type="date" className="premium-input" value={endDate} onChange={e=>setEndDate(e.target.value)} />
                        </div>
                        <div className="form-field-wrap" style={{ flex:1, minWidth:"200px" }}>
                          <label className="field-label">Reason</label>
                          <input className="premium-input" placeholder="Brief reason for leave..." value={reason} onChange={e=>setReason(e.target.value)} />
                        </div>
                        <button className="apply-btn" onClick={applyLeave} disabled={applying}>
                          {applying ? "Submitting…" : "Apply Leave"}
                        </button>
                      </div>
                    </div>

                    <div className="bottom-row">
                      <LeaveChart leaves={leaves} />
                      <div className="table-card">
                        <div className="table-header">
                          <div className="table-card-title">Leave History</div>
                          <div className="table-card-sub">{leaves.length} total requests</div>
                        </div>
                        <div style={{ overflowX:"auto" }}>
                          <table>
                            <thead><tr>{["Date Range","Reason","Status"].map(h=><th key={h}>{h}</th>)}</tr></thead>
                            <tbody>
                              {leaves.length===0 ? (
                                <tr><td colSpan={3}><div className="empty-state">
                                  <CalendarPlus size={28} color="#d0c8be" style={{ margin:"0 auto 10px",display:"block" }} />
                                  No leave requests yet
                                </div></td></tr>
                              ) : leaves.map(leave => {
                                const cfg = statusConfig[leave.status] || statusConfig.pending;
                                const Icon = cfg.icon;
                                return (
                                  <tr key={leave._id} className="leave-row">
                                    <td style={{ fontWeight:600,whiteSpace:"nowrap",color:"#1a1614" }}>
                                      {leave.startDate.slice(0,10)}<span style={{ color:"#c8b88a",margin:"0 6px" }}>→</span>{leave.endDate.slice(0,10)}
                                    </td>
                                    <td style={{ color:"#6b6255" }}>{leave.reason}</td>
                                    <td>
                                      <span className="status-badge" style={{ background:cfg.bg,color:cfg.color,borderColor:cfg.border }}>
                                        <Icon size={10} />{leave.status}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* ── REIMBURSEMENT TAB ── */}
                {activeTab === "reimbursement" && (
                  <>
                    <div className="reimb-card">
                      <div style={{ display:"flex", alignItems:"center", gap:"11px", marginBottom:"3px" }}>
                        <div style={{ width:"32px",height:"32px",borderRadius:"9px",background:"rgba(212,175,55,0.13)",border:"1px solid rgba(212,175,55,0.24)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                          <Receipt size={15} color="#d4af37" />
                        </div>
                        <div className="apply-card-title">Submit Reimbursement</div>
                      </div>
                      <p className="apply-card-sub">Request reimbursement for work-related expenses</p>
                      <div className="form-row">
                        <div className="form-field-wrap">
                          <label className="field-label">Expense Date</label>
                          <input type="date" className="premium-input" value={rDate} onChange={e=>setRDate(e.target.value)} />
                        </div>
                        <div className="form-field-wrap">
                          <label className="field-label">Category</label>
                          <select className="premium-input" value={rCategory} onChange={e=>setRCategory(e.target.value)}>
                            <option value="">Select category…</option>
                            {REIMB_CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div className="form-field-wrap">
                          <label className="field-label">Amount (₹)</label>
                          <input type="number" min="1" className="premium-input" style={{ width:"130px" }} placeholder="0.00" value={rAmount} onChange={e=>setRAmount(e.target.value)} />
                        </div>
                        <div className="form-field-wrap" style={{ flex:1, minWidth:"200px" }}>
                          <label className="field-label">Description</label>
                          <input className="premium-input" placeholder="Describe the expense…" value={rDescription} onChange={e=>setRDescription(e.target.value)} />
                        </div>
                        <button className="apply-btn" onClick={submitReimbursement} disabled={submittingReimb}>
                          <Upload size={12} style={{ marginRight:"5px",verticalAlign:"middle" }} />
                          {submittingReimb ? "Submitting…" : "Submit Request"}
                        </button>
                      </div>
                    </div>

                    {/* Reimbursement History */}
                    <div className="table-card" style={{ animation:"fadeUp 0.4s ease 0.15s both" }}>
                      <div className="table-header" style={{ display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"10px" }}>
                        <div>
                          <div style={{ display:"flex",alignItems:"center",gap:"7px" }}>
                            <DollarSign size={14} color="#d4af37" />
                            <div className="table-card-title">Reimbursement History</div>
                          </div>
                          <div className="table-card-sub">{reimbursements.length} total requests</div>
                        </div>
                        {reimbursements.length > 0 && (
                          <div style={{ fontSize:"12px",color:"#d4af37",fontWeight:700 }}>
                            Total: ₹{reimbursements.reduce((s,r)=>s+Number(r.amount||0),0).toLocaleString()}
                          </div>
                        )}
                      </div>
                      <div style={{ overflowX:"auto" }}>
                        <table>
                          <thead><tr>{["Date","Category","Description","Amount","Status"].map(h=><th key={h}>{h}</th>)}</tr></thead>
                          <tbody>
                            {reimbursements.length===0 ? (
                              <tr><td colSpan={5}><div className="empty-state">
                                <Receipt size={28} color="#d0c8be" style={{ margin:"0 auto 10px",display:"block" }} />
                                No reimbursement requests yet
                              </div></td></tr>
                            ) : reimbursements.map(r => {
                              const cfg = statusConfig[r.status] || statusConfig.pending;
                              const Icon = cfg.icon;
                              return (
                                <tr key={r._id} className="leave-row">
                                  <td style={{ whiteSpace:"nowrap" }}>{r.date?.slice(0,10) || "—"}</td>
                                  <td>
                                    <span style={{ display:"inline-flex",alignItems:"center",gap:"5px",background:"rgba(212,175,55,0.08)",border:"1px solid rgba(212,175,55,0.16)",borderRadius:"6px",padding:"2px 8px",fontSize:"11px",color:"#d4af37",fontWeight:600 }}>
                                      {r.category}
                                    </span>
                                  </td>
                                  <td style={{ maxWidth:"160px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{r.description}</td>
                                  <td style={{ fontWeight:700,color:"#d4af37" }}>₹{Number(r.amount).toLocaleString()}</td>
                                  <td>
                                    <span className="status-badge" style={{ background:cfg.bg,color:cfg.color,borderColor:cfg.border }}>
                                      <Icon size={10} />{r.status}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <footer className="emp-footer">
            <div className="footer-brand">
              <div style={{ width:"19px",height:"19px",borderRadius:"5px",background:"linear-gradient(135deg,#d4af37,#f5d060)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                <Shield size={10} color="#1a1508" strokeWidth={2.5} />
              </div>
              <span className="footer-brand-text">HR Portal</span>
            </div>
            <div style={{ display:"flex", gap:"16px", flexWrap:"wrap", justifyContent:"center" }}>
              {["Help Center","Privacy Policy","Terms of Use"].map(item=><a key={item} href="#" className="footer-link">{item}</a>)}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
              <Sparkles size={10} color="rgba(212,175,55,0.35)" />
              <span className="footer-copy">© {new Date().getFullYear()} HR Portal. All rights reserved.</span>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}