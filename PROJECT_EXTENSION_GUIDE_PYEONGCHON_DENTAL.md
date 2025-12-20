# 헬스케어 프로젝트 확장 가이드 (평촌이생각치과 버전)

> 기존 한방병원 템플릿을 **치과(평촌이생각치과)**로 확장/전환할 때, 반드시 수정해야 하는 파일과 포인트를 정리한 문서입니다.

---

## 📌 이번 버전 적용 범위 (평촌이생각치과)

- 병원명: **평촌이생각치과**
- 의료진(4인):
  - **김기영 대표원장** (통합치의학과 전문의 / 임플란트·치주·보철·턱관절)
  - **전민제 원장** (통합치의학과 전문의 / 임플란트·치주·근관·일반)
  - **이혜정 교정원장** (치과교정과 전문의 / 투명교정 / SCIE 논문 1저자)
  - **김유진 원장** (보존과 전문의 / 충치·수복·근관·심미수복)
- 메디컬(회원/문진) 트랙(8개):
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
|---------|--------|---------|
| AI 프롬프트 | 3개 | 치과 트랙/문진 로직, 의료진 데이터, SCI 논문 |
| 환자 포털 UI | 5개 | 브랜딩(병원명/로고), 퀵액션/탭(후기·위치), 서비스명 |
| 의료진 대시보드 | 5개 | 의료진 목록, 진료 영역(트랙) 매핑, 의료진 소개 모달 |
| 헬스케어 챗봇 | 3개 | “재미형” 구강 헬스케어 모듈, entryIntent/토픽 |
| 공통 컴포넌트 | 3개 | 로고, 메타 태그, 공통 문구 |
| 설정 파일 | 3개 | 환경변수, 메타데이터, 도메인/OG |

---

## 🤖 1. AI 프롬프트 (가장 중요)

### `src/lib/ai/prompts.ts` ⭐⭐⭐

**핵심: 의료진 데이터 + 4턴 강제 요약 + 액션 토큰(응답당 1개) + 질문 2개 제한**

---

### 1.1 의료진 데이터 (평촌이생각치과)

```ts
export const DOCTORS = [
  {
    name: "전민제",
    title: "원장",
    education: "통합치의학과 전문의 ...",
    specialty: ["임플란트", "치주/잇몸", "신경치료(근관)", "일반진료"],
    tracks: ["implant", "gum", "endo", "general"],
  },
  {
    name: "이혜정",
    title: "교정원장",
    education: "치과교정과 전문의 ... SCIE 논문 제1저자",
    specialty: ["치아교정", "투명교정", "재교정/유지관리"],
    tracks: ["ortho"],
  },
  {
    name: "김유진",
    title: "원장",
    education: "보존과 전문의 ...",
    specialty: ["충치/수복", "크라운/보철(일반)", "신경치료(근관)", "심미 수복"],
    tracks: ["restorative", "endo", "aesthetic", "general"],
  },
  {
    name: "김기영",
    title: "대표원장",
    education: "통합치의학과 전문의 ...",
    specialty: ["임플란트", "치주/잇몸", "보철/교합", "일반진료"],
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

---

### 1.2 SCI/근거 데이터 (Evidence Modal용)

> 치과 “교정”의 전문성을 신뢰 요소로 노출하되, **치료 효과를 보장하거나 과장하는 문구는 금지**합니다.  
> EvidenceModal은 “학술 근거/활동”을 보여주는 용도로만 사용합니다.

```ts
export const SCI_EVIDENCE = {
  journal: "SCIE",
  title:
    "A CBCT Evaluation of Nasal Septal Deviation and Related Nasofacial Structures after Maxillary Skeletal Expansion",
  authors: "이혜정(제1저자) 외",
  link: "",
};
```

---

### 1.3 메디컬 프롬프트 핵심 규칙 (치과 컴플라이언스)

```ts
getMedicalSystemPrompt(turnCount, track?, askedQuestionCount?)

