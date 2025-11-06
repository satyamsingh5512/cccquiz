'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AnimatedBackground from '@/components/AnimatedBackground';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Search, UserPlus, Trash2, Users } from 'lucide-react';

export default function RegistrationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEvent, setFilterEvent] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [event, setEvent] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated' || (session && !session.user?.isAdmin)) {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  useEffect(() => {
    filterResults();
  }, [searchTerm, filterEvent, registrations]);

  const fetchRegistrations = async () => {
    try {
      const res = await fetch('/api/registrations');
      const data = await res.json();
      if (Array.isArray(data)) {
        setRegistrations(data);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  const filterResults = () => {
    let filtered = registrations;

    if (filterEvent !== 'all') {
      filtered = filtered.filter((r: any) => r.event === filterEvent);
    }

    if (searchTerm) {
      filtered = filtered.filter((r: any) =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRegistrations(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, rollNumber, email, phone, event }),
      });

      if (res.ok) {
        alert('Registration added successfully!');
        setName('');
        setRollNumber('');
        setEmail('');
        setPhone('');
        setEvent('');
        setShowAddForm(false);
        fetchRegistrations();
      } else {
        alert('Failed to add registration');
      }
    } catch (error) {
      alert('Error adding registration');
      console.error(error);
    }
  };

  const deleteRegistration = async (id: string) => {
    if (!confirm('Are you sure you want to delete this registration?')) {
      return;
    }

    try {
      const res = await fetch(`/api/registrations/delete?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Registration deleted successfully!');
        fetchRegistrations();
      } else {
        alert('Failed to delete registration');
      }
    } catch (error) {
      alert('Error deleting registration');
      console.error(error);
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Roll Number', 'Email', 'Phone', 'Event', 'Registered At', 'Registered By'];
    const rows = filteredRegistrations.map((r: any) => [
      r.name,
      r.rollNumber,
      r.email,
      r.phone || 'N/A',
      r.event,
      new Date(r.registeredAt).toLocaleString(),
      r.registeredBy,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `event-registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const uniqueEvents = Array.from(new Set(registrations.map((r: any) => r.event)));

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.push('/admin')}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back to Admin Dashboard</span>
          </button>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Spot Registrations
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Register members for events on-the-spot
          </p>
        </motion.div>

        <div className="mb-8 flex space-x-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition"
          >
            <UserPlus size={20} />
            <span>Add Registration</span>
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition"
          >
            <Download size={20} />
            <span>Export CSV</span>
          </button>
        </div>

        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 mb-8 shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-4">Add New Registration</h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Roll Number *</label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Event *</label>
                <input
                  type="text"
                  value={event}
                  onChange={(e) => setEvent(e.target.value)}
                  placeholder="e.g., Cloud Workshop, Quiz Competition"
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>
              <div className="md:col-span-2 flex space-x-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Add Registration
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl mb-8">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <p className="text-sm opacity-90 mb-1">Total Registrations</p>
              <p className="text-4xl font-bold">{registrations.length}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <p className="text-sm opacity-90 mb-1">Unique Events</p>
              <p className="text-4xl font-bold">{uniqueEvents.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
              <p className="text-sm opacity-90 mb-1">Filtered Results</p>
              <p className="text-4xl font-bold">{filteredRegistrations.length}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, roll number, or email..."
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <select
              value={filterEvent}
              onChange={(e) => setFilterEvent(e.target.value)}
              className="px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="all">All Events</option>
              {uniqueEvents.map((evt: string) => (
                <option key={evt} value={evt}>
                  {evt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Roll No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Event</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Registered</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRegistrations.map((reg: any, index) => (
                  <motion.tr
                    key={reg._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium">{reg.name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono">
                      {reg.rollNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {reg.email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {reg.phone || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold">
                        {reg.event}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {new Date(reg.registeredAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteRegistration(reg._id)}
                        className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredRegistrations.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 dark:text-gray-400">No registrations found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
