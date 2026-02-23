import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardCards from "../components/DashboardCards";
import LeaveChart from "../components/LeaveChart";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { CalendarPlus, CheckCircle2, Clock, XCircle, Shield, Sparkles, User } from "lucide-react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; }

  @keyframes fadeUp { from { opacity:0; transform:translateY(18px);} to {opacity:1;transform:translateY(0);} }
  @keyframes pulse-soft { 0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,0.3);}50%{box-shadow:0 0 0 8px rgba(212,175,55,0);} }

  /* EMPLOYEE: warm parchment + gold dust texture */
  .emp-page {
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    background-color: #f7f3ec;
    background-image:
      radial-gradient(ellipse at 5% 5%, rgba(212,175,55,0.09) 0%, transparent 50%),
      radial-gradient(ellipse at 95% 90%, rgba(220,140,60,0.07) 0%, transparent 50%),
      url("data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zM10 20h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zM10 30h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zM10 40h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2z' fill='%23c8a850' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
  }

  .emp-content { padding: 28px 36px; flex: 1; }

  /* WELCOME BANNER */
  .welcome-banner {
    background: linear-gradient(125deg, #1e1a14 0%, #2e2518 55%, #1a1510 100%);
    border-radius: 20px; border: 1px solid rgba(212,175,55,0.22);
    padding: 26px 32px; margin-bottom: 24px;
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;
    animation: fadeUp 0.35s ease both; position: relative; overflow: hidden;
  }
  .welcome-banner::after {
    content: ''; position: absolute; right: -30px; top: -30px;
    width: 220px; height: 220px; border-radius: 50%;
    background: radial-gradient(circle, rgba(212,175,55,0.09) 0%, transparent 70%);
    pointer-events: none;
  }
  .wb-left { display: flex; align-items: center; gap: 16px; position: relative; z-index: 1; }
  .user-avatar {
    width: 50px; height: 50px; border-radius: 50%;
    background: linear-gradient(135deg, #d4af37, #f5d060);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif; font-size: 19px; font-weight: 900; color: #1a1508;
    box-shadow: 0 4px 16px rgba(212,175,55,0.4);
    animation: pulse-soft 3s ease-in-out infinite; flex-shrink: 0;
  }
  .wb-greeting { font-size: 11px; font-weight: 600; color: rgba(212,175,55,0.52); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 3px; }
  .wb-name { font-family: 'Playfair Display', serif; font-size: 21px; font-weight: 700; color: #f0e6c8; letter-spacing: -0.02em; margin-bottom: 5px; }
  .role-chip {
    display: inline-flex; align-items: center; gap: 5px;
    background: rgba(212,175,55,0.11); border: 1px solid rgba(212,175,55,0.22);
    border-radius: 999px; padding: 3px 10px;
    font-size: 10px; font-weight: 700; color: #d4af37; letter-spacing: 0.07em; text-transform: uppercase;
  }
  .wb-right { position: relative; z-index: 1; text-align: right; }
  .wb-date { font-size: 12px; color: rgba(240,230,200,0.38); letter-spacing: 0.02em; margin-bottom: 2px; }
  .wb-time { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: #d4af37; letter-spacing: -0.02em; }

  .page-header { margin-bottom: 22px; animation: fadeUp 0.4s ease 0.06s both; }
  .gold-accent { width: 40px; height: 3px; background: linear-gradient(90deg,#d4af37,#f5d060); border-radius: 2px; margin-bottom: 8px; box-shadow: 0 2px 8px rgba(212,175,55,0.3); }
  .page-title { font-family:'Playfair Display',serif; font-weight:900; font-size:27px; color:#1a1614; letter-spacing:-0.03em; margin-bottom:3px; }
  .page-subtitle { font-size:13px; color:#9a8f84; }

  .apply-card {
    background: linear-gradient(135deg,#1e1a14 0%,#2a2318 60%,#1e1a14 100%);
    border-radius:20px; border:1px solid rgba(212,175,55,0.2);
    box-shadow:0 8px 32px rgba(0,0,0,0.14),inset 0 1px 0 rgba(212,175,55,0.1);
    padding:24px 30px; margin-bottom:24px;
    animation:fadeUp 0.4s ease 0.1s both; position:relative; overflow:hidden;
  }
  .apply-card::before {
    content:''; position:absolute; top:-50%; right:-20%;
    width:260px; height:260px; border-radius:50%;
    background:radial-gradient(circle,rgba(212,175,55,0.07) 0%,transparent 70%); pointer-events:none;
  }
  .apply-card-title { font-family:'Playfair Display',serif; font-weight:700; font-size:16px; color:#f0e6c8; margin-bottom:3px; }
  .apply-card-sub { font-size:12px; color:rgba(240,230,200,0.36); margin-bottom:20px; }
  .form-field-wrap { display:flex; flex-direction:column; gap:5px; }
  .field-label { font-size:10px; font-weight:600; color:rgba(212,175,55,0.58); letter-spacing:0.1em; text-transform:uppercase; }
  .premium-input {
    background:rgba(255,255,255,0.05); border:1px solid rgba(212,175,55,0.2); border-radius:10px;
    padding:10px 13px; font-size:13px; color:#f0e6c8;
    font-family:'DM Sans',sans-serif; outline:none; transition:all 0.3s ease; width:100%;
  }
  .premium-input::placeholder { color:rgba(240,230,200,0.2); }
  .premium-input:focus { border-color:rgba(212,175,55,0.6); background:rgba(212,175,55,0.06); box-shadow:0 0 0 3px rgba(212,175,55,0.08); }
  .premium-input[type="date"]::-webkit-calendar-picker-indicator { filter:invert(0.7) sepia(1) saturate(0.5); opacity:0.5; }
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

  .table-card { flex:1; min-width:320px; background:#fff; border-radius:20px; border:1px solid rgba(212,175,55,0.1); box-shadow:0 4px 20px rgba(0,0,0,0.05); overflow:hidden; position:relative; }
  .table-card::before { content:''; position:absolute; top:0;left:0;right:0; height:3px; background:linear-gradient(90deg,#d4af37,#f5d060,#d4af37); }
  .table-header { padding:20px 24px 15px; border-bottom:1px solid #f4f0eb; }
  .table-card-title { font-family:'Playfair Display',serif; font-weight:700; font-size:16px; color:#1a1614; }
  .table-card-sub { font-size:11px; color:#b0a898; margin-top:2px; }

  table { width:100%; border-collapse:collapse; }
  thead tr { background:#faf7f2; }
  th { padding:11px 22px; text-align:left; font-size:10px; font-weight:700; color:rgba(212,175,55,0.62); letter-spacing:0.12em; text-transform:uppercase; }
  .leave-row { border-top:1px solid #f4f0eb; transition:background 0.18s; }
  .leave-row:hover { background:#faf7f2; }
  td { padding:14px 22px; font-size:13px; color:#3d3530; vertical-align:middle; }
  .status-badge { display:inline-flex; align-items:center; gap:5px; padding:4px 11px; border-radius:999px; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; border:1px solid transparent; }
  .empty-state { text-align:center; padding:44px 24px; color:#b0a898; font-size:14px; }
  .bottom-row { display:flex; gap:22px; flex-wrap:wrap; align-items:flex-start; animation:fadeUp 0.45s ease 0.15s both; }

  .emp-footer { background:#1e1a14; border-top:1px solid rgba(212,175,55,0.1); padding:18px 36px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; }
  .footer-brand { display:flex; align-items:center; gap:7px; }
  .footer-brand-text { font-size:11px; font-weight:600; color:rgba(212,175,55,0.48); letter-spacing:0.12em; text-transform:uppercase; }
  .footer-link { font-size:11px; color:rgba(240,230,200,0.18); text-decoration:none; letter-spacing:0.02em; transition:color 0.2s; }
  .footer-link:hover { color:rgba(212,175,55,0.6); }
  .footer-copy { font-size:11px; color:rgba(240,230,200,0.14); letter-spacing:0.04em; }
`;

const statusConfig = {
  approved: { color:"#16a34a", bg:"#f0fdf4", border:"#bbf7d0", icon:CheckCircle2 },
  pending:  { color:"#b45309", bg:"#fffbeb", border:"#fde68a", icon:Clock },
  rejected: { color:"#dc2626", bg:"#fef2f2", border:"#fecaca", icon:XCircle },
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function useLiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  return now;
}

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [applying, setApplying] = useState(false);
  const now = useLiveClock();

  const userName = localStorage.getItem("name") || localStorage.getItem("userName") || "Employee";
  const initials = userName.split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase() || "E";

  const logout = () => { localStorage.clear(); navigate("/"); };

  const fetchLeaves = async () => {
    try { const res = await API.get("/leaves/my"); setLeaves(res.data); }
    catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const applyLeave = async () => {
    setApplying(true);
    try { await API.post("/leaves/apply", { startDate, endDate, reason }); toast.success("Leave applied successfully"); fetchLeaves(); }
    catch { toast.error("Failed to apply leave"); }
    finally { setApplying(false); }
  };

  useEffect(() => { fetchLeaves(); }, []);

  const dateStr = now.toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" });

  return (
    <>
      <style>{css}</style>
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
                <div className="wb-date">{dateStr}</div>
                <div className="wb-time">{timeStr}</div>
              </div>
            </div>

            <div className="page-header">
              <div className="gold-accent" />
              <h1 className="page-title">My Dashboard</h1>
              <p className="page-subtitle">Track and manage your leave requests</p>
            </div>

            {loading ? <Loader /> : (
              <>
                <DashboardCards leaves={leaves} />

                <div className="apply-card">
                  <div style={{ display:"flex", alignItems:"center", gap:"11px", marginBottom:"3px" }}>
                    <div style={{ width:"32px", height:"32px", borderRadius:"9px", background:"rgba(212,175,55,0.13)", border:"1px solid rgba(212,175,55,0.24)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <CalendarPlus size={15} color="#d4af37" />
                    </div>
                    <div className="apply-card-title">Apply for Leave</div>
                  </div>
                  <p className="apply-card-sub">Submit a new leave request for approval</p>
                  <div style={{ display:"flex", gap:"13px", flexWrap:"wrap", alignItems:"flex-end" }}>
                    <div className="form-field-wrap">
                      <label className="field-label">Start Date</label>
                      <input type="date" className="premium-input" onChange={e => setStartDate(e.target.value)} />
                    </div>
                    <div className="form-field-wrap">
                      <label className="field-label">End Date</label>
                      <input type="date" className="premium-input" onChange={e => setEndDate(e.target.value)} />
                    </div>
                    <div className="form-field-wrap" style={{ flex:1, minWidth:"200px" }}>
                      <label className="field-label">Reason</label>
                      <input className="premium-input" placeholder="Brief reason for leave..." onChange={e => setReason(e.target.value)} />
                    </div>
                    <button className="apply-btn" onClick={applyLeave} disabled={applying}>
                      {applying ? "Submitting..." : "Apply Leave"}
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
                          {leaves.length === 0 ? (
                            <tr><td colSpan={3}><div className="empty-state">
                              <CalendarPlus size={28} color="#d0c8be" style={{ margin:"0 auto 10px", display:"block" }} />
                              No leave requests yet
                            </div></td></tr>
                          ) : leaves.map(leave => {
                            const cfg = statusConfig[leave.status] || statusConfig.pending;
                            const Icon = cfg.icon;
                            return (
                              <tr key={leave._id} className="leave-row">
                                <td style={{ fontWeight:600, whiteSpace:"nowrap", color:"#1a1614" }}>
                                  {leave.startDate.slice(0,10)}<span style={{ color:"#c8b88a", margin:"0 6px" }}>→</span>{leave.endDate.slice(0,10)}
                                </td>
                                <td style={{ color:"#6b6255" }}>{leave.reason}</td>
                                <td>
                                  <span className="status-badge" style={{ background:cfg.bg, color:cfg.color, borderColor:cfg.border }}>
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
          </div>

          <footer className="emp-footer">
            <div className="footer-brand">
              <div style={{ width:"19px",height:"19px",borderRadius:"5px",background:"linear-gradient(135deg,#d4af37,#f5d060)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                <Shield size={10} color="#1a1508" strokeWidth={2.5} />
              </div>
              <span className="footer-brand-text">HR Leave Portal</span>
            </div>
            <div style={{ display:"flex", gap:"16px" }}>
              {["Help Center","Privacy Policy","Terms of Use"].map(item => <a key={item} href="#" className="footer-link">{item}</a>)}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
              <Sparkles size={10} color="rgba(212,175,55,0.35)" />
              <span className="footer-copy">© {new Date().getFullYear()} HR Leave Portal. All rights reserved.</span>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}