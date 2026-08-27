import React from 'react';

export default function Splash() {
  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center bg-[url('/land_bg1.png')] bg-cover bg-center bg-no-repeat z-40">
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <h1 
          style={{ 
            fontFamily: 'Arial, sans-serif',
            textShadow: '1px 1px 0 #444, 2px 2px 0 #333, 3px 3px 0 #222, 4px 4px 0 #111, 5px 5px 0 #000, 0 0 40px rgba(0,0,0,1.5), 0 0 80px rgba(0,0,0,1.5)'
          }} 
          className="text-[100px] sm:text-[140px] md:text-[180px] font-bold text-[var(--color-head)] leading-none mb-4"
        >
          Qdemy
        </h1>
        <p 
          style={{ 
            fontFamily: 'Arial, sans-serif',
            textShadow: '1px 1px 0 #444, 2px 2px 0 #222, 0 0 20px rgba(0,0,0,1.5), 0 0 40px rgba(0,0,0,1.5)'
          }}
          className="text-[16px] sm:text-[20px] md:text-[24px] text-[var(--color-head)] max-w-lg font-medium tracking-wide"
        >
          Quantum academy for practical learning
        </p>
      </div>
    </section>
  );
}
