"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, ArrowLeft, Paperclip, ArrowUp, Sun, Moon, Activity, Heart, Baby, Calendar } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ConditionReport from "@/components/healthcare/ConditionReport";
import ReservationModal from "@/components/medical/ReservationModal";

type Message = {
    role: "user" | "ai";
    content: string;
};

type ChatInterfaceProps = {
    isEmbedded?: boolean;
    isLoggedIn?: boolean;
};

export default function ChatInterface(props: ChatInterfaceProps) {
    const searchParams = useSearchParams();
    const topic = searchParams.get("topic") || "recovery";

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [turnCount, setTurnCount] = useState(0);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginModalContent, setLoginModalContent] = useState({
        title: "상세한 상담이 필요하신가요?",
        desc: "더 정확한 건강 분석과 맞춤형 조언을 위해<br />로그인이 필요합니다."
    });
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Map topic to serviceType and Initial Message
    const serviceConfig: Record<string, { serviceType: string; initialMessage: string }> = {
        recovery: {
            serviceType: "recovery",
            initialMessage: "반갑네! 자네의 기력 배터리를 점검해줄 '기력 장인'일세. \n\n오늘 하루, 가장 피곤했던 시간은 언제였나? (아침/오후/저녁/하루 종일)"
        },
        resilience: { // Handle legacy id if needed
            serviceType: "recovery",
            initialMessage: "반갑네! 자네의 기력 배터리를 점검해줄 '기력 장인'일세. \n\n오늘 하루, 가장 피곤했던 시간은 언제였나? (아침/오후/저녁/하루 종일)"
        },
        women: {
            serviceType: "women",
            initialMessage: "안녕하세요, 당신의 '달의 리듬'을 함께 읽어볼게요. \n\n평소 월경 주기는 규칙적인 편인가요? (대체로 규칙적/가끔 달라짐/자주 들쭉날쭉)"
        },
        pain: {
            serviceType: "pain",
            initialMessage: "안녕하세요! 오늘 당신의 몸 날씨를 알려드릴게요. \n\n가장 자주 불편하거나 뻐근한 부위는 어디인가요? (목·어깨/허리/무릎·다리/그 외)"
        },
        digestion: {
            serviceType: "digestion",
            initialMessage: "반갑습니다. 위장과 수면의 균형을 봐드릴게요. \n\n평소 식사 속도는 어떠신가요? (천천히/보통/빨리 먹는 편)"
        },
        pregnancy: {
            serviceType: "pregnancy",
            initialMessage: "안녕하세요, 건강한 임신 준비를 돕는 체력 코치입니다. \n\n하루 중 피로감은 어느 정도 느끼시나요? (대부분 괜찮음/오후에 피곤/하루 종일 피곤)"
        }
    };

    // Welcome message based on topic
    useEffect(() => {
        const config = serviceConfig[topic] || serviceConfig["recovery"];
        setMessages([{ role: "ai", content: config.initialMessage }]);
        setTurnCount(0); // Reset turn count on topic change
    }, [topic]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleImageClick = () => {
        if (props.isLoggedIn) return; // Skip if logged in
        setLoginModalContent({
            title: "이미지 분석 기능",
            desc: "이미지 분석을 통한 건강 상담은<br />로그인 후 이용 가능합니다."
        });
        setShowLoginModal(true);
    };

    const [showReservationModal, setShowReservationModal] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");

        const newTurnCount = turnCount + 1;
        setTurnCount(newTurnCount);
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);

        // Check for login modal trigger (3, 7 turns) - Only if NOT logged in
        if (!props.isLoggedIn && [3, 7].includes(newTurnCount)) {
            setLoginModalContent({
                title: "상세한 상담이 필요하신가요?",
                desc: "더 정확한 건강 분석과 맞춤형 조언을 위해<br />로그인이 필요합니다."
            });
            setShowLoginModal(true);
        }

        setIsLoading(true);

        try {
            const config = serviceConfig[topic] || serviceConfig["recovery"];

            const response = await fetch("/api/healthcare/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages,
                    serviceType: config.serviceType, // Use the mapped serviceType
                }),
            });

            if (!response.ok) throw new Error("Failed to send message");

            const data = await response.json();
            let aiContent = data.content;

            // Check for reservation trigger
            if (aiContent.includes("[RESERVATION_TRIGGER]")) {
                aiContent = aiContent.replace("[RESERVATION_TRIGGER]", "").trim();
                setShowReservationModal(true);
            }

            setMessages(prev => [...prev, { role: "ai", content: aiContent }]);

            // Check for forced login trigger from AI response - Only if NOT logged in
            if (!props.isLoggedIn && data.content.includes("로그인이 필요합니다")) {
                setLoginModalContent({
                    title: "상세한 상담이 필요하신가요?",
                    desc: "더 정확한 건강 분석과 맞춤형 조언을 위해<br />로그인이 필요합니다."
                });
                setShowLoginModal(true);
            }
        } catch (error) {
            console.error("Error:", error);
            setMessages(prev => [...prev, { role: "ai", content: "죄송합니다. 잠시 문제가 발생했습니다. 다시 시도해주세요." }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Report Logic (Simplified for design update, keeping functionality)
    const [showReport, setShowReport] = useState(false);
    const [reportData, setReportData] = useState<any>(null);

    if (showReport && reportData) {
        return <ConditionReport result={reportData} onRetry={() => setShowReport(false)} />;
    }

    const modules = [
        {
            id: "recovery", // Changed from resilience to match serviceType
            label: "회복력·면역",
            desc: "만성 피로, 잦은 감기",
            theme: "from-amber-500/20 to-orange-600/20"
        },
        {
            id: "women",
            label: "여성 밸런스",
            desc: "생리불순, 갱년기 케어",
            theme: "from-rose-400/20 to-pink-600/20"
        },
        {
            id: "pain",
            label: "통증 패턴",
            desc: "만성 두통, 어깨 통증",
            theme: "from-blue-400/20 to-slate-600/20"
        },
        {
            id: "digestion",
            label: "소화·수면 리듬",
            desc: "소화불량, 수면장애",
            theme: "from-emerald-400/20 to-teal-600/20"
        },
        {
            id: "pregnancy",
            label: "임신 준비",
            desc: "난임, 건강한 임신",
            theme: "from-violet-400/20 to-purple-600/20"
        },
    ];

    return (
        <div className={`${props.isEmbedded ? "h-full" : "min-h-screen"} bg-traditional-bg font-sans flex flex-col selection:bg-traditional-accent selection:text-white`}>
            {/* Header - Hidden if embedded */}
            {!props.isEmbedded && (
                <header className="bg-white/80 backdrop-blur-md border-b border-traditional-muted/50 px-6 py-4 flex items-center justify-between sticky top-0 z-50 transition-all duration-300">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 bg-traditional-primary rounded-lg flex items-center justify-center shadow-sm group-hover:bg-traditional-accent transition-colors duration-300">
                            <span className="text-white text-xs font-bold font-serif">JK</span>
                        </div>
                        <span className="text-lg font-bold text-traditional-text tracking-tight group-hover:text-traditional-primary transition-colors">100년 한의학 AI 헬스케어</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-traditional-subtext">
                        <Link href="/login" className="px-6 py-2 bg-traditional-primary text-white text-sm font-medium rounded-full hover:bg-traditional-accent hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                            로그인
                        </Link>
                    </div>
                </header>
            )}

            <main className={`flex-1 w-full mx-auto ${props.isEmbedded ? "flex flex-col overflow-hidden p-0" : "max-w-5xl px-4 pb-20 pt-6"}`}>
                {/* Hero Banner - Hidden if embedded */}
                {!props.isEmbedded && (
                    <div className="relative rounded-3xl overflow-hidden mb-8 h-[300px] md:h-[380px] shadow-2xl group">
                        <div className="absolute inset-0 bg-[url('/images/herbal-bg.png')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-90 grayscale-[20%] sepia-[10%]"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
                        <div className="absolute inset-0 bg-traditional-primary/20 mix-blend-multiply"></div>

                        <div className="relative z-10 h-full flex flex-col justify-center p-8 md:p-12">
                            <div className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-medium mb-4 w-fit">
                                AI Health Analysis
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg font-serif leading-tight">
                                AI 헬스케어로<br />알아보는 나의 건강
                            </h2>
                            <p className="text-white/90 text-sm md:text-base font-light mb-4 max-w-lg leading-relaxed">
                                100년 전통의 한의학 지혜와 최첨단 AI 기술이 만나<br />당신만의 건강 리듬을 찾아드립니다.
                            </p>

                            {/* Module List (Overlay on Hero) */}
                            <div className="flex gap-3 overflow-x-auto pb-4 p-1 no-scrollbar mask-linear-fade">
                                {modules.map((mod) => (
                                    <Link
                                        key={mod.id}
                                        href={`/healthcare/chat?topic=${mod.id}`}
                                        className={`flex-shrink-0 flex flex-col items-center justify-center px-5 py-3 rounded-xl border backdrop-blur-md transition-all duration-300 ${topic === mod.id
                                            ? "bg-white text-traditional-primary border-white shadow-lg scale-105 font-bold"
                                            : "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40"
                                            }`}
                                    >
                                        <span className="text-sm whitespace-nowrap">{mod.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Chat Area */}
                <div className={`bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-6 space-y-8 shadow-xl ${props.isEmbedded ? "flex-1 overflow-y-auto rounded-none border-x-0 border-t-0 bg-transparent shadow-none" : "min-h-[500px]"}`}>
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex items-start gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                        >
                            {/* Avatar */}
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden border-2 ${msg.role === "ai"
                                    ? "border-traditional-primary bg-traditional-bg"
                                    : "border-traditional-accent bg-traditional-bg"
                                    }`}
                            >
                                {msg.role === "ai" ? (
                                    <img
                                        src="/images/character-doctor.jpg"
                                        alt="Doctor"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-traditional-accent flex items-center justify-center text-white">
                                        <User size={20} />
                                    </div>
                                )}
                            </div>

                            {/* Bubble */}
                            <div className="flex flex-col gap-1 max-w-[80%]">
                                <span className={`text-xs font-medium ${msg.role === "user" ? "text-right text-traditional-subtext" : "text-left text-traditional-primary"}`}>
                                    {msg.role === "ai" ? "AI 헬스체크" : "나"}
                                </span>
                                <div
                                    className={`px-6 py-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === "ai"
                                        ? "bg-white text-traditional-text border border-traditional-muted rounded-tl-none"
                                        : "bg-traditional-primary text-white rounded-tr-none shadow-md"
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full border-2 border-traditional-primary bg-traditional-bg flex items-center justify-center shadow-md overflow-hidden flex-shrink-0">
                                <img
                                    src="/images/character-doctor.jpg"
                                    alt="Doctor"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="bg-white px-6 py-4 rounded-2xl rounded-tl-none border border-traditional-muted shadow-sm">
                                <div className="flex gap-1.5">
                                    <span className="w-2 h-2 bg-traditional-primary/40 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-traditional-primary/40 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-2 h-2 bg-traditional-primary/40 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Input Area */}
            <div className={`${props.isEmbedded ? "relative bg-white border-t border-gray-100" : "fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-traditional-muted/50"} p-4 z-40`}>
                <div className={`${props.isEmbedded ? "w-full" : "max-w-4xl mx-auto"} relative`}>
                    <form onSubmit={handleSubmit} className="relative bg-white rounded-full shadow-xl border border-traditional-muted/50 flex items-center p-2 pl-6 transition-shadow hover:shadow-2xl">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="증상이나 궁금한 점을 입력해주세요..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-traditional-text placeholder:text-traditional-subtext/50 text-base"
                        />
                        <button
                            type="button"
                            onClick={handleImageClick}
                            className="p-3 text-traditional-subtext hover:text-traditional-primary transition-colors hover:bg-traditional-bg rounded-full"
                        >
                            <Paperclip size={20} />
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="p-3 bg-traditional-primary text-white rounded-full hover:bg-traditional-accent transition-all disabled:opacity-50 disabled:hover:bg-traditional-primary ml-2 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                        >
                            <ArrowUp size={20} />
                        </button>
                    </form>
                </div>
            </div>

            {/* Login Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center transform transition-all scale-100 border border-white/20">
                        <div className="w-16 h-16 bg-traditional-bg rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <User className="w-8 h-8 text-traditional-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-traditional-text mb-3 font-serif">
                            {loginModalContent.title}
                        </h3>
                        <p
                            className="text-traditional-subtext text-sm mb-8 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: loginModalContent.desc }}
                        />
                        <div className="flex flex-col gap-3">
                            <Link
                                href="/login"
                                className="w-full py-3.5 bg-traditional-primary text-white rounded-xl font-bold hover:bg-traditional-accent transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                로그인하고 계속하기
                            </Link>
                            <button
                                onClick={() => setShowLoginModal(false)}
                                className="w-full py-3.5 bg-traditional-bg text-traditional-subtext rounded-xl font-medium hover:bg-traditional-muted transition-colors"
                            >
                                나중에 하기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reservation Modal */}
            <ReservationModal
                isOpen={showReservationModal}
                onClose={() => setShowReservationModal(false)}
                initialTab="book"
            />
        </div >
    );
}
