import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Check,
  Smartphone,
  Sparkles,
  ArrowRight,
  Info,
  User,
  Car,
  Home,
  Heart,
  Flame,
  Zap,
  FileText,
  Star,
  Moon,
  Sun,
  Smile,
  Bell,
  Flower,
  Gift,
  Ghost,
  Panda,
  WandSparkles,
  Tag,
  Landmark,
  Dog,
  Cat,
  Crown,
  BriefcaseMedical,
  Baby,
  Clover,
  Gem,
  Menu,
  Mail,
  Squirrel,
  Rabbit,
  Rat,
  PiggyBank,
  Send,
  Rocket,
  Meh,
  Martini,
  CupSoda,
  Citrus,
  Cherry,
  Candy,
  CandyCane,
  Carrot,
  Cake,
  Castle,
  CarFront,
  Bird,
  Beer,
  Apple,
  Banana,
  HeartPulse,
  Laugh,
  Lock,
  Popcorn,
  Popsicle,
  Pizza,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  FerrisWheel,
  Coffee,
  CloudRain,
  CloudSnow,
  CloudLightning,
  BowArrow,
  CakeSlice,
  IceCreamBowl,
  Hospital,
  Lightbulb,
  Nut,
  PencilRuler,
  School,
  Shrub,
  Skull,
  Siren,
  TreePalm,
  AlarmClock,
  ShieldBan,
  ShieldHalf,
  Bomb
} from 'lucide-react';

import { Header } from './components/Header';
import { AgreementModal } from './components/AgreementModal';
import { SMSVerificationModal } from './components/SMSVerificationModal';
import { BeforeAfterSection } from './components/BeforeAfterSection';
import { ProcessSection } from './components/ProcessSection';
import { DiagnosticsReport } from './components/DiagnosticsReport';
import { handleKakaoConsultation, KAKAO_CHAT_URL } from './utils/kakao';

import {
  InquiryFormState,
  CHECK_ITEMS,
  REGION_DATA
} from './types';

const ALL_HERO_ICONS = [ShieldCheck, Heart, Star, Moon, Sparkles, Sun, Smile, Bell, Flower, Gift, Ghost, Panda, WandSparkles, Tag, Landmark, Dog, Cat, Crown, BriefcaseMedical, Baby, Clover, Gem, Menu, Mail, Squirrel, Rabbit, Rat, PiggyBank, Send, Rocket, Meh, Martini, CupSoda, Citrus, Cherry, Candy, CandyCane, Carrot, Cake, Castle, CarFront, Bird, Beer, Apple, Banana, HeartPulse, Laugh, Lock, Popcorn, Popsicle, Pizza, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, FerrisWheel, Coffee, CloudRain, CloudSnow, CloudLightning, BowArrow, CakeSlice, IceCreamBowl, Hospital, Lightbulb, Nut, PencilRuler, School, Shrub, Skull, Siren, TreePalm, AlarmClock, ShieldBan, ShieldHalf, Bomb];

const RandomHeroIcon = ({ id, getSafePosition, getAvailableIcon, initialIcon }: { id: number, getSafePosition: (id: number) => { top: number, left: number }, getAvailableIcon: (current: any) => any, initialIcon: any }) => {
  const currentIconRef = useRef(initialIcon);
  
  // 최초 위치를 할당받음 (아이콘별 고유 ID 사용)
  const initialPos = useRef(getSafePosition(id)).current;

  const [iconState, setIconState] = useState({
    Icon: initialIcon,
    top: initialPos.top,
    left: initialPos.left,
    isVisible: true,
    key: 0
  });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const cycle = () => {
      // 1. 사라지기 시작
      setIconState(prev => ({ ...prev, isVisible: false }));
      
      // 2. 1초(사라지는 애니메이션 시간) 후 위치 변경 및 다시 나타나기
      timeoutId = setTimeout(() => {
        // 상태 업데이트 함수 외부에서 아이콘을 새로 뽑아서 React Strict Mode 중복 실행 문제 방지
        const nextIcon = getAvailableIcon(currentIconRef.current);
        currentIconRef.current = nextIcon;
        
        const { top, left } = getSafePosition(id);
        
        setIconState(prev => ({ Icon: nextIcon, top, left, isVisible: true, key: prev.key + 1 }));

        // 3. 3~5초간 보여진 후 다시 cycle 반복
        const visibleDuration = 3000 + Math.random() * 2000;
        timeoutId = setTimeout(cycle, visibleDuration);
      }, 1000); // fade-out transition duration
    };

    // 처음 마운트 시 3~5초 후 첫 번째 사이클 시작
    const initialDuration = 3000 + Math.random() * 2000;
    timeoutId = setTimeout(cycle, initialDuration);

    return () => clearTimeout(timeoutId);
  }, [getAvailableIcon, getSafePosition, id]);

  return (
    <div
      className={`absolute transition-opacity duration-1000 ease-in-out ${iconState.isVisible ? 'opacity-100 animate-twinkle' : 'opacity-0'}`}
      style={{ top: `${iconState.top}%`, left: `${iconState.left}%` }}
    >
      <iconState.Icon size={20} className="text-white" />
    </div>
  );
};

const RandomHeroIconsContainer = () => {
  const activeIconsRef = useRef<Set<any>>(new Set([ALL_HERO_ICONS[0], ALL_HERO_ICONS[1], ALL_HERO_ICONS[2]]));
  const occupiedPositionsRef = useRef<{ id: number, top: number, left: number }[]>([]);

  // 아이콘들의 위치 겹침 방지 (중앙 영역 회피 + 서로 간 거리 두기)
  // useCallback을 사용하지 않아도 Ref를 참조하므로 위치 추적이 가능하지만 
  // lint나 렌더링 최적화를 위해 안전하게 처리합니다.
  const getSafePosition = (id: number) => {
    const isMobile = window.innerWidth < 768;
    
    let newPos = { top: 0, left: 0 };
    let isValid = false;
    let attempts = 0;

    while (!isValid && attempts < 50) {
      if (isMobile) {
        // 모바일: 상단/하단 영역에 배치하여 중앙 텍스트/버튼 회피
        const isTop = Math.random() > 0.5;
        newPos.top = isTop ? 5 + Math.random() * 10 : 85 + Math.random() * 10;
        newPos.left = 5 + Math.random() * 90;
      } else {
        // 데스크톱: 상, 하, 좌, 우 가장자리 여백 배치
        const edge = Math.floor(Math.random() * 4);
        if (edge === 0) {
          newPos.top = 5 + Math.random() * 5; newPos.left = 5 + Math.random() * 90;
        } else if (edge === 1) {
          newPos.top = 90 + Math.random() * 5; newPos.left = 5 + Math.random() * 90;
        } else if (edge === 2) {
          newPos.top = 15 + Math.random() * 70; newPos.left = 5 + Math.random() * 15;
        } else {
          newPos.top = 15 + Math.random() * 70; newPos.left = 80 + Math.random() * 15;
        }
      }

      isValid = true;
      // 다른 활성 아이콘들과 위치가 겹치지 않게 최소 간격(15%) 유지
      for (const pos of occupiedPositionsRef.current) {
        if (pos.id !== id) {
          const topDiff = Math.abs(pos.top - newPos.top);
          const leftDiff = Math.abs(pos.left - newPos.left);
          
          if (topDiff < 15 && leftDiff < 15) {
            isValid = false;
            break;
          }
        }
      }
      attempts++;
    }

    // 위치 저장소 업데이트
    const existingIndex = occupiedPositionsRef.current.findIndex(p => p.id === id);
    if (existingIndex >= 0) {
      occupiedPositionsRef.current[existingIndex] = { id, top: newPos.top, left: newPos.left };
    } else {
      occupiedPositionsRef.current.push({ id, top: newPos.top, left: newPos.left });
    }

    return newPos;
  };

  const getAvailableIcon = (currentIcon: any) => {
    const available = ALL_HERO_ICONS.filter(icon => !activeIconsRef.current.has(icon) || icon === currentIcon);
    const chosen = available[Math.floor(Math.random() * available.length)];
    
    if (currentIcon) {
      activeIconsRef.current.delete(currentIcon);
    }
    activeIconsRef.current.add(chosen);
    
    return chosen;
  };

  return (
    <>
      <RandomHeroIcon id={1} getSafePosition={getSafePosition} getAvailableIcon={getAvailableIcon} initialIcon={ALL_HERO_ICONS[0]} />
      <RandomHeroIcon id={2} getSafePosition={getSafePosition} getAvailableIcon={getAvailableIcon} initialIcon={ALL_HERO_ICONS[1]} />
      <RandomHeroIcon id={3} getSafePosition={getSafePosition} getAvailableIcon={getAvailableIcon} initialIcon={ALL_HERO_ICONS[2]} />
    </>
  );
};

