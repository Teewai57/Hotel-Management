"use client"

import { useState, useMemo } from 'react';
import Header from "@/src/components/Header";
import StatsCard from "@/src/components/StatsCard";
import SearchFilter from "@/src/components/SearchFilter";
import GuestTable, { Guest } from "@/src/components/GuestTable";
import AddGuestModal from "@/src/components/AddGuestModal";
import { Users, CheckSquare, XSquare, BedDouble } from 'lucide-react';

const INITIAL_GUESTS: Guest[] = [
  { id: 1, name: "John Smith", avatar: "/avatars/1.jpg", checkIn: "12 Aug 2023 14:30", checkOut: "15 Aug 2023 11:00", room: "405", room2: "405" },
  { id: 2, name: "Sarah Johnson", avatar: "/avatars/2.jpg", checkIn: "12 Aug 2023 15:00", checkOut: "14 Aug 2023 10:30", room: "212", room2: "212" },
  { id: 3, name: "Ahmed Ali", avatar: "/avatars/3.jpg", checkIn: "13 Aug 2023 13:15", checkOut: "16 Aug 2023 12:00", room: "318", room2: "318" },
  { id: 4, name: "Maria Garcia", avatar: "/avatars/4.jpg", checkIn: "14 Aug 2023 16:45", checkOut: "18 Aug 2023 11:00", room: "102", room2: "102" },
  { id: 5, name: "David Brown", avatar: "/avatars/5.jpg", checkIn: "14 Aug 2023 15:00", checkOut: "16 Aug 2023 10:00", room: "215", room2: "215" },
  { id: 6, name: "Emily Davis", avatar: "/avatars/6.jpg", checkIn: "15 Aug 2023 17:00", checkOut: "17 Aug 2023 11:50", room: "110", room2: "110" },
  { id: 7, name: "Michael Wilson", avatar: "/avatars/7.jpg", checkIn: "15 Aug 2023 12:30", checkOut: "18 Aug 2023 11:15", room: "310", room2: "310" },
  { id: 8, name: "Jessica Lee", avatar: "/avatars/8.jpg", checkIn: "16 Aug 2023 11:00", checkOut: "18 Aug 2023 10:00", room: "208", room2: "208" },
  { id: 9, name: "William Johnson", avatar: "/avatars/9.jpg", checkIn: "16 Aug 2023 15:15", checkOut: "17 Aug 2023 09:30", room: "507", room2: "221" }, 
  { id: 10, name: "Rachel Green", avatar: "/avatars/10.jpg", checkIn: "16 Aug 2023 14:00", checkOut: "19 Aug 2023 12:00", room: "202", room2: "202" },
];

export default function Home() {
  const [guests, setGuests] = useState<Guest[]>(INITIAL_GUESTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter States
  const [searchName, setSearchName] = useState('');
  const [filterCheckIn, setFilterCheckIn] = useState('');
  const [filterCheckOut, setFilterCheckOut] = useState('');
  const [filterRoom, setFilterRoom] = useState('');

  // Derived State: Filtered Guests
  const filteredGuests = useMemo(() => {
    return guests.filter(guest => {
      const matchesName = guest.name.toLowerCase().includes(searchName.toLowerCase());
      const matchesRoom = filterRoom ? guest.room === filterRoom : true;
      
      const matchesCheckIn = filterCheckIn ? true : true; // Date parsing unimplemented for simplicity unless requested
      const matchesCheckOut = filterCheckOut ? true : true;

      return matchesName && matchesRoom && matchesCheckIn && matchesCheckOut;
    });
  }, [guests, searchName, filterRoom, filterCheckIn, filterCheckOut]);

  // Derived State: Stats
  const stats = useMemo(() => {
    const total = guests.length;
    
    // Parse date helper
    // Supported formats: "12 Aug 2023 14:30" or ISO from input
    const parseDate = (str: string) => new Date(str);
    const now = new Date(); 
    
    let checkedIn = 0;
    let checkedOut = 0;
    
    guests.forEach(g => {
       const cin = parseDate(g.checkIn);
       const cout = parseDate(g.checkOut);
       
       if (!isNaN(cin.getTime()) && !isNaN(cout.getTime())) {
          if (cout < now) {
            checkedOut++;
          } else if (cin <= now && cout > now) {
            checkedIn++;
          }
       }
    });

    const totalRooms = 100;
    const availableRooms = totalRooms - checkedIn;

    return {
      total,
      checkedIn,
      checkedOut,
      availableRooms
    };
  }, [guests]);


  const handleAddGuest = (newGuest: Guest) => {
    setGuests(prev => [newGuest, ...prev]);
  };

  const handleReset = () => {
    setSearchName('');
    setFilterCheckIn('');
    setFilterCheckOut('');
    setFilterRoom('');
  };

  const handleDelete = (id: number) => {
    setGuests(prev => prev.filter(guest => guest.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-2">
          Home &gt; <span className="font-semibold text-gray-700">Guest List</span>
        </div>
        
        {/* Title */}
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-2xl font-bold text-blue-900">Guest List</h2>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard 
            title="Total Guests" 
            count={stats.total} 
            icon={Users} 
            color="blue" 
          />
          <StatsCard 
            title="Checked-In" 
            count={stats.checkedIn} 
            icon={CheckSquare} 
            color="green" 
          />
          <StatsCard 
            title="Checked-Out" 
            count={stats.checkedOut} 
            icon={XSquare} 
            color="red" 
          />
          <StatsCard 
            title="Available Rooms" 
            count={stats.availableRooms} 
            icon={BedDouble} 
            color="yellow" 
          />
        </div>

        {/* Search & Filter */}
        <SearchFilter 
          searchName={searchName}
          setSearchName={setSearchName}
          checkIn={filterCheckIn}
          setCheckIn={setFilterCheckIn}
          checkOut={filterCheckOut}
          setCheckOut={setFilterCheckOut}
          room={filterRoom}
          setRoom={setFilterRoom}
          onReset={handleReset}
          onAddGuest={() => setIsModalOpen(true)}
        />

        {/* Table */}
        <GuestTable guests={filteredGuests} onDelete={handleDelete} />

        {/* Modal */}
        <AddGuestModal 
           isOpen={isModalOpen} 
           onClose={() => setIsModalOpen(false)} 
           onAdd={handleAddGuest}
        />

      </main>
    </div>
  );
}
