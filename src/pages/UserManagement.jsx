import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Plus, Trash2, Search, Shield, ShieldAlert, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserManagement = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({
        email: '',
        full_name: '',
        password: '',
        role: 'counselor'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/users/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/users/', newUser, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowModal(false);
            setNewUser({ email: '', full_name: '', password: '', role: 'counselor' });
            fetchUsers();
        } catch (error) {
            console.error("Failed to create user", error);
            alert("Failed to create user. Email might be taken.");
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await axios.delete(`http://localhost:8000/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (error) {
            console.error("Failed to delete user", error);
            alert("Failed to delete user.");
        }
    };

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
            {/* Header */}
            <div className="flex items-center justify-between pt-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">User Management</h1>
                    <p className="text-sm font-medium text-gray-500 mt-1">Manage system access and roles</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-accent-blue hover:bg-accent-purple text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-accent-blue/20"
                >
                    <Plus className="w-4 h-4" />
                    Add New User
                </button>
            </div>

            {/* Users Table */}
            <div className="bg-[#111827] rounded-3xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">System Users</h3>
                    <div className="relative">
                        <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="bg-[#1f2937] text-white text-sm rounded-lg pl-9 pr-4 py-2 border border-transparent focus:border-accent-blue outline-none transition-all w-64 placeholder:text-gray-600 font-medium"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#1f2937]/30">
                            <tr>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((user) => (
                                <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#1f2937] flex items-center justify-center text-gray-400 border border-white/10">
                                                <Users className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm">{user.full_name}</p>
                                                <p className="text-[11px] text-gray-500 font-medium">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${user.role === 'admin'
                                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                            }`}>
                                            {user.role === 'admin' ? <ShieldAlert className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wide bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                            Active
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                            title="Delete User"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add User Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#111827] rounded-3xl border border-white/10 w-full max-w-md p-8 shadow-2xl relative">
                        <h2 className="text-2xl font-bold text-white mb-6">Add New User</h2>

                        <form onSubmit={handleCreateUser} className="space-y-5">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 block mb-2">Full Name</label>
                                <div className="relative">
                                    <Users className="w-5 h-5 text-gray-500 absolute left-4 top-3.5" />
                                    <input
                                        type="text"
                                        required
                                        value={newUser.full_name}
                                        onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                                        className="w-full bg-[#0a0e1a] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-accent-blue outline-none transition-colors"
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 block mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="w-5 h-5 text-gray-500 absolute left-4 top-3.5" />
                                    <input
                                        type="email"
                                        required
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                        className="w-full bg-[#0a0e1a] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-accent-blue outline-none transition-colors"
                                        placeholder="e.g. john@college.edu"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 block mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="w-5 h-5 text-gray-500 absolute left-4 top-3.5" />
                                    <input
                                        type="password"
                                        required
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                        className="w-full bg-[#0a0e1a] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-accent-blue outline-none transition-colors"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 block mb-2">Role</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setNewUser({ ...newUser, role: 'counselor' })}
                                        className={`py-3 rounded-xl border font-bold text-sm transition-all ${newUser.role === 'counselor'
                                                ? 'bg-accent-blue text-white border-accent-blue shadow-lg shadow-accent-blue/20'
                                                : 'bg-[#0a0e1a] text-gray-400 border-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        Counselor
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewUser({ ...newUser, role: 'admin' })}
                                        className={`py-3 rounded-xl border font-bold text-sm transition-all ${newUser.role === 'admin'
                                                ? 'bg-accent-purple text-white border-accent-purple shadow-lg shadow-accent-purple/20'
                                                : 'bg-[#0a0e1a] text-gray-400 border-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        Administrator
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3.5 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3.5 rounded-xl bg-accent-blue text-white font-bold hover:bg-accent-purple transition-all shadow-lg shadow-accent-blue/20"
                                >
                                    Create User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
