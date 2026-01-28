
"use client"

import { useState } from 'react';
import { X } from 'lucide-react';

interface AddGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (guest: any) => void;
}

export default function AddGuestModal({ isOpen, onClose, onAdd }: AddGuestModalProps) {
  const [name, setName] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [room, setRoom] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !checkIn || !checkOut || !room) {
      alert("Please fill in all fields");
      return;
    }

    const newGuest = {
      id: Date.now(), // simple unique id
      name,
      avatar: "/avatars/default.jpg", 
      checkIn,
      checkOut,
      room,
      room2: room // assuming room2 is same as room
    };

    onAdd(newGuest);
    // Reset form
    setName('');
    setCheckIn('');
    setCheckOut('');
    setRoom('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Add New Guest</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-black border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Enter guest name"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-In</label>
                <input 
                  type="datetime-local"  // using datetime-local for simplicity matching the table format vaguely
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full text-black border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-Out</label>
                <input 
                  type="datetime-local" 
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full text-black border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
            <input 
              type="text" 
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full text-black border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              placeholder="e.g. 101"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
             <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50"
             >
                Cancel
             </button>
             <button 
                type="submit"
                className="px-4 py-2 bg-blue-800 text-white rounded text-sm font-medium hover:bg-blue-900"
             >
                Add Guest
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
