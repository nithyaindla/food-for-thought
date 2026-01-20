import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, ArrowDown, Instagram, Mail, Globe, RotateCcw, Clock, AlertCircle } from 'lucide-react';

// --- HELPER: SCROLL OBSERVER FOR FADE IN & ALIGNMENT ---
const FloatingText = ({ children, delay = 0, className = "" }) => {
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
      className={`transition-all duration-[1500ms] ease-out transform ${className} ${
        isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-24 blur-sm'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const EditorialContext = () => {
  return (
    <div className="bg-white text-black py-32 font-serif tracking-wide border-b-2 border-black">
      
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* HEADER / INTRO */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-32 border-b border-black pb-12">
           <div className="md:col-span-4">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-orange-600">● ORIGIN STORY</span>
           </div>
           <div className="md:col-span-8">
              <FadeIn>
                <p className="text-4xl md:text-6xl font-light leading-tight">
                  Tony Low's father arrived in America at five foot eleven, <span className="font-bold text-orange-600">125 pounds</span>. 
                </p>
                <p className="text-xl md:text-2xl mt-8 text-gray-600 font-sans leading-relaxed">
                  You could count his ribs. He'd fled communist China where he got two bowls of rice a day, crossed an ocean to a country where he didn't know the language.
                </p>
              </FadeIn>
           </div>
        </div>

        {/* SECTION 2: SURVIVAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32 items-center">
           <FadeIn>
              <div className="bg-black text-white p-12 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 font-mono text-xs opacity-50">FIG 1. LABOR</div>
                 <p className="text-2xl md:text-3xl font-bold leading-snug">
                   "Waiter, waitress, bartender, whatever paid rent."
                 </p>
                 <div className="mt-8 h-1 w-20 bg-orange-600"></div>
                 <p className="mt-8 text-gray-400 font-sans">
                   The oldest son in a Chinese immigrant family, Tony watched his parents take any work that would have them. They put food on the table for three kids who knew they were poor but were happy anyway.
                 </p>
              </div>
           </FadeIn>
           <FadeIn delay={200}>
              <p className="text-lg md:text-xl leading-relaxed text-gray-800">
                His dad brought home the recipe for <span className="font-bold border-b-2 border-orange-600">Shrimp with Lobster Sauce</span> from the restaurant where he worked. It became a staple, reserved for celebrations. Back then, there were only three Chinatowns in America. 
              </p>
           </FadeIn>
        </div>

        {/* SECTION 3: THE MARKET */}
        <div className="mb-32">
           <FadeIn>
             <h2 className="text-[10vw] leading-none font-black text-transparent stroke-text select-none opacity-10 absolute left-0 right-0 text-center pointer-events-none">
               CHICAGO
             </h2>
             <div className="relative z-10 max-w-4xl mx-auto text-center">
               <p className="text-3xl md:text-5xl font-bold text-gray-900 mb-8">
                 "Hey Jack!"
               </p>
               <p className="text-xl text-gray-600 font-sans">
                 At the fish markets, everyone knew Tony's dad. Getting Chinese ingredients meant driving a hundred miles to Chicago. Otherwise, they recreated what they could from memory and whatever Milwaukee, Wisconsin had to offer.
               </p>
             </div>
           </FadeIn>
        </div>

        {/* SECTION 4: MOTHER'S LOVE */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-32 border-t border-black pt-12">
           <div className="md:col-span-5">
              <FadeIn>
                <p className="font-mono text-xs uppercase tracking-widest mb-4">DATA: AFFECTION</p>
                <p className="text-3xl font-serif">
                  In the Low house, meals weren't conversational. <span className="text-orange-600 italic">That's how his mother showed love.</span>
                </p>
              </FadeIn>
           </div>
           <div className="md:col-span-7 font-sans text-lg text-gray-700 space-y-6">
              <FadeIn delay={100}>
                <p>She'd stand at the stove for hours with one knife and a cleaver. The best piece of fish always went to the kids, her bowl was always smallest, and "I already ate" was her most reliable lie.</p>
                <p>Tony loved watching her work. The way she'd slice through things with her cleaver, chopping, dicing, mashing. It was like watching a movie.</p>
              </FadeIn>
           </div>
        </div>

        {/* SECTION 5: AROMA & MEMORY */}
        <div className="bg-orange-50 p-8 md:p-16 mb-32">
           <FadeIn>
             <div className="max-w-5xl mx-auto">
               <p className="text-2xl md:text-4xl font-light mb-8">
                 For the Shrimp with Lobster Sauce, she'd make this compote with fermented black beans, ginger, and garlic that had such a distinct, fascinating aroma.
               </p>
               <p className="text-4xl md:text-6xl font-black text-orange-600">
                 When she'd crack an egg into the wok, Tony knew the dish was minutes away.
               </p>
             </div>
           </FadeIn>
        </div>

        {/* SECTION 6: LEGACY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start mb-20">
           <FadeIn>
              <p className="text-lg font-sans mb-4 text-gray-500 uppercase tracking-widest">The Kitchen Lab</p>
              <p className="text-xl leading-relaxed">
                Now, at 58, Tony works in high tech sales. Binary thinking, prescriptions, programs. Cooking is where he gets to be creative. Where his mother used her hands and one cleaver, Tony collects Japanese knives. But when he recreates her recipes, he's not improving them. <span className="font-bold">He's keeping the line of culture alive.</span>
              </p>
           </FadeIn>
           <FadeIn delay={200}>
              <div className="border-l-4 border-black pl-8">
                <p className="text-2xl font-serif italic mb-6">
                  "She never measured anything. She just sprinkled magic dust on her food."
                </p>
                <p className="text-lg font-sans text-gray-600">
                  His mother lives in Colorado now. She's older, sicker. Tony's biggest regret is not living near her. The son is feeding the mother who spent decades feeding him.
                </p>
              </div>
           </FadeIn>
        </div>

        {/* QUESTIONS */}
        <div className="bg-black text-white p-12 md:p-20 text-center">
           <FadeIn>
             <p className="font-mono text-orange-500 mb-8 uppercase tracking-widest">Tony's Love Language is Food</p>
             <div className="space-y-8 text-xl md:text-3xl font-serif leading-snug max-w-4xl mx-auto">
               <p>When was the last time you actually tasted your food instead of scrolling through it?</p>
               <p>Who taught you to cook the dish that feels like home?</p>
               <p className="text-orange-500">And when they're gone, will you remember how they made it?</p>
             </div>
           </FadeIn>
        </div>

      </div>
    </div>
  );
};

// --- THE GAME COMPONENT (Internal) ---
const ShrimpCookingGame = () => {
  // Assets
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

  // State
  const [gameState, setGameState] = useState('menu'); // menu, prep, sauce, cooking, plating, gameOver, lost
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds to win
  
  // Game Logic States
  const [shrimpPrepped, setShrimpPrepped] = useState(0);
  const targetShrimpCount = 6;
  const [sauceIngredientsAdded, setSauceIngredientsAdded] = useState([]);
  const requiredSauceIngredients = ['seasonings', 'salted_black_soy_beans', 'garlic', 'shaoxing_wine'];
  const [cookingStep, setCookingStep] = useState('empty');
  const [cookProgress, setCookProgress] = useState(0);

  // --- GAME TIMER ---
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

  // --- COOKING PROGRESS TIMER ---
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

  // Handlers
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
      setScore(prev => prev + (timeLeft * 10)); // Bonus points for time left
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
    <div className="w-full h-[700px] border-2 border-black bg-white relative select-none flex flex-col overflow-hidden brutal-shadow">
      
      {/* HUD */}
      <div className="h-14 border-b-2 border-black flex items-center justify-between px-4 bg-gray-50 z-20 font-sans">
        <div className="flex items-center gap-6">
           <div className="flex flex-col">
             <span className="text-[10px] font-bold uppercase text-gray-500">Station</span>
             <span className="font-bold text-sm">{gameState.toUpperCase()}</span>
           </div>
           
           {/* TIMER DISPLAY */}
           {gameState !== 'menu' && gameState !== 'final' && gameState !== 'lost' && (
             <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timeLeft < 15 ? 'text-red-600 animate-pulse' : 'text-black'}`}>
               <Clock size={20} />
               <span>00:{timeLeft.toString().padStart(2, '0')}</span>
             </div>
           )}
        </div>

        <div className="flex items-center gap-2">
           <span className="text-[10px] font-bold uppercase text-gray-500 text-right">Score</span>
           <span className="font-mono font-bold text-xl">{score.toString().padStart(4, '0')}</span>
        </div>
      </div>

      {feedback && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60] pointer-events-none w-full text-center">
          <span className="text-6xl font-black bg-yellow-400 text-black px-4 py-2 border-2 border-black shadow-lg animate-bounce inline-block tracking-tighter font-sans">
            {feedback}
          </span>
        </div>
      )}

      {/* MENU */}
      {gameState === 'menu' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 relative font-sans">
          <h1 className="text-5xl md:text-8xl font-black mb-2 tracking-tighter text-center">TONY'<br/>TUTORIAL</h1>
          <p className="text-xs font-bold mb-8 text-gray-500 tracking-[0.2em] uppercase">Beat the Clock: 60 Seconds</p>
          <button onClick={startGame} className="brutal-btn text-xl">
            START COOKING
          </button>
        </div>
      )}

      {/* STATIONS */}
      {gameState !== 'menu' && gameState !== 'final' && gameState !== 'lost' && (
        <div className="flex-1 relative bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] font-sans">
          
          {/* 1. PREP STATION */}
          {gameState === 'prep' && (
            <div className="h-full flex flex-col p-8 items-center">
              <div className="w-full flex justify-between items-end border-b-2 border-black pb-2 mb-8 bg-white/80 backdrop-blur-sm p-2">
                <h2 className="text-2xl font-bold tracking-tight">01 / DEVEIN</h2>
                <span className="text-xs font-bold tracking-wider">DRAG KNIFE TO SHRIMP</span>
              </div>
              
              <div className="grid grid-cols-3 gap-8">
                 {[...Array(targetShrimpCount)].map((_, i) => (
                   <div key={i} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handlePrepDrop(e, i)}
                     className={`w-32 h-32 flex items-center justify-center transition-all relative
                       ${i === shrimpPrepped ? 'scale-110 drop-shadow-2xl' : ''}
                     `}>
                     {i < shrimpPrepped ? (
                        <CheckCircle className="w-24 h-24 text-green-500" />
                     ) : (
                        <img src={assets.oneShrimp} className={`w-full h-full object-contain drop-shadow-lg ${i === shrimpPrepped ? 'animate-pulse' : ''}`} alt="Shrimp" />
                     )}
                   </div>
                 ))}
              </div>

              <div className="mt-auto relative">
                 <div draggable onDragStart={(e) => handleDragStart(e, 'knife')} className="cursor-grab active:cursor-grabbing hover:scale-110 transition-transform">
                   <img src={assets.knife} className="w-24 h-24 object-contain drop-shadow-xl" alt="Knife" />
                   <div className="bg-black text-white text-[10px] font-bold px-2 py-1 absolute -bottom-2 left-1/2 transform -translate-x-1/2 tracking-widest">TOOL</div>
                 </div>
              </div>
              
              {shrimpPrepped === targetShrimpCount && (
                <button onClick={() => setGameState('sauce')} className="absolute bottom-8 right-8 brutal-btn bg-yellow-400">NEXT &rarr;</button>
              )}
            </div>
          )}

          {/* 2. SAUCE STATION */}
          {gameState === 'sauce' && (
            <div className="h-full flex flex-col p-8 items-center">
              <div className="w-full flex justify-between items-end border-b-2 border-black pb-2 mb-8 bg-white/80 backdrop-blur-sm p-2">
                <h2 className="text-2xl font-bold tracking-tight">02 / COMPOUND</h2>
                <span className="text-xs font-bold tracking-wider">DRAG INGREDIENTS TO BOWL</span>
              </div>

              <div className="flex flex-col md:flex-row w-full justify-between items-center max-w-5xl gap-12">
                <div className="grid grid-cols-2 gap-8">
                  {requiredSauceIngredients.map((item) => (
                    <div key={item} draggable={!sauceIngredientsAdded.includes(item)} onDragStart={(e) => handleDragStart(e, item)}
                      className={`w-32 h-32 flex flex-col items-center justify-center cursor-grab transition-transform 
                        ${sauceIngredientsAdded.includes(item) ? 'opacity-20 grayscale pointer-events-none' : 'hover:scale-110'}`}>
                      <img src={assets[item]} className="w-24 h-24 object-contain drop-shadow-md" alt={item} />
                      <span className="font-bold text-[10px] uppercase bg-white px-2 mt-1 border border-black tracking-widest">{item}</span>
                    </div>
                  ))}
                </div>
                
                <div onDragOver={(e) => e.preventDefault()} onDrop={handleSauceDrop} className="w-80 h-80 border-4 border-black rounded-full flex items-center justify-center relative bg-white shadow-xl overflow-hidden group">
                  <div className="absolute inset-4 border-2 border-dashed border-gray-300 rounded-full"></div>
                  <span className="text-xs font-black z-10 bg-black text-white px-2 py-1 tracking-widest">MIXING BOWL</span>
                  <div className="absolute bottom-0 w-full bg-amber-600 transition-all duration-500 opacity-80" style={{height: `${sauceIngredientsAdded.length * 25}%`}}></div>
                  {sauceIngredientsAdded.map((item, idx) => (
                     <img key={idx} src={assets[item]} className="absolute w-12 h-12 animate-bounce" style={{left: `${20 + idx*15}%`, bottom: `${10 + idx*10}%`}} />
                  ))}
                </div>
              </div>

              {sauceIngredientsAdded.length === 4 && (
                <button onClick={() => setGameState('cooking')} className="absolute bottom-8 right-8 brutal-btn bg-yellow-400">HEAT &rarr;</button>
              )}
            </div>
          )}

          {/* 3. COOKING STATION */}
          {gameState === 'cooking' && (
            <div className="h-full flex flex-col p-8 items-center relative">
               <div className="w-full flex justify-between items-end border-b-2 border-black pb-2 mb-4 bg-white/80 backdrop-blur-sm p-2">
                <h2 className="text-2xl font-bold tracking-tight">03 / THERMAL</h2>
                <span className="text-xs text-red-600 font-black tracking-widest">{cookingStep.toUpperCase().replace('_', ' ')}</span>
              </div>

              <div className="relative flex-1 w-full flex items-center justify-center">
                 <div onDragOver={(e) => e.preventDefault()} onDrop={handleWokDrop} className="w-[500px] h-[400px] flex items-center justify-center relative transition-transform">
                    <div className="absolute bottom-0 w-64 h-12 bg-black opacity-20 blur-xl rounded-full"></div>
                    <img src={assets.wok} className="w-full h-full object-contain drop-shadow-2xl z-10" alt="Wok" />
                    
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 flex items-center justify-center z-20">
                        {cookingStep !== 'empty' && (
                            <img src={assets.shrimp} className={`w-40 object-contain transition-all duration-500 ${cookingStep === 'shrimp_cooking' ? 'animate-shake saturate-150' : ''}`} alt="Cooking" />
                        )}
                        {cookingStep === 'egg_added' && (
                             <img src={assets.egg} className="absolute top-0 right-0 w-24 animate-bounce" alt="Egg" />
                        )}
                    </div>

                    {cookingStep !== 'empty' && (
                        <div className="absolute -top-10 left-1/2 w-20 h-40 bg-gray-200 blur-2xl opacity-40 animate-pulse transform -translate-x-1/2"></div>
                    )}
                 </div>
              </div>

              <div className="h-32 w-full border-t-2 border-black flex items-center justify-center gap-12 bg-gray-100 z-30">
                {cookingStep === 'empty' && (
                  <div draggable onDragStart={(e) => handleDragStart(e, 'prepped_shrimp')} className="cursor-move hover:scale-110 transition text-center group">
                     <div className="w-24 h-24 bg-white border-2 border-black rounded-full flex items-center justify-center mb-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-active:shadow-none group-active:translate-y-1">
                        <img src={assets.shrimp} className="w-16" alt="Prepped" />
                     </div>
                     <span className="font-bold text-[10px] bg-black text-white px-2 tracking-wider">PREPPED SHRIMP</span>
                  </div>
                )}
                {cookingStep === 'shrimp_cooked' && (
                   <div draggable onDragStart={(e) => handleDragStart(e, 'mixed_sauce')} className="cursor-move hover:scale-110 transition text-center group">
                      <div className="w-24 h-24 bg-amber-100 border-2 border-black rounded-full flex items-center justify-center mb-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-active:shadow-none group-active:translate-y-1">
                        <span className="text-4xl">🥣</span>
                      </div>
                      <span className="font-bold text-[10px] bg-black text-white px-2 tracking-wider">SAUCE MIX</span>
                   </div>
                )}
                 {cookingStep === 'sauce_added' && (
                   <div draggable onDragStart={(e) => handleDragStart(e, 'egg')} className="cursor-move hover:scale-110 transition text-center group">
                      <div className="w-24 h-24 bg-white border-2 border-black rounded-full flex items-center justify-center mb-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-active:shadow-none group-active:translate-y-1">
                        <img src={assets.egg} className="w-16" alt="Egg" />
                      </div>
                      <span className="font-bold text-[10px] bg-black text-white px-2 tracking-wider">FARM EGG</span>
                   </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* WIN SCREEN */}
      {gameState === 'final' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-white p-8 font-sans">
          <div className="border-4 border-black p-8 max-w-2xl text-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-gray-50">
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase">Order Complete</h1>
            <p className="text-xl font-bold text-green-600 mb-4">TIME BONUS: {timeLeft}s</p>
            
            <div className="my-8 relative group">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <img src={assets.finalShrimp} alt="Final Dish" className="w-96 h-auto mx-auto drop-shadow-2xl transform transition hover:scale-105 duration-500" />
            </div>

            <p className="text-sm font-bold mb-6 border-b-2 border-black pb-4 inline-block tracking-wider">FINAL SCORE: {score}</p>
            <p className="italic text-gray-500 mb-8 text-lg font-medium">"A perfect harmony of wok hei and texture."</p>
            
            <button onClick={startGame} className="bg-black text-white px-8 py-4 font-bold hover:bg-yellow-400 hover:text-black transition-colors w-full flex items-center justify-center gap-2 tracking-wide uppercase">
              <RotateCcw size={20}/> Restart Shift
            </button>
          </div>
        </div>
      )}

      {/* LOSE SCREEN */}
      {gameState === 'lost' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-red-50 p-8 font-sans">
          <div className="border-4 border-red-600 p-8 max-w-2xl text-center shadow-[12px_12px_0px_0px_rgba(200,0,0,1)] bg-white">
            <AlertCircle size={64} className="text-red-600 mx-auto mb-4" />
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase text-red-600">TOO SLOW!</h1>
            <p className="text-xl font-bold mb-8">The customer walked out.</p>
            
            <button onClick={startGame} className="bg-red-600 text-white px-8 py-4 font-bold hover:bg-black transition-colors w-full flex items-center justify-center gap-2 tracking-wide uppercase">
              <RotateCcw size={20}/> Try Again
            </button>
          </div>
        </div>
      )}

    </div>
  );
};


// --- MAIN LAYOUT COMPONENT ---
const Section = ({ title, children, className = "" }) => (
  <section className={`border-b-2 border-black py-20 px-6 md:px-12 ${className}`}>
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-3">
        <h2 className="text-xs font-bold uppercase tracking-widest sticky top-8">{title}</h2>
      </div>
      <div className="md:col-span-9">
        {children}
      </div>
    </div>
  </section>
);

function App() {
  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      
      {/* 1. ENTRY / TITLE PAGE */}
      <header 
        className="h-screen flex flex-col justify-between p-6 md:p-12 border-b-2 border-black relative bg-cover bg-center"
        style={{ backgroundImage: "url('/intro-tony.gif')" }}
      >
        <div className="absolute inset-0 bg-white/30 pointer-events-none"></div>

        <div className="flex justify-between items-start font-bold text-xs tracking-widest uppercase relative z-10">
          <span>FOOD FOR THOUGHT</span>
          <span className="text-right">BY NITHYA SUNKARA INDLAMURI<br/>2025</span>
        </div>
        
        <div className="text-center md:text-left relative z-10">
          <h1 className="text-[12vw] leading-[0.8] top-10 font-black tracking-tighter uppercase mix-blend-difference text-black mt-[15px]">
            TONY'S KITCHEN LAB
          </h1>
        </div>

        <div className="flex justify-between items-end relative z-10">
          <div className="hidden md:block font-bold text-xs max-w-xs tracking-wide leading-relaxed">
            From kitchen to camera to code, this is a digital exploration of humanity's most primitive and prominent loves: food and mothers.
          </div>
          <ArrowDown className="animate-bounce w-8 h-8" />
        </div>
      </header>

      {/* 2. THE FILM (UPDATED: FULL WIDTH) */}
      <section className="border-b-2 border-black py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-4">
             <h2 className="text-xs font-bold uppercase tracking-widest">(01) THE FILM</h2>
             <div className="text-xs font-bold tracking-widest uppercase text-right">
                <span>FEATURING TONY LOW</span><br/>
                <span>BY NITHYA SUNKARA INDLAMURI</span>
             </div>
          </div>
          {/* Video Container - Expanded */}
          <div className="w-full aspect-video bg-black border-2 border-black relative shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
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
      </section>

      {/* 3. FLOATING CONTEXT (UPDATED: TONY'S STORY, COLOR DESIGN) */}
      <FloatingContext />

      {/* 4. THE GAME */}
      <Section title="(02) INTERACTIVE">
        <div className="mb-8">
          <h3 className="text-4xl font-bold mb-2 tracking-tight">KITCHEN LAB SIMULATOR</h3>
          <p className="text-sm text-gray-600 font-medium">Drag ingredients to interact. Beat the timer.</p>
        </div>
        
        {/* The Game Component */}
        <ShrimpCookingGame />
        
        {/* DISCLAIMER */}
        <p className="mt-6 text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">
          Disclaimer: The graphics in this game were created by Google Gemini and are AI generated.
        </p>
      </Section>

      {/* 5. ARCHIVE SECTION */}
      <Section title="(03) ARCHIVE">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-2 border-black bg-black gap-0.5">
          
          <div className="relative aspect-[3/4] bg-white group overflow-hidden">
              <video 
                  src="/mom6.mp4" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-700"
                  autoPlay loop muted playsInline
              />
              <div className="absolute bottom-2 left-2 bg-black text-white text-[10px] px-2 py-1 font-mono uppercase tracking-widest">
                  FIG A. PREP WORK
              </div>
          </div>

          <div className="relative aspect-[3/4] bg-white group overflow-hidden">
              <img 
                  src="/mom1.png" 
                  alt="Cleaning Fish"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-700"
              />
              <div className="absolute bottom-2 left-2 bg-black text-white text-[10px] px-2 py-1 font-mono uppercase tracking-widest">
                  FIG B. RAW MATERIALS
              </div>
          </div>

          <div className="relative aspect-[3/4] bg-white group overflow-hidden">
              <img 
                  src="/mom5.png" 
                  alt="Blending Soup"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-700"
              />
              <div className="absolute bottom-2 left-2 bg-black text-white text-[10px] px-2 py-1 font-mono uppercase tracking-widest">
                  FIG C. REDUCTION
              </div>
          </div>

          <div className="relative aspect-[3/4] bg-white group overflow-hidden">
              <img 
                  src="/mom3.png" 
                  alt="Wrapping Dumplings"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-700"
              />
              <div className="absolute bottom-2 left-2 bg-black text-white text-[10px] px-2 py-1 font-mono uppercase tracking-widest">
                  FIG D. ASSEMBLY
              </div>
          </div>

          <div className="relative aspect-[3/4] bg-white group overflow-hidden">
              <img 
                  src="/mom2.png" 
                  alt="Wrapping Together"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-700"
              />
              <div className="absolute bottom-2 left-2 bg-black text-white text-[10px] px-2 py-1 font-mono uppercase tracking-widest">
                  FIG E. TRANSMISSION
              </div>
          </div>

          <div className="relative aspect-[3/4] bg-white group overflow-hidden">
              <img 
                  src="/mom4.png" 
                  alt="Eating"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-700"
              />
              <div className="absolute bottom-2 left-2 bg-black text-white text-[10px] px-2 py-1 font-mono uppercase tracking-widest">
                  FIG F. NOURISHMENT
              </div>
          </div>

        </div>
      </Section>

      <footer className="py-8 px-12 border-t border-white bg-black text-white flex justify-between text-xs font-bold tracking-widest uppercase">
        <div>© 2025 ALL RIGHTS RESERVED</div>
        <div>BUILT BY NITHYA AND GEMINI</div>
      </footer>
    </div>
  );
}

export default App;