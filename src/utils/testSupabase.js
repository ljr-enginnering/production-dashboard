// src/utils/testSupabase.js
// 브라우저 콘솔에서 Supabase 데이터를 확인하는 유틸리티
import { supabaseDatabase } from '../services/supabaseService';

export async function showAllMachines() {
    try {
        const machines = await supabaseDatabase.getMachines();
        console.log('📊 현재 머신 데이터:');
        console.table(machines);
        return machines;
    } catch (e) {
        console.error('❌ 데이터 조회 실패:', e);
        return null;
    }
}

// 전역 스코프에 함수 노출 (콘솔에서 바로 사용 가능)
if (typeof window !== 'undefined') {
    window.showAllMachines = showAllMachines;
}
