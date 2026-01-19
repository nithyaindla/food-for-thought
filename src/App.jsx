import React, { useState, useEffect } from 'react';
import { CheckCircle, ArrowDown, Instagram, Mail, Globe } from 'lucide-react'; // Removed 'Knife' from here

// --- THE GAME COMPONENT (Internal) ---
const ShrimpCookingGame = () => {
  // Assets
  const assets = {
    tony: "/tony.png",
    wok: "/wok.png",
    stove: "/stove.png",
    shrimp: "/shrimp.png",
    seasonings: "/seasonings.png",
    beans: "/beans.png",
    garlic: "/garlic.png",
    wine: "/wine.png",
    egg: "/egg.png",
    scallions: "/scallions.png",
    knife: "/knife.png", // Ensure this file exists in your public folder
  };

  // State
  const [gameState, setGameState] = useState('menu'); 
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);
  const [shrimpPrepped, setShrimpPrepped] = useState(0);
  const targetShrimpCount = 6;
  const [sauceIngredientsAdded, setSauceIngredientsAdded] = useState([]);
  const requiredSauceIngredients = ['seasonings', 'beans', 'garlic', 'wine'];
  const [cookingStep, setCookingStep] = useState('empty');
  const [cookProgress, setCookProgress] = useState(0);
  const [scallionsSprinkled, setScallionsSprinkled] = useState(0);

  // Timer
  useEffect(() => {
    let timer;
    if (gameState === 'cooking' && cookingStep === 'shrimp_cooking') {
      timer = setInterval(() => {
        setCookProgress(prev => {
          if (prev >= 100) {
            setCookingStep('shrimp_cooked');
            triggerFeedback("READY");
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
      triggerFeedback("CLEANED");
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
      setScore(prev => prev + 500);
      triggerFeedback("EMULSION");
      setTimeout(() => setGameState('plating'), 2000);
    }
  };

  const handlePlatingDrop = (e) => {
    e.preventDefault();
    if (draggedItem === 'scallions') {
      const newCount = scallionsSprinkled + 1;
      setScallionsSprinkled(newCount);
      triggerFeedback("GARNISH");
      if (newCount >= 3) {
        setTimeout(() => setGameState('gameOver'), 1000);
      }
    }
  };

  const startGame = () => {
    setGameState('prep');
    setScore(0);
    setShrimpPrepped(0);
    setSauceIngredientsAdded([]);
    setCookingStep('empty');
    setCookProgress(0);
    setScallionsSprinkled(0);
  };

  return (
    <div className="w-full h-[700px] border-2 border-black bg-white relative font-mono select-none flex flex-col overflow-hidden brutal-shadow">
      
      {/* HUD */}
      <div className="h-12 border-b-2 border-black flex items-center justify-between px-4 bg-gray-50">
        <div className="flex items-center gap-4 text-sm font-bold">
           <span>STATUS: {gameState.toUpperCase()}</span>
           <span>SCORE: {score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500 border border-black"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 border border-black"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 border border-black"></div>
        </div>
      </div>

      {feedback && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60] pointer-events-none">
          <span className="text-6xl font-black bg-black text-white px-4 py-2">{feedback}</span>
        </div>
      )}

      {/* MENU */}
      {gameState === 'menu' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 relative">
          <h1 className="text-5xl md:text-7xl font-black mb-2 tracking-tighter">SHRIMP.EXE</h1>
          <p className="font-mono text-sm mb-8 text-gray-500">INTERACTIVE COOKING MODULE v1.0</p>
          <button onClick={startGame} className="brutal-btn text-xl">
            INITIALIZE SEQUENCE
          </button>
        </div>
      )}

      {/* STATIONS */}
      {gameState !== 'menu' && gameState !== 'gameOver' && (
        <div className="flex-1 relative bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]">
          
          {/* PREP */}
          {gameState === 'prep' && (
            <div className="h-full flex flex-col p-8 items-center">
              <div className="w-full flex justify-between items-end border-b-2 border-black pb-2 mb-8">
                <h2 className="text-2xl font-bold">01 / DEVEIN</h2>
                <span className="text-xs">TOOL: KNIFE</span>
              </div>
              
              <div className="grid grid-cols-3 gap-8">
                 {[...Array(targetShrimpCount)].map((_, i) => (
                   <div key={i} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handlePrepDrop(e, i)}
                     className={`w-24 h-24 border-2 border-black rounded-full flex items-center justify-center transition-all bg-white
                       ${i < shrimpPrepped ? 'bg-black text-white' : 'hover:bg-gray-100'}
                     `}>
                     {i < shrimpPrepped ? <CheckCircle /> : <img src={assets.shrimp} className="w-16 grayscale" alt="Shrimp" />}
                   </div>
                 ))}
              </div>

              <div className="mt-auto">
                 {/* FIXED: Replaced <Knife /> component with <img> tag */}
                 <div draggable onDragStart={(e) => handleDragStart(e, 'knife')} className="border-2 border-black bg-white p-4 cursor-grab active:cursor-grabbing hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow">
                   <img src={assets.knife} className="w-8 h-8 object-contain" alt="Knife Tool" />
                 </div>
              </div>
              
              {shrimpPrepped === targetShrimpCount && (
                <button onClick={() => setGameState('sauce')} className="absolute bottom-8 right-8 brutal-btn">NEXT &rarr;</button>
              )}
            </div>
          )}

          {/* SAUCE */}
          {gameState === 'sauce' && (
            <div className="h-full flex flex-col p-8 items-center">
              <div className="w-full flex justify-between items-end border-b-2 border-black pb-2 mb-8">
                <h2 className="text-2xl font-bold">02 / COMPOUND</h2>
                <span className="text-xs">DROP IN BOWL</span>
              </div>

              <div className="flex w-full justify-between items-center max-w-4xl">
                <div className="grid grid-cols-2 gap-4">
                  {requiredSauceIngredients.map((item) => (
                    <div key={item} draggable={!sauceIngredientsAdded.includes(item)} onDragStart={(e) => handleDragStart(e, item)}
                      className={`border-2 border-black bg-white p-3 w-32 flex flex-col items-center cursor-grab ${sauceIngredientsAdded.includes(item) ? 'opacity-20 pointer-events-none' : 'hover:bg-gray-50'}`}>
                      <span className="font-bold text-xs uppercase">{item}</span>
                    </div>
                  ))}
                </div>
                
                <div onDragOver={(e) => e.preventDefault()} onDrop={handleSauceDrop} className="w-64 h-64 border-2 border-black rounded-full flex items-center justify-center relative bg-white">
                  <div className="absolute inset-2 border border-dashed border-gray-300 rounded-full"></div>
                  <span className="text-xs font-bold z-10">MIXING BOWL</span>
                  <div className="absolute bottom-0 w-full bg-black transition-all duration-300 opacity-10" style={{height: `${sauceIngredientsAdded.length * 25}%`}}></div>
                </div>
              </div>

              {sauceIngredientsAdded.length === 4 && (
                <button onClick={() => setGameState('cooking')} className="absolute bottom-8 right-8 brutal-btn">HEAT &rarr;</button>
              )}
            </div>
          )}

          {/* COOKING */}
          {gameState === 'cooking' && (
            <div className="h-full flex flex-col p-8 items-center relative">
               <div className="w-full flex justify-between items-end border-b-2 border-black pb-2 mb-4">
                <h2 className="text-2xl font-bold">03 / THERMAL</h2>
                <span className="text-xs">{cookingStep.toUpperCase().replace('_', ' ')}</span>
              </div>

              <div className="relative flex-1 w-full flex items-center justify-center">
                 <div onDragOver={(e) => e.preventDefault()} onDrop={handleWokDrop} className="w-96 h-96 border-2 border-black rounded-full flex items-center justify-center relative bg-white">
                    <span className="absolute -top-6 text-xs bg-black text-white px-2">WOK STATION</span>
                    {/* Visuals */}
                    {cookingStep !== 'empty' && <img src={assets.shrimp} className={`w-32 transition-all ${cookingStep === 'shrimp_cooking' ? 'animate-pulse' : ''}`} alt="Cooking Shrimp" />}
                    {cookingStep === 'egg_added' && <div className="absolute inset-0 bg-yellow-100 opacity-50 rounded-full mix-blend-multiply"></div>}
                 </div>
              </div>

              {/* DOCK */}
              <div className="h-24 w-full border-t-2 border-black flex items-center justify-center gap-4 bg-gray-50">
                {cookingStep === 'empty' && (
                  <div draggable onDragStart={(e) => handleDragStart(e, 'prepped_shrimp')} className="border border-black px-4 py-2 bg-white cursor-move">PREPPED SHRIMP</div>
                )}
                {cookingStep === 'shrimp_cooked' && (
                   <div draggable onDragStart={(e) => handleDragStart(e, 'mixed_sauce')} className="border border-black px-4 py-2 bg-white cursor-move">SAUCE MIX</div>
                )}
                 {cookingStep === 'sauce_added' && (
                   <div draggable onDragStart={(e) => handleDragStart(e, 'egg')} className="border border-black px-4 py-2 bg-white cursor-move">FARM EGG</div>
                )}
              </div>
            </div>
          )}

          {/* PLATING */}
          {gameState === 'plating' && (
            <div className="h-full flex flex-col p-8 items-center">
              <h2 className="text-2xl font-bold mb-8">04 / FINISH</h2>
              <div onDragOver={(e) => e.preventDefault()} onDrop={handlePlatingDrop} className="w-80 h-80 border-2 border-black rounded-full bg-white relative flex items-center justify-center">
                 <img src={assets.shrimp} className="w-48 grayscale opacity-50" alt="Plated Shrimp" />
                 {[...Array(scallionsSprinkled)].map((_,i) => (
                    <div key={i} className="absolute w-4 h-1 bg-green-600" style={{top: `${30+Math.random()*40}%`, left: `${30+Math.random()*40}%`, transform: `rotate(${Math.random()*360}deg)`}}></div>
                 ))}
              </div>
              <div className="mt-8">
                 <div draggable onDragStart={(e) => handleDragStart(e, 'scallions')} className="border border-black px-6 py-3 bg-white cursor-move hover:bg-black hover:text-white transition">
                    DRAG SCALLIONS
                 </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* GAME OVER */}
      {gameState === 'gameOver' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-white">
          <div className="border-4 border-black p-8 max-w-md text-center">
            <h1 className="text-6xl font-black mb-4">DONE.</h1>
            <p className="font-mono text-sm mb-6 border-b border-black pb-4">FINAL SCORE: {score}</p>
            <p className="italic text-gray-500 mb-8">"Minimalist perfection."</p>
            <button onClick={startGame} className="bg-black text-white px-8 py-3 font-bold hover:bg-gray-800 w-full">
              RESTART
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
        <h2 className="text-xs font-bold font-mono uppercase tracking-widest sticky top-8">{title}</h2>
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
      <header className="h-screen flex flex-col justify-between p-6 md:p-12 border-b-2 border-black relative">
        <div className="flex justify-between items-start">
          <span className="font-mono text-xs">EST. 2025</span>
          <span className="font-mono text-xs text-right">SINGAPORE<br/>SG</span>
        </div>
        
        <div className="text-center md:text-left">
          <h1 className="text-[12vw] leading-[0.8] font-black tracking-tighter uppercase mix-blend-difference">
            TONY'S<br/>KITCHEN
          </h1>
        </div>

        <div className="flex justify-between items-end">
          <div className="hidden md:block font-mono text-xs max-w-xs">
            A digital exploration of culinary heritage, wok hei, and the art of shrimp preparation.
          </div>
          <ArrowDown className="animate-bounce w-8 h-8" />
        </div>
      </header>

      {/* 2. THE FILM */}
      <Section title="(01) THE FILM">
        <div className="w-full aspect-video bg-black border-2 border-black relative">
             <iframe 
                src="https://player.vimeo.com/video/1132358106?badge=0&autopause=0&player_id=0&app_id=58479" 
                className="w-full h-full" 
                frameBorder="0" 
                allow="autoplay; fullscreen; picture-in-picture" 
                allowFullScreen
                title="Tony's Kitchen Film"
              ></iframe>
        </div>
        <div className="mt-4 flex justify-between font-mono text-xs border-t border-black pt-2">
          <span>DIR. TONY</span>
          <span>DURATION: 03:45</span>
        </div>
      </Section>

      {/* 3. THE GAME */}
      <Section title="(02) INTERACTIVE">
        <div className="mb-8">
          <h3 className="text-4xl font-bold mb-2">WOK SIMULATOR</h3>
          <p className="font-mono text-sm text-gray-600">Drag, drop, and sear. Experience the pressure of the line.</p>
        </div>
        
        {/* The Game Component */}
        <ShrimpCookingGame />
        
        <div className="grid grid-cols-2 mt-4 font-mono text-xs gap-4">
           <div className="border border-black p-2 text-center">WASD: N/A</div>
           <div className="border border-black p-2 text-center">MOUSE: DRAG</div>
        </div>
      </Section>

      {/* 4. WRITEUP / PIECE INFO */}
      <Section title="(03) CONTEXT">
        <div className="prose prose-xl prose-neutral max-w-none">
          <p className="indent-16 text-2xl leading-relaxed font-serif">
            The shrimp is not merely an ingredient; it is a vessel for history. In this project, we deconstruct the familiar sounds and sights of the family kitchen into digital artifacts. The sizzle of the garlic, the clatter of the wok, the specific shade of orange when the shell transforms—these are the pixels of memory.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <img src="https://placehold.co/600x800/png?text=Process+I" alt="Sketch" className="w-full h-96 object-cover border-2 border-black grayscale hover:grayscale-0 transition duration-500" />
            <img src="https://placehold.co/600x800/png?text=Process+II" alt="Kitchen" className="w-full h-96 object-cover border-2 border-black grayscale hover:grayscale-0 transition duration-500" />
          </div>
          <p className="text-lg font-mono">
            By gamifying the cooking process, we invite the user to perform the labor of love, translating physical muscle memory into cursor movements. It is an homage to the masters who came before us.
          </p>
        </div>
      </Section>

      {/* 5. ABOUT ME */}
      <Section title="(04) PROFILE" className="bg-black text-white border-b-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative">
             <img src="https://placehold.co/500x500/333/FFF?text=Portrait" alt="Profile" className="w-full aspect-square object-cover border-2 border-white filter contrast-125" />
             <div className="absolute -bottom-4 -right-4 bg-white text-black px-4 py-1 font-mono text-sm font-bold">
                DEVELOPER
             </div>
          </div>
          <div>
            <h3 className="text-4xl font-bold mb-6">HI, I'M [NAME]</h3>
            <p className="mb-6 text-gray-400 leading-relaxed">
              I am a creative technologist based in Singapore, specializing in React, interactive media, and digital storytelling. I build bridges between the culinary world and code.
            </p>
            <div className="flex gap-4">
               <a href="#" className="flex items-center gap-2 border border-white px-4 py-2 hover:bg-white hover:text-black transition"><Instagram size={16}/> INSTAGRAM</a>
               <a href="#" className="flex items-center gap-2 border border-white px-4 py-2 hover:bg-white hover:text-black transition"><Mail size={16}/> EMAIL</a>
               <a href="#" className="flex items-center gap-2 border border-white px-4 py-2 hover:bg-white hover:text-black transition"><Globe size={16}/> PORTFOLIO</a>
            </div>
          </div>
        </div>
      </Section>

      <footer className="py-8 px-12 border-t border-white bg-black text-white flex justify-between font-mono text-xs">
        <div>© 2025 ALL RIGHTS RESERVED</div>
        <div>DESIGNED IN SINGAPORE</div>
      </footer>
    </div>
  );
}

export default App;