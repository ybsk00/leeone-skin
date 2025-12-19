"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, ChevronRight, ChevronLeft, AlertTriangle, CheckCircle, ClipboardList } from "lucide-react";

type SymptomCheckModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onComplete?: (summary: string) => void;
};

const SYMPTOM_CATEGORIES = [
    { id: 'digestion', label: '소화', icon: '🍽️' },
    { id: 'pain', label: '통증·재활', icon: '💪' },
    { id: 'immune', label: '면역', icon: '🛡️' },
    { id: 'women', label: '여성건강', icon: '🌸' },
    { id: 'cognitive', label: '인지·수면', icon: '🧠' },
    { id: 'other', label: '기타', icon: '📋' }
];

const RED_FLAGS = [
    { id: 'chest_pain', label: '가슴 통증/압박감' },
    { id: 'breathing', label: '심한 호흡곤란' },
    { id: 'paralysis', label: '갑작스러운 마비/감각이상' },
    { id: 'consciousness', label: '의식 저하/혼란' },
    { id: 'bleeding', label: '심한 출혈' },
    { id: 'high_fever', label: '3일 이상 고열 (39°C 이상)' }
];

export default function SymptomCheckModal({ isOpen, onClose, onComplete }: SymptomCheckModalProps) {
    const [step, setStep] = useState(1);
    const [category, setCategory] = useState('');
    const [startTime, setStartTime] = useState('');
    const [intensity, setIntensity] = useState(5);
    const [triggers, setTriggers] = useState('');
    const [accompanying, setAccompanying] = useState('');
    const [redFlags, setRedFlags] = useState<string[]>([]);
    const [showEmergencyWarning, setShowEmergencyWarning] = useState(false);
    const [summary, setSummary] = useState('');

    const totalSteps = 6;

    const handleRedFlagChange = (flagId: string) => {
        setRedFlags(prev =>
            prev.includes(flagId)
                ? prev.filter(f => f !== flagId)
                : [...prev, flagId]
        );
    };

    const generateSummary = () => {
        const categoryLabel = SYMPTOM_CATEGORIES.find(c => c.id === category)?.label || category;
        const selectedRedFlags = RED_FLAGS.filter(f => redFlags.includes(f.id)).map(f => f.label);

        let summaryText = `## 증상 정리 요약\n\n`;
        summaryText += `**증상 범주**: ${categoryLabel}\n\n`;
        summaryText += `**시작 시점**: ${startTime}\n\n`;
        summaryText += `**강도**: ${intensity}/10\n\n`;
        summaryText += `**악화/완화 요인**: ${triggers || '미입력'}\n\n`;
        summaryText += `**동반 증상**: ${accompanying || '미입력'}\n\n`;

        if (selectedRedFlags.length > 0) {
            summaryText += `**⚠️ 주의 증상**: ${selectedRedFlags.join(', ')}\n\n`;
        }

        summaryText += `---\n\n`;
        summaryText += `### 의사 상담 시 추가로 확인해볼 사항\n\n`;
        summaryText += `1. 증상의 정확한 위치와 양상\n`;
        summaryText += `2. 과거 유사 증상 경험 여부\n`;
        summaryText += `3. 현재 복용 중인 약물\n\n`;
        summaryText += `> 💡 이 정리는 진단이 아닌 **상담 시 참고용**입니다.`;

        return summaryText;
    };

    const handleComplete = () => {
        const generatedSummary = generateSummary();
        setSummary(generatedSummary);

        if (redFlags.length > 0) {
            setShowEmergencyWarning(true);
        } else {
            setStep(7); // Summary step
        }

        onComplete?.(generatedSummary);
    };

    const handleNext = () => {
        if (step === 6) {
            handleComplete();
        } else {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const resetAndClose = () => {
        setStep(1);
        setCategory('');
        setStartTime('');
        setIntensity(5);
        setTriggers('');
        setAccompanying('');
        setRedFlags([]);
        setShowEmergencyWarning(false);
        setSummary('');
        onClose();
    };

    if (!isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-emerald-50 p-4 flex justify-between items-center border-b border-emerald-100">
                    <div className="flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-emerald-600" />
                        <h3 className="font-bold text-lg text-gray-900">증상 정리</h3>
                    </div>
                    <button onClick={resetAndClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Progress */}
                {step <= 6 && (
                    <div className="px-4 pt-4">
                        <div className="flex gap-1">
                            {Array.from({ length: totalSteps }).map((_, i) => (
                                <div key={i} className={`h-1 flex-1 rounded-full ${i < step ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">단계 {step}/{totalSteps}</p>
                    </div>
                )}

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {showEmergencyWarning ? (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle size={32} />
                            </div>
                            <h4 className="text-xl font-bold text-red-600 mb-2">주의가 필요한 증상 감지</h4>
                            <p className="text-gray-600 mb-4">
                                선택하신 증상 중 응급 상황일 수 있는 항목이 있습니다.
                            </p>
                            <div className="bg-red-50 p-4 rounded-xl border border-red-200 mb-4 text-left">
                                <p className="text-sm text-red-800 font-medium mb-2">해당 증상:</p>
                                <ul className="text-sm text-red-700 space-y-1">
                                    {redFlags.map(flagId => {
                                        const flag = RED_FLAGS.find(f => f.id === flagId);
                                        return <li key={flagId}>• {flag?.label}</li>;
                                    })}
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <button
                                    onClick={() => window.location.href = 'tel:119'}
                                    className="w-full py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                                >
                                    119 응급 연락
                                </button>
                                <button
                                    onClick={() => { setShowEmergencyWarning(false); setStep(7); }}
                                    className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                                >
                                    비응급 상황입니다
                                </button>
                            </div>
                        </div>
                    ) : step === 1 ? (
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-gray-900">어떤 증상이 불편하신가요?</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {SYMPTOM_CATEGORIES.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setCategory(cat.id)}
                                        className={`p-4 rounded-xl border-2 transition-all ${category === cat.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-200'}`}
                                    >
                                        <span className="text-2xl block mb-2">{cat.icon}</span>
                                        <span className="text-sm font-medium text-gray-700">{cat.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : step === 2 ? (
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-gray-900">언제부터 불편하셨나요?</h4>
                            <div className="space-y-2">
                                {['오늘부터', '2~3일 전부터', '1주일 전부터', '1개월 이상'].map(option => (
                                    <button
                                        key={option}
                                        onClick={() => setStartTime(option)}
                                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${startTime === option ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-200'}`}
                                    >
                                        <span className="font-medium text-gray-700">{option}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : step === 3 ? (
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-gray-900">불편함의 강도는?</h4>
                            <p className="text-sm text-gray-500">0: 거의 없음 ~ 10: 매우 심함</p>
                            <div className="py-4">
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    value={intensity}
                                    onChange={(e) => setIntensity(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-2">
                                    <span>0</span>
                                    <span className="text-2xl font-bold text-emerald-600">{intensity}</span>
                                    <span>10</span>
                                </div>
                            </div>
                        </div>
                    ) : step === 4 ? (
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-gray-900">악화/완화 요인</h4>
                            <p className="text-sm text-gray-500">어떨 때 더 심해지거나 나아지나요?</p>
                            <textarea
                                value={triggers}
                                onChange={(e) => setTriggers(e.target.value)}
                                placeholder="예: 식후에 더 심해지고, 누우면 좀 나아져요"
                                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none resize-none h-32"
                            />
                        </div>
                    ) : step === 5 ? (
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-gray-900">동반 증상</h4>
                            <p className="text-sm text-gray-500">다른 불편한 증상이 있나요?</p>
                            <textarea
                                value={accompanying}
                                onChange={(e) => setAccompanying(e.target.value)}
                                placeholder="예: 두통, 피로감, 식욕저하 등"
                                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none resize-none h-32"
                            />
                        </div>
                    ) : step === 6 ? (
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-gray-900">⚠️ 주의 증상 체크</h4>
                            <p className="text-sm text-gray-500">아래 증상 중 해당하는 것이 있나요?</p>
                            <div className="space-y-2">
                                {RED_FLAGS.map(flag => (
                                    <button
                                        key={flag.id}
                                        onClick={() => handleRedFlagChange(flag.id)}
                                        className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${redFlags.includes(flag.id) ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-200'}`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${redFlags.includes(flag.id) ? 'border-red-500 bg-red-500' : 'border-gray-300'}`}>
                                            {redFlags.includes(flag.id) && <CheckCircle className="w-4 h-4 text-white" />}
                                        </div>
                                        <span className="font-medium text-gray-700">{flag.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : step === 7 ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle className="w-6 h-6 text-emerald-500" />
                                <h4 className="text-lg font-bold text-gray-900">증상 정리 완료</h4>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm text-gray-700 whitespace-pre-wrap">
                                {summary.replace(/##/g, '').replace(/\*\*/g, '').replace(/>/g, '')}
                            </div>
                            <button
                                onClick={resetAndClose}
                                className="w-full py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors"
                            >
                                확인
                            </button>
                        </div>
                    ) : null}
                </div>

                {/* Footer */}
                {step <= 6 && !showEmergencyWarning && (
                    <div className="p-4 border-t border-gray-100">
                        <div className="flex gap-3">
                            {step > 1 && (
                                <button
                                    onClick={handleBack}
                                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <ChevronLeft size={18} /> 이전
                                </button>
                            )}
                            <button
                                onClick={handleNext}
                                disabled={(step === 1 && !category) || (step === 2 && !startTime)}
                                className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {step === 6 ? '완료' : '다음'} <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    if (typeof document !== 'undefined') {
        return createPortal(modalContent, document.body);
    }
    return modalContent;
}
