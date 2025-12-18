# 헬스케어 프로젝트 확장 가이드

> 한방병원 → 치과/피부과/정형외과 등으로 확장 시 수정 필요 파일 목록

---

## 📁 수정 필요 파일 요약

| 카테고리 | 파일 수 | 주요 내용 |
|---------|--------|---------|
| AI 프롬프트 | 3개 | 전문분야별 상담 로직 |
| 환자 포털 UI | 5개 | 브랜딩, 서비스명, 의사 목록 |
| 의료진 대시보드 | 4개 | 의사 목록, 진료 과목 |
| 헬스케어 챗봇 | 2개 | 문진 프롬프트 |
| 공통 컴포넌트 | 3개 | 로고, 병원명 |
| 설정 파일 | 3개 | 환경변수, 메타데이터 |

---

## 🤖 1. AI 프롬프트 (가장 중요!)

### `src/lib/ai/prompts.ts`
- 예진 상담 시스템 프롬프트
- 전문 분야별 문진 질문
- 의료 용어 및 증상 키워드

### `src/lib/ai/summary.ts`
- 상담 내용 요약 로직
- 진료과별 요약 형식

### `src/app/api/patient/medications/chat/route.ts`
- 복약 도우미 시스템 프롬프트
- 약물 DB (치과/피부과용 약물 추가)

---

## 👤 2. 환자 포털 (Patient)

### `src/app/patient/page.tsx`
- 메인 대시보드 UI
- 병원명, 서비스 설명
- 로고 이미지 경로

### `src/app/patient/chat/page.tsx`
- AI 예진 상담 화면
- 초기 인사말
- 전문 분야별 안내 문구

### `src/app/patient/appointments/new/page.tsx`
- 예약 생성 화면
- **의사 목록 배열** (doctors)
- 진료 과목 표시

### `src/app/patient/medications/page.tsx`
- 복약 가이드 화면
- 약물 DB (medicationDatabase)
- 초기 인사말

### `src/app/patient/layout.tsx`
- 레이아웃/네비게이션
- 병원명

---

## 🏥 3. 의료진 대시보드 (Medical)

### `src/app/medical/dashboard/page.tsx`
- 관리자 메인 화면
- 통계 차트 제목

### `src/app/medical/patient-dashboard/page.tsx`
- 환자용 의료진 화면
- 기본 의사명

### `src/components/medical/ReservationModal.tsx`
- 예약 모달
- **의사 목록 배열** (doctors)
- 병원명/서비스명

### `src/components/medical/PatientRegistrationModal.tsx`
- 환자 등록 모달
- 필수 필드 (치과: 치아상태, 피부과: 피부타입 등)

---

## 🩺 4. 헬스케어 챗봇

### `src/app/healthcare/chat/route.ts` 또는 `src/app/api/healthcare/chat/route.ts`
- AI 헬스케어 문진 API
- 전문 분야별 질문 흐름

### `src/components/healthcare/ChatInterface.tsx`
- 챗봇 UI
- 초기 메시지
- 분야별 이모지/아이콘

---

## 🎨 5. 공통 컴포넌트

### `public/logo.png`
- 병원 로고 이미지

### `src/app/page.tsx`
- 랜딩 페이지
- 병원명, 소개 문구
- Hero 섹션 텍스트

### `src/app/layout.tsx`
- 메타데이터 (title, description)
- 파비콘

---

## ⚙️ 6. 설정 파일

### `.env.local`
```env
NEXT_PUBLIC_SITE_NAME=병원명
NEXT_PUBLIC_HOSPITAL_TYPE=dental  # haniwon, dental, derma, ortho
```

### `package.json`
- name, description 필드

### `src/app/layout.tsx` (메타데이터)
```tsx
export const metadata = {
  title: "병원명 - AI 헬스케어",
  description: "병원 소개 문구"
}
```

---

## ✅ 체크리스트

### 필수 변경
- [ ] `prompts.ts` - AI 문진 프롬프트
- [ ] `medications/chat/route.ts` - 복약 프롬프트
- [ ] 의사 목록 배열 (2곳: `new/page.tsx`, `ReservationModal.tsx`)
- [ ] `public/logo.png` - 로고 이미지
- [ ] 메타데이터 (title, description)

### 선택 변경
- [ ] 색상 테마 (tailwind.config.js)
- [ ] 약물 DB (medications/page.tsx)
- [ ] 환자 등록 필드 추가

---

## 💡 팁

1. **의사 목록**은 2곳에서 중복 정의됨 → 향후 DB/API로 통합 권장
2. **프롬프트**는 `.env`로 분리하면 관리 용이
3. **약물 DB**는 외부 API 연동 권장 (식약처 API 등)

---

## 📂 파일 경로 빠른 참조

```
src/
├── lib/ai/
│   ├── prompts.ts          ⭐ AI 문진 프롬프트
│   ├── summary.ts          요약 로직
│   └── client.ts           (수정 불필요)
├── app/
│   ├── patient/
│   │   ├── page.tsx        대시보드
│   │   ├── chat/           예진 상담
│   │   ├── medications/    복약 가이드 ⭐
│   │   └── appointments/   예약 (의사목록) ⭐
│   ├── medical/
│   │   ├── dashboard/      관리자 화면
│   │   └── patient-dashboard/
│   └── healthcare/
│       └── chat/           헬스케어 챗봇
├── components/
│   ├── medical/
│   │   └── ReservationModal.tsx ⭐ (의사목록)
│   └── healthcare/
└── public/
    └── logo.png            ⭐ 로고
```

---

*이 문서는 프로젝트 복제 후 새 의료 분야로 확장 시 참고용입니다.*
