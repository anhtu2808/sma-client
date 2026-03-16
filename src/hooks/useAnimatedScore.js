import { useState, useEffect, useRef } from "react";

/**
 * Hook to animate a number from previous value to target value
 * @param {number} targetScore - The target score to animate to
 * @param {number} duration - Animation duration in ms (default: 1000)
 * @returns {number} - The animated score value
 */
const useAnimatedScore = (targetScore, duration = 1000) => {
  const [displayScore, setDisplayScore] = useState(targetScore);
  const prevScoreRef = useRef(targetScore);

  useEffect(() => {
    const startScore = prevScoreRef.current;
    const diff = targetScore - startScore;
    
    // If no change, don't animate
    if (diff === 0) return;
    
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function: easeOutQuart for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = startScore + diff * eased;
      
      setDisplayScore(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prevScoreRef.current = targetScore;
      }
    };

    requestAnimationFrame(animate);
    
    // Cleanup: update ref when target changes
    return () => {
      prevScoreRef.current = targetScore;
    };
  }, [targetScore, duration]);

  return Math.round(displayScore);
};

export default useAnimatedScore;
