import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, ArrowDown, Instagram, Mail, Globe, RotateCcw, Clock, AlertTriangle, Play, ChevronRight } from 'lucide-react';

// --- HELPER: FADE IN COMPONENT ---
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
    <div className={`py-24 px-6 md:px-20 max-w-7xl mx-auto ${className}`}>
      <FadeIn className={`max-w-4xl ${alignmentClasses[align]}`}>
        {title && (
          <div className="flex items-center gap-4 mb-6">
             <div className="h-[1px] bg-orange-500 w-12"></div>
             <p className="font-mono text-xs font-bold uppercase tracking-widest text-orange-600">
              {title}
            </p>
          </div>
        )}
        <div className="text-2xl md:text-4xl font-serif leading-relaxed text-slate-800 space-y-8">
          {children}
        </div>
      </FadeIn>
    </div>
  );
};

// --- NEW: MEET TONY SECTION ---
const MeetTony = () => {
  const scrollToGame = () => {
    const gameSection = document.getElementById('game-section');
    if (gameSection) {
      gameSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 px-6 md:px-12 bg-slate-100 border-b border-slate-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* GRAPHIC SIDE */}
        <FadeIn>
          <div className="relative group flex justify-center">
            <div className="absolute inset-0 bg-orange-200 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            {/* Using the updated tony.png graphic */}
            <img 
              src="/tony.png" 
              alt="Tony Low" 
              className="relative w-full max-w-md object-contain drop-shadow-2xl transform hover:scale-105 transition duration-700" 
            />
          </div>
        </FadeIn>

        {/* TEXT SIDE */}
        <FadeIn delay={200}>
          <h2 className="text-6xl font-black mb-8 tracking-tighter text-slate-900">MEET TONY</h2>
          <div className="space-y-6 text-lg md:text-xl text-slate-700 font-light leading-relaxed">
            <p>
              Tony works in high tech sales, but cooking is where he gets to be creative. He calls his happy place the <span className="font-bold text-orange-600">Kitchen Lab</span>, where he experiments with recipes he sees amidst his travels, recalls from his experiences, and learned from his family.
            </p>
            <p>
              Where his mother used her hands and one cleaver, Tony collects Japanese knives. Where she made do with whatever Milwaukee had, he imports ingredients. 
            </p>
            <p className="font-serif italic text-2xl text-slate-900 border-l-4 border-orange-500 pl-6">
              "But when he recreates her recipes, he's reliving a part of his childhood and teaching the culture to his kids."
            </p>
          </div>
          
          <div className="mt-12">
            <button 
              onClick={scrollToGame}
              className="group flex items-center gap-4 bg-orange-600 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg hover:shadow-xl"
            >
              Play Game <ChevronRight className="group-hover:translate-x-1 transition-transform"/>
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
    salted_black_soy_beans: "/beans.png",
    garlic: "/garlic.png",
    shaoxing_wine: "/wine.png",
    egg: "/egg.png",
    knife: "/knife.png", 
  };

  const [gameState, setGameState] = useState('menu'); 
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);
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

  const handleDragStart = (e, item) => setDraggedItem(item);

  const handlePrepDrop = (e, index) => {
    e.preventDefault();
    if (draggedItem === 'knife' && index === shrimpPrepped) {
      setShrimpPrepped(prev => prev + 1);
      triggerFeedback("DEVEINED");
    }
  };

  const handleSauceDrop = (e) => {
    e.preventDefault();
    if (requiredSauceIngredients.includes(draggedItem) && !sauceIngredientsAdded.includes(draggedItem)) {
      setSauceIngredientsAdded(prev => [...prev, draggedItem]);
      triggerFeedback("ADDED");
    }
  };

  const handleWokDrop = (e) => {
    e.preventDefault();
    if (draggedItem === 'prepped_shrimp' && cookingStep === 'empty') {
      setCookingStep('shrimp_cooking');
      triggerFeedback("HEATING");
    }
    if (draggedItem === 'mixed_sauce' && cookingStep === 'shrimp_cooked') {
      setCookingStep('sauce_added');
      triggerFeedback("SIZZLE");
    }
    if (draggedItem === 'egg' && cookingStep === 'sauce_added') {
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
    <div className="w-full h-[700px] border-4 border-slate-800 bg-stone-100 relative select-none flex flex-col overflow-hidden rounded-xl shadow-2xl font-mono">
      <div className="h-16 border-b-4 border-slate-800 bg-white flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-8">
           <div>
             <span className="block text-[10px] font-bold uppercase text-gray-400 leading-none mb-1">STATION</span>
             <span className="block font-bold text-lg leading-none text-slate-800">{gameState.toUpperCase()}</span>
           </div>
           
           {gameState !== 'menu' && gameState !== 'final' && gameState !== 'lost' && (
             <div className="w-48">
                <div className="flex justify-between text-[10px] font-bold mb-1">
                   <span>TIME</span>
                   <span className={timeLeft < 15 ? 'text-red-600' : 'text-black'}>{timeLeft}s</span>
                </div>
                <div className="h-2 w-full bg-gray-200 border border-slate-800 rounded-full overflow-hidden">
                   <div 
                     className={`h-full transition-all duration-1000 ${timeLeft < 15 ? 'bg-red-600' : 'bg-green-500'}`} 
                     style={{ width: `${(timeLeft / 60) * 100}%` }}
                   ></div>
                </div>
             </div>
           )}
        </div>

        <div>
           <span className="block text-[10px] font-bold uppercase text-gray-400 leading-none mb-1 text-right">SCORE</span>
           <span className="block font-bold text-xl leading-none text-slate-800">{score.toString().padStart(4, '0')}</span>
        </div>
      </div>

      {feedback && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60] pointer-events-none w-full text-center">
          <span className="text-4xl font-black bg-orange-600 text-white px-6 py-4 border-4 border-white shadow-xl inline-block rounded-lg transform -rotate-2">
            {feedback}
          </span>
        </div>
      )}

      {gameState === 'menu' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-stone-100 relative">
          <div className="border-4 border-slate-800 p-12 bg-white text-center shadow-xl rounded-lg max-w-md">
            <h1 className="text-5xl font-black mb-4 tracking-tighter text-slate-900">KITCHEN<br/>LAB</h1>
            <p className="text-sm font-bold mb-8 text-gray-500 tracking-widest uppercase border-t border-b border-gray-200 py-4">
              Complete Service in 60s
            </p>
            <button onClick={startGame} className="bg-slate-900 text-white text-xl font-bold py-4 px-12 hover:bg-orange-600 transition-colors w-full rounded-lg">
              START
            </button>
          </div>
        </div>
      )}

      {gameState !== 'menu' && gameState !== 'final' && gameState !== 'lost' && (
        <div className="flex-1 relative bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]">
          
          {gameState === 'prep' && (
            <div className="h-full flex flex-col p-8 items-center">
              <div className="w-full flex justify-between items-end border-b-2 border-slate-800 pb-2 mb-8">
                <h2 className="text-2xl font-bold text-slate-800">01 / DEVEIN</h2>
                <span className="text-xs font-bold bg-slate-800 text-white px-2 py-1 rounded">TOOL: KNIFE</span>
              </div>
              
              <div className="grid grid-cols-3 gap-8">
                 {[...Array(targetShrimpCount)].map((_, i) => (
                   <div key={i} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handlePrepDrop(e, i)}
                     className={`w-28 h-28 border-2 border-slate-800 bg-white flex items-center justify-center transition-all relative rounded-lg
                       ${i === shrimpPrepped ? 'shadow-lg scale-105' : 'opacity-50'}
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
                 <div draggable onDragStart={(e) => handleDragStart(e, 'knife')} className="bg-white border-2 border-slate-800 p-6 cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-transform shadow-lg rounded-full">
                   <img src={assets.knife} className="w-24 object-contain" alt="Knife" />
                 </div>
              </div>
              
              {shrimpPrepped === targetShrimpCount && (
                <button onClick={() => setGameState('sauce')} className="absolute bottom-8 right-8 bg-slate-900 text-white px-6 py-3 font-bold hover:bg-orange-600 transition rounded-lg">NEXT &rarr;</button>
              )}
            </div>
          )}

          {gameState === 'sauce' && (
            <div className="h-full flex flex-col p-8 items-center">
              <div className="w-full flex justify-between items-end border-b-2 border-slate-800 pb-2 mb-8">
                <h2 className="text-2xl font-bold text-slate-800">02 / COMPOUND</h2>
                <span className="text-xs font-bold bg-slate-800 text-white px-2 py-1 rounded">ACTION: COMBINE</span>
              </div>

              <div className="flex flex-col md:flex-row w-full justify-between items-center max-w-5xl gap-12">
                <div className="grid grid-cols-2 gap-4">
                  {requiredSauceIngredients.map((item) => (
                    <div key={item} draggable={!sauceIngredientsAdded.includes(item)} onDragStart={(e) => handleDragStart(e, item)}
                      className={`w-32 h-32 border-2 border-slate-800 bg-white flex flex-col items-center justify-center cursor-grab transition-all rounded-lg
                        ${sauceIngredientsAdded.includes(item) ? 'opacity-20 pointer-events-none' : 'hover:shadow-lg hover:scale-105'}`}>
                      <img src={assets[item]} className="w-16 h-16 object-contain mb-2" alt={item} />
                      <span className="font-bold text-[10px] uppercase">{item}</span>
                    </div>
                  ))}
                </div>
                
                <div onDragOver={(e) => e.preventDefault()} onDrop={handleSauceDrop} className="w-80 h-80 border-4 border-slate-800 rounded-full flex items-center justify-center relative bg-white shadow-xl overflow-hidden group">
                  <div className="absolute inset-4 border border-dashed border-gray-300 rounded-full"></div>
                  <span className="text-xs font-bold z-10 bg-slate-800 text-white px-2 py-1 rounded">MIXING BOWL</span>
                  <div className="absolute bottom-0 w-full bg-orange-500 transition-all duration-500 opacity-90" style={{height: `${sauceIngredientsAdded.length * 25}%`}}></div>
                </div>
              </div>

              {sauceIngredientsAdded.length === 4 && (
                <button onClick={() => setGameState('cooking')} className="absolute bottom-8 right-8 bg-slate-900 text-white px-6 py-3 font-bold hover:bg-orange-600 transition rounded-lg">HEAT &rarr;</button>
              )}
            </div>
          )}

          {gameState === 'cooking' && (
            <div className="h-full flex flex-col p-8 items-center relative">
               <div className="w-full flex justify-between items-end border-b-2 border-slate-800 pb-2 mb-4">
                <h2 className="text-2xl font-bold text-slate-800">03 / THERMAL</h2>
                <span className="text-xs font-bold text-orange-600">{cookingStep.toUpperCase().replace('_', ' ')}</span>
              </div>

              <div className="relative flex-1 w-full flex items-center justify-center">
                 <div onDragOver={(e) => e.preventDefault()} onDrop={handleWokDrop} className="w-[500px] h-[400px] flex items-center justify-center relative transition-transform">
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

              <div className="h-32 w-full border-t-2 border-slate-800 flex items-center justify-center gap-8 bg-gray-100 z-30">
                {cookingStep === 'empty' && (
                  <div draggable onDragStart={(e) => handleDragStart(e, 'prepped_shrimp')} className="cursor-move hover:-translate-y-1 transition text-center group bg-white border-2 border-slate-800 p-2 shadow-lg rounded-lg">
                     <img src={assets.shrimp} className="w-16 h-16 object-contain" alt="Prepped" />
                     <span className="font-bold text-[10px] block border-t border-slate-800 mt-2 pt-1">PREPPED SHRIMP</span>
                  </div>
                )}
                {cookingStep === 'shrimp_cooked' && (
                   <div draggable onDragStart={(e) => handleDragStart(e, 'mixed_sauce')} className="cursor-move hover:-translate-y-1 transition text-center group bg-white border-2 border-slate-800 p-2 shadow-lg rounded-lg">
                      <div className="w-16 h-16 flex items-center justify-center text-2xl">🥣</div>
                      <span className="font-bold text-[10px] block border-t border-slate-800 mt-2 pt-1">SAUCE MIX</span>
                   </div>
                )}
                 {cookingStep === 'sauce_added' && (
                   <div draggable onDragStart={(e) => handleDragStart(e, 'egg')} className="cursor-move hover:-translate-y-1 transition text-center group bg-white border-2 border-slate-800 p-2 shadow-lg rounded-lg">
                      <img src={assets.egg} className="w-16 h-16 object-contain" alt="Egg" />
                      <span className="font-bold text-[10px] block border-t border-slate-800 mt-2 pt-1">FARM EGG</span>
                   </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {gameState === 'final' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-white p-8">
          <div className="border-4 border-slate-800 p-12 max-w-2xl text-center shadow-2xl bg-stone-50 rounded-lg">
            <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter uppercase text-slate-900">Order Complete</h1>
            <p className="text-xl font-bold text-green-600 mb-8 border-b-2 border-slate-800 inline-block pb-2">TIME BONUS: +{timeLeft * 10}</p>
            
            <div className="my-8">
                <img src={assets.finalShrimp} alt="Final Dish" className="w-80 h-auto mx-auto drop-shadow-xl" />
            </div>

            <p className="text-sm font-bold mb-8">TOTAL SCORE: {score}</p>
            
            <button onClick={startGame} className="bg-slate-900 text-white px-8 py-4 font-bold hover:bg-orange-600 transition-colors w-full flex items-center justify-center gap-2 rounded-lg">
              <RotateCcw size={20}/> RESTART SHIFT
            </button>
          </div>
        </div>
      )}

      {gameState === 'lost' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-red-600 p-8 text-white">
          <div className="border-4 border-white p-12 max-w-2xl text-center rounded-lg">
            <AlertTriangle size={80} className="mx-auto mb-6" />
            <h1 className="text-6xl font-black mb-4 tracking-tighter uppercase">TOO SLOW</h1>
            <p className="text-2xl font-bold mb-12">The customer walked out.</p>
            
            <button onClick={startGame} className="bg-white text-red-600 px-8 py-4 font-bold hover:bg-black hover:text-white transition-colors w-full flex items-center justify-center gap-2 tracking-wide uppercase rounded-lg">
              <RotateCcw size={20}/> TRY AGAIN
            </button>
          </div>
        </div>
      )}

    </div>
  );
};


function App() {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 selection:bg-orange-200 selection:text-orange-900 font-sans">
      
      {/* 1. ENTRY / TITLE PAGE */}
      <header 
        className="h-screen flex flex-col justify-between p-6 md:p-12 border-b border-slate-300 relative bg-cover bg-center"
        style={{ backgroundImage: "url('/intro-tony.gif')" }}
      >
        <div className="absolute inset-0 bg-white/40 pointer-events-none backdrop-blur-[1px]"></div>

        <div className="flex justify-between items-start font-bold text-xs tracking-widest uppercase relative z-10 text-slate-900">
          <span>FOOD FOR THOUGHT</span>
          <span className="text-right">BY NITHYA SUNKARA INDLAMURI<br/>2025</span>
        </div>
        
        <div className="text-center md:text-left relative z-10">
          <h1 className="text-[12vw] leading-[0.8] top-10 font-black tracking-tighter uppercase mix-blend-difference text-black mt-[15px]">
            TONY'S KITCHEN LAB
          </h1>
        </div>

        <div className="flex justify-between items-end relative z-10 text-slate-900">
          <div className="hidden md:block font-bold text-xs max-w-xs tracking-wide leading-relaxed">
            From kitchen to camera to code, this is a digital exploration of humanity's most primitive and prominent loves: food and mothers.
          </div>
          <ArrowDown className="animate-bounce w-8 h-8" />
        </div>
      </header>

      {/* 2. MEET TONY */}
      <MeetTony />

      {/* 3. STORY: ORIGINS */}
      <StoryBlock title="01. The Arrival">
        <p>Tony Low's father arrived in America at five foot eleven, <span className="font-bold text-orange-600">125 pounds</span>. You could count his ribs.</p>
        <p>He'd fled communist China where he got two bowls of rice a day, crossed an ocean to a country where he didn't know the language.</p>
        <p className="text-xl md:text-3xl text-slate-600 font-sans mt-8">
          The oldest son in a Chinese immigrant family, Tony watched his parents take any work that would have them: waiter, waitress, bartender, whatever paid rent and put food on the table for three kids who knew they were poor but were happy anyway.
        </p>
      </StoryBlock>

      {/* 4. STORY: RECIPE */}
      <StoryBlock title="02. The Recipe" align="right">
        <p>His dad brought home the recipe for <span className="underline decoration-2 underline-offset-4 decoration-orange-400">Shrimp with Lobster Sauce</span> from the restaurant where he worked.</p>
        <p>It became a staple, reserved for celebrations. Back then, there were only three Chinatowns in America. Getting Chinese ingredients meant driving a hundred miles to Chicago for these amazing dinners at authentic provincial restaurants.</p>
        <p className="italic text-slate-500">At the fish markets, everyone knew Tony's dad. "Hey Jack," they'd call out, giving him the best pick. His parents recreated what they could from memory and whatever Milwaukee, Wisconsin had to offer.</p>
      </StoryBlock>

      {/* 5. THE FILM COMPONENT (MARGINS) */}
      <div className="py-12 bg-slate-900 text-white my-24">
        <div className="max-w-6xl mx-auto px-6">
           <div className="flex justify-between items-end mb-4 border-b border-gray-700 pb-2">
             <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">THE FILM</h2>
             <div className="text-xs font-bold tracking-widest uppercase text-right text-gray-400">
                <span>FEATURING TONY LOW</span>
             </div>
          </div>
          <div className="w-full aspect-video bg-zinc-900 border border-zinc-800 relative shadow-2xl">
               <iframe 
                  src="https://player.vimeo.com/video/1132358106?badge=0&autopause=0&player_id=0&app_id=58479" 
                  className="w-full h-full" 
                  frameBorder="0" 
                  allow="autoplay; fullscreen; picture-in-picture" 
                  allowFullScreen
                  title="To the Mothers"
                ></iframe>
          </div>
        </div>
      </div>

      {/* 6. STORY: MOTHER'S LOVE */}
      <StoryBlock title="03. Affection" align="right">
        <p>In the Low house, meals weren't conversational. You sat down, ate what was in front of you, cleaned your plate. <span className="font-bold text-slate-900">That's how his mother showed love.</span></p>
        <p className="text-xl text-slate-500">She'd stand at the stove for hours with one knife and a cleaver. The best piece of fish always went to the kids, her bowl was always smallest, and "I already ate" was her most reliable lie.</p>
      </StoryBlock>

      {/* 7. STORY: OBSERVATION */}
      <StoryBlock title="04. Memory">
        <p>Tony loved watching her work. The way she'd slice through things with her cleaver, chopping, dicing, mashing. It was like watching a movie.</p>
        <p className="text-orange-700 font-bold">For the Shrimp with Lobster Sauce, she'd make this compote with fermented black beans, ginger, and garlic that had such a distinct, fascinating aroma. When she'd crack an egg into the wok, Tony knew the dish was minutes away.</p>
      </StoryBlock>

      {/* 8. ARCHIVE COMPONENT */}
      <div className="py-24 bg-slate-200 my-24">
        <div className="max-w-7xl mx-auto px-6">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-slate-500 mb-8 text-center">ARCHIVAL FOOTAGE</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
              <div className="relative aspect-[3/4] bg-white group overflow-hidden">
                  <video src="/mom6.mp4" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-700" autoPlay loop muted playsInline />
                  <div className="absolute bottom-2 left-2 bg-black text-white text-[10px] px-2 py-1 font-mono uppercase tracking-widest">FIG A. PREP</div>
              </div>
              <div className="relative aspect-[3/4] bg-white group overflow-hidden">
                  <img src="/mom1.png" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-700" />
                  <div className="absolute bottom-2 left-2 bg-black text-white text-[10px] px-2 py-1 font-mono uppercase tracking-widest">FIG B. RAW</div>
              </div>
              <div className="relative aspect-[3/4] bg-white group overflow-hidden">
                  <img src="/mom5.png" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-700" />
                  <div className="absolute bottom-2 left-2 bg-black text-white text-[10px] px-2 py-1 font-mono uppercase tracking-widest">FIG C. REDUCE</div>
              </div>
              <div className="relative aspect-[3/4] bg-white group overflow-hidden">
                  <img src="/mom3.png" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-700" />
                  <div className="absolute bottom-2 left-2 bg-black text-white text-[10px] px-2 py-1 font-mono uppercase tracking-widest">FIG D. ASSEMBLE</div>
              </div>
              <div className="relative aspect-[3/4] bg-white group overflow-hidden">
                  <img src="/mom2.png" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-700" />
                  <div className="absolute bottom-2 left-2 bg-black text-white text-[10px] px-2 py-1 font-mono uppercase tracking-widest">FIG E. TRANSMIT</div>
              </div>
              <div className="relative aspect-[3/4] bg-white group overflow-hidden">
                  <img src="/mom4.png" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-700" />
                  <div className="absolute bottom-2 left-2 bg-black text-white text-[10px] px-2 py-1 font-mono uppercase tracking-widest">FIG F. NOURISH</div>
              </div>
          </div>
        </div>
      </div>

      {/* 9. STORY: REGRET */}
      <StoryBlock title="05. Distance" align="right">
        <p>His mother lives in Colorado now. She's older, sicker, can't cook much anymore. Tony's biggest regret is not living near her.</p>
        <p className="text-xl text-slate-600 italic">After filming this project, he's visited twice. Each time, he cooks for her. The son feeding the mother who spent decades feeding him.</p>
      </StoryBlock>

      {/* 10. STORY: MAGIC DUST */}
      <StoryBlock title="06. The Secret">
        <p>She never measured anything, never wrote anything down. She just sprinkled <span className="text-purple-600 font-bold">magic dust</span> on her food and it tasted better than anything Tony can make.</p>
        <p>He wants to glean more of her recipes before it's too late.</p>
      </StoryBlock>

      {/* 11. GAME COMPONENT (MARGINS) */}
      <div id="game-section" className="py-24 bg-orange-50 border-y border-orange-200 my-24">
        <div className="max-w-6xl mx-auto px-6">
           <div className="mb-12 text-center">
             <h3 className="text-4xl font-black mb-2 tracking-tight text-orange-900">KITCHEN LAB SIMULATOR</h3>
             <p className="font-mono text-sm uppercase tracking-widest text-orange-700">Recreate the Recipe · Beat the Clock</p>
           </div>
           <ShrimpCookingGame />
        </div>
      </div>

      {/* 12. STORY: LOVE LANGUAGE */}
      <StoryBlock title="07. Love Language" align="center">
        <p className="text-4xl md:text-6xl font-black text-slate-900">Tony's love language is food.</p>
        <p className="text-xl text-slate-500 mt-8">You feed him, you're expressing your love. He cooks for you, he's giving it back.</p>
      </StoryBlock>

      {/* 13. ENDING QUESTIONS */}
      <div className="bg-slate-900 text-white py-32 px-6 md:px-20 text-center">
        <FadeIn>
          <p className="font-mono text-xs uppercase tracking-widest text-orange-500 mb-12">WHAT MATTERS</p>
          <div className="space-y-12 max-w-4xl mx-auto text-2xl md:text-4xl font-serif leading-relaxed">
            <p>What follows is Tony's story, his mother's recipe, and a reminder to cherish every plate and every person because here's what matters:</p>
            <p>When was the last time you actually tasted your food instead of scrolling through it?</p>
            <p>Who taught you to cook the dish that feels like home?</p>
            <p className="text-slate-400">And when they're gone, will you remember how they made it, or will you wish you'd paid attention?</p>
          </div>
        </FadeIn>
      </div>

      <footer className="py-8 px-12 border-t border-slate-300 bg-white text-slate-900 flex justify-between text-xs font-bold tracking-widest uppercase">
        <div>© 2025 ALL RIGHTS RESERVED</div>
        <div>BUILT BY NITHYA AND GEMINI</div>
      </footer>
    </div>
  );
}

export default App;