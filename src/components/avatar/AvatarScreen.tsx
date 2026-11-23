import React, { useState } from 'react';
import {
  Sparkles,
  Paintbrush,
  Heart,
  Lock,
  Edit3,
  Check,
  X,
  Volume2,
  Smile,
  CloudRain,
  Moon,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCouple } from '../../context/CoupleContext';

export type AvatarState = 'online' | 'typing' | 'sleeping' | 'offline' | 'happy' | 'sad';

export interface AvatarConfiguration {
  skinTone: string;
  bodyType: 'slim' | 'average' | 'athletic';
  hairStyle: string;
  hairColor: string;
  eyeColor: string;
  expression: 'happy' | 'neutral' | 'sad' | 'surprised';
  shirt: string;
  pants: string;
  shoes: string;
  hat: string;
  glasses: string;
  jewelry: string;
}

const SKIN_TONES = [
  { id: 'skin_fair', name: 'Fair Porcelain', color: '#FFDFC4' },
  { id: 'skin_peach', name: 'Warm Peach', color: '#F0C8A0' },
  { id: 'skin_olive', name: 'Sunlit Olive', color: '#D4A373' },
  { id: 'skin_caramel', name: 'Warm Caramel', color: '#B07D62' },
  { id: 'skin_chestnut', name: 'Rich Chestnut', color: '#8C533C' },
  { id: 'skin_deep', name: 'Deep Espresso', color: '#4A2810' }
];

const HAIR_STYLES = [
  { id: 'short_wave', name: 'Short Waves', emoji: '💇' },
  { id: 'long_curls', name: 'Long Curls', emoji: '👩‍🦱' },
  { id: 'ponytail', name: 'High Ponytail', emoji: '👱‍♀️' },
  { id: 'bob', name: 'French Bob', emoji: '👩' },
  { id: 'messy_shag', name: 'Messy Shag', emoji: '🧑' },
  { id: 'buzz', name: 'Clean Fade', emoji: '👨‍🦲' },
  { id: 'space_buns', name: 'Space Buns', emoji: '👧' },
  { id: 'sleek', name: 'Sleek Straight', emoji: '👩‍🦰' }
];

const HAIR_COLORS = [
  { id: 'espresso', name: 'Espresso', color: '#2C1D11' },
  { id: 'blonde', name: 'Golden Honey', color: '#E8C172' },
  { id: 'rose', name: 'Pastel Rose', color: '#E8A5B9' },
  { id: 'black', name: 'Midnight Black', color: '#141416' },
  { id: 'auburn', name: 'Auburn Ginger', color: '#9E472A' },
  { id: 'lavender', name: 'Soft Lavender', color: '#B5A6D6' }
];

const EYE_COLORS = [
  { id: 'brown', name: 'Deep Amber', color: '#5A3825' },
  { id: 'blue', name: 'Ocean Blue', color: '#3B82F6' },
  { id: 'green', name: 'Forest Green', color: '#10B981' },
  { id: 'hazel', name: 'Warm Hazel', color: '#8B6B48' },
  { id: 'amber', name: 'Golden Topaz', color: '#D97706' },
  { id: 'violet', name: 'Mystic Violet', color: '#8B5CF6' }
];

const SHIRTS = [
  { id: 'knit', name: 'Cozy Knit Sweater', emoji: '🧶', color: '#F3C5D0' },
  { id: 'hoodie', name: 'Pastel Hoodie', emoji: '🧥', color: '#D8B4E2' },
  { id: 'blouse', name: 'Romantic Silk Blouse', emoji: '👚', color: '#FFF0F5' },
  { id: 'striped', name: 'Parisian Striped Tee', emoji: '👕', color: '#334155' },
  { id: 'denim', name: 'Vintage Denim Jacket', emoji: '🧥', color: '#4A7B9D' },
  { id: 'pajama', name: 'Satin Lounge Top', emoji: '🥼', color: '#FFE4E1' },
  { id: 'graphic', name: 'Heart Graphic Tee', emoji: '👕', color: '#9B4D6F' },
  { id: 'turtleneck', name: 'Chic Turtleneck', emoji: '🥼', color: '#1E293B' },
  { id: 'buttondown', name: 'Crisp Oxford Shirt', emoji: '👔', color: '#E2E8F0' },
  { id: 'croptop', name: 'Sweet Floral Crop', emoji: '👚', color: '#FFD1DC' }
];

const PANTS = [
  { id: 'jeans', name: 'High-Rise Jeans', emoji: '👖', color: '#3B82F6' },
  { id: 'sweatpants', name: 'Cloud Joggers', emoji: '🩳', color: '#E2E8F0' },
  { id: 'skirt', name: 'Pleated Rose Skirt', emoji: '👗', color: '#E8A5B9' },
  { id: 'linen', name: 'Linen Trousers', emoji: '👖', color: '#FFF4E6' },
  { id: 'cargo', name: 'Utility Cargos', emoji: '👖', color: '#78716C' },
  { id: 'fluffy', name: 'Pajama Shorts', emoji: '🩳', color: '#FFE4E6' },
  { id: 'denimshorts', name: 'Classic Cutoffs', emoji: '🩳', color: '#60A5FA' },
  { id: 'chinos', name: 'Relaxed Chinos', emoji: '👖', color: '#94A3B8' }
];

const SHOES = [
  { id: 'sneakers', name: 'Chunky Retro Sneakers', emoji: '👟', color: '#FFFFFF' },
  { id: 'canvas', name: 'Low-Top Canvas', emoji: '👟', color: '#9B4D6F' },
  { id: 'slippers', name: 'Fuzzy Bunny Slippers', emoji: '🥿', color: '#FFC0CB' },
  { id: 'loafers', name: 'Leather Loafers', emoji: '👞', color: '#473322' },
  { id: 'boots', name: 'Cozy Ankle Boots', emoji: '🥾', color: '#8B5E3C' },
  { id: 'sandals', name: 'Cloud Slides', emoji: '🩴', color: '#FEE2E2' }
];

const HATS = [
  { id: 'none', name: 'No Headwear', emoji: '🚫' },
  { id: 'beanie', name: 'Soft Knit Beanie', emoji: '🧶' },
  { id: 'bucket', name: 'Pastel Bucket Hat', emoji: '👒' },
  { id: 'beret', name: 'Wool Beret', emoji: '🎨' },
  { id: 'catears', name: 'Cat Ears Headband', emoji: '🐱' },
  { id: 'cap', name: 'Baseball Cap', emoji: '🧢' }
];

const GLASSES = [
  { id: 'none', name: 'No Glasses', emoji: '🚫' },
  { id: 'round', name: 'Round Wireframes', emoji: '👓' },
  { id: 'cateye', name: 'Cat-Eye Frames', emoji: '👓' },
  { id: 'sunglasses', name: 'Retro Sunglasses', emoji: '🕶️' }
];

const JEWELRY = [
  { id: 'none', name: 'No Jewelry', emoji: '🚫' },
  { id: 'heart', name: 'Heart Pendant', emoji: '💖' },
  { id: 'pearl', name: 'Pearl Choker', emoji: '🦪' },
  { id: 'hoops', name: 'Gold Hoops', emoji: '💍' },
  { id: 'stars', name: 'Star Earrings', emoji: '⭐' }
];

