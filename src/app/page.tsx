"use client"

import Header from "../components/Header";
import StatsCard from "../components/StatsCard";
import SearchFilter from "../components/SearchFilter";
import GuestTable from "../components/GuestTable";
import Pagination from "../components/Pagination";
import AddGuestModal from "../components/AddGuestModal";
import { Users, CheckSquare, XSquare, BedDouble } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Guest } from "../components/GuestTable";

export default function Home() {
  // Filter States
  const [searchName, setSearchName] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [room, setRoom] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('guests');
    if (saved) {
      try {
        setGuests(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse guests from localStorage", e);
      }
    } else {
      // Default data if no localStorage found
      setGuests([
        { id: 1, name: 'Samantha Williams', avatar: '', checkIn: 'Oct 25th, 2023', checkOut: 'Oct 28th, 2023', room: '101', room2: '101' },
        { id: 2, name: 'Tony Soap', avatar: '', checkIn: 'Oct 25th, 2023', checkOut: 'Oct 28th, 2023', room: '102', room2: '102' },
        { id: 3, name: 'Karen Hope', avatar: '', checkIn: 'Oct 25th, 2023', checkOut: 'Oct 28th, 2023', room: '103', room2: '103' },
        { id: 4, name: 'Jordan Stevenson', avatar: '', checkIn: 'Oct 25th, 2023', checkOut: 'Oct 28th, 2023', room: '104', room2: '104' },
        { id: 5, name: 'Daniel Johnston', avatar: '', checkIn: 'Oct 25th, 2023', checkOut: 'Oct 28th, 2023', room: '105', room2: '105' },
        { id: 6, name: 'Rita Holland', avatar: '', checkIn: 'Oct 25th, 2023', checkOut: 'Oct 28th, 2023', room: '106', room2: '106' },
        { id: 7, name: 'Julia Robertson', avatar: '', checkIn: 'Oct 25th, 2023', checkOut: 'Oct 28th, 2023', room: '107', room2: '107' },
        { id: 8, name: 'Arthur Nelson', avatar: '', checkIn: 'Oct 25th, 2023', checkOut: 'Oct 28th, 2023', room: '108', room2: '108' },
      ]);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when guests change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('guests', JSON.stringify(guests));
    }
  }, [guests, isLoaded]);

  const handleReset = () => {
    setSearchName('');
    setCheckIn('');
    setCheckOut('');
    setRoom('');
  };

  const handleAddGuest = (newGuest: Guest) => {
    setGuests([...guests, newGuest]);
  };

  const handleDeleteGuest = (id: number) => {
    setGuests(guests.filter(guest => guest.id !== id));
  };

  const filteredGuests = guests.filter(guest => {
      const matchesName = guest.name.toLowerCase().includes(searchName.toLowerCase());
      const matchesRoom = room ? guest.room.includes(room) : true;
      return matchesName && matchesRoom;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-2">
          Home &gt; <span className="font-semibold text-gray-700">Guest List</span>
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-blue-900 mb-6">Guest List</h2>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard 
            title="Total Guests" 
            count={248} 
            icon={Users} 
            color="blue" 
          />
          <StatsCard 
            title="Checked-In" 
            count={18} 
            icon={CheckSquare} 
            color="green" 
          />
          <StatsCard 
            title="Checked-Out" 
            count={36} 
            icon={XSquare} 
            color="red" 
          />
          <StatsCard 
            title="Available Rooms" 
            count={92} 
            icon={BedDouble} 
            color="yellow" 
          />
        </div>

        {/* Search & Filter */}
        <SearchFilter 
          searchName={searchName}
          setSearchName={setSearchName}
          checkIn={checkIn}
          setCheckIn={setCheckIn}
          checkOut={checkOut}
          setCheckOut={setCheckOut}
          room={room}
          setRoom={setRoom}
          onReset={handleReset}
          onAddGuest={() => setIsModalOpen(true)}
        />

        {/* Table */}
        <GuestTable guests={filteredGuests} onDelete={handleDeleteGuest} />

        {/* Pagination */}
        <Pagination />

      </main>

      <AddGuestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddGuest} 
      />
    </div>
  );
}
