"use client";

import PatientHeader from "@/components/medical/PatientHeader";
import { Activity, Calendar, MessageSquare, CheckCircle, Circle, Clock, ChevronRight, Send } from "lucide-react";

export default function PatientDashboard() {
    return (
        <div className="min-h-screen bg-traditional-bg font-sans selection:bg-traditional-accent selection:text-white">
            <PatientHeader />

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
                {/* Top Row: Condition & Appointment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Condition Card */}
                    <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-lg border border-white/50 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-traditional-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                        <h2 className="text-xl font-bold text-traditional-text mb-6 font-serif">오늘의 컨디션</h2>
                        <div className="flex items-end gap-2 mb-2">
                            <span className="text-sm font-medium text-traditional-primary">리듬 지표</span>
                        </div>
                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-6xl font-bold text-traditional-text font-serif">42</span>
                            <span className="text-2xl text-traditional-subtext/60">/100</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="px-3 py-1 bg-traditional-primary/10 text-traditional-primary rounded-full text-sm font-medium border border-traditional-primary/20">회복력 저하</span>
                            <span className="px-3 py-1 bg-traditional-primary/10 text-traditional-primary rounded-full text-sm font-medium border border-traditional-primary/20">수면 리듬 불안정</span>
                            <span className="px-3 py-1 bg-traditional-primary/10 text-traditional-primary rounded-full text-sm font-medium border border-traditional-primary/20">스트레스 과부하</span>
                        </div>

                        {/* Graphic Placeholder */}
                        <div className="absolute top-8 right-8 w-32 h-32 bg-traditional-accent/10 rounded-full flex items-center justify-center text-traditional-accent border border-traditional-accent/20">
                            <Activity size={48} className="animate-pulse" />
                        </div>
                    </div>

                    {/* Appointment Card */}
                    <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-lg border border-white/50 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                        <h2 className="text-xl font-bold text-traditional-text mb-6 font-serif">다음 예약 안내</h2>
                        <div className="space-y-1 mb-6 relative z-10">
                            <p className="text-2xl font-bold text-traditional-text font-serif">12.08 (금) 오후 2:30</p>
                            <p className="text-traditional-primary font-medium">정기 침구치료</p>
                        </div>
                        <button className="relative z-10 px-5 py-2.5 bg-traditional-primary text-white rounded-xl text-sm font-bold hover:bg-traditional-accent transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                            예약 변경
                        </button>

                        {/* Image Placeholder */}
                        <div className="absolute top-0 right-0 w-1/2 h-full mask-linear-fade-left opacity-80">
                            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop')] bg-cover bg-center mix-blend-multiply grayscale-[30%] sepia-[20%]"></div>
                        </div>
                    </div>
                </div>

                {/* Middle Row: Chat & History */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Chat Snippet */}
                    <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/50 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-traditional-text font-serif">오늘의 대화 · AI 헬스케어 챗</h2>
                                <p className="text-sm text-traditional-primary">AI 헬스케어 상담 · 메디컬 모드</p>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4 mb-4 bg-white/40 rounded-2xl p-4 border border-white/50">
                            {/* AI Bubble */}
                            <div className="flex gap-3">
                                <div className="w-8 h-8 bg-traditional-primary rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                                    <Activity size={16} />
                                </div>
                                <div className="bg-white p-4 rounded-2xl rounded-tl-none text-sm text-traditional-text max-w-[80%] shadow-sm border border-traditional-muted/30">
                                    지난번 처방을 드린 후 소화는 조금 나아지셨다고 하셨는데, 요즘은 식후 더부룩함과 속쓰림은 어떤가요?
                                </div>
                            </div>
                            {/* User Bubble */}
                            <div className="flex gap-3 flex-row-reverse">
                                <div className="w-8 h-8 bg-traditional-accent rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                                    <span className="text-xs font-bold">나</span>
                                </div>
                                <div className="bg-traditional-primary/10 p-4 rounded-2xl rounded-tr-none text-sm text-traditional-text max-w-[80%] border border-traditional-primary/20">
                                    더부룩함은 줄었는데 매운 걸 먹으면 아직 쓰려요.
                                </div>
                            </div>
                            {/* AI Bubble */}
                            <div className="flex gap-3">
                                <div className="w-8 h-8 bg-traditional-primary rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                                    <Activity size={16} />
                                </div>
                                <div className="bg-white p-4 rounded-2xl rounded-tl-none text-sm text-traditional-text max-w-[80%] shadow-sm border border-traditional-muted/30">
                                    회복 중인 시기라 자극적인 음식에 예민할 수 있어요. 오늘 점심은 부드러운 식단을 추천드리고, 통증이 계속되면 꼭 진료 때 말씀해 주세요.
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="현재 상태나 궁금한 점을 적어주세요..."
                                className="w-full bg-white/80 border border-traditional-muted/50 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-traditional-accent/50 focus:border-traditional-accent transition-all shadow-inner"
                            />
                            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-traditional-subtext hover:text-traditional-primary transition-colors">
                                <Send size={18} />
                            </button>
                        </div>
                        <p className="text-[10px] text-traditional-subtext/60 mt-2 text-center">AI는 진단·치료를 대신하지 않으며, 진료 전 상태 정리와 생활 안내를 돕기 위한 도구입니다.</p>
                    </div>

                    {/* History Timeline */}
                    <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/50">
                        <h2 className="text-lg font-bold text-traditional-text mb-6 font-serif">최근 히스토리 타임라인</h2>
                        <div className="space-y-6 relative pl-2">
                            {/* Vertical Line */}
                            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-traditional-muted/30"></div>

                            {[
                                { date: "12.01 (금)", title: "초진 및 한약 처방 (15일분)", active: true },
                                { date: "11.28 (화)", title: "AI 헬스케어 자가진단 - 소화/수면", active: false },
                                { date: "11.20 (월)", title: "웹사이트 회원가입", active: false },
                            ].map((item, idx) => (
                                <div key={idx} className="relative flex gap-4 items-start group">
                                    <div className={`w-6 h-6 rounded-full border-4 flex-shrink-0 z-10 bg-white transition-colors ${item.active ? 'border-traditional-primary' : 'border-traditional-muted'}`}>
                                        {item.active && <div className="w-2 h-2 bg-traditional-primary rounded-full m-1"></div>}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-traditional-text font-serif">{item.date}</p>
                                        <p className={`text-sm transition-colors ${item.active ? 'text-traditional-primary font-medium' : 'text-traditional-subtext group-hover:text-traditional-text'}`}>{item.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Missions */}
                <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-lg border border-white/50">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-traditional-text font-serif">오늘의 생활 미션</h2>
                        <span className="text-traditional-primary font-bold text-sm bg-traditional-primary/10 px-3 py-1 rounded-full border border-traditional-primary/20">1/3 달성</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-traditional-primary/5 border border-traditional-primary/20 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer">
                            <div className="w-6 h-6 bg-traditional-primary rounded-full flex items-center justify-center text-white shadow-sm">
                                <CheckCircle size={16} />
                            </div>
                            <span className="font-bold text-traditional-text text-sm">따뜻한 물 한 잔 마시기</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-white/50 border border-traditional-muted/30 rounded-xl hover:bg-white/80 transition-all cursor-pointer">
                            <div className="w-6 h-6 border-2 border-traditional-muted rounded-full"></div>
                            <span className="font-medium text-traditional-subtext text-sm">저녁 8시 이후 금식</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-white/50 border border-traditional-muted/30 rounded-xl hover:bg-white/80 transition-all cursor-pointer">
                            <div className="w-6 h-6 border-2 border-traditional-muted rounded-full"></div>
                            <span className="font-medium text-traditional-subtext text-sm">20분 가볍게 걷기</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
