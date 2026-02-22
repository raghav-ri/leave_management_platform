import { LayoutDashboard, LogOut, Activity } from "lucide-react";

export default function Sidebar({ logout }) {
  return (
    <div style={{
      width: '240px',
      background: '#0f1117',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
      position: 'relative',
      flexShrink: 0,
    }}>
      {/* Logo area */}
      <div style={{
        padding: '28px 24px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px', height: '34px',
            background: 'linear-gradient(135deg, #e8602c, #f0934a)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Activity size={17} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#fff', fontSize: '15px', lineHeight: 1.2 }}>HR Portal</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>Leave Management</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ padding: '20px 16px', flex: 1 }}>
        <div style={{ marginBottom: '6px' }}>
          <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, padding: '0 8px', marginBottom: '8px' }}>
            Menu
          </p>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', borderRadius: '10px',
            background: 'rgba(232,96,44,0.15)',
            color: '#e8602c',
            cursor: 'pointer',
            fontSize: '14px', fontWeight: 500,
          }}>
            <LayoutDashboard size={17} />
            Dashboard
          </div>
        </div>
      </div>

      {/* Logout */}
      <div style={{ padding: '16px' }}>
        <button
          onClick={logout}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            background: 'rgba(220,38,38,0.12)',
            color: '#f87171',
            border: '1px solid rgba(220,38,38,0.2)',
            borderRadius: '10px',
            padding: '10px 16px',
            fontSize: '14px', fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.22)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.12)'; }}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}
