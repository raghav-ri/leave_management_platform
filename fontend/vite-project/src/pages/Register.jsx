import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import { Activity, User, Mail, Lock, ArrowRight } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "employee" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      toast.success("Account created — please login");
      navigate("/");
    } catch {
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleRegister(); };

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '12px 14px 12px 40px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block', fontSize: '12px', fontWeight: 600,
    color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em',
    textTransform: 'uppercase', marginBottom: '8px',
  };

  const fields = [
    { name: 'name',     label: 'Full Name', type: 'text',     placeholder: 'John Smith',        icon: User  },
    { name: 'email',    label: 'Email',     type: 'email',    placeholder: 'you@company.com',   icon: Mail  },
    { name: 'password', label: 'Password',  type: 'password', placeholder: '••••••••',          icon: Lock, last: true },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f1117',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decorations */}
      <div style={{
        position: 'absolute', top: '-200px', left: '-200px',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,96,44,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-150px', right: '-150px',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Card */}
      <div style={{
        background: '#1a1d27',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '24px',
        padding: '44px 40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        animation: 'fadeUp 0.4s ease both',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '52px', height: '52px',
            background: 'linear-gradient(135deg, #e8602c, #f0934a)',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(232,96,44,0.3)',
          }}>
            <Activity size={24} color="white" />
          </div>
          <h1 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: '26px', color: '#ffffff', letterSpacing: '-0.03em',
            marginBottom: '6px',
          }}>
            Create Account
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
            Join the HR Leave Portal
          </p>
        </div>

        {/* Text fields */}
        {fields.map(({ name, label, type, placeholder, icon: Icon, last }) => (
          <div key={name} style={{ marginBottom: last ? '28px' : '16px' }}>
            <label style={labelStyle}>{label}</label>
            <div style={{ position: 'relative' }}>
              <Icon size={16} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                name={name}
                type={type}
                placeholder={placeholder}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#e8602c'; e.target.style.boxShadow = '0 0 0 3px rgba(232,96,44,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          </div>
        ))}

        {/* Submit */}
        <button
          onClick={handleRegister}
          disabled={loading}
          style={{
            width: '100%',
            background: loading ? 'rgba(232,96,44,0.5)' : 'linear-gradient(135deg, #e8602c, #f0934a)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '13px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: '0 4px 16px rgba(232,96,44,0.3)',
            transition: 'all 0.2s',
            marginBottom: '20px',
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          {loading ? 'Creating account...' : <><span>Create Account</span><ArrowRight size={16} /></>}
        </button>

        {/* Login link */}
        <p style={{ textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
          Already have an account?{' '}
          <a href="/" style={{ color: '#e8602c', fontWeight: 600, textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.textDecoration = 'underline'}
            onMouseLeave={e => e.target.style.textDecoration = 'none'}
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
