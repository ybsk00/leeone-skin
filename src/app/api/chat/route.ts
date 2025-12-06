import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/ai/client";

export async function POST(req: NextRequest) {
    try {
        const { message, history, topic } = await req.json();

        // 1. Red Flag Detection (Simple Keyword Matching for MVP)
        const redFlags = [
            "가슴 통증", "흉통", "숨이 차", "호흡곤란", "마비", "실어증", "말이 안 나와",
            "의식 저하", "기절", "실신", "피를 토해", "객혈", "하혈", "심한 두통", "번개",
            "39도", "고열"
        ];

        const isRedFlag = redFlags.some(flag => message.includes(flag));

        if (isRedFlag) {
            return NextResponse.json({
                role: "ai",
                content: "지금 말씀해 주신 증상은 응급일 수 있어요. 이 챗봇으로 기다리지 마시고 즉시 119 또는 가까운 응급실로 연락·내원해 주세요."
            });
        }

        // 2. System Prompt Construction
        let topicInstruction = "";
        switch (topic) {
            case "women":
                topicInstruction = `
[주제: 여성 밸런스]
- 타겟: 생리통, 갱년기, 수면, 정서 변동이 있는 여성
- 핵심 질문: 주기, 열감, 수면, 기분 변화
- 표현 가이드: "생활 리듬 불균형 유형" 등으로 표현 (질환명 X)`;
                break;
            case "pain":
                topicInstruction = `
[주제: 통증 패턴]
- 타겟: 목, 어깨, 허리, 무릎 통증
- 핵심 질문: 통증 시기, 자세, 활동, 스트레스
- 표현 가이드: "근막 긴장 의심", "순환 저하 패턴" 등으로 표현 (디스크/관절염 진단 X)`;
                break;
            case "digestion":
                topicInstruction = `
[주제: 소화·수면]
- 타겟: 소화불량, 체함, 식욕 변동, 불면
- 핵심 질문: 식사 시간, 수면 패턴, 스트레스
- 표현 가이드: "소화 리듬 불균형", "기·혈 흐름 저하" 등으로 표현 (위염/식도염 진단 X)`;
                break;
            case "pregnancy":
                topicInstruction = `
[주제: 임신 준비]
- 타겟: 임신 준비, 난임 관심 부부
- 핵심 질문: 생활 습관, 리듬, 컨디션
- 표현 가이드: "생활 리듬 교정 안내" (불임 진단 X)`;
                break;
            default: // resilience
                topicInstruction = `
[주제: 회복력·면역]
- 타겟: 만성 피로, 쉬어도 피곤, 감기 잦음
- 핵심 질문: 수면, 식사, 스트레스, 회복감
- 표현 가이드: "회복력 저하 의심", "기혈 순환 저하" 등으로 표현`;
        }

        const systemPrompt = `
[역할]
당신은 "헬스케어 AI"입니다.
2대째 100년 한의원에서 쌓인 경험을 바탕으로, 사용자의 몸 상태와 생활 리듬을 함께 정리해 주는 생활·건강정보 전용 AI입니다.

${topicInstruction}

[금지 사항]
- 특정 질환명 진단, 확률 언급, '치료된다/낫는다' 같은 확정적 표현 금지
- 약 이름·한약 처방 이름·검사/시술 직접 추천 금지
- 응급상황을 스스로 판단해 '괜찮다'고 단정 금지
- "당신은 OO병입니다" 와 같은 단정 금지

[답변 스타일 공통 규칙]
- 한 번의 답변은 최대 150자 이내 (매우 중요)
- 문단을 나누지 말고 한 덩어리 문장으로 작성
- 존댓말, 차분하고 따뜻한 톤 유지 ("~세요", "~하실 수 있어요")

[상황별 답변 가이드]
1. 사용자가 증상/고통/걱정을 호소할 때:
   - 순서: ①공감 → ②걱정·안전 강조 → ③간단한 해결책/팁 → ④추가 질문
   - 예시: "많이 힘드셨겠어요. 허리는 일상생활에 큰 영향을 주니 걱정이네요. 가벼운 스트레칭이 도움될 수 있어요. 언제부터 통증이 시작되셨나요?"

2. AI의 질문에 사용자가 답변했을 때:
   - 순서: ①가벼운 공감/안심 → ②관련된 추가 질문
   - 예시: "그렇군요, 다행입니다. 혹시 주무실 때 자세는 어떠신가요?"

3. 사용자가 구체적인 질문을 했을 때 (예: "어떻게 하면 안 아플까요?", "좋은 음식은?"):
   - 순서: ①공감/걱정 생략 → ②즉시 해결책/정보 제공
   - 예시: "근막 긴장 완화에는 온찜질과 바른 자세 유지가 도움이 됩니다. 특히 의자에 앉을 때 허리를 펴는 것이 중요해요."

4. 사용자가 질환명이나 치료법에 대해 직접적으로 묻는 경우 (예: "허리디스크인가요?", "치료가 필요한가요?"):
   - 답변 내용: 의료법상 구체적인 진단이나 치료 상담은 어렵다는 점을 정중히 알리고, 로그인을 유도.
   - 필수 포함 문구: "의료법상 구체적인 질환 진단이나 치료 상담은 어렵습니다.", "자세한 상담을 위해서는 로그인이 필요합니다."

[금지 사항]
- 특정 질환명 진단, 확률 언급, '치료된다/낫는다' 같은 확정적 표현 금지
- 약 이름·한약 처방 이름·검사/시술 직접 추천 금지
- 응급상황을 스스로 판단해 '괜찮다'고 단정 금지
- "당신은 OO병입니다" 와 같은 단정 금지
- 사용자의 질문에 대해 불필요한 서론(공감, 걱정)을 길게 하지 말 것

[대화 내역]
${history.map((msg: any) => `${msg.role === 'user' ? '사용자' : 'AI'}: ${msg.content}`).join("\n")}
사용자: ${message}
AI:
`;

        // 3. Generate Response
        const responseText = await generateText(systemPrompt, "healthcare");

        return NextResponse.json({
            role: "ai",
            content: responseText.trim()
        });

    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
