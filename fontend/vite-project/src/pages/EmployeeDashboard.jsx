import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardCards from "../components/DashboardCards";
import LeaveChart from "../components/LeaveChart";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { CalendarPlus, CheckCircle2, Clock, XCircle } from "lucide-react";

const statusConfig = {
  approved: { color: '#16a34a', bg: '#f0fdf4', icon: CheckCircle2 },
  pending: { color: '#ca8a04', bg: '#fefce8', icon: Clock },
  rejected: { color: '#dc2626', bg: '#fef2f2', icon: XCircle },
};

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [applying, setApplying] = useState(false);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const fetchLeaves = async () => {
    try {
      const res = await API.get("/leaves/my");
      setLeaves(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const applyLeave = async () => {
    setApplying(true);
    try {
      await API.post("/leaves/apply", { startDate, endDate, reason });
      toast.success("Leave applied successfully");
      fetchLeaves();
    } catch {
      toast.error("Failed to apply leave");
    } finally {
      setApplying(false);
    }
  };

  useEffect(() => { fetchLeaves(); }, []);

  const inputStyle = {
    background: '#f7f4f0',
    border: '1px solid #e2ddd8',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '14px',
    color: '#0f1117',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'DM Sans, sans-serif',
  };

  return (
    <div style={{ display: 'flex', background: '#f0ede8', minHeight: '100vh' }}>
      <Sidebar logout={logout} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar />
        <div style={{ padding: '28px', flex: 1 }}>
          {/* Header */}
          <div style={{ marginBottom: '24px', animation: 'fadeUp 0.3s ease both' }}>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '26px', color: '#0f1117', letterSpacing: '-0.02em' }}>
              My Dashboard
            </h1>
            <p style={{ color: '#6b6b7b', fontSize: '14px', marginTop: '4px' }}>Track and manage your leave requests</p>
          </div>

          {loading ? <Loader /> : (
            <>
              <DashboardCards leaves={leaves} />

              {/* Apply Leave Form */}
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2ddd8',
                boxShadow: '0 2px 8px rgba(15,17,23,0.05)',
                padding: '24px',
                marginBottom: '24px',
                animation: 'fadeUp 0.35s ease 0.1s both',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '9px',
                    background: '#fff0eb', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <CalendarPlus size={16} color="#e8602c" />
                  </div>
                  <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', color: '#0f1117' }}>Apply for Leave</h2>
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b6b7b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Start Date</label>
                    <input type="date" style={inputStyle}
                      onChange={(e) => setStartDate(e.target.value)}
                      onFocus={e => { e.target.style.borderColor = '#e8602c'; e.target.style.boxShadow = '0 0 0 3px rgba(232,96,44,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = '#e2ddd8'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b6b7b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>End Date</label>
                    <input type="date" style={inputStyle}
                      onChange={(e) => setEndDate(e.target.value)}
                      onFocus={e => { e.target.style.borderColor = '#e8602c'; e.target.style.boxShadow = '0 0 0 3px rgba(232,96,44,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = '#e2ddd8'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: '200px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b6b7b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reason</label>
                    <input placeholder="Brief reason for leave..." style={{ ...inputStyle, width: '100%' }}
                      onChange={(e) => setReason(e.target.value)}
                      onFocus={e => { e.target.style.borderColor = '#e8602c'; e.target.style.boxShadow = '0 0 0 3px rgba(232,96,44,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = '#e2ddd8'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                  <button
                    onClick={applyLeave}
                    disabled={applying}
                    style={{
                      background: applying ? 'rgba(232,96,44,0.5)' : 'linear-gradient(135deg, #e8602c, #f0934a)',
                      color: '#fff', border: 'none', borderRadius: '10px',
                      padding: '10px 22px', fontSize: '14px', fontWeight: 600,
                      cursor: applying ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 12px rgba(232,96,44,0.25)',
                      whiteSpace: 'nowrap',
                      marginTop: '22px',
                    }}
                    onMouseEnter={e => { if (!applying) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    {applying ? 'Applying...' : 'Apply Leave'}
                  </button>
                </div>
              </div>

              {/* Bottom Row: Chart + Table */}
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start', animation: 'fadeUp 0.4s ease 0.15s both' }}>
                <LeaveChart leaves={leaves} />

                {/* Leave History Table */}
                <div style={{
                  flex: 1, minWidth: '320px',
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2ddd8',
                  boxShadow: '0 2px 8px rgba(15,17,23,0.05)',
                  overflow: 'hidden',
                }}>
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0ede8' }}>
                    <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', color: '#0f1117' }}>Leave History</h3>
                    <p style={{ fontSize: '13px', color: '#a0a0b0', marginTop: '2px' }}>{leaves.length} total requests</p>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#f7f4f0' }}>
                          {['Date Range', 'Reason', 'Status'].map(h => (
                            <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#6b6b7b', letterSpacing: '0.07em', textTransform: 'uppercase' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {leaves.length === 0 ? (
                          <tr><td colSpan={3} style={{ textAlign: 'center', padding: '40px', color: '#a0a0b0', fontSize: '14px' }}>No leave requests yet</td></tr>
                        ) : leaves.map((leave) => {
                          const cfg = statusConfig[leave.status] || statusConfig.pending;
                          const Icon = cfg.icon;
                          return (
                            <tr key={leave._id} style={{ borderTop: '1px solid #f0ede8', transition: 'background 0.15s' }}
                              onMouseEnter={e => e.currentTarget.style.background = '#fafaf8'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                              <td style={{ padding: '14px 20px', fontSize: '13px', color: '#0f1117', fontWeight: 500, whiteSpace: 'nowrap' }}>
                                {leave.startDate.slice(0,10)} → {leave.endDate.slice(0,10)}
                              </td>
                              <td style={{ padding: '14px 20px', fontSize: '13px', color: '#6b6b7b' }}>{leave.reason}</td>
                              <td style={{ padding: '14px 20px' }}>
                                <span style={{
                                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                                  background: cfg.bg, color: cfg.color,
                                  padding: '4px 10px', borderRadius: '999px',
                                  fontSize: '12px', fontWeight: 600,
                                }}>
                                  <Icon size={12} />
                                  <span style={{ textTransform: 'capitalize' }}>{leave.status}</span>
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
      </div>
    </div>
  );
}
