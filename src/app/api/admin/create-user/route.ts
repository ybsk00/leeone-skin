import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
    try {
        const { email, password, role, displayName } = await request.json();

        if (!email || !password || !displayName) {
            return NextResponse.json(
                { error: '필수 필드가 누락되었습니다.' },
                { status: 400 }
            );
        }

        // Use service role key for admin operations
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                },
            }
        );

        // Create user with admin API
        const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { role, display_name: displayName },
        });

        if (createError) {
            return NextResponse.json(
                { error: createError.message },
                { status: 400 }
            );
        }

        // Add to staff_users table
        const { error: staffError } = await supabaseAdmin
            .from('staff_users')
            .insert({
                user_id: userData.user.id,
                role: role || 'staff',
                display_name: displayName,
            });

        if (staffError) {
            // If staff insert fails, try to delete the created user
            await supabaseAdmin.auth.admin.deleteUser(userData.user.id);
            return NextResponse.json(
                { error: staffError.message },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            user: {
                id: userData.user.id,
                email: userData.user.email,
                role,
                displayName,
            },
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
