# 헬스케어 프로젝트 확장 가이드

> 한방병원 → 치과/피부과/정형외과 등으로 확장 시 수정 필요 파일 목록

---

## 📁 수정 필요 파일 요약

| 카테고리 | 파일 수 | 주요 내용 |
|---------|--------|---------|
| AI 프롬프트 | 3개 | 전문분야별 상담 로직, 의료진 데이터 |
| 환자 포털 UI | 5개 | 브랜딩, 서비스명, 의사 목록 |
| 의료진 대시보드 | 5개 | 의사 목록, 진료 과목, 모달 |
| 헬스케어 챗봇 | 3개 | 문진 프롬프트, entryIntent |
| 공통 컴포넌트 | 3개 | 로고, 병원명 |
| 설정 파일 | 3개 | 환경변수, 메타데이터 |

---

## 🤖 1. AI 프롬프트 (가장 중요!)

### `src/lib/ai/prompts.ts` ⭐⭐⭐

**2024-12-20 업데이트: 의료진 데이터 + 4턴 강제 요약 + 액션 토큰**

#### 1.1 의료진 데이터 (NEW!)
```typescript
// 이 부분을 병원별로 수정
export const DOCTORS = [
  {
    name: '최서형',
    title: '이사장',
    education: '경희대 한의학 대학원 박사',
    specialty: ['담적병', '간장병', '만성 위장질환', ...],
    tracks: ['digestive', 'digestive_stress', 'cardiovascular']
  },
  // ... 의료진 추가
];

// 트랙별 의료진 매핑
export const DOCTOR_TRACK_MAPPING: Record<string, string[]> = {
  diet: ['나병조', '최서형'],
  pain: ['노기환'],
  digestive_stress: ['최서형', '노기환', '최규호'],
  // ... 트랙 매핑
};

// SCI 논문 데이터
export const SCI_EVIDENCE = {
  journal: 'Healthcare (MDPI)',
  title: '논문 제목...',
  authors: '저자명',
  link: 'https://...'
};
```

#### 1.2 메디컬 프롬프트 (4턴 강제 요약)
```typescript
getMedicalSystemPrompt(turnCount, track?, askedQuestionCount?)

// 핵심 규칙:
// - 질문 제한: 최대 2개
// - 4턴 강제 요약: 공감 → 요약 → 가능성 범주 → 면책 → CTA
// - 액션 토큰: 응답당 1개 제한
```

#### 1.3 액션 토큰 시스템 (NEW!)
```typescript
// AI 응답에 포함되는 토큰
[[ACTION:RESERVATION_MODAL]]   // 예약 모달
[[ACTION:DOCTOR_INTRO_MODAL]]  // 의료진 소개 모달
[[ACTION:EVIDENCE_MODAL]]      // SCI 논문 모달

// 후기/위치는 토큰 대신 상단 탭 유도 문장
"상단의 '후기보기'를 확인해보시겠습니까?"
```

---

### `src/app/api/chat/route.ts` ⭐⭐

**2024-12-20 업데이트: 토큰 파싱 + 구조화된 응답**

```typescript
// API 요청 파라미터
{
  message: string,
  history: Message[],
  turnCount: number,
  track?: string,
  askedQuestionCount?: number  // NEW: 질문 카운터
}

// API 응답 (NEW: 구조화됨)
{
  role: "ai",
  content: string,              // 토큰 제거된 깨끗한 텍스트
  action: ActionType | null,    // NEW: 모달 트리거
  highlightTabs: ('review' | 'map')[],  // NEW: 탭 하이라이트
  track: string,
  askedQuestionCount: number,   // NEW: 질문 카운터
  doctorsData?: Doctor[],       // 의료진 데이터 (모달용)
  evidenceData?: SciEvidence    // 논문 데이터 (모달용)
}
```

---

## 🩺 2. 모달 컴포넌트 (NEW!)

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

**수정 포인트:**
- `doctorImages` 객체: 의사 사진 경로 매핑
- CTA 버튼 라벨/색상

### `src/components/medical/EvidenceModal.tsx` ⭐

```typescript
interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  evidence: SciEvidence;  // SCI_EVIDENCE 전달
}
```

---

## 👤 3. 환자 대시보드 (Patient Dashboard)

### `src/app/medical/patient-dashboard/PatientDashboardClient.tsx` ⭐⭐

**2024-12-20 업데이트: 모달 통합 + 탭 하이라이트**

