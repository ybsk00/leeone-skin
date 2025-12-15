-- 1. 스키마 캐시 갱신
NOTIFY pgrst, 'reload schema';

-- 2. appointment_slots 테이블 컬럼 확인 및 추가
ALTER TABLE appointment_slots ADD COLUMN IF NOT EXISTS start_time TIMESTAMPTZ;
ALTER TABLE appointment_slots ADD COLUMN IF NOT EXISTS end_time TIMESTAMPTZ;
ALTER TABLE appointment_slots ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE appointment_slots ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;
ALTER TABLE appointment_slots ADD COLUMN IF NOT EXISTS current_bookings INTEGER DEFAULT 0;
ALTER TABLE appointment_slots ADD COLUMN IF NOT EXISTS max_bookings INTEGER DEFAULT 1;

-- 3. 권한 재설정
GRANT ALL ON appointment_slots TO authenticated;
GRANT ALL ON appointment_slots TO service_role;
