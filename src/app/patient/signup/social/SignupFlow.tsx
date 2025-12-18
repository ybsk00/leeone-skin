'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { completeSocialSignup } from '../../login/actions'
import { User, Phone, Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function SignupFlow({ email, name: initialName }: { email: string, name: string }) {
    const router = useRouter()
    const [step, setStep] = useState(1) // 1: Info Popup, 2: Form, 3: Welcome
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true)
        setError(null)
        const result = await completeSocialSignup(formData)
        setIsLoading(false)

        if (result.error) {
            setError(result.error)
        } else {
            setStep(3)
        }
    }

    if (step === 1) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">가입된 회원 정보가 없어요</h3>
                    <p className="text-gray-500 text-sm mb-6">회원가입 페이지로 이동해서<br />나머지 정보를 입력해주세요.</p>
                    <button
                        onClick={() => setStep(2)}
                        className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors"
                    >
                        확인
                    </button>
                </div>
            </div>
        )
    }

    if (step === 3) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">환영해요!</h3>
                    <p className="text-gray-500 text-sm mb-6">회원가입이 완료되었습니다.<br />홈 화면으로 이동할게요.</p>
                    <button
                        onClick={() => router.push('/patient')}
                        className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors"
                    >
                        확인
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0a0f1a' }}>
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white">SNS 아이디로 회원가입</h1>
                    <p className="text-gray-400 text-sm mt-1">추가 정보를 입력해주세요</p>
                </div>

                <div className="rounded-2xl p-6" style={{ backgroundColor: '#1a2332', border: '1px solid #1f2937' }}>
                    {error && (
                        <div className="flex items-center gap-3 p-3 rounded-xl mb-4 bg-red-500/10 border border-red-500/30">
                            <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}

                    <form action={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">이름</label>
                            <div className="relative">
                                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={initialName}
                                    placeholder="홍길동"
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 border-gray-700"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">전화번호</label>
                            <div className="relative">
                                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="010-0000-0000"
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 border-gray-700"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">이메일</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    readOnly
                                    className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-400 bg-gray-800 border-gray-700 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 rounded-xl text-white font-bold transition-all hover:opacity-90 bg-blue-500 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading && <Loader2 className="animate-spin" size={20} />}
                                가입하기
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
