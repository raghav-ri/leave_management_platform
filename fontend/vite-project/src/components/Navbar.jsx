import { useState } from "react";
import { UserCircle, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const role = localStorage.getItem("role");

  return (
    <div style={{
      background: '#ffffff',
      borderBottom: '1px solid #e2ddd8',
      padding: '0 28px',
      height: '60px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <div>
        <span style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 700,
          fontSize: '18px',
          color: '#0f1117',
          letterSpacing: '-0.02em',
        }}>
          HR Leave System
        </span>
      </div>

      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setOpen(!open)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: open ? '#f7f4f0' : 'transparent',
            border: '1px solid',
            borderColor: open ? '#e2ddd8' : 'transparent',
            borderRadius: '10px',
            padding: '7px 12px',
            cursor: 'pointer',
            transition: 'all 0.15s',
            color: '#0f1117',
          }}
          onMouseEnter={e => { if (!open) { e.currentTarget.style.background = '#f7f4f0'; e.currentTarget.style.borderColor = '#e2ddd8'; }}}
          onMouseLeave={e => { if (!open) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}}
        >
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #e8602c, #f0934a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <UserCircle size={18} color="white" />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 500, textTransform: 'capitalize' }}>{role}</span>
          <ChevronDown size={14} color="#6b6b7b" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>

        {open && (
          <div style={{
            position: 'absolute', right: 0, top: 'calc(100% + 8px)',
            background: '#fff', borderRadius: '12px',
            border: '1px solid #e2ddd8',
            boxShadow: '0 8px 32px rgba(15,17,23,0.12)',
            padding: '12px 16px',
            minWidth: '160px',
            animation: 'fadeUp 0.15s ease',
          }}>
            <p style={{ fontSize: '12px', color: '#a0a0b0', marginBottom: '4px' }}>Logged in as</p>
            <p style={{ fontSize: '14px', fontWeight: 600, textTransform: 'capitalize', color: '#0f1117' }}>{role}</p>
          </div>
        )}
      </div>
    </div>
  );
}
