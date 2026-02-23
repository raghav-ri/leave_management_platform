import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardCards from "../components/DashboardCards";
import LeaveChart from "../components/LeaveChart";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { CheckCircle2, Clock, XCircle, Users, Shield, Sparkles, UserCog, BarChart3 } from "lucide-react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);} }
  @keyframes pulse-blue { 0%,100%{box-shadow:0 0 0 0 rgba(59,130,246,0.3);}50%{box-shadow:0 0 0 8px rgba(59,130,246,0);} }

  /* MANAGER: cool slate-blue with geometric grid */
  .mgr-page {
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    background-color: #eef2f8;
    background-image:
      radial-gradient(ellipse at 8% 10%, rgba(59,130,246,0.09) 0%, transparent 50%),
      radial-gradient(ellipse at 92% 85%, rgba(99,102,241,0.07) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 50%, rgba(147,197,253,0.04) 0%, transparent 60%),
      url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234f86c6' fill-opacity='0.04' fill-rule='evenodd'%3E%3Cpath d='M0 0h1v40H0zM40 0h1v40h-1zM0 0v1h41V0zM0 40v1h41v-1z'/%3E%3C/g%3E%3C/svg%3E");
  }

  .mgr-content { padding: 28px 36px; flex: 1; }

  /* WELCOME BANNER — blue-navy */
  .welcome-banner {
    background: linear-gradient(125deg, #0f172a 0%, #1e3a5f 55%, #0c1e38 100%);
    border-radius: 20px; border: 1px solid rgba(59,130,246,0.22);
    padding: 26px 32px; margin-bottom: 24px;
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;
    animation: fadeUp 0.35s ease both; position: relative; overflow: hidden;
    box-shadow: 0 8px 32px rgba(15,23,42,0.2);
  }
  .welcome-banner::after {
    content: ''; position: absolute; right: -40px; top: -40px;
    width: 240px; height: 240px; border-radius: 50%;
    background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%);
    pointer-events: none;
  }
  .welcome-banner::before {
    content: ''; position: absolute; left: 0; bottom: 0; right: 0; top: 0;
    background: repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(59,130,246,0.03) 60px, rgba(59,130,246,0.03) 61px);
    pointer-events: none;
  }
  .wb-left { display:flex; align-items:center; gap:16px; position:relative; z-index:1; }
  .user-avatar {
    width:50px; height:50px; border-radius:50%;
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    display:flex; align-items:center; justify-content:center;
    font-family:'Playfair Display',serif; font-size:19px; font-weight:900; color:#fff;
    box-shadow:0 4px 16px rgba(59,130,246,0.45);
    animation:pulse-blue 3s ease-in-out infinite; flex-shrink:0;
  }
  .wb-greeting { font-size:11px; font-weight:600; color:rgba(147,197,253,0.55); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:3px; }
  .wb-name { font-family:'Playfair Display',serif; font-size:21px; font-weight:700; color:#e2eaf8; letter-spacing:-0.02em; margin-bottom:5px; }
  .role-chip {
    display:inline-flex; align-items:center; gap:5px;
    background:rgba(59,130,246,0.12); border:1px solid rgba(59,130,246,0.25);
    border-radius:999px; padding:3px 10px;
    font-size:10px; font-weight:700; color:#93c5fd; letter-spacing:0.07em; text-transform:uppercase;
  }
  .wb-right { position:relative; z-index:1; text-align:right; }
  .wb-date { font-size:12px; color:rgba(226,234,248,0.36); letter-spacing:0.02em; margin-bottom:2px; }
  .wb-time { font-family:'Playfair Display',serif; font-size:26px; font-weight:700; color:#93c5fd; letter-spacing:-0.02em; }

  .page-header { margin-bottom:22px; animation:fadeUp 0.4s ease 0.06s both; }
  .blue-accent { width:40px; height:3px; background:linear-gradient(90deg,#3b82f6,#6366f1); border-radius:2px; margin-bottom:8px; box-shadow:0 2px 8px rgba(59,130,246,0.3); }
  .page-title { font-family:'Playfair Display',serif; font-weight:900; font-size:27px; color:#1e293b; letter-spacing:-0.03em; margin-bottom:3px; }
  .page-subtitle { font-size:13px; color:#64748b; }

  /* TABLE CARD — blue accent */
  .table-card {
    flex:1; min-width:320px; background:#fff;
    border-radius:20px; border:1px solid rgba(59,130,246,0.1);
    box-shadow:0 4px 20px rgba(15,23,42,0.07);
    overflow:hidden; animation:fadeUp 0.4s ease 0.1s both; position:relative;
  }
  .table-card::before { content:''; position:absolute; top:0;left:0;right:0; height:3px; background:linear-gradient(90deg,#3b82f6,#6366f1,#3b82f6); }
  .card-header { padding:20px 24px 15px; border-bottom:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; }
  .card-title { font-family:'Playfair Display',serif; font-weight:700; font-size:16px; color:#1e293b; }
  .card-sub { font-size:11px; color:#94a3b8; margin-top:2px; }

  .filter-tabs { display:flex; gap:3px; background:#f1f5f9; border:1px solid rgba(59,130,246,0.1); padding:3px; border-radius:11px; }
  .filter-tab { padding:6px 14px; border-radius:8px; font-size:11px; font-weight:700; letter-spacing:0.04em; border:none; cursor:pointer; transition:all 0.2s; font-family:'DM Sans',sans-serif; background:transparent; color:#64748b; }
  .filter-tab.active { background:linear-gradient(135deg,#0f172a,#1e3a5f); color:#93c5fd; box-shadow:0 2px 8px rgba(15,23,42,0.18); }

  table { width:100%; border-collapse:collapse; }
  thead tr { background:#f8fafc; }
  th { padding:11px 22px; text-align:left; font-size:10px; font-weight:700; color:rgba(59,130,246,0.65); letter-spacing:0.12em; text-transform:uppercase; }
  .leave-row { border-top:1px solid #f1f5f9; transition:background 0.18s; }
  .leave-row:hover { background:#f8fafc; }
  td { padding:14px 22px; font-size:13px; color:#334155; vertical-align:middle; }

  .avatar-circle {
    width:33px; height:33px; border-radius:50%;
    background:linear-gradient(135deg,#3b82f6,#6366f1);
    display:flex; align-items:center; justify-content:center;
    color:#fff; font-size:12px; font-weight:800;
    box-shadow:0 2px 8px rgba(59,130,246,0.3); flex-shrink:0;
  }

  .status-badge { display:inline-flex; align-items:center; gap:5px; padding:4px 11px; border-radius:999px; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; border:1px solid transparent; }

  .action-btn { padding:6px 13px; border-radius:8px; font-size:11px; font-weight:700; letter-spacing:0.04em; text-transform:uppercase; cursor:pointer; transition:all 0.2s; font-family:'DM Sans',sans-serif; border:1px solid transparent; }
  .action-approve { background:#f0fdf4; color:#16a34a; border-color:#bbf7d0; }
  .action-approve:hover { background:#16a34a; color:#fff; box-shadow:0 4px 12px rgba(22,163,74,0.25); }
  .action-reject { background:#fef2f2; color:#dc2626; border-color:#fecaca; }
  .action-reject:hover { background:#dc2626; color:#fff; box-shadow:0 4px 12px rgba(220,38,38,0.25); }

  .empty-state { text-align:center; padding:44px 24px; color:#94a3b8; font-size:14px; }
  .bottom-row { display:flex; gap:22px; flex-wrap:wrap; align-items:flex-start; animation:fadeUp 0.45s ease 0.15s both; }

  /* FOOTER — blue-navy */
  .mgr-footer { background:#0f172a; border-top:1px solid rgba(59,130,246,0.1); padding:18px 36px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; }
  .footer-brand { display:flex; align-items:center; gap:7px; }
  .footer-brand-text { font-size:11px; font-weight:600; color:rgba(147,197,253,0.45); letter-spacing:0.12em; text-transform:uppercase; }
  .footer-link { font-size:11px; color:rgba(226,234,248,0.18); text-decoration:none; letter-spacing:0.02em; transition:color 0.2s; }
  .footer-link:hover { color:rgba(147,197,253,0.6); }
  .footer-copy { font-size:11px; color:rgba(226,234,248,0.13); letter-spacing:0.04em; }
`;

const statusConfig = {
  approved: { color:"#16a34a", bg:"#f0fdf4", border:"#bbf7d0", icon:CheckCircle2 },
  pending:  { color:"#b45309", bg:"#fffbeb", border:"#fde68a", icon:Clock },
  rejected: { color:"#dc2626", bg:"#fef2f2", border:"#fecaca", icon:XCircle },
};

const filters = [
  { value:"all", label:"All" },
  { value:"pending", label:"Pending" },
  { value:"approved", label:"Approved" },
  { value:"rejected", label:"Rejected" },
];

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

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const now = useLiveClock();

  const userName = localStorage.getItem("name") || localStorage.getItem("userName") || "Manager";
  const initials = userName.split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase() || "M";

  const logout = () => { localStorage.clear(); navigate("/"); };

  const fetchLeaves = async () => {
    try { const res = await API.get("/leaves/all"); setLeaves(res.data); }
    catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const approveLeave = async (id) => {
    try { await API.put(`/leaves/approve/${id}`); toast.success("Leave approved"); fetchLeaves(); }
    catch { toast.error("Failed to approve"); }
  };

  const rejectLeave = async (id) => {
    try { await API.put(`/leaves/reject/${id}`); toast.success("Leave rejected"); fetchLeaves(); }
    catch { toast.error("Failed to reject"); }
  };

  useEffect(() => { fetchLeaves(); }, []);

  const filtered = filter === "all" ? leaves : leaves.filter(l => l.status === filter);
  const dateStr = now.toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" });

  return (
    <>
      <style>{css}</style>
      <div className="mgr-page" style={{ display:"flex" }}>
        <Sidebar logout={logout} />
        <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
          <Navbar />
          <div className="mgr-content">

            {/* WELCOME BANNER */}
            <div className="welcome-banner">
              <div className="wb-left">
                <div className="user-avatar">{initials}</div>
                <div>
                  <div className="wb-greeting">{getGreeting()}</div>
                  <div className="wb-name">{userName}</div>
                  <div className="role-chip"><UserCog size={9} /> Manager</div>
                </div>
              </div>
              <div className="wb-right">
                <div className="wb-date">{dateStr}</div>
                <div className="wb-time">{timeStr}</div>
              </div>
            </div>

            <div className="page-header">
              <div className="blue-accent" />
              <h1 className="page-title">Manager Dashboard</h1>
              <p className="page-subtitle">Review and action employee leave requests</p>
            </div>

            {loading ? <Loader /> : (
              <>
                <DashboardCards leaves={leaves} />

                <div className="bottom-row">
                  <LeaveChart leaves={leaves} />
                  <div className="table-card">
                    <div className="card-header">
                      <div>
                        <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
                          <BarChart3 size={15} color="#3b82f6" />
                          <div className="card-title">All Leave Requests</div>
                        </div>
                        <div className="card-sub">{filtered.length} showing</div>
                      </div>
                      <div className="filter-tabs">
                        {filters.map(f => (
                          <button key={f.value} className={`filter-tab ${filter===f.value?"active":""}`} onClick={() => setFilter(f.value)}>
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ overflowX:"auto" }}>
                      <table>
                        <thead><tr>{["Employee","Date Range","Reason","Status","Actions"].map(h=><th key={h}>{h}</th>)}</tr></thead>
                        <tbody>
                          {filtered.length === 0 ? (
                            <tr><td colSpan={5}><div className="empty-state">
                              <Users size={28} color="#cbd5e1" style={{ margin:"0 auto 10px", display:"block" }} />
                              No requests found
                            </div></td></tr>
                          ) : filtered.map(leave => {
                            const cfg = statusConfig[leave.status] || statusConfig.pending;
                            const Icon = cfg.icon;
                            const initials = ((leave.employee?.name || leave.employee?.email || "E")[0]).toUpperCase();
                            return (
                              <tr key={leave._id} className="leave-row">
                                <td><div className="avatar-circle">{initials}</div></td>
                                <td style={{ fontWeight:600, whiteSpace:"nowrap", color:"#1e293b" }}>
                                  {leave.startDate.slice(0,10)}<span style={{ color:"#93c5fd", margin:"0 6px" }}>→</span>{leave.endDate.slice(0,10)}
                                </td>
                                <td style={{ maxWidth:"160px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", color:"#64748b" }}>{leave.reason}</td>
                                <td>
                                  <span className="status-badge" style={{ background:cfg.bg, color:cfg.color, borderColor:cfg.border }}>
                                    <Icon size={10} />{leave.status}
                                  </span>
                                </td>
                                <td>
                                  {leave.status === "pending" ? (
                                    <div style={{ display:"flex", gap:"7px" }}>
                                      <button className="action-btn action-approve" onClick={() => approveLeave(leave._id)}>Approve</button>
                                      <button className="action-btn action-reject" onClick={() => rejectLeave(leave._id)}>Reject</button>
                                    </div>
                                  ) : <span style={{ fontSize:"13px", color:"#cbd5e1" }}>—</span>}
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

          <footer className="mgr-footer">
            <div className="footer-brand">
              <div style={{ width:"19px",height:"19px",borderRadius:"5px",background:"linear-gradient(135deg,#3b82f6,#6366f1)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                <Shield size={10} color="#fff" strokeWidth={2.5} />
              </div>
              <span className="footer-brand-text">HR Leave Portal</span>
            </div>
            <div style={{ display:"flex", gap:"16px" }}>
              {["Help Center","Privacy Policy","Terms of Use"].map(item => <a key={item} href="#" className="footer-link">{item}</a>)}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
              <Sparkles size={10} color="rgba(147,197,253,0.35)" />
              <span className="footer-copy">© {new Date().getFullYear()} HR Leave Portal. All rights reserved.</span>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}