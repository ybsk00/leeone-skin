# 헬스케어 프로젝트 확장 가이드 (평촌이생각치과 버전)

> 본 문서는 기존 템플릿(한방병원 기반)을 **평촌이생각치과**로 확장/전환할 때, 반드시 수정해야 하는 파일과 포인트를 정리한 최신 가이드입니다.  
> 환자포털(`/patient`) 항목이 포함된 버전으로 재정리되었습니다.

---

## ✅ 이번 버전 적용 범위 (평촌이생각치과)

- 병원명: **평촌이생각치과**
- 의료진(4인)
  - **김기영 대표원장**: 통합치의학과 전문의 / 임플란트·치주·보철·턱관절
  - **전민제 원장**: 통합치의학과 전문의 / 임플란트·치주·근관·일반
  - **이혜정 교정원장**: 치과교정과 전문의 / 투명교정 / SCIE 논문 1저자
  - **김유진 원장**: 보존과 전문의 / 충치·수복·근관·심미수복
- 메디컬(회원/문진) 트랙(8개)
  - `implant` 임플란트/상실치아
  - `ortho` 치아교정/투명교정
  - `aesthetic` 심미(라미네이트/미백/심미수복)
  - `gum` 잇몸/치주/출혈·구취
  - `endo` 신경치료(근관)/치통
  - `restorative` 충치/수복(레진·인레이·크라운)
  - `tmj` 턱관절/이갈이·이악물기
  - `general` 일반진료/검진·스케일링

---

## 📁 수정 필요 파일 요약

| 카테고리 | 파일 수 | 주요 내용 |
|---------|--------:|---------|
| AI 프롬프트 | 3개 | 치과 트랙 기반 문진/설명 로직, 의료진 데이터, SCI 논문 |
| 환자 포털 (/patient) | 8개 | 홈, 예약, AI 상담, 복약 관리, 프로필 |
| 환자 포털 UI | 5개 | 브랜딩(병원명/로고), 서비스명, 의사 목록 |
| 의료진 대시보드 | 5개 | 의사 목록, 진료 트랙, 모달 |
| 헬스케어 챗봇 | 3개 | 문진 프롬프트(로그인 전), entryIntent/topic |
| 공통 컴포넌트 | 3개 | 로고, 병원명, 공통 문구 |
| 설정 파일 | 3개 | 환경변수, 메타데이터, OG/도메인 |

---

## 🤖 1. AI 프롬프트 (가장 중요!)

### `src/lib/ai/prompts.ts` ⭐⭐⭐

**핵심: 의료진 데이터 + 4턴 강제 요약 + 액션 토큰(응답당 1개) + 질문 2개 제한**

#### 1.1 의료진 데이터 (평촌이생각치과)

```typescript
// 병원별로 수정 (평촌이생각치과)
export const DOCTORS = [
  {
    name: "전민제",
    title: "원장",
    education: "통합치의학과 전문의, 원광대학교 치과대학 치의학학사, Periodontal surgery & Implantation course 수료, Doctor's endo seminar 수료",
    specialty: ["임플란트", "치주/잇몸", "신경치료(근관)", "일반진료"],
    tracks: ["implant", "gum", "endo", "general"],
  },
  {
    name: "이혜정",
    title: "교정원장",
    education: "보건복지부 인증 치과교정과 전문의, 대한치과교정학회(KAO) 정회원, Invisalign 투명교정 교육이수, SCIE 논문 제1저자",
    specialty: ["치아교정", "투명교정", "재교정/유지관리"],
    tracks: ["ortho"],
  },
  {
    name: "김유진",
    title: "원장",
    education: "보건복지부 인증 보존과 전문의, 치과보존(충치/레진/인레이/크라운) 중심 진료",
    specialty: ["충치/수복", "크라운/보철(일반)", "신경치료(근관)", "심미 수복"],
    tracks: ["restorative", "endo", "aesthetic", "general"],
  },
  {
    name: "김기영",
    title: "대표원장",
    education: "보건복지부 인증 통합치의학과 전문의, 임플란트/치주 관련 코스 수료",
    specialty: ["임플란트", "치주/잇몸", "보철/교합", "턱관절", "일반진료"],
    tracks: ["implant", "gum", "tmj", "general"],
  },
];

// 트랙별 의료진 매핑
export const DOCTOR_TRACK_MAPPING: Record<string, string[]> = {
  implant: ["김기영", "전민제"],
  ortho: ["이혜정"],
  aesthetic: ["김유진"],
  gum: ["김기영", "전민제"],
  endo: ["김유진", "전민제"],
  restorative: ["김유진"],
  tmj: ["김기영"],
  general: ["김기영", "전민제", "김유진"],
};
```

#### 1.2 SCI 논문 데이터 (Evidence Modal용)

> 근거 노출은 “학술 활동/전문성 소개” 용도로만 사용하며, 치료 효과를 보장하거나 과장하는 문구는 금지합니다.

```typescript
export const SCI_EVIDENCE = {
  journal: "SCIE",
  title:
    "A CBCT Evaluation of Nasal Septal Deviation and Related Nasofacial Structures after Maxillary Skeletal Expansion",
  authors: "이혜정(제1저자) 외",
  link: "",
};
```

#### 1.3 메디컬 프롬프트 (4턴 강제 요약)

```typescript
getMedicalSystemPrompt(turnCount, track?, askedQuestionCount?)

// 핵심 규칙:
// - 질문 제한: 최대 2개
// - 4턴 강제 요약: 공감 → 요약 → 가능성 범주(확정 금지) → 면책 → CTA(1개)
// - 액션 토큰: 응답당 1개 제한
// - 치과 컴플라이언스: 진단/처방/시술 적합성 결론 금지
```

#### 1.4 액션 토큰 시스템

```typescript
// AI 응답에 포함되는 토큰
[[ACTION:RESERVATION_MODAL]]   // 예약 모달
[[ACTION:DOCTOR_INTRO_MODAL]]  // 의료진 소개 모달
[[ACTION:EVIDENCE_MODAL]]      // SCI 논문 모달

// 후기/위치는 토큰 대신 상단 탭 유도 문장
"결정에 도움이 되도록 상단의 '후기보기'를 확인해보시겠습니까?"
"방문 동선은 상단의 '위치보기'에서 확인하실 수 있습니다."
```

---

## 🔌 2. 메디컬 챗 API

### `src/app/api/chat/route.ts` ⭐⭐

토큰 파싱 + 구조화된 응답 유지(그대로 사용 가능).  
단, `doctorsData`, `evidenceData`는 반드시 **평촌이생각치과 값**이 내려오도록 `prompts.ts` 교체가 선행되어야 합니다.

```typescript
// API 요청 파라미터
{
  message: string,
  history: Message[],
  turnCount: number,
  track?: string,
  askedQuestionCount?: number
}

// API 응답
{
  role: "ai",
  content: string,
  action: ActionType | null,
  highlightTabs: ('review' | 'map')[],
  track: string,
  askedQuestionCount: number,
  doctorsData?: Doctor[],
  evidenceData?: SciEvidence
}
```

---

## 🩺 3. 모달 컴포넌트

### `src/components/medical/DoctorIntroModal.tsx` ⭐⭐

```typescript
interface DoctorIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctors: Doctor[];           // DOCTORS 배열 전달
  onReservation?: () => void;
  onReviewTabClick?: () => void;
  onMapTabClick?: () => void;
}
```

**수정 포인트**
- `doctorImages` 객체: **전민제/이혜정/김유진/김기영** 사진 경로 매핑
- 트랙별 추천 의료진 우선 노출(implant/gum/tmj: 김기영 우선, ortho: 이혜정, restorative/aesthetic: 김유진)
- CTA 버튼 라벨/색상(“예약하기”, “후기보기”, “위치보기”)

### `src/components/medical/EvidenceModal.tsx` ⭐

```typescript
interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  evidence: SciEvidence;  // SCI_EVIDENCE 전달
}
```

---

## 👤 4. 환자 대시보드 (Patient Dashboard)

### `src/app/medical/patient-dashboard/PatientDashboardClient.tsx` ⭐⭐

모달 통합 + 탭 하이라이트를 그대로 사용합니다.

```typescript
const [showDoctorIntroModal, setShowDoctorIntroModal] = useState(false);
const [showEvidenceModal, setShowEvidenceModal] = useState(false);
const [highlightedTabs, setHighlightedTabs] = useState<('review' | 'map')[]>([]);

<ChatInterface
  onAction={(action, data) => {
    if (action === 'DOCTOR_INTRO_MODAL') setShowDoctorIntroModal(true);
    if (action === 'EVIDENCE_MODAL') setShowEvidenceModal(true);
  }}
  onTabHighlight={(tabs) => {
    setHighlightedTabs(tabs);
    setTimeout(() => setHighlightedTabs([]), 3000);
  }}
/>
```

**수정 포인트**
- 상단 브랜딩: **평촌이생각치과** 병원명/로고
- 퀵액션 버튼(권장 6개): 예약, 증상정리, 복약, 업로드, 후기, 위치
- 후기/위치 탭 하이라이트(3초)

---

## 💬 5. 채팅 인터페이스

### `src/components/chat/ChatInterface.tsx` ⭐⭐

- `askedQuestionCount`(질문 카운터), `currentTrack` 유지
- 로그인 모달 문구(의료법 준수): “진단/처방이 아닌 참고용 안내이며, 정확한 판단은 의료진 대면 진료가 필요합니다.”
- 후기/위치 요청 시 **모달 띄우지 말고 상단 탭 유도**

---

## 🏥 6. 랜딩 페이지

### `src/app/page.tsx` ⭐

- 핵심진료(임플란트/라미네이트/교정) 카드 구성 유지
- “흥미형” 헬스케어 모듈 5개(로그인 전)로 유입을 넓히고, 치료 판단은 로그인 후로 전환

---

## 👥 7. 환자 포털 (`/patient`)

환자가 직접 사용하는 모바일 최적화 포털입니다. 네이버/Supabase 로그인 후 진입 가능합니다.

### 파일 구조

```
src/app/patient/
├── layout.tsx           하단 네비게이션 레이아웃
├── page.tsx             ⭐⭐ 메인 홈 (로그인 필요)
├── home/
│   └── page.tsx         인트로 페이지 (비로그인)
├── login/              소셜 로그인 페이지
├── signup/             회원가입 페이지
├── appointments/
│   ├── page.tsx        ⭐⭐ 예약 목록
│   ├── AppointmentsClient.tsx  예약 목록 클라이언트
│   ├── new/            신규 예약
│   └── [id]/           예약 상세/수정
├── chat/
│   └── page.tsx        ⭐⭐ AI 1:1 상담
├── medications/
│   └── page.tsx        ⭐ 복약 관리
├── history/
│   └── page.tsx        예약 기록
├── profile/
│   ├── page.tsx        마이페이지
│   └── edit/           프로필 수정
└── logout/             로그아웃 처리
```

---

### `src/app/patient/layout.tsx`

**하단 네비게이션 (Bottom Navigation)**

- 홈 (`/patient`)
- 예약 (`/patient/appointments`)
- 상담 (`/patient/chat`) + 알림 뱃지
- 마이 (`/patient/profile`)

**수정 포인트**
- 탭 아이콘/라벨 (브랜드 톤 유지)
- 배경색(예: `#0a0f1a`)
- 알림 뱃지 표시 조건

---

### `src/app/patient/page.tsx` ⭐⭐

**메인 홈 화면 (로그인 필수)**

```typescript
const isAuthenticated = !!user || !!nextAuthSession?.user

if (!isAuthenticated) {
  redirect('/patient/home')
}

// 다가오는 예약 조회
const upcomingAppointment = await supabase
  .from('appointments')
  .select('*')
  .eq('user_id', user.id)
  .in('status', ['scheduled', 'confirmed', 'pending'])
  .order('scheduled_at', { ascending: true })
  .limit(1)
```

**UI 구성(권장)**
- 헤더: 환자명 + **평촌이생각치과** + 알림 벨
- AI 상담 카드: “불편을 정리하면 예약이 쉬워집니다” 톤(과장 금지)
- 퀵메뉴(4개): 진료예약, 예약기록, 복약관리, 1:1상담
- 다가오는 예약 카드
- 알림 배너(검진/스케일링/복약 등)

**수정 포인트**
- 병원명: “위담한방병원” 등 기존 표기 → **평촌이생각치과**
- AI 상담 카드 문구: “진단/처방이 아닌 참고용 예진 정리” 톤 유지
- 퀵메뉴 항목/아이콘
- 알림 배너 내용(치과 루틴 중심)

---

### `src/app/patient/appointments/page.tsx` ⭐⭐

예약 관리 페이지

- 예약 목록 조회(상태별 필터)
- 예약 상세 보기
- 예약 취소/변경
- 새 예약 생성

**치과 전용 수정 포인트**
- 담당의 선택 목록(의료진 4인)
  - 임플란트/잇몸/턱관절: 김기영(대표원장), 전민제(원장)
  - 교정: 이혜정(교정원장)
  - 보존/수복/심미수복: 김유진(원장)
- 예약 가능 시간대 정책(병원 운영정책에 맞게)

---

### `src/app/patient/appointments/[id]/page.tsx`

예약 상세 페이지

- 예약 정보 표시
- 담당 의료진 정보
- 예약 변경/취소 버튼
- 상담 내역 연결

---

### `src/app/patient/chat/page.tsx` ⭐⭐

AI 1:1 상담 채팅

