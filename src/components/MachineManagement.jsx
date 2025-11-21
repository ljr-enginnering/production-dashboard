import React, { useState } from 'react';
import { supabaseDatabase as database } from '../services/supabaseService';

const MachineManagement = ({ machines, onUpdate, onClose }) => {
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        building: 'B동',
        name: '',
        itemName: '',
        status: 'IDLE',
        count: 0,
        target: 0
    });

    const BUILDINGS = ['B동', 'D동', 'MORI동', 'WIZ동'];

    const handleEdit = (machine) => {
        setEditingId(machine.id);
        setFormData(machine);
    };

    const handleDelete = async (id) => {
        if (confirm('정말 삭제하시겠습니까?')) {
            await database.deleteMachine(id);
            onUpdate();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            await database.updateMachine({ ...formData, id: editingId });
        } else {
            await database.createMachine(formData);
        }
        onUpdate();
        setEditingId(null);
        setFormData({
            building: 'B동',
            name: '',
            itemName: '',
            status: 'IDLE',
            count: 0,
            target: 0
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">기계 관리</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                </div>

                <div className="flex-1 overflow-auto p-4">
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-gray-700 p-4 rounded-lg mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">건물</label>
                                <select
                                    value={formData.building}
                                    onChange={e => setFormData({ ...formData, building: e.target.value })}
                                    className="w-full bg-gray-600 text-white rounded p-2 border border-gray-500"
                                >
                                    {BUILDINGS.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">기계명</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-gray-600 text-white rounded p-2 border border-gray-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">아이템명</label>
                                <input
                                    type="text"
                                    value={formData.itemName || ''}
                                    onChange={e => setFormData({ ...formData, itemName: e.target.value })}
                                    className="w-full bg-gray-600 text-white rounded p-2 border border-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">상태</label>
                                <select
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full bg-gray-600 text-white rounded p-2 border border-gray-500"
                                >
                                    <option value="RUNNING">작업중</option>
                                    <option value="IDLE">유휴설비</option>
                                    <option value="DONE">작업완료</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">현재 생산량</label>
                                <input
                                    type="number"
                                    value={formData.count}
                                    onChange={e => setFormData({ ...formData, count: Number(e.target.value) })}
                                    className="w-full bg-gray-600 text-white rounded p-2 border border-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">목표 생산량</label>
                                <input
                                    type="number"
                                    value={formData.target}
                                    onChange={e => setFormData({ ...formData, target: Number(e.target.value) })}
                                    className="w-full bg-gray-600 text-white rounded p-2 border border-gray-500"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={() => { setEditingId(null); setFormData({ building: 'B동', name: '', itemName: '', status: 'IDLE', count: 0, target: 0 }); }}
                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                                >
                                    취소
                                </button>
                            )}
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                            >
                                {editingId ? '수정 저장' : '추가'}
                            </button>
                        </div>
                    </form>

                    {/* List */}
                    <div className="space-y-2">
                        {machines.map(machine => (
                            <div key={machine.id} className="flex items-center justify-between bg-gray-700 p-3 rounded border border-gray-600">
                                <div>
                                    <span className="text-xs bg-gray-600 px-2 py-1 rounded mr-2">{machine.building}</span>
                                    <span className="font-bold text-white mr-2">{machine.name}</span>
                                    <span className="text-sm text-gray-400 mr-2">{machine.itemName}</span>
                                    <span className={`text-xs px-2 py-1 rounded ${machine.status === 'RUNNING' ? 'bg-green-900 text-green-300' :
                                        machine.status === 'IDLE' ? 'bg-yellow-900 text-yellow-300' : 'bg-blue-900 text-blue-300'
                                        }`}>
                                        {machine.status === 'RUNNING' ? '작업중' : machine.status === 'IDLE' ? '유휴설비' : '작업완료'}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(machine)}
                                        className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-500"
                                    >
                                        수정
                                    </button>
                                    <button
                                        onClick={() => handleDelete(machine.id)}
                                        className="px-3 py-1 bg-red-900/50 text-red-300 text-sm rounded hover:bg-red-900"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MachineManagement;