// 3D Avatar Visual Component (200px)
const Avatar3DCanvas: React.FC<{
  config: AvatarConfiguration;
  state: AvatarState;
  size?: number;
}> = ({ config, state, size = 200 }) => {
  const skin = SKIN_TONES.find((s) => s.id === config.skinTone) || SKIN_TONES[0];
  const hair = HAIR_COLORS.find((h) => h.id === config.hairColor) || HAIR_COLORS[0];
  const eye = EYE_COLORS.find((e) => e.id === config.eyeColor) || EYE_COLORS[0];
  const shirt = SHIRTS.find((s) => s.id === config.shirt) || SHIRTS[0];
  const pant = PANTS.find((p) => p.id === config.pants) || PANTS[0];
  const shoe = SHOES.find((s) => s.id === config.shoes) || SHOES[0];

  const isSleeping = state === 'sleeping';
  const isHappy = state === 'happy';
  const isSad = state === 'sad';
  const isTyping = state === 'typing';
  const isOffline = state === 'offline';

  return (
    <div
      className={`relative mx-auto flex items-center justify-center transition-all duration-300 ${
        isOffline ? 'opacity-40 grayscale' : 'opacity-100'
      }`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {/* 3D Soft Radial Lighting / Pedestal */}
      <div
        className="absolute inset-0 rounded-full blur-xl pointer-events-none transition-all duration-500"
        style={{
          background: isHappy
            ? 'radial-gradient(circle, rgba(232,165,185,0.4) 0%, transparent 70%)'
            : isSleeping
            ? 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)'
            : isSad
            ? 'radial-gradient(circle, rgba(100,116,139,0.3) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255,244,230,0.8) 0%, transparent 70%)'
        }}
      />

      {/* Ground Shadow */}
      <div className="absolute bottom-2 w-32 h-4 rounded-full bg-black/15 blur-sm" />

      {/* Living Avatar Figure */}
      <div
        className={`relative z-10 flex flex-col items-center transition-transform duration-300 ${
          isSleeping ? 'rotate-12 translate-y-3' : isTyping ? 'animate-pulse' : isHappy ? 'animate-bounce' : 'animate-subtle-float'
        }`}
      >
        {/* Headwear Accessory */}
        {config.hat === 'catears' && (
          <div className="absolute -top-4 w-28 flex justify-between px-2 text-xl pointer-events-none">
            <span>🐱</span>
            <span>🐱</span>
          </div>
        )}
        {config.hat === 'beanie' && (
          <div className="absolute -top-3 w-20 h-8 rounded-t-full bg-[#9B4D6F] shadow-sm z-20" />
        )}
        {config.hat === 'beret' && (
          <div className="absolute -top-2 w-20 h-6 rounded-full bg-[#473322] rotate-6 shadow-sm z-20" />
        )}

        {/* Head Container */}
        <div className="relative">
          {/* Hair back / top */}
          <div
            className="w-24 h-24 rounded-full absolute -top-1 -left-1 shadow-md z-0 transition-colors"
            style={{ backgroundColor: hair.color }}
          />

          {/* Face (Skin tone) */}
          <div
            className="relative z-10 w-22 h-22 rounded-full flex flex-col items-center justify-center shadow-inner transition-colors"
            style={{
              backgroundColor: skin.color,
              width: '84px',
              height: '84px'
            }}
          >
            {/* Rosy Cheeks */}
            <div className="absolute bottom-6 w-16 flex justify-between px-1">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-400/40 blur-[1px]" />
              <span className="w-3.5 h-3.5 rounded-full bg-rose-400/40 blur-[1px]" />
            </div>

            {/* Eyes */}
            <div className="flex items-center justify-between w-11 mt-1 z-10">
              {isSleeping ? (
                <>
                  <span className="text-xs font-bold text-slate-800">〰</span>
                  <span className="text-xs font-bold text-slate-800">〰</span>
                </>
              ) : isHappy || config.expression === 'happy' ? (
                <>
                  <span className="text-xs font-bold text-slate-800">^</span>
                  <span className="text-xs font-bold text-slate-800">^</span>
                </>
              ) : isSad || config.expression === 'sad' ? (
                <>
                  <div
                    className="w-2.5 h-2.5 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: eye.color }}
                  />
                  <div
                    className="w-2.5 h-2.5 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: eye.color }}
                  />
                </>
              ) : (
                <>
                  <div
                    className="w-2.5 h-2.5 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: eye.color }}
                  />
                  <div
                    className="w-2.5 h-2.5 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: eye.color }}
                  />
                </>
              )}
            </div>

            {/* Glasses */}
            {config.glasses !== 'none' && (
              <div className="absolute top-7 w-14 flex items-center justify-between z-20 pointer-events-none">
                <div
                  className={`w-6 h-5 rounded-full border-2 ${
                    config.glasses === 'sunglasses'
                      ? 'bg-slate-900 border-slate-900'
                      : 'border-slate-800'
                  }`}
                />
                <div
                  className={`w-6 h-5 rounded-full border-2 ${
                    config.glasses === 'sunglasses'
                      ? 'bg-slate-900 border-slate-900'
                      : 'border-slate-800'
                  }`}
                />
              </div>
            )}

            {/* Mouth */}
            <div className="mt-2 z-10">
              {isSad || config.expression === 'sad' ? (
                <div className="w-3.5 h-1.5 border-t-2 border-slate-800 rounded-t-full" />
              ) : isHappy || config.expression === 'happy' ? (
                <div className="w-4 h-2 bg-rose-500 rounded-b-full border border-rose-600 shadow-sm" />
              ) : config.expression === 'surprised' ? (
                <div className="w-2 h-2 rounded-full bg-slate-800" />
              ) : (
                <div className="w-3 h-1 border-b-2 border-slate-700 rounded-b-full" />
              )}
            </div>
          </div>
        </div>

        {/* Neck + Torso */}
        <div className="relative -mt-1 flex flex-col items-center">
          {/* Jewelry */}
          {config.jewelry === 'heart' && (
            <span className="absolute top-1 text-[10px] z-30">💖</span>
          )}

          {/* Shirt / Top */}
          <div
            className="w-18 h-14 rounded-t-2xl shadow-md flex items-center justify-center transition-colors relative z-10"
            style={{
              backgroundColor: shirt.color,
              width: config.bodyType === 'slim' ? '60px' : config.bodyType === 'athletic' ? '76px' : '68px'
            }}
          >
            {/* Holding phone when typing */}
            {isTyping && (
              <div className="absolute -bottom-1 -right-2 px-1.5 py-0.5 rounded-md bg-slate-900 text-[8px] text-cyan-300 shadow-lg border border-cyan-400/40">
                📱 •••
              </div>
            )}
          </div>

          {/* Pants / Bottom */}
          <div
            className="w-14 h-9 rounded-b-lg shadow-sm -mt-0.5 transition-colors z-0"
            style={{ backgroundColor: pant.color }}
          />

          {/* Shoes */}
          <div className="flex space-x-3 -mt-0.5 z-10">
            <div
              className="w-4 h-2 rounded-full shadow-sm"
              style={{ backgroundColor: shoe.color }}
            />
            <div
              className="w-4 h-4 rounded-full shadow-sm"
              style={{ backgroundColor: shoe.color }}
            />
          </div>
        </div>
      </div>

      {/* STATE FLOATING OVERLAYS */}
      {isHappy && (
        <div className="absolute inset-0 pointer-events-none">
          <span className="absolute top-2 left-4 text-xl animate-bounce">✨</span>
          <span className="absolute top-6 right-4 text-xl animate-pulse">💖</span>
          <span className="absolute bottom-8 right-2 text-lg animate-bounce">✨</span>
        </div>
      )}

      {isSleeping && (
        <div className="absolute top-2 right-4 flex flex-col items-end text-purple-500 font-bold animate-bounce pointer-events-none">
          <span className="text-xl">Z</span>
          <span className="text-sm">z</span>
          <span className="text-xs">z</span>
        </div>
      )}

      {isSad && (
        <div className="absolute -top-3 inset-x-0 flex flex-col items-center text-center pointer-events-none">
          <span className="text-3xl">🌧️</span>
          <div className="text-xs text-blue-400 animate-pulse">💧 💧</div>
        </div>
      )}

      {isTyping && (
        <div className="absolute top-1 right-2 bg-white dark:bg-[#261E21] border border-[#E8A5B9] text-[10px] font-bold text-[#9B4D6F] dark:text-[#E8A5B9] px-2 py-0.5 rounded-full shadow-md animate-pulse">
          typing • • •
        </div>
      )}
    </div>
  );
};

export const AvatarScreen: React.FC = () => {
  const { currentUser, partnerUser, showToast } = useCouple();

  // You & Partner Configurations
  const [myConfig, setMyConfig] = useState<AvatarConfiguration>({
    skinTone: 'skin_fair',
    bodyType: 'average',
    hairStyle: 'bob',
    hairColor: 'espresso',
    eyeColor: 'brown',
    expression: 'happy',
    shirt: 'knit',
    pants: 'jeans',
    shoes: 'sneakers',
    hat: 'catears',
    glasses: 'none',
    jewelry: 'heart'
  });

  const [partnerConfig] = useState<AvatarConfiguration>({
    skinTone: 'skin_peach',
    bodyType: 'slim',
    hairStyle: 'long_curls',
    hairColor: 'rose',
    eyeColor: 'blue',
    expression: 'happy',
    shirt: 'hoodie',
    pants: 'skirt',
    shoes: 'canvas',
    hat: 'none',
    glasses: 'round',
    jewelry: 'pearl'
  });

  // State
  const [myState, setMyState] = useState<AvatarState>('happy');
  const [partnerState, setPartnerState] = useState<AvatarState>('online');

  // Nicknames
  const [myNicknameForThem, setMyNicknameForThem] = useState('My Sunshine ☀️');
  const [theirNicknameForMe] = useState('Bunny 🐰');

  // Modals
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [showEditNicknameModal, setShowEditNicknameModal] = useState(false);
  const [tempNickname, setTempNickname] = useState(myNicknameForThem);

  // Customize Live Temp Config & Active Tab
  const [customizingConfig, setCustomizingConfig] = useState<AvatarConfiguration>(myConfig);
  const [activeCustomTab, setActiveCustomTab] = useState<'body' | 'face' | 'clothes' | 'accessories'>('body');

  const statesList: { id: AvatarState; emoji: string; label: string }[] = [
    { id: 'online', emoji: '🟢', label: 'Online' },
    { id: 'typing', emoji: '💬', label: 'Typing' },
    { id: 'sleeping', emoji: '💤', label: 'Sleeping' },
    { id: 'offline', emoji: '⚪', label: 'Offline' },
    { id: 'happy', emoji: '✨', label: 'Happy' },
    { id: 'sad', emoji: '🌧️', label: 'Needs Love' }
  ];

  const handleOpenCustomize = () => {
    setCustomizingConfig({ ...myConfig });
    setShowCustomizeModal(true);
  };

  const handleSaveCustomize = () => {
    setMyConfig({ ...customizingConfig });
    setShowCustomizeModal(false);
    showToast('Avatar saved! Looking radiant ✨');
    try {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  };

  return (
    <div className="space-y-4 pb-28 pt-2 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-lg font-bold text-[#2D1F24] dark:text-[#F5E6EA] flex items-center gap-1.5">
            <span>Living Avatars</span>
            <span>🧸</span>
          </h2>
          <p className="text-xs text-[#8B7578] dark:text-[#A89598]">
            Your expressive 3D couple world
          </p>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-[#FFF4E6] dark:bg-[#33282C] text-[10px] font-bold text-[#9B4D6F] dark:text-[#E8A5B9] border border-[#F0DFE3] dark:border-[#3D2F34]">
          ✨ Real-Time Sync
        </span>
      </div>

      {/* ======================================================== */}
      {/* REGION 1: YOUR AVATAR (TOP HALF)                         */}
      {/* ======================================================== */}
      <div className="rounded-[24px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-5 shadow-soft text-center relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold tracking-wider text-[#9B4D6F] dark:text-[#E8A5B9] uppercase">
            YOU
          </span>
          <button
            onClick={handleOpenCustomize}
            className="px-3 py-1.5 rounded-full bg-[#E8A5B9]/20 hover:bg-[#E8A5B9]/30 text-[#9B4D6F] dark:text-[#E8A5B9] text-xs font-bold transition flex items-center gap-1 shadow-sm"
          >
            <Paintbrush className="w-3.5 h-3.5" />
            <span>Customize</span>
          </button>
        </div>

        {/* 3D Living Avatar Preview (200px) */}
        <div className="py-2">
          <Avatar3DCanvas config={myConfig} state={myState} size={200} />
        </div>

        {/* Display name & Nickname partner gave you */}
        <h3 className="text-base font-bold text-[#2D1F24] dark:text-[#F5E6EA] mt-1">
          {currentUser.name.split(' ')[0]}
        </h3>
        <p className="text-xs font-medium text-[#E8A5B9]">
          Called "{theirNicknameForMe}" by {partnerUser.name.split(' ')[0]}
        </p>

        {/* State / Mood Selector */}
        <div className="mt-4 pt-3 border-t border-[#F0DFE3] dark:border-[#3D2F34]">
          <div className="text-[11px] text-[#8B7578] dark:text-[#A89598] mb-2 font-medium">
            Set your current state:
          </div>
          <div className="grid grid-cols-6 gap-1">
            {statesList.map((s) => {
              const isSelected = myState === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setMyState(s.id);
                    showToast(`Your avatar is now ${s.label}!`);
                  }}
                  className={`py-1.5 px-1 rounded-xl text-center transition ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#DE7090] to-[#8C244F] text-white font-bold shadow-sm'
                      : 'bg-[#FFF9F5] dark:bg-[#1A1416] text-[#140C0F] dark:text-[#F5E6EA] hover:bg-[#FFF4E6]'
                  }`}
                >
                  <div className="text-sm">{s.emoji}</div>
                  <div className="text-[9px] truncate mt-0.5">{s.label}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* REGION 2: PARTNER'S AVATAR (BOTTOM HALF - VIEW ONLY)     */}
      {/* ======================================================== */}
      <div className="rounded-[24px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-5 shadow-soft text-center relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold tracking-wider text-[#8B7578] dark:text-[#A89598] uppercase">
            PARTNER (VIEW ONLY)
          </span>
          <span className="flex items-center gap-1 text-[10px] font-semibold text-[#8B7578] bg-[#FFF9F5] dark:bg-[#1A1416] px-2 py-0.5 rounded-full border border-[#F0DFE3] dark:border-[#3D2F34]">
            <Lock className="w-3 h-3" />
            Partner Controlled
          </span>
        </div>

        {/* 3D Living Avatar Preview (200px) */}
        <div className="py-2">
          <Avatar3DCanvas config={partnerConfig} state={partnerState} size={200} />
        </div>

        {/* Partner Name & Nickname you gave them */}
        <h3 className="text-base font-bold text-[#2D1F24] dark:text-[#F5E6EA] mt-1">
          {partnerUser.name.split(' ')[0]}
        </h3>
        <p className="text-xs font-medium text-[#9B4D6F] dark:text-[#E8A5B9]">
          You call her "{myNicknameForThem}"
        </p>

        {/* Simulate Partner State */}
        <div className="mt-4 pt-3 border-t border-[#F0DFE3] dark:border-[#3D2F34]">
          <div className="text-[11px] text-[#8B7578] dark:text-[#A89598] mb-2 font-medium">
            Simulate partner's current state:
          </div>
          <div className="grid grid-cols-6 gap-1">
            {statesList.map((s) => {
              const isSelected = partnerState === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setPartnerState(s.id)}
                  className={`py-1.5 px-1 rounded-xl text-center transition ${
                    isSelected
                      ? 'bg-[#9B4D6F] text-white font-bold shadow-sm'
                      : 'bg-[#FFF9F5] dark:bg-[#1A1416] text-[#2D1F24] dark:text-[#F5E6EA] hover:bg-[#FFF4E6]'
                  }`}
                >
                  <div className="text-sm">{s.emoji}</div>
                  <div className="text-[9px] truncate mt-0.5">{s.label}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* REGION 3: NICKNAMES SECTION                              */}
      {/* ======================================================== */}
      <div
        onClick={() => {
          setTempNickname(myNicknameForThem);
          setShowEditNicknameModal(true);
        }}
        className="rounded-[20px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-4 shadow-soft cursor-pointer hover:border-[#E8A5B9] transition space-y-2.5"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA] flex items-center gap-1.5">
            <span>Couple Nicknames</span>
            <span>💌</span>
          </h3>
          <span className="text-[11px] font-bold text-[#E8A5B9] flex items-center gap-1">
            <Edit3 className="w-3 h-3" />
            Tap to edit
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {/* Your nickname for them */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FFF9F5] dark:bg-[#1A1416]">
            <div>
              <div className="text-[10px] text-[#8B7578] dark:text-[#A89598]">
                Your nickname for {partnerUser.name.split(' ')[0]}:
              </div>
              <div className="text-sm font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                {myNicknameForThem}
              </div>
            </div>
            <span className="text-xs text-[#9B4D6F] dark:text-[#E8A5B9] font-semibold">
              Editable ✎
            </span>
          </div>

          {/* Their nickname for you */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FFF9F5] dark:bg-[#1A1416]">
            <div>
              <div className="text-[10px] text-[#8B7578] dark:text-[#A89598]">
                Their nickname for you:
              </div>
              <div className="text-sm font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                {theirNicknameForMe}
              </div>
            </div>
            <span className="text-xs text-[#8B7578] dark:text-[#A89598]">
              View only 🔒
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: FULL SCREEN AVATAR CUSTOMIZER                   */}
      {/* ======================================================== */}
      {showCustomizeModal && (
        <div className="fixed inset-0 z-50 bg-[#FFF9F5] dark:bg-[#1A1416] flex flex-col">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0DFE3] dark:border-[#3D2F34] bg-white dark:bg-[#261E21]">
            <button
              onClick={() => setShowCustomizeModal(false)}
              className="text-xs font-semibold text-[#8B7578] dark:text-[#A89598] px-2 py-1"
            >
              Cancel
            </button>
            <h3 className="text-sm font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
              Customize Avatar
            </h3>
            <button
              onClick={handleSaveCustomize}
              className="px-4 py-1.5 rounded-full bg-[#9B4D6F] hover:bg-[#853C5D] text-white text-xs font-bold shadow-soft transition"
            >
              Save ✨
            </button>
          </div>

          {/* Top Half: Live 3D Preview (200px) */}
          <div className="h-56 bg-[#FFF4E6]/50 dark:bg-[#20181B] flex items-center justify-center border-b border-[#F0DFE3] dark:border-[#3D2F34]">
            <Avatar3DCanvas config={customizingConfig} state="happy" size={200} />
          </div>

          {/* Category Tabs (Body, Face, Clothes, Accessories) */}
          <div className="flex border-b border-[#F0DFE3] dark:border-[#3D2F34] bg-white dark:bg-[#261E21] px-2">
            {[
              { id: 'body' as const, label: 'Body', emoji: '🧍' },
              { id: 'face' as const, label: 'Face', emoji: '✨' },
              { id: 'clothes' as const, label: 'Clothes', emoji: '👚' },
              { id: 'accessories' as const, label: 'Accessories', emoji: '👒' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCustomTab(tab.id)}
                className={`flex-1 py-2.5 text-xs font-bold border-b-2 flex items-center justify-center gap-1 transition ${
                  activeCustomTab === tab.id
                    ? 'border-[#9B4D6F] text-[#9B4D6F] dark:text-[#E8A5B9]'
                    : 'border-transparent text-[#8B7578] dark:text-[#A89598]'
                }`}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Options Content Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeCustomTab === 'body' && (
              <div className="space-y-4">
                {/* Skin Tones */}
                <div>
                  <h4 className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA] mb-2">
                    Skin Tone (6 options)
                  </h4>
                  <div className="flex justify-between">
                    {SKIN_TONES.map((tone) => (
                      <button
                        key={tone.id}
                        onClick={() =>
                          setCustomizingConfig({ ...customizingConfig, skinTone: tone.id })
                        }
                        className={`w-11 h-11 rounded-full border-2 transition ${
                          customizingConfig.skinTone === tone.id
                            ? 'ring-2 ring-[#9B4D6F] border-white scale-110'
                            : 'border-white/80'
                        }`}
                        style={{ backgroundColor: tone.color }}
                        title={tone.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Body Type */}
                <div>
                  <h4 className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA] mb-2">
                    Body Type
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {(['slim', 'average', 'athletic'] as const).map((b) => (
                      <button
                        key={b}
                        onClick={() =>
                          setCustomizingConfig({ ...customizingConfig, bodyType: b })
                        }
                        className={`py-3 rounded-xl border text-xs font-bold capitalize transition ${
                          customizingConfig.bodyType === b
                            ? 'bg-[#E8A5B9]/20 border-[#E8A5B9] text-[#9B4D6F] dark:text-[#E8A5B9]'
                            : 'bg-white dark:bg-[#261E21] border-[#F0DFE3] dark:border-[#3D2F34] text-[#8B7578]'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeCustomTab === 'face' && (
              <div className="space-y-4">
                {/* Hair Style */}
                <div>
                  <h4 className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA] mb-2">
                    Hair Style (8 options)
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {HAIR_STYLES.map((style) => (
                      <button
                        key={style.id}
                        onClick={() =>
                          setCustomizingConfig({ ...customizingConfig, hairStyle: style.id })
                        }
                        className={`p-2 rounded-xl border text-center transition ${
                          customizingConfig.hairStyle === style.id
                            ? 'bg-[#E8A5B9]/20 border-[#E8A5B9] text-[#9B4D6F] dark:text-[#E8A5B9] font-bold'
                            : 'bg-white dark:bg-[#261E21] border-[#F0DFE3] dark:border-[#3D2F34] text-[#8B7578]'
                        }`}
                      >
                        <div className="text-xl">{style.emoji}</div>
                        <div className="text-[10px] truncate mt-1">{style.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hair Color */}
                <div>
                  <h4 className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA] mb-2">
                    Hair Color (6 options)
                  </h4>
                  <div className="flex justify-between">
                    {HAIR_COLORS.map((color) => (
                      <button
                        key={color.id}
                        onClick={() =>
                          setCustomizingConfig({ ...customizingConfig, hairColor: color.id })
                        }
                        className={`w-10 h-10 rounded-full border-2 transition ${
                          customizingConfig.hairColor === color.id
                            ? 'ring-2 ring-[#9B4D6F] border-white scale-110'
                            : 'border-white'
                        }`}
                        style={{ backgroundColor: color.color }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Eye Color */}
                <div>
                  <h4 className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA] mb-2">
                    Eye Color (6 options)
                  </h4>
                  <div className="flex justify-between">
                    {EYE_COLORS.map((color) => (
                      <button
                        key={color.id}
                        onClick={() =>
                          setCustomizingConfig({ ...customizingConfig, eyeColor: color.id })
                        }
                        className={`w-10 h-10 rounded-full border-2 transition ${
                          customizingConfig.eyeColor === color.id
                            ? 'ring-2 ring-[#9B4D6F] border-white scale-110'
                            : 'border-white'
                        }`}
                        style={{ backgroundColor: color.color }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Expression */}
                <div>
                  <h4 className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA] mb-2">
                    Expression (4 options)
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'happy' as const, emoji: '😊', label: 'Happy' },
                      { id: 'neutral' as const, emoji: '🙂', label: 'Neutral' },
                      { id: 'sad' as const, emoji: '🥺', label: 'Sad' },
                      { id: 'surprised' as const, emoji: '😮', label: 'Surprised' }
                    ].map((e) => (
                      <button
                        key={e.id}
                        onClick={() =>
                          setCustomizingConfig({ ...customizingConfig, expression: e.id })
                        }
                        className={`py-2 rounded-xl border text-center transition ${
                          customizingConfig.expression === e.id
                            ? 'bg-[#E8A5B9]/20 border-[#E8A5B9] text-[#9B4D6F] dark:text-[#E8A5B9] font-bold'
                            : 'bg-white dark:bg-[#261E21] border-[#F0DFE3] dark:border-[#3D2F34] text-[#8B7578]'
                        }`}
                      >
                        <div className="text-lg">{e.emoji}</div>
                        <div className="text-[10px] mt-0.5">{e.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeCustomTab === 'clothes' && (
              <div className="space-y-4">
                {/* Shirts */}
                <div>
                  <h4 className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA] mb-2">
                    Shirts & Tops (10 options)
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {SHIRTS.map((shirt) => (
                      <button
                        key={shirt.id}
                        onClick={() =>
                          setCustomizingConfig({ ...customizingConfig, shirt: shirt.id })
                        }
                        className={`p-2 rounded-xl border text-left flex items-center space-x-2 transition ${
                          customizingConfig.shirt === shirt.id
                            ? 'bg-[#E8A5B9]/20 border-[#E8A5B9] text-[#9B4D6F] dark:text-[#E8A5B9] font-bold'
                            : 'bg-white dark:bg-[#261E21] border-[#F0DFE3] dark:border-[#3D2F34] text-[#8B7578]'
                        }`}
                      >
                        <span className="text-xl">{shirt.emoji}</span>
                        <span className="text-xs truncate">{shirt.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pants */}
                <div>
                  <h4 className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA] mb-2">
                    Pants & Bottoms (8 options)
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {PANTS.map((pant) => (
                      <button
                        key={pant.id}
                        onClick={() =>
                          setCustomizingConfig({ ...customizingConfig, pants: pant.id })
                        }
                        className={`p-2 rounded-xl border text-left flex items-center space-x-2 transition ${
                          customizingConfig.pants === pant.id
                            ? 'bg-[#E8A5B9]/20 border-[#E8A5B9] text-[#9B4D6F] dark:text-[#E8A5B9] font-bold'
                            : 'bg-white dark:bg-[#261E21] border-[#F0DFE3] dark:border-[#3D2F34] text-[#8B7578]'
                        }`}
                      >
                        <span className="text-xl">{pant.emoji}</span>
                        <span className="text-xs truncate">{pant.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Shoes */}
                <div>
                  <h4 className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA] mb-2">
                    Shoes (6 options)
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {SHOES.map((shoe) => (
                      <button
                        key={shoe.id}
                        onClick={() =>
                          setCustomizingConfig({ ...customizingConfig, shoes: shoe.id })
                        }
                        className={`p-2 rounded-xl border text-left flex items-center space-x-2 transition ${
                          customizingConfig.shoes === shoe.id
                            ? 'bg-[#E8A5B9]/20 border-[#E8A5B9] text-[#9B4D6F] dark:text-[#E8A5B9] font-bold'
                            : 'bg-white dark:bg-[#261E21] border-[#F0DFE3] dark:border-[#3D2F34] text-[#8B7578]'
                        }`}
                      >
                        <span className="text-xl">{shoe.emoji}</span>
                        <span className="text-xs truncate">{shoe.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeCustomTab === 'accessories' && (
              <div className="space-y-4">
                {/* Hats */}
                <div>
                  <h4 className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA] mb-2">
                    Hats & Headwear (6 options)
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {HATS.map((hat) => (
                      <button
                        key={hat.id}
                        onClick={() =>
                          setCustomizingConfig({ ...customizingConfig, hat: hat.id })
                        }
                        className={`p-2 rounded-xl border text-left flex items-center space-x-2 transition ${
                          customizingConfig.hat === hat.id
                            ? 'bg-[#E8A5B9]/20 border-[#E8A5B9] text-[#9B4D6F] dark:text-[#E8A5B9] font-bold'
                            : 'bg-white dark:bg-[#261E21] border-[#F0DFE3] dark:border-[#3D2F34] text-[#8B7578]'
                        }`}
                      >
                        <span className="text-xl">{hat.emoji}</span>
                        <span className="text-xs truncate">{hat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Glasses */}
                <div>
                  <h4 className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA] mb-2">
                    Glasses (4 options)
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {GLASSES.map((glass) => (
                      <button
                        key={glass.id}
                        onClick={() =>
                          setCustomizingConfig({ ...customizingConfig, glasses: glass.id })
                        }
                        className={`p-2 rounded-xl border text-left flex items-center space-x-2 transition ${
                          customizingConfig.glasses === glass.id
                            ? 'bg-[#E8A5B9]/20 border-[#E8A5B9] text-[#9B4D6F] dark:text-[#E8A5B9] font-bold'
                            : 'bg-white dark:bg-[#261E21] border-[#F0DFE3] dark:border-[#3D2F34] text-[#8B7578]'
                        }`}
                      >
                        <span className="text-xl">{glass.emoji}</span>
                        <span className="text-xs truncate">{glass.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Jewelry */}
                <div>
                  <h4 className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA] mb-2">
                    Jewelry (5 options)
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {JEWELRY.map((jewel) => (
                      <button
                        key={jewel.id}
                        onClick={() =>
                          setCustomizingConfig({ ...customizingConfig, jewelry: jewel.id })
                        }
                        className={`p-2 rounded-xl border text-left flex items-center space-x-2 transition ${
                          customizingConfig.jewelry === jewel.id
                            ? 'bg-[#E8A5B9]/20 border-[#E8A5B9] text-[#9B4D6F] dark:text-[#E8A5B9] font-bold'
                            : 'bg-white dark:bg-[#261E21] border-[#F0DFE3] dark:border-[#3D2F34] text-[#8B7578]'
                        }`}
                      >
                        <span className="text-xl">{jewel.emoji}</span>
                        <span className="text-xs truncate">{jewel.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: EDIT NICKNAME                                   */}
      {/* ======================================================== */}
      {showEditNicknameModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-[24px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                  Edit Nickname for {partnerUser.name.split(' ')[0]}
                </h3>
                <p className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  A private sweet name only the two of you see
                </p>
              </div>
              <button
                onClick={() => setShowEditNicknameModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#8B7578]"
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              value={tempNickname}
              onChange={(e) => setTempNickname(e.target.value.slice(0, 30))}
              placeholder="e.g. My Sunshine ☀️"
              className="w-full px-3 py-2.5 rounded-xl bg-[#FFF9F5] dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34] text-xs text-[#2D1F24] dark:text-[#F5E6EA] font-semibold"
            />

            <div className="flex flex-wrap gap-1.5">
              {[
                'My Sunshine ☀️',
                'Honeybun 🍯',
                'Baby 💖',
                'Sweetheart 🌸',
                'Angel 👼',
                'Bunny 🐰'
              ].map((sug) => (
                <button
                  key={sug}
                  onClick={() => setTempNickname(sug)}
                  className="px-2.5 py-1 rounded-lg bg-[#FFF4E6] dark:bg-[#33282C] text-[11px] font-medium text-[#2D1F24] dark:text-[#F5E6EA] hover:bg-[#FCEAD4]"
                >
                  {sug}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setMyNicknameForThem(tempNickname.trim());
                setShowEditNicknameModal(false);
                showToast(`Nickname updated to "${tempNickname.trim()}" 💖`);
              }}
              disabled={!tempNickname.trim()}
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#DE7090] to-[#8C244F] hover:opacity-95 disabled:opacity-50 text-white font-bold text-xs shadow-md transition"
            >
              Save Nickname 💖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