function getInsuranceInfo(birthdateStr: string) {
  if (birthdateStr.length !== 8) return null;
  const year = parseInt(birthdateStr.substring(0, 4), 10);
  const month = parseInt(birthdateStr.substring(4, 6), 10) - 1;
  const day = parseInt(birthdateStr.substring(6, 8), 10);

  const birth = new Date(year, month, day);
  if (birth.getFullYear() !== year || birth.getMonth() !== month || birth.getDate() !== day) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let ageYears = today.getFullYear() - birth.getFullYear();
  let ageMonths = today.getMonth() - birth.getMonth();
  let ageDays = today.getDate() - birth.getDate();

  if (ageDays < 0) {
    ageMonths -= 1;
  }
  if (ageMonths < 0) {
    ageYears -= 1;
    ageMonths += 12;
  }

  let insuranceAge = ageYears;
  if (ageMonths >= 6) {
    insuranceAge += 1;
  }

  let nextSangryeong = new Date(today.getFullYear(), month + 6, day);
  if (nextSangryeong.getMonth() !== (month + 6) % 12) {
    nextSangryeong = new Date(today.getFullYear(), month + 7, 0);
  }

  if (nextSangryeong.getTime() <= today.getTime()) {
    nextSangryeong = new Date(today.getFullYear() + 1, month + 6, day);
    if (nextSangryeong.getMonth() !== (month + 6) % 12) {
      nextSangryeong = new Date(today.getFullYear() + 1, month + 7, 0);
    }
  }

  const diffTime = nextSangryeong.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return { insuranceAge, diffDays };
}

export default function App() {
  // Main form state
  const [formData, setFormData] = useState<InquiryFormState>({
    name: '',
    gender: null, // default active selection
    birthdate: '',
    phone: '',
    verificationCode: '',
    isVerified: false,
    selectedItems: [], // default selection
    termAll: false,
    termPrivacy: false,
    termMarketing: false,
    province: '',
    district: '',
    consultTimeType: '종일',
    consultTime: ''
  });

  // Modal tracking states
  const [isSMSOtpOpen, setIsSMSOtpOpen] = useState(false);
  const [isDashboardFlipped, setIsDashboardFlipped] = useState(false);
  const [activeTermModal, setActiveTermModal] = useState<{ isOpen: boolean; title: string; type: 'privacy' | 'marketing' | 'terms' }>({
    isOpen: false,
    title: '',
    type: 'privacy'
  });

  // App routing/submission state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Validation errors mapping
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // Format phone number live helper (limit 11 numbers)
  const formatPhone = (val: string) => {
    return val.replace(/[^0-9]/g, '').slice(0, 11);
  };

  // Format birthdate helper (limit 8 numbers)
  const formatBirthdate = (val: string) => {
    return val.replace(/[^0-9]/g, '').slice(0, 8);
  };

  // Individual handlers
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData.isVerified) return; // lock input once verified
    setFormData({ ...formData, phone: formatPhone(e.target.value) });
    setValidationErrors({ ...validationErrors, phone: '' });
  };

  const handleGenderToggle = (gender: 'male' | 'female') => {
    setFormData({ ...formData, gender });
    setValidationErrors({ ...validationErrors, gender: '' });
  };

  const handleChipToggle = (itemId: string) => {
    // 라디오 버튼 방식: 무조건 선택한 항목 하나만 배열에 남김
    setFormData({ ...formData, selectedItems: [itemId] });

    // 보험분석 서비스 신청 섹션 시작점(signup-form-anchor)으로 정확히 스크롤 스파이더
    const targetElement = document.getElementById('signup-form-anchor');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Agreements state synchronizer
  const handleTermAllChange = (checked: boolean) => {
    setFormData({
      ...formData,
      termAll: checked,
      termPrivacy: checked,
      termMarketing: checked
    });
  };

  const handleTermIndividualChange = (field: 'termPrivacy' | 'termMarketing', checked: boolean) => {
    const updated = { ...formData, [field]: checked };
    const allChecked = updated.termPrivacy && updated.termMarketing;
    setFormData({ ...updated, termAll: allChecked });
  };

  // Contact support click alert
  const handleContactClick = () => {
    alert('비대면 긴급 지원 고객센터(02-2038-8603)로 자동 연결을 승인합니다. 담당 배정 카운슬러가 가장 안전하게 응대하겠습니다.');
  };

  // Launch simulated OTP sending
  const requestVerification = () => {
    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setValidationErrors({ ...validationErrors, phone: '올바른 휴대전화 번호 10~11자리를 입력해 주세요.' });
      return;
    }
    setValidationErrors({ ...validationErrors, phone: '' });
    setIsSMSOtpOpen(true);
  };

  // Complete OTP verified callback
  const handleVerifySuccess = () => {
    setFormData({ ...formData, isVerified: true });
    alert('본인 휴대전화 인증이 안심 처리되었습니다. 양질의 보장 데이터를 안전하게 대조하겠습니다.');
  };

  // Form final submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      errors.name = '이름을 입력해 주세요.';
    }
    if (formData.birthdate.length !== 8) {
      errors.birthdate = '생년월일 8자리(예: 19850613)를 정확히 입력해 주세요.';
    } else {
      const year = parseInt(formData.birthdate.substring(0, 4), 10);
      if (year < 1920 || year > 2026) {
        errors.birthdate = '올바른 연도 범위(1920~2026년)를 설정해 주세요.';
      }
    }
    if (formData.phone.length < 10) {
      errors.phone = '올바른 휴대전화 번호 10~11자리를 입력해 주세요.';
    }

    if (!formData.gender) {
      errors.gender = '성별을 선택해 주세요.';
    }
    if (!formData.province) {
      errors.province = '주소(시/도)를 선택해 주세요.';
    }
    if (!formData.district) {
      errors.district = '주소(시/군/구)를 선택해 주세요.';
    }
    if (!formData.termPrivacy) {
      errors.terms = '필수 개인정보 수집 및 활용 동의서에 체크해 주세요.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      // scroll to topmost invalid item
      const targetElement = document.getElementById('signup-form-anchor');
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    setValidationErrors({});

    try {
      const payload = {
        inquiry_type: formData.selectedItems[0],
        name: formData.name,
        phone: formData.phone,
        birthdate: formData.birthdate,
        gender: formData.gender,
        claim_reason: formData.claimReason,
        hospital_name: formData.hospitalName,
        current_premium: formData.currentPremium,
        target_coverage: formData.targetCoverage,
        concern_point: formData.concernPoint,
        check_request: formData.checkRequest,
        analysis_interest: formData.analysisInterest,
        analysis_company: formData.analysisCompany,
        province: formData.province,
        district: formData.district,
        consult_time_type: formData.consultTimeType,
        consult_time: formData.consultTime,
        term_privacy: formData.termPrivacy,
        term_marketing: formData.termMarketing
      };

      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('API Error');
      }

      setShowSuccessModal(true);
      // 폼 초기화 (선택사항)
      setFormData({
        name: '', gender: null, birthdate: '', phone: '', verificationCode: '', isVerified: false,
        selectedItems: formData.selectedItems, termAll: false, termPrivacy: false, termMarketing: false,
        province: '', district: '', consultTimeType: '종일', consultTime: '', claimReason: '', hospitalName: '', currentPremium: '',
        targetCoverage: '', concernPoint: '', checkRequest: '', analysisInterest: '', analysisCompany: ''
      });
    } catch (err) {
      console.error(err);
      alert('신청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  const formattedAgeDisplay = () => {
    if (formData.birthdate && formData.birthdate.length >= 4) {
      const year = parseInt(formData.birthdate.substring(0, 4), 10);
      if (!isNaN(year)) return `${2026 - year}세 ${formData.name || '고객'}님`;
    }
    return "38세 박*검님";
  };

  return (
    <div className="min-h-screen bg-neutral-bg text-neutral-dark flex flex-col items-center selection:bg-brand-blue-light selection:text-brand-blue-dark">

      {/* Top sticky header */}
      <Header onContactClick={handleContactClick} />

      {/* Main Container max width 768px matching specifications */}
      <main className="w-full max-w-[768px] bg-white shadow-2xl overflow-hidden flex flex-col mt-0 border-x border-neutral-border animate-fade-in pb-16">

        {isSubmitted ? (
          /* Success Screen -> Direct custom diagnostics generated based on form parameters */
          <DiagnosticsReport
            formData={formData}
            onReset={() => {
              setIsSubmitted(false);
              setFormData({ ...formData, isVerified: false, phone: '' });
            }}
          />
        ) : (
          /* Main Interactive Landing Content */
          <>
            {/* HERO HERO-BG WITH PARALLAX IMPACT */}
            <section className="relative h-[480px] bg-slate-950 text-white flex flex-col items-center justify-center text-center px-5 relative overflow-hidden">
              {/* background graphic overlays to match sparkles and lights */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/60 via-slate-900 to-black opacity-95 overflow-hidden">
                {/* Randomly Floating and Twinkling Icons without Duplicates */}
                <RandomHeroIconsContainer />
              </div>

              {/* Dynamic light spot */}
              <div className="absolute -left-16 -top-16 w-80 h-80 bg-brand-green-neon/20 rounded-full blur-3xl animate-pulse-slow"></div>
              <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-brand-blue-light/10 rounded-full blur-3xl animate-pulse-slow"></div>

              {/* Title group */}
              <div className="relative z-10 space-y-3 max-w-md">
                <span className="text-xs sm:text-sm font-sans font-extrabold tracking-widest text-white/90 bg-white/10 px-3.5 py-1.5 rounded-full uppercase border border-white/10 inline-block">
                  FINTOS INSUCARE CENTER
                </span>
                <h1 className="font-display font-black text-3xl sm:text-4xl leading-tight tracking-tight">
                  보험가입, 잘한걸까?<br />
                  <span className="text-brand-green-light">내 보험 바로알기</span>
                </h1>
              </div>

              {/* Hover dynamic result card */}
              <div className="relative z-10 mt-8 bg-white/10 backdrop-blur-md px-6 py-[22px] rounded-2.5xl border border-white/15 shadow-xl inline-block text-left w-full max-w-[320px] transition-transform hover:scale-[1.02]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs uppercase text-brand-green-light font-bold">INSURE CARE DIAL</span>
                  <span className="font-display text-xs text-white/70">85.06.13</span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-brand-green-light font-sans text-xs sm:text-sm font-semibold">{formattedAgeDisplay()}</p>
                    <h2 className="font-sans font-bold text-lg text-white">보험분석 결과 대기</h2>
                  </div>
                  {/* blinking live indicator */}
                  <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 font-bold px-2.5 py-1 rounded text-xs">
                    <span className="w-2 h-2 rounded-full bg-yellow-500 animate-ping"></span>
                    <span>STAND BY</span>
                  </div>
                </div>
              </div>

              {/* Insurance Analysis Consultation Button */}
              <button
                type="button"
                className="relative z-10 mt-4 w-full max-w-[320px] h-12 bg-white/15 hover:bg-white/25 text-white rounded-xl font-bold text-sm sm:text-base backdrop-blur-md border border-white/20 shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                onClick={() => handleChipToggle('item1')}
              >
                <span className="text-base">📊</span>
                <span>보험분석 상담하기</span>
              </button>
            </section>

            {/* EVENT BANNER AD */}
            <section className="w-full border-b border-neutral-border overflow-hidden bg-[#FFDCA8]">
              <img
                src="/coffee_event_banner.jpg?v=3"
                alt="메가커피 증정 이벤트"
                className="w-full h-auto object-cover block"
              />
            </section>

            {/* LIVE APPLICATION FORM SECTION */}
            <section id="signup-form-anchor" className="py-12 px-[15px] bg-white space-y-6 scroll-mt-16">
              <div className="text-center space-y-1.5 max-w-lg mx-auto px-4">
                <p className="text-brand-blue bg-brand-blue-pale text-sm font-display font-bold px-3.5 py-1 rounded-full uppercase tracking-wider inline-block">
                  Bohum Store Service Portal
                </p>
                <h2 className="font-sans font-bold text-xl sm:text-2xl text-neutral-dark flex items-center justify-center gap-1.5">
                  <span className="text-2xl">📝</span> 보험케어 상담 서비스
                </h2>
                <p className="text-xs sm:text-sm text-neutral-gray leading-relaxed text-center">
                  현재 가입된 보장을 종합적으로 점검하고 <br />
                  합리적인 구성을 찾기 위해 필요한 정보를 입력해 주세요.
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="bg-neutral-bg rounded-none p-[5px] border border-neutral-border space-y-5 w-full">
                {/* Checklist radio selection block (Moved to top) */}
                <div className="space-y-2.5 pb-4 border-b border-neutral-border/60">
                  <p className="text-sm sm:text-base font-bold text-neutral-dark flex items-center gap-1.5">
                    <span className="text-[18px]">📋</span>
                    <span>어떤 서비스가 필요하신가요? 선택해 주세요!</span>
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {CHECK_ITEMS.map((item) => {
                      const selected = formData.selectedItems.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleChipToggle(item.id)}
                          className={`h-12 px-2.5 rounded-lg text-sm sm:text-base font-medium border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${selected
                              ? 'bg-brand-blue-pale border-brand-blue text-brand-blue font-bold shadow-sm'
                              : 'bg-white border-neutral-border text-neutral-gray hover:bg-neutral-bg'
                            }`}
                        >
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div id="dynamic-fields-start">
                  {formData.selectedItems.length === 0 && (
                    <div className="w-full mt-4 animate-fade-in">
                      <img
                        src="/guide_image.jpeg?v=3"
                        alt="상담 안내 이미지"
                        className="w-full h-auto rounded-none border border-neutral-border shadow-sm"
                      />
                    </div>
                  )}
                </div>

                {formData.selectedItems.length > 0 && (
                  <>
                    {/* Common Fields */}
                    <div className="pt-2">
                      <p className="text-xs sm:text-sm font-semibold text-neutral-medium border-b border-neutral-border/60 pb-2 flex items-center gap-1.5 mb-1">
                        <User size={16} className="text-brand-blue" />
                        <span>상담 필수 정보 입력</span>
                      </p>
                    </div>

                    {/* Input Name field */}
                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-semibold text-slate-700 block">이름</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          setValidationErrors({ ...validationErrors, name: '' });
                        }}
                        placeholder="이름을 입력하세요."
                        className={`w-full h-12 bg-white rounded-xl border px-4 font-sans text-sm sm:text-base focus:ring-2 focus:outline-none transition-all ${validationErrors.name ? 'border-red-500 focus:ring-red-200' : 'border-neutral-border focus:ring-brand-blue-pale focus:border-brand-blue'
                          }`}
                      />
                      {validationErrors.name && (
                        <p className="text-xs text-red-500 font-medium">{validationErrors.name}</p>
                      )}
                    </div>

                    {/* Phone verification combo */}
                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-semibold text-slate-700 block">연락처</label>
                      <div className="flex gap-2">
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          disabled={formData.isVerified}
                          placeholder="연락처를 입력하세요."
                          className={`flex-[2] h-12 bg-white rounded-xl border px-4 font-sans text-sm sm:text-base focus:ring-2 focus:outline-none transition-all disabled:opacity-75 disabled:bg-neutral-border/20 ${validationErrors.phone ? 'border-red-500 focus:ring-red-200' : 'border-neutral-border focus:ring-brand-blue-pale focus:border-brand-blue'
                            }`}
                        />

                        {formData.isVerified ? (
                          <div className="flex-1 h-12 bg-brand-green/10 text-brand-green rounded-xl text-xs sm:text-sm font-bold border border-brand-green/30 flex items-center justify-center gap-1 shrink-0">
                            <Check size={14} />
                            <span>인증 완료</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={requestVerification}
                            className="flex-1 h-12 bg-white hover:bg-brand-blue border border-brand-blue text-brand-blue hover:text-white rounded-xl text-xs sm:text-sm font-bold transition-colors duration-300 shrink-0 active:scale-95 cursor-pointer"
                          >
                            인증요청
                          </button>
                        )}
                      </div>
                      {validationErrors.phone && (
                        <p className="text-xs text-red-500 font-medium">{validationErrors.phone}</p>
                      )}
                    </div>

                    {/* Birthdate Selector */}
                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-semibold text-slate-700 block">생년월일</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={8}
                        value={formData.birthdate}
                        onChange={(e) => {
                          setFormData({ ...formData, birthdate: formatBirthdate(e.target.value) });
                          setValidationErrors({ ...validationErrors, birthdate: '' });
                        }}
                        placeholder="생년월일 8자리 (예: 19850613)"
                        className={`w-full h-12 bg-white rounded-xl border px-4 font-sans text-sm sm:text-base focus:ring-2 focus:outline-none transition-all ${validationErrors.birthdate ? 'border-red-500 focus:ring-red-200' : 'border-neutral-border focus:ring-brand-blue-pale focus:border-brand-blue'
                          }`}
                      />
                      {validationErrors.birthdate && (
                        <p className="text-xs text-red-500 font-medium">{validationErrors.birthdate}</p>
                      )}
                      {formData.birthdate.length === 8 && !validationErrors.birthdate && (() => {
                        const info = getInsuranceInfo(formData.birthdate);
                        if (!info) return null;
                        const nameStr = formData.name.trim() || '고객';
                        return (
                          <div className="mt-1.5 space-y-1">
                            <p className="text-xs sm:text-sm text-slate-600 font-medium">
                              {nameStr}님의 보험 나이는 <span className="text-brand-blue font-bold">{info.insuranceAge}세</span>이며 다음 상령일까지 <span className="text-brand-blue font-bold">{info.diffDays}일</span> 남았습니다.
                            </p>
                            <p className="text-xs text-neutral-500">
                              ※ 보험회사 상품별, 성별, 연령, 직업 등에 따라 가입 가능한 담보와 가입금액, 보험료 등은 달라질 수 있습니다.
                            </p>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Gender Selectors */}
                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-semibold text-slate-700 block">성별</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleGenderToggle('male')}
                          className={`flex-1 h-12 rounded-xl text-sm sm:text-base font-semibold border transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${formData.gender === 'male'
                              ? 'bg-brand-blue-pale border-brand-blue text-brand-blue font-bold'
                              : 'bg-white border-neutral-border text-neutral-gray hover:bg-neutral-bg'
                            }`}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-all ${formData.gender !== 'male' ? 'opacity-40 grayscale' : ''}`}>
                            <circle cx="12" cy="12" r="12" fill="#3b82f6" />
                            <circle cx="9.5" cy="14.5" r="4" stroke="white" strokeWidth="2" />
                            <path d="M12.5 11.5L17 7M14 7H17V10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span>남성</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleGenderToggle('female')}
                          className={`flex-1 h-12 rounded-xl text-sm sm:text-base font-semibold border transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${formData.gender === 'female'
                              ? 'bg-red-50 border-red-500 text-red-600 font-bold'
                              : 'bg-white border-neutral-border text-neutral-gray hover:bg-neutral-bg'
                            }`}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-all ${formData.gender !== 'female' ? 'opacity-40 grayscale' : ''}`}>
                            <circle cx="12" cy="12" r="12" fill="#ef4444" />
                            <circle cx="12" cy="9.5" r="4.5" stroke="white" strokeWidth="2" />
                            <path d="M12 14V19M9.5 16.5H14.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span>여성</span>
                        </button>
                      </div>
                      {validationErrors.gender && (
                        <p className="text-xs text-red-500 font-medium">{validationErrors.gender}</p>
                      )}
                    </div>

                    {/* Address Selectors */}
                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-semibold text-slate-700 block">주소</label>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <select
                            value={formData.province || ''}
                            onChange={(e) => {
                              setFormData({ ...formData, province: e.target.value, district: '' });
                              setValidationErrors({ ...validationErrors, province: '' });
                            }}
                            className={`w-full h-12 bg-white rounded-xl border px-4 font-sans text-sm sm:text-base focus:ring-2 focus:outline-none transition-all appearance-none cursor-pointer ${validationErrors.province ? 'border-red-500 focus:ring-red-200' : 'border-neutral-border focus:ring-brand-blue-pale focus:border-brand-blue'
                              }`}
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25rem' }}
                          >
                            <option value="" disabled>시/도 선택</option>
                            {Object.keys(REGION_DATA).map(prov => (
                              <option key={prov} value={prov}>{prov}</option>
                            ))}
                          </select>
                          {validationErrors.province && (
                            <p className="text-xs text-red-500 font-medium mt-1">{validationErrors.province}</p>
                          )}
                        </div>
                        <div className="flex-1">
                          <select
                            value={formData.district || ''}
                            onChange={(e) => {
                              setFormData({ ...formData, district: e.target.value });
                              setValidationErrors({ ...validationErrors, district: '' });
                            }}
                            disabled={!formData.province}
                            className={`w-full h-12 bg-white rounded-xl border px-4 font-sans text-sm sm:text-base focus:ring-2 focus:outline-none transition-all appearance-none cursor-pointer disabled:opacity-75 disabled:bg-neutral-border/20 ${validationErrors.district ? 'border-red-500 focus:ring-red-200' : 'border-neutral-border focus:ring-brand-blue-pale focus:border-brand-blue'
                              }`}
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25rem' }}
                          >
                            <option value="" disabled>시/군/구 선택</option>
                            {formData.province && REGION_DATA[formData.province]?.map(dist => (
                              <option key={dist} value={dist}>{dist}</option>
                            ))}
                          </select>
                          {validationErrors.district && (
                            <p className="text-xs text-red-500 font-medium mt-1">{validationErrors.district}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Consult Time Selectors */}
                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-semibold text-slate-700 block">상담 가능 시간</label>
                      <div className="flex gap-2">
                        <div className={!formData.consultTimeType || formData.consultTimeType === '종일' ? "w-full" : "flex-1"}>
                          <select
                            value={formData.consultTimeType || ''}
                            onChange={(e) => {
                              setFormData({ ...formData, consultTimeType: e.target.value, consultTime: '' });
                            }}
                            className="w-full h-12 bg-white rounded-xl border border-neutral-border px-4 font-sans text-sm sm:text-base focus:ring-2 focus:ring-brand-blue-pale focus:border-brand-blue focus:outline-none transition-all appearance-none cursor-pointer"
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25rem' }}
                          >
                            <option value="" disabled>상담시간구분(오전/오후)</option>
                            <option value="종일">종일</option>
                            <option value="오전">오전</option>
                            <option value="오후">오후</option>
                          </select>
                        </div>
                        {formData.consultTimeType && formData.consultTimeType !== '종일' && (
                          <div className="flex-1 animate-fade-in">
                            <select
                              value={formData.consultTime || ''}
                              onChange={(e) => {
                                setFormData({ ...formData, consultTime: e.target.value });
                              }}
                              className="w-full h-12 bg-white rounded-xl border border-neutral-border px-4 font-sans text-sm sm:text-base focus:ring-2 focus:ring-brand-blue-pale focus:border-brand-blue focus:outline-none transition-all appearance-none cursor-pointer"
                              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25rem' }}
                            >
                              <option value="" disabled>시간 선택</option>
                              {[...Array(12)].map((_, i) => {
                                const hour = (i + 1).toString().padStart(2, '0');
                                return <option key={hour} value={`${hour}시`}>{hour}시</option>;
                              })}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Conditional Specific Fields (선택 서비스별 상세 정보 - 상담 가능 시간 아래 배치) */}
                    {formData.selectedItems[0] === 'item1' && (
                      <div className="space-y-4 pt-3 border-t border-neutral-border/60">
                        <p className="text-xs sm:text-sm font-semibold text-neutral-medium flex items-center gap-1.5">
                          <Sparkles size={16} className="text-brand-blue" />
                          <span>보험분석 상담 상세 정보</span>
                        </p>
                        <div className="space-y-1.5">
                          <label className="text-xs sm:text-sm font-semibold text-slate-700 block">관심 있는 보험 종류 (선택)</label>
                          <input
                            type="text"
                            value={formData.analysisInterest || ''}
                            onChange={(e) => setFormData({ ...formData, analysisInterest: e.target.value })}
                            placeholder="예: 암보험, 종신보험, 종합보험 등"
                            className="w-full h-12 bg-white rounded-xl border border-neutral-border px-4 font-sans text-sm sm:text-base focus:ring-2 focus:ring-brand-blue-pale focus:border-brand-blue focus:outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs sm:text-sm font-semibold text-slate-700 block">현재 가입된 보험사 (선택)</label>
                          <input
                            type="text"
                            value={formData.analysisCompany || ''}
                            onChange={(e) => setFormData({ ...formData, analysisCompany: e.target.value })}
                            placeholder="예: 삼성생명, 현대해상 등"
                            className="w-full h-12 bg-white rounded-xl border border-neutral-border px-4 font-sans text-sm sm:text-base focus:ring-2 focus:ring-brand-blue-pale focus:border-brand-blue focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    )}

                    {formData.selectedItems[0] === 'item3' && (
                      <div className="space-y-4 pt-3 border-t border-neutral-border/60">
                        <p className="text-xs sm:text-sm font-semibold text-neutral-medium flex items-center gap-1.5">
                          <FileText size={16} className="text-brand-blue" />
                          <span>보험금 청구 상세 정보</span>
                        </p>
                        <div className="space-y-1.5">
                          <label className="text-xs sm:text-sm font-semibold text-slate-700 block">청구 사유 (선택)</label>
                          <input
                            type="text"
                            value={formData.claimReason || ''}
                            onChange={(e) => setFormData({ ...formData, claimReason: e.target.value })}
                            placeholder="예: 실손의료비, 수술비 등"
                            className="w-full h-12 bg-white rounded-xl border border-neutral-border px-4 font-sans text-sm sm:text-base focus:ring-2 focus:ring-brand-blue-pale focus:border-brand-blue focus:outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs sm:text-sm font-semibold text-slate-700 block">진단명 또는 병원명 (선택)</label>
                          <input
                            type="text"
                            value={formData.hospitalName || ''}
                            onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                            placeholder="예: 위염, OO병원"
                            className="w-full h-12 bg-white rounded-xl border border-neutral-border px-4 font-sans text-sm sm:text-base focus:ring-2 focus:ring-brand-blue-pale focus:border-brand-blue focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    )}

                    {formData.selectedItems[0] === 'item2' && (
                      <div className="space-y-4 pt-3 border-t border-neutral-border/60">
                        <p className="text-xs sm:text-sm font-semibold text-neutral-medium flex items-center gap-1.5">
                          <Zap size={16} className="text-brand-blue" />
                          <span>보험 리모델링 상세 정보</span>
                        </p>
                        <div className="space-y-1.5">
                          <label className="text-xs sm:text-sm font-semibold text-slate-700 block">현재 월 납입액 (선택)</label>
                          <input
                            type="text"
                            value={formData.currentPremium || ''}
                            onChange={(e) => setFormData({ ...formData, currentPremium: e.target.value })}
                            placeholder="예: 약 15만원"
                            className="w-full h-12 bg-white rounded-xl border border-neutral-border px-4 font-sans text-sm sm:text-base focus:ring-2 focus:ring-brand-blue-pale focus:border-brand-blue focus:outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs sm:text-sm font-semibold text-slate-700 block">중점 희망 보장 (선택)</label>
                          <input
                            type="text"
                            value={formData.targetCoverage || ''}
                            onChange={(e) => setFormData({ ...formData, targetCoverage: e.target.value })}
                            placeholder="예: 암, 뇌졸중 등"
                            className="w-full h-12 bg-white rounded-xl border border-neutral-border px-4 font-sans text-sm sm:text-base focus:ring-2 focus:ring-brand-blue-pale focus:border-brand-blue focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    )}

                    {formData.selectedItems[0] === 'item4' && (
                      <div className="space-y-4 pt-3 border-t border-neutral-border/60">
                        <p className="text-xs sm:text-sm font-semibold text-neutral-medium flex items-center gap-1.5">
                          <ShieldCheck size={16} className="text-brand-blue" />
                          <span>내보험 점검 상세 정보</span>
                        </p>
                        <div className="space-y-1.5">
                          <label className="text-xs sm:text-sm font-semibold text-slate-700 block">가장 걱정되는 가족력 (선택)</label>
                          <input
                            type="text"
                            value={formData.concernPoint || ''}
                            onChange={(e) => setFormData({ ...formData, concernPoint: e.target.value })}
                            placeholder="예: 고혈압 가족력이 걱정돼요."
                            className="w-full h-12 bg-white rounded-xl border border-neutral-border px-4 font-sans text-sm sm:text-base focus:ring-2 focus:ring-brand-blue-pale focus:border-brand-blue focus:outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-1.5 mt-3">
                          <label className="text-xs sm:text-sm font-semibold text-slate-700 block">점검하고 싶은 사항 (선택)</label>
                          <input
                            type="text"
                            value={formData.checkRequest || ''}
                            onChange={(e) => setFormData({ ...formData, checkRequest: e.target.value })}
                            placeholder="예: 실비보험 중복 여부 확인등"
                            className="w-full h-12 bg-white rounded-xl border border-neutral-border px-4 font-sans text-sm sm:text-base focus:ring-2 focus:ring-brand-blue-pale focus:border-brand-blue focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    )}

                    {/* Agreement contracts */}
                    <div className="pt-3 border-t border-neutral-border/60 space-y-2.5 select-none">
                      <label className="flex items-center gap-2 cursor-pointer pb-2 border-b border-neutral-border/40">
                        <input
                          type="checkbox"
                          checked={formData.termAll}
                          onChange={(e) => handleTermAllChange(e.target.checked)}
                          className="w-4 h-4 rounded border-neutral-border text-brand-blue focus:ring-brand-blue cursor-pointer"
                        />
                        <strong className="text-xs sm:text-sm text-neutral-dark font-extrabold">전체 동의</strong>
                      </label>

                      <div className="flex justify-between items-center pl-1.5">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.termPrivacy}
                            onChange={(e) => handleTermIndividualChange('termPrivacy', e.target.checked)}
                            className="w-4 h-4 rounded border-neutral-border text-brand-blue focus:ring-brand-blue cursor-pointer"
                          />
                          <span className="text-xs sm:text-[13px] text-neutral-gray flex items-center gap-1 font-semibold">
                            개인정보 수집∙활용 동의
                            <span className="text-red-500 font-bold text-xs">(필수)</span>
                          </span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setActiveTermModal({ isOpen: true, title: '개인정보 수집 및 이용 동의서 (필수)', type: 'privacy' })}
                          className="text-xs text-neutral-500 hover:text-brand-blue underline cursor-pointer"
                        >
                          약관보기
                        </button>
                      </div>

                      <div className="flex justify-between items-center pl-1.5">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.termMarketing}
                            onChange={(e) => handleTermIndividualChange('termMarketing', e.target.checked)}
                            className="w-4 h-4 rounded border-neutral-border text-brand-blue focus:ring-brand-blue cursor-pointer"
                          />
                          <span className="text-xs sm:text-[13px] text-neutral-gray flex items-center gap-1 font-semibold">
                            마케팅 정보 수신 동의
                            <span className="text-neutral-400 text-xs select-none">(선택)</span>
                          </span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setActiveTermModal({ isOpen: true, title: '마케팅 활용 및 광고성 정보 수신 동의서 (선택)', type: 'marketing' })}
                          className="text-xs text-neutral-500 hover:text-brand-blue underline cursor-pointer"
                        >
                          상세보기
                        </button>
                      </div>

                      {validationErrors.terms && (
                        <p className="text-xs text-red-500 font-medium pt-1">{validationErrors.terms}</p>
                      )}
                    </div>

                    {/* Main Action submit button */}
                    <button
                      type="submit"
                      className="w-full md:w-1/2 mx-auto h-12 bg-brand-blue text-white rounded-xl font-bold text-sm sm:text-base tracking-wide shadow-lg shadow-brand-blue/15 hover:bg-brand-blue-hover active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
                    >
                      <ShieldCheck size={20} />
                      <span>보험케어 상담하기</span>
                    </button>
                  </>
                )}
              </form>
            </section>

            {/* PROMO BANNER SECTION */}
            <section className="w-full flex justify-center py-8 px-5">
              <div className="w-full max-w-[726px]">
                <img src="/report_banner.jpg?v=3" alt="30개 주요 보험사 정밀 비교 리포트 무료 제공" className="w-full h-auto rounded-2xl shadow-md" />
              </div>
            </section>

            {/* INFORMATION SECTION: WHY */}
            <section className="py-14 px-5 bg-neutral-bg text-center space-y-6">
              <div className="space-y-1.5 max-w-sm mx-auto">
                <span className="text-brand-blue bg-brand-blue-pale text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Need for review
                </span>
                <h2 className="font-sans font-bold text-2xl text-neutral-dark flex items-center justify-center gap-2">
                  <span className="text-3xl">🤔</span> 보험분석, 왜 필요할까요?
                </h2>
                <p className="text-xs text-neutral-gray leading-relaxed">
                  현재 보유 중인 보험의 보장 범위와 구성을 객관적으로 점검하여 효율적인 유지 관리를 돕습니다.
                </p>
              </div>

              {/* Bento informational block structure */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-left font-sans">
                <div className="bg-white p-4.5 rounded-xl border border-neutral-border shadow-sm flex gap-3.5 items-start">
                  <div className="w-9 h-9 rounded-full bg-brand-blue-pale text-brand-blue flex items-center justify-center font-bold text-xs shrink-0">
                    01
                  </div>
                  <div className="space-y-1">
                    <strong className="text-xs font-bold text-neutral-dark block leading-normal">중복가입 정리로<br />보장 공백 해소</strong>
                    <p className="text-xs text-neutral-gray leading-relaxed">중복 가입된 보장 내용을 정리하고 부족한 부분을 채워 맞춤 플랜으로 재설계</p>
                  </div>
                </div>

                <div className="bg-white p-4.5 rounded-xl border border-neutral-border shadow-sm flex gap-3.5 items-start">
                  <div className="w-9 h-9 rounded-full bg-brand-blue-pale text-brand-blue flex items-center justify-center font-bold text-xs shrink-0">
                    02
                  </div>
                  <div className="space-y-1">
                    <strong className="text-xs font-bold text-neutral-dark block leading-normal">주요 보험사별<br />보장 조건 객관적 대조</strong>
                    <p className="text-xs text-neutral-gray leading-relaxed">생보사 및 손보사 32개사 약관을 대조하여 고객에게 가장 적합한 조건 탐색</p>
                  </div>
                </div>

                <div className="bg-white p-4.5 rounded-xl border border-neutral-border shadow-sm flex gap-3.5 items-start">
                  <div className="w-9 h-9 rounded-full bg-brand-blue-pale text-brand-blue flex items-center justify-center font-bold text-xs shrink-0">
                    03
                  </div>
                  <div className="space-y-1">
                    <strong className="text-xs font-bold text-neutral-dark block leading-normal">내 소득 상황에<br />맞는 균형 잡힌 설계</strong>
                    <p className="text-xs text-neutral-gray leading-relaxed">가계 소득 대비 무리 없는 범위 안에서 안정적으로 유지 가능한 포트폴리오 설계</p>
                  </div>
                </div>
              </div>

              {/* Kakao Talk Banner */}
              <div className="w-full mt-8 mb-4">
                <a
                  href={KAKAO_CHAT_URL}
                  onClick={handleKakaoConsultation}
                  className="block hover:opacity-95 transition-opacity cursor-pointer"
                >
                  <img src="/kakao_banner.jpg?v=orig" alt="카카오톡 상담 바로가기" className="w-full h-auto rounded-2xl shadow-lg object-cover" />
                </a>
              </div>


            </section>

            {/* Before / After section modular */}
            <BeforeAfterSection onConsultClick={() => handleChipToggle('item2')} />

            {/* FINAL CONVERSION PERSUADE WRAPPER */}
            <section className="py-14 px-5 bg-white text-center space-y-6">

              {/* Tab Selector */}
              <div className="flex bg-neutral-bg p-1.5 rounded-2xl max-w-[340px] mx-auto border border-neutral-border mb-8">
                <button
                  type="button"
                  onClick={() => setIsDashboardFlipped(false)}
                  className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer ${!isDashboardFlipped
                      ? 'bg-white text-neutral-dark shadow-sm border border-neutral-200'
                      : 'text-neutral-gray hover:text-neutral-dark'
                    }`}
                >
                  보험분석 결과
                </button>
                <button
                  type="button"
                  onClick={() => setIsDashboardFlipped(true)}
                  className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer ${isDashboardFlipped
                      ? 'bg-white text-neutral-dark shadow-sm border border-neutral-200'
                      : 'text-neutral-gray hover:text-neutral-dark'
                    }`}
                >
                  보험금 청구 조회
                </button>
              </div>

              {/* 3D Flip Container wrapper */}
              <div
                className="max-w-[340px] mx-auto relative cursor-pointer"
                style={{ perspective: '1200px' }}
                onClick={() => setIsDashboardFlipped(!isDashboardFlipped)}
              >
                <div
                  className="w-full relative transition-transform duration-700 ease-in-out"
                  style={{ transformStyle: 'preserve-3d', transform: isDashboardFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)' }}
                >
                  {/* FRONT FACE */}
                  <div
                    className="w-full flex flex-col items-center"
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                  >
                    <div className="space-y-2 text-center max-w-sm mx-auto mb-8">
                      <h2 className="font-sans font-extrabold text-2xl text-neutral-dark leading-tight">
                        보험분석 결과를<br />
                        눈으로 직접 확인하세요.
                      </h2>
                      <p className="text-xs sm:text-sm text-neutral-gray leading-relaxed">
                        신청 즉시 보험 가입 내역서가 생성되며, 담당 수석이 보험 가입 내역 및 보고서를 카카오톡 및 문자메시지로 보내드립니다.
                      </p>
                    </div>

                    <div className="max-w-[340px] w-full relative select-none group">
                      <div className="w-full bg-white rounded-[2.5rem] p-2 sm:p-2.5 shadow-2xl border-4 sm:border-8 border-neutral-100 relative z-10 overflow-hidden transform group-hover:-translate-y-2 transition-transform duration-500">
                        {/* Speaker Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-5 bg-neutral-100 rounded-b-xl z-20"></div>

                        {/* Screen Content */}
                        <div className="bg-slate-50 w-full h-[600px] rounded-[1.8rem] overflow-hidden flex flex-col font-sans border border-neutral-100 relative">

                          {/* Header */}
                          <div className="bg-brand-blue pt-8 pb-5 px-4 text-left relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 animate-pulse-slow"></div>
                            <span className="text-white/80 text-xs font-medium">보드미 AI 리포트</span>
                            <h4 className="text-white font-extrabold text-base mt-0.5">38세 박*검님의<br />종합 보장 점수</h4>

                            {/* Animated Score */}
                            <div className="absolute right-4 bottom-4 flex items-baseline gap-0.5">
                              <span className="text-3xl font-black text-white group-hover:scale-110 transition-transform origin-bottom duration-300">85</span>
                              <span className="text-white/80 text-sm font-bold">점</span>
                            </div>
                          </div>

                          {/* Chart Body */}
                          <div className="flex-1 p-4 space-y-4">

                            {/* Bar 1: Score Progress */}
                            <div className="bg-white p-3.5 rounded-xl shadow-sm border border-neutral-100 group-hover:border-brand-blue/30 transition-colors">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-neutral-dark">보장 충분도</span>
                                <span className="text-xs font-bold text-brand-blue animate-pulse">우수해요</span>
                              </div>
                              <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                                <div className="bg-brand-blue h-full rounded-full w-[85%] relative overflow-hidden">
                                  <div className="absolute top-0 bottom-0 -left-10 w-20 bg-white/20 -skew-x-12 translate-x-32 group-hover:translate-x-64 transition-transform duration-1000 ease-in-out delay-100"></div>
                                </div>
                              </div>
                            </div>

                            {/* Bar 2: Premium Comparison */}
                            <div className="bg-white p-3.5 rounded-xl shadow-sm border border-neutral-100">
                              <h5 className="text-xs font-bold text-neutral-dark mb-2">보장 구성 점검 예시</h5>

                              <div className="space-y-2">
                                <div>
                                  <div className="flex justify-between items-end mb-1">
                                    <span className="text-[11px] text-neutral-gray">기존 가입 구성</span>
                                    <span className="text-xs font-bold text-neutral-dark">총 5건 (중복 포함)</span>
                                  </div>
                                  <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-neutral-300 h-full rounded-full w-full"></div>
                                  </div>
                                </div>

                                <div className="relative">
                                  <div className="flex justify-between items-end mb-1">
                                    <span className="text-[11px] font-bold text-brand-blue">재구성 제안 플랜</span>
                                    <span className="text-xs font-extrabold text-brand-blue">총 3건 (필수 보장 집중)</span>
                                  </div>
                                  <div className="w-full bg-brand-blue-pale rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-brand-blue h-full rounded-full w-[70%]"></div>
                                  </div>
                                  {/* Animated Saving Badge */}
                                  <div className="absolute -right-2 -top-6 bg-brand-blue text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                                    보장 정비
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Info Cards */}
                            <div className="grid grid-cols-2 gap-2">
                              <div className="bg-red-50 p-2.5 rounded-lg border border-red-100 flex flex-col justify-center hover:bg-red-100 transition-colors cursor-default">
                                <span className="text-[11px] text-red-500 font-bold block mb-0.5">중복 특약</span>
                                <strong className="text-xs sm:text-sm text-red-600">2건 정비 대상</strong>
                              </div>
                              <div className="bg-brand-blue-pale p-2.5 rounded-lg border border-brand-blue/20 flex flex-col justify-center hover:bg-blue-100 transition-colors cursor-default">
                                <span className="text-[11px] text-brand-blue font-bold block mb-0.5">필수 보장</span>
                                <strong className="text-xs sm:text-sm text-brand-blue font-extrabold">2개 영역 보강</strong>
                              </div>
                            </div>

                            {/* AI Expert Recommendation Box (Fills the new empty space) */}
                            <div className="bg-[#eef3f9] rounded-xl p-4 shadow-sm border border-[#d1e0f0] relative overflow-hidden">
                              <div className="absolute -right-4 -bottom-4 opacity-10">
                                <Sparkles size={64} />
                              </div>
                              <div className="relative z-10">
                                <div className="flex items-center gap-1.5 mb-2">
                                  <div className="w-5 h-5 bg-[#0055d3] text-white rounded-full flex items-center justify-center">
                                    <Sparkles size={11} />
                                  </div>
                                  <h5 className="text-xs font-black text-[#0055d3]">전문 컨설팅 제안</h5>
                                </div>
                                <p className="text-xs text-neutral-dark font-bold leading-relaxed mb-1">
                                  불필요한 중복은 줄이고, 꼭 필요한 보장은 든든하게!
                                </p>
                                <p className="text-[11px] text-neutral-gray leading-relaxed">
                                  전문 상담사가 1:1 맞춤형 보장 분석 리포트를 준비해 드립니다.
                                </p>
                                <button className="mt-3 w-full bg-white text-[#0055d3] font-bold text-xs py-2 rounded-lg shadow-sm border border-[#0055d3]/20 hover:bg-[#0055d3] hover:text-white transition-colors cursor-pointer">
                                  상세 리포트 확인하기
                                </button>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                      {/* Decorative background blobs */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-brand-blue/5 to-transparent rounded-full blur-3xl -z-10"></div>
                    </div>
                  </div>

                  {/* BACK FACE */}
                  <div
                    className="absolute top-0 left-0 w-full flex flex-col items-center"
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <div className="space-y-2 text-center max-w-sm mx-auto mb-8">
                      <h2 className="font-sans font-extrabold text-2xl text-neutral-dark leading-tight">
                        보험금 청구 조회를<br />
                        눈으로 직접 확인하세요.
                      </h2>
                      <p className="text-xs sm:text-sm text-neutral-gray leading-relaxed">
                        흩어진 청구 내역을 한곳에 모아 실시간 진행 상태를 확인하고, 추가 보상 가능성까지 꼼꼼하게 점검해 드립니다.
                      </p>
                    </div>

                    <div className="max-w-[340px] w-full relative select-none group">
                      <div className="w-full bg-white rounded-[2.5rem] p-2 sm:p-2.5 shadow-2xl border-4 sm:border-8 border-neutral-100 relative z-10 overflow-hidden transform group-hover:-translate-y-2 transition-transform duration-500">
                        {/* Speaker Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-5 bg-neutral-100 rounded-b-xl z-20"></div>

                        {/* Screen Content - BACK FACE UI */}
                        <div className="bg-[#f8f9fa] w-full h-[600px] rounded-[1.8rem] flex flex-col font-sans border border-neutral-100 relative overflow-hidden text-left">
                          <div className="p-3.5 space-y-3 pb-8">

                            {/* TOP WIDGETS */}
                            <div className="flex gap-2">
                              {/* Left Widget */}
                              <div className="flex-1 bg-gradient-to-br from-[#6b4cfa] to-[#5136e0] rounded-xl p-3 text-white relative overflow-hidden shadow-sm">
                                {/* Shield Watermark */}
                                <div className="absolute -right-2 -top-2 opacity-20">
                                  <ShieldCheck size={64} />
                                </div>
                                <p className="text-[10px] font-bold opacity-90 mb-1">보험금 청구 내역</p>
                                <div className="flex items-baseline gap-0.5 relative z-10">
                                  <span className="text-2xl font-black">1</span>
                                  <span className="text-xs opacity-90">건 접수됨</span>
                                </div>
                                <div className="flex gap-1.5 mt-3 relative z-10">
                                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm"><Car size={11} /></div>
                                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm"><Home size={11} /></div>
                                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm"><Heart size={11} /></div>
                                </div>
                              </div>

                              {/* Right Widget */}
                              <div className="flex-1 bg-[#0055d3] rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
                                {/* Zap Watermark */}
                                <div className="absolute -right-2 -top-2 opacity-20">
                                  <Zap size={64} fill="currentColor" className="text-white" />
                                </div>
                                <p className="text-xs font-bold text-white leading-tight relative z-10">전문가 실시간 상담</p>
                                <p className="text-[10px] text-white/90 mt-1 leading-tight relative z-10">전문가와 실시간 상담을 받아<br />보세요!</p>
                              </div>
                            </div>

                            {/* 진행 프로세스 Title */}
                            <h3 className="text-xs sm:text-sm font-black text-neutral-dark pt-1">진행 프로세스</h3>

                            {/* Process Card */}
                            <div className="bg-white rounded-xl border border-neutral-border p-3 shadow-sm">
                              {/* Header */}
                              <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-2">
                                  <div className="w-8 h-8 rounded-lg bg-[#eef3f9] flex items-center justify-center text-[#0055d3]">
                                    <Car size={16} />
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-bold text-neutral-dark">보험금 청구 진행 단계</h4>
                                    <p className="text-[10px] text-neutral-gray mt-0.5">신청날짜: 2026-05-03</p>
                                  </div>
                                </div>
                                <div className="bg-[#e6f8ef] text-[#1ebf00] px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-[#bbf0d4]">
                                  승인
                                </div>
                              </div>

                              {/* Stepper */}
                              <div className="relative px-2 mb-4">
                                <div className="absolute top-2.5 left-4 right-4 h-0.5 bg-neutral-200 -z-10"></div>
                                {/* Blue completed line */}
                                <div className="absolute top-2.5 left-4 w-[60%] h-0.5 bg-[#0055d3] -z-10"></div>

                                <div className="flex justify-between">
                                  {['접수', '진행', '심사', '조사', '승인', '입금'].map((step, idx) => {
                                    const isCompleted = idx < 4;
                                    const isCurrent = idx === 4;
                                    return (
                                      <div key={idx} className="flex flex-col items-center gap-1 bg-white">
                                        {isCompleted ? (
                                          <div className="w-5 h-5 rounded-full bg-[#0055d3] text-white flex items-center justify-center z-10">
                                            <Check size={10} strokeWidth={3} />
                                          </div>
                                        ) : isCurrent ? (
                                          <div className="w-5 h-5 rounded-full bg-[#1ebf00] text-white flex items-center justify-center font-bold text-[10px] z-10">
                                            {idx + 1}
                                          </div>
                                        ) : (
                                          <div className="w-5 h-5 rounded-full bg-white border border-neutral-300 text-neutral-400 flex items-center justify-center font-bold text-[10px] z-10">
                                            {idx + 1}
                                          </div>
                                        )}
                                        <span className={`text-[9px] font-bold ${isCurrent ? 'text-[#1ebf00]' : isCompleted ? 'text-[#0055d3]' : 'text-neutral-500'}`}>
                                          {step}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="border-t border-neutral-100 pt-2.5 mt-1 flex justify-between text-[10px] text-neutral-gray">
                                <span><span className="text-neutral-400 mr-0.5">•</span>신청자: <strong className="text-neutral-dark">박*검</strong></span>
                                <span><span className="text-neutral-400 mr-0.5">•</span>생년월일: <strong className="text-neutral-dark">19880123</strong></span>
                                <span><span className="text-neutral-400 mr-0.5">•</span>성별: <strong className="text-neutral-dark">남성</strong></span>
                              </div>
                            </div>

                            {/* Status Card */}
                            <div className="bg-white rounded-xl border border-neutral-border p-3 flex gap-3 shadow-sm items-center">
                              <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-dark shrink-0">
                                <FileText size={16} />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-neutral-dark">보험금 청구 조회 연동</h4>
                                <p className="text-[10px] text-[#1ebf00] font-bold mt-0.5 flex items-center gap-1">
                                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#1ebf00] to-[#7fdf66] inline-block"></span>
                                  정상적으로 연결되었습니다.
                                </p>
                              </div>
                            </div>

                            {/* Missing Documents Warning */}
                            <div className="bg-[#eef3f9] rounded-xl p-3.5 shadow-sm">
                              <h4 className="text-xs font-black text-[#0055d3] mb-1.5">누락된 서류가 있나요?</h4>
                              <p className="text-[11px] text-neutral-gray leading-relaxed mb-3">
                                보험금 청구 신청 정보의 카카오톡 알림톡을 통해 누락 서류 제출 및 보완 요청이 신속히 안내됩니다.
                              </p>
                              <button className="w-full bg-white text-[#0055d3] border border-[#d1e0f0] font-bold text-xs py-2 rounded-lg shadow-sm hover:bg-[#f8fafd] transition-colors cursor-pointer">
                                안내 문서 확인하기
                              </button>
                            </div>

                          </div>
                        </div>
                      </div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-brand-blue/5 to-transparent rounded-full blur-3xl -z-10"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => handleChipToggle('item4')}
                  className="flex justify-center w-full md:w-1/2 mx-auto items-center gap-2 bg-brand-blue hover:bg-brand-blue-hover text-white px-8 py-4 rounded-xl font-bold text-sm sm:text-base shadow-lg shadow-brand-blue/10 active:scale-95 transition-all cursor-pointer"
                >
                  <span>내보험 점검 상담하기</span>
                </button>
              </div>
            </section>

            {/* Process Section modular */}
            <ProcessSection onClaimClick={() => handleChipToggle('item3')} />

            {/* PARTNER NETWORKS / EXPERT BRAND GRID */}
            {/* MANDATORY COMPLIANCE DISCLAIMER */}
            <section className="bg-slate-900 text-slate-300 p-6 font-sans text-xs border-t border-slate-800">
              <div className="max-w-[768px] mx-auto space-y-3">
                <div className="border border-slate-700 bg-slate-950/60 p-4 rounded-xl space-y-2">
                  <p className="font-extrabold text-white text-sm">【 필수 안내 사항 】</p>
                  <div className="text-slate-300 text-xs space-y-1">
                    <p>• <strong>대리점 및 모집종사자:</strong> (주)프라임에셋 보험대리점 / 설계사 유영환 (손·생보 협회 등록번호: 제20051077110001호)</p>
                    <p>• <strong>심의필 번호:</strong> 프라임에셋 심의필 제2026-08-0001호 (2026.08.21 ~ 2027.08.20)</p>
                    <p className="text-amber-300 font-medium">• <strong>심의 준수 및 유효기간:</strong> 본 광고는 광고심의기준을 준수하였으며, 유효기간은 심의일로부터 1년입니다.</p>
                  </div>
                  
                  <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1.5 leading-relaxed">
                    <p>• <strong>[해지 및 재계약 시 불이익]</strong> 보험계약자가 기존 보험계약을 해지하고 새로운 보험계약을 체결하는 과정에서 ① 질병이력, 연령증가 등으로 가입이 거절되거나 보험료가 인상될 수 있습니다. ② 가입 상품에 따라 새로운 면책기간 적용 및 보장 제한 등 기타 불이익이 발생할 수 있습니다.</p>
                    <p>• <strong>[개인의견 고지]</strong> 본 내용은 모집종사자 개인의 의견이며, 계약 체결에 따른 이익 또는 손실은 보험계약자 등에게 귀속됩니다.</p>
                    <p>• <strong>[약관 참조 안내]</strong> 보험사 및 상품별로 상이할 수 있으므로, 관련한 세부사항은 반드시 해당 약관을 참조하시기 바랍니다.</p>
                    <p>• <strong>[보험료 변동가능성]</strong> 보험회사 상품별, 성별, 연령, 직업 등에 따라 가입가능한 담보와 가입금액, 보험료 등은 달라질 수 있습니다.</p>
                    <p>• <strong>[실손의료비보험 안내]</strong> 실비보험은 자기부담금을 제외한 금액을 보장하는 보험입니다. (실손의료비보험은 가입시기별로 보상한도/보장범위/면책사항 등이 다를 수 있습니다)</p>
                    <p>• <strong>[운전자보험 안내]</strong> 12대 중과실 중 무면허, 음주운전 및 뺑소니 사고는 보장에서 제외됩니다.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* LOWER COOPERATIVE BUSINESS FOOTER */}
            <footer className="bg-neutral-bg border-t border-neutral-border">
              <div className="w-full py-8 px-5 flex flex-col gap-5 max-w-container-max mx-auto font-sans">
                <div className="flex justify-between items-end flex-wrap gap-4 border-b border-neutral-border pb-4">
                  <span className="font-display text-xl font-black text-neutral-dark tracking-tight">InsureCare.</span>
                  <div className="flex gap-4.5 text-xs">
                    <span className="font-bold text-neutral-medium">(주)프라임에셋</span>
                    <button
                      onClick={() => setActiveTermModal({ isOpen: true, title: '핀토스 보험케어 개인정보 처리방침 (수집·이용 동의)', type: 'privacy' })}
                      className="font-bold text-brand-blue underline cursor-pointer"
                    >
                      개인정보처리방침
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-1.5 text-[11px] text-neutral-gray leading-relaxed">
                  <p><strong>상호:</strong> (주)프라임에셋 보험대리점  |  <strong>모집종사자:</strong> 설계사 유영환 (협회등록번호: 제20051077110001호)</p>
                  <p><strong>대표 문의:</strong> 010-2627-7771  |  <strong>개인정보관리책임자:</strong> 유영환</p>
                  <p className="text-[10px] text-neutral-muted mt-2">© 2026 InsureCare Co., Ltd. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </>
        )}

      </main>

      {/* RENDER MODAL LAYERS FOR AUTH/TERMS/carrier RECOMMENCES */}

      {/* 1. SMS Verification OTP Modal */}
      <SMSVerificationModal
        isOpen={isSMSOtpOpen}
        onClose={() => setIsSMSOtpOpen(false)}
        phoneNumber={formData.phone}
        onVerifySuccess={handleVerifySuccess}
      />

      {/* 2. Standard interactive Terms Modal */}
      <AgreementModal
        isOpen={activeTermModal.isOpen}
        title={activeTermModal.title}
        type={activeTermModal.type}
        onClose={() => setActiveTermModal({ ...activeTermModal, isOpen: false })}
      />

      {/* 3. Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[320px] p-6 text-center transform transition-all">
            <div className="w-14 h-14 bg-brand-blue/10 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={28} strokeWidth={3} />
            </div>
            <h3 className="text-[17px] font-extrabold text-neutral-dark mb-2">상담신청이 완료되었습니다.</h3>
            <p className="text-[13px] text-neutral-gray mb-6 leading-relaxed">빠른 시간에 연락 드리겠습니다.</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full h-12 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl font-bold text-[14px] transition-colors active:scale-95"
            >
              확인
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
