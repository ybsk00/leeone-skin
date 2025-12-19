"use client";

import { AlertCircle } from "lucide-react";

export default function SafetyBadge() {
    return (
        <div className="bg-amber-50/80 backdrop-blur-sm border border-amber-200 rounded-xl px-4 py-3 mb-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
                <p className="text-xs text-amber-800 font-medium">
                    본 서비스는 <span className="font-bold">진단/처방이 아닌</span> 생활/문진 정리 도움입니다.
                </p>
                <p className="text-xs text-amber-600 mt-1">
                    응급 상황 시 <a href="tel:119" className="underline font-medium">119</a> 또는 가까운 응급실을 이용해주세요.
                </p>
            </div>
        </div>
    );
}
