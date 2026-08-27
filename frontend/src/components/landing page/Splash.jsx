import React from 'react';

export default function Splash() {
  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center bg-transparent z-40">
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <h1 
          style={{ fontFamily: 'Arial, sans-serif' }} 
          className="text-[100px] sm:text-[140px] md:text-[180px] font-bold text-[var(--color-text)] leading-none mb-4"
        >
          Qdemy
        </h1>
        <p 
          style={{ fontFamily: 'Arial, sans-serif' }}
          className="text-[16px] sm:text-[20px] md:text-[24px] text-[var(--color-text)]/70 max-w-lg"
        >
          Quantum academy for practical learning
        </p>
      </div>
    </section>
  );
}
