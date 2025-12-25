-- =====================================================
-- 환자 테이블에 naver_user_id 컬럼 추가
-- 생성일: 2025-12-25
-- 설명: NextAuth 네이버 사용자를 patients 테이블에 연결
-- =====================================================

-- 1. patients 테이블에 naver_user_id 컬럼 추가
ALTER TABLE public.patients 
  ADD COLUMN IF NOT EXISTS naver_user_id TEXT;

-- 2. naver_user_id 인덱스 생성 (빠른 조회용)
CREATE INDEX IF NOT EXISTS idx_patients_naver_user_id 
  ON public.patients(naver_user_id);

-- 3. 기존 appointments에서 naver_user_id가 있는 레코드를 patients로 마이그레이션
-- (선택적: 필요한 경우에만 실행)
-- INSERT INTO public.patients (name, naver_user_id, type, status, created_at)
-- SELECT DISTINCT 
--   COALESCE(notes, '네이버 사용자') as name,
--   naver_user_id,
--   '신규 환자' as type,
--   'pending' as status,
--   MIN(created_at) as created_at
-- FROM public.appointments
-- WHERE naver_user_id IS NOT NULL
-- AND naver_user_id NOT IN (SELECT naver_user_id FROM public.patients WHERE naver_user_id IS NOT NULL)
-- GROUP BY naver_user_id, notes;

-- 4. 스키마 캐시 갱신
NOTIFY pgrst, 'reload schema';

-- 5. 컬럼 설명 추가
COMMENT ON COLUMN public.patients.naver_user_id IS 'NextAuth 네이버 사용자 ID (네이버는 email을 제공하지 않으므로 이 ID로 식별)';

-- 완료 메시지
DO $$
BEGIN
  RAISE NOTICE 'Migration completed: naver_user_id column added to patients table';
END $$;
