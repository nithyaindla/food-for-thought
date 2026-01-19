import React, { useState, useEffect } from 'react';
import { CheckCircle, ArrowDown, Instagram, Mail, Globe, RotateCcw } from 'lucide-react';

// --- THE GAME COMPONENT (Internal) ---
const ShrimpCookingGame = () => {
  // Assets
  const assets = {
    // Ensure these match your actual file names in the public folder
    tony: "/tony.png",
    wok: "/wok.png",
    stove: "/stove.png",
    shrimp: "/shrimp.png",         // Generic shrimp for icons
    oneShrimp: "/one-shrimp.png", // Specific for deveining step
    finalShrimp: "/final-shrimp.png", // The final product
    seasonings: "/seasonings.png",
    beans: "/beans.png",
    garlic: "/garlic.png",
    wine: "/wine.png",
    egg: "/egg.png",
    knife: "/knife.png", 
  };

  // State
  const [gameState, setGameState] = useState('menu'); 
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);
  
  // PREP STATE
  const [shrimpPrepped, setShrimpPrepped] = useState(0);
  const targetShrimpCount = 6;
  
  // SAUCE STATE
  const [sauceIngredientsAdded, setSauceIngredientsAdded] = useState([]);
  const requiredSauceIngredients = ['seasonings', 'beans', 'garlic', 'wine'];
  
  // COOKING STATE
  const [cookingStep, setCookingStep] = useState('empty');
  const [cookProgress, setCookProgress] = useState(0);

  // Timer for cooking simulation
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
      setScore(prev => prev + 1000);
      triggerFeedback("PERFECTO");
      // Skip plating, go straight to Final Product
      setTimeout(() => setGameState('final'), 2000);
    }
  };

  const startGame = () => {
    setGameState('prep');
    setScore(0);
    setShrimpPrepped(0);
    setSauceIngredientsAdded([]);
    setCookingStep('empty');
    setCookProgress(0);
  };

  return (
    <div className="w-full h-[700px] border-2 border-black bg-white relative font-mono select-none flex flex-col overflow-hidden brutal-shadow">
      
      {/* HUD */}
      <div className="h-12 border-b-2 border-black flex items-center justify-between px-4 bg-gray-50 z-20">
        <div className="flex items-center gap-4 text-sm font-bold">
           <span>STATION: {gameState.toUpperCase()}</span>
           <span>SCORE: {score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500 border border-black"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 border border-black"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 border border-black"></div>
        </div>
      </div>

      {feedback && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60] pointer-events-none w-full text-center">
          <span className="text-6xl font-black bg-yellow-400 text-black px-4 py-2 border-2 border-black shadow-lg animate-bounce inline-block">
            {feedback}
          </span>
        </div>
      )}

      {/* MENU */}
      {gameState === 'menu' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 relative">
          <h1 className="text-5xl md:text-7xl font-black mb-2 tracking-tighter">SHRIMP.EXE</h1>
          <p className="font-mono text-sm mb-8 text-gray-500">INTERACTIVE COOKING MODULE v2.0</p>
          <button onClick={startGame} className="brutal-btn text-xl">
            INITIALIZE SEQUENCE
          </button>
        </div>
      )}

      {/* STATIONS */}
      {gameState !== 'menu' && gameState !== 'final' && (
        <div className="flex-1 relative bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]">
          
          {/* 1. PREP STATION */}
          {gameState === 'prep' && (
            <div className="h-full flex flex-col p-8 items-center">
              <div className="w-full flex justify-between items-end border-b-2 border-black pb-2 mb-8 bg-white/80 backdrop-blur-sm p-2">
                <h2 className="text-2xl font-bold">01 / DEVEIN</h2>
                <span className="text-xs">DRAG KNIFE TO SHRIMP</span>
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
                        // Using the specific 'one-shrimp' image for cleaning step
                        <img src={assets.oneShrimp} className={`w-full h-full object-contain drop-shadow-lg ${i === shrimpPrepped ? 'animate-pulse' : ''}`} alt="Shrimp to Clean" />
                     )}
                   </div>
                 ))}
              </div>

              <div className="mt-auto relative">
                 <div draggable onDragStart={(e) => handleDragStart(e, 'knife')} className="cursor-grab active:cursor-grabbing hover:scale-110 transition-transform">
                   <img src={assets.knife} className="w-24 h-24 object-contain drop-shadow-xl" alt="Knife Tool" />
                   <div className="bg-black text-white text-xs px-2 py-1 absolute -bottom-2 left-1/2 transform -translate-x-1/2">TOOL</div>
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
                <h2 className="text-2xl font-bold">02 / COMPOUND</h2>
                <span className="text-xs">DRAG INGREDIENTS TO BOWL</span>
              </div>

              <div className="flex flex-col md:flex-row w-full justify-between items-center max-w-5xl gap-12">
                {/* Ingredients Grid - Made bigger and more graphical */}
                <div className="grid grid-cols-2 gap-8">
                  {requiredSauceIngredients.map((item) => (
                    <div key={item} draggable={!sauceIngredientsAdded.includes(item)} onDragStart={(e) => handleDragStart(e, item)}
                      className={`w-32 h-32 flex flex-col items-center justify-center cursor-grab transition-transform 
                        ${sauceIngredientsAdded.includes(item) ? 'opacity-20 grayscale pointer-events-none' : 'hover:scale-110'}`}>
                      <img src={assets[item]} className="w-24 h-24 object-contain drop-shadow-md" alt={item} />
                      <span className="font-bold text-xs uppercase bg-white px-1 mt-1 border border-black">{item}</span>
                    </div>
                  ))}
                </div>
                
                {/* Mixing Bowl */}
                <div onDragOver={(e) => e.preventDefault()} onDrop={handleSauceDrop} className="w-80 h-80 border-4 border-black rounded-full flex items-center justify-center relative bg-white shadow-xl overflow-hidden group">
                  <div className="absolute inset-4 border-2 border-dashed border-gray-300 rounded-full"></div>
                  <span className="text-xs font-bold z-10 bg-black text-white px-2 py-1">MIXING BOWL</span>
                  {/* Liquid fill animation */}
                  <div className="absolute bottom-0 w-full bg-amber-600 transition-all duration-500 opacity-80" style={{height: `${sauceIngredientsAdded.length * 25}%`}}></div>
                  {/* Floating ingredients inside bowl */}
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
                <h2 className="text-2xl font-bold">03 / THERMAL</h2>
                <span className="text-xs text-red-600 font-bold">{cookingStep.toUpperCase().replace('_', ' ')}</span>
              </div>

              <div className="relative flex-1 w-full flex items-center justify-center">
                 <div onDragOver={(e) => e.preventDefault()} onDrop={handleWokDrop} className="w-[500px] h-[400px] flex items-center justify-center relative transition-transform">
                    {/* Stove BG */}
                    <div className="absolute bottom-0 w-64 h-12 bg-black opacity-20 blur-xl rounded-full"></div>
                    
                    {/* Wok Image */}
                    <img src={assets.wok} className="w-full h-full object-contain drop-shadow-2xl z-10" alt="Wok" />
                    
                    {/* Cooking Contents Area */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 flex items-center justify-center z-20">
                        {cookingStep !== 'empty' && (
                            <img src={assets.shrimp} className={`w-40 object-contain transition-all duration-500 ${cookingStep === 'shrimp_cooking' ? 'animate-shake saturate-150' : ''}`} alt="Cooking" />
                        )}
                        {cookingStep === 'egg_added' && (
                             <img src={assets.egg} className="absolute top-0 right-0 w-24 animate-bounce" alt="Egg" />
                        )}
                    </div>

                    {/* Smoke/Steam Effects */}
                    {cookingStep !== 'empty' && (
                        <div className="absolute -top-10 left-1/2 w-20 h-40 bg-gray-200 blur-2xl opacity-40 animate-pulse transform -translate-x-1/2"></div>
                    )}
                 </div>
              </div>

              {/* Ingredient Dock */}
              <div className="h-32 w-full border-t-2 border-black flex items-center justify-center gap-12 bg-gray-100 z-30">
                {cookingStep === 'empty' && (
                  <div draggable onDragStart={(e) => handleDragStart(e, 'prepped_shrimp')} className="cursor-move hover:scale-110 transition text-center group">
                     <div className="w-24 h-24 bg-white border-2 border-black rounded-full flex items-center justify-center mb-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-active:shadow-none group-active:translate-y-1">
                        <img src={assets.shrimp} className="w-16" alt="Prepped" />
                     </div>
                     <span className="font-bold text-xs bg-black text-white px-2">PREPPED SHRIMP</span>
                  </div>
                )}
                {cookingStep === 'shrimp_cooked' && (
                   <div draggable onDragStart={(e) => handleDragStart(e, 'mixed_sauce')} className="cursor-move hover:scale-110 transition text-center group">
                      <div className="w-24 h-24 bg-amber-100 border-2 border-black rounded-full flex items-center justify-center mb-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-active:shadow-none group-active:translate-y-1">
                        <span className="text-4xl">🥣</span>
                      </div>
                      <span className="font-bold text-xs bg-black text-white px-2">SAUCE MIX</span>
                   </div>
                )}
                 {cookingStep === 'sauce_added' && (
                   <div draggable onDragStart={(e) => handleDragStart(e, 'egg')} className="cursor-move hover:scale-110 transition text-center group">
                      <div className="w-24 h-24 bg-white border-2 border-black rounded-full flex items-center justify-center mb-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-active:shadow-none group-active:translate-y-1">
                        <img src={assets.egg} className="w-16" alt="Egg" />
                      </div>
                      <span className="font-bold text-xs bg-black text-white px-2">FARM EGG</span>
                   </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* FINAL PRODUCT SCREEN */}
      {gameState === 'final' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-white p-8">
          <div className="border-4 border-black p-8 max-w-2xl text-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-gray-50">
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase">Order Complete</h1>
            
            {/* The Final Product Image */}
            <div className="my-8 relative group">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <img src={assets.finalShrimp} alt="Final Dish" className="w-96 h-auto mx-auto drop-shadow-2xl transform transition hover:scale-105 duration-500" />
            </div>

            <p className="font-mono text-sm mb-6 border-b-2 border-black pb-4 inline-block">FINAL SCORE: {score}</p>
            <p className="italic text-gray-500 mb-8 font-serif text-lg">"A perfect harmony of wok hei and texture."</p>
            
            <button onClick={startGame} className="bg-black text-white px-8 py-4 font-bold hover:bg-yellow-400 hover:text-black transition-colors w-full flex items-center justify-center gap-2">
              <RotateCcw size={20}/> RESTART SHIFT
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
          <p className="font-mono text-sm text-gray-600">Drag ingredients to interact. Experience the pressure of the line.</p>
        </div>
        
        {/* The Game Component */}
        <ShrimpCookingGame />
        
        {/* DISCLAIMER */}
        <p className="mt-6 font-mono text-[10px] text-gray-400 text-center uppercase tracking-widest">
          Disclaimer: The graphics in this game were created by Google Gemini and are AI generated.
        </p>

        <div className="grid grid-cols-2 mt-8 font-mono text-xs gap-4">
           <div className="border border-black p-2 text-center">WASD: N/A</div>
           <div className="border border-black p-2 text-center">MOUSE: DRAG & DROP</div>
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