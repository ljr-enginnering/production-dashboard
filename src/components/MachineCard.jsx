import React from 'react';
import { database } from '../services/database';

const StatusBadge = ({ status }) => {
    const colors = {
        RUNNING: 'bg-green-900/50 text-green-300 border border-green-700',
        IDLE: 'bg-yellow-900/50 text-yellow-300 border border-yellow-700',
        DONE: 'bg-blue-900/50 text-blue-300 border border-blue-700',
    };
    const statusText = {
        RUNNING: '작업중',
        IDLE: '유휴설비',
        DONE: '작업완료',
    };
    return (
        <span className={`px-3 py-1 rounded-full text-sm font-bold ${colors[status]}`}>
            {statusText[status]}
        </span>
    );
};

const MachineCard = ({ machine, onClick, onUpdate }) => {
    const getBorderClass = (status) => {
        switch (status) {
            case 'RUNNING':
                return 'border-l-8 border-green-500';
            case 'IDLE':
                return 'border-l-8 border-yellow-500';
            case 'DONE':
                return 'border-l-8 border-blue-500';
            default:
                return '';
        }
    };

    const handleItemChange = async (e) => {
        const newItem = e.target.value;
        await database.updateMachine({ ...machine, itemName: newItem });
        if (onUpdate) {
            onUpdate();
        }
    };

    const progress = machine.target > 0 ? Math.min(100, (machine.count / machine.target) * 100) : 0;

    return (
        <div
            onClick={onClick}
            className={`bg-gray-800 rounded-lg shadow-md p-6 mb-4 transition-transform hover:scale-102 hover:shadow-lg border border-gray-700 ${getBorderClass(machine.status)} cursor-pointer active:scale-95`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1 mr-4">
                    <h3 className="text-2xl font-bold text-white">{machine.name}</h3>

                    {machine.possibleItems && machine.possibleItems.length > 0 ? (
                        <select
                            value={machine.itemName || ''}
                            onChange={handleItemChange}
                            className="mt-2 w-full bg-gray-700 text-white text-sm rounded p-1 border border-gray-600 focus:border-blue-500 outline-none"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <option value="" disabled>
                                아이템 선택
                            </option>
                            {machine.possibleItems.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    ) : (
                        machine.itemName && <p className="text-gray-400 text-sm mt-1">{machine.itemName}</p>
                    )}
                </div>
                <StatusBadge status={machine.status} />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-gray-400">
                    <span>생산량</span>
                    <span className="font-mono text-xl font-bold text-gray-200">
                        {machine.count.toLocaleString()} / {machine.target.toLocaleString()}
                    </span>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-4">
                    <div
                        className={`h-4 rounded-full transition-all duration-500 ${machine.status === 'RUNNING' ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default MachineCard;
