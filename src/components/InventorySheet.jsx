import React, { useState, useEffect } from 'react';
import { database } from '../services/database';

const InventorySheet = ({ onClose, onUpdate }) => {
    const [rows, setRows] = useState([]);
    const BUILDINGS = ['B동', 'D동', 'MORI동', 'WIZ동'];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await database.getMachines();
        // Sort by building then name for easier editing
        const sorted = [...data].sort((a, b) => a.building.localeCompare(b.building) || a.name.localeCompare(b.name));
        // Convert possibleItems array to string for editing
        const formatted = sorted.map(item => ({
            ...item,
            itemString: item.possibleItems ? item.possibleItems.join(', ') : (item.itemName || '')
        }));
        setRows(formatted);
    };

    const handleAddRow = () => {
        const newRow = {
            id: Date.now(),
            building: 'B동',
            name: '',
            itemName: '',
            itemString: '',
            status: 'IDLE',
            count: 0,
            target: 0,
            isNew: true
        };
        setRows([...rows, newRow]);
    };

    const handleChange = (id, field, value) => {
        setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row));
    };

    const handleDeleteRow = (id) => {
        setRows(rows.filter(row => row.id !== id));
    };

    const handleSave = async () => {
        if (confirm('모든 변경사항을 저장하시겠습니까?')) {
            // Process rows to convert itemString back to possibleItems
            const processedRows = rows.map(row => {
                const items = row.itemString
                    ? row.itemString.split(',').map(s => s.trim()).filter(s => s.length > 0)
                    : [];

                return {
                    ...row,
                    possibleItems: items,
                    // If current itemName is not in the new list, default to first item or empty
                    itemName: items.includes(row.itemName) ? row.itemName : (items.length > 0 ? items[0] : '')
                };
            });

            await database.saveAllMachines(processedRows);
            onUpdate();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">📋 보유설비 관리 시트</h2>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white">취소</button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-500"
                        >
                            전체 저장
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-4">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-gray-400 border-b border-gray-700">
                                <th className="p-3 w-32">건물 (위치)</th>
                                <th className="p-3 w-48">설비명</th>
                                <th className="p-3">생산 아이템 (쉼표로 구분)</th>
                                <th className="p-3 w-24 text-center">삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(row => (
                                <tr key={row.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                    <td className="p-2">
                                        <select
                                            value={row.building}
                                            onChange={e => handleChange(row.id, 'building', e.target.value)}
                                            className="w-full bg-gray-900 text-white border border-gray-600 rounded p-2"
                                        >
                                            {BUILDINGS.map(b => <option key={b} value={b}>{b}</option>)}
                                        </select>
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            value={row.name}
                                            onChange={e => handleChange(row.id, 'name', e.target.value)}
                                            className="w-full bg-gray-900 text-white border border-gray-600 rounded p-2"
                                            placeholder="예: Press-01"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            value={row.itemString || ''}
                                            onChange={e => handleChange(row.id, 'itemString', e.target.value)}
                                            className="w-full bg-gray-900 text-white border border-gray-600 rounded p-2"
                                            placeholder="예: 아이템A, 아이템B"
                                        />
                                    </td>
                                    <td className="p-2 text-center">
                                        <button
                                            onClick={() => handleDeleteRow(row.id)}
                                            className="text-red-400 hover:text-red-300 px-2 py-1"
                                        >
                                            ✕
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button
                        onClick={handleAddRow}
                        className="mt-4 w-full py-3 border-2 border-dashed border-gray-600 text-gray-400 rounded hover:border-gray-500 hover:text-gray-300"
                    >
                        + 설비 추가하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InventorySheet;
