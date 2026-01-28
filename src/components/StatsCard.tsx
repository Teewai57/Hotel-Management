import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'red' | 'yellow';
}

export default function StatsCard({ title, count, icon: Icon, color }: StatsCardProps) {
  const colorMap = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-500',
  };

  const bgClass = colorMap[color] || 'bg-blue-600';

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between relative overflow-hidden h-24">
       <div className="flex items-center gap-4 z-10">
          <div className={`${bgClass} p-3 rounded-md text-white`}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-gray-800 text-2xl font-bold">{count}</p>
          </div>
       </div>
       
       {/* Large Number Watermark Effect on right */}
       <div className="absolute right-2 bottom-0 text-6xl font-bold text-gray-100/50 pointer-events-none -z-0">
          {count}
       </div>
    </div>
  );
}
