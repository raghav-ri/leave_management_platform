import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardCards from "../components/DashboardCards";
import LeaveChart from "../components/LeaveChart";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { CheckCircle2, Clock, XCircle, Users } from "lucide-react";

const statusConfig = {
  approved: { color: '#16a34a', bg: '#f0fdf4', icon: CheckCircle2 },
  pending: { color: '#ca8a04', bg: '#fefce8', icon: Clock },
  rejected: { color: '#dc2626', bg: '#fef2f2', icon: XCircle },
};

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const fetchLeaves = async () => {
    try {
      const res = await API.get("/leaves/all");
      setLeaves(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeaves(); }, []);

  const approveLeave = async (id) => {
    try {
      await API.put(`/leaves/approve/${id}`);
      toast.success("Leave approved");
      fetchLeaves();
    } catch {
      toast.error("Failed to approve");
    }
  };

  const rejectLeave = async (id) => {
    try {
      await API.put(`/leaves/reject/${id}`);
      toast.success("Leave rejected");
      fetchLeaves();
    } catch {
      toast.error("Failed to reject");
    }
  };

  const filtered = filter === "all" ? leaves : leaves.filter(l => l.status === filter);
  const filters = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <div style={{ display: 'flex', background: '#f0ede8', minHeight: '100vh' }}>
      <Sidebar logout={logout} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar />
        <div style={{ padding: '28px', flex: 1 }}>
          {/* Header */}
          <div style={{ marginBottom: '24px', animation: 'fadeUp 0.3s ease both' }}>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '26px', color: '#0f1117', letterSpacing: '-0.02em' }}>
              Manager Dashboard
            </h1>
            <p style={{ color: '#6b6b7b', fontSize: '14px', marginTop: '4px' }}>Overview of all employee leave requests</p>
          </div>

          {loading ? <Loader /> : (
            <>
              <DashboardCards leaves={leaves} />

              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start', animation: 'fadeUp 0.35s ease 0.1s both' }}>
                <LeaveChart leaves={leaves} />

                {/* All Leaves Table */}
                <div style={{
                  flex: 1, minWidth: '320px',
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2ddd8',
                  boxShadow: '0 2px 8px rgba(15,17,23,0.05)',
                  overflow: 'hidden',
                }}>
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0ede8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users size={16} color="#6b6b7b" />
                        <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', color: '#0f1117' }}>All Leave Requests</h3>
                      </div>
                      <p style={{ fontSize: '13px', color: '#a0a0b0', marginTop: '2px' }}>{filtered.length} showing</p>
                    </div>
                    {/* Filter tabs */}
                    <div style={{ display: 'flex', gap: '6px', background: '#f7f4f0', padding: '4px', borderRadius: '10px' }}>
                      {filters.map(f => (
                        <button
                          key={f.value}
                          onClick={() => setFilter(f.value)}
                          style={{
                            padding: '6px 14px', borderRadius: '7px',
                            fontSize: '12px', fontWeight: 600,
                            background: filter === f.value ? '#fff' : 'transparent',
                            color: filter === f.value ? '#0f1117' : '#6b6b7b',
                            border: 'none',
                            boxShadow: filter === f.value ? '0 1px 4px rgba(15,17,23,0.1)' : 'none',
                            cursor: 'pointer', transition: 'all 0.15s',
                          }}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#f7f4f0' }}>
                          {['Employee', 'Date Range', 'Reason', 'Status', 'Actions'].map(h => (
                            <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#6b6b7b', letterSpacing: '0.07em', textTransform: 'uppercase' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.length === 0 ? (
                          <tr><td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: '#a0a0b0', fontSize: '14px' }}>No requests found</td></tr>
                        ) : filtered.map((leave) => {
                          const cfg = statusConfig[leave.status] || statusConfig.pending;
                          const Icon = cfg.icon;
                          return (
                            <tr key={leave._id} style={{ borderTop: '1px solid #f0ede8', transition: 'background 0.15s' }}
                              onMouseEnter={e => e.currentTarget.style.background = '#fafaf8'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                              <td style={{ padding: '14px 20px' }}>
                                <div style={{
                                  width: '30px', height: '30px', borderRadius: '50%',
                                  background: 'linear-gradient(135deg, #e8602c, #f0934a)',
                                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                  color: '#fff', fontSize: '12px', fontWeight: 700,
                                }}>
                                  {(leave.employee?.name || leave.employee?.email || 'E')[0].toUpperCase()}
                                </div>
                              </td>
                              <td style={{ padding: '14px 20px', fontSize: '13px', color: '#0f1117', fontWeight: 500, whiteSpace: 'nowrap' }}>
                                {leave.startDate.slice(0,10)} → {leave.endDate.slice(0,10)}
                              </td>
                              <td style={{ padding: '14px 20px', fontSize: '13px', color: '#6b6b7b', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{leave.reason}</td>
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
                              <td style={{ padding: '14px 20px' }}>
                                {leave.status === 'pending' ? (
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                      onClick={() => approveLeave(leave._id)}
                                      style={{
                                        background: '#f0fdf4', color: '#16a34a',
                                        border: '1px solid #bbf7d0', borderRadius: '8px',
                                        padding: '5px 12px', fontSize: '12px', fontWeight: 600,
                                        cursor: 'pointer', transition: 'all 0.15s',
                                      }}
                                      onMouseEnter={e => { e.currentTarget.style.background = '#16a34a'; e.currentTarget.style.color = '#fff'; }}
                                      onMouseLeave={e => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.color = '#16a34a'; }}
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => rejectLeave(leave._id)}
                                      style={{
                                        background: '#fef2f2', color: '#dc2626',
                                        border: '1px solid #fecaca', borderRadius: '8px',
                                        padding: '5px 12px', fontSize: '12px', fontWeight: 600,
                                        cursor: 'pointer', transition: 'all 0.15s',
                                      }}
                                      onMouseEnter={e => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.color = '#fff'; }}
                                      onMouseLeave={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#dc2626'; }}
                                    >
                                      Reject
                                    </button>
                                  </div>
                                ) : (
                                  <span style={{ fontSize: '12px', color: '#a0a0b0' }}>—</span>
                                )}
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
