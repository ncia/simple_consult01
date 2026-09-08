import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles, AlertTriangle, ArrowRight, UserCheck, PhoneCall, Download, RotateCcw, Landmark, AlertCircle } from 'lucide-react';
import { InquiryFormState, CHECK_ITEMS } from '../types';

interface DiagnosticsReportProps {
  formData: InquiryFormState;
  onReset: () => void;
}

export function DiagnosticsReport({ formData, onReset }: DiagnosticsReportProps) {
  const [loadingStage, setLoadingStage] = useState(0);
  const [progress, setProgress] = useState(0);

  // Calculate age based on birthyear (e.g., 19850613)
  const getAge = (birthStr: string) => {
    if (!birthStr || birthStr.length < 4) return 38;
    const year = parseInt(birthStr.substring(0, 4), 10);
    if (isNaN(year)) return 38;
    return 2026 - year; // 2026 is current runtime year context
  };

  const calculatedAge = getAge(formData.birthdate);
  const userName = formData.name || '고객';

  const stages = [
    '주요 보험사 보장 데이터베이스 연결 중...',
    '본인 인증 기반 희망 점검 항목 확인 중...',
    '보장 중복 및 적립보험료 비중 분석 중...',
    '연령/성별 표준 보장 통계 대조 중...',
    '1:1 전담 보장 분석사 매칭 및 리포트 작성 완료!'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const stageIndex = Math.min(Math.floor((progress / 100) * stages.length), stages.length - 1);
    setLoadingStage(stageIndex);
  }, [progress]);

  if (progress < 100) {
    return (
      <div className="py-20 px-5 text-center bg-white min-h-[500px] flex flex-col justify-center items-center space-y-6 font-sans">
        <div className="relative">
          {/* Circular Spinner */}
          <div className="w-24 h-24 rounded-full border-4 border-brand-blue-pale border-t-brand-blue animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-brand-blue font-bold">
            {progress}%
          </div>
        </div>

        <div className="space-y-2 max-w-sm">
          <h3 className="font-bold text-lg text-neutral-dark">가입 내역을 정밀 분석하고 있습니다</h3>
          <p className="text-sm text-brand-blue animate-pulse font-semibold">
            {stages[loadingStage]}
          </p>
          <p className="text-xs text-neutral-500 leading-normal">
            개인 식별 데이터는 정식 암호 보안 프로토콜을 통과하며 제3자에게 임의 양도되지 않습니다.
          </p>
        </div>
      </div>
    );
  }

  const checkItemCount = formData.selectedItems.length || 1;

  return (
    <div className="py-10 px-5 bg-neutral-bg animate-fade-in font-sans">
      <div className="max-w-[760px] mx-auto space-y-6">
        
        {/* Top Celebration */}
        <div className="bg-brand-blue text-white p-6 rounded-2xl text-center relative overflow-hidden shadow-xl shadow-brand-blue/10">
          <div className="absolute right-0 top-0 opacity-10 translate-x-4 translate-y-4">
            <ShieldCheck size={180} />
          </div>
          
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
              <Sparkles size={14} className="text-brand-green-light" />
              <span>실시간 자가 진단 리포트 접수 완료</span>
            </div>
            <h2 className="font-extrabold text-2xl sm:text-3xl">
              {calculatedAge}세 {userName}님<br />
              <span className="text-brand-green-light">보장 점검 분석 리포트</span>
            </h2>
            <p className="text-xs sm:text-sm text-brand-blue-light max-w-xs mx-auto leading-relaxed">
              신청하신 정보를 바탕으로 보장 구성 및 중복 특약 점검을 진행할 준비가 완료되었습니다.
            </p>
          </div>
        </div>

        {/* Diagnosis Status Card */}
        <div className="bg-white border-2 border-brand-blue p-5 rounded-2xl shadow-md space-y-3">
          <span className="text-xs font-bold text-brand-blue bg-brand-blue-pale px-3 py-0.5 rounded-full uppercase">
            Inspection Target
          </span>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs sm:text-sm text-neutral-gray">신청 기준 중점 점검 항목</p>
              <strong className="font-display font-black text-2xl sm:text-3xl text-brand-blue">
                총 {checkItemCount}개 영역 보장 분석 대상
              </strong>
            </div>
            <span className="text-right text-xs sm:text-sm font-bold text-neutral-medium leading-normal">
              1:1 전문 상담 배정 완료
            </span>
          </div>
        </div>

        {/* Categorized Diagnoses based on selected items */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-border space-y-4">
          <h3 className="text-base font-extrabold text-neutral-dark border-b border-neutral-border pb-2.5">
            선택하신 항목별 간이 점검 요약
          </h3>

          <div className="space-y-4.5">
            {formData.selectedItems.map((itemId) => {
              const matched = CHECK_ITEMS.find((c) => c.id === itemId);
              if (!matched) return null;

              // Generate tailored insights
              let advice = '정밀 조회를 통해 세부 중복 여부 및 보장 공백을 상담 시 안내해 드릴 예정입니다.';
              let intensity: 'danger' | 'warning' | 'positive' = 'warning';

              if (matched.label === '숨은보험금') {
                advice = '미청구 보험금 및 정산 배당금 의심 내역이 있는지 조회 후, 본인 명의 간편 수령 절차를 안내해 드립니다.';
                intensity = 'danger';
              } else if (matched.label === '보험료확인') {
                advice = `${calculatedAge}세 동연령 표준 납입 통계와 비교하여 적립보험료 비중과 갱신형 특약 비중을 종합적으로 분석해 드립니다.`;
                intensity = 'danger';
              } else if (matched.label === '내보험점검') {
                advice = '3대 주요 질환(암·뇌·심) 진단비 범위 및 수술비 보장 기간(80세/100세)이 적절하게 구성되어 있는지 집중 점검합니다.';
                intensity = 'warning';
              } else if (matched.label === '보험상품비교') {
                advice = '주요 생·손보사 상품 조건을 비교하여 동일 보장 기준 합리적인 구성을 찾을 수 있도록 포트폴리오를 제안합니다.';
                intensity = 'warning';
              } else if (matched.label === '만기환급금') {
                advice = '순수 보장형 플랜과 만기환급형 플랜의 장단점을 객관적으로 비교하여 효율적인 선택을 도와드립니다.';
                intensity = 'positive';
              } else if (matched.label === '청구문의') {
                advice = '복잡한 질병/상해 청구 서류 및 절차를 안내해 드리며, 미청구 진료비 내역이 있는지 함께 확인해 드립니다.';
                intensity = 'positive';
              }

              return (
                <div key={itemId} className="p-4 rounded-xl bg-neutral-bg border border-neutral-border flex gap-3">
                  <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-sm font-bold ${
                    intensity === 'danger' ? 'bg-red-50 text-red-500' :
                    intensity === 'warning' ? 'bg-yellow-50 text-yellow-600' : 'bg-brand-blue-pale text-brand-blue'
                  }`}>
                    {intensity === 'danger' ? '!' : intensity === 'warning' ? '?' : '✓'}
                  </div>
                  <div className="space-y-1">
                    <strong className="text-sm sm:text-base font-bold block text-neutral-dark">
                      {matched.label} 점검 안내
                    </strong>
                    <p className="text-xs sm:text-sm text-neutral-gray leading-relaxed text-slate-700">
                      {advice}
                    </p>
                  </div>
                </div>
              );
            })}

            {formData.selectedItems.length === 0 && (
              <p className="text-sm text-neutral-muted text-center py-4">
                선택하신 특정 진단 세부 항목이 없어 종합 보장 점검을 기반으로 포트폴리오를 작성합니다.
              </p>
            )}
          </div>
        </div>

        {/* Assigned Agent Card */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-border space-y-4 font-sans">
          <h3 className="text-base font-extrabold text-neutral-dark border-b border-neutral-border pb-2">
            1:1 지정 보장 상담 설계사 정보
          </h3>
          
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-brand-blue shadow bg-brand-blue-pale flex items-center justify-center font-display font-bold text-brand-blue">
              PA
            </div>
            <div className="space-y-1.5 my-auto">
              <div>
                <strong className="text-base text-neutral-dark">설계사 유영환</strong>
                <span className="text-xs ml-2 text-brand-blue font-bold tracking-wider">
                  (주)프라임에셋 소속
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-gray">
                손·생보 협회 등록번호: <strong className="text-neutral-dark">제20051077110001호</strong>
              </p>
              <div className="flex gap-2">
                <span className="text-[11px] bg-brand-blue-pale text-brand-blue font-bold px-2 py-0.5 rounded">
                  정식 협회 등록 설계사
                </span>
                <span className="text-[11px] bg-neutral-100 text-neutral-dark font-bold px-2 py-0.5 rounded">
                  1:1 맞춤 상담 지원
                </span>
              </div>
            </div>
          </div>

          <div className="bg-brand-blue-pale text-brand-blue-dark p-3.5 rounded-xl border border-brand-blue-light/50 text-xs sm:text-sm leading-relaxed flex items-center gap-2.5">
            <PhoneCall size={18} className="shrink-0 text-brand-blue" />
            <p>
              영업일 기준 **24시간 이내**에 담당 설계사가 유선 전화를 통해 종합 무료 상담 안내 및 맞춤 리포트 발송 일정을 안내해 드립니다.
            </p>
          </div>
        </div>

        {/* Compliance Warning */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 space-y-2 text-xs sm:text-[13px] text-amber-900 leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold text-amber-950 text-sm">
            <AlertCircle size={16} className="text-amber-600" />
            <span>유의사항 안내</span>
          </div>
          <p>• 본 분석 리포트 및 안내 내용은 모집종사자 개인의 의견이며, 계약 체결에 따른 이익 또는 손실은 보험계약자 등에게 귀속됩니다.</p>
          <p>• 보험계약자가 기존 보험계약을 해지하고 새로운 보험계약을 체결하는 과정에서 질병이력, 연령증가 등으로 가입이 거절되거나 보험료가 인상될 수 있습니다.</p>
          <p>• 보험회사 상품별, 성별, 연령, 직업 등에 따라 가입 가능한 담보와 가입금액, 보험료 등은 달라질 수 있습니다.</p>
        </div>

        {/* Dynamic Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="flex-1 h-14 bg-white border border-neutral-border font-semibold text-xs text-neutral-gray hover:text-neutral-dark rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>신청 정보 수정하기</span>
          </button>
          
          <button
            onClick={() => alert('PDF 생성 시뮬레이션: "InsureCare_보장진단_리포트.pdf" 파일 다운로드 대기열에 추가되었습니다.')}
            className="flex-1 h-14 bg-brand-blue text-white hover:bg-brand-blue-hover font-bold text-xs rounded-xl shadow-lg shadow-brand-blue/10 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <Download size={14} />
            <span>PDF 소장본 예약하기</span>
          </button>
        </div>

      </div>
    </div>
  );
}
