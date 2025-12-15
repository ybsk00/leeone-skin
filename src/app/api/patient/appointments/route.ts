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
        const { scheduled_at, notes } = body

        if (!scheduled_at) {
            return NextResponse.json({ error: '예약 날짜/시간이 필요합니다.' }, { status: 400 })
        }

        // Create appointment with correct schema columns
        const { data, error } = await supabase
            .from('appointments')
            .insert({
                user_id: user.id,
                scheduled_at,
                notes: notes || 'AI한의원 진료',
                status: 'scheduled',
            })
            .select()
            .single()

        if (error) {
            console.error('Appointment creation error:', error)
            return NextResponse.json({ error: '예약 생성에 실패했습니다.' }, { status: 500 })
        }

        return NextResponse.json({ success: true, appointment: data })
    } catch (error) {
        console.error('Appointment API error:', error)
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
    }
}

