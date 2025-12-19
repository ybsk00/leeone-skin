"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Pill, Camera, AlertCircle, Clock, Sun, Moon, Utensils } from "lucide-react";

type MedicationModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function MedicationModal({ isOpen, onClose }: MedicationModalProps) {
    const [step, setStep] = useState<'upload' | 'result'>('upload');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleUpload = () => {
        setIsProcessing(true);
        // Simulate processing
        setTimeout(() => {
            setIsProcessing(false);
            setStep('result');
        }, 2000);
    };

    const resetAndClose = () => {
        setStep('upload');
        setIsProcessing(false);
        onClose();
    };

    if (!isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-purple-50 p-4 flex justify-between items-center border-b border-purple-100">
                    <div className="flex items-center gap-2">
                        <Pill className="w-5 h-5 text-purple-600" />
                        <h3 className="font-bold text-lg text-gray-900">복약 도우미</h3>
                    </div>
                    <button onClick={resetAndClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {step === 'upload' ? (
                        <div className="space-y-4">
                            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                                <p className="text-sm text-purple-800">
                                    <strong>약봉지</strong> 또는 <strong>처방전</strong> 사진을 업로드하면<br />
                                    복용 방법을 안내해드립니다.
                                </p>
                            </div>

                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-300 transition-colors cursor-pointer"
                                onClick={handleUpload}
                            >
                                {isProcessing ? (
                                    <div className="animate-pulse">
                                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Pill className="w-8 h-8 text-purple-500 animate-spin" />
                                        </div>
                                        <p className="text-sm text-purple-600 font-medium">분석 중...</p>
                                    </div>
                                ) : (
                                    <>
                                        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-sm text-gray-600 font-medium mb-1">
                                            사진을 촬영하거나 선택하세요
                                        </p>
                                        <p className="text-xs text-gray-400">약봉지, 처방전, 약 포장지</p>
                                    </>
                                )}
                            </div>

                            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-800">
                                    이 기능은 <strong>일반적인 복용 안내</strong>를 제공합니다.<br />
                                    정확한 복용법은 처방 의사/약사와 상담하세요.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                                <p className="text-sm text-green-800 font-medium mb-2">✅ 분석 완료</p>
                                <p className="text-xs text-green-700">아래는 일반적인 복용 안내입니다.</p>
                            </div>

                            {/* Sample medication info */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
                                <h4 className="font-bold text-gray-900">복용 안내 (예시)</h4>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                            <Sun className="w-5 h-5 text-yellow-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">아침</p>
                                            <p className="text-xs text-gray-500">식후 30분</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                            <Utensils className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">점심</p>
                                            <p className="text-xs text-gray-500">식후 30분</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                            <Moon className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">저녁</p>
                                            <p className="text-xs text-gray-500">식후 30분</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">⚠️ 주의사항</p>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                        <li>• 공복에 복용 시 위장 장애가 있을 수 있습니다</li>
                                        <li>• 음주를 삼가해주세요</li>
                                        <li>• 졸음이 올 수 있으니 운전에 주의하세요</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <p className="text-xs text-blue-800">
                                    💡 <strong>궁금한 점</strong>은 처방 의사 또는 약사에게 문의하세요.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={resetAndClose}
                        className="w-full py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors"
                    >
                        {step === 'upload' ? '닫기' : '확인'}
                    </button>
                </div>
            </div>
        </div>
    );

    if (typeof document !== 'undefined') {
        return createPortal(modalContent, document.body);
    }
    return modalContent;
}
