import React from 'react';
import { X, ShieldCheck, Check, Info, BellRing, FileText } from 'lucide-react';

interface AgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'privacy' | 'marketing' | 'terms';
}

export function AgreementModal({ isOpen, onClose, title, type }: AgreementModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-neutral-border flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-slate-50 px-5 py-4 border-b border-neutral-border flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 text-brand-blue">
            {type === 'marketing' ? (
              <BellRing size={20} className="text-brand-blue" />
            ) : type === 'terms' ? (
              <FileText size={20} className="text-brand-blue" />
            ) : (
              <ShieldCheck size={20} className="text-brand-blue" />
            )}
            <h3 className="font-sans font-bold text-[15px] text-neutral-dark">{title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-neutral-200 text-neutral-500 transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-[13px] text-neutral-gray leading-relaxed font-sans">
          {/* 1. 개인정보 수집 및 이용 동의 (필수) */}
          {type === 'privacy' && (
            <>
              <div className="border-b border-neutral-100 pb-3">
                <h4 className="font-bold text-neutral-dark text-sm sm:text-base mb-1">
                  개인정보 수집 및 이용 동의서 <span className="text-red-500 font-extrabold text-xs ml-1">(필수사항)</span>
                </h4>
                <p className="text-neutral-500 text-xs leading-relaxed">
                  <strong>(주)프라임에셋 보험대리점(이하 '회사')</strong> 및 <strong>소속 보험설계사 유영환(손·생보 협회 등록번호: 제20051077110001호)</strong>은 「개인정보 보호법」 제15조, 제22조 및 「신용정보의 이용 및 보호에 관한 법률」 제32조, 제33조에 따라 고객님의 소중한 개인정보를 안전하게 보호하며, <strong>핀토스 보험케어</strong> 맞춤형 보장 분석 및 1:1 상담 서비스를 제공하기 위하여 아래와 같이 개인정보를 수집·이용하고자 합니다.
                </p>
              </div>

              <div className="space-y-3">
                {/* 1. 수집 및 이용 목적 */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-neutral-200/80">
                  <div className="font-bold text-neutral-800 text-xs sm:text-[13px] mb-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span>
                    1. 개인정보의 수집 및 이용 목적
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-neutral-600">
                    <li><strong>고객 맞춤형 보장 분석 및 진단 리포트 생성·발송</strong> (국내 주요 32개 생명·손해보험사 약관 대조)</li>
                    <li>전문 모집종사자(설계사 유영환) 매칭 및 <strong>1:1 맞춤형 무료 보험 상담 서비스 제공</strong> (전화, 문자메시지, 카카오톡 알림톡)</li>
                    <li>보험 상품의 만기 도래 및 갱신 주기에 따른 보장 점검 안내</li>
                    <li>서비스 신청 고객의 본인 확인, 고객 식별, 상담 이력 관리, 민원 및 분쟁 처리, 부정이용 방지</li>
                  </ul>
                </div>

                {/* 2. 수집하는 개인정보 항목 */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-neutral-200/80">
                  <div className="font-bold text-neutral-800 text-xs sm:text-[13px] mb-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span>
                    2. 수집하는 개인정보 항목
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-neutral-600">
                    <li><strong>필수 수집 항목:</strong> 성명(이름), 성별, 생년월일, 휴대전화번호, 상담/점검 희망 항목(암, 뇌·심장질환, 실손의료비, 운전자보험 등)</li>
                    <li><strong>서비스 이용과정 자동 수집 항목:</strong> 접속 IP 주소, 상담 신청 일시, 기기 및 브라우저 정보</li>
                  </ul>
                </div>

                {/* 3. 보유 및 이용 기간 */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-neutral-200/80">
                  <div className="font-bold text-neutral-800 text-xs sm:text-[13px] mb-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span>
                    3. 개인정보의 보유 및 이용 기간
                  </div>
                  <div className="text-xs text-neutral-600 space-y-1.5">
                    <p>
                      • <strong>보유 기간:</strong> 개인정보 수집 및 동의일로부터 <strong>1년</strong> 동안 보유 및 이용됩니다.
                    </p>
                    <p>
                      • <strong>파기 기준:</strong> 상담 및 보장 분석 목적이 달성되거나, 정보주체의 <strong>동의 철회 및 삭제 요청 시 지체 없이 복구 불가능한 방법으로 안전하게 파기</strong>합니다.
                    </p>
                    <div className="text-[11px] text-neutral-500 pt-1 border-t border-neutral-200/60 space-y-0.5">
                      <p>※ 단, 관계 법령의 규정에 의하여 보존할 필요가 있는 경우 해당 법령 기준을 따릅니다:</p>
                      <p>- 표시/광고에 관한 기록: 6개월 (전자상거래 등에서의 소비자보호에 관한 법률)</p>
                      <p>- 소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)</p>
                      <p>- 계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</p>
                      <p>- 통신사실 확인자료(접속 로그): 3개월 (통신비밀보호법)</p>
                    </div>
                  </div>
                </div>

                {/* 4. 동의를 거부할 권리 */}
                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/70 flex gap-2">
                  <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900 leading-relaxed">
                    <strong>동의 거부 권리 및 불이익 안내:</strong><br />
                    귀하는 본 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다. 단, 위 항목은 무료 보장 분석 리포트 생성 및 1:1 전문 상담 서비스 제공을 위한 <strong>필수 수집 항목</strong>이므로, 동의를 거부하실 경우 서비스 신청 및 이용이 제한됩니다.
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 2. 마케팅 정보 및 혜택 수신 동의 (선택) */}
          {type === 'marketing' && (
            <>
              <div className="border-b border-neutral-100 pb-3">
                <h4 className="font-bold text-neutral-dark text-sm sm:text-base mb-1">
                  마케팅 활용 및 광고성 정보 수신 동의서 <span className="text-neutral-400 text-xs font-normal ml-1">(선택사항)</span>
                </h4>
                <p className="text-neutral-500 text-xs leading-relaxed">
                  <strong>(주)프라임에셋 보험대리점</strong>은 「개인정보 보호법」 제22조 제4항 및 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 제50조에 따라, <strong>핀토스 보험케어</strong> 이용 고객님께 꼭 필요한 맞춤형 보험 혜택 및 유용한 금융 소식을 안내해 드리고자 합니다.
                </p>
              </div>

              <div className="space-y-3">
                {/* 1. 수집 및 이용 목적 */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-neutral-200/80">
                  <div className="font-bold text-neutral-800 text-xs sm:text-[13px] mb-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span>
                    1. 개인정보 수집 및 이용 목적
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-neutral-600">
                    <li><strong>고객 맞춤형 신규 보험 상품 소개 및 리모델링 비교 견적 안내</strong></li>
                    <li>보험료 개정 및 인하 소식 안내, 만기·갱신 시점별 보장 점검 알림</li>
                    <li><strong>숨은 보험금 및 미청구 보험금 찾기</strong> 지원 혜택 안내</li>
                    <li>이벤트·프로모션 혜택 안내, 모바일 쿠폰 제공 및 고객 만족도 조사</li>
                  </ul>
                </div>

                {/* 2. 수집 및 활용 항목 */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-neutral-200/80">
                  <div className="font-bold text-neutral-800 text-xs sm:text-[13px] mb-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span>
                    2. 수집 및 활용 항목
                  </div>
                  <p className="text-xs text-neutral-600 pl-3.5">
                    • 성명(이름), 성별, 생년월일, 휴대전화번호, 상담 희망 보장 내역
                  </p>
                </div>

                {/* 3. 전송 방법 및 매체 */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-neutral-200/80">
                  <div className="font-bold text-neutral-800 text-xs sm:text-[13px] mb-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span>
                    3. 광고성 정보 전송 매체 및 방법
                  </div>
                  <p className="text-xs text-neutral-600 pl-3.5">
                    • 휴대전화 문자메시지(SMS, LMS, MMS), 카카오톡(알림톡/친구톡), 전화(유선 통화)
                  </p>
                </div>

                {/* 4. 보유 및 이용 기간 */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-neutral-200/80">
                  <div className="font-bold text-neutral-800 text-xs sm:text-[13px] mb-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span>
                    4. 보유 및 이용 기간
                  </div>
                  <p className="text-xs text-neutral-600 pl-3.5">
                    • <strong>동의일로부터 1년</strong> (또는 정보주체의 수신 동의 철회 시까지 즉시 파기)
                  </p>
                </div>

                {/* 5. 동의 철회 및 수신 거부 방법 */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-neutral-200/80">
                  <div className="font-bold text-neutral-800 text-xs sm:text-[13px] mb-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span>
                    5. 동의 철회 및 무료 수신 거부 방법
                  </div>
                  <p className="text-xs text-neutral-600 pl-3.5">
                    • 고객센터(010-2627-7771) 유선 연락 또는 수신된 메시지 내 무료 수신거부를 통해 언제든지 비용 부담 없이 철회하실 수 있습니다.
                  </p>
                </div>

                {/* 6. 선택 동의 안내 박스 */}
                <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/70 flex gap-2">
                  <Info size={16} className="text-brand-blue shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-950 leading-relaxed">
                    <strong>동의 거부 권리 안내:</strong><br />
                    본 동의는 <strong>선택 사항</strong>으로 동의를 거부하실 권리가 있으며, 동의하지 않으셔도 무료 보험 보장 분석 및 1:1 기본 상담 서비스 이용에는 일체의 불이익이나 제한이 없습니다.
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 3. 서비스 이용 협약 (유의사항) */}
          {type === 'terms' && (
            <>
              <div className="border-b border-neutral-100 pb-3">
                <h4 className="font-bold text-neutral-dark text-sm sm:text-base mb-1">
                  서비스 이용 및 소비자 유의사항 안내
                </h4>
                <p className="text-neutral-500 text-xs">
                  핀토스 보험케어의 보장 분석 및 보험 상담 서비스 이용 시 유의사항입니다.
                </p>
              </div>

              <div className="space-y-2.5 text-xs text-neutral-600 bg-slate-50 p-3.5 rounded-xl border border-neutral-200/80">
                <p>• <strong>[보장 분석 산출 안내]</strong> 본 서비스의 진단과 통계 리포트는 국내 주요 보험사(32개 생명·손해보험사)의 표준 약관 및 공시 기준을 객관적으로 참조하여 산출된 권장 참고자료입니다.</p>
                <p>• <strong>[인수 심사 및 보험료 변동]</strong> 고객님의 병력, 직업, 연령, 건강상태 등 상세 인수 기준에 따라 실제 청약 시 가입 가능한 담보와 보험료가 달라질 수 있습니다.</p>
                <p>• <strong>[해지 및 재계약 시 유의사항]</strong> 기존 보험 계약을 해지하고 새로운 계약을 체결하는 과정에서 질병 이력 등으로 가입이 거절되거나 새로운 면책기간 적용 등 불이익이 발생할 수 있습니다.</p>
                <p>• <strong>[친절 상담 품질 보증]</strong> 원활한 상담 진행과 품질 관리를 위해 유선 통화 시 고객 동의 하에 안심 녹취가 진행될 수 있습니다.</p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-border flex justify-end bg-slate-50 gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-brand-blue text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-brand-blue/15 hover:bg-brand-blue-hover active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Check size={16} strokeWidth={2.5} />
            <span>확인했습니다</span>
          </button>
        </div>
      </div>
    </div>
  );
}
