import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { appointment_id, status } = body

        if (!appointment_id) {
            return NextResponse.json({ error: '예약 ID가 필요합니다.' }, { status: 400 })
        }

        // Update appointment status
        const { data, error } = await supabase
            .from('appointments')
            .update({ status: status || 'confirmed' })
            .eq('id', appointment_id)
            .eq('user_id', user.id)
            .select()
            .single()

        if (error) {
            console.error('Appointment update error:', error)
            return NextResponse.json({ error: '예약 상태 업데이트에 실패했습니다.' }, { status: 500 })
        }

        return NextResponse.json({ success: true, appointment: data })
    } catch (error) {
        console.error('Appointment confirm API error:', error)
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
    }
}
