'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Building2, Calendar, MessageSquare, Pill, Heart, ArrowRight, ShieldCheck, Activity, Brain, Moon, Utensils, Baby, CheckCircle2, Lightbulb, Save } from 'lucide-react'

export default function PatientHomePage() {
    return (
        <div className="min-h-screen flex flex-col bg-[#0a0f1a]">
            {/* 1) Hero Section */}
            <section className="flex flex-col items-center justify-center px-6 pt-12 pb-16 text-center">
                {/* Logo */}
                <div className="mb-8 relative w-[180px] h-[60px]">
                    <Image
                        src="/logo_new.png"
                        alt="위담 건강가이드 챗"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                {/* Badge */}
                <div className="inline-block px-3 py-1 mb-4 rounded-full bg-blue-500/10 border border-blue-500/20">
                    <span className="text-blue-400 text-xs font-medium">위담 건강가이드 챗(참고용)</span>
                </div>

                {/* Headline */}
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                    더부룩함·속 불편,<br className="md:hidden" /> 리듬부터 체크하세요
                </h1>

                {/* Sub-copy */}
                <p className="text-gray-400 mb-8 max-w-md leading-relaxed text-sm md:text-base">
                    2~3분 문답으로 생활 패턴을 정리합니다.<br />
                    (진단·치료 아님)
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-md mb-8">
                    <Link
                        href="/patient/chat"
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all"
                    >
                        소화 리듬 체크
                    </Link>
                    <Link
                        href="/patient/login"
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#1a2332] text-gray-300 font-bold rounded-xl border border-gray-700 hover:bg-[#253045] transition-all"
                    >
                        로그인
                    </Link>
                </div>

                {/* Safety Notice */}
                <p className="text-gray-600 text-xs max-w-sm break-keep">
                    참고용 안내입니다. 증상이 지속되면 의료진 상담이 필요합니다.
                </p>
            </section>

            {/* 2) Bright Tone 2nd Section */}
            <section className="bg-white py-16 px-6 rounded-t-[2.5rem] -mt-6 relative z-10">
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI 건강가이드(참고용)</h2>
                        <p className="text-gray-500 text-sm">
                            생활 습관을 간단히 점검하고 요약합니다.<br />(진단·처방 아님)
                        </p>
                    </div>

                    <div className="grid gap-4">
                        {/* Card 1 */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <CheckCircle2 size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">생활 리듬 체크</h3>
                                <p className="text-sm text-gray-500">식사·수면·활동 패턴 정리</p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                <Lightbulb size={20} className="text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">관리 팁 안내</h3>
                                <p className="text-sm text-gray-500">실천 포인트를 간단히 제안</p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                <Save size={20} className="text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">요약 저장(로그인)</h3>
                                <p className="text-sm text-gray-500">결과 저장·상담 준비에 활용</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3) Modules Section */}
            <section className="bg-[#f8fafc] py-16 px-6">
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">내 컨디션 체크(참고용)</h2>
                        <p className="text-gray-500 text-sm">
                            모듈 선택 후 2~3분 문답으로 정리하세요.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Module 1 */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center mb-3">
                                <Activity size={18} className="text-orange-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-sm mb-1">소화 리듬</h3>
                            <p className="text-xs text-gray-500">식후 불편 패턴 체크</p>
                        </div>

                        {/* Module 2 */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
                                <Brain size={18} className="text-blue-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-sm mb-1">인지 리듬</h3>
                            <p className="text-xs text-gray-500">집중·기억 습관 점검</p>
                        </div>

                        {/* Module 3 */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mb-3">
                                <Moon size={18} className="text-indigo-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-sm mb-1">스트레스·수면</h3>
                            <p className="text-xs text-gray-500">수면·피로 리듬 정리</p>
                        </div>

                        {/* Module 4 */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center mb-3">
                                <Heart size={18} className="text-red-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-sm mb-1">혈관·생활습관</h3>
                            <p className="text-xs text-gray-500">운동·식사 습관 체크</p>
                        </div>

                        {/* Module 5 */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow col-span-2">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0">
                                    <Baby size={18} className="text-pink-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm mb-0.5">여성 컨디션</h3>
                                    <p className="text-xs text-gray-500">주기·컨디션 패턴 정리</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#f8fafc] px-6 py-8 text-center border-t border-slate-200">
                <div className="flex items-center justify-center gap-2 text-gray-400 text-xs mb-2">
                    <ShieldCheck size={14} />
                    <span>개인정보 보호 · 안전한 의료 정보 관리</span>
                </div>
                <p className="text-gray-400 text-xs">© 2025 위담한방병원. All rights reserved.</p>
            </footer>
        </div>
    )
}
