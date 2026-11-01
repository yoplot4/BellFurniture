import React from 'react';
import { 
  FaCoins, 
  FaBoxOpen, 
  FaUsers, 
  FaArrowTrendUp, 
  FaClock, 
  FaCircleCheck, 
  FaTriangleExclamation 
} from 'react-icons/fa6';

const AdminOverview = () => {
  // 1. High-Level Performance Metrics Data
  const metrics = [
    { 
      title: 'Total Revenue', 
      value: 'ETB 145,200', 
      change: '+14.2%', 
      isPositive: true, 
      icon: <FaCoins />, 
      bgColor: 'bg-emerald-50 text-emerald-600 border-emerald-100' 
    },
    { 
      title: 'Custom Furniture Orders', 
      value: '38 Active', 
      change: '+8.3%', 
      isPositive: true, 
      icon: <FaBoxOpen />, 
      bgColor: 'bg-indigo-50 text-indigo-600 border-indigo-100' 
    },
    { 
      title: 'Total Clients', 
      value: '1,124 Users', 
      change: '-1.5%', 
      isPositive: false, 
      icon: <FaUsers />, 
      bgColor: 'bg-amber-50 text-amber-600 border-amber-100' 
    },
  ];

  // 2. Real-time Operation Logs Data
  const recentLogs = [
    { id: 1, type: 'success', text: 'New custom sofa order #4102 confirmed by Client', time: '5 mins ago' },
    { id: 2, type: 'warning', text: 'Low inventory alert: Premium Mahogany wood stock falling', time: '12 mins ago' },
    { id: 3, type: 'info', text: 'Employee Melaku updated progress status on Order #3981', time: '1 hr ago' },
    { id: 4, type: 'success', text: 'Payment received for Dining Table setup #3940', time: '3 hrs ago' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* SECTION 1: HERO METRICS CARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((card, idx) => (
          <div 
            key={idx} 
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow duration-300"
          >
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <h3 className="text-2xl font-extrabold text-slate-800">
                {card.value}
              </h3>
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md ${
                  card.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {card.isPositive ? '+' : ''}{card.change}
                </span>
                <span className="text-slate-400 font-medium">vs last month</span>
              </div>
            </div>
            
            <div className={`p-4 rounded-xl border text-xl ${card.bgColor} shadow-sm`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 2: TWO-COLUMN MAIN CONTENT DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMN A: PERFORMANCE GRAPHS / PLACEHOLDER (Takes 2/3 of space) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between min-h-[350px]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-800">Furniture Workshop Velocity</h3>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <FaArrowTrendUp /> Live Performance
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-md">
              A comprehensive graphical breakdown visualizing monthly furniture construction, queue workloads, and milestone metrics will render dynamically here.
            </p>
          </div>

          {/* Clean UI/UX Placeholder Visualization Box */}
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl flex-grow mt-6 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400 mb-3">
              <FaArrowTrendUp className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Analytics Graph Module</p>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              Ready to parse production time metrics once linked to backend logs pipelines.
            </p>
          </div>
        </div>

        {/* COLUMN B: SYSTEM LOGS / OPERATIONAL AUDIT (Takes 1/3 of space) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col h-full">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-800">Recent Operations</h3>
            <p className="text-xs text-slate-400">Live operational events tracked across the platform</p>
          </div>

          {/* Activity Log Feed Stack */}
          <div className="space-y-4 flex-grow overflow-y-auto max-h-[300px] pr-1">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className={`mt-0.5 text-base flex-shrink-0 ${
                  log.type === 'success' ? 'text-emerald-500' :
                  log.type === 'warning' ? 'text-amber-500' : 'text-blue-500'
                }`}>
                  {log.type === 'success' ? <FaCircleCheck /> : 
                   log.type === 'warning' ? <FaTriangleExclamation /> : <FaClock />}
                </div>
                <div className="space-y-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 leading-snug break-words">
                    {log.text}
                  </p>
                  <span className="block text-[10px] font-medium text-slate-400 flex items-center gap-1">
                    <FaClock className="text-[9px]" /> {log.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminOverview;