```typescript
// 모달 상태
const [showDoctorIntroModal, setShowDoctorIntroModal] = useState(false);
const [showEvidenceModal, setShowEvidenceModal] = useState(false);
const [highlightedTabs, setHighlightedTabs] = useState<('review' | 'map')[]>([]);

// ChatInterface에 콜백 전달
<ChatInterface
  onAction={(action, data) => {
    if (action === 'DOCTOR_INTRO_MODAL') setShowDoctorIntroModal(true);
    if (action === 'EVIDENCE_MODAL') setShowEvidenceModal(true);
  }}
  onTabHighlight={(tabs) => {
    setHighlightedTabs(tabs);
    setTimeout(() => setHighlightedTabs([]), 3000);  // 3초 후 해제
  }}
/>
```

**수정 포인트:**
- 퀵액션 버튼 (6개: 예약, 증상정리, 복약, 업로드, 후기, 위치)
- 탭 하이라이트 스타일

---

## 💬 4. 채팅 인터페이스

### `src/components/chat/ChatInterface.tsx` ⭐⭐

**2024-12-20 업데이트: 액션 콜백 + 탭 하이라이트**

```typescript
type ActionType = 'RESERVATION_MODAL' | 'DOCTOR_INTRO_MODAL' | 'EVIDENCE_MODAL' | null;

type ChatInterfaceProps = {
  // ... 기존 props
  onAction?: (action: ActionType, data?: any) => void;  // NEW
  onTabHighlight?: (tabs: ('review' | 'map')[]) => void;  // NEW
};

// 상태
const [askedQuestionCount, setAskedQuestionCount] = useState(0);
const [currentTrack, setCurrentTrack] = useState<string | null>(null);
```

**수정 포인트:**
- 로그인 모달 문구 (의료법 준수)
- 헬스케어 모듈 탭 (글래스모피즘 + 아이콘)

---

## 🏥 5. 랜딩 페이지

### `src/app/page.tsx` ⭐

**2024-12-20 업데이트: UI 개선**

- 피처 카드: 글래스모피즘 + 네이비/블루 라벨
- 타이틀: "2분 컨디션 패턴 체크"
- 모듈 그리드: 5개 건강 체크 모듈

---

## ✅ 체크리스트

### 필수 변경 (1순위)
- [ ] `prompts.ts` - DOCTORS 배열 (의료진 4인)
- [ ] `prompts.ts` - DOCTOR_TRACK_MAPPING (트랙별 매핑)
- [ ] `prompts.ts` - SCI_EVIDENCE (논문 정보)
- [ ] `prompts.ts` - MEDICAL_TRACKS (진료 분야)
- [ ] `public/logo.png` - 로고 이미지
- [ ] 메타데이터 (title, description)

### 중요 변경 (2순위)
- [ ] `DoctorIntroModal.tsx` - doctorImages 경로
- [ ] `PatientDashboardClient.tsx` - 퀵액션 버튼
- [ ] `ChatInterface.tsx` - 로그인 모달 문구
- [ ] `page.tsx` - 랜딩 페이지 문구

### 선택 변경 (3순위)
- [ ] 색상 테마 (tailwind.config.js)
- [ ] 약물 DB (medications/page.tsx)
- [ ] 페이지당 항목 수 (ITEMS_PER_PAGE)

---

##  파일 경로 빠른 참조

```
src/
├── lib/ai/
│   ├── prompts.ts          ⭐⭐⭐ AI 프롬프트 + 의료진 데이터
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
│       ├── DoctorIntroModal.tsx  ⭐⭐ 의료진 모달 (NEW)
│       ├── EvidenceModal.tsx     ⭐ 논문 모달 (NEW)
│       └── ReservationModal.tsx  예약 모달
└── public/
    └── logo.png            ⭐ 로고
```

---

## 📝 업데이트 이력

### 2024-12-20 (최신)
- **의료진 데이터 시스템**
  - DOCTORS 배열 (이름, 직함, 학력, 전문분야, 트랙)
  - DOCTOR_TRACK_MAPPING (트랙별 추천 의료진)
  - SCI_EVIDENCE (논문 정보)

- **4턴 강제 요약 로직**
  - 질문 2개 제한 (askedQuestionCount)
  - 4턴째 강제 요약 (공감→요약→가능성→면책→CTA)
  - 5~9턴 Q&A + CTA 유지
  - 10턴 마무리

- **액션 토큰 시스템**
  - RESERVATION_MODAL / DOCTOR_INTRO_MODAL / EVIDENCE_MODAL
  - API에서 파싱 후 구조화된 응답
  - 프론트에서 모달 트리거

- **탭 하이라이트**
  - 후기/위치 탭 3초 펄스 애니메이션
  - 토큰 대신 상단 탭 유도 문장

- **UI 개선**
  - 헬스케어 모듈 탭 (글래스모피즘 + 아이콘)
  - 피처 카드 (화이트 글래스모피즘)
  - 로그인 모달 문구 (의료법 준수)

---

*이 문서는 프로젝트 복제 후 새 의료 분야로 확장 시 참고용입니다.*
