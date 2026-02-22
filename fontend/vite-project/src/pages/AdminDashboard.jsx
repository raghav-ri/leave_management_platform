import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { Users, ShieldCheck, Trash2, ChevronDown } from "lucide-react";

const roleColors = {
  admin:    { color: '#7c3aed', bg: '#f5f3ff' },
  manager:  { color: '#2563eb', bg: '#eff6ff' },
  employee: { color: '#16a34a', bg: '#f0fdf4' },
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (id, newRole) => {
    setUpdatingId(id);
    try {
      await API.put(`/users/${id}/role`, { role: newRole });
      toast.success("Role updated");
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role: newRole } : u));
    } catch {
      toast.error("Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await API.delete(`/users/${id}`);
      toast.success("User deleted");
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const stats = [
    { label: 'Total Users',  value: users.length,                                           color: '#2563eb', bg: '#eff6ff' },
    { label: 'Admins',       value: users.filter(u => u.role === 'admin').length,            color: '#7c3aed', bg: '#f5f3ff' },
    { label: 'Managers',     value: users.filter(u => u.role === 'manager').length,          color: '#ca8a04', bg: '#fefce8' },
    { label: 'Employees',    value: users.filter(u => u.role === 'employee').length,         color: '#16a34a', bg: '#f0fdf4' },
  ];

  const filterTabs = ['all', 'admin', 'manager', 'employee'];

  return (
    <div style={{ display: 'flex', background: '#f0ede8', minHeight: '100vh' }}>
      <Sidebar logout={logout} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar />

        <div style={{ padding: '28px', flex: 1 }}>
          {/* Header */}
          <div style={{ marginBottom: '24px', animation: 'fadeUp 0.3s ease both' }}>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '26px', color: '#0f1117', letterSpacing: '-0.02em' }}>
              Admin Dashboard
            </h1>
            <p style={{ color: '#6b6b7b', fontSize: '14px', marginTop: '4px' }}>Manage users, assign roles, and control access</p>
          </div>

          {loading ? <Loader /> : (
            <>
              {/* Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
                animation: 'fadeUp 0.3s ease 0.05s both',
              }}>
                {stats.map((s, i) => (
                  <div key={i} style={{
                    background: '#fff', borderRadius: '16px', padding: '20px',
                    border: '1px solid #e2ddd8', boxShadow: '0 2px 8px rgba(15,17,23,0.05)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,17,23,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(15,17,23,0.05)'; }}
                  >
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                      <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: s.color }} />
                    </div>
                    <p style={{ fontSize: '13px', color: '#6b6b7b', fontWeight: 500, marginBottom: '4px' }}>{s.label}</p>
                    <p style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'Syne, sans-serif', color: '#0f1117', lineHeight: 1 }}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Users Table */}
              <div style={{
                background: '#fff', borderRadius: '16px',
                border: '1px solid #e2ddd8', boxShadow: '0 2px 8px rgba(15,17,23,0.05)',
                overflow: 'hidden',
                animation: 'fadeUp 0.35s ease 0.1s both',
              }}>
                {/* Table header bar */}
                <div style={{
                  padding: '20px 24px', borderBottom: '1px solid #f0ede8',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: '#fff0eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Users size={16} color="#e8602c" />
                    </div>
                    <div>
                      <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', color: '#0f1117' }}>All Users</h3>
                      <p style={{ fontSize: '13px', color: '#a0a0b0', marginTop: '1px' }}>{filtered.length} showing</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Search */}
                    <input
                      placeholder="Search name or email..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      style={{
                        background: '#f7f4f0', border: '1px solid #e2ddd8', borderRadius: '10px',
                        padding: '8px 14px', fontSize: '13px', color: '#0f1117', outline: 'none',
                        width: '220px', fontFamily: 'DM Sans, sans-serif',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={e => { e.target.style.borderColor = '#e8602c'; }}
                      onBlur={e => { e.target.style.borderColor = '#e2ddd8'; }}
                    />

                    {/* Filter tabs */}
                    <div style={{ display: 'flex', gap: '4px', background: '#f7f4f0', padding: '4px', borderRadius: '10px' }}>
                      {filterTabs.map(tab => (
                        <button key={tab} onClick={() => setFilterRole(tab)} style={{
                          padding: '6px 12px', borderRadius: '7px', fontSize: '12px', fontWeight: 600,
                          background: filterRole === tab ? '#fff' : 'transparent',
                          color: filterRole === tab ? '#0f1117' : '#6b6b7b',
                          border: 'none', cursor: 'pointer',
                          boxShadow: filterRole === tab ? '0 1px 4px rgba(15,17,23,0.1)' : 'none',
                          transition: 'all 0.15s', textTransform: 'capitalize',
                        }}>
                          {tab === 'all' ? 'All' : tab}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f7f4f0' }}>
                        {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                          <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#6b6b7b', letterSpacing: '0.07em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: '#a0a0b0', fontSize: '14px' }}>
                            No users found
                          </td>
                        </tr>
                      ) : filtered.map(user => {
                        const rc = roleColors[user.role] || roleColors.employee;
                        const isUpdating = updatingId === user._id;
                        const isDeleting = deletingId === user._id;
                        const initials = user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

                        return (
                          <tr key={user._id} style={{ borderTop: '1px solid #f0ede8', transition: 'background 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#fafaf8'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            {/* Avatar + Name */}
                            <td style={{ padding: '14px 20px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                  width: '34px', height: '34px', borderRadius: '50%',
                                  background: 'linear-gradient(135deg, #e8602c, #f0934a)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  color: '#fff', fontSize: '12px', fontWeight: 700, flexShrink: 0,
                                }}>
                                  {initials}
                                </div>
                                <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f1117' }}>{user.name}</span>
                              </div>
                            </td>

                            {/* Email */}
                            <td style={{ padding: '14px 20px', fontSize: '13px', color: '#6b6b7b' }}>{user.email}</td>

                            {/* Role badge */}
                            <td style={{ padding: '14px 20px' }}>
                              <span style={{
                                display: 'inline-flex', alignItems: 'center',
                                background: rc.bg, color: rc.color,
                                padding: '4px 10px', borderRadius: '999px',
                                fontSize: '12px', fontWeight: 600, textTransform: 'capitalize',
                              }}>
                                <ShieldCheck size={11} style={{ marginRight: '5px' }} />
                                {user.role}
                              </span>
                            </td>

                            {/* Joined */}
                            <td style={{ padding: '14px 20px', fontSize: '13px', color: '#a0a0b0', whiteSpace: 'nowrap' }}>
                              {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>

                            {/* Actions */}
                            <td style={{ padding: '14px 20px' }}>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                {/* Role selector */}
                                <div style={{ position: 'relative' }}>
                                  <select
                                    value={user.role}
                                    disabled={isUpdating}
                                    onChange={e => handleRoleChange(user._id, e.target.value)}
                                    style={{
                                      appearance: 'none',
                                      background: isUpdating ? '#f0ede8' : '#f7f4f0',
                                      border: '1px solid #e2ddd8',
                                      borderRadius: '8px',
                                      padding: '6px 28px 6px 10px',
                                      fontSize: '12px', fontWeight: 600,
                                      color: '#0f1117', cursor: isUpdating ? 'not-allowed' : 'pointer',
                                      fontFamily: 'DM Sans, sans-serif',
                                      outline: 'none', transition: 'border-color 0.15s',
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#e8602c'}
                                    onBlur={e => e.target.style.borderColor = '#e2ddd8'}
                                  >
                                    <option value="employee">Employee</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                  </select>
                                  <ChevronDown size={12} color="#6b6b7b" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                </div>

                                {/* Delete button */}
                                <button
                                  onClick={() => handleDelete(user._id, user.name)}
                                  disabled={isDeleting}
                                  title="Delete user"
                                  style={{
                                    width: '32px', height: '32px', borderRadius: '8px',
                                    background: '#fef2f2', border: '1px solid #fecaca',
                                    color: isDeleting ? '#fca5a5' : '#dc2626',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: isDeleting ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.15s', flexShrink: 0,
                                  }}
                                  onMouseEnter={e => { if (!isDeleting) { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.color = '#fff'; }}}
                                  onMouseLeave={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#dc2626'; }}
                                >
                                  <Trash2 size={14} />
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
      </div>
    </div>
  );
}
