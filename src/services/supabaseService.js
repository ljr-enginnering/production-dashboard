// src/services/supabaseService.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const DEFAULT_MACHINES = [
    { id: 1, name: 'Press-01', building: 'B동', status: 'RUNNING', itemName: 'Bracket-A', possibleItems: ['Bracket-A', 'Bracket-B'], count: 1250, target: 2000 },
    { id: 2, name: 'Press-02', building: 'B동', status: 'IDLE', itemName: '', possibleItems: [], count: 0, target: 0 },
    { id: 3, name: 'Press-03', building: 'B동', status: 'DONE', itemName: 'Cover-B', possibleItems: ['Cover-B', 'Cover-C'], count: 500, target: 500 },
    { id: 4, name: 'Press-04', building: 'D동', status: 'RUNNING', itemName: 'Panel-X', possibleItems: ['Panel-X', 'Panel-Y'], count: 3400, target: 5000 },
    { id: 5, name: 'Press-05', building: 'D동', status: 'RUNNING', itemName: 'Panel-Y', possibleItems: ['Panel-Y', 'Panel-Z'], count: 2100, target: 3000 },
    { id: 6, name: 'Mori-01', building: 'MORI동', status: 'IDLE', itemName: '', possibleItems: ['Part-A', 'Part-B'], count: 100, target: 1000 },
    { id: 7, name: 'Wiz-01', building: 'WIZ동', status: 'DONE', itemName: 'Gear-Z', possibleItems: ['Gear-Z'], count: 800, target: 800 }
];

export const supabaseDatabase = {
    async getMachines() {
        const { data, error } = await supabase.from('machines').select('*');
        if (error) throw error;
        if (data.length === 0) {
            // Seed default machines when table is empty
            const { data: seeded, error: seedErr } = await supabase.from('machines').upsert(DEFAULT_MACHINES, { onConflict: 'id' });
            if (seedErr) throw seedErr;
            return seeded;
        }
        return data;
    },
    async createMachine(machine) {
        const { data, error } = await supabase.from('machines').insert(machine).single();
        if (error) throw error;
        return data;
    },
    async updateMachine(updatedMachine) {
        const { data, error } = await supabase
            .from('machines')
            .update(updatedMachine)
            .eq('id', updatedMachine.id)
            .single();
        if (error) throw error;
        return data;
    },
    async deleteMachine(id) {
        const { data, error } = await supabase.from('machines').delete().eq('id', id).single();
        if (error) throw error;
        return data;
    },
    async saveAllMachines(machines) {
        // Upsert all machines (insert new, update existing)
        const { data, error } = await supabase.from('machines').upsert(machines, { onConflict: 'id' });
        if (error) throw error;
        return data;
    },
};
