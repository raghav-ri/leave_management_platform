import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function LeaveChart({ leaves }) {
  const approved = leaves.filter(l => l.status === "approved").length;
  const pending = leaves.filter(l => l.status === "pending").length;
  const rejected = leaves.filter(l => l.status === "rejected").length;

  const data = {
    labels: ["Approved", "Pending", "Rejected"],
    datasets: [
      {
        data: [approved, pending, rejected],
        backgroundColor: ["#16a34a", "#ca8a04", "#dc2626"],
        borderColor: ["#f0fdf4", "#fefce8", "#fef2f2"],
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { family: 'DM Sans', size: 13 },
          color: '#6b6b7b',
        },
      },
      tooltip: {
        backgroundColor: '#0f1117',
        padding: 12,
        titleFont: { family: 'Syne', size: 13 },
        bodyFont: { family: 'DM Sans', size: 12 },
        cornerRadius: 8,
      }
    },
    cutout: '55%',
  };

  return (
    <div style={{
      background: '#ffffff',
      padding: '24px',
      borderRadius: '16px',
      border: '1px solid #e2ddd8',
      boxShadow: '0 2px 8px rgba(15,17,23,0.05)',
      width: '100%',
      maxWidth: '360px',
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', color: '#0f1117' }}>Leave Analytics</h3>
        <p style={{ fontSize: '13px', color: '#a0a0b0', marginTop: '2px' }}>{leaves.length} total requests</p>
      </div>
      <Pie data={data} options={options} />
    </div>
  );
}
