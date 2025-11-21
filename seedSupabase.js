// seedSupabase.js - 초기 데이터 삽입 스크립트
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// .env 파일 로드
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DEFAULT_MACHINES = [
    { id: 1, name: 'Press-01', building: 'B동', status: 'RUNNING', itemName: 'Bracket-A', possibleItems: ['Bracket-A', 'Bracket-B'], count: 1250, target: 2000 },
    { id: 2, name: 'Press-02', building: 'B동', status: 'IDLE', itemName: '', possibleItems: [], count: 0, target: 0 },
    { id: 3, name: 'Press-03', building: 'B동', status: 'DONE', itemName: 'Cover-B', possibleItems: ['Cover-B', 'Cover-C'], count: 500, target: 500 },
    { id: 4, name: 'Press-04', building: 'D동', status: 'RUNNING', itemName: 'Panel-X', possibleItems: ['Panel-X', 'Panel-Y'], count: 3400, target: 5000 },
    { id: 5, name: 'Press-05', building: 'D동', status: 'RUNNING', itemName: 'Panel-Y', possibleItems: ['Panel-Y', 'Panel-Z'], count: 2100, target: 3000 },
    { id: 6, name: 'Mori-01', building: 'MORI동', status: 'IDLE', itemName: '', possibleItems: ['Part-A', 'Part-B'], count: 100, target: 1000 },
    { id: 7, name: 'Wiz-01', building: 'WIZ동', status: 'DONE', itemName: 'Gear-Z', possibleItems: ['Gear-Z'], count: 800, target: 800 }
];

async function seed() {
    try {
        console.log('🌱 Supabase 초기 데이터 삽입 시작...');

        const { data, error } = await supabase
            .from('machines')
            .upsert(DEFAULT_MACHINES, { onConflict: 'id' });

        if (error) throw error;

        console.log('✅ 초기 데이터 삽입 완료!');
        console.log(`삽입된 레코드 수: ${DEFAULT_MACHINES.length}`);
    } catch (e) {
        console.error('❌ 초기 데이터 삽입 실패:', e.message);
        process.exit(1);
    }
}

seed();
