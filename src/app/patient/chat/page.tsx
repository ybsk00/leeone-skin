'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Mic, ChevronUp, X, Calendar, Stethoscope, Camera, Image as ImageIcon, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Message = {
    id: string
    role: 'user' | 'assistant' | 'system'
    content: string
    timestamp?: Date
}

type SymptomAnalysis = {
    symptoms: string[]
    hypotheses: string[]
    questions: string[]
}

const quickReplies = ['두통이 있어요', '소화가 안돼요', '잠을 못 자요', '피로해요']

// AI 한의사 프롬프트 생성
const generateAIResponse = (userMessage: string, turnCount: number, analysis: SymptomAnalysis): { message: string, analysis: SymptomAnalysis, showBooking: boolean } => {
    const lowerMessage = userMessage.toLowerCase()
    let showBooking = false

    // 예약 동의 확인
    if ((lowerMessage.includes('네') || lowerMessage.includes('예') || lowerMessage.includes('좋아') || lowerMessage.includes('예약')) && turnCount >= 4) {
        return {
            message: '알겠습니다. 지금 바로 편하신 시간에 예약을 도와드리겠습니다. 😊',
            analysis,
            showBooking: true
        }
    }

    // 증상 키워드 분석
    const symptomKeywords: { [key: string]: string[] } = {
        '두통': ['긴장성 두통', '편두통', '혈압성 두통'],
        '머리': ['긴장성 두통', '편두통', '혈압성 두통'],
        '소화': ['소화불량', '위염', '기능성 위장장애'],
        '위': ['소화불량', '위염', '역류성 식도염'],
        '배': ['소화불량', '장염', '과민성 대장증후군'],
        '잠': ['불면증', '수면장애', '스트레스성 수면문제'],
        '피로': ['만성피로증후군', '기력저하', '영양불균형'],
        '목': ['경추 문제', '근막통증', '기혈순환 장애'],
        '어깨': ['견비통', '근막통증', '기혈순환 장애'],
        '허리': ['요통', '좌골신경통', '신장기능 저하'],
        '감기': ['풍한감기', '풍열감기', '면역력 저하'],
        '기침': ['기관지염', '폐기허증', '담음증'],
        '스트레스': ['간기울결', '심화항성', '신경쇠약'],
        '불안': ['심담허겁', '간기울결', '심신불교'],
    }

    // 새 증상 추가
    for (const [keyword, hypo] of Object.entries(symptomKeywords)) {
        if (userMessage.includes(keyword)) {
            if (!analysis.symptoms.includes(keyword)) {
                analysis.symptoms.push(keyword)
            }
            hypo.forEach(h => {
                if (!analysis.hypotheses.includes(h)) {
                    analysis.hypotheses.push(h)
                }
            })
        }
    }

    // 턴별 응답 생성
    let response = ''

    if (turnCount === 1) {
        // 첫 번째 턴: 공감 + 기본 질문
        if (analysis.symptoms.length > 0) {
            response = `${analysis.symptoms.join(', ')} 증상으로 많이 힘드시겠네요. 😣 한방적으로 여러 원인이 있을 수 있어요. 증상이 언제부터 시작되었는지, 그리고 특별히 악화되는 상황이 있으신지 알려주시겠어요?`
        } else {
            response = '말씀해주신 증상에 대해 더 자세히 알고 싶어요. 😊 구체적으로 어떤 불편함이 있으신지, 언제부터 시작되었는지 알려주시겠어요?'
        }
    } else if (turnCount === 2) {
        response = `네, 이해했어요. 증상의 원인을 파악하기 위해 조금 더 여쭤볼게요. 해당 증상과 함께 다른 불편한 곳은 없으신가요? 예를 들어 식욕, 수면, 대소변 상태는 어떠세요?`
    } else if (turnCount === 3) {
        response = `소중한 정보 감사해요. 😊 마지막으로, 평소 스트레스를 많이 받으시는 편인가요? 그리고 차가운 것과 따뜻한 것 중 어느 쪽을 더 좋아하시나요?`
    } else if (turnCount === 4) {
        // 4턴: 가설 제시 + 경고문
        const topHypo = analysis.hypotheses.slice(0, 2)
        response = `지금까지 말씀해주신 내용을 종합해보면, **${topHypo.length > 0 ? topHypo.join(', ') : '기능성 문제'}** 가능성이 있어 보여요.\n\n⚠️ **주의**: AI 상담은 참고용이며, 정확한 진단을 위해서는 반드시 전문 한의사의 진료가 필요합니다.\n\n한의원에서 정확한 진맥과 상담을 받아보시는 것이 좋겠어요. 예약을 도와드릴까요? 🏥`
    } else {
        // 5턴 이후
        response = '증상에 대해 더 궁금한 점이 있으시면 말씀해주세요. 예약을 원하시면 "예"라고 답해주세요. 😊'
    }

    return { message: response, analysis, showBooking }
}

export default function ChatPage() {
    const router = useRouter()
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'init',
            role: 'assistant',
            content: '안녕하세요, AI 한의사입니다. 🌿 오늘 어디가 불편하신가요? 증상을 자세히 말씀해주시면 도움을 드릴게요.',
            timestamp: new Date()
        }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [turnCount, setTurnCount] = useState(0)
    const [showAppointmentModal, setShowAppointmentModal] = useState(false)
    const [symptomAnalysis, setSymptomAnalysis] = useState<SymptomAnalysis>({ symptoms: [], hypotheses: [], questions: [] })
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeImage = () => {
        setSelectedImage(null)
        setImagePreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if ((!input.trim() && !selectedImage) || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input || '사진을 첨부했습니다.',
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        removeImage()
        setIsLoading(true)

        const newTurnCount = turnCount + 1
        setTurnCount(newTurnCount)

        // Generate AI response
        setTimeout(() => {
            const { message, analysis, showBooking } = generateAIResponse(userMessage.content, newTurnCount, symptomAnalysis)
            setSymptomAnalysis(analysis)

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: message,
                timestamp: new Date()
            }
            setMessages(prev => [...prev, aiMessage])
            setIsLoading(false)

            if (showBooking) {
                setTimeout(() => setShowAppointmentModal(true), 800)
            }
        }, 1000)
    }

    const handleQuickReply = (text: string) => {
        setInput(text)
    }

    const handleFinish = async () => {
        if (!confirm('상담을 종료하시겠습니까?')) return
        router.push('/patient')
    }

    const handleBookAppointment = () => {
        setShowAppointmentModal(false)
        router.push('/patient/appointments/new')
    }

    const formatTime = (date?: Date) => {
        if (!date) return ''
        return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    }

    // 메시지 렌더링 (마크다운 볼드 처리)
    const renderMessage = (content: string) => {
        const parts = content.split(/(\*\*[^*]+\*\*)/g)
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="text-blue-400">{part.slice(2, -2)}</strong>
            }
            return part
        })
    }

    return (
        <div className="flex flex-col h-screen" style={{ backgroundColor: '#0a0f1a' }}>
            {/* Header */}
            <header className="sticky top-0 z-10 px-4 py-3" style={{ backgroundColor: '#0a0f1a', borderBottom: '1px solid #1f2937' }}>
                <div className="flex items-center justify-between max-w-lg mx-auto">
                    <Link href="/patient">
                        <button className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors">
                            <ArrowLeft size={24} />
                        </button>
                    </Link>
                    <div className="text-center">
                        <h1 className="text-lg font-bold text-white">AI 한의사 상담</h1>
                        <div className="flex items-center justify-center gap-1.5 mt-0.5">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-xs text-gray-400">상담 중 ({turnCount}턴)</span>
                        </div>
                    </div>
                    <button
                        onClick={handleFinish}
                        className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors text-sm font-medium"
                    >
                        종료
                    </button>
                </div>
            </header>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6" style={{ backgroundColor: '#0a0f1a' }}>
                <div className="max-w-lg mx-auto space-y-6">
                    {/* Date Badge */}
                    <div className="flex justify-center">
                        <span className="px-4 py-1.5 text-xs text-gray-400 rounded-full" style={{ backgroundColor: '#1f2937' }}>
                            오늘 {formatTime(new Date())}
                        </span>
                    </div>

                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'assistant' && (
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                                        <span className="text-white text-lg">🌿</span>
                                    </div>
                                    <div className="flex flex-col gap-1 max-w-[75%]">
                                        <span className="text-xs text-gray-500">AI 한의사</span>
                                        <div
                                            className="px-4 py-3 text-sm text-white leading-relaxed whitespace-pre-line"
                                            style={{
                                                backgroundColor: '#374151',
                                                borderRadius: '16px 16px 16px 4px'
                                            }}
                                        >
                                            {renderMessage(msg.content)}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {msg.role === 'user' && (
                                <div className="flex gap-3 justify-end">
                                    <div className="flex flex-col items-end gap-1 max-w-[75%]">
                                        <span className="text-xs text-gray-500">나</span>
                                        <div
                                            className="px-4 py-3 text-sm text-white leading-relaxed"
                                            style={{
                                                backgroundColor: '#2563eb',
                                                borderRadius: '16px 16px 4px 16px'
                                            }}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center">
                                        <span className="text-white font-bold">나</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                                <span className="text-white text-lg">🌿</span>
                            </div>
                            <div
                                className="px-4 py-3 flex gap-1.5"
                                style={{
                                    backgroundColor: '#374151',
                                    borderRadius: '16px 16px 16px 4px'
                                }}
                            >
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="sticky bottom-0 border-t" style={{ backgroundColor: '#0a0f1a', borderColor: '#1f2937' }}>
                {/* Quick Replies */}
                <div className="px-4 py-3 overflow-x-auto">
                    <div className="flex gap-2 max-w-lg mx-auto">
                        {quickReplies.map((chip) => (
                            <button
                                key={chip}
                                onClick={() => handleQuickReply(chip)}
                                className="flex-shrink-0 px-4 py-2 text-sm text-gray-300 rounded-full border transition-colors hover:bg-white/5"
                                style={{ borderColor: '#374151', backgroundColor: 'transparent' }}
                            >
                                {chip}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Image Preview */}
                {imagePreview && (
                    <div className="px-4 py-2" style={{ backgroundColor: '#111827' }}>
                        <div className="max-w-lg mx-auto">
                            <div className="relative inline-block">
                                <img
                                    src={imagePreview}
                                    alt="미리보기"
                                    className="h-20 w-auto rounded-lg"
                                />
                                <button
                                    onClick={removeImage}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                                >
                                    <X size={14} className="text-white" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Image Upload Actions */}
                <div className="px-4 py-2">
                    <div className="flex gap-2 max-w-lg mx-auto">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleImageSelect}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-300 rounded-full border transition-colors hover:bg-white/5"
                            style={{ borderColor: '#374151' }}
                        >
                            <Camera size={14} />
                            증상 사진
                        </button>
                        <button
                            onClick={() => {
                                if (fileInputRef.current) {
                                    fileInputRef.current.removeAttribute('capture')
                                    fileInputRef.current.click()
                                    setTimeout(() => {
                                        fileInputRef.current?.setAttribute('capture', 'environment')
                                    }, 100)
                                }
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-300 rounded-full border transition-colors hover:bg-white/5"
                            style={{ borderColor: '#374151' }}
                        >
                            <ImageIcon size={14} />
                            갤러리
                        </button>
                    </div>
                </div>

                {/* Input Row */}
                <div className="px-4 pb-20 pt-2">
                    <div className="flex items-center gap-3 max-w-lg mx-auto">
                        <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-full" style={{ backgroundColor: '#1f2937' }}>
                            <input
                                type="text"
                                placeholder="증상을 입력해주세요..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        handleSubmit()
                                    }
                                }}
                                className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500"
                            />
                            <button className="text-gray-400 hover:text-white transition-colors">
                                <Mic size={20} />
                            </button>
                        </div>

                        <button
                            onClick={() => handleSubmit()}
                            disabled={isLoading || (!input.trim() && !selectedImage)}
                            className="p-3 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ backgroundColor: '#10b981' }}
                        >
                            <ChevronUp size={20} className="text-white" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Appointment Modal */}
            {showAppointmentModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() => setShowAppointmentModal(false)}
                    ></div>
                    <div
                        className="relative w-full max-w-sm rounded-2xl overflow-hidden"
                        style={{ backgroundColor: '#1a2332' }}
                    >
                        {/* Modal Header */}
                        <div
                            className="p-5"
                            style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
                        >
                            <button
                                onClick={() => setShowAppointmentModal(false)}
                                className="absolute top-4 right-4 text-white/70 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                    <Stethoscope size={24} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">AI한의원 예약</h3>
                                    <p className="text-sm text-green-100">상담 분석 완료</p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5">
                            {symptomAnalysis.hypotheses.length > 0 && (
                                <div className="mb-4 p-4 rounded-xl" style={{ backgroundColor: '#111827' }}>
                                    <p className="text-sm text-gray-400 mb-2">추정 증상</p>
                                    <div className="space-y-2">
                                        {symptomAnalysis.hypotheses.slice(0, 2).map((hypo, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-xs text-green-400">
                                                    {i + 1}
                                                </span>
                                                <span className="text-sm text-white">{hypo}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Warning */}
                            <div className="mb-4 p-3 rounded-xl flex items-start gap-2" style={{ backgroundColor: '#fef3c7' }}>
                                <AlertTriangle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-yellow-800">
                                    AI 상담은 참고용입니다. 정확한 진단을 위해 반드시 전문 한의사의 진료를 받으세요.
                                </p>
                            </div>

                            <p className="text-sm text-gray-300 mb-5 leading-relaxed">
                                전문 한의사 선생님의 상담을 받아보시겠어요? 지금 바로 예약하시면 빠른 시일 내에 진료받으실 수 있습니다.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowAppointmentModal(false)}
                                    className="flex-1 py-3 rounded-xl text-gray-400 font-medium border transition-colors hover:bg-white/5"
                                    style={{ borderColor: '#374151' }}
                                >
                                    나중에
                                </button>
                                <button
                                    onClick={handleBookAppointment}
                                    className="flex-1 py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2"
                                    style={{ backgroundColor: '#10b981' }}
                                >
                                    <Calendar size={18} />
                                    예약하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
