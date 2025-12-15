-- ================================================
-- Unified Integration Migration
-- Extends patient_profiles with CRM fields (Option B)
-- Adds CRM-specific tables for integrated system
-- ================================================

-- 1. Extend patient_profiles with CRM fields
ALTER TABLE public.patient_profiles 
  ADD COLUMN IF NOT EXISTS phone_normalized TEXT,
  ADD COLUMN IF NOT EXISTS lifecycle_stage TEXT DEFAULT 'lead',
  ADD COLUMN IF NOT EXISTS source TEXT,
  ADD COLUMN IF NOT EXISTS first_contact_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_visit_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS total_visits INT DEFAULT 0;

-- Add unique constraint on phone_normalized if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'patient_profiles_phone_normalized_key'
  ) THEN
    ALTER TABLE public.patient_profiles 
      ADD CONSTRAINT patient_profiles_phone_normalized_key UNIQUE (phone_normalized);
  END IF;
END $$;

-- 2. Appointment Slots (from CRM)
CREATE TABLE IF NOT EXISTS public.appointment_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  capacity INT NOT NULL DEFAULT 1,
  booked INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Appointments (from CRM) - references patient_profiles via user_id
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slot_id UUID REFERENCES public.appointment_slots(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  scheduled_at TIMESTAMPTZ NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Intake Sessions (from CRM)
CREATE TABLE IF NOT EXISTS public.intake_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active',
  turn_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Intake Messages (from CRM)
CREATE TABLE IF NOT EXISTS public.intake_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.intake_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Intake Evidence (from CRM)
CREATE TABLE IF NOT EXISTS public.intake_evidence (
  session_id UUID PRIMARY KEY REFERENCES public.intake_sessions(id) ON DELETE CASCADE,
  evidence_json JSONB,
  red_flags JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Message Jobs (from CRM)
CREATE TABLE IF NOT EXISTS public.message_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  channel TEXT NOT NULL, -- 'alimtalk', 'sms', 'push'
  template_code TEXT NOT NULL,
  payload JSONB,
  scheduled_for TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'queued', -- 'queued', 'processing', 'sent', 'failed'
  sent_at TIMESTAMPTZ,
  retry_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Consents (from CRM)
CREATE TABLE IF NOT EXISTS public.consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'privacy', 'marketing', 'third_party'
  agreed BOOLEAN NOT NULL DEFAULT FALSE,
  agreed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Push Tokens (from CRM)
CREATE TABLE IF NOT EXISTS public.push_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('android', 'ios', 'web')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, token)
);

-- ================================================
-- RLS Policies
-- ================================================

ALTER TABLE public.appointment_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intake_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intake_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intake_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_tokens ENABLE ROW LEVEL SECURITY;

-- Appointment slots: public read, staff write
CREATE POLICY "Anyone can view appointment slots" ON public.appointment_slots 
  FOR SELECT USING (true);
CREATE POLICY "Staff can manage appointment slots" ON public.appointment_slots 
  FOR ALL USING (public.is_staff());

-- Appointments: users see their own
DROP POLICY IF EXISTS "Users can view own appointments" ON public.appointments;
CREATE POLICY "Users can view own appointments" ON public.appointments 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own appointments" ON public.appointments 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Staff can manage all appointments" ON public.appointments 
  FOR ALL USING (public.is_staff());

-- Intake sessions: users see their own
CREATE POLICY "Users can view own intake sessions" ON public.intake_sessions 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own intake sessions" ON public.intake_sessions 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Staff can view all intake sessions" ON public.intake_sessions 
  FOR SELECT USING (public.is_staff());

-- Intake messages: via session ownership
CREATE POLICY "Users can view own intake messages" ON public.intake_messages 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.intake_sessions 
      WHERE intake_sessions.id = intake_messages.session_id 
      AND intake_sessions.user_id = auth.uid()
    )
  );
CREATE POLICY "Staff can view all intake messages" ON public.intake_messages 
  FOR SELECT USING (public.is_staff());

-- Consents: users manage their own
CREATE POLICY "Users can view own consents" ON public.consents 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own consents" ON public.consents 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Push tokens: users manage their own
CREATE POLICY "Users can manage own push tokens" ON public.push_tokens 
  FOR ALL USING (auth.uid() = user_id);

-- Message jobs: staff only
CREATE POLICY "Staff can manage message jobs" ON public.message_jobs 
  FOR ALL USING (public.is_staff());
