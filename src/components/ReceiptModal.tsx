import { X, Printer } from 'lucide-react';
import { GuestDisplay } from '@/src/types';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: GuestDisplay | null;
}

export default function ReceiptModal({ isOpen, onClose, guest }: ReceiptModalProps) {
  if (!isOpen || !guest) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
      const element = document.getElementById('receipt-content');
      if (element) {
          const content = element.innerText; // Simple text download for now
          const blob = new Blob([content], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `receipt-${guest.name}-${Date.now()}.txt`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
      }
  };

  // Calculate generic cost
  const pricePerNight = 100; // Default
  const nights = Math.max(1, Math.ceil((new Date(guest.checkOutISO || '').getTime() - new Date(guest.checkInISO || '').getTime()) / (1000 * 60 * 60 * 24)));
  const totalCost = nights * pricePerNight;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm print:bg-white print:static print:block print:h-auto print:w-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl mx-4 overflow-hidden print:shadow-none print:w-full print:max-w-none print:mx-0 print:rounded-none">
        
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b print:hidden">
          <h3 className="text-base font-semibold text-gray-800">Guest Receipt</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="p-6 print:p-0" id="receipt-content">
            {/* Receipt Header */}
            <div className="text-center mb-6 border-b pb-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Hotel Management</h1>
                <p className="text-sm text-gray-500">123 Hotel Street, City, Country</p>
                <p className="text-sm text-gray-500">Tel: +1 234 567 8900</p>
            </div>

            {/* Receipt Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Guest Details</h4>
                    <p className="font-semibold text-gray-900">{guest.name}</p>
                    <p className="text-sm text-gray-600">{guest.email}</p>
                </div>
                <div className="text-right">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Receipt Info</h4>
                    <p className="text-sm text-gray-600"><span className="font-medium">Date:</span> {new Date().toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600"><span className="font-medium">Room:</span> {guest.room}</p>
                </div>
            </div>

            {/* Line Items */}
            <table className="w-full mb-6 text-sm">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="text-left py-2 text-gray-600 font-semibold">Description</th>
                        <th className="text-right py-2 text-gray-600 font-semibold">Amount</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    <tr>
                        <td className="py-2 text-gray-800">
                            Room Charges ({nights} nights)
                        </td>
                        <td className="py-2 text-right text-gray-800">${totalCost.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td className="py-2 text-gray-800">Service Fee (10%)</td>
                        <td className="py-2 text-right text-gray-800">${(totalCost * 0.1).toFixed(2)}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr className="border-t border-gray-900">
                        <td className="py-3 text-base font-bold text-gray-900">Total</td>
                        <td className="py-3 text-right text-base font-bold text-gray-900">${(totalCost * 1.1).toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>

            {/* Footer */}
            <div className="text-center text-gray-400 text-xs mt-4 pt-4 border-t">
                <p>Thank you for staying with us!</p>
            </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 p-3 flex justify-end gap-3 print:hidden">
            <button 
                onClick={onClose}
                className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-100"
            >
                Close
            </button>
            <button 
                onClick={handleDownload}
                className="px-3 py-1.5 border border-blue-600 text-blue-600 rounded text-sm font-medium hover:bg-blue-50 flex items-center gap-2"
            >
                 Download
            </button>
            <button 
                onClick={handlePrint}
                className="px-3 py-1.5 bg-blue-800 text-white rounded text-sm font-medium hover:bg-blue-900 flex items-center gap-2"
            >
                <Printer className="w-4 h-4" /> Print
            </button>
        </div>

      </div>
    </div>
  );
}
