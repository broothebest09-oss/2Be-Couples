import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Volume2, VolumeX, SwitchCamera } from 'lucide-react';
import { useCouple } from '../../context/CoupleContext';

export const CallModal: React.FC = () => {
  const { isCallActive, callType, endCall, partnerUser, currentUser } = useCouple();

  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isCallActive) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [isCallActive]);

  if (!isCallActive) return null;

  const formatDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight-950/95 backdrop-blur-2xl transition-all">
      <div className="relative w-full max-w-md h-full max-h-[850px] flex flex-col justify-between p-6">
        {/* Top bar info */}
        <div className="flex flex-col items-center pt-8 z-20">
          <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-lavender-300 backdrop-blur-md mb-2">
            2Be Encrypted {callType === 'video' ? 'Video' : 'Voice'} Call
          </span>
          <h2 className="text-2xl font-serif font-bold text-white tracking-tight">
            {partnerUser.nickname || partnerUser.name}
          </h2>
          <span className="text-sm font-medium text-slate-400 mt-1">
            {callDuration > 0 ? formatDuration(callDuration) : 'Connecting...'}
          </span>
        </div>

        {/* Video or Voice visualizer */}
        <div className="flex-1 flex items-center justify-center relative my-6">
          {callType === 'video' && !isVideoOff ? (
            <div className="relative w-full h-full rounded-3xl overflow-hidden border border-lavender-500/20 shadow-2xl bg-black">
              {/* Main view: Partner */}
              <img
                src={partnerUser.avatar}
                alt={partnerUser.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight-950/60 via-transparent to-transparent pointer-events-none" />

              {/* Picture-in-picture: Self */}
              <div className="absolute top-4 right-4 w-28 h-36 rounded-2xl overflow-hidden ring-2 ring-white/30 shadow-2xl bg-midnight-900">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-2 text-[10px] bg-black/60 px-1 rounded text-white">
                  You
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-36 h-36 rounded-full overflow-hidden ring-4 ring-softpink-500/30 animate-pulse-subtle shadow-2xl">
                  <img
                    src={partnerUser.avatar}
                    alt={partnerUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-softpink-500 text-white text-xs font-semibold shadow-lg">
                  Connected
                </div>
              </div>

              {/* Ambient audio waves */}
              <div className="flex items-center space-x-1 mt-10">
                {[40, 70, 95, 60, 85, 50, 90, 65, 45, 80, 55].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h * 0.4}px` }}
                    className="w-1.5 bg-gradient-to-t from-lavender-500 to-softpink-400 rounded-full animate-pulse"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Call control action bar */}
        <div className="flex items-center justify-around pb-6 px-4 z-20">
          {/* Mute */}
          <button
            onClick={() => setIsMuted(prev => !prev)}
            className={`p-4 rounded-full transition active:scale-90 ${
              isMuted ? 'bg-rose-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {/* Toggle Video */}
          {callType === 'video' && (
            <button
              onClick={() => setIsVideoOff(prev => !prev)}
              className={`p-4 rounded-full transition active:scale-90 ${
                isVideoOff ? 'bg-rose-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
            </button>
          )}

          {/* Speaker */}
          <button
            onClick={() => setIsSpeakerOn(prev => !prev)}
            className={`p-4 rounded-full transition active:scale-90 ${
              !isSpeakerOn ? 'bg-slate-700 text-white' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </button>

          {/* Switch camera */}
          {callType === 'video' && (
            <button
              onClick={() => {}}
              className="p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition active:scale-90"
            >
              <SwitchCamera className="w-6 h-6" />
            </button>
          )}

          {/* End call button */}
          <button
            onClick={endCall}
            className="p-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-2xl transition active:scale-90 ring-4 ring-rose-500/20"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
