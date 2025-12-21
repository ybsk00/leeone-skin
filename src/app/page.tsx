import Link from "next/link";
import { ArrowRight, Coffee, Thermometer, Activity, Smile, Sparkles, CheckCircle, BarChart2, Calendar } from "lucide-react";
import { TrackF1View } from "@/components/marketing/MarketingTracker";
import Footer from "@/components/common/Footer";
import ThreeBackground from "@/components/common/ThreeBackground";
import DentalLogo from "@/components/common/DentalLogo";
import ClinicSearchModule from "@/components/healthcare/ClinicSearchModule";

export default function LandingPage() {
  return (
    <TrackF1View>
      <div className="min-h-screen bg-dental-bg text-dental-text font-sans selection:bg-dental-primary selection:text-white">
        {/* 3D Background */}
        <ThreeBackground className="pointer-events-none" />

        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-dental-bg/80 backdrop-blur-md border-b border-white/10 transition-all duration-300">
          <div className="flex items-center justify-between px-6 py-1 max-w-7xl mx-auto">
            <Link href="/" className="flex items-center gap-3 group cursor-pointer">
              <DentalLogo size={36} />
              <span className="text-xl font-bold text-dental-text">이생각 구강 케어</span>
            </Link>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-dental-subtext">
              {/* Navigation links */}
            </div>
            <Link
              href="/login"
              className="px-6 py-2.5 bg-dental-primary text-white text-sm font-medium rounded-full hover:bg-dental-accent hover:shadow-lg hover:shadow-dental-primary/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              로그인
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="relative px-6 pt-32 pb-20 md:pt-48 md:pb-32 text-center overflow-hidden min-h-[90vh] flex flex-col justify-center items-center">
          {/* Video Background */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-90"
            >
              <source src="/1.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-dental-bg/10 via-dental-bg/30 to-dental-bg/60"></div>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto space-y-6 animate-fade-in">
            {/* 새 타이틀 */}
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-dental-text drop-shadow-lg leading-tight">
              지금 운영 중인 치과,<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-dental-primary via-dental-secondary to-dental-accent">
                바로 조회
              </span>하세요
            </h1>

            <p className="text-base md:text-lg text-dental-subtext max-w-xl mx-auto leading-relaxed">
              조회는 운영정보·위치 기반 안내이며,<br className="hidden md:block" />
              체크 결과는 상담 준비용 참고 요약입니다. (진단/치료 아님)
            </p>

            {/* 치과 조회 모듈 - 메인 CTA */}
            <div className="pt-6">
              <ClinicSearchModule />
            </div>
          </div>
        </header>

        {/* Features Section - Dark Glassmorphism Cards */}
        <section className="relative py-20 px-6 overflow-hidden z-10">
          <div className="relative z-10 max-w-5xl mx-auto">
            <div className="text-center mb-12 space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-dental-text font-sans tracking-tight">
                2분 구강 패턴 체크
              </h2>
              <p className="text-dental-subtext max-w-lg mx-auto text-sm font-medium">
                간단한 질문으로 구강 관리 습관을 점검하고, 요약을 받아보세요.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  icon: <BarChart2 className="w-6 h-6" />,
                  title: "패턴 1장 요약",
                  desc: "양치·식습관·구강 관리 흐름을 5문답으로 정리합니다.",
                  label: "약 2분",
                  labelColor: "bg-dental-muted"
                },
                {
                  icon: <CheckCircle className="w-6 h-6" />,
                  title: "오늘부터 할 1가지",
                  desc: "현실적으로 가능한 '한 가지 조정'만 제안합니다.",
                  label: "실천 중심",
                  labelColor: "bg-dental-primary"
                },
                {
                  icon: <Calendar className="w-6 h-6" />,
                  title: "요약 저장 & 변화 비교",
                  desc: "기록을 저장해 다음에 더 빠르게 이어서 확인합니다.",
                  label: "로그인 후",
                  labelColor: "bg-dental-secondary"
                }
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="group bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-dental-primary/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Icon */}
                  <div className="w-10 h-10 bg-dental-surface rounded-xl flex items-center justify-center mb-4 border border-white/10">
                    <div className="text-dental-accent">{feature.icon}</div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-dental-text mb-2">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-dental-subtext text-sm leading-relaxed mb-4">
                    {feature.desc}
                  </p>

                  {/* Bottom Label */}
                  <span className={`inline-flex items-center px-3 py-1 rounded-md text-[11px] font-semibold ${feature.labelColor} text-white`}>
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Modules Grid - Dental Health Check Modules */}
        <section className="relative py-32 overflow-hidden z-10">
          {/* Video Background */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-80"
            >
              <source src="/2.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-dental-bg/20 via-dental-bg/40 to-dental-bg/60"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-dental-accent font-bold tracking-widest uppercase text-sm mb-2 block">Oral Health Check</span>
              <h2 className="text-4xl md:text-5xl font-bold text-dental-text drop-shadow-lg font-serif">
                내 구강 건강 체크(참고용)
              </h2>
              <p className="text-dental-subtext mt-4 max-w-2xl mx-auto">
                모듈을 선택해 2~3분 문답으로 패턴을 정리해보세요.<br />
                결과는 요약으로 저장할 수 있습니다.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {/* Module 1: 착색 CSI */}
              <Link href="/healthcare/chat?topic=stain-csi" className="group">
                <div className="h-full bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-dental-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:shadow-amber-500/30 transition-all duration-300 border border-amber-500/30">
                    <Coffee className="w-7 h-7 text-amber-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-lg font-bold text-dental-text mb-2 tracking-wide">착색 CSI</h3>
                  <p className="text-xs text-dental-subtext leading-relaxed font-light">
                    커피·담배 습관<br />착색 패턴 점검 (참고용)
                  </p>
                </div>
              </Link>

              {/* Module 2: 시림 탐정 */}
              <Link href="/healthcare/chat?topic=sensitivity" className="group">
                <div className="h-full bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-dental-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:shadow-cyan-500/30 transition-all duration-300 border border-cyan-500/30">
                    <Thermometer className="w-7 h-7 text-cyan-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-lg font-bold text-dental-text mb-2 tracking-wide">시림 탐정</h3>
                  <p className="text-xs text-dental-subtext leading-relaxed font-light">
                    찬물·단것 자극<br />트리거 패턴 체크 (참고용)
                  </p>
                </div>
              </Link>

              {/* Module 3: 잇몸 레이더 */}
              <Link href="/healthcare/chat?topic=gum-radar" className="group">
                <div className="h-full bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-dental-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-rose-500/20 to-rose-600/20 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:shadow-rose-500/30 transition-all duration-300 border border-rose-500/30">
                    <Activity className="w-7 h-7 text-rose-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-lg font-bold text-dental-text mb-2 tracking-wide">잇몸 레이더</h3>
                  <p className="text-xs text-dental-subtext leading-relaxed font-light">
                    출혈·붓기·구취<br />위생 루틴 스캔 (참고용)
                  </p>
                </div>
              </Link>

              {/* Module 4: 스마일 밸런스 */}
              <Link href="/healthcare/chat?topic=smile-balance" className="group">
                <div className="h-full bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-dental-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-violet-500/20 to-violet-600/20 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:shadow-violet-500/30 transition-all duration-300 border border-violet-500/30">
                    <Smile className="w-7 h-7 text-violet-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-lg font-bold text-dental-text mb-2 tracking-wide">스마일 밸런스</h3>
                  <p className="text-xs text-dental-subtext leading-relaxed font-light">
                    이갈이·입호흡<br />습관 게임 (참고용)
                  </p>
                </div>
              </Link>

              {/* Module 5: 임플란트 준비도 */}
              <Link href="/healthcare/chat?topic=implant-ready" className="group">
                <div className="h-full bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-dental-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300 border border-blue-500/30">
                    <Sparkles className="w-7 h-7 text-blue-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-lg font-bold text-dental-text mb-2 tracking-wide">임플란트 준비도</h3>
                  <p className="text-xs text-dental-subtext leading-relaxed font-light">
                    상실 이후 루틴<br />준비 체크리스트 (참고용)
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />

        {/* Floating Chat Button */}
        <div className="fixed bottom-8 right-8 z-50 animate-bounce-slow">
          <Link href="/healthcare/chat" className="w-16 h-16 bg-dental-primary rounded-full flex items-center justify-center text-white shadow-2xl shadow-dental-primary/40 hover:bg-dental-accent transition-all duration-300 hover:scale-110 border-2 border-white/20 backdrop-blur-sm">
            <span className="text-3xl">💬</span>
          </Link>
        </div>
      </div>
    </TrackF1View>
  );
}
