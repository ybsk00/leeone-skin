"use client";

import { useState, useEffect } from "react";
import { Calendar, ClipboardList, Pill, Upload, ChevronRight, Clock, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useSession } from "next-auth/react";
import ReservationModal from "@/components/medical/ReservationModal";

type MedicalInfoPanelProps = {
    onOpenSymptomCheck: () => void;
    onOpenMedicationHelper: () => void;
    onOpenFileUpload: () => void;
};

export default function MedicalInfoPanel({
    onOpenSymptomCheck,
    onOpenMedicationHelper,
    onOpenFileUpload
}: MedicalInfoPanelProps) {
    const { data: session } = useSession();
    const [nextAppointment, setNextAppointment] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showReservationModal, setShowReservationModal] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        fetchNextAppointment();
    }, [session]);

    const fetchNextAppointment = async () => {
        if (!session?.user?.id) {
            setIsLoading(false);
            return;
        }

        try {
            const { data } = await supabase
                .from('appointments')
                .select('*')
                .eq('naver_user_id', session.user.id)
                .in('status', ['scheduled', 'pending'])
                .gte('scheduled_at', new Date().toISOString())
                .order('scheduled_at', { ascending: true })
                .limit(1)
                .maybeSingle();

            setNextAppointment(data);
        } catch (error) {
            console.error('Error fetching appointment:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const quickActions = [
        {
            id: 'reservation',
            label: '예약하기',
            icon: Calendar,
            color: 'bg-blue-500',
            onClick: () => setShowReservationModal(true)
        },
        {
            id: 'symptom',
            label: '증상정리',
            icon: ClipboardList,
            color: 'bg-emerald-500',
            onClick: onOpenSymptomCheck
        },
        {
            id: 'medication',
            label: '복약도우미',
            icon: Pill,
            color: 'bg-purple-500',
            onClick: onOpenMedicationHelper
        },
        {
            id: 'upload',
            label: '문서업로드',
            icon: Upload,
            color: 'bg-orange-500',
            onClick: onOpenFileUpload
        }
    ];

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
        return `${month}/${day}(${weekday}) ${hours}:${minutes}`;
    };

    return (
        <>
            <div className="bg-gradient-to-br from-traditional-primary/10 via-white to-traditional-secondary/10 rounded-3xl p-6 mb-6 shadow-lg border border-traditional-muted/20">
                {/* 다음 예약 카드 */}
                <div className="mb-6">
                    {isLoading ? (
                        <div className="bg-white/80 rounded-2xl p-4 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                            <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                        </div>
                    ) : nextAppointment ? (
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-traditional-primary/20 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-traditional-primary/10 flex items-center justify-center">
                                        <Calendar className="w-6 h-6 text-traditional-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-traditional-subtext font-medium">다음 예약</p>
                                        <p className="text-lg font-bold text-traditional-text">
                                            {formatDate(nextAppointment.scheduled_at)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowReservationModal(true)}
                                    className="px-4 py-2 text-sm font-medium text-traditional-primary hover:bg-traditional-primary/10 rounded-full transition-colors"
                                >
                                    관리
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-dashed border-traditional-muted">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                        <Calendar className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">예약된 일정이 없습니다</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowReservationModal(true)}
                                    className="px-4 py-2 text-sm font-medium bg-traditional-primary text-white rounded-full hover:bg-traditional-accent transition-colors shadow-md"
                                >
                                    예약하기
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 퀵액션 4버튼 */}
                <div className="grid grid-cols-4 gap-3">
                    {quickActions.map((action) => (
                        <button
                            key={action.id}
                            onClick={action.onClick}
                            className="flex flex-col items-center gap-2 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                                <action.icon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xs font-medium text-traditional-text whitespace-nowrap">{action.label}</span>
                        </button>
                    ))}
                </div>

                {/* 안내 메시지 */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-traditional-subtext">
                        아래 채팅에서 AI 건강 상담을 시작하세요 🌿
                    </p>
                </div>
            </div>

            <ReservationModal
                isOpen={showReservationModal}
                onClose={() => setShowReservationModal(false)}
            />
        </>
    );
}