// 핵심 규칙
// - 질문 제한: 최대 2개(askedQuestionCount)
// - 4턴 강제 요약: 공감 → 요약 → 가능성 범주(확정 금지) → 면책 → CTA(1개)
// - 액션 토큰: 응답당 1개 제한
// - 진단/처방/시술 적합성 결론 금지
```

**치과 전용 금지 항목(반드시 포함)**
- “임플란트가 맞습니다 / 라미네이트 하셔야 합니다 / 교정이 필요합니다” 같은 결론형 문장 금지  
- 비용/효과 보장/전후 비교 유도/완치·확실·100% 금지  
- 원인 단정 금지 → “가능성/경향/고려” 수준으로만 표현  
- 응급/고위험(얼굴 붓기+발열/호흡·삼킴 곤란/멈추지 않는 출혈/외상 후 흔들림 등) 시 **즉시 응급 안내 후 종료**

---

## 🧠 2. 메디컬 챗 API

### `src/app/api/chat/route.ts` ⭐⭐

**토큰 파싱 + 구조화 응답 유지 (그대로 사용 가능)**  
단, `doctorsData`, `evidenceData`가 **평촌이생각치과** 값으로 내려오도록 `prompts.ts` 교체가 선행되어야 합니다.

```ts
// API 요청
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
  action: "RESERVATION_MODAL" | "DOCTOR_INTRO_MODAL" | "EVIDENCE_MODAL" | null,
  highlightTabs: ("review" | "map")[],
  track: string,
  askedQuestionCount: number,
  doctorsData?: Doctor[],
  evidenceData?: SciEvidence
}
```

---

## 🩺 3. 모달 컴포넌트

### `src/components/medical/DoctorIntroModal.tsx` ⭐⭐

**수정 포인트**
- `doctorImages` 객체: **의사별 사진 경로** 매핑
- CTA 버튼 라벨(예: “예약하기”, “후기보기”, “위치보기”)  
- 트랙별 추천 의료진 우선 노출(김기영/전민제/이혜정/김유진)

```ts
interface DoctorIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctors: Doctor[];
  onReservation?: () => void;
  onReviewTabClick?: () => void;
  onMapTabClick?: () => void;
}
```

### `src/components/medical/EvidenceModal.tsx` ⭐

**수정 포인트**
- `SCI_EVIDENCE`를 평촌이생각치과 논문 데이터로 노출
- “치료 보장” 뉘앙스 금지 (학술 활동 소개 톤 유지)

---

## 👤 4. 환자 대시보드 (Patient Dashboard)

### `src/app/medical/patient-dashboard/PatientDashboardClient.tsx` ⭐⭐

**수정 포인트**
- 상단 브랜딩: **평촌이생각치과** 병원명/로고
- 퀵액션 버튼(예시)
  - 예약 / 상담요약 / 착색CSI / 시림탐정 / 후기 / 위치
- 탭 하이라이트: 후기/위치 3초 강조 유지

```ts
const [showDoctorIntroModal, setShowDoctorIntroModal] = useState(false);
const [showEvidenceModal, setShowEvidenceModal] = useState(false);
const [highlightedTabs, setHighlightedTabs] = useState<("review" | "map")[]>([]);
```

---

## 💬 5. 채팅 UI

### `src/components/chat/ChatInterface.tsx` ⭐⭐

**수정 포인트**
- 로그인 모달 문구(치과 컴플라이언스 톤):
  - “진단/처방이 아닌 참고용 안내이며, 정확한 판단은 의료진 대면 진료가 필요합니다.”
- 트랙 유지/askedQuestionCount 관리
- 후기/위치 요청 시: **모달 띄우지 말고 상단 탭 유도**

---

## 🦷 6. 랜딩 페이지/헬스케어 모듈 (재미형 5개 추천)

### `src/app/page.tsx` ⭐

치과는 “질환 단정”이 아니라 **흥미 기반 자기점검 → 기록/저장 → 상담 전환**이 유리합니다.  
추천 모듈(헬스케어, 로그인 전):

1) 착색 CSI (커피·담배 습관 점검)  
2) 시림 탐정 (트리거 패턴 체크)  
3) 잇몸 레이더 (출혈/구취 루틴 스캔)  
4) 스마일 밸런스 게임 (이갈이/입호흡/한쪽 씹기 습관)  
5) 임플란트 준비도 체크 (상실 이후 루틴·준비 체크리스트)

> 주의: 헬스케어 모드는 “치료 추천/적합성 결론”을 내리지 않고 생활 루틴 가이드만 제공합니다.

---

## ✅ 체크리스트 (평촌이생각치과)

### 필수 변경 (1순위)
- [ ] `src/lib/ai/prompts.ts` - DOCTORS(4인) 교체
- [ ] `src/lib/ai/prompts.ts` - DOCTOR_TRACK_MAPPING(8트랙) 교체
- [ ] `src/lib/ai/prompts.ts` - SCI_EVIDENCE(이혜정 교정원장 SCIE 논문) 교체
- [ ] `src/lib/ai/prompts.ts` - TRACK_KEYWORDS / 질문 풀(치과용) 반영
- [ ] `public/logo.png` - 평촌이생각치과 로고 교체
- [ ] 메타데이터(title/description/OG) - 병원명/키 메시지 교체

### 중요 변경 (2순위)
- [ ] `DoctorIntroModal.tsx` - doctorImages(4인) 경로 매핑
- [ ] `PatientDashboardClient.tsx` - 퀵액션/탭(후기·위치) 문구
- [ ] `ChatInterface.tsx` - 로그인 모달/후기·위치 탭 유도 문구
- [ ] `page.tsx` - 랜딩 핵심 카피/헬스케어 모듈 5개 반영

### 선택 변경 (3순위)
- [ ] 색상 테마 (tailwind.config.js)
- [ ] 항목 수/페이지네이션 (ITEMS_PER_PAGE)
- [ ] FAQ/가이드 콘텐츠(임플란트/라미네이트/교정) 템플릿

---

## 📂 파일 경로 빠른 참조

```
src/
├── lib/ai/
│   ├── prompts.ts          ⭐⭐⭐ 치과 메디컬 프롬프트 + 의료진 데이터
│   └── client.ts           (수정 불필요)
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts    ⭐⭐ 메디컬 챗 API (토큰 파싱)
│   │   └── healthcare/chat/
│   │       └── route.ts    헬스케어 API
│   ├── medical/
│   │   └── patient-dashboard/
│   │       └── PatientDashboardClient.tsx  ⭐⭐ 환자 대시보드
│   └── page.tsx            ⭐ 랜딩 페이지
├── components/
│   ├── chat/
│   │   └── ChatInterface.tsx  ⭐⭐ 채팅 UI
│   └── medical/
│       ├── DoctorIntroModal.tsx  ⭐⭐ 의료진 모달
│       ├── EvidenceModal.tsx     ⭐ 논문 모달
│       └── ReservationModal.tsx  예약 모달
└── public/
    └── logo.png            ⭐ 로고
```

---

## 📝 업데이트 이력

### 2025-12-20 (평촌이생각치과 적용)
- 의료진 데이터 4인(김기영/전민제/이혜정/김유진) 반영
- 치과 8트랙(implant/ortho/aesthetic/gum/endo/restorative/tmj/general) 구조로 전환
- 4턴 강제 요약(질문 2개 제한) + 액션 토큰(응답당 1개) 규칙 유지
- 후기/위치: 모달 미사용, 상단 탭 유도 방식 유지
- 헬스케어 모듈: 재미형 5개 추천(착색CSI/시림탐정/잇몸레이더/스마일밸런스/임플란트 준비도)

---

*이 문서는 프로젝트 복제 후 “평촌이생각치과”로 전환할 때의 기준 문서입니다.*
