import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
    const supabase = await createClient()

    try {
        const { data: doctors, error } = await supabase
            .from('doctors')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true })

        if (error) {
            console.error('Error fetching doctors:', error)
            return NextResponse.json({ error: '의사 목록을 불러오는데 실패했습니다.' }, { status: 500 })
        }

        return NextResponse.json({ doctors })
    } catch (error) {
        console.error('Doctors API error:', error)
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
    }
}

// POST: 새 의사 추가 (관리자 전용)
export async function POST(request: NextRequest) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    // 스태프 여부 확인
    const { data: staffUser } = await supabase
        .from('staff_users')
        .select('role')
        .eq('user_id', user.id)
        .single()

    if (!staffUser || !['admin', 'staff'].includes(staffUser.role)) {
        return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
    }

    try {
        const body = await request.json()
        const { name, title, display_name, specialty, bio, image_url, display_order } = body

        if (!name || !title) {
            return NextResponse.json({ error: '이름과 직함은 필수입니다.' }, { status: 400 })
        }

        const { data: doctor, error } = await supabase
            .from('doctors')
            .insert({
                name,
                title,
                display_name: display_name || `${name} ${title}`,
                specialty: specialty || [],
                bio: bio || '',
                image_url: image_url || null,
                display_order: display_order || 0,
                is_active: true
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating doctor:', error)
            return NextResponse.json({ error: '의사 등록에 실패했습니다.' }, { status: 500 })
        }

        return NextResponse.json({ success: true, doctor })
    } catch (error) {
        console.error('Doctors POST API error:', error)
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
    }
}
