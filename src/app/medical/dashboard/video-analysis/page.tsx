"use client";

import { useState, useRef } from "react";
import { Upload, FileImage, Loader2, AlertCircle, Video } from "lucide-react";
import { analyzeMedicalImage } from "@/app/actions/analyze-image";

export default function VideoAnalysisPage() {
    const [modality, setModality] = useState("X-ray");
    const [bodyPart, setBodyPart] = useState("Spine (Lumbar)");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(null);
            setError(null);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(null);
            setError(null);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedFile) return;

        setIsAnalyzing(true);
        setError(null);

        const formData = new FormData();
        formData.append("image", selectedFile);
        formData.append("modality", modality);
        formData.append("bodyPart", bodyPart);

        const response = await analyzeMedicalImage(formData);

        if (response.error) {
            setError(response.error);
        } else {
            setResult(response.data || "No analysis result returned.");
        }

        setIsAnalyzing(false);
    };

    return (
        <div className="h-[calc(100vh-100px)] flex gap-6">
            {/* Left Panel: Input & Settings */}
            <div className="w-1/2 flex flex-col gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <Video className="text-indigo-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">영상 분석 설정</h2>
                            <p className="text-xs text-gray-500">임상/연구용 AI 판독 시스템</p>
                        </div>
                    </div>

                    {/* Selectors */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">모달리티 (Modality)</label>
                            <select
                                value={modality}
                                onChange={(e) => setModality(e.target.value)}
                                className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                            >
                                <option value="X-ray">X-ray</option>
                                <option value="CT">CT</option>
                                <option value="MRI">MRI</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">부위 (Body Part)</label>
                            <select
                                value={bodyPart}
                                onChange={(e) => setBodyPart(e.target.value)}
                                className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                            >
                                <option value="Spine (Cervical)">Spine (Cervical)</option>
                                <option value="Spine (Thoracic)">Spine (Thoracic)</option>
                                <option value="Spine (Lumbar)">Spine (Lumbar)</option>
                                <option value="Shoulder">Shoulder</option>
                                <option value="Knee">Knee</option>
                                <option value="Hip">Hip</option>
                                <option value="Wrist/Hand">Wrist/Hand</option>
                                <option value="Ankle/Foot">Ankle/Foot</option>
                            </select>
                        </div>
                    </div>

                    {/* Upload Area */}
                    <div
                        className={`flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 transition-colors ${previewUrl ? "border-indigo-200 bg-indigo-50/30" : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                            }`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />

                        {previewUrl ? (
                            <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl">
                                <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center group cursor-pointer">
                                    <span className="opacity-0 group-hover:opacity-100 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm">
                                        이미지 변경
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center cursor-pointer">
                                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Upload className="text-indigo-500" size={32} />
                                </div>
                                <h3 className="text-gray-900 font-bold mb-1">영상 이미지를 드래그 혹은 첨부</h3>
                                <p className="text-sm text-gray-500">클릭하거나 파일을 드래그하여 업로드</p>
                                <p className="text-xs text-red-400 mt-2 bg-red-50 px-2 py-1 rounded inline-block">
                                    업로드한 영상이 보여야 함
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleAnalyze}
                        disabled={!selectedFile || isAnalyzing}
                        className={`mt-6 w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${!selectedFile || isAnalyzing
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                            }`}
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                분석 중... (Gemini 1.5 Pro)
                            </>
                        ) : (
                            <>
                                <Video size={20} />
                                영상 분석 시작
                            </>
                        )}
                    </button>
                </div>
            </div>
            <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
            <div>
                <h3 className="font-bold text-sm">분석 오류</h3>
                <p className="text-sm opacity-90">{error}</p>
            </div>
        </div>
    )
}

{
    result ? (
        <div className="prose prose-indigo max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {result}
            </div>
        </div>
    ) : (
        <div className="h-[400px] flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <FileImage size={32} className="text-gray-300" />
            </div>
            <p className="font-medium">영상을 업로드하고 분석을 시작하세요</p>
            <p className="text-sm mt-2 text-center max-w-xs opacity-70">
                Gemini 1.5 Pro가 영상을 분석하여<br />
                주요 소견과 통증 원인을 찾아냅니다.
            </p>
        </div>
    )
}
            </div >
        </div >
    );
}
