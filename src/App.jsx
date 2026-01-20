import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, ArrowDown, Instagram, Mail, Globe, RotateCcw, Clock, AlertTriangle, Play, ChevronRight, MousePointer } from 'lucide-react';

// --- HELPER: FADE IN COMPONENT ---
// This must be defined before it is used in other components
const FadeIn = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => setIsVisible(entry.isIntersecting));
      },
      { threshold: 0.1 }
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
      className={`transition-all duration-1000 ease-out transform ${className} ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- STORY TEXT COMPONENT ---
const StoryBlock = ({ title, children, align = "left", className = "" }) => {
  const alignmentClasses = {
    left: "mr-auto text-left",
    center: "mx-auto text-center",
    right: "ml-auto text-right"
  };

  return (
    <div className={`py-32 px-6 md:px-20 max-w-7xl mx-auto ${className}`}>
      <FadeIn className={`max-w-4xl ${alignmentClasses[align]}`}>
        {title && (
          <div className={`flex items-center gap-4 mb-6 ${align === 'right' ? 'justify-end' : ''} ${align === 'center' ? 'justify-center' : ''}`}>
             {align !== 'right' && <div className="h-[1px] bg-orange-500 w-12"></div>}
             <p className="font-mono text-xs font-bold uppercase tracking-widest text-orange-500">
              {title}
            </p>
             {align === 'right' && <div className="h-[1px] bg-orange-500 w-12"></div>}
          </div>
        )}
        <div className="text-2xl md:text-4xl font-serif leading-relaxed text-stone-200 space-y-8">
          {children}
        </div>
      </FadeIn>
    </div>
  );
};

// --- MEET TONY SECTION ---
const MeetTony = () => {
  const scrollToGame = () => {
    const gameSection = document.getElementById('game-section');
    if (gameSection) {
      gameSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-32 px-6 md:px-12 bg-stone-900 border-b border-stone-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-900/10 blur-3xl"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* GRAPHIC SIDE */}
        <FadeIn>
          <div className="relative group flex justify-center">
            <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-3xl group-hover:opacity-40 transition-opacity"></div>
            <img 
              src="/tony.png" 
              alt="Tony Low" 
              className="relative w-full max-w-md object-contain drop-shadow-2xl transform hover:scale-105 transition duration-700" 
            />
          </div>
        </FadeIn>

        {/* TEXT SIDE */}
        <FadeIn delay={200}>
          <h2 className="text-7xl font-black mb-8 tracking-tighter text-white">MEET <span className="text-orange-500">TONY</span></h2>
          <div className="space-y-6 text-lg md:text-xl text-stone-400 font-light leading-relaxed">
            <p>
              Tony works in high tech sales, but cooking is where he gets to be creative. He calls his happy place the <span className="font-bold text-orange-400">Kitchen Lab</span>, where he experiments with recipes he sees amidst his travels, recalls from his experiences, and learned from his family.
            </p>
            <p>
              Where his mother used her hands and one cleaver, Tony collects Japanese knives. Where she made do with whatever Milwaukee had, he imports ingredients. 
            </p>
            <p className="font-serif italic text-2xl text-stone-200 border-l-4 border-orange-500 pl-6 my-8">
              "But when he recreates her recipes, he's reliving a part of his childhood and teaching the culture to his kids."
            </p>
          </div>
          
          <div className="mt-12">
            <button 
              onClick={scrollToGame}
              className="group flex items-center gap-4 bg-orange-600 text-white px-8 py-4 rounded-none font-mono font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            >
              Enter The Lab <ChevronRight className="group-hover:translate-x-1 transition-transform"/>
            </button>
          </div>
        </FadeIn>

      </div>
    </section>
  );
}

// --- THE GAME COMPONENT ---
const ShrimpCookingGame = () => {
  const assets = {
    tony: "/tony.png",
    wok: "/wok.png",
    stove: "/stove.png",
    shrimp: "/shrimp.png",         
    oneShrimp: "/one-shrimp.png", 
    finalShrimp: "/final-shrimp.png",
    seasonings: "/seasonings.png",
    beans: "/beans.png",
    garlic: "/garlic.png",
    wine: "/wine.png",
    egg: "/egg.png",
    knife: "/knife.png", 
  };

  const [gameState, setGameState] = useState('menu'); 
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [timeLeft, setTimeLeft] = useState(60); 
  
  const [shrimpPrepped, setShrimpPrepped] = useState(0);
  const targetShrimpCount = 6;
  const [sauceIngredientsAdded, setSauceIngredientsAdded] = useState([]);
  const requiredSauceIngredients = ['seasonings', 'beans', 'garlic', 'wine'];
  const [cookingStep, setCookingStep] = useState('empty');
  const [cookProgress, setCookProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (gameState !== 'menu' && gameState !== 'gameOver' && gameState !== 'lost' && gameState !== 'final') {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState('lost');
            return 0;
          }
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
    }
    if (item === 'mixed_sauce' && cookingStep === 'shrimp_cooked') {
      setCookingStep('sauce_added');
      triggerFeedback("SIZZLE");
    }
    if (item === 'egg' && cookingStep === 'sauce_added') {
      setCookingStep('egg_added');
      setScore(prev => prev + (timeLeft * 10)); 
      triggerFeedback("PERFECTO");
      setTimeout(() => setGameState('final'), 2000);
    }
  };

  const startGame = () => {
    setGameState('prep');
    setScore(0);
    setTimeLeft(60);
    setShrimpPrepped(0);
    setSauceIngredientsAdded([]);
    setCookingStep('empty');
    setCookProgress(0);
  };

  return (
    <div className="w-full h-[700px] border border-stone-700 bg-stone-900 relative select-none flex flex-col overflow-hidden shadow-2xl font-mono text-stone-200">
      {/* HUD */}
      <div className="h-16 border-b border-stone-700 bg-stone-800 flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-8">
           <div>
             <span className="block text-[10px] font-bold uppercase text-stone-500 leading-none mb-1">STATION</span>
             <span className="block font-bold text-lg leading-none text-orange-500">{gameState.toUpperCase()}</span>
           </div>
           
           {gameState !== 'menu' && gameState !== 'final' && gameState !== 'lost' && (
             <div className="w-48">
                <div className="flex justify-between text-[10px] font-bold mb-1">
                   <span>TIME REMAINING</span>
                   <span className={timeLeft < 15 ? 'text-red-500 animate-pulse' : 'text-zinc-400'}>{timeLeft}s</span>
                </div>
                <div className="h-1 w-full bg-zinc-800">
                   <div 
                     className={`h-full transition-all duration-1000 ${timeLeft < 15 ? 'bg-red-500' : 'bg-orange-500'}`} 
                     style={{ width: `${(timeLeft / 60) * 100}%` }}
                   ></div>
                </div>
             </div>
           )}
        </div>

        <div>
           <span className="block text-[10px] font-bold uppercase text-stone-500 leading-none mb-1 text-right">SCORE</span>
           <span className="block font-bold text-xl leading-none text-white">{score.toString().padStart(4, '0')}</span>
        </div>
      </div>

      {feedback && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60] pointer-events-none w-full text-center">
          <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-stone-400 drop-shadow-2xl animate-pulse">
            {feedback}
          </span>
        </div>
      )}

      {/* MENU */}
      {gameState === 'menu' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-zinc-900 relative">
          <div className="border border-zinc-700 p-12 bg-zinc-950/80 text-center shadow-2xl backdrop-blur-sm max-w-md">
            <h1 className="text-5xl font-black mb-4 tracking-tighter text-white">KITCHEN<br/>LAB</h1>
            <p className="text-xs font-bold mb-8 text-orange-500 tracking-widest uppercase border-t border-b border-zinc-700 py-4">
              Protocol: Complete Service in 60s
            </p>
            <button onClick={startGame} className="bg-orange-600 text-white text-xl font-bold py-4 px-12 hover:bg-white hover:text-black transition-all w-full">
              INITIALIZE
            </button>
          </div>
        </div>
      )}

      {/* GAME STAGES */}
      {gameState !== 'menu' && gameState !== 'final' && gameState !== 'lost' && (
        <div className="flex-1 relative bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]">
          
          {gameState === 'prep' && (
            <div className="h-full flex flex-col p-8 items-center">
              <div className="w-full flex justify-between items-end border-b border-zinc-700 pb-2 mb-8">
                <h2 className="text-2xl font-bold text-white">01 / DEVEIN</h2>
                <span className="text-xs font-bold bg-zinc-800 text-orange-500 px-2 py-1 border border-zinc-700">TOOL: KNIFE</span>
              </div>
              
              <div className="grid grid-cols-3 gap-8">
                 {[...Array(targetShrimpCount)].map((_, i) => (
                   <div key={i} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handlePrepDrop(e, i)}
                     className={`w-28 h-28 border border-zinc-600 bg-zinc-800 flex items-center justify-center transition-all relative
                       ${i === shrimpPrepped ? 'shadow-[0_0_15px_rgba(249,115,22,0.5)] border-orange-500' : 'opacity-50'}
                     `}>
                     {i < shrimpPrepped ? (
                        <CheckCircle className="w-16 h-16 text-green-500" />
                     ) : (
                        <img src={assets.oneShrimp} className="w-full h-full object-contain p-2" alt="Shrimp" />
                     )}
                   </div>
                 ))}
              </div>

              <div className="mt-auto">
                 <div draggable onDragStart={(e) => handleDragStart(e, 'knife')} className="bg-zinc-800 border border-zinc-600 p-6 cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-transform shadow-lg rounded-full">
                   <img src={assets.knife} className="w-24 object-contain" alt="Knife" />
                 </div>
              </div>
              
              {shrimpPrepped === targetShrimpCount && (
                <button onClick={() => setGameState('sauce')} className="absolute bottom-8 right-8 bg-orange-600 text-white px-6 py-3 font-bold hover:bg-white hover:text-black transition">NEXT &rarr;</button>
              )}
            </div>
          )}

          {gameState === 'sauce' && (
            <div className="h-full flex flex-col p-8 items-center">
              <div className="w-full flex justify-between items-end border-b border-zinc-700 pb-2 mb-8">
                <h2 className="text-2xl font-bold text-white">02 / COMPOUND</h2>
                <span className="text-xs font-bold bg-zinc-800 text-orange-500 px-2 py-1 border border-zinc-700">ACTION: COMBINE</span>
              </div>

              <div className="flex flex-col md:flex-row w-full justify-between items-center max-w-5xl gap-12">
                <div className="grid grid-cols-2 gap-4">
                  {requiredSauceIngredients.map((item) => (
                    <div key={item} draggable={!sauceIngredientsAdded.includes(item)} onDragStart={(e) => handleDragStart(e, item)}
                      className={`w-32 h-32 border border-zinc-600 bg-zinc-800 flex flex-col items-center justify-center cursor-grab transition-all
                        ${sauceIngredientsAdded.includes(item) ? 'opacity-20 pointer-events-none' : 'hover:border-orange-500 hover:bg-zinc-700'}`}>
                      <img src={assets[item]} className="w-16 h-16 object-contain mb-2" alt={item} />
                      <span className="font-bold text-[10px] uppercase text-zinc-400">{item}</span>
                    </div>
                  ))}
                </div>
                
                <div onDragOver={(e) => e.preventDefault()} onDrop={handleSauceDrop} className="w-80 h-80 border-2 border-zinc-600 rounded-full flex items-center justify-center relative bg-zinc-800 shadow-2xl overflow-hidden group">
                  <div className="absolute inset-4 border border-dashed border-zinc-500 rounded-full"></div>
                  <span className="text-xs font-bold z-10 bg-black text-white px-2 py-1 border border-zinc-700">MIXING BOWL</span>
                  <div className="absolute bottom-0 w-full bg-orange-700 transition-all duration-500 opacity-90" style={{height: `${sauceIngredientsAdded.length * 25}%`}}></div>
                </div>
              </div>

              {sauceIngredientsAdded.length === 4 && (
                <button onClick={() => setGameState('cooking')} className="absolute bottom-8 right-8 bg-orange-600 text-white px-6 py-3 font-bold hover:bg-white hover:text-black transition">HEAT &rarr;</button>
              )}
            </div>
          )}

          {gameState === 'cooking' && (
            <div className="h-full flex flex-col p-8 items-center relative">
               <div className="w-full flex justify-between items-end border-b border-zinc-700 pb-2 mb-4">
                <h2 className="text-2xl font-bold text-white">03 / THERMAL</h2>
                <span className="text-xs font-bold text-orange-500">{cookingStep.toUpperCase().replace('_', ' ')}</span>
              </div>

              <div className="relative flex-1 w-full flex items-center justify-center">
                 <div onDragOver={(e) => e.preventDefault()} onDrop={handleWokDrop} className="w-[500px] h-[400px] flex items-center justify-center relative transition-transform">
                    {/* TARGET INDICATOR */}
                    <div className="absolute inset-0 border-2 border-dashed border-orange-500/30 rounded-full animate-pulse pointer-events-none"></div>
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-orange-500 font-bold text-xs flex items-center gap-2 animate-bounce">
                        <MousePointer size={16}/> DRAG HERE
                    </div>

                    <img src={assets.wok} className="w-full h-full object-contain drop-shadow-2xl z-10" alt="Wok" />
                    
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 flex items-center justify-center z-20">
                        {cookingStep !== 'empty' && (
                            <img src={assets.shrimp} className={`w-40 object-contain transition-all duration-500 ${cookingStep === 'shrimp_cooking' ? 'animate-pulse saturate-150' : ''}`} alt="Cooking" />
                        )}
                        {cookingStep === 'egg_added' && (
                             <img src={assets.egg} className="absolute top-0 right-0 w-24 animate-bounce" alt="Egg" />
                        )}
                    </div>
                 </div>
              </div>

              <div className="h-32 w-full border-t border-zinc-700 flex items-center justify-center gap-8 bg-zinc-800 z-30">
                {cookingStep === 'empty' && (
                  <div draggable onDragStart={(e) => handleDragStart(e, 'prepped_shrimp')} className="cursor-move hover:-translate-y-1 transition text-center group bg-zinc-700 border border-zinc-500 p-2 rounded animate-bounce">
                     <img src={assets.shrimp} className="w-16 h-16 object-contain" alt="Prepped" />
                     <span className="font-bold text-[10px] block border-t border-zinc-600 mt-2 pt-1 text-zinc-300">PREPPED SHRIMP</span>
                  </div>
                )}
                {cookingStep === 'shrimp_cooked' && (
                   <div draggable onDragStart={(e) => handleDragStart(e, 'mixed_sauce')} className="cursor-move hover:-translate-y-1 transition text-center group bg-zinc-700 border border-zinc-500 p-2 rounded animate-bounce">
                      <div className="w-16 h-16 flex items-center justify-center text-2xl">🥣</div>
                      <span className="font-bold text-[10px] block border-t border-zinc-600 mt-2 pt-1 text-zinc-300">SAUCE MIX</span>
                   </div>
                )}
                 {cookingStep === 'sauce_added' && (
                   <div draggable onDragStart={(e) => handleDragStart(e, 'egg')} className="cursor-move hover:-translate-y-1 transition text-center group bg-zinc-700 border border-zinc-500 p-2 rounded animate-bounce">
                      <img src={assets.egg} className="w-16 h-16 object-contain" alt="Egg" />
                      <span className="font-bold text-[10px] block border-t border-zinc-600 mt-2 pt-1 text-zinc-300">FARM EGG</span>
                   </div>
                )}
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
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-orange-500 selection:text-white">
      
      {/* 1. ENTRY / TITLE PAGE */}
      <header 
        className="h-screen flex flex-col justify-between p-6 md:p-12 border-b border-zinc-800 relative bg-cover bg-center"
        style={{ backgroundImage: "url('/intro-tony.gif')" }}
      >
        {/* Dark overlay for cinema effect */}
        <div className="absolute inset-0 bg-black/50 pointer-events-none backdrop-blur-[1px]"></div>

        <div className="flex justify-between items-start font-bold text-xs tracking-widest uppercase relative z-10 text-white/80">
          <span>FOOD FOR THOUGHT</span>
          <span className="text-right">BY NITHYA SUNKARA INDLAMURI<br/>2025</span>
        </div>
        
        {/* Title bottom-left to avoid face */}
        <div className="absolute bottom-12 left-6 md:left-12 relative z-10">
          <h1 className="text-[10vw] leading-[0.85] font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-tr from-white to-zinc-400 drop-shadow-2xl">
            TONY'S<br/>KITCHEN LAB
          </h1>
        </div>

        <div className="absolute bottom-14 right-6 md:right-12 relative z-10">
          <ArrowDown className="animate-bounce w-10 h-10 text-white" />
        </div>
      </header>

      {/* 2. MEET TONY */}
      <MeetTony />

      {/* 3. STORY: ORIGINS */}
      <StoryBlock label="01. ORIGIN">
        <p>Tony Low's father arrived in America at five foot eleven, <span className="text-orange-500 font-bold">125 pounds</span>. You could count his ribs.</p>
        <p>He'd fled communist China where he got two bowls of rice a day, crossed an ocean to a country where he didn't know the language.</p>
        <p className="text-xl md:text-3xl text-zinc-400 font-sans mt-8 border-l-2 border-zinc-700 pl-6">
          The oldest son in a Chinese immigrant family, Tony watched his parents take any work that would have them: waiter, waitress, bartender, whatever paid rent.
        </p>
      </StoryBlock>

      {/* 4. STORY: RECIPE */}
      <StoryBlock label="02. THE RECIPE" align="right">
        <p>His dad brought home the recipe for <span className="underline decoration-2 underline-offset-8 decoration-orange-500 text-white">Shrimp with Lobster Sauce</span> from the restaurant where he worked.</p>
        <p>It became a staple, reserved for celebrations. Back then, there were only three Chinatowns in America. Getting Chinese ingredients meant driving a hundred miles to Chicago for these amazing dinners at authentic provincial restaurants.</p>
        <p className="italic text-zinc-500 font-bold text-2xl">"Hey Jack," they'd call out at the fish markets, giving him the best pick.</p>
      </StoryBlock>

      {/* 5. THE FILM COMPONENT */}
      <div className="py-24 bg-black relative border-y border-zinc-800">
        <div className="absolute inset-0 bg-orange-900/5"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
           <div className="flex justify-between items-end mb-6 border-b border-zinc-800 pb-4">
             <h2 className="text-xs font-bold uppercase tracking-widest text-orange-500 flex items-center gap-2"><Play size={12}/> FILM ARCHIVE</h2>
             <div className="text-xs font-bold tracking-widest uppercase text-right text-zinc-500">
                <span>To The Mothers</span>
             </div>
          </div>
          <div className="w-full aspect-video bg-zinc-900 border border-zinc-800 relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
               <iframe 
                  src="https://player.vimeo.com/video/1132358106?badge=0&autopause=0&player_id=0&app_id=58479" 
                  className="w-full h-full opacity-80 hover:opacity-100 transition duration-700" 
                  frameBorder="0" 
                  allow="autoplay; fullscreen; picture-in-picture" 
                  allowFullScreen
                  title="To the Mothers"
                ></iframe>
          </div>
        </div>
      </div>

      {/* 6. STORY: MOTHER'S LOVE */}
      <StoryBlock label="03. AFFECTION" align="center">
        <p>In the Low house, meals weren't conversational. You sat down, ate what was in front of you, cleaned your plate. <span className="font-bold text-white text-4xl block mt-6">That's how his mother showed love.</span></p>
        <p className="text-xl text-zinc-500 mt-6">She'd stand at the stove for hours with one knife and a cleaver. The best piece of fish always went to the kids, her bowl was always smallest, and "I already ate" was her most reliable lie.</p>
      </StoryBlock>

      {/* 7. STORY: OBSERVATION */}
      <StoryBlock label="04. TECHNIQUE">
        <p>Tony loved watching her work. The way she'd slice through things with her cleaver, chopping, dicing, mashing. It was like watching a movie.</p>
        <div className="bg-zinc-900 p-8 border-l-4 border-orange-500 mt-8">
          <p className="text-zinc-300">For the Shrimp with Lobster Sauce, she'd make this compote with fermented black beans, ginger, and garlic that had such a distinct, fascinating aroma. <span className="text-white font-bold">When she'd crack an egg into the wok, Tony knew the dish was minutes away.</span></p>
        </div>
      </StoryBlock>

      {/* 8. ARCHIVE COMPONENT (MIXED MEDIA GRID) */}
      <div className="py-24 bg-zinc-900 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-6">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-orange-500 mb-12 text-center">/// ARCHIVAL DATA ///</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 bg-zinc-800 border border-zinc-800">
              {/* CELL 1: VIDEO */}
              <div className="relative aspect-[3/4] bg-black group overflow-hidden">
                  <video src="/mom6.mp4" className="w-full h-full object-cover grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition duration-700" autoPlay loop muted playsInline />
                  <div className="absolute bottom-2 left-2 bg-orange-600 text-white text-[10px] px-2 py-1 font-mono uppercase tracking-widest">FIG A. PREP</div>
              </div>
              {/* CELL 2: TEXT ART */}
              <div className="relative aspect-[3/4] bg-orange-600 flex items-center justify-center p-8 text-center">
                  <h3 className="text-5xl font-black text-white leading-none tracking-tighter">NO<br/>RECIPES<br/>JUST<br/>FEEL</h3>
              </div>
              {/* CELL 3: IMAGE */}
              <div className="relative aspect-[3/4] bg-black group overflow-hidden">
                  <img src="/mom5.png" className="w-full h-full object-cover grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition duration-700" />
                  <div className="absolute bottom-2 left-2 bg-black text-white text-[10px] px-2 py-1 font-mono uppercase tracking-widest">FIG B. REDUCE</div>
              </div>
              {/* CELL 4: TEXT ART */}
              <div className="relative aspect-[3/4] bg-zinc-950 flex items-center justify-center p-8 text-center border border-zinc-800">
                  <h3 className="text-5xl font-black text-zinc-800 leading-none tracking-tighter select-none">ONE<br/>KNIFE<br/>ONE<br/>WOK</h3>
              </div>
              {/* CELL 5: IMAGE */}
              <div className="relative aspect-[3/4] bg-black group overflow-hidden">
                  <img src="/mom2.png" className="w-full h-full object-cover grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition duration-700" />
                  <div className="absolute bottom-2 left-2 bg-black text-white text-[10px] px-2 py-1 font-mono uppercase tracking-widest">FIG C. TRANSMIT</div>
              </div>
              {/* CELL 6: IMAGE */}
              <div className="relative aspect-[3/4] bg-black group overflow-hidden">
                  <img src="/mom4.png" className="w-full h-full object-cover grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition duration-700" />
                  <div className="absolute bottom-2 left-2 bg-black text-white text-[10px] px-2 py-1 font-mono uppercase tracking-widest">FIG D. NOURISH</div>
              </div>
          </div>
        </div>
      </div>

      {/* 9. STORY: REGRET */}
      <StoryBlock label="05. DISTANCE" align="right">
        <p>His mother lives in Colorado now. She's older, sicker, can't cook much anymore. Tony's biggest regret is not living near her.</p>
        <p className="text-xl text-zinc-500 italic">After filming this project, he's visited twice. Each time, he cooks for her. The son feeding the mother who spent decades feeding him.</p>
      </StoryBlock>

      {/* 10. STORY: MAGIC DUST */}
      <StoryBlock label="06. MAGIC DUST">
        <p>She never measured anything, never wrote anything down. She just sprinkled <span className="text-purple-400 font-bold">magic dust</span> on her food and it tasted better than anything Tony can make.</p>
        <p className="text-zinc-400">He wants to glean more of her recipes before it's too late.</p>
      </StoryBlock>

      {/* 11. GAME COMPONENT (DARK CONTAINER) */}
      <div id="game-section" className="py-24 bg-zinc-900 border-y border-zinc-800 my-12 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="max-w-5xl mx-auto px-6 relative z-10">
           <div className="mb-12 text-center">
             <h3 className="text-5xl font-black mb-2 tracking-tight text-white">KITCHEN LAB SIMULATOR</h3>
             <p className="font-mono text-sm uppercase tracking-widest text-orange-500">Recreate the Recipe · Beat the Clock</p>
           </div>
           <ShrimpCookingGame />
           <p className="mt-6 text-[10px] text-zinc-600 text-center uppercase tracking-widest font-bold">Graphics by Gemini</p>
        </div>
      </div>

      {/* 12. STORY: LOVE LANGUAGE */}
      <StoryBlock label="07. CONCLUSION" align="center">
        <p className="text-4xl md:text-7xl font-black text-white">Tony's love language is food.</p>
        <p className="text-2xl text-zinc-500 mt-8">You feed him, you're expressing your love. He cooks for you, he's giving it back.</p>
      </StoryBlock>

      {/* 13. ENDING QUESTIONS (HIGHLIGHTED) */}
      <div className="bg-black text-white py-40 px-6 md:px-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
        <FadeIn>
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-500 mb-20">/// FINAL DATA ///</p>
          <div className="space-y-12 max-w-5xl mx-auto">
            
            {/* Question 1 */}
            <div className="border border-zinc-800 p-8 hover:border-orange-500 transition-colors duration-500 group">
                <p className="text-2xl md:text-4xl font-bold leading-tight group-hover:text-orange-500 transition-colors">
                  When was the last time you actually tasted your food instead of scrolling through it?
                </p>
            </div>

            {/* Question 2 */}
            <div className="border border-zinc-800 p-8 hover:border-orange-500 transition-colors duration-500 group">
                <p className="text-2xl md:text-4xl font-bold leading-tight group-hover:text-orange-500 transition-colors">
                  Who taught you to cook the dish that feels like home?
                </p>
            </div>

            {/* Question 3 - Highlighted */}
            <div className="border-2 border-orange-600 p-10 bg-orange-950/20 shadow-[0_0_50px_rgba(234,88,12,0.2)]">
                <p className="text-3xl md:text-5xl font-black leading-tight text-white italic">
                  And when they're gone, will you remember how they made it?
                </p>
            </div>

          </div>
        </FadeIn>
      </div>

      <footer className="py-8 px-12 border-t border-zinc-800 bg-zinc-950 text-zinc-600 flex justify-between text-xs font-bold tracking-widest uppercase font-mono">
        <div>© 2025 ALL RIGHTS RESERVED</div>
        <div>BUILT BY NITHYA AND GEMINI</div>
      </footer>
    </div>
  );
}

export default App;