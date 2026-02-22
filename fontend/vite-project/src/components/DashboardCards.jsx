export default function DashboardCards({ leaves }) {
  const total = leaves.length;
  const approved = leaves.filter(l => l.status === "approved").length;
  const pending = leaves.filter(l => l.status === "pending").length;
  const rejected = leaves.filter(l => l.status === "rejected").length;

  const cards = [
    { title: "Total Leaves", value: total, color: '#2563eb', bg: '#eff6ff', bar: '#bfdbfe', pct: 100 },
    { title: "Approved", value: approved, color: '#16a34a', bg: '#f0fdf4', bar: '#bbf7d0', pct: total ? Math.round(approved/total*100) : 0 },
    { title: "Pending", value: pending, color: '#ca8a04', bg: '#fefce8', bar: '#fde68a', pct: total ? Math.round(pending/total*100) : 0 },
    { title: "Rejected", value: rejected, color: '#dc2626', bg: '#fef2f2', bar: '#fecaca', pct: total ? Math.round(rejected/total*100) : 0 },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: '16px',
      marginBottom: '24px',
    }}>
      {cards.map((card, i) => (
        <div
          key={i}
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid #e2ddd8',
            boxShadow: '0 2px 8px rgba(15,17,23,0.05)',
            animation: `fadeUp 0.3s ease ${i * 0.07}s both`,
            transition: 'box-shadow 0.2s, transform 0.2s',
            cursor: 'default',
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,17,23,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(15,17,23,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '36px', height: '36px', borderRadius: '10px',
            background: card.bg, marginBottom: '12px',
          }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: card.color }} />
          </div>
          <p style={{ fontSize: '13px', color: '#6b6b7b', fontWeight: 500, marginBottom: '4px' }}>{card.title}</p>
          <p style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'Syne, sans-serif', color: '#0f1117', lineHeight: 1 }}>{card.value}</p>

          {/* Progress bar */}
          <div style={{ marginTop: '14px', height: '4px', background: card.bar, borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${card.pct}%`,
              background: card.color, borderRadius: '999px',
              transition: 'width 0.8s ease',
            }} />
          </div>
          <p style={{ fontSize: '11px', color: '#a0a0b0', marginTop: '4px' }}>{card.pct}% of total</p>
        </div>
      ))}
    </div>
  );
}
