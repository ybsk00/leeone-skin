import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SignupFlow from './SignupFlow'

export default async function SocialSignupPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/patient/login')
    }

    // Check if patient already exists
    const { data: patient } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', user.id)
        .single()

    if (patient) {
        redirect('/patient')
    }

    return <SignupFlow email={user.email || ''} name={user.user_metadata.full_name || ''} />
}
