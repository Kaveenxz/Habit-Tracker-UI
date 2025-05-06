'use client'
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import diamond from '@/app/images/diamond-removebg-preview.png';
import fireEffect from '@/app/images/fire-effect.png';
import premiumCrown from '@/app/images/crown.png';
import { Howl } from 'howler';

// Sound effects
const claimSound = new Howl({
  src: ['/sounds/reward-claim.mp3'],
  volume: 0.6
});

const hoverSound = new Howl({
  src: ['/sounds/button-hover.mp3'],
  volume: 0.3
});

interface DailyRewardProps {
  claimed: boolean;
  onClaim: () => void;
  streak: number;
  isPremium?: boolean;
}

export default function DailyReward({ 
  claimed, 
  onClaim, 
  streak,
  isPremium = false 
}: DailyRewardProps) {
  const [currentDay, setCurrentDay] = useState(2); // Day 3 is claimable
  const [showStreakBonus, setShowStreakBonus] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [claimedToday, setClaimedToday] = useState(claimed);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  
  const days = [
    { day: 'Day 1', reward: 50, claimed: true },
    { day: 'Day 2', reward: 70, claimed: true },
    { day: 'Day 3', reward: 100 + (isPremium ? 50 : 0), claimed: claimedToday },
    { day: 'Day 4', reward: 150 + (isPremium ? 75 : 0), claimed: false },
    { day: 'Day 5', reward: 200 + (isPremium ? 100 : 0), claimed: false },
    { day: 'Day 6', reward: 300 + (isPremium ? 150 : 0), claimed: false },
    { day: 'Day 7', reward: 500 + (isPremium ? 250 : 0), claimed: false },
  ];

  const handleClaim = () => {
    if (!claimedToday) {
      setIsAnimating(true);
      claimSound.play();
      
      // Animation delay before actual claim
      setTimeout(() => {
        onClaim();
        setClaimedToday(true);
        setIsAnimating(false);
        
        // Show streak bonus if applicable
        if ((streak + 1) % 7 === 0) {
          setShowStreakBonus(true);
          setTimeout(() => setShowStreakBonus(false), 3000);
        }
      }, 1000);
    }
  };

  const getDayClassName = (dayIndex: number, dayClaimed: boolean) => {
    let classes = 'border rounded-lg p-2 text-center relative overflow-hidden transition-all ';
    
    if (dayClaimed) {
      classes += 'border-ff-primary bg-gradient-to-b from-ff-dark to-gray-900 shadow-inner ';
    } else if (dayIndex === currentDay) {
      classes += 'border-ff-accent bg-ff-dark/80 shadow-md ';
    } else {
      classes += 'border-gray-600 bg-gray-800/50 ';
    }
    
    if (hoveredDay === dayIndex && !dayClaimed) {
      classes += 'transform scale-105 z-10 ';
    }
    
    return classes;
  };

  const getRewardBonus = (baseReward: number) => {
    return isPremium ? Math.floor(baseReward * 0.5) : 0;
  };

  return (
    <div className="relative">
      {/* Streak bonus popup */}
      <AnimatePresence>
        {showStreakBonus && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute -top-16 left-0 right-0 mx-auto bg-gradient-to-r from-ff-primary to-ff-secondary text-ff-dark font-bold py-2 px-4 rounded-full text-center shadow-lg z-20 w-max"
          >
            🎉 7-Day Streak Bonus! +500 Diamonds 🎉
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <span className="bg-gradient-to-r from-ff-primary to-ff-secondary text-transparent bg-clip-text">
              DAILY REWARDS
            </span>
            {isPremium && (
              <Image 
                src={premiumCrown} 
                alt="Premium" 
                width={24} 
                height={24}
                className="ml-2 h-6 w-6"
              />
            )}
          </h2>
          <div className="flex items-center bg-ff-dark/80 px-3 py-1 rounded-full border border-ff-primary/30">
            <span className="text-ff-primary mr-2">🔥 Streak:</span>
            <span className="font-bold text-ff-accent">{streak} days</span>
          </div>
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-7 gap-2 relative">
          {/* Animated connector line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-700 z-0 transform -translate-y-1/2">
            <div 
              className="h-full bg-gradient-to-r from-ff-primary to-ff-secondary transition-all duration-500"
              style={{ width: `${(currentDay + (claimedToday ? 1 : 0)) / 7 * 100}%` }}
            ></div>
          </div>

          {days.map((item, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              whileHover={!item.claimed ? { scale: 1.05 } : {}}
              onHoverStart={() => {
                if (!item.claimed) {
                  setHoveredDay(index);
                  hoverSound.play();
                }
              }}
              onHoverEnd={() => setHoveredDay(null)}
              className={getDayClassName(index, item.claimed)}
            >
              {/* Day indicator */}
              <p className="text-sm mb-1 font-medium">
                {item.day}
              </p>

              {/* Reward amount */}
              <div className="flex flex-col items-center justify-center mb-1 relative">
                <motion.div
                  animate={{
                    y: hoveredDay === index ? [-2, 2, -2] : 0,
                    rotate: hoveredDay === index ? [0, 5, -5, 0] : 0
                  }}
                  transition={{ repeat: hoveredDay === index ? Infinity : 0, duration: 1.5 }}
                >
                  <Image 
                    src={diamond} 
                    alt="Diamond" 
                    width={20} 
                    height={20}
                    className="h-5 w-5"
                  />
                </motion.div>
                <div className="flex items-center mt-1">
                  <span className="font-bold text-ff-accent">
                    {item.reward}
                  </span>
                  {getRewardBonus(item.reward - (isPremium ? 50 : 0)) > 0 && (
                    <span className="text-xs text-ff-primary ml-1">
                      +{getRewardBonus(item.reward - (isPremium ? 50 : 0))}
                    </span>
                  )}
                </div>
              </div>

              {/* Claim status */}
              {item.claimed ? (
                <div className="text-xs text-ff-primary flex items-center justify-center">
                  <span className="relative">
                    Claimed
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-ff-primary/50"></span>
                  </span>
                </div>
              ) : index === currentDay ? (
                <motion.button
                  disabled={claimedToday}
                  whileHover={!claimedToday ? { scale: 1.1 } : {}}
                  whileTap={!claimedToday ? { scale: 0.95 } : {}}
                  onClick={handleClaim}
                  className={`text-xs px-2 py-1 rounded w-full transition ${
                    claimedToday 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-ff-primary to-ff-secondary text-ff-dark font-bold'
                  }`}
                >
                  {isAnimating ? (
                    <span className="inline-flex items-center">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="inline-block h-3 w-3 border-2 border-white border-t-transparent rounded-full mr-1"
                      />
                      Claiming...
                    </span>
                  ) : (
                    'Claim Now'
                  )}
                </motion.button>
              ) : (
                <div className="text-xs text-gray-400">
                  {index < currentDay ? 'Claimed' : 'Coming'}
                </div>
              )}

              {/* Premium crown for bonus days */}
              {getRewardBonus(item.reward - (isPremium ? 50 : 0)) > 0 && (
                <div className="absolute -top-2 -right-2">
                  <Image 
                    src={premiumCrown} 
                    alt="Premium Bonus" 
                    width={16} 
                    height={16}
                    className="h-4 w-4"
                  />
                </div>
              )}

              {/* Fire effect for current day */}
              {index === currentDay && !claimedToday && (
                <div className="absolute inset-0 bg-[url('/images/fire-effect.png')] bg-contain bg-no-repeat opacity-20 pointer-events-none"></div>
              )}

              {/* Glow effect for hover */}
              {hoveredDay === index && !item.claimed && (
                <div className="absolute inset-0 rounded-lg shadow-[0_0_15px_rgba(0,191,255,0.5)] pointer-events-none"></div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Premium info */}
        {!isPremium && (
          <div className="mt-6 text-center text-sm text-gray-400">
            <p>Go <span className="text-ff-primary">Premium</span> to get +50% bonus on all rewards!</p>
          </div>
        )}

        {/* Animation for claimed rewards */}
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    opacity: 1,
                    x: 0,
                    y: 0,
                    scale: 1
                  }}
                  animate={{ 
                    opacity: 0,
                    x: Math.random() * 200 - 100,
                    y: Math.random() * -100 - 50,
                    scale: 0
                  }}
                  transition={{ 
                    duration: 1.5,
                    ease: "backOut"
                  }}
                  className="absolute"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                >
                  <Image 
                    src={diamond} 
                    alt="Diamond" 
                    width={16} 
                    height={16}
                    className="h-4 w-4"
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}