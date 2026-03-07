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
  CheckCircle2, Clock, XCircle, Users, Shield, Sparkles, UserCog,
  BarChart3, Receipt, DollarSign, Sun, Moon, CalendarPlus, Upload,
  SendHorizonal, Info
} from "lucide-react";

/* ─────────────────────────── CSS ─────────────────────────── */
const makeCSS = (dark) => `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);} }
  @keyframes pulse-blue { 0%,100%{box-shadow:0 0 0 0 rgba(59,130,246,0.3);}50%{box-shadow:0 0 0 8px rgba(59,130,246,0);} }

  .mgr-page {
    min-height:100vh; font-family:'DM Sans',sans-serif;
    background-color:${dark?"#0b0f17":"#eef2f8"};
    background-image:
      radial-gradient(ellipse at 8% 10%,rgba(59,130,246,0.09) 0%,transparent 50%),
      radial-gradient(ellipse at 92% 85%,rgba(99,102,241,0.07) 0%,transparent 50%),
      url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234f86c6' fill-opacity='0.04' fill-rule='evenodd'%3E%3Cpath d='M0 0h1v40H0zM40 0h1v40h-1zM0 0v1h41V0zM0 40v1h41v-1z'/%3E%3C/g%3E%3C/svg%3E");
    transition: background-color 0.3s ease;
  }

  .mgr-content { padding:28px 36px; flex:1; }
  @media(max-width:768px){ .mgr-content{ padding:16px 14px; } }

  /* WELCOME BANNER */
  .welcome-banner {
    background:linear-gradient(125deg,#0f172a 0%,#1e3a5f 55%,#0c1e38 100%);
    border-radius:20px; border:1px solid rgba(59,130,246,0.22);
    padding:26px 32px; margin-bottom:24px;
    display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:14px;
    animation:fadeUp 0.35s ease both; position:relative; overflow:hidden;
    box-shadow:0 8px 32px rgba(15,23,42,0.2);
  }
  .welcome-banner::after { content:''; position:absolute; right:-40px; top:-40px; width:240px; height:240px; border-radius:50%; background:radial-gradient(circle,rgba(59,130,246,0.1) 0%,transparent 70%); pointer-events:none; }
  .welcome-banner::before { content:''; position:absolute; left:0; bottom:0; right:0; top:0; background:repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(59,130,246,0.03) 60px,rgba(59,130,246,0.03) 61px); pointer-events:none; }
  .wb-left { display:flex; align-items:center; gap:16px; position:relative; z-index:1; }
  .user-avatar { width:50px; height:50px; border-radius:50%; background:linear-gradient(135deg,#3b82f6,#6366f1); display:flex; align-items:center; justify-content:center; font-family:'Playfair Display',serif; font-size:19px; font-weight:900; color:#fff; box-shadow:0 4px 16px rgba(59,130,246,0.45); animation:pulse-blue 3s ease-in-out infinite; flex-shrink:0; }
  .wb-greeting { font-size:11px; font-weight:600; color:rgba(147,197,253,0.55); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:3px; }
  .wb-name { font-family:'Playfair Display',serif; font-size:21px; font-weight:700; color:#e2eaf8; letter-spacing:-0.02em; margin-bottom:5px; }
  .role-chip { display:inline-flex; align-items:center; gap:5px; background:rgba(59,130,246,0.12); border:1px solid rgba(59,130,246,0.25); border-radius:999px; padding:3px 10px; font-size:10px; font-weight:700; color:#93c5fd; letter-spacing:0.07em; text-transform:uppercase; }
  .wb-right { position:relative; z-index:1; text-align:right; display:flex; align-items:center; gap:16px; }
  .wb-date { font-size:12px; color:rgba(226,234,248,0.36); letter-spacing:0.02em; margin-bottom:2px; }
  .wb-time { font-family:'Playfair Display',serif; font-size:26px; font-weight:700; color:#93c5fd; letter-spacing:-0.02em; }

  /* THEME TOGGLE */
  .theme-toggle { width:42px; height:24px; border-radius:999px; border:1px solid rgba(59,130,246,0.3); background:${dark?"rgba(59,130,246,0.18)":"rgba(59,130,246,0.08)"}; cursor:pointer; position:relative; transition:all 0.3s; flex-shrink:0; display:flex; align-items:center; padding:2px; }
  .toggle-knob { width:18px; height:18px; border-radius:50%; background:linear-gradient(135deg,#3b82f6,#6366f1); position:absolute; transition:all 0.3s; left:${dark?"calc(100% - 20px)":"2px"}; display:flex; align-items:center; justify-content:center; }

  /* SECTION TABS */
  .section-tabs { display:flex; gap:4px; margin-bottom:22px; background:${dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.04)"}; border-radius:12px; padding:4px; width:fit-content; animation:fadeUp 0.4s ease 0.05s both; flex-wrap:wrap; }
  .section-tab { padding:8px 20px; border-radius:9px; font-size:12px; font-weight:700; letter-spacing:0.05em; border:none; cursor:pointer; transition:all 0.22s; font-family:'DM Sans',sans-serif; color:${dark?"rgba(147,197,253,0.4)":"#64748b"}; background:transparent; }
  .section-tab.active { background:linear-gradient(135deg,#0f172a,#1e3a5f); color:#93c5fd; box-shadow:0 2px 8px rgba(15,23,42,0.25); }

  .page-header { margin-bottom:22px; animation:fadeUp 0.4s ease 0.06s both; }
  .blue-accent { width:40px; height:3px; background:linear-gradient(90deg,#3b82f6,#6366f1); border-radius:2px; margin-bottom:8px; box-shadow:0 2px 8px rgba(59,130,246,0.3); }
  .page-title { font-family:'Playfair Display',serif; font-weight:900; font-size:27px; color:${dark?"#e2eaf8":"#1e293b"}; letter-spacing:-0.03em; margin-bottom:3px; }
  .page-subtitle { font-size:13px; color:${dark?"#475569":"#64748b"}; }

  /* TABLE CARD */
  .table-card { flex:1; min-width:0; background:${dark?"#111827":"#fff"}; border-radius:20px; border:1px solid ${dark?"rgba(59,130,246,0.1)":"rgba(59,130,246,0.1)"}; box-shadow:0 4px 20px rgba(15,23,42,0.07); overflow:hidden; animation:fadeUp 0.4s ease 0.1s both; position:relative; }
  .table-card::before { content:''; position:absolute; top:0;left:0;right:0; height:3px; background:linear-gradient(90deg,#3b82f6,#6366f1,#3b82f6); }
  .card-header { padding:20px 24px 15px; border-bottom:1px solid ${dark?"rgba(59,130,246,0.08)":"#f1f5f9"}; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; }
  .card-title { font-family:'Playfair Display',serif; font-weight:700; font-size:16px; color:${dark?"#e2eaf8":"#1e293b"}; }
  .card-sub { font-size:11px; color:${dark?"#475569":"#94a3b8"}; margin-top:2px; }

  .filter-tabs { display:flex; gap:3px; background:${dark?"rgba(255,255,255,0.04)":"#f1f5f9"}; border:1px solid rgba(59,130,246,0.1); padding:3px; border-radius:11px; flex-wrap:wrap; }
  .filter-tab { padding:6px 14px; border-radius:8px; font-size:11px; font-weight:700; letter-spacing:0.04em; border:none; cursor:pointer; transition:all 0.2s; font-family:'DM Sans',sans-serif; background:transparent; color:${dark?"rgba(147,197,253,0.5)":"#64748b"}; }
  .filter-tab.active { background:linear-gradient(135deg,#0f172a,#1e3a5f); color:#93c5fd; box-shadow:0 2px 8px rgba(15,23,42,0.18); }

  table { width:100%; border-collapse:collapse; }
  thead tr { background:${dark?"rgba(255,255,255,0.03)":"#f8fafc"}; }
  th { padding:11px 22px; text-align:left; font-size:10px; font-weight:700; color:rgba(59,130,246,0.65); letter-spacing:0.12em; text-transform:uppercase; white-space:nowrap; }
  .leave-row { border-top:1px solid ${dark?"rgba(255,255,255,0.04)":"#f1f5f9"}; transition:background 0.18s; }
  .leave-row:hover { background:${dark?"rgba(59,130,246,0.04)":"#f8fafc"}; }
  td { padding:14px 22px; font-size:13px; color:${dark?"#94a3b8":"#334155"}; vertical-align:middle; }

  .avatar-circle { width:33px; height:33px; border-radius:50%; background:linear-gradient(135deg,#3b82f6,#6366f1); display:flex; align-items:center; justify-content:center; color:#fff; font-size:12px; font-weight:800; box-shadow:0 2px 8px rgba(59,130,246,0.3); flex-shrink:0; }
  .status-badge { display:inline-flex; align-items:center; gap:5px; padding:4px 11px; border-radius:999px; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; border:1px solid transparent; }
  .action-btn { padding:6px 13px; border-radius:8px; font-size:11px; font-weight:700; letter-spacing:0.04em; text-transform:uppercase; cursor:pointer; transition:all 0.2s; font-family:'DM Sans',sans-serif; border:1px solid transparent; }
  .action-approve { background:#f0fdf4; color:#16a34a; border-color:#bbf7d0; }
  .action-approve:hover { background:#16a34a; color:#fff; box-shadow:0 4px 12px rgba(22,163,74,0.25); }
  .action-reject { background:#fef2f2; color:#dc2626; border-color:#fecaca; }
  .action-reject:hover { background:#dc2626; color:#fff; box-shadow:0 4px 12px rgba(220,38,38,0.25); }
  .empty-state { text-align:center; padding:44px 24px; color:${dark?"#334155":"#94a3b8"}; font-size:14px; }
  .bottom-row { display:flex; gap:22px; flex-wrap:wrap; align-items:flex-start; animation:fadeUp 0.45s ease 0.15s both; }

  /* MY REQUEST FORM CARDS */
  .request-form-card {
    background:${dark?"linear-gradient(135deg,#0f172a 0%,#1a2744 60%,#0f172a 100%)":"linear-gradient(135deg,#fff 0%,#f0f6ff 100%)"};
    border-radius:20px; border:1px solid rgba(59,130,246,0.2);
    box-shadow:0 8px 32px rgba(15,23,42,0.1),inset 0 1px 0 rgba(59,130,246,0.07);
    padding:24px 30px; margin-bottom:22px;
    animation:fadeUp 0.4s ease 0.08s both; position:relative; overflow:hidden;
  }
  .request-form-card::before { content:''; position:absolute; top:-50%; right:-15%; width:240px; height:240px; border-radius:50%; background:radial-gradient(circle,rgba(59,130,246,0.06) 0%,transparent 70%); pointer-events:none; }
  .form-card-title { font-family:'Playfair Display',serif; font-weight:700; font-size:16px; color:${dark?"#e2eaf8":"#1e293b"}; margin-bottom:3px; }
  .form-card-sub { font-size:12px; color:${dark?"rgba(147,197,253,0.42)":"#94a3b8"}; margin-bottom:20px; }

  .field-label { font-size:10px; font-weight:600; color:${dark?"rgba(59,130,246,0.65)":"#60a5fa"}; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:5px; display:block; }
  .form-field-wrap { display:flex; flex-direction:column; gap:5px; }
  .premium-input {
    background:${dark?"rgba(255,255,255,0.05)":"rgba(255,255,255,0.9)"}; border:1px solid rgba(59,130,246,0.2); border-radius:10px;
    padding:10px 13px; font-size:13px; color:${dark?"#e2eaf8":"#1e293b"}; font-family:'DM Sans',sans-serif; outline:none; transition:all 0.3s ease; width:100%;
  }
  .premium-input::placeholder { color:${dark?"rgba(147,197,253,0.25)":"#94a3b8"}; }
  .premium-input:focus { border-color:rgba(59,130,246,0.55); background:${dark?"rgba(59,130,246,0.08)":"rgba(59,130,246,0.04)"}; box-shadow:0 0 0 3px rgba(59,130,246,0.1); }
  .premium-input[type="date"]::-webkit-calendar-picker-indicator { filter:${dark?"invert(0.7)":"none"} opacity(0.5); }
  .premium-input option { background:${dark?"#0f172a":"#f8fafc"}; color:${dark?"#e2eaf8":"#1e293b"}; }
  .form-row { display:flex; gap:13px; flex-wrap:wrap; align-items:flex-end; }
  @media(max-width:600px){ .form-row{ flex-direction:column; } .form-row .form-field-wrap{ width:100% !important; } }

  .submit-btn {
    background:linear-gradient(135deg,#3b82f6,#6366f1,#3b82f6); background-size:200% auto;
    color:#fff; border:none; border-radius:10px; padding:11px 22px;
    font-size:12px; font-weight:700; font-family:'DM Sans',sans-serif;
    letter-spacing:0.06em; text-transform:uppercase; cursor:pointer; white-space:nowrap;
    box-shadow:0 4px 16px rgba(59,130,246,0.3); transition:all 0.35s ease; margin-top:22px;
    display:inline-flex; align-items:center; gap:6px;
  }
  .submit-btn:hover:not(:disabled) { background-position:right center; transform:translateY(-2px); box-shadow:0 8px 24px rgba(59,130,246,0.45); }
  .submit-btn:disabled { opacity:0.5; cursor:not-allowed; transform:none; }

  /* ADMIN ROUTING NOTICE */
  .admin-notice {
    display:inline-flex; align-items:center; gap:8px;
    background:${dark?"rgba(59,130,246,0.1)":"rgba(59,130,246,0.06)"}; border:1px solid rgba(59,130,246,0.2);
    border-radius:10px; padding:10px 16px; margin-bottom:20px;
    font-size:12px; color:${dark?"#93c5fd":"#3b82f6"}; font-weight:600; animation:fadeUp 0.4s ease 0.05s both;
  }

  /* FOOTER */
  .mgr-footer { background:#0f172a; border-top:1px solid rgba(59,130,246,0.1); padding:18px 36px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; }
  .footer-brand { display:flex; align-items:center; gap:7px; }
  .footer-brand-text { font-size:11px; font-weight:600; color:rgba(147,197,253,0.45); letter-spacing:0.12em; text-transform:uppercase; }
  .footer-link { font-size:11px; color:rgba(226,234,248,0.18); text-decoration:none; letter-spacing:0.02em; transition:color 0.2s; }
  .footer-link:hover { color:rgba(147,197,253,0.6); }
  .footer-copy { font-size:11px; color:rgba(226,234,248,0.13); letter-spacing:0.04em; }

  @media(max-width:768px){
    .mgr-footer { flex-direction:column; text-align:center; padding:14px; gap:8px; }
    .welcome-banner { padding:18px 18px; }
    .wb-time { font-size:18px; }
    .bottom-row { flex-direction:column; }
    .section-tabs { width:100%; }
    .section-tab { flex:1; text-align:center; padding:8px 10px; }
    .filter-tabs { width:100%; justify-content:center; }
    th, td { padding:10px 12px; }
    .request-form-card { padding:18px 16px; }
  }
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

const REIMB_CATEGORIES = ["Travel","Food & Meals","Office Supplies","Medical","Training & Education","Internet / Phone","Other"];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [reimbursements, setReimbursements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [reimbFilter, setReimbFilter] = useState("all");
  const [now, setNow] = useState(new Date());
  const [activeTab, setActiveTab] = useState("leave"); // "leave" | "reimbursement" | "my-leave" | "my-reimbursement"
  const [dark, setDark] = useState(() => localStorage.getItem("mgr-theme") === "dark");

  // My Requests — data
  const [myLeaves, setMyLeaves] = useState([]);
  const [myReimbursements, setMyReimbursements] = useState([]);

  // My Leave form
  const [mStartDate, setMStartDate] = useState("");
  const [mEndDate, setMEndDate] = useState("");
  const [mReason, setMReason] = useState("");
  const [mLeaveType, setMLeaveType] = useState("Annual");
  const [applyingLeave, setApplyingLeave] = useState(false);

  // My Reimbursement form
  const [mRDate, setMRDate] = useState("");
  const [mRCategory, setMRCategory] = useState("");
  const [mRAmount, setMRAmount] = useState("");
  const [mRDescription, setMRDescription] = useState("");
  const [submittingReimb, setSubmittingReimb] = useState(false);

  const userName = localStorage.getItem("name") || "Manager";
  const initials = userName.split(" ").map(n=>n[0]).slice(0,2).join("").toUpperCase() || "M";
  const logout = () => { localStorage.clear(); navigate("/"); };

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("mgr-theme", next ? "dark" : "light");
  };

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const fetchLeaves = async () => {
    try { const res = await API.get("/leaves/all"); setLeaves(res.data); }
    catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const fetchReimbursements = async () => {
    try { const res = await API.get("/reimbursements/all"); setReimbursements(res.data); }
    catch { /* silently fail if endpoint not ready */ }
  };

  // Fetch manager's own requests
  const fetchMyLeaves = async () => {
    try { const res = await API.get("/leaves/my"); setMyLeaves(res.data); }
    catch { /* silently fail */ }
  };

  const fetchMyReimbursements = async () => {
    try { const res = await API.get("/reimbursements/my"); setMyReimbursements(res.data); }
    catch { /* silently fail */ }
  };

  const approveLeave = async (id) => {
    try { await API.put(`/leaves/approve/${id}`); toast.success("Leave approved"); fetchLeaves(); }
    catch { toast.error("Failed to approve"); }
  };

  const rejectLeave = async (id) => {
    try { await API.put(`/leaves/reject/${id}`); toast.success("Leave rejected"); fetchLeaves(); }
    catch { toast.error("Failed to reject"); }
  };

  const approveReimbursement = async (id) => {
    try { await API.put(`/reimbursements/approve/${id}`); toast.success("Reimbursement approved"); fetchReimbursements(); }
    catch { toast.error("Failed to approve reimbursement"); }
  };

  const rejectReimbursement = async (id) => {
    try { await API.put(`/reimbursements/reject/${id}`); toast.success("Reimbursement rejected"); fetchReimbursements(); }
    catch { toast.error("Failed to reject reimbursement"); }
  };

  // Submit manager's own leave → routes to admin for approval
  const applyMyLeave = async () => {
    if (!mStartDate || !mEndDate || !mReason) { toast.error("Please fill all fields"); return; }
    setApplyingLeave(true);
    try {
      await API.post("/leaves/apply", { startDate: mStartDate, endDate: mEndDate, reason: mReason, leaveType: mLeaveType });
      toast.success("Leave request sent to Admin for approval");
      setMStartDate(""); setMEndDate(""); setMReason(""); setMLeaveType("Annual");
      fetchMyLeaves();
    } catch { toast.error("Failed to submit leave request"); }
    finally { setApplyingLeave(false); }
  };

  // Submit manager's own reimbursement → routes to admin for approval
  const submitMyReimbursement = async () => {
    if (!mRAmount || !mRCategory || !mRDescription || !mRDate) { toast.error("Please fill all reimbursement fields"); return; }
    setSubmittingReimb(true);
    try {
      await API.post("/reimbursements/apply", { amount: mRAmount, category: mRCategory, description: mRDescription, date: mRDate });
      toast.success("Reimbursement request sent to Admin for approval");
      setMRAmount(""); setMRCategory(""); setMRDescription(""); setMRDate("");
      fetchMyReimbursements();
    } catch { toast.error("Failed to submit reimbursement request"); }
    finally { setSubmittingReimb(false); }
  };

  useEffect(() => {
    fetchLeaves();
    fetchReimbursements();
    fetchMyLeaves();
    fetchMyReimbursements();
  }, []);

  const filteredLeaves = filter === "all" ? leaves : leaves.filter(l=>l.status===filter);
  const filteredReimb = reimbFilter === "all" ? reimbursements : reimbursements.filter(r=>r.status===reimbFilter);
  const dateStr = now.toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" });

  const myPendingCount = myLeaves.filter(l=>l.status==="pending").length + myReimbursements.filter(r=>r.status==="pending").length;

  return (
    <>
      <style>{makeCSS(dark)}</style>
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
                <div style={{ textAlign:"right" }}>
                  <div className="wb-date">{dateStr}</div>
                  <div className="wb-time">{timeStr}</div>
                </div>
                <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
                  <div className="toggle-knob">
                    {dark ? <Moon size={10} color="#fff" /> : <Sun size={10} color="#fff" />}
                  </div>
                </button>
              </div>
            </div>

            <div className="page-header">
              <div className="blue-accent" />
              <h1 className="page-title">Manager Dashboard</h1>
              <p className="page-subtitle">Review employee requests & manage your own</p>
            </div>

            {/* SECTION TABS */}
            <div className="section-tabs">
              <button className={`section-tab ${activeTab==="leave"?"active":""}`} onClick={()=>setActiveTab("leave")}>
                📅 Leave Requests
              </button>
              <button className={`section-tab ${activeTab==="reimbursement"?"active":""}`} onClick={()=>setActiveTab("reimbursement")}>
                💰 Reimbursements
              </button>
              <button className={`section-tab ${activeTab==="my-leave"?"active":""}`} onClick={()=>setActiveTab("my-leave")} style={{ position:"relative" }}>
                🏖️ My Leave
                {myLeaves.filter(l=>l.status==="pending").length > 0 && (
                  <span style={{ position:"absolute",top:"4px",right:"6px",width:"8px",height:"8px",borderRadius:"50%",background:"#f59e0b",border:"1.5px solid #0f172a" }} />
                )}
              </button>
              <button className={`section-tab ${activeTab==="my-reimbursement"?"active":""}`} onClick={()=>setActiveTab("my-reimbursement")} style={{ position:"relative" }}>
                🧾 My Reimbursement
                {myReimbursements.filter(r=>r.status==="pending").length > 0 && (
                  <span style={{ position:"absolute",top:"4px",right:"6px",width:"8px",height:"8px",borderRadius:"50%",background:"#f59e0b",border:"1.5px solid #0f172a" }} />
                )}
              </button>
            </div>

            {loading ? <Loader /> : (
              <>
                {/* ── EMPLOYEE LEAVE TAB ── */}
                {activeTab === "leave" && (
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
                            <div className="card-sub">{filteredLeaves.length} showing</div>
                          </div>
                          <div className="filter-tabs">
                            {filters.map(f=>(
                              <button key={f.value} className={`filter-tab ${filter===f.value?"active":""}`} onClick={()=>setFilter(f.value)}>
                                {f.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div style={{ overflowX:"auto" }}>
                          <table>
                            <thead><tr>{["Employee","Date Range","Reason","Status","Actions"].map(h=><th key={h}>{h}</th>)}</tr></thead>
                            <tbody>
                              {filteredLeaves.length===0 ? (
                                <tr><td colSpan={5}><div className="empty-state">
                                  <Users size={28} color="#cbd5e1" style={{ margin:"0 auto 10px",display:"block" }} />
                                  No requests found
                                </div></td></tr>
                              ) : filteredLeaves.map(leave => {
                                const cfg = statusConfig[leave.status] || statusConfig.pending;
                                const Icon = cfg.icon;
                                const av = ((leave.employee?.name || leave.employee?.email || "E")[0]).toUpperCase();
                                return (
                                  <tr key={leave._id} className="leave-row">
                                    <td>
                                      <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                                        <div className="avatar-circle">{av}</div>
                                        <span style={{ fontSize:"12px",fontWeight:600 }}>{leave.employee?.name || leave.employee?.email || "—"}</span>
                                      </div>
                                    </td>
                                    <td style={{ fontWeight:600,whiteSpace:"nowrap",color:"#1e293b" }}>
                                      {leave.startDate.slice(0,10)}<span style={{ color:"#93c5fd",margin:"0 6px" }}>→</span>{leave.endDate.slice(0,10)}
                                    </td>
                                    <td style={{ maxWidth:"160px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{leave.reason}</td>
                                    <td>
                                      <span className="status-badge" style={{ background:cfg.bg,color:cfg.color,borderColor:cfg.border }}>
                                        <Icon size={10} />{leave.status}
                                      </span>
                                    </td>
                                    <td>
                                      {leave.status==="pending" ? (
                                        <div style={{ display:"flex", gap:"7px", flexWrap:"wrap" }}>
                                          <button className="action-btn action-approve" onClick={()=>approveLeave(leave._id)}>Approve</button>
                                          <button className="action-btn action-reject" onClick={()=>rejectLeave(leave._id)}>Reject</button>
                                        </div>
                                      ) : <span style={{ fontSize:"13px",color:"#cbd5e1" }}>—</span>}
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

                {/* ── EMPLOYEE REIMBURSEMENT TAB ── */}
                {activeTab === "reimbursement" && (
                  <div className="table-card" style={{ animation:"fadeUp 0.4s ease 0.1s both" }}>
                    <div className="card-header">
                      <div>
                        <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
                          <Receipt size={15} color="#3b82f6" />
                          <div className="card-title">All Reimbursement Requests</div>
                        </div>
                        <div className="card-sub">
                          {filteredReimb.length} showing
                          {reimbursements.filter(r=>r.status==="pending").length > 0 && (
                            <span style={{ marginLeft:"10px",background:"#fffbeb",color:"#b45309",border:"1px solid #fde68a",borderRadius:"999px",padding:"1px 8px",fontSize:"10px",fontWeight:700 }}>
                              {reimbursements.filter(r=>r.status==="pending").length} pending
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:"12px", flexWrap:"wrap" }}>
                        {filteredReimb.filter(r=>r.status==="approved").length > 0 && (
                          <div style={{ fontSize:"12px",color:"#3b82f6",fontWeight:700 }}>
                            Approved: ₹{filteredReimb.filter(r=>r.status==="approved").reduce((s,r)=>s+Number(r.amount||0),0).toLocaleString()}
                          </div>
                        )}
                        <div className="filter-tabs">
                          {filters.map(f=>(
                            <button key={f.value} className={`filter-tab ${reimbFilter===f.value?"active":""}`} onClick={()=>setReimbFilter(f.value)}>
                              {f.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div style={{ overflowX:"auto" }}>
                      <table>
                        <thead><tr>{["Employee","Date","Category","Description","Amount","Status","Actions"].map(h=><th key={h}>{h}</th>)}</tr></thead>
                        <tbody>
                          {filteredReimb.length===0 ? (
                            <tr><td colSpan={7}><div className="empty-state">
                              <Receipt size={28} color="#cbd5e1" style={{ margin:"0 auto 10px",display:"block" }} />
                              No reimbursement requests found
                            </div></td></tr>
                          ) : filteredReimb.map(r => {
                            const cfg = statusConfig[r.status] || statusConfig.pending;
                            const Icon = cfg.icon;
                            const av = ((r.employee?.name || r.employee?.email || "E")[0]).toUpperCase();
                            return (
                              <tr key={r._id} className="leave-row">
                                <td>
                                  <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                                    <div className="avatar-circle">{av}</div>
                                    <span style={{ fontSize:"12px",fontWeight:600 }}>{r.employee?.name || r.employee?.email || "—"}</span>
                                  </div>
                                </td>
                                <td style={{ whiteSpace:"nowrap" }}>{r.date?.slice(0,10) || "—"}</td>
                                <td>
                                  <span style={{ display:"inline-flex",alignItems:"center",gap:"5px",background:"rgba(59,130,246,0.08)",border:"1px solid rgba(59,130,246,0.2)",borderRadius:"6px",padding:"2px 8px",fontSize:"11px",color:"#3b82f6",fontWeight:600 }}>
                                    {r.category}
                                  </span>
                                </td>
                                <td style={{ maxWidth:"160px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{r.description}</td>
                                <td style={{ fontWeight:700,color:"#3b82f6",whiteSpace:"nowrap" }}>₹{Number(r.amount).toLocaleString()}</td>
                                <td>
                                  <span className="status-badge" style={{ background:cfg.bg,color:cfg.color,borderColor:cfg.border }}>
                                    <Icon size={10} />{r.status}
                                  </span>
                                </td>
                                <td>
                                  {r.status==="pending" ? (
                                    <div style={{ display:"flex", gap:"7px", flexWrap:"wrap" }}>
                                      <button className="action-btn action-approve" onClick={()=>approveReimbursement(r._id)}>Approve</button>
                                      <button className="action-btn action-reject" onClick={()=>rejectReimbursement(r._id)}>Reject</button>
                                    </div>
                                  ) : <span style={{ fontSize:"13px",color:"#cbd5e1" }}>—</span>}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ── MY LEAVE TAB ── */}
                {activeTab === "my-leave" && (
                  <>
                    {/* Admin routing notice */}
                    <div className="admin-notice">
                      <Info size={14} />
                      Your leave requests are sent directly to <strong style={{ marginLeft:4, marginRight:4 }}>Admin</strong> for approval.
                    </div>

                    {/* Leave Application Form */}
                    <div className="request-form-card">
                      <div style={{ display:"flex", alignItems:"center", gap:"11px", marginBottom:"3px" }}>
                        <div style={{ width:"32px",height:"32px",borderRadius:"9px",background:"rgba(59,130,246,0.12)",border:"1px solid rgba(59,130,246,0.22)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                          <CalendarPlus size={15} color="#3b82f6" />
                        </div>
                        <div className="form-card-title">Apply for Leave</div>
                      </div>
                      <p className="form-card-sub">Submit a leave request — it will go to Admin for approval</p>
                      <div className="form-row">
                        <div className="form-field-wrap">
                          <label className="field-label">Leave Type</label>
                          <select className="premium-input" style={{ width:"160px" }} value={mLeaveType} onChange={e=>setMLeaveType(e.target.value)}>
                            {["Annual","Sick","Emergency","Casual","Unpaid"].map(t=><option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                        <div className="form-field-wrap">
                          <label className="field-label">Start Date</label>
                          <input type="date" className="premium-input" style={{ width:"160px" }} value={mStartDate} onChange={e=>setMStartDate(e.target.value)} />
                        </div>
                        <div className="form-field-wrap">
                          <label className="field-label">End Date</label>
                          <input type="date" className="premium-input" style={{ width:"160px" }} value={mEndDate} onChange={e=>setMEndDate(e.target.value)} />
                        </div>
                        <div className="form-field-wrap" style={{ flex:1, minWidth:"200px" }}>
                          <label className="field-label">Reason</label>
                          <input className="premium-input" placeholder="Reason for leave…" value={mReason} onChange={e=>setMReason(e.target.value)} />
                        </div>
                        <button className="submit-btn" onClick={applyMyLeave} disabled={applyingLeave}>
                          <SendHorizonal size={12} />
                          {applyingLeave ? "Submitting…" : "Send to Admin"}
                        </button>
                      </div>
                    </div>

                    {/* My Leave History */}
                    <div className="table-card" style={{ animation:"fadeUp 0.4s ease 0.15s both" }}>
                      <div className="card-header">
                        <div>
                          <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
                            <BarChart3 size={15} color="#3b82f6" />
                            <div className="card-title">My Leave History</div>
                          </div>
                          <div className="card-sub">{myLeaves.length} total requests</div>
                        </div>
                      </div>
                      <div style={{ overflowX:"auto" }}>
                        <table>
                          <thead><tr>{["Date Range","Type","Reason","Status"].map(h=><th key={h}>{h}</th>)}</tr></thead>
                          <tbody>
                            {myLeaves.length===0 ? (
                              <tr><td colSpan={4}><div className="empty-state">
                                <CalendarPlus size={28} color="#cbd5e1" style={{ margin:"0 auto 10px",display:"block" }} />
                                No leave requests yet
                              </div></td></tr>
                            ) : myLeaves.map(leave => {
                              const cfg = statusConfig[leave.status] || statusConfig.pending;
                              const Icon = cfg.icon;
                              return (
                                <tr key={leave._id} className="leave-row">
                                  <td style={{ fontWeight:600,whiteSpace:"nowrap" }}>
                                    {leave.startDate?.slice(0,10)}<span style={{ color:"#93c5fd",margin:"0 6px" }}>→</span>{leave.endDate?.slice(0,10)}
                                  </td>
                                  <td>
                                    <span style={{ display:"inline-flex",alignItems:"center",background:"rgba(59,130,246,0.08)",border:"1px solid rgba(59,130,246,0.18)",borderRadius:"6px",padding:"2px 9px",fontSize:"11px",color:"#3b82f6",fontWeight:600 }}>
                                      {leave.leaveType || "Annual"}
                                    </span>
                                  </td>
                                  <td style={{ maxWidth:"200px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{leave.reason}</td>
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
                  </>
                )}

                {/* ── MY REIMBURSEMENT TAB ── */}
                {activeTab === "my-reimbursement" && (
                  <>
                    {/* Admin routing notice */}
                    <div className="admin-notice">
                      <Info size={14} />
                      Your reimbursement requests are sent directly to <strong style={{ marginLeft:4, marginRight:4 }}>Admin</strong> for approval.
                    </div>

                    {/* Reimbursement Form */}
                    <div className="request-form-card">
                      <div style={{ display:"flex", alignItems:"center", gap:"11px", marginBottom:"3px" }}>
                        <div style={{ width:"32px",height:"32px",borderRadius:"9px",background:"rgba(59,130,246,0.12)",border:"1px solid rgba(59,130,246,0.22)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                          <Receipt size={15} color="#3b82f6" />
                        </div>
                        <div className="form-card-title">Submit Reimbursement</div>
                      </div>
                      <p className="form-card-sub">Request reimbursement for work-related expenses — Admin will review and approve</p>
                      <div className="form-row">
                        <div className="form-field-wrap">
                          <label className="field-label">Expense Date</label>
                          <input type="date" className="premium-input" style={{ width:"160px" }} value={mRDate} onChange={e=>setMRDate(e.target.value)} />
                        </div>
                        <div className="form-field-wrap">
                          <label className="field-label">Category</label>
                          <select className="premium-input" style={{ width:"170px" }} value={mRCategory} onChange={e=>setMRCategory(e.target.value)}>
                            <option value="">Select category…</option>
                            {REIMB_CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div className="form-field-wrap">
                          <label className="field-label">Amount (₹)</label>
                          <input type="number" min="1" className="premium-input" style={{ width:"130px" }} placeholder="0.00" value={mRAmount} onChange={e=>setMRAmount(e.target.value)} />
                        </div>
                        <div className="form-field-wrap" style={{ flex:1, minWidth:"200px" }}>
                          <label className="field-label">Description</label>
                          <input className="premium-input" placeholder="Describe the expense…" value={mRDescription} onChange={e=>setMRDescription(e.target.value)} />
                        </div>
                        <button className="submit-btn" onClick={submitMyReimbursement} disabled={submittingReimb}>
                          <Upload size={12} />
                          {submittingReimb ? "Submitting…" : "Send to Admin"}
                        </button>
                      </div>
                    </div>

                    {/* My Reimbursement History */}
                    <div className="table-card" style={{ animation:"fadeUp 0.4s ease 0.15s both" }}>
                      <div className="card-header">
                        <div>
                          <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
                            <DollarSign size={15} color="#3b82f6" />
                            <div className="card-title">My Reimbursement History</div>
                          </div>
                          <div className="card-sub">{myReimbursements.length} total requests</div>
                        </div>
                        {myReimbursements.length > 0 && (
                          <div style={{ fontSize:"12px",color:"#3b82f6",fontWeight:700 }}>
                            Total: ₹{myReimbursements.reduce((s,r)=>s+Number(r.amount||0),0).toLocaleString()}
                          </div>
                        )}
                      </div>
                      <div style={{ overflowX:"auto" }}>
                        <table>
                          <thead><tr>{["Date","Category","Description","Amount","Status"].map(h=><th key={h}>{h}</th>)}</tr></thead>
                          <tbody>
                            {myReimbursements.length===0 ? (
                              <tr><td colSpan={5}><div className="empty-state">
                                <Receipt size={28} color="#cbd5e1" style={{ margin:"0 auto 10px",display:"block" }} />
                                No reimbursement requests yet
                              </div></td></tr>
                            ) : myReimbursements.map(r => {
                              const cfg = statusConfig[r.status] || statusConfig.pending;
                              const Icon = cfg.icon;
                              return (
                                <tr key={r._id} className="leave-row">
                                  <td style={{ whiteSpace:"nowrap" }}>{r.date?.slice(0,10) || "—"}</td>
                                  <td>
                                    <span style={{ display:"inline-flex",alignItems:"center",gap:"5px",background:"rgba(59,130,246,0.08)",border:"1px solid rgba(59,130,246,0.2)",borderRadius:"6px",padding:"2px 8px",fontSize:"11px",color:"#3b82f6",fontWeight:600 }}>
                                      {r.category}
                                    </span>
                                  </td>
                                  <td style={{ maxWidth:"160px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{r.description}</td>
                                  <td style={{ fontWeight:700,color:"#3b82f6",whiteSpace:"nowrap" }}>₹{Number(r.amount).toLocaleString()}</td>
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

          <footer className="mgr-footer">
            <div className="footer-brand">
              <div style={{ width:"19px",height:"19px",borderRadius:"5px",background:"linear-gradient(135deg,#3b82f6,#6366f1)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                <Shield size={10} color="#fff" strokeWidth={2.5} />
              </div>
              <span className="footer-brand-text">HR Portal</span>
            </div>
            <div style={{ display:"flex", gap:"16px", flexWrap:"wrap", justifyContent:"center" }}>
              {["Help Center","Privacy Policy","Terms of Use"].map(item=><a key={item} href="#" className="footer-link">{item}</a>)}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
              <Sparkles size={10} color="rgba(147,197,253,0.35)" />
              <span className="footer-copy">© {new Date().getFullYear()} HR Portal. All rights reserved.</span>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}