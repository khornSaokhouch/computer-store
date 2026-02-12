export default function DashboardHeader({ title, subtitle }) {
    return (
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">{title}</h1>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">{subtitle}</p>
      </div>
    );
  }