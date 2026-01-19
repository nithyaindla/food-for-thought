import React, { useState, useEffect } from 'react';
import { RotateCcw, CheckCircle, ArrowRight } from 'lucide-react';

const ShrimpCookingGame = () => {
  // --- ASSETS (Using placeholders if specific assets miss, but keeping your keys) ---
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
    knife: "/knife.png" 
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
                     {i < shrimpPrepped ? <CheckCircle /> : <img src={assets.shrimp} className="w-16 grayscale" />}
                   </div>
                 ))}
              </div>

              <div className="mt-auto">
                 <div draggable onDragStart={(e) => handleDragStart(e, 'knife')} className="border-2 border-black bg-white p-4 cursor-grab active:cursor-grabbing hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow">
                   <Knife size={32} />
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
                    {cookingStep !== 'empty' && <img src={assets.shrimp} className={`w-32 transition-all ${cookingStep === 'shrimp_cooking' ? 'animate-pulse' : ''}`} />}
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
                 <img src={assets.shrimp} className="w-48 grayscale opacity-50" />
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

export default ShrimpCookingGame;