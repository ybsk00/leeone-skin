import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next')

    if (code) {
        const supabase = await createClient()
        const { error, data } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && data.user) {
            // Check user role for redirect
            const { data: staffUser } = await supabase
                .from('staff_users')
                .select('role')
                .eq('user_id', data.user.id)
                .single()

            // If explicit next is provided, use it
            if (next) {
                return NextResponse.redirect(`${origin}${next}`)
            }

            // Admin/doctor/staff goes to admin dashboard
            if (staffUser?.role === 'admin' || staffUser?.role === 'doctor' || staffUser?.role === 'staff') {
                return NextResponse.redirect(`${origin}/admin`)
            }

            // Regular patients go to patient portal
            return NextResponse.redirect(`${origin}/patient`)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}

