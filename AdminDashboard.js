import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useChatStore } from './store';
import { CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const socket = io('http://localhost:5000');

const AdminDashboard = () => {
  const { reports, addReport, recoveredCount, setRecovered } = useChatStore();
  const [showCheck, setShowCheck] = useState(false);
  const [unbanUser, setUnbanUser] = useState('');

  useEffect(() => {
    socket.on('new_report_to_admin', (data) => addReport(data));
    socket.on('user_pulih_update', (data) => setRecovered(data.recoveredCount));
  }, []);

  const handleUnban = () => {
    socket.emit('admin_unban_user', { username: unbanUser });
    setShowCheck(true);
    setTimeout(() => setShowCheck(false), 2000);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">Admin Jaguar</h1>
      <p className="text-blue-600 mb-6">(akun developer resmi)</p>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-sm opacity-60">Jumlah User Pulih</h2>
          <p className="text-3xl font-bold text-green-600">{recoveredCount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <input className="border p-2 w-full mb-2" placeholder="@username" value={unbanUser} onChange={e=>setUnbanUser(e.target.value)}/>
          <button onClick={handleUnban} className="bg-red-500 text-white p-2 rounded w-full">UNBAN USER</button>
        </div>
      </div>

      <table className="w-full bg-white rounded shadow text-left">
        <thead className="bg-gray-200">
          <tr><th className="p-3">User</th><th className="p-3">Bukti</th><th className="p-3">Aksi</th></tr>
        </thead>
        <tbody>
          {reports.map((r, i) => (
            <tr key={i} className="border-b">
              <td className="p-3">@{r.username}</td>
              <td className="p-3"><img src={r.img} width="50"/></td>
              <td className="p-3 font-bold text-orange-500">Pending</td>
            </tr>
          ))}
        </tbody>
      </table>

      <AnimatePresence>
        {showCheck && (
          <motion.div initial={{scale:0}} animate={{scale:1}} exit={{scale:0}} className="fixed inset-0 flex items-center justify-center bg-black/20">
            <CheckCircle size={100} className="text-green-500 bg-white rounded-full p-2 shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default AdminDashboard;
