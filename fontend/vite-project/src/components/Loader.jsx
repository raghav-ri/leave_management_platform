export default function Loader() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '60px 0',
      gap: '16px'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '3px solid #e2ddd8',
        borderTopColor: '#e8602c',
        animation: 'spin 0.8s linear infinite'
      }} />
      <span style={{ color: '#a0a0b0', fontSize: '13px', letterSpacing: '0.05em', fontFamily: 'DM Sans, sans-serif' }}>
        Loading...
      </span>
    </div>
  );
}
