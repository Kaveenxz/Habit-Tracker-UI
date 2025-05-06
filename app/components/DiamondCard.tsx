'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import diamond from '@/app/images/diamond-removebg-preview.png';
import premiumBadge from '@/app/images/premium.png';
import { Howl } from 'howler';

// Sound effects
const hoverSound = new Howl({
  src: ['/sounds/hover.mp3'],
  volume: 0.2
});

const claimSound = new Howl({
  src: ['/sounds/claim.mp3'],
  volume: 0.5
});

interface DiamondCardProps {
  amount: number;
  price: string;
  bonus?: number;
  isPopular?: boolean;
  isPremium?: boolean;
  viewed?: boolean;
  onClaim?: () => void;
  offerId?: string;
  timeLimited?: boolean;
  discount?: number;
  specialEffect?: 'fire' | 'glow' | 'pulse';
}

export default function DiamondCard({ 
  amount, 
  price, 
  bonus = 0, 
  isPopular = false, 
  isPremium = false, 
  viewed = false,
  onClaim,
  offerId,
  timeLimited = false,
  discount = 0,
  specialEffect
}: DiamondCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isClaimed, setIsClaimed] = useState(viewed);
  const [showBonusInfo, setShowBonusInfo] = useState(false);
  const [timer, setTimer] = useState(timeLimited ? 3600 : 0); // 1 hour in seconds
  
  // Countdown timer for time-limited offers
  useEffect(() => {
    if (!timeLimited || timer <= 0) return;
    
    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timeLimited, timer]);
  
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClaim = () => {
    if (isClaimed || !onClaim) return;
    
    setIsClaiming(true);
    claimSound.play();
    
    // Animation delay before actually claiming
    setTimeout(() => {
      onClaim();
      setIsClaimed(true);
      setIsClaiming(false);
    }, 800);
  };

  const handleHover = (hoverState: boolean) => {
    setIsHovered(hoverState);
    if (hoverState && !isClaimed) {
      hoverSound.play();
    }
  };

  const getEffectClass = () => {
    switch (specialEffect) {
      case 'fire':
        return 'bg-gradient-to-b from-ff-secondary/20 via-ff-primary/30 to-transparent';
      case 'glow':
        return 'shadow-[0_0_15px_rgba(0,191,255,0.7)]';
      case 'pulse':
        return 'animate-pulse-slow';
      default:
        return '';
    }
  };

  const totalAmount = amount + (isPremium ? bonus : 0);

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0.8 }}
      animate={{ 
        scale: isHovered && !isClaimed ? 1.05 : 1,
        opacity: isClaimed ? 0.7 : 1
      }}
      transition={{ type: 'spring', stiffness: 300 }}
      onHoverStart={() => handleHover(true)}
      onHoverEnd={() => handleHover(false)}
      className={`relative bg-ff-dark border rounded-lg p-6 shadow-lg transition-all overflow-hidden 
        ${isPopular ? 'border-ff-primary' : 'border-gray-700'}
        ${isClaimed ? 'grayscale-[60%]' : ''}
        ${getEffectClass()}`}
    >
      {/* Special effect overlays */}
      {specialEffect === 'fire' && (
        <div className="absolute inset-0 bg-[url('/images/fire-effect.png')] bg-contain bg-no-repeat bg-center opacity-30 pointer-events-none"></div>
      )}
      
      {/* Premium bonus indicator */}
      {bonus > 0 && isPremium && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: showBonusInfo ? 1 : 0 }}
          className="absolute top-0 left-0 w-full h-full bg-ff-dark/90 flex items-center justify-center z-10"
          onClick={() => setShowBonusInfo(false)}
        >
          <div className="text-center p-4">
            <h4 className="text-ff-primary text-xl font-bold mb-2">PREMIUM BONUS!</h4>
            <p className="text-ff-light mb-4">You get an extra {bonus.toLocaleString()} diamonds</p>
            <div className="flex justify-center items-center">
              <span className="text-2xl line-through opacity-70 mr-3">{amount.toLocaleString()}</span>
              <span className="text-3xl font-bold text-ff-accent">{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Popular badge */}
      {isPopular && (
        <motion.div 
          animate={{
            rotate: isHovered ? [0, 10, -10, 0] : 0,
            scale: isHovered ? 1.1 : 1
          }}
          transition={{ type: 'spring', stiffness: 500 }}
          className="absolute -top-3 -right-3 bg-ff-primary text-ff-dark px-3 py-1 rounded-full text-xs font-bold z-20"
        >
          POPULAR
        </motion.div>
      )}
      
      {/* Discount badge */}
      {discount > 0 && (
        <div className="absolute -top-3 -left-3 bg-green-500 text-ff-dark px-3 py-1 rounded-full text-xs font-bold z-20">
          {discount}% OFF
        </div>
      )}
      
      {/* Premium badge */}
      {isPremium && (
        <div className="absolute top-2 left-2 z-20">
          <Image 
            src={premiumBadge} 
            alt="Premium" 
            width={24} 
            height={24}
            className="h-6 w-6"
          />
        </div>
      )}
      
      {/* Time limited indicator */}
      {timeLimited && timer > 0 && (
        <div className="absolute top-2 right-2 bg-red-500/90 text-white text-xs px-2 py-1 rounded z-20">
          {formatTime(timer)}
        </div>
      )}
      
      <div className="flex flex-col items-center relative z-0">
        {/* Diamond image with animation */}
        <motion.div
          animate={{
            y: isHovered && !isClaimed ? [0, -5, 0] : 0,
            rotate: isHovered && !isClaimed ? [0, 5, -5, 0] : 0
          }}
          transition={{ repeat: isHovered && !isClaimed ? Infinity : 0, duration: 2 }}
          className="relative"
        >
          <Image 
            src={diamond} 
            alt="Diamonds" 
            width={64} 
            height={64}
            className="h-16 w-16 mb-4"
          />
          {isPremium && bonus > 0 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowBonusInfo(true);
              }}
              className="absolute -bottom-1 -right-1 bg-ff-primary text-ff-dark text-xs w-5 h-5 rounded-full flex items-center justify-center"
            >
              ?
            </button>
          )}
        </motion.div>
        
        {/* Amount display */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-ff-accent">
            {totalAmount.toLocaleString()}
          </h3>
          {bonus > 0 && (
            <p className={`text-sm mt-1 ${isPremium ? 'text-ff-primary' : 'text-gray-500'}`}>
              + {bonus.toLocaleString()} bonus {!isPremium && '(Premium only)'}
            </p>
          )}
        </div>
        
        <div className="mt-4 w-full bg-gray-700 h-px"></div>
        
        {/* Price display */}
        <p className="mt-4 text-ff-light flex items-center">
          {price}
          {discount > 0 && (
            <span className="ml-2 text-sm line-through text-gray-400">
              {Math.round((totalAmount / (1 - discount/100))).toLocaleString()}
            </span>
          )}
        </p>
        
        {/* Claim button */}
        <motion.button
          disabled={isClaimed}
          whileHover={!isClaimed ? { scale: 1.05 } : {}}
          whileTap={!isClaimed ? { scale: 0.95 } : {}}
          onClick={handleClaim}
          className={`mt-4 font-bold py-2 px-6 rounded-full transition relative overflow-hidden
            ${isClaimed ? 
              'bg-gray-600 cursor-not-allowed' : 
              'bg-ff-primary hover:bg-ff-secondary text-ff-dark'}`}
        >
          <AnimatePresence>
            {isClaiming && (
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                exit={{ width: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute top-0 left-0 h-full bg-ff-secondary/50"
              />
            )}
          </AnimatePresence>
          <span className="relative z-10">
            {isClaimed ? 'CLAIMED' : 'CLAIM NOW'}
          </span>
        </motion.button>
      </div>
      
      {/* Sparkle effects on hover */}
      <AnimatePresence>
        {isHovered && !isClaimed && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 0,
                  scale: 0,
                  x: Math.random() * 100 - 50,
                  y: Math.random() * 100 - 50
                }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  x: Math.random() * 100 - 50,
                  y: Math.random() * 100 - 50
                }}
                transition={{ 
                  duration: 1,
                  delay: i * 0.1,
                  repeat: Infinity
                }}
                className="absolute w-2 h-2 bg-white rounded-full pointer-events-none"
                style={{
                  left: `${50 + (Math.random() * 20 - 10)}%`,
                  top: `${50 + (Math.random() * 20 - 10)}%`,
                  filter: 'blur(1px)'
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}