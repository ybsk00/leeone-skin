'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bell, CalendarCheck, Calendar, Sparkles, ArrowRight, RefreshCw } from 'lucide-react'

type Appointment = {
    id: string
    scheduled_at: string
    status: string
    notes?: string
    doctor_name?: string
    type?: string
}

export default function AppointmentListPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(true)
    const [confirming, setConfirming] = useState<string | null>(null)

    useEffect(() => {
        fetchAppointments()
    }, [])

    const fetchAppointments = async () => {
        try {
            const res = await fetch('/api/patient/appointments/list')
            const data = await res.json()
            if (data.appointments) {
                setAppointments(data.appointments)
            }
        } catch (error) {
            console.error('Failed to fetch appointments:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleConfirm = async (appointmentId: string) => {
        setConfirming(appointmentId)
        try {
            const res = await fetch('/api/patient/appointments/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appointment_id: appointmentId, status: 'confirmed' })
            })
            const data = await res.json()
            if (data.success) {
                await fetchAppointments()
                alert('방문이 확정되었습니다!')
            } else {
                alert(data.error || '확정에 실패했습니다.')
            }
        } catch (error) {
            console.error('Confirm error:', error)
            alert('오류가 발생했습니다.')
        } finally {
            setConfirming(null)
        }
    }

    // Next appointment for display
    const nextAppointment = appointments.find(a => new Date(a.scheduled_at) >= new Date()) || {
        id: '',
        scheduled_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        notes: 'AI한의원 진료'
    }

    const getDaysUntil = (dateStr: string) => {
        const date = new Date(dateStr)
        const today = new Date()
        const diff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        return diff
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0f1a' }}>
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen pb-24" style={{ backgroundColor: '#0a0f1a' }}>
            <div className="max-w-lg mx-auto px-4 pt-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-white">내 예약</h1>
                    <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors">
                        <Bell size={24} className="text-gray-400" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                </div>

                {/* Tab Control */}
                <div
                    className="flex p-1 rounded-full mb-6"
                    style={{ backgroundColor: '#1f2937' }}
                >
                    <button className="flex-1 py-2.5 px-4 text-sm font-medium text-white rounded-full" style={{ backgroundColor: '#374151' }}>
                        예정된 예약
                    </button>
                    <Link href="/patient/history" className="flex-1 py-2.5 px-4 text-sm font-medium text-gray-400 hover:text-gray-300 transition-colors text-center">
                        이전 내역
                    </Link>
                </div>

                {/* Next Visit Card */}
                {nextAppointment.id && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-white mb-4">다음 방문 일정</h2>
                        <div
                            className="relative rounded-2xl overflow-hidden p-5"
                            style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)' }}
                        >
                            {/* D-Day Badge */}
                            <span className="inline-block px-3 py-1 text-xs font-bold text-white bg-black/40 rounded-lg mb-4">
                                D-{getDaysUntil(nextAppointment.scheduled_at)}
                            </span>
                            <span className="ml-2 text-sm text-gray-300">
                                {nextAppointment.status === 'confirmed' ? '방문 확정됨' : '예약확인 대기 중'}
                            </span>

                            <div className="flex items-center justify-between mt-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">
                                        {nextAppointment.notes || 'AI한의원 진료'}
                                    </h3>
                                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                                        <Calendar size={16} />
                                        <span>
                                            {new Date(nextAppointment.scheduled_at).toLocaleDateString('ko-KR', {
                                                year: 'numeric', month: 'long', day: 'numeric', weekday: 'short'
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-blue-300 text-sm mt-1">
                                        <span className="w-4 h-4 rounded-full bg-blue-500/30 flex items-center justify-center">
                                            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                        </span>
                                        <span>
                                            {new Date(nextAppointment.scheduled_at).toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-14 h-14 rounded-full bg-gray-600/50 flex items-center justify-center">
                                    <span className="text-2xl">🏥</span>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                {nextAppointment.status !== 'confirmed' ? (
                                    <button
                                        onClick={() => handleConfirm(nextAppointment.id)}
                                        disabled={confirming === nextAppointment.id}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-white disabled:opacity-50 transition-all"
                                        style={{ backgroundColor: '#3b82f6' }}
                                    >
                                        <CalendarCheck size={18} />
                                        {confirming === nextAppointment.id ? '확정 중...' : '방문 확정하기'}
                                    </button>
                                ) : (
                                    <div
                                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-green-400"
                                        style={{ backgroundColor: '#10b98120' }}
                                    >
                                        <CalendarCheck size={18} />
                                        방문 확정됨
                                    </div>
                                )}
                                <Link
                                    href="/patient/appointments/new"
                                    className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-gray-600/50 transition-colors"
                                    style={{ backgroundColor: '#374151' }}
                                >
                                    <Calendar size={20} className="text-gray-300" />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* AI Health Alert */}
                <div
                    className="p-4 rounded-2xl flex items-start gap-4 mb-6"
                    style={{ backgroundColor: '#1a2332', border: '1px solid #1f2937' }}
                >
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                    >
                        <Sparkles size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-bold text-white mb-1">AI 건강 알림</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            정기 검진을 통해 건강을 관리해보세요.
                            <span className="text-blue-400 font-bold"> 추천 검진일</span>이 다가오고 있습니다.
                        </p>
                        <Link
                            href="/patient/appointments/new"
                            className="inline-flex items-center gap-1 mt-2 text-sm text-blue-400 hover:text-blue-300 font-medium"
                        >
                            예약하러 가기 <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>

                {/* Upcoming Schedule */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-white">이후 일정</h2>
                        <Link href="/patient/history" className="text-sm text-blue-400 hover:text-blue-300">
                            전체보기
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {appointments.filter(a => a.id !== nextAppointment.id && new Date(a.scheduled_at) >= new Date()).length > 0 ?
                            appointments
                                .filter(a => a.id !== nextAppointment.id && new Date(a.scheduled_at) >= new Date())
                                .slice(0, 3)
                                .map((apt) => (
                                    <div
                                        key={apt.id}
                                        className="p-4 rounded-2xl flex items-center gap-4"
                                        style={{ backgroundColor: '#1a2332', border: '1px solid #1f2937' }}
                                    >
                                        <div
                                            className="flex flex-col items-center justify-center w-14 h-16 rounded-xl"
                                            style={{ backgroundColor: '#111827' }}
                                        >
                                            <span className="text-xs text-gray-400">
                                                {new Date(apt.scheduled_at).toLocaleDateString('ko-KR', { month: 'numeric' })}월
                                            </span>
                                            <span className="text-xl font-bold text-white">
                                                {new Date(apt.scheduled_at).getDate()}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-white font-bold">{apt.notes || '진료 예약'}</h4>
                                            <p className="text-sm text-gray-400">
                                                {new Date(apt.scheduled_at).toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-medium rounded-lg ${apt.status === 'confirmed'
                                                ? 'text-green-400 bg-green-500/20'
                                                : 'text-blue-400 bg-blue-500/20'
                                            }`}>
                                            {apt.status === 'confirmed' ? '확정' : '대기'}
                                        </span>
                                    </div>
                                )) : (
                                <div
                                    className="p-6 rounded-2xl text-center"
                                    style={{ backgroundColor: '#1a2332', border: '1px solid #1f2937' }}
                                >
                                    <p className="text-gray-400">추가 예약이 없습니다.</p>
                                    <Link
                                        href="/patient/appointments/new"
                                        className="inline-block mt-3 text-sm text-blue-400 hover:text-blue-300"
                                    >
                                        새 예약 만들기 →
                                    </Link>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    )
}
