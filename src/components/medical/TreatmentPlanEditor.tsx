"use client";

import { useState } from "react";
import { Save, Plus, Trash2, Calendar, Clock } from "lucide-react";

type TreatmentItem = {
    id: string;
    type: "침치료" | "약침" | "한약" | "물리치료" | "생활관리";
    description: string;
    frequency: string; // e.g., "주 2회", "매일"
    duration: string; // e.g., "4주", "3일"
};

export default function TreatmentPlanEditor() {
    const [items, setItems] = useState<TreatmentItem[]>([
        { id: "1", type: "침치료", description: "경추 및 어깨 근육 이완", frequency: "주 2회", duration: "4주" },
        { id: "2", type: "한약", description: "갈근탕 가감 (근육 긴장 완화)", frequency: "매일 3회", duration: "7일" }
    ]);

    const addItem = () => {
        const newItem: TreatmentItem = {
            id: Date.now().toString(),
            type: "침치료",
            description: "",
            frequency: "",
            duration: ""
        };
        setItems([...items, newItem]);
    };

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const updateItem = (id: string, field: keyof TreatmentItem, value: string) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FileTextIcon /> 치료 계획 (Treatment Plan)
                </h2>
                <button
                    onClick={() => alert("저장되었습니다 (Mock)")}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    <Save size={16} /> 저장하기
                </button>
            </div>

            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.id} className="flex gap-3 items-start p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                            <select
                                value={item.type}
                                onChange={(e) => updateItem(item.id, "type", e.target.value)}
                                className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="침치료">침치료</option>
                                <option value="약침">약침</option>
                                <option value="한약">한약</option>
                                <option value="물리치료">물리치료</option>
                                <option value="생활관리">생활관리</option>
                            </select>
                            <input
                                type="text"
                                value={item.description}
                                onChange={(e) => updateItem(item.id, "description", e.target.value)}
                                placeholder="상세 내용 (예: 경추 이완)"
                                className="md:col-span-3 p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <div className="flex items-center gap-2 md:col-span-2">
                                <Calendar size={16} className="text-gray-400" />
                                <input
                                    type="text"
                                    value={item.frequency}
                                    onChange={(e) => updateItem(item.id, "frequency", e.target.value)}
                                    placeholder="빈도 (예: 주 2회)"
                                    className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-2 md:col-span-2">
                                <Clock size={16} className="text-gray-400" />
                                <input
                                    type="text"
                                    value={item.duration}
                                    onChange={(e) => updateItem(item.id, "duration", e.target.value)}
                                    placeholder="기간 (예: 4주)"
                                    className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                        <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={addItem}
                className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 font-medium"
            >
                <Plus size={18} /> 항목 추가
            </button>
        </div>
    );
}

function FileTextIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" x2="8" y1="13" y2="13" />
            <line x1="16" x2="8" y1="17" y2="17" />
            <line x1="10" x2="8" y1="9" y2="9" />
        </svg>
    );
}
