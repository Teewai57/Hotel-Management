


import { Trash2, Edit, LogOut, Receipt } from 'lucide-react';
import { GuestDisplay } from '@/src/types';

interface GuestTableProps {
  guests: GuestDisplay[];
  onDelete: (id: number) => void;
  onEdit: (guest: GuestDisplay) => void;
  onCheckout: (id: number) => void;
  onReceipt: (guest: GuestDisplay) => void;
}

export default function GuestTable({ guests, onDelete, onEdit, onCheckout, onReceipt }: GuestTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-100/50 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Guest Name <span className="text-xs text-gray-400">▼</span></th>
              <th className="px-6 py-4">Contact Info</th>
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
                  <td className="px-6 py-3 whitespace-nowrap text-gray-600">
                    <div className="flex flex-col text-xs">
                        {guest.email && <span>{guest.email}</span>}
                        {guest.phone && <span>{guest.phone}</span>}
                        {guest.address && <span className="text-gray-400 truncate max-w-[150px]">{guest.address}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-gray-600">{guest.checkIn}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-gray-600">{guest.checkOut}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-center font-bold text-gray-700">{guest.room2}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => onReceipt(guest)}
                        className="p-1 hover:bg-purple-50 hover:text-purple-500 rounded transition-colors text-gray-400"
                        title="Generate Receipt"
                      >
                        <Receipt className="w-4 h-4" />
                      </button>
                      
                      {guest.status === 'CheckedIn' || guest.status === 'Confirmed' ? (
                          <button 
                            onClick={() => onCheckout(guest.id)}
                            className="p-1 hover:bg-green-50 hover:text-green-500 rounded transition-colors text-gray-400"
                            title="Check Out"
                          >
                            <LogOut className="w-4 h-4" />
                          </button>
                      ) : guest.status === 'CheckedOut' ? (
                          <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">Checked Out</span>
                      ) : (
                          <span className="w-6 inline-block"></span>
                      )}

                      <button 
                        onClick={() => onEdit(guest)}
                        className="p-1 hover:bg-blue-50 hover:text-blue-500 rounded transition-colors text-gray-400"
                        title="Edit guest"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(guest.guest_id)}
                        className="p-1 hover:bg-red-50 hover:text-red-500 rounded transition-colors text-gray-400"
                        title="Delete guest"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
