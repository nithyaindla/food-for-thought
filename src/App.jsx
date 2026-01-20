import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, ArrowDown, Instagram, Mail, Globe, RotateCcw, Clock, AlertTriangle, Play, ChevronRight, MousePointer } from 'lucide-react';

// --- GLOBAL TEXTURE OVERLAY (FILM GRAIN) ---
const FilmGrain = () => (
  <div className="fixed inset-0 pointer-events-none z-[100] opacity-20 mix-blend-overlay" 
       style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
  </div>
);

// --- SCROLL REVEAL COMPONENT ---
const Reveal = ({ children, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'} ${className}`}>
      {children}
    </div>
  );
};

// --- STICKY PARALLAX SECTION ---
const ParallaxSection = ({ img, vid, children, align = "left", overlayColor = "bg-black/40" }) => {
  return (
    <div className="relative h-[150vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {vid ? (
          <video src={vid} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <img src={img} className="absolute inset-0 w-full h-full object-cover" alt="Background" />
        )}
        <div className={`absolute inset-0 ${overlayColor}`} />
      </div>
      
      <div className="relative z-10 -mt-[100vh] h-screen flex flex-col justify-center px-6 md:px-20">
        <div className={`max-w-2xl p-8 md:p-12 backdrop-blur-md bg-black/30 border-l-4 border-orange-500 text-white shadow-2xl ${align === 'right' ? 'ml-auto' : 'mr-auto'}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

// --- GAME COMPONENT ---
const ShrimpCookingGame = () => {
  // Assets (Simplified for brevity, assuming standard path)
  const assets = {
    tony: "/tony.png", wok: "/wok.png", stove: "/stove.png", shrimp: "/shrimp.png",
    oneShrimp: "/one-shrimp.png", finalShrimp: "/final-shrimp.png",
    seasonings: "/seasonings.png", beans: "/beans.png", garlic: "/garlic.png",
    wine: "/wine.png", egg: "/egg.png", knife: "/knife.png", scallions: "/scallions.png"
  };

  // Game Logic (Condensed)
  const [gameState, setGameState] = useState('menu'); 
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); 
  const [feedback, setFeedback] = useState('');
  const [cookingStep, setCookingStep] = useState('empty');
  
  // Prep & Sauce Logic
  const [shrimpPrepped, setShrimpPrepped] = useState(0);
  const [sauceAdded, setSauceAdded] = useState(0); // Count of ingredients
  const targetShrimp = 6;
  const targetSauce = 4;

  useEffect(() => {
    let interval;
    if (gameState !== 'menu' && gameState !== 'gameOver' && gameState !== 'final') {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) { setGameState('lost'); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  const triggerFeedback = (text) => {
    setFeedback(text);
    setTimeout(() => setFeedback(''), 1000);
  };

  const handleDragStart = (e, id) => e.dataTransfer.setData("id", id);

  const handleDrop = (e, station) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("id");
    
    if (station === 'prep' && id === 'knife') {
      if (shrimpPrepped < targetShrimp) {
        setShrimpPrepped(p => p + 1);
        triggerFeedback("DEVEINED!");
      }
    } else if (station === 'sauce' && ['seasonings','beans','garlic','wine'].includes(id)) {
       setSauceAdded(p => p + 1);
       triggerFeedback("ADDED!");
    } else if (station === 'wok') {
       if (id === 'shrimp_bowl' && cookingStep === 'empty') {
         setCookingStep('shrimp'); triggerFeedback("SIZZLE!");
       } else if (id === 'sauce_bowl' && cookingStep === 'shrimp') {
         setCookingStep('sauce'); triggerFeedback("AROMA!");
       } else if (id === 'egg' && cookingStep === 'sauce') {
         setCookingStep('done'); setScore(s => s + (timeLeft * 100)); triggerFeedback("PERFECTO!");
         setTimeout(() => setGameState('final'), 1500);
       }
    }
  };

  const startGame = () => {
    setGameState('prep'); setScore(0); setTimeLeft(60);
    setShrimpPrepped(0); setSauceAdded(0); setCookingStep('empty');
  };

  return (
    <div className="w-full h-[600px] bg-stone-900 border-4 border-orange-500 rounded-xl relative overflow-hidden font-mono text-white shadow-[0_0_50px_rgba(249,115,22,0.3)]">
      
      {/* HUD */}
      <div className="absolute top-0 w-full p-4 flex justify-between bg-black/50 backdrop-blur z-20 border-b border-white/10">
        <div className="flex gap-4">
          <span className="text-orange-500 font-bold">STATION: {gameState.toUpperCase()}</span>
          <span className={`font-bold ${timeLeft < 15 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
            <Clock className="inline w-4 h-4 mr-1"/> {timeLeft}s
          </span>
        </div>
        <div>SCORE: {score}</div>
      </div>

      {feedback && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-orange-600 drop-shadow-lg animate-bounce">
          {feedback}
        </div>
      )}

      {gameState === 'menu' && (
        <div className="h-full flex flex-col items-center justify-center bg-[url('/stove.png')] bg-cover bg-center">
          <div className="bg-black/80 p-8 rounded-2xl border-2 border-orange-500 text-center backdrop-blur-sm">
            <h1 className="text-5xl font-black mb-4 tracking-tighter">KITCHEN LAB</h1>
            <p className="mb-8 text-gray-400">CAN YOU HANDLE THE HEAT?</p>
            <button onClick={startGame} className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-3 rounded-full font-bold text-xl transition-all hover:scale-110">
              START SHIFT
            </button>
          </div>
        </div>
      )}

      {/* GAME STAGES */}
      {gameState === 'prep' && (
        <div className="h-full flex flex-col items-center justify-center bg-stone-800">
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[...Array(targetShrimp)].map((_, i) => (
              <div key={i} onDragOver={e=>e.preventDefault()} onDrop={e=>handleDrop(e,'prep')} 
                className={`w-24 h-24 border-2 rounded-full flex items-center justify-center transition-all ${i < shrimpPrepped ? 'border-green-500 bg-green-900/20' : 'border-white/20'}`}>
                {i < shrimpPrepped ? <CheckCircle className="text-green-500"/> : <img src={assets.oneShrimp} className="w-16 opacity-50"/>}
              </div>
            ))}
          </div>
          <div draggable onDragStart={e=>handleDragStart(e,'knife')} className="cursor-grab hover:scale-110 transition">
            <img src={assets.knife} className="w-32 drop-shadow-xl" />
            <p className="text-center text-sm mt-2 text-gray-400">DRAG KNIFE TO SHRIMP</p>
          </div>
          {shrimpPrepped === targetShrimp && (
            <button onClick={()=>setGameState('sauce')} className="mt-8 bg-green-600 px-6 py-2 rounded-lg font-bold animate-pulse">NEXT STATION &rarr;</button>
          )}
        </div>
      )}

      {gameState === 'sauce' && (
        <div className="h-full flex flex-col items-center justify-center bg-stone-800">
          <div className="flex gap-4 mb-12">
            {['seasonings','beans','garlic','wine'].map(item => (
              <div key={item} draggable onDragStart={e=>handleDragStart(e,item)} className="bg-white/10 p-2 rounded hover:bg-white/20 cursor-grab">
                <img src={`/${item === 'seasonings' ? 'seasonings' : item === 'beans' ? 'beans' : item === 'garlic' ? 'garlic' : 'wine'}.png`} className="w-16 h-16 object-contain"/>
              </div>
            ))}
          </div>
          <div onDragOver={e=>e.preventDefault()} onDrop={e=>handleDrop(e,'sauce')} className="w-64 h-64 border-4 border-dashed border-white/30 rounded-full flex items-center justify-center relative">
            <div className="absolute bottom-0 w-full bg-orange-600/80 rounded-b-full transition-all duration-300" style={{height: `${sauceAdded * 25}%`}}></div>
            <span className="z-10 font-bold">MIXING BOWL ({sauceAdded}/4)</span>
          </div>
          {sauceAdded === 4 && (
            <button onClick={()=>setGameState('cooking')} className="mt-8 bg-green-600 px-6 py-2 rounded-lg font-bold animate-pulse">TO THE WOK &rarr;</button>
          )}
        </div>
      )}

      {gameState === 'cooking' && (
        <div className="h-full flex flex-col items-center justify-center bg-black relative" onDragOver={e=>e.preventDefault()} onDrop={e=>handleDrop(e,'wok')}>
          <div className="absolute inset-0 bg-[url('/stove.png')] bg-cover opacity-50"></div>
          
          {/* Draggables */}
          <div className="absolute bottom-4 left-4 flex gap-4 z-20">
            {cookingStep === 'empty' && <div draggable onDragStart={e=>handleDragStart(e,'shrimp_bowl')} className="bg-blue-900/80 p-2 rounded cursor-grab">SHRIMP</div>}
            {cookingStep === 'shrimp' && <div draggable onDragStart={e=>handleDragStart(e,'sauce_bowl')} className="bg-orange-900/80 p-2 rounded cursor-grab">SAUCE</div>}
            {cookingStep === 'sauce' && <div draggable onDragStart={e=>handleDragStart(e,'egg')} className="bg-white/80 text-black p-2 rounded cursor-grab">EGG</div>}
          </div>

          <div className="relative w-96 h-96 z-10 flex items-center justify-center">
             <img src={assets.wok} className="w-full h-full object-contain" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {cookingStep !== 'empty' && <img src={assets.shrimp} className="w-32 animate-pulse" />}
                {cookingStep === 'done' && <div className="absolute inset-0 bg-yellow-500 mix-blend-overlay blur-xl"></div>}
             </div>
          </div>
        </div>
      )}

      {gameState === 'final' && (
        <div className="h-full flex flex-col items-center justify-center bg-orange-50 text-black">
          <h2 className="text-6xl font-black mb-4">ORDER UP!</h2>
          <img src={assets.finalShrimp} className="w-64 drop-shadow-2xl mb-8 hover:scale-110 transition" />
          <p className="text-2xl font-bold mb-8">SCORE: {score}</p>
          <button onClick={startGame} className="bg-black text-white px-8 py-3 rounded-full font-bold">RESTART</button>
        </div>
      )}
      
      {gameState === 'lost' && (
        <div className="h-full flex flex-col items-center justify-center bg-red-900 text-white">
          <AlertTriangle size={64} className="mb-4 text-red-500" />
          <h2 className="text-6xl font-black">TOO SLOW!</h2>
          <button onClick={startGame} className="mt-8 bg-white text-red-900 px-8 py-3 rounded-full font-bold">TRY AGAIN</button>
        </div>
      )}
    </div>
  );
};

// --- MAIN APP ---
function App() {
  const scrollToGame = () => {
    document.getElementById('game-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans selection:bg-orange-500 selection:text-white overflow-x-hidden">
      <FilmGrain />
      
      {/* 1. HERO SECTION */}
      <header className="h-screen relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/intro-tony.gif')] bg-cover bg-center opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent" />
        
        <div className="relative z-10 text-center mix-blend-hard-light">
          <h1 className="text-[15vw] font-black leading-none text-white tracking-tighter animate-pulse-slow">
            KITCHEN LAB
          </h1>
          <p className="text-white/80 font-mono tracking-[1em] text-sm md:text-xl mt-4">
            FOOD · FAMILY · MEMORY
          </p>
        </div>
        <ArrowDown className="absolute bottom-12 text-white animate-bounce w-8 h-8 z-20" />
      </header>

      {/* 2. MEET TONY */}
      <section className="py-32 px-6 md:px-12 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-50 skew-x-12 -z-10 translate-x-32" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <Reveal>
            <div className="relative">
              <div className="absolute -inset-4 bg-orange-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <img src="/tony.png" alt="Tony Low" className="relative w-full max-w-md mx-auto drop-shadow-2xl hover:rotate-3 transition duration-500" />
            </div>
          </Reveal>
          <Reveal className="space-y-8">
            <h2 className="text-7xl font-black text-slate-900 leading-[0.9]">MEET<br/><span className="text-orange-600">TONY</span></h2>
            <div className="text-lg font-serif leading-relaxed text-slate-600 space-y-6">
              <p>Tony works in high tech sales, but cooking is where he gets to be creative. He calls his happy place the <span className="font-bold text-slate-900">Kitchen Lab</span>.</p>
              <p>Where his mother used her hands and one cleaver, Tony collects Japanese knives. Where she made do with whatever Milwaukee had, he imports ingredients.</p>
              <blockquote className="border-l-4 border-orange-500 pl-6 italic text-slate-900 text-2xl">
                "When he recreates her recipes, he's reliving a part of his childhood and teaching the culture to his kids."
              </blockquote>
            </div>
            <button onClick={scrollToGame} className="mt-8 flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full font-bold tracking-widest hover:bg-orange-600 transition-all shadow-xl">
              ENTER THE LAB <Play size={16} fill="currentColor"/>
            </button>
          </Reveal>
        </div>
      </section>

      {/* 3. PARALLAX STORY 1: ORIGINS */}
      <ParallaxSection img="/mom1.jpg">
        <h3 className="text-orange-400 font-mono text-sm tracking-widest mb-4">01. ORIGINS</h3>
        <p className="text-4xl md:text-5xl font-serif leading-tight">
          Tony Low's father arrived in America at five foot eleven, <span className="text-orange-500 font-bold">125 pounds</span>.
        </p>
        <p className="mt-6 text-xl text-stone-300 font-light">
          He'd fled communist China where he got two bowls of rice a day. The oldest son in a Chinese immigrant family, Tony watched his parents take any work that would have them.
        </p>
      </ParallaxSection>

      <section className="py-24 bg-stone-100 px-6">
        <div className="max-w-4xl mx-auto text-center font-serif text-2xl md:text-4xl text-slate-800 leading-relaxed">
          "Waiter, waitress, bartender, whatever paid rent. They knew they were poor but were <span className="italic text-orange-600">happy anyway</span>."
        </div>
      </section>

      {/* 4. FILM SECTION */}
      <section className="bg-black py-24 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex justify-between items-end mb-6 text-white/50 font-mono text-xs uppercase tracking-widest border-b border-white/20 pb-4">
            <span>The Documentary</span>
            <span>Dir. Nithya Sunkara Indlamuri</span>
          </div>
          <div className="w-full aspect-[21/9] bg-stone-900 relative shadow-[0_0_100px_rgba(255,255,255,0.1)] group overflow-hidden border border-white/10">
             <iframe 
                src="https://player.vimeo.com/video/1132358106?badge=0&autopause=0&player_id=0&app_id=58479" 
                className="w-full h-full opacity-80 group-hover:opacity-100 transition duration-700" 
                frameBorder="0" 
                allow="autoplay; fullscreen; picture-in-picture" 
                allowFullScreen
                title="To the Mothers"
              ></iframe>
          </div>
        </div>
      </section>

      {/* 5. PARALLAX STORY 2: MOTHER'S LOVE */}
      <ParallaxSection img="/mom3.jpg" align="right">
        <h3 className="text-orange-400 font-mono text-sm tracking-widest mb-4">02. AFFECTION</h3>
        <p className="text-3xl md:text-5xl font-serif leading-tight">
          In the Low house, meals weren't conversational. You sat down, ate what was in front of you, cleaned your plate.
        </p>
        <p className="mt-6 text-2xl font-bold italic border-l-4 border-white pl-6">
          That's how his mother showed love.
        </p>
      </ParallaxSection>

      <section className="py-32 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="text-lg text-slate-600 space-y-6">
            <p className="first-letter:text-5xl first-letter:font-black first-letter:mr-2 first-letter:float-left">
              Tony loved watching her work. The way she'd slice through things with her cleaver, chopping, dicing, mashing. It was like watching a movie.
            </p>
            <p>
              For the Shrimp with Lobster Sauce, she'd make this compote with fermented black beans, ginger, and garlic. When she'd crack an egg into the wok, Tony knew the dish was minutes away.
            </p>
          </div>
          <div className="relative aspect-square bg-slate-100 p-8 rotate-2 shadow-2xl border-8 border-white">
             <video src="/mom6.mp4" className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-700" autoPlay loop muted playsInline />
             <div className="absolute -bottom-10 left-0 font-mono text-xs text-slate-400">FIG A. THE TECHNIQUE</div>
          </div>
        </div>
      </section>

      {/* 6. HORIZONTAL ARCHIVE REEL */}
      <section className="py-24 bg-stone-900 overflow-hidden">
        <div className="mb-12 px-12 text-white font-mono uppercase tracking-widest text-xs">03. The Archive</div>
        <div className="flex gap-8 px-12 overflow-x-auto pb-12 snap-x">
          {['/mom1.png', '/mom5.png', '/mom2.png', '/mom4.png'].map((src, i) => (
            <div key={i} className="flex-none w-[300px] md:w-[400px] aspect-[3/4] relative group snap-center">
              <img src={src} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-700 border-4 border-white/10" />
              <div className="absolute bottom-4 left-4 bg-black/80 text-white text-xs px-2 py-1 font-mono">
                ARCHIVE_{i+1}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. PARALLAX STORY 3: MAGIC DUST */}
      <ParallaxSection img="/mom5.jpg">
        <h3 className="text-purple-400 font-mono text-sm tracking-widest mb-4">04. ALCHEMY</h3>
        <p className="text-4xl font-serif">
          She never measured anything. She just sprinkled <span className="text-purple-400 font-bold">magic dust</span> on her food and it tasted better than anything Tony can make.
        </p>
      </ParallaxSection>

      {/* 8. GAME SECTION */}
      <section id="game-section" className="py-32 bg-orange-50 relative">
        <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-stone-900 to-transparent opacity-20"></div>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-black text-slate-900 mb-2 tracking-tighter">THE KITCHEN LAB</h2>
            <p className="font-mono text-orange-600 tracking-widest">INTERACTIVE SIMULATION</p>
          </div>
          <ShrimpCookingGame />
          <p className="mt-6 text-[10px] text-orange-900/50 text-center uppercase tracking-widest font-bold">Graphics by Gemini</p>
        </div>
      </section>

      {/* 9. CONCLUSION */}
      <section className="py-32 px-6 md:px-20 bg-slate-900 text-white text-center">
        <Reveal>
          <div className="max-w-4xl mx-auto space-y-12">
            <p className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-200">
              Tony's love language is food.
            </p>
            <p className="text-xl md:text-2xl font-serif text-slate-300">
              You feed him, you're expressing your love. He cooks for you, he's giving it back.
            </p>
            <div className="border-t border-white/10 pt-12 mt-12 space-y-8 text-lg font-light text-slate-400">
              <p>When was the last time you actually tasted your food instead of scrolling through it?</p>
              <p>Who taught you to cook the dish that feels like home?</p>
              <p className="text-white font-bold text-xl">And when they're gone, will you remember how they made it?</p>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="py-8 px-12 border-t border-white/10 bg-black text-white/50 flex justify-between text-xs font-mono uppercase tracking-widest">
        <div>© 2025 Tony's Kitchen Lab</div>
        <div>Built by Nithya & Gemini</div>
      </footer>
    </div>
  );
}

export default App;