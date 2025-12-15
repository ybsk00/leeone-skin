'use client'

import { Pill, MessageSquare, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function MedicationsPage() {
    return (
        <div className="min-h-screen pb-24" style={{ backgroundColor: '#0a0f1a' }}>
            <div className="max-w-lg mx-auto px-4 pt-6">
                <h1 className="text-2xl font-bold text-white mb-6">복약 관리</h1>

                {/* AI 한의사 상담 안내 */}
                <div
                    className="p-6 rounded-2xl mb-6"
                    style={{
                        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    }}
                >
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">🌿</span>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-bold text-white mb-2">AI 한의사와 상담하기</h2>
                            <p className="text-sm text-green-100 mb-4 leading-relaxed">
                                증상에 맞는 한약과 복약 방법에 대해 AI 한의사와 상담해보세요.
                                증상 분석, 체질 진단, 복약 안내를 받으실 수 있습니다.
                            </p>
                            <Link
                                href="/patient/chat"
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-green-600 font-medium hover:bg-green-50 transition-colors"
                            >
                                <MessageSquare size={18} />
                                상담 시작하기
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 처방 내역 */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-white mb-4">처방 내역</h2>
                    <div
                        className="flex flex-col items-center justify-center py-16 rounded-2xl text-center"
                        style={{ backgroundColor: '#1a2332', border: '1px solid #1f2937' }}
                    >
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                            style={{ backgroundColor: '#111827' }}
                        >
                            <Pill className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-white font-bold mb-2">처방받은 약이 없습니다</h3>
                        <p className="text-gray-400 text-sm">
                            진료 후 처방전이 등록되면<br />
                            여기에서 확인하실 수 있습니다.
                        </p>
                    </div>
                </div>

                {/* 복약 가이드 */}
                <div>
                    <h2 className="text-lg font-bold text-white mb-4">한약 복용 가이드</h2>
                    <div className="space-y-3">
                        <div
                            className="p-4 rounded-xl"
                            style={{ backgroundColor: '#1a2332', border: '1px solid #1f2937' }}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-lg">⏰</span>
                                <h4 className="text-white font-medium">복용 시간</h4>
                            </div>
                            <p className="text-sm text-gray-400 pl-8">
                                한약은 식전 30분 또는 식후 30분에 복용하세요.
                            </p>
                        </div>
                        <div
                            className="p-4 rounded-xl"
                            style={{ backgroundColor: '#1a2332', border: '1px solid #1f2937' }}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-lg">🌡️</span>
                                <h4 className="text-white font-medium">온도</h4>
                            </div>
                            <p className="text-sm text-gray-400 pl-8">
                                탕약은 따뜻하게 데워서 복용하시면 효과가 좋습니다.
                            </p>
                        </div>
                        <div
                            className="p-4 rounded-xl"
                            style={{ backgroundColor: '#1a2332', border: '1px solid #1f2937' }}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-lg">🥤</span>
                                <h4 className="text-white font-medium">음료</h4>
                            </div>
                            <p className="text-sm text-gray-400 pl-8">
                                복용 전후 30분간 커피, 녹차, 탄산음료는 피해주세요.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
