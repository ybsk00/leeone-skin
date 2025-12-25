-- =====================================================
-- 의사 테이블 생성 및 초기 데이터
-- 생성일: 2025-12-25
-- 설명: 의사 정보를 DB에서 중앙 관리
-- =====================================================

-- 1. doctors 테이블 생성
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,              -- 이름 (예: 김기영)
  title TEXT NOT NULL,             -- 직함 (예: 대표원장)
  display_name TEXT,               -- 표시명 (예: 김기영 대표원장)
  specialty TEXT[],                -- 전문분야 배열
  bio TEXT,                        -- 소개
  image_url TEXT,                  -- 프로필 이미지
  is_active BOOLEAN DEFAULT TRUE,  -- 활성 여부
  display_order INT DEFAULT 0,     -- 표시 순서
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_doctors_display_order ON public.doctors(display_order);
CREATE INDEX IF NOT EXISTS idx_doctors_is_active ON public.doctors(is_active);

-- 3. RLS 활성화
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- 4. RLS 정책
CREATE POLICY "Anyone can view doctors" ON public.doctors 
  FOR SELECT USING (TRUE);
CREATE POLICY "Staff can manage doctors" ON public.doctors 
  FOR ALL USING (public.is_staff());

-- 5. 초기 데이터 삽입 (리원피부과 의사 정보)
-- 필요에 따라 병원별로 수정하세요
INSERT INTO public.doctors (name, title, display_name, specialty, bio, image_url, is_active, display_order)
VALUES 
  ('문정윤', '대표원장', '문정윤 대표원장', 
   ARRAY['피부과 전문의', '레이저 시술', '안티에이징'], 
   '리원피부과 대표원장입니다.', 
   '/images/doctors/moon-jy.jpg', 
   TRUE, 1),
  ('김도영', '원장', '김도영 원장', 
   ARRAY['피부과 전문의', '여드름 치료', '피부 재생'], 
   '피부 재생 전문 원장입니다.', 
   '/images/doctors/kim-dy.jpg', 
   TRUE, 2),
  ('이미혜', '원장', '이미혜 원장', 
   ARRAY['피부과 전문의', '미용 시술', '보톡스'], 
   '미용 시술 전문 원장입니다.', 
   '/images/doctors/lee-mh.jpg', 
   TRUE, 3)
ON CONFLICT DO NOTHING;

-- 6. 스키마 캐시 갱신
NOTIFY pgrst, 'reload schema';

-- 완료 메시지
DO $$
BEGIN
  RAISE NOTICE 'Migration completed: doctors table created with initial data';
END $$;
