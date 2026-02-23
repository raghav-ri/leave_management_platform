import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { Users, ShieldCheck, Trash2, ChevronDown, Sparkles, Shield, Crown, UserCheck, UserCog } from "lucide-react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);} }
  @keyframes pulse-purple { 0%,100%{box-shadow:0 0 0 0 rgba(139,92,246,0.35);}50%{box-shadow:0 0 0 8px rgba(139,92,246,0);} }

  /* ADMIN: deep charcoal-graphite with purple mesh */
  .admin-page {
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    background-color: #111118;
    background-image:
      radial-gradient(ellipse at 10% 15%, rgba(139,92,246,0.1) 0%, transparent 48%),
      radial-gradient(ellipse at 88% 80%, rgba(236,72,153,0.07) 0%, transparent 45%),
      radial-gradient(ellipse at 55% 45%, rgba(99,102,241,0.05) 0%, transparent 40%),
      url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v1H0zm0 59h60v1H0zM0 0v60H1V0zm59 0v60h1V0z' fill='%238b5cf6' fill-opacity='0.04'/%3E%3C/svg%3E");
  }

  .admin-content { padding: 28px 36px; flex: 1; }

  /* WELCOME BANNER — dark purple */
  .welcome-banner {
    background: linear-gradient(125deg, #0e0b1a 0%, #1a1130 55%, #0c0918 100%);
    border-radius: 20px; border: 1px solid rgba(139,92,246,0.22);
    padding: 26px 32px; margin-bottom: 24px;
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;
    animation: fadeUp 0.35s ease both; position: relative; overflow: hidden;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  .welcome-banner::after {
    content: ''; position: absolute; right: -40px; top: -40px;
    width: 240px; height: 240px; border-radius: 50%;
    background: radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .welcome-banner::before {
    content: ''; position: absolute; left: 0; bottom: 0; right: 0; top: 0;
    background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='40' fill='none' stroke='%238b5cf6' stroke-opacity='0.04' stroke-width='1'/%3E%3Ccircle cx='50' cy='50' r='25' fill='none' stroke='%238b5cf6' stroke-opacity='0.03' stroke-width='1'/%3E%3C/svg%3E") right center / 200px no-repeat;
    pointer-events: none;
  }
  .wb-left { display:flex; align-items:center; gap:16px; position:relative; z-index:1; }
  .user-avatar {
    width:50px; height:50px; border-radius:50%;
    background: linear-gradient(135deg, #8b5cf6, #ec4899);
    display:flex; align-items:center; justify-content:center;
    font-family:'Playfair Display',serif; font-size:19px; font-weight:900; color:#fff;
    box-shadow:0 4px 16px rgba(139,92,246,0.45);
    animation:pulse-purple 3s ease-in-out infinite; flex-shrink:0;
  }
  .wb-greeting { font-size:11px; font-weight:600; color:rgba(196,181,253,0.5); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:3px; }
  .wb-name { font-family:'Playfair Display',serif; font-size:21px; font-weight:700; color:#ede9fe; letter-spacing:-0.02em; margin-bottom:5px; }
  .role-chip {
    display:inline-flex; align-items:center; gap:5px;
    background:rgba(139,92,246,0.14); border:1px solid rgba(139,92,246,0.28);
    border-radius:999px; padding:3px 10px;
    font-size:10px; font-weight:700; color:#c4b5fd; letter-spacing:0.07em; text-transform:uppercase;
  }
  .wb-right { position:relative; z-index:1; text-align:right; }
  .wb-date { font-size:12px; color:rgba(237,233,254,0.34); letter-spacing:0.02em; margin-bottom:2px; }
  .wb-time { font-family:'Playfair Display',serif; font-size:26px; font-weight:700; color:#c4b5fd; letter-spacing:-0.02em; }

  .page-header { margin-bottom:22px; animation:fadeUp 0.4s ease 0.06s both; }
  .purple-accent { width:40px; height:3px; background:linear-gradient(90deg,#8b5cf6,#ec4899); border-radius:2px; margin-bottom:8px; box-shadow:0 2px 8px rgba(139,92,246,0.35); }
  .page-title { font-family:'Playfair Display',serif; font-weight:900; font-size:27px; color:#f0ecff; letter-spacing:-0.03em; margin-bottom:3px; }
  .page-subtitle { font-size:13px; color:#9b92c0; }

  /* STATS GRID */
  .stats-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(155px,1fr)); gap:15px; margin-bottom:26px; animation:fadeUp 0.4s ease 0.07s both; }
  .stat-card {
    background: rgba(255,255,255,0.04); backdrop-filter:blur(8px);
    border-radius:18px; border:1px solid rgba(255,255,255,0.07);
    box-shadow:0 2px 16px rgba(0,0,0,0.25); padding:20px 20px 18px;
    transition:transform 0.25s,box-shadow 0.25s; position:relative; overflow:hidden;
  }
  .stat-card::before { content:''; position:absolute; top:0;left:0;right:0; height:3px; }
  .stat-card:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,0,0,0.35); }
  .stat-icon { width:38px; height:38px; border-radius:11px; display:flex; align-items:center; justify-content:center; margin-bottom:12px; }
  .stat-label { font-size:10px; color:rgba(255,255,255,0.35); font-weight:600; letter-spacing:0.09em; text-transform:uppercase; margin-bottom:5px; }
  .stat-value { font-family:'Playfair Display',serif; font-weight:900; font-size:34px; color:#f0ecff; line-height:1; letter-spacing:-0.02em; }

  /* USERS TABLE */
  .users-card {
    background: rgba(255,255,255,0.035); backdrop-filter:blur(8px);
    border-radius:20px; border:1px solid rgba(255,255,255,0.07);
    box-shadow:0 4px 24px rgba(0,0,0,0.3);
    overflow:hidden; animation:fadeUp 0.45s ease 0.1s both; position:relative;
  }
  .users-card::before { content:''; position:absolute; top:0;left:0;right:0; height:3px; background:linear-gradient(90deg,#8b5cf6,#ec4899,#8b5cf6); }
  .card-header { padding:20px 24px 15px; border-bottom:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; }
  .card-title { font-family:'Playfair Display',serif; font-weight:700; font-size:16px; color:#ede9fe; }
  .card-sub { font-size:11px; color:rgba(255,255,255,0.3); margin-top:2px; }

  .search-input {
    background:rgba(255,255,255,0.06); border:1px solid rgba(139,92,246,0.2); border-radius:10px;
    padding:8px 13px; font-size:13px; color:#ede9fe;
    font-family:'DM Sans',sans-serif; outline:none; width:200px; transition:all 0.25s;
  }
  .search-input::placeholder { color:rgba(255,255,255,0.22); }
  .search-input:focus { border-color:rgba(139,92,246,0.55); background:rgba(139,92,246,0.08); box-shadow:0 0 0 3px rgba(139,92,246,0.1); }

  .filter-tabs { display:flex; gap:3px; background:rgba(255,255,255,0.05); border:1px solid rgba(139,92,246,0.12); padding:3px; border-radius:11px; }
  .filter-tab { padding:6px 13px; border-radius:8px; font-size:11px; font-weight:700; letter-spacing:0.05em; text-transform:uppercase; border:none; cursor:pointer; transition:all 0.2s; font-family:'DM Sans',sans-serif; background:transparent; color:rgba(255,255,255,0.35); }
  .filter-tab.active { background:linear-gradient(135deg,#8b5cf6,#6d28d9); color:#fff; box-shadow:0 2px 10px rgba(139,92,246,0.4); }

  table { width:100%; border-collapse:collapse; }
  thead tr { background:rgba(255,255,255,0.03); }
  th { padding:11px 22px; text-align:left; font-size:10px; font-weight:700; color:rgba(196,181,253,0.6); letter-spacing:0.12em; text-transform:uppercase; }
  .user-row { border-top:1px solid rgba(255,255,255,0.04); transition:background 0.18s; }
  .user-row:hover { background:rgba(139,92,246,0.05); }
  td { padding:14px 22px; font-size:13px; color:#d4cff0; vertical-align:middle; }

  .avatar-circle {
    width:34px; height:34px; border-radius:50%;
    background:linear-gradient(135deg,#8b5cf6,#ec4899);
    display:flex; align-items:center; justify-content:center;
    color:#fff; font-size:12px; font-weight:800; flex-shrink:0;
    box-shadow:0 2px 8px rgba(139,92,246,0.3);
  }

  .role-badge { display:inline-flex; align-items:center; gap:5px; padding:4px 11px; border-radius:999px; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:capitalize; border:1px solid transparent; }

  .role-select {
    appearance:none; background:rgba(255,255,255,0.07); border:1px solid rgba(139,92,246,0.2);
    border-radius:9px; padding:7px 26px 7px 11px; font-size:12px; font-weight:600;
    color:#ede9fe; cursor:pointer; font-family:'DM Sans',sans-serif; outline:none; transition:border-color 0.2s;
  }
  .role-select option { background:#1a1130; color:#ede9fe; }
  .role-select:focus { border-color:rgba(139,92,246,0.55); box-shadow:0 0 0 2px rgba(139,92,246,0.12); }

  .delete-btn {
    width:33px; height:33px; border-radius:8px;
    background:rgba(220,38,38,0.12); border:1px solid rgba(220,38,38,0.25);
    color:#f87171; display:flex; align-items:center; justify-content:center;
    cursor:pointer; transition:all 0.2s; flex-shrink:0;
  }
  .delete-btn:hover:not(:disabled) { background:#dc2626; color:#fff; box-shadow:0 4px 12px rgba(220,38,38,0.3); border-color:#dc2626; }
  .delete-btn:disabled { opacity:0.35; cursor:not-allowed; }

  .empty-state { text-align:center; padding:44px 24px; color:rgba(255,255,255,0.25); font-size:14px; }

  /* FOOTER */
  .admin-footer { background:rgba(0,0,0,0.4); border-top:1px solid rgba(139,92,246,0.1); padding:18px 36px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; backdrop-filter:blur(8px); }
  .footer-brand { display:flex; align-items:center; gap:7px; }
  .footer-brand-text { font-size:11px; font-weight:600; color:rgba(196,181,253,0.45); letter-spacing:0.12em; text-transform:uppercase; }
  .footer-link { font-size:11px; color:rgba(237,233,254,0.18); text-decoration:none; letter-spacing:0.02em; transition:color 0.2s; }
  .footer-link:hover { color:rgba(196,181,253,0.6); }
  .footer-copy { font-size:11px; color:rgba(237,233,254,0.13); letter-spacing:0.04em; }
`;

const roleColors = {
  admin:    { color:"#c084fc", bg:"rgba(192,132,252,0.12)", border:"rgba(192,132,252,0.25)", icon:Crown, barColor:"#8b5cf6" },
  manager:  { color:"#60a5fa", bg:"rgba(96,165,250,0.1)", border:"rgba(96,165,250,0.22)", icon:UserCog, barColor:"#3b82f6" },
  employee: { color:"#4ade80", bg:"rgba(74,222,128,0.1)", border:"rgba(74,222,128,0.2)", icon:UserCheck, barColor:"#16a34a" },
};

const filterTabs = ["all","admin","manager","employee"];

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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const now = useLiveClock();

  const userName = localStorage.getItem("name") || localStorage.getItem("userName") || "Admin";
  const initials = userName.split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase() || "A";

  const logout = () => { localStorage.clear(); navigate("/"); };

  const fetchUsers = async () => {
    try { const res = await API.get("/users"); setUsers(res.data); }
    catch { toast.error("Failed to load users"); }
    finally { setLoading(false); }
  };

  const handleRoleChange = async (id, newRole) => {
    setUpdatingId(id);
    try { await API.put(`/users/${id}/role`, { role: newRole }); toast.success("Role updated"); setUsers(prev => prev.map(u => u._id===id ? {...u,role:newRole} : u)); }
    catch { toast.error("Failed to update role"); }
    finally { setUpdatingId(null); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try { await API.delete(`/users/${id}`); toast.success("User deleted"); setUsers(prev => prev.filter(u => u._id!==id)); }
    catch { toast.error("Failed to delete user"); }
    finally { setDeletingId(null); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole==="all" || u.role===filterRole;
    return matchSearch && matchRole;
  });

  const statsData = [
    { label:"Total Users",  value:users.length,                                  iconBg:"rgba(139,92,246,0.15)",  iconColor:"#c4b5fd", barColor:"#8b5cf6",  icon:Users },
    { label:"Admins",       value:users.filter(u=>u.role==="admin").length,       iconBg:"rgba(192,132,252,0.15)", iconColor:"#c084fc", barColor:"#a855f7",  icon:Crown },
    { label:"Managers",     value:users.filter(u=>u.role==="manager").length,     iconBg:"rgba(96,165,250,0.12)", iconColor:"#60a5fa",  barColor:"#3b82f6",  icon:UserCog },
    { label:"Employees",    value:users.filter(u=>u.role==="employee").length,    iconBg:"rgba(74,222,128,0.1)",  iconColor:"#4ade80",  barColor:"#16a34a",  icon:UserCheck },
  ];

  const dateStr = now.toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" });

  return (
    <>
      <style>{css}</style>
      <div className="admin-page" style={{ display:"flex" }}>
        <Sidebar logout={logout} />
        <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
          <Navbar />
          <div className="admin-content">

            {/* WELCOME BANNER */}
            <div className="welcome-banner">
              <div className="wb-left">
                <div className="user-avatar">{initials}</div>
                <div>
                  <div className="wb-greeting">{getGreeting()}</div>
                  <div className="wb-name">{userName}</div>
                  <div className="role-chip"><Crown size={9} /> Administrator</div>
                </div>
              </div>
              <div className="wb-right">
                <div className="wb-date">{dateStr}</div>
                <div className="wb-time">{timeStr}</div>
              </div>
            </div>

            <div className="page-header">
              <div className="purple-accent" />
              <h1 className="page-title">Admin Dashboard</h1>
              <p className="page-subtitle">Manage users, assign roles, and control access</p>
            </div>

            {loading ? <Loader /> : (
              <>
                {/* STATS */}
                <div className="stats-grid">
                  {statsData.map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <div key={i} className="stat-card">
                        <div style={{ position:"absolute",top:0,left:0,right:0,height:"3px",background:s.barColor,opacity:0.8 }} />
                        <div className="stat-icon" style={{ background:s.iconBg }}>
                          <Icon size={17} color={s.iconColor} />
                        </div>
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-value">{s.value}</div>
                      </div>
                    );
                  })}
                </div>

                {/* USERS TABLE */}
                <div className="users-card">
                  <div className="card-header">
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
                        <Users size={15} color="#c4b5fd" />
                        <div className="card-title">All Users</div>
                      </div>
                      <div className="card-sub">{filtered.length} showing</div>
                    </div>
                    <div style={{ display:"flex", gap:"10px", flexWrap:"wrap", alignItems:"center" }}>
                      <input className="search-input" placeholder="Search name or email..." onChange={e => setSearch(e.target.value)} />
                      <div className="filter-tabs">
                        {filterTabs.map(tab => (
                          <button key={tab} className={`filter-tab ${filterRole===tab?"active":""}`} onClick={() => setFilterRole(tab)}>
                            {tab === "all" ? "All" : tab}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ overflowX:"auto" }}>
                    <table>
                      <thead><tr>{["User","Email","Role","Joined","Actions"].map(h=><th key={h}>{h}</th>)}</tr></thead>
                      <tbody>
                        {filtered.length === 0 ? (
                          <tr><td colSpan={5}><div className="empty-state">
                            <Users size={28} color="rgba(255,255,255,0.15)" style={{ margin:"0 auto 10px", display:"block" }} />
                            No users found
                          </div></td></tr>
                        ) : filtered.map(user => {
                          const rc = roleColors[user.role] || roleColors.employee;
                          const RoleIcon = rc.icon;
                          const isUpdating = updatingId===user._id;
                          const isDeleting = deletingId===user._id;
                          const inits = user.name.split(" ").map(n=>n[0]).slice(0,2).join("").toUpperCase();
                          return (
                            <tr key={user._id} className="user-row">
                              <td>
                                <div style={{ display:"flex", alignItems:"center", gap:"11px" }}>
                                  <div className="avatar-circle">{inits}</div>
                                  <span style={{ fontSize:"13px", fontWeight:600, color:"#ede9fe" }}>{user.name}</span>
                                </div>
                              </td>
                              <td style={{ color:"rgba(255,255,255,0.45)", fontSize:"12px" }}>{user.email}</td>
                              <td>
                                <span className="role-badge" style={{ background:rc.bg, color:rc.color, borderColor:rc.border }}>
                                  <RoleIcon size={10} />{user.role}
                                </span>
                              </td>
                              <td style={{ color:"rgba(255,255,255,0.3)", whiteSpace:"nowrap", fontSize:"12px" }}>
                                {new Date(user.createdAt).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" })}
                              </td>
                              <td>
                                <div style={{ display:"flex", gap:"9px", alignItems:"center" }}>
                                  <div style={{ position:"relative" }}>
                                    <select value={user.role} disabled={isUpdating} className="role-select" onChange={e => handleRoleChange(user._id, e.target.value)}>
                                      <option value="employee">Employee</option>
                                      <option value="manager">Manager</option>
                                      <option value="admin">Admin</option>
                                    </select>
                                    <ChevronDown size={11} color="rgba(196,181,253,0.5)" style={{ position:"absolute",right:"8px",top:"50%",transform:"translateY(-50%)",pointerEvents:"none" }} />
                                  </div>
                                  <button className="delete-btn" onClick={() => handleDelete(user._id, user.name)} disabled={isDeleting} title="Delete user">
                                    <Trash2 size={13} />
                                  </button>
                                </div>
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
          </div>

          <footer className="admin-footer">
            <div className="footer-brand">
              <div style={{ width:"19px",height:"19px",borderRadius:"5px",background:"linear-gradient(135deg,#8b5cf6,#ec4899)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                <Shield size={10} color="#fff" strokeWidth={2.5} />
              </div>
              <span className="footer-brand-text">HR Leave Portal</span>
            </div>
            <div style={{ display:"flex", gap:"16px" }}>
              {["Help Center","Privacy Policy","Terms of Use"].map(item => <a key={item} href="#" className="footer-link">{item}</a>)}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
              <Sparkles size={10} color="rgba(196,181,253,0.35)" />
              <span className="footer-copy">© {new Date().getFullYear()} HR Leave Portal. All rights reserved.</span>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}