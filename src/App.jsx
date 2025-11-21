import { useState, useEffect } from 'react'
import MachineCard from './components/MachineCard'
import MachineManagement from './components/MachineManagement'
import InventorySheet from './components/InventorySheet'
import MachineDetailModal from './components/MachineDetailModal'
import { supabaseDatabase as database } from './services/supabaseService';

const BUILDINGS = ['B동', 'D동', 'MORI동', 'WIZ동'];

function App() {
  const [activeTab, setActiveTab] = useState('B동');
  const [machines, setMachines] = useState([]);
  const [isManagementOpen, setIsManagementOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);

  // Load initial data
  useEffect(() => {
    loadMachines();
  }, []);

  const loadMachines = async () => {
    const data = await database.getMachines();
    setMachines(data);
  };

  const handleMachinesUpdate = (updatedMachines) => {
    // Optimistic update or reload
    setMachines(updatedMachines);
  };

  const filteredMachines = machines
    .filter(m => m.building === activeTab)
    .sort((a, b) => {
      const priority = { 'RUNNING': 1, 'IDLE': 2, 'DONE': 3 };
      return priority[a.status] - priority[b.status];
    });

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
            🏭 생산 관리 대시보드
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsInventoryOpen(true)}
              className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-bold transition-colors shadow-md"
            >
              📋 보유설비 시트
            </button>
            <button
              onClick={() => setIsManagementOpen(true)}
              className="text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded border border-gray-600 transition-colors"
            >
              ⚙️ 관리
            </button>
            <span className="text-sm bg-gray-700 text-gray-300 px-3 py-1 rounded border border-gray-600">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto flex overflow-x-auto">
          {BUILDINGS.map(building => (
            <button
              key={building}
              onClick={() => setActiveTab(building)}
              className={`flex-1 py-4 text-center font-bold text-lg transition-colors border-b-4 ${activeTab === building
                ? 'border-blue-500 text-blue-400 bg-gray-700'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                }`}
            >
              {building}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredMachines.length > 0 ? (
            filteredMachines.map(machine => (
              <MachineCard
                key={machine.id}
                machine={machine}
                onClick={() => setSelectedMachine(machine)}
                onUpdate={loadMachines}
              />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl">등록된 기계가 없습니다.</p>
            </div>
          )}
        </div>
      </main>

      {/* Management Modal */}
      {isManagementOpen && (
        <MachineManagement
          machines={machines}
          onUpdate={loadMachines} // Refresh data after changes
          onClose={() => setIsManagementOpen(false)}
        />
      )}

      {/* Inventory Sheet Modal */}
      {isInventoryOpen && (
        <InventorySheet
          onUpdate={loadMachines}
          onClose={() => setIsInventoryOpen(false)}
        />
      )}

      {/* Machine Detail Modal */}
      {selectedMachine && (
        <MachineDetailModal
          machine={selectedMachine}
          onUpdate={loadMachines}
          onClose={() => setSelectedMachine(null)}
        />
      )}
    </div>
  )
}

export default App