```typescript
<ChatInterface
  userType="patient"
  onAction={...}
  onTabHighlight={...}
/>
```

**치과 전용 수정 포인트**
- `prompts.ts`(치과)로 응답 톤/컴플라이언스 통제
- 모달 연동(예약/의료진/논문)
- 후기/위치: 상단 탭 유도

---

### `src/app/patient/medications/page.tsx` ⭐

복약 관리 페이지

- 현재 복용 중인 약물 목록
- 복용 스케줄
- 약물 상호작용 확인(정보 제공 수준)
- 리필 알림

> 치과에서 “복약”은 수술/시술 후 처방, 통증/염증 관련 복약 안내로 활용될 수 있으나, 시스템에서는 반드시 **“정보 제공”** 범위로 고정합니다.

---

### `src/app/patient/profile/page.tsx`

마이페이지

- 프로필 정보 표시
- 개인정보 수정
- 알림 설정
- 로그아웃

---

### 환자 포털 수정 체크리스트

| 우선순위 | 파일 | 수정 내용 |
|---------|------|----------|
| ⭐⭐⭐ | `patient/page.tsx` | 병원명/로고, AI 상담 카드 문구 |
| ⭐⭐ | `patient/layout.tsx` | 하단 네비 탭 라벨/아이콘 |
| ⭐⭐ | `patient/appointments/*` | 의료진 목록(4인) + 진료 트랙 매핑 |
| ⭐⭐ | `patient/chat/page.tsx` | 치과 프롬프트 연동 + 모달/탭 유도 |
| ⭐ | `patient/medications/page.tsx` | 복약 안내 톤(정보 제공) |
| ⭐ | `patient/profile/*` | 프로필 필드/문구 |

---

## ✅ 체크리스트

### 필수 변경 (1순위)
- [ ] `prompts.ts` - DOCTORS 배열(4인)
- [ ] `prompts.ts` - DOCTOR_TRACK_MAPPING(8트랙)
- [ ] `prompts.ts` - SCI_EVIDENCE(교정 논문)
- [ ] `prompts.ts` - TRACK_KEYWORDS / 질문 풀(치과)
- [ ] `public/logo.png` - 평촌이생각치과 로고
- [ ] 메타데이터(title/description/OG) - 병원명/키 메시지

### 중요 변경 (2순위)
- [ ] `DoctorIntroModal.tsx` - doctorImages(4인) 경로
- [ ] `PatientDashboardClient.tsx` - 퀵액션/탭(후기·위치)
- [ ] `ChatInterface.tsx` - 로그인 모달 문구(치과 컴플라이언스)
- [ ] `patient/*` - 병원명/의료진/문구 일괄 교체

### 선택 변경 (3순위)
- [ ] 색상 테마 (tailwind.config.js)
- [ ] 복약 DB/알림 (medications)
- [ ] 페이지당 항목 수 (ITEMS_PER_PAGE)

---

## 📂 파일 경로 빠른 참조

```
src/
├── lib/ai/
│   ├── prompts.ts          ⭐⭐⭐ 치과 메디컬 프롬프트 + 의료진 데이터
│   └── client.ts           (수정 불필요)
├── app/
│   ├── api/
│   │   ├── chat/route.ts   ⭐⭐ 메디컬 챗 API (토큰 파싱)
│   │   └── healthcare/chat/route.ts  헬스케어 API
│   ├── patient/            ⭐⭐ 환자 포털
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── appointments/
│   │   ├── chat/
│   │   ├── medications/
│   │   └── profile/
│   ├── medical/patient-dashboard/
│   │   └── PatientDashboardClient.tsx
│   └── page.tsx            ⭐ 랜딩 페이지
├── components/
│   ├── chat/ChatInterface.tsx
│   └── medical/
│       ├── DoctorIntroModal.tsx
│       ├── EvidenceModal.tsx
│       └── ReservationModal.tsx
└── public/
    └── logo.png
```

---

## 📝 업데이트 이력

### 2025-12-20 (평촌이생각치과 적용, 환자포털 포함)
- 의료진 데이터 4인(김기영/전민제/이혜정/김유진) 반영
- 치과 8트랙(implant/ortho/aesthetic/gum/endo/restorative/tmj/general) 전환
- 4턴 강제 요약(질문 2개 제한) + 액션 토큰(응답당 1개) 규칙 유지
- 후기/위치: 모달 미사용, 상단 탭 유도 방식 유지
- 환자포털(`/patient`) 파일 구조/수정 포인트 포함

---

*이 문서는 프로젝트 복제 후 “평촌이생각치과”로 전환할 때의 기준 문서입니다.*
