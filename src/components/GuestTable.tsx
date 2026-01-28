


import { Trash2 } from 'lucide-react';

export interface Guest {
  id: number;
  name: string;
  avatar: string; // URL or placeholder
  checkIn: string;
  checkOut: string;
  room: string;
  room2: string; 
}

interface GuestTableProps {
  guests: Guest[];
  onDelete: (id: number) => void;
}

export default function GuestTable({ guests, onDelete }: GuestTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-100/50 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Guest Name <span className="text-xs text-gray-400">▼</span></th>
              <th className="px-6 py-4">Check-In <span className="text-xs text-blue-500">•</span></th>
              <th className="px-6 py-4">Check-Out <span className="text-xs text-gray-400">▼</span></th>
              <th className="px-6 py-4 text-center">Room <span className="text-xs text-blue-500">•</span></th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {guests.length > 0 ? (
              guests.map((guest) => (
                <tr key={guest.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {/* Placeholder for avatar since we don't have images */}
                      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative">
                           {/* We can use a simple SVG or text if Next/Image fails without source */}
                           <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500 font-bold">
                              {guest.name.charAt(0)}
                           </div>
                      </div>
                      <span className="font-medium text-gray-800">{guest.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-gray-600">{guest.checkIn}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-gray-600">{guest.checkOut}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-center font-bold text-gray-700">{guest.room2}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-center">
                    <button 
                      onClick={() => onDelete(guest.id)}
                      className="p-1 hover:bg-red-50 hover:text-red-500 rounded transition-colors text-gray-400"
                      title="Delete guest"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
               <tr>
                 <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                   No guests found.
                 </td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
