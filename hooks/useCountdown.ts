import { useState, useEffect } from 'react';

export const useCountdown = (targetDateStr: string) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDateStr) - +new Date();
    let timeLeft = {
      dias: 0,
      horas: 0,
      minutos: 0,
      segundos: 0,
    };

    if (difference > 0) {
      timeLeft = {
        dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
        horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((difference / 1000 / 60) % 60),
        segundos: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    // Recalculate immediately on date change
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDateStr]);

  return timeLeft;
};