import React, { useState, useEffect } from 'react';
import { database } from '../services/database';

const MachineDetailModal = ({ machine, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({ ...machine });

    useEffect(() => {
        setFormData({ ...machine });
    }, [machine]);

    const handleSave = async () => {
        await database.updateMachine(formData);
        onUpdate();
        onClose();
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const adjustCount = (amount) => {
        const newCount = Math.max(0, (parseInt(formData.count) || 0) + amount);
        handleChange('count', newCount);
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg border border-gray-700 overflow-hidden">
                {/* Header */}
                <div className="bg-gray-900 p-6 border-b border-gray-700 flex justify-between items-center">
                    <div>
                        <span className="text-gray-400 text-sm font-bold">{formData.building}</span>
                        <h2 className="text-2xl font-bold text-white mt-1">{formData.name}</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Status Control */}
                    <div>
                        <label className="block text-gray-400 text-sm font-bold mb-3">상태 변경</label>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                onClick={() => handleChange('status', 'RUNNING')}
                                className={`py-4 rounded-lg font-bold text-lg transition-all ${formData.status === 'RUNNING'
                                    ? 'bg-green-600 text-white ring-2 ring-green-400 shadow-lg scale-105'
                                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                    }`}
                            >
                                🟢 작업중
                            </button>
                            <button
                                onClick={() => handleChange('status', 'IDLE')}
                                className={`py-4 rounded-lg font-bold text-lg transition-all ${formData.status === 'IDLE'
                                    ? 'bg-yellow-600 text-white ring-2 ring-yellow-400 shadow-lg scale-105'
                                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                    }`}
                            >
                                🟡 유휴
                            </button>
                            <button
                                onClick={() => handleChange('status', 'DONE')}
                                className={`py-4 rounded-lg font-bold text-lg transition-all ${formData.status === 'DONE'
                                    ? 'bg-blue-600 text-white ring-2 ring-blue-400 shadow-lg scale-105'
                                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                    }`}
                            >
                                🔵 완료
                            </button>
                        </div>
                    </div>

                    {/* Item Selection */}
                    <div>
                        <label className="block text-gray-400 text-sm font-bold mb-2">생산 아이템</label>
                        {formData.possibleItems && formData.possibleItems.length > 0 ? (
                            <select
                                value={formData.itemName || ''}
                                onChange={(e) => handleChange('itemName', e.target.value)}
                                className="w-full bg-gray-900 text-white text-lg rounded-lg p-3 border border-gray-600 focus:border-blue-500 outline-none"
                            >
                                <option value="" disabled>아이템 선택</option>
                                {formData.possibleItems.map(item => (
                                    <option key={item} value={item}>{item}</option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type="text"
                                value={formData.itemName || ''}
                                onChange={(e) => handleChange('itemName', e.target.value)}
                                className="w-full bg-gray-900 text-white text-lg rounded-lg p-3 border border-gray-600"
                                placeholder="아이템 이름 직접 입력"
                            />
                        )}
                    </div>

                    {/* Production Count */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-2">현재 수량</label>
                            <div className="flex items-center bg-gray-900 rounded-lg border border-gray-600 p-1 h-16">
                                <button
                                    onClick={() => adjustCount(-10)}
                                    className="w-12 h-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded text-xl"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={formData.count}
                                    onChange={(e) => handleChange('count', parseInt(e.target.value) || 0)}
                                    className="flex-1 bg-transparent text-center text-3xl font-bold text-white outline-none no-spinner"
                                />
                                <button
                                    onClick={() => adjustCount(10)}
                                    className="w-12 h-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded text-xl"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-2">목표 수량</label>
                            <div className="bg-gray-900 rounded-lg border border-gray-600 p-1 h-16 flex items-center">
                                <input
                                    type="number"
                                    value={formData.target}
                                    onChange={(e) => handleChange('target', parseInt(e.target.value) || 0)}
                                    className="w-full bg-transparent text-center text-3xl font-bold text-gray-400 focus:text-white outline-none no-spinner"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-700 flex justify-end gap-3 bg-gray-900">
                    <button onClick={onClose} className="px-6 py-3 rounded-lg text-gray-400 hover:bg-gray-800 font-bold">
                        취소
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg"
                    >
                        저장 및 닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MachineDetailModal;
