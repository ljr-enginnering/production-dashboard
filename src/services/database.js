// localStorage 기반 Mock Database
const DEFAULT_MACHINES = [
    { id: 1, name: 'Press-01', building: 'B동', status: 'RUNNING', itemName: 'Bracket-A', possibleItems: ['Bracket-A', 'Bracket-B'], count: 1250, target: 2000 },
    { id: 2, name: 'Press-02', building: 'B동', status: 'IDLE', itemName: '', possibleItems: [], count: 0, target: 0 },
    { id: 3, name: 'Press-03', building: 'B동', status: 'DONE', itemName: 'Cover-B', possibleItems: ['Cover-B', 'Cover-C'], count: 500, target: 500 },
    { id: 4, name: 'Press-04', building: 'D동', status: 'RUNNING', itemName: 'Panel-X', possibleItems: ['Panel-X', 'Panel-Y'], count: 3400, target: 5000 },
    { id: 5, name: 'Press-05', building: 'D동', status: 'RUNNING', itemName: 'Panel-Y', possibleItems: ['Panel-Y', 'Panel-Z'], count: 2100, target: 3000 },
    { id: 6, name: 'Mori-01', building: 'MORI동', status: 'IDLE', itemName: '', possibleItems: ['Part-A', 'Part-B'], count: 100, target: 1000 },
    { id: 7, name: 'Wiz-01', building: 'WIZ동', status: 'DONE', itemName: 'Gear-Z', possibleItems: ['Gear-Z'], count: 800, target: 800 }
];

const STORAGE_KEY = 'dashboard_machines';

// Helper to simulate network delay
const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

export const database = {
    async getMachines() {
        await delay(50);
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) {
            // Initialize with default data if empty
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MACHINES));
            return DEFAULT_MACHINES;
        }
        return JSON.parse(saved);
    },

    async createMachine(machine) {
        await delay(100);
        const machines = await this.getMachines();
        const newMachine = { ...machine, id: Date.now() };
        const updatedMachines = [...machines, newMachine];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMachines));
        return newMachine;
    },

    async updateMachine(updatedMachine) {
        await delay(100);
        const machines = await this.getMachines();
        const updatedMachines = machines.map(m =>
            m.id === updatedMachine.id ? updatedMachine : m
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMachines));
        return updatedMachine;
    },

    async deleteMachine(id) {
        await delay(100);
        const machines = await this.getMachines();
        const updatedMachines = machines.filter(m => m.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMachines));
        return id;
    },

    async saveAllMachines(machines) {
        await delay(100);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(machines));
        return machines;
    }
};
