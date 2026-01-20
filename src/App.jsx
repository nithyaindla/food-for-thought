import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, ArrowDown, RotateCcw, Clock, AlertTriangle, Play, ChevronRight, MousePointer } from 'lucide-react';

// --- INJECT FONTS ---
const FontStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Space+Grotesk:wght@300;400;700&display=swap');
    
    .font-syne { font-family: 'Syne', sans-serif; }
    .font-space { font-family: 'Space Grotesk', sans-serif; }
    
    .text-art-block {
      text-align: justify;
      text-justify: inter-character;
    }
  `}</style>
);

// --- CINEMATIC REVEAL ---
const Reveal = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => setIsVisible(entry.isIntersecting));
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    const current = domRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-[1500ms] cubic-bezier(0.16, 1, 0.3, 1) transform ${className} ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- TEXT AS ART COMPONENT ---
const ArtText = ({ title, children, highlightWords = [] }) => {
  return (
    <div className="py-32 px-6 md:px-12 max-w-5xl mx-auto">
      <Reveal>
        {title && (
          <div className="flex items-center gap-4 mb-8">
             <div className="h-[2px] bg-orange-600 w-12"></div>
             <p className="font-space text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
              {title}
            </p>
          </div>
        )}
        <div className="text-2xl md:text-5xl font-space font-bold leading-[1.15] text-zinc-100 uppercase text-art-block tracking-tight opacity-90 hover:opacity-100 transition-opacity">
          {children}
        </div>
      </Reveal>
    </div>
  );
};

// --- MEDIA FRAME COMPONENT ---
const MediaFrame = ({ children, caption }) => (
  <div className="py-12 bg-black w-full overflow-hidden border-y border-zinc-900">
    <div className="max-w-7xl mx-auto px-6">
      {caption && (
        <div className="flex justify-between items-end mb-4 border-b border-zinc-800 pb-2">
           <span className="font-space text-[10px] uppercase tracking-widest text-zinc-500">{caption}</span>
           <div className="flex gap-2">
             <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
           </div>
        </div>
      )}
      <Reveal className="w-full shadow-2xl">
        {children}
      </Reveal>
    </div>
  </div>
);

// --- MEET TONY SECTION ---
const MeetTony = () => {
  const scrollToGame = () => {
    document.getElementById('game-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center py-24 px-6 md:px-12 bg-zinc-950 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
        
        {/* GRAPHIC */}
        <Reveal>
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500 blur-[100px] opacity-20"></div>
            <img 
              src="/tony.png" 
              alt="Tony Low" 
              className="relative w-full max-w-md mx-auto object-contain drop-shadow-2xl grayscale hover:grayscale-0 transition duration-1000 ease-in-out" 
            />
          </div>
        </Reveal>

        {/* TEXT */}
        <Reveal delay={200} className="font-space">
          <h2 className="text-7xl md:text-8xl font-syne font-bold mb-8 text-white leading-[0.8] tracking-tighter">
            MEET<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">TONY</span>
          </h2>
          <div className="space-y-8 text-lg text-zinc-400 font-light leading-relaxed border-l border-zinc-800 pl-8">
            <p>
              Tony works in high tech sales, but cooking is where he gets to be creative. He calls his happy place the <strong className="text-white">Kitchen Lab</strong>, where he experiments with recipes he sees amidst his travels, recalls from his experiences, and learned from his family.
            </p>
            <p>
              Where his mother used her hands and one cleaver, Tony collects Japanese knives. Where she made do with whatever Milwaukee had, he imports ingredients. 
            </p>
            <p className="text-xl text-white font-medium">
              "But when he recreates her recipes, he's reliving a part of his childhood and teaching the culture to his kids."
            </p>
          </div>
          
          <button 
            onClick={scrollToGame}
            className="mt-12 group flex items-center gap-4 border border-zinc-700 bg-zinc-900/50 text-white px-8 py-4 font-space text-xs font-bold uppercase tracking-[0.2em] hover:bg-orange-600 hover:border-orange-600 hover:text-white transition-all duration-300"
          >
            Start Simulation <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/>
          </button>
        </Reveal>

      </div>
    </section>
  );
}

// --- THE GAME COMPONENT ---
const ShrimpCookingGame = () => {
  const assets = {
    tony: "/tony.png", wok: "/wok.png", stove: "/stove.png", shrimp: "/shrimp.png",
    oneShrimp: "/one-shrimp.png", finalShrimp: "/final-shrimp.png", seasonings: "/seasonings.png",
    salted_black_soy_beans: "/beans.png", garlic: "/garlic.png", shaoxing_wine: "/wine.png", egg: "/egg.png", knife: "/knife.png", 
  };

  const [gameState, setGameState] = useState('menu'); 
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [timeLeft, setTimeLeft] = useState(60); 
  const [shrimpPrepped, setShrimpPrepped] = useState(0);
  const targetShrimpCount = 6;
  const [sauceIngredientsAdded, setSauceIngredientsAdded] = useState([]);
  const requiredSauceIngredients = ['seasonings', 'salted_black_soy_beans', 'garlic', 'shaoxing_wine'];
  const [cookingStep, setCookingStep] = useState('empty');
  const [cookProgress, setCookProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (gameState !== 'menu' && gameState !== 'gameOver' && gameState !== 'lost' && gameState !== 'final') {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) { setGameState('lost'); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  useEffect(() => {
    let timer;
    if (gameState === 'cooking' && cookingStep === 'shrimp_cooking') {
      timer = setInterval(() => {
        setCookProgress(prev => {
          if (prev >= 100) {
            setCookingStep('shrimp_cooked');
            triggerFeedback("READY FOR SAUCE");
            return 100;
          }
          return prev + 1; 
        });
      }, 50);
    }
    return () => clearInterval(timer);
  }, [cookingStep, gameState]);

  const triggerFeedback = (text) => {
    setFeedback(text);
    setTimeout(() => setFeedback(''), 1000);
  };

  const handleDragStart = (e, item) => e.dataTransfer.setData("item", item);

  const handlePrepDrop = (e, index) => {
    e.preventDefault();
    if (e.dataTransfer.getData("item") === 'knife' && index === shrimpPrepped) {
      setShrimpPrepped(prev => prev + 1);
      triggerFeedback("DEVEINED");
    }
  };

  const handleSauceDrop = (e) => {
    e.preventDefault();
    const item = e.dataTransfer.getData("item");
    if (requiredSauceIngredients.includes(item) && !sauceIngredientsAdded.includes(item)) {
      setSauceIngredientsAdded(prev => [...prev, item]);
      triggerFeedback("ADDED");
    }
  };

  const handleWokDrop = (e) => {
    e.preventDefault();
    const item = e.dataTransfer.getData("item");
    if (item === 'prepped_shrimp' && cookingStep === 'empty') {
      setCookingStep('shrimp_cooking');
      triggerFeedback("HEATING");
    } else if (item === 'mixed_sauce' && cookingStep === 'shrimp_cooked') {
      setCookingStep('sauce_added');
      triggerFeedback("SIZZLE");
    } else if (item === 'egg' && cookingStep === 'sauce_added') {
      setCookingStep('egg_added');
      setScore(prev => prev + (timeLeft * 10)); 
      triggerFeedback("PERFECTO");
      setTimeout(() => setGameState('final'), 2000);
    }
  };

  const startGame = () => {
    setGameState('prep'); setScore(0); setTimeLeft(60);
    setShrimpPrepped(0); setSauceIngredientsAdded([]);
    setCookingStep('empty'); setCookProgress(0);
  };

  return (
    <div className="w-full h-[700px] border border-zinc-800 bg-zinc-950 relative select-none flex flex-col overflow-hidden shadow-2xl font-space text-zinc-200">
      {/* HUD */}
      <div className="h-16 border-b border-zinc-800 bg-black/50 backdrop-blur flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-8">
           <div>
             <span className="block text-[10px] font-bold uppercase text-zinc-500 leading-none mb-1">STATION</span>
             <span className="block font-bold text-lg leading-none text-orange-500">{gameState.toUpperCase()}</span>
           </div>
           {gameState !== 'menu' && gameState !== 'final' && gameState !== 'lost' && (
             <div className="w-48">
                <div className="flex justify-between text-[10px] font-bold mb-1">
                   <span>TIME</span>
                   <span className={timeLeft < 15 ? 'text-red-500 animate-pulse' : 'text-zinc-400'}>{timeLeft}s</span>
                </div>
                <div className="h-1 w-full bg-zinc-800">
                   <div className={`h-full transition-all duration-1000 ${timeLeft < 15 ? 'bg-red-500' : 'bg-orange-500'}`} style={{ width: `${(timeLeft / 60) * 100}%` }}></div>
                </div>
             </div>
           )}
        </div>
        <div>
           <span className="block text-[10px] font-bold uppercase text-zinc-500 leading-none mb-1 text-right">SCORE</span>
           <span className="block font-bold text-xl leading-none text-white">{score.toString().padStart(4, '0')}</span>
        </div>
      </div>

      {feedback && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60] pointer-events-none w-full text-center">
          <span className="text-6xl font-syne font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 drop-shadow-2xl animate-pulse">
            {feedback}
          </span>
        </div>
      )}

      {/* MENU (FIXED INSTRUCTIONS) */}
      {gameState === 'menu' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950 relative">
          <div className="border border-zinc-800 p-12 bg-black/80 text-center shadow-2xl backdrop-blur-sm max-w-md">
            <h1 className="text-5xl font-syne font-black mb-6 tracking-tighter text-white">KITCHEN<br/>LAB</h1>
            
            <div className="mb-8 text-left text-xs font-space font-bold text-zinc-400 tracking-widest uppercase border-t border-b border-zinc-800 py-6 space-y-3">
              <p><span className="text-orange-500">01.</span> DEVEIN SHRIMP WITH KNIFE</p>
              <p><span className="text-orange-500">02.</span> COMBINE 4 SAUCE ITEMS</p>
              <p><span className="text-orange-500">03.</span> WOK COOK: SHRIMP → SAUCE → EGG</p>
            </div>
            
            <button onClick={startGame} className="bg-orange-600 text-white text-xl font-bold py-4 px-12 hover:bg-white hover:text-black transition-all w-full tracking-widest">INITIALIZE</button>
          </div>
        </div>
      )}

      {/* STATIONS */}
      {gameState !== 'menu' && gameState !== 'final' && gameState !== 'lost' && (
        <div className="flex-1 relative bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] bg-zinc-900">
          
          {gameState === 'prep' && (
            <div className="h-full flex flex-col p-8 items-center">
              <div className="w-full flex justify-between items-end border-b border-zinc-800 pb-2 mb-8">
                <h2 className="text-2xl font-bold text-white">01 / DEVEIN</h2>
                <span className="text-xs font-bold bg-zinc-800 text-orange-500 px-2 py-1 border border-zinc-700">TOOL: KNIFE</span>
              </div>
              <div className="grid grid-cols-3 gap-8">
                 {[...Array(targetShrimpCount)].map((_, i) => (
                   <div key={i} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handlePrepDrop(e, i)}
                     className={`w-28 h-28 border border-zinc-700 bg-zinc-900 flex items-center justify-center transition-all relative ${i === shrimpPrepped ? 'shadow-[0_0_20px_rgba(249,115,22,0.3)] border-orange-500' : 'opacity-50'}`}>
                     {i < shrimpPrepped ? <CheckCircle className="w-16 h-16 text-green-500" /> : <img src={assets.oneShrimp} className="w-full h-full object-contain p-2" alt="Shrimp" />}
                   </div>
                 ))}
              </div>
              <div className="mt-auto">
                 <div draggable onDragStart={(e) => handleDragStart(e, 'knife')} className="bg-zinc-800 border border-zinc-700 p-6 cursor-grab active:cursor-grabbing hover:-translate-y-2 transition-transform shadow-lg rounded-full">
                   <img src={assets.knife} className="w-24 object-contain" alt="Knife" />
                 </div>
              </div>
              {shrimpPrepped === targetShrimpCount && <button onClick={() => setGameState('sauce')} className="absolute bottom-8 right-8 bg-orange-600 text-white px-6 py-3 font-bold hover:bg-white hover:text-black transition">NEXT &rarr;</button>}
            </div>
          )}

          {gameState === 'sauce' && (
            <div className="h-full flex flex-col p-8 items-center">
              <div className="w-full flex justify-between items-end border-b border-zinc-800 pb-2 mb-8">
                <h2 className="text-2xl font-bold text-white">02 / COMPOUND</h2>
                <span className="text-xs font-bold bg-zinc-800 text-orange-500 px-2 py-1 border border-zinc-700">ACTION: COMBINE</span>
              </div>
              <div className="flex flex-col md:flex-row w-full justify-between items-center max-w-5xl gap-12">
                <div className="grid grid-cols-2 gap-4">
                  {requiredSauceIngredients.map((item) => (
                    <div key={item} draggable={!sauceIngredientsAdded.includes(item)} onDragStart={(e) => handleDragStart(e, item)}
                      className={`w-32 h-32 border border-zinc-700 bg-zinc-900 flex flex-col items-center justify-center cursor-grab transition-all ${sauceIngredientsAdded.includes(item) ? 'opacity-20 pointer-events-none' : 'hover:border-orange-500 hover:bg-zinc-800'}`}>
                      <img src={assets[item]} className="w-16 h-16 object-contain mb-2" alt={item} />
                      <span className="font-bold text-[10px] uppercase text-zinc-400">{item}</span>
                    </div>
                  ))}
                </div>
                <div onDragOver={(e) => e.preventDefault()} onDrop={handleSauceDrop} className="w-80 h-80 border-2 border-zinc-700 rounded-full flex items-center justify-center relative bg-zinc-900 shadow-2xl overflow-hidden group">
                  <div className="absolute inset-4 border border-dashed border-zinc-600 rounded-full"></div>
                  <span className="text-xs font-bold z-10 bg-black text-white px-2 py-1 border border-zinc-700">MIXING BOWL</span>
                  <div className="absolute bottom-0 w-full bg-orange-700 transition-all duration-500 opacity-90" style={{height: `${sauceIngredientsAdded.length * 25}%`}}></div>
                </div>
              </div>
              {sauceIngredientsAdded.length === 4 && <button onClick={() => setGameState('cooking')} className="absolute bottom-8 right-8 bg-orange-600 text-white px-6 py-3 font-bold hover:bg-white hover:text-black transition">HEAT &rarr;</button>}
            </div>
          )}

          {gameState === 'cooking' && (
            <div className="h-full flex flex-col p-8 items-center relative">
               <div className="w-full flex justify-between items-end border-b border-zinc-800 pb-2 mb-4">
                <h2 className="text-2xl font-bold text-white">03 / THERMAL</h2>
                <span className="text-xs font-bold text-orange-500">{cookingStep.toUpperCase().replace('_', ' ')}</span>
              </div>
              <div className="relative flex-1 w-full flex items-center justify-center">
                 <div onDragOver={(e) => e.preventDefault()} onDrop={handleWokDrop} className="w-[500px] h-[400px] flex items-center justify-center relative transition-transform">
                    <div className="absolute inset-0 border-2 border-dashed border-orange-500/30 rounded-full animate-pulse pointer-events-none"></div>
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-orange-500 font-bold text-xs flex items-center gap-2 animate-bounce">
                        <MousePointer size={16}/> DRAG HERE
                    </div>
                    <img src={assets.wok} className="w-full h-full object-contain drop-shadow-2xl z-10" alt="Wok" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 flex items-center justify-center z-20">
                        {cookingStep !== 'empty' && <img src={assets.shrimp} className={`w-40 object-contain transition-all duration-500 ${cookingStep === 'shrimp_cooking' ? 'animate-pulse saturate-150' : ''}`} alt="Cooking" />}
                        {cookingStep === 'egg_added' && <img src={assets.egg} className="absolute top-0 right-0 w-24 animate-bounce" alt="Egg" />}
                    </div>
                 </div>
              </div>
              <div className="h-32 w-full border-t border-zinc-800 flex items-center justify-center gap-8 bg-zinc-900 z-30">
                {cookingStep === 'empty' && <div draggable onDragStart={(e) => handleDragStart(e, 'prepped_shrimp')} className="cursor-move hover:-translate-y-1 transition text-center group bg-zinc-800 border border-zinc-700 p-2 rounded animate-bounce"><img src={assets.shrimp} className="w-16 h-16 object-contain" alt="Prepped" /><span className="font-bold text-[10px] block border-t border-zinc-700 mt-2 pt-1 text-zinc-300">PREPPED SHRIMP</span></div>}
                {cookingStep === 'shrimp_cooked' && <div draggable onDragStart={(e) => handleDragStart(e, 'mixed_sauce')} className="cursor-move hover:-translate-y-1 transition text-center group bg-zinc-800 border border-zinc-700 p-2 rounded animate-bounce"><div className="w-16 h-16 flex items-center justify-center text-2xl">🥣</div><span className="font-bold text-[10px] block border-t border-zinc-700 mt-2 pt-1 text-zinc-300">SAUCE MIX</span></div>}
                {cookingStep === 'sauce_added' && <div draggable onDragStart={(e) => handleDragStart(e, 'egg')} className="cursor-move hover:-translate-y-1 transition text-center group bg-zinc-800 border border-zinc-700 p-2 rounded animate-bounce"><img src={assets.egg} className="w-16 h-16 object-contain" alt="Egg" /><span className="font-bold text-[10px] block border-t border-zinc-700 mt-2 pt-1 text-zinc-300">FARM EGG</span></div>}
              </div>
            </div>
          )}
        </div>
      )}

      {/* FINAL SCREENS */}
      {gameState === 'final' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-zinc-900 p-8">
          <div className="border border-zinc-700 p-12 max-w-2xl text-center shadow-2xl bg-zinc-950 rounded-lg">
            <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter uppercase text-white">Order Complete</h1>
            <p className="text-xl font-bold text-green-500 mb-8 border-b border-zinc-700 inline-block pb-2">TIME BONUS: +{timeLeft * 10}</p>
            <div className="my-8"><img src={assets.finalShrimp} alt="Final Dish" className="w-80 h-auto mx-auto drop-shadow-xl" /></div>
            <p className="text-sm font-bold mb-8 text-zinc-400">TOTAL SCORE: {score}</p>
            <button onClick={startGame} className="bg-orange-600 text-white px-8 py-4 font-bold hover:bg-white hover:text-black transition-colors w-full flex items-center justify-center gap-2 rounded-lg"><RotateCcw size={20}/> RESTART SHIFT</button>
          </div>
        </div>
      )}

      {gameState === 'lost' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-red-950 p-8 text-white">
          <div className="border border-red-500/50 p-12 max-w-2xl text-center rounded-lg bg-red-900/20">
            <AlertTriangle size={80} className="mx-auto mb-6 text-red-500" />
            <h1 className="text-6xl font-black mb-4 tracking-tighter uppercase">TOO SLOW</h1>
            <p className="text-2xl font-bold mb-12 text-red-200">The customer walked out.</p>
            <button onClick={startGame} className="bg-white text-red-900 px-8 py-4 font-bold hover:bg-black hover:text-white transition-colors w-full flex items-center justify-center gap-2 tracking-wide uppercase rounded-lg"><RotateCcw size={20}/> TRY AGAIN</button>
          </div>
        </div>
      )}

    </div>
  );
};


function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 selection:bg-orange-500 selection:text-white font-space">
      <FontStyles />
      
      {/* 1. ENTRY / TITLE PAGE (FIXED POSITIONS) */}
      <header 
        className="h-screen flex flex-col justify-between p-6 md:p-12 border-b border-zinc-800 relative bg-cover bg-center"
        style={{ backgroundImage: "url('/intro-tony.gif')" }}
      >
        <div className="absolute inset-0 bg-black/20 pointer-events-none backdrop-blur-[1px]"></div>

        <div className="flex justify-between items-start font-space font-bold text-xs tracking-[0.2em] uppercase relative z-10 text-white/80">
          <span>FOOD FOR THOUGHT</span>
          <span className="text-right">BY NITHYA SUNKARA INDLAMURI<br/>2025</span>
        </div>
        
        {/* Title moved to Bottom Right */}
        <div className="absolute -bottom-0 right-6 md:right-12 relative z-10 text-left">
          <h1 className="text-[8vw] leading-[0.85] font-syne font-black tracking-tighter uppercase text-white mix-blend-overlay opacity-90">
            TONY'S<br/>KITCHEN<br/>LAB
          </h1>
        </div>

        {/* Scroll Indicator moved to Bottom Left */}
        <div className="absolute bottom-14 left-6 md:left-12 relative z-10 flex flex-col items-center gap-2">
          <span className="text-[10px] font-space tracking-widest uppercase text-white/50">Scroll</span>
          <ArrowDown className="animate-bounce w-6 h-6 text-white" />
        </div>
      </header>

      {/* 2. MEET TONY */}
      <MeetTony />

      {/* 3. ART TEXT: ORIGINS */}
      <ArtText title="01. THE ARRIVAL">
        Tony Low's father arrived in America at five foot eleven, <span className="text-orange-500">125 pounds</span>. You could count his ribs. He'd fled communist China where he got two bowls of rice a day, crossed an ocean to a country where he didn't know the language.
        <br/><br/>
        The oldest son in a Chinese immigrant family, Tony watched his parents take any work that would have them.
      </ArtText>

      {/* 4. MEDIA: FILM */}
      <MediaFrame caption="ARCHIVE FILM: TO THE MOTHERS">
         <div className="w-full aspect-video bg-zinc-900 relative">
             <iframe 
                src="https://player.vimeo.com/video/1132358106?badge=0&autopause=0&player_id=0&app_id=58479" 
                className="w-full h-full opacity-80 hover:opacity-100 transition duration-1000" 
                frameBorder="0" 
                allow="autoplay; fullscreen; picture-in-picture" 
                allowFullScreen
                title="To the Mothers"
              ></iframe>
         </div>
      </MediaFrame>

      {/* 5. ART TEXT: RECIPE */}
      <ArtText title="02. THE RECIPE">
        His dad brought home the recipe for <span className="underline decoration-orange-600 decoration-4 underline-offset-4">Shrimp with Lobster Sauce</span> from the restaurant where he worked. It became a staple, reserved for celebrations.
      </ArtText>

      {/* 6. ART TEXT: LOVE */}
      <ArtText title="03. AFFECTION">
        In the Low house, meals weren't conversational. You sat down, ate what was in front of you, cleaned your plate. <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 font-black">THAT'S HOW HIS MOTHER SHOWED LOVE.</span>
        <br/><br/>
        She'd stand at the stove for hours. The best piece of fish always went to the kids, her bowl was always smallest, and "I already ate" was her most reliable lie.
      </ArtText>

      {/* 7. ARCHIVE COMPONENT (DARK GRID) */}
      <div className="py-24 bg-zinc-900 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-6">
          <p className="font-space text-xs font-bold uppercase tracking-widest text-orange-500 mb-12 text-center">/// ARCHIVAL DATA ///</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-zinc-800 border border-zinc-800">
              <div className="relative aspect-[4/5] bg-black group overflow-hidden">
                  <video src="/mom6.mp4" className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition duration-700" autoPlay loop muted playsInline />
              </div>
              <div className="relative aspect-[4/5] bg-zinc-950 flex items-center justify-center p-8 text-center border-x border-zinc-800">
                  <h3 className="text-6xl font-syne font-black text-white leading-none tracking-tighter">NO<br/>RECIPES<br/>JUST<br/><span className="text-orange-600">FEEL</span></h3>
              </div>
              <div className="relative aspect-[4/5] bg-black group overflow-hidden">
                  <img src="/mom1.png" className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition duration-700" />
              </div>
              <div className="relative aspect-[4/5] bg-zinc-950 flex items-center justify-center p-8 text-center border-t border-zinc-800">
                  <h3 className="text-6xl font-syne font-black text-zinc-800 leading-none tracking-tighter select-none">ONE<br/>KNIFE<br/>ONE<br/>WOK</h3>
              </div>
              <div className="relative aspect-[4/5] bg-black group overflow-hidden border-t border-zinc-800">
                  <img src="/mom2.png" className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition duration-700" />
              </div>
              <div className="relative aspect-[4/5] bg-black group overflow-hidden border-t border-l border-zinc-800">
                  <img src="/mom4.png" className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition duration-700" />
              </div>
          </div>
        </div>
      </div>

      {/* 8. ART TEXT: MAGIC */}
      <ArtText title="04. MAGIC DUST">
        She never measured anything. She just sprinkled <span className="italic text-orange-400">magic dust</span> on her food and it tasted better than anything Tony can make.
        <br/><br/>
        His mother lives in Colorado now. She's older, sicker. Tony's biggest regret is not living near her. The son feeding the mother who spent decades feeding him.
      </ArtText>

      {/* 9. GAME COMPONENT (DARK CONTAINER) */}
      <div id="game-section" className="py-24 bg-zinc-950 border-y border-zinc-900 my-12 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="max-w-5xl mx-auto px-6 relative z-10">
           <div className="mb-12 text-center">
             <h3 className="text-6xl font-syne font-black mb-2 tracking-tighter text-white">KITCHEN LAB</h3>
             <p className="font-space text-sm uppercase tracking-widest text-orange-500">Recreate the Recipe · Beat the Clock</p>
           </div>
           <ShrimpCookingGame />
           <p className="mt-6 text-[10px] text-zinc-700 text-center uppercase tracking-widest font-bold">Graphics by Gemini</p>
        </div>
      </div>

      {/* 10. CONCLUSION */}
      <div className="py-32 px-6 md:px-12 max-w-6xl mx-auto text-center">
        <Reveal>
          <p className="text-4xl md:text-7xl font-syne font-black text-white mb-8">Tony's love language is food.</p>
          <p className="text-xl md:text-2xl font-space text-zinc-500">You feed him, you're expressing your love. He cooks for you, he's giving it back.</p>
        </Reveal>
      </div>

      {/* 11. HIGHLIGHTED QUESTIONS */}
      <div className="bg-black text-white py-40 px-6 md:px-20 text-center relative overflow-hidden border-t border-zinc-900">
        <Reveal>
          <p className="font-space text-xs uppercase tracking-widest text-zinc-600 mb-24">/// FINAL INQUIRY ///</p>
          <div className="space-y-16 max-w-5xl mx-auto">
            
            <div className="group border-b border-zinc-900 pb-8 hover:border-orange-900 transition-colors">
                <p className="text-3xl md:text-5xl font-syne font-bold leading-tight text-zinc-300 group-hover:text-white transition-colors">
                  When was the last time you actually tasted your food instead of scrolling through it?
                </p>
            </div>

            <div className="group border-b border-zinc-900 pb-8 hover:border-orange-900 transition-colors">
                <p className="text-3xl md:text-5xl font-syne font-bold leading-tight text-zinc-300 group-hover:text-white transition-colors">
                  Who taught you to cook the dish that feels like home?
                </p>
            </div>

            <div className="relative p-12 border-2 border-orange-600 bg-orange-950/10 shadow-[0_0_80px_rgba(234,88,12,0.15)]">
                <div className="absolute top-0 left-0 w-2 h-2 bg-orange-500"></div>
                <div className="absolute top-0 right-0 w-2 h-2 bg-orange-500"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-orange-500"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-orange-500"></div>
                <p className="text-4xl md:text-6xl font-syne font-black leading-tight text-white uppercase tracking-tight">
                  And when they're gone, will you remember how they made it?
                </p>
            </div>

          </div>
        </Reveal>
      </div>

      <footer className="py-12 px-12 border-t border-zinc-900 bg-black text-zinc-700 flex justify-between text-xs font-bold tracking-widest uppercase font-space">
        <div>© 2025 FOOD FOR THOUGHT</div>
        <div>BUILT BY NITHYA AND GEMINI</div>
      </footer>
    </div>
  );
}

export default App;