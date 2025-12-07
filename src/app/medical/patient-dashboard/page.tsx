"use client";

import { useState, Suspense } from "react";
import { Calendar, Clock, MoreHorizontal, Send } from "lucide-react";
import ChatInterface from "@/components/chat/ChatInterface";
import PatientHeader from "@/components/medical/PatientHeader";
import ReservationModal from "@/components/medical/ReservationModal";

export default function PatientDashboard() {
    const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);

    // Mock appointment data
    // Mock appointment data (Empty or Generic)
    const appointment = {
        date: "예약 없음",
        time: "",
        type: "예정된 진료가 없습니다.",
        doctor: ""
    };

    return (
        <div className="min-h-screen bg-traditional-bg font-sans selection:bg-traditional-accent selection:text-white">
            <PatientHeader />

            <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">

                {/* Header / Appointment Card */}
                <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50 flex flex-col md:flex-row justify-between items-center gap-4 transition-all hover:shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-sm ${appointment.date === "예약 없음" ? "bg-traditional-muted/20 text-traditional-subtext" : "bg-traditional-primary/10 text-traditional-primary"}`}>
                            <Calendar size={24} />
                        </div>
                        <div>
                            <h2 className="text-sm text-traditional-subtext font-medium mb-1">다음 예약 안내</h2>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-xl font-bold font-serif ${appointment.date === "예약 없음" ? "text-traditional-subtext/60" : "text-traditional-text"}`}>{appointment.date}</span>
                                {appointment.time && <span className="text-xl font-bold text-traditional-text font-serif">{appointment.time}</span>}
                            </div>
                            <p className={`${appointment.date === "예약 없음" ? "text-traditional-subtext/60" : "text-traditional-primary"} text-sm font-medium mt-1`}>{appointment.type}</p>
                        </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <button
                            onClick={() => setIsReservationModalOpen(true)}
                            className="flex-1 md:flex-none px-6 py-2.5 bg-traditional-bg text-traditional-subtext border border-traditional-muted/50 rounded-xl text-sm font-medium hover:bg-traditional-muted/20 hover:text-traditional-text transition-all shadow-sm"
                        >
                            예약관리
                        </button>
                    </div>
                </div>

                <ReservationModal
                    isOpen={isReservationModalOpen}
                    onClose={() => setIsReservationModalOpen(false)}
                />

                {/* Main Chat Interface Area */}
                <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden h-[650px] flex flex-col">
                    <div className="p-5 border-b border-traditional-muted/20 flex justify-between items-center bg-white/40">
                        <div>
                            <h3 className="font-bold text-traditional-text font-serif text-lg">예진 상담 (Medical Chat)</h3>
                            <p className="text-xs text-traditional-primary font-medium flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-traditional-primary rounded-full animate-pulse"></span>
                                전문의 감독 하에 운영
                            </p>
                        </div>
                        <button className="text-traditional-subtext hover:text-traditional-text p-2 hover:bg-traditional-bg rounded-full transition-colors">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-hidden">
                        <Suspense fallback={<div className="flex items-center justify-center h-full text-traditional-subtext">Loading...</div>}>
                            <ChatInterface isEmbedded={true} isLoggedIn={true} />
                        </Suspense>
                    </div>
                </div>

            </div>
        </div>
    );
}
