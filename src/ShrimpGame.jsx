import React, { useState, useEffect } from 'react';
import { Knife, RotateCcw, CheckCircle } from 'lucide-react';

const ShrimpCookingGame = () => {
  // --- ASSETS CONFIGURATION ---
  // Ensure these files are in your /public folder
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
  };

  // --- GAME STATE ---
  const [gameState, setGameState] = useState('menu'); // menu, prep, sauce, cooking, plating, gameOver
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
  // steps: 'empty', 'shrimp_cooking', 'shrimp_cooked', 'sauce_added', 'egg_added'
  const [cookingStep, setCookingStep] = useState('empty');
  const [cookProgress, setCookProgress] = useState(0);

  // PLATING STATE
  const [scallionsSprinkled, setScallionsSprinkled] = useState(0);

  // --- LOGIC & TIMERS ---

  // Cooking Timer
  useEffect(() => {
    let timer;
    if (gameState === 'cooking' && cookingStep === 'shrimp_cooking') {
      timer = setInterval(() => {
        setCookProgress(prev => {
          if (prev >= 100) {
            setCookingStep('shrimp_cooked');
            triggerFeedback("Shrimp Ready! Add Sauce!");
            return 100;
          }
          return prev + 1; // Speed of cooking
        });
      }, 50);
    }
    return () => clearInterval(timer);
  }, [cookingStep, gameState]);

  // --- HANDLERS ---

  const triggerFeedback = (text) => {
    setFeedback(text);
    setTimeout(() => setFeedback(''), 1500);
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
  };

  // 1. PREP HANDLER
  const handlePrepDrop = (e, index) => {
    e.preventDefault();
    if (draggedItem === 'knife' && index === shrimpPrepped) {
      setShrimpPrepped(prev => prev + 1);
      triggerFeedback("Deveined!");
    }
  };

  // 2. SAUCE HANDLER
  const handleSauceDrop = (e) => {
    e.preventDefault();
    if (requiredSauceIngredients.includes(draggedItem) && !sauceIngredientsAdded.includes(draggedItem)) {
      setSauceIngredientsAdded(prev => [...prev, draggedItem]);
      triggerFeedback(`Added ${draggedItem}!`);
    }
  };

  // 3. COOKING HANDLER
  const handleWokDrop = (e) => {
    e.preventDefault();
    
    // Step A: Add Raw Shrimp
    if (draggedItem === 'prepped_shrimp' && cookingStep === 'empty') {
      setCookingStep('shrimp_cooking');
      triggerFeedback("Cooking starts!");
    }
    
    // Step B: Add Mixed Sauce (Only after shrimp is cooked)
    if (draggedItem === 'mixed_sauce' && cookingStep === 'shrimp_cooked') {
      setCookingStep('sauce_added');
      triggerFeedback("Sauce Sizzle!");
    }

    // Step C: Add Egg (Tony's Favorite)
    if (draggedItem === 'egg' && cookingStep === 'sauce_added') {
      setCookingStep('egg_added');
      setScore(prev => prev + 500); // Big bonus
      triggerFeedback("Tony's Favorite Step! 🥚");
      // Wait a moment then go to plating
      setTimeout(() => setGameState('plating'), 2000);
    }
  };

  // 4. PLATING HANDLER
  const handlePlatingDrop = (e) => {
    e.preventDefault();
    if (draggedItem === 'scallions') {
      const newCount = scallionsSprinkled + 1;
      setScallionsSprinkled(newCount);
      triggerFeedback("Sprinkle!");
      
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

  // --- RENDER HELPERS ---

  const Ticket = () => (
    <div className="absolute top-4 right-4 bg-white p-4 rounded shadow-xl border-t-8 border-gray-300 w-48 z-50 rotate-2">
      <h3 className="font-bold border-b-2 border-dashed border-gray-400 mb-2">Order #101</h3>
      <ul className="text-sm font-mono space-y-1">
        <li className={shrimpPrepped === 6 ? "line-through text-gray-400" : ""}>- 6x Shrimp</li>
        <li className={sauceIngredientsAdded.length === 4 ? "line-through text-gray-400" : ""}>- Mix Sauce</li>
        <li className={cookingStep === 'egg_added' ? "line-through text-gray-400" : ""}>- Wok Fry + Egg</li>
        <li className={scallionsSprinkled >= 3 ? "line-through text-gray-400" : ""}>- Scallions</li>
      </ul>
    </div>
  );

  return (
    <div className="w-full h-full bg-stone-100 overflow-hidden relative font-sans select-none flex flex-col">
      
      {/* HEADER */}
      <div className="h-16 bg-gray-900 text-white flex items-center justify-between px-6 shadow-md z-40">
        <div className="flex items-center gap-3">
           <img src={assets.tony} alt="Tony" className="w-10 h-10 rounded-full border-2 border-white bg-white" />
           <span className="font-bold text-yellow-400 text-xl">Score: {score}</span>
        </div>
        <div className="text-gray-400 font-mono">STATION: {gameState.toUpperCase()}</div>
      </div>

      {gameState !== 'menu' && gameState !== 'gameOver' && <Ticket />}

      {/* FEEDBACK POPUP */}
      {feedback && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60] animate-bounce pointer-events-none">
          <span className="text-5xl font-black text-white stroke-black" style={{WebkitTextStroke: '2px black', textShadow: '4px 4px 0 #000'}}>
            {feedback}
          </span>
        </div>
      )}

      {/* --- MENU --- */}
      {gameState === 'menu' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-orange-50 relative">
          <div className="relative w-64 h-64 mb-6 animate-bounce-slow">
            <img src={assets.tony} alt="Tony" className="w-full h-full object-contain drop-shadow-2xl" />
          </div>
          <h1 className="text-6xl font-black text-orange-600 mb-4 tracking-tighter">SHRIMP WOK</h1>
          <button onClick={startGame} className="bg-green-600 hover:bg-green-500 text-white text-2xl font-bold py-4 px-12 rounded-full shadow-xl transform transition hover:scale-105">
            START COOKING
          </button>
        </div>
      )}

      {/* --- 1. PREP STATION --- */}
      {gameState === 'prep' && (
        <div className="flex-1 bg-blue-50 p-8 flex flex-col items-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-2">Step 1: Devein</h2>
          <p className="text-blue-600 mb-8">Drag the knife to the glowing shrimp!</p>
          
          <div className="flex-1 flex flex-wrap justify-center content-center gap-6 max-w-4xl">
             {[...Array(targetShrimpCount)].map((_, i) => (
               <div 
                 key={i}
                 onDragOver={(e) => e.preventDefault()} 
                 onDrop={(e) => handlePrepDrop(e, i)}
                 className={`w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg border-4 transition-all
                   ${i < shrimpPrepped ? 'border-green-400 opacity-50' : 'border-blue-200'}
                   ${i === shrimpPrepped ? 'scale-110 border-yellow-400 animate-pulse' : ''}
                 `}
               >
                 {i < shrimpPrepped ? <CheckCircle className="text-green-500 w-16 h-16"/> : <img src={assets.shrimp} className="w-20 h-20" />}
               </div>
             ))}
          </div>

          <div className="h-32 w-full bg-gray-200 mt-auto rounded-t-3xl flex items-center justify-center border-t-4 border-gray-300">
             <div 
               draggable 
               onDragStart={(e) => handleDragStart(e, 'knife')}
               className="bg-white p-4 rounded-full shadow-xl cursor-grab active:cursor-grabbing hover:rotate-12 transition"
             >
               <Knife size={48} className="text-gray-700" />
               <p className="text-center font-bold text-xs mt-1">TOOL</p>
             </div>
          </div>

          {shrimpPrepped === targetShrimpCount && (
            <button onClick={() => setGameState('sauce')} className="absolute bottom-8 right-8 bg-green-500 text-white px-8 py-3 rounded-xl font-bold text-xl shadow-lg animate-bounce">
              Next Station &rarr;
            </button>
          )}
        </div>
      )}

      {/* --- 2. SAUCE STATION --- */}
      {gameState === 'sauce' && (
        <div className="flex-1 bg-amber-50 p-8 flex flex-col items-center">
          <h2 className="text-3xl font-bold text-amber-900 mb-2">Step 2: The Sauce</h2>
          <p className="text-amber-700 mb-8">Drag all ingredients into the bowl!</p>

          <div className="flex-1 w-full max-w-5xl flex items-center justify-between">
            {/* Ingredients Shelf */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { id: 'seasonings', img: assets.seasonings, label: 'Spices' },
                { id: 'beans', img: assets.beans, label: 'Beans' },
                { id: 'garlic', img: assets.garlic, label: 'G/G' },
                { id: 'wine', img: assets.wine, label: 'Wine' },
              ].map((item) => (
                <div 
                  key={item.id}
                  draggable={!sauceIngredientsAdded.includes(item.id)}
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  className={`bg-white p-4 rounded-xl shadow-md flex flex-col items-center w-32 cursor-grab active:cursor-grabbing
                    ${sauceIngredientsAdded.includes(item.id) ? 'opacity-25 grayscale cursor-default' : 'hover:scale-105'}
                  `}
                >
                  <img src={item.img} alt={item.label} className="h-16 object-contain mb-2" />
                  <span className="font-bold text-sm text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Mixing Bowl */}
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleSauceDrop}
              className="w-64 h-64 rounded-full border-8 border-gray-300 bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center shadow-inner relative"
            >
              <div className="text-gray-400 font-bold">DROP HERE</div>
              {/* Fluid inside based on progress */}
              <div 
                className="absolute bottom-4 bg-amber-700 rounded-full transition-all duration-500 opacity-80"
                style={{
                  width: `${sauceIngredientsAdded.length * 25}%`,
                  height: `${sauceIngredientsAdded.length * 25}%`
                }}
              ></div>
            </div>
          </div>

          {sauceIngredientsAdded.length === 4 && (
            <button onClick={() => setGameState('cooking')} className="mt-8 bg-green-500 text-white px-8 py-3 rounded-xl font-bold text-xl shadow-lg animate-bounce">
              To The Stove! &rarr;
            </button>
          )}
        </div>
      )}

      {/* --- 3. COOKING STATION --- */}
      {gameState === 'cooking' && (
        <div className="flex-1 bg-stone-800 p-8 flex flex-col items-center relative overflow-hidden">
          
          {/* INSTRUCTIONS HUD */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-6 py-2 rounded-full backdrop-blur-sm z-30">
            {cookingStep === 'empty' && "Drag PREPPED SHRIMP to the Wok"}
            {cookingStep === 'shrimp_cooking' && "Wait for it to cook..."}
            {cookingStep === 'shrimp_cooked' && "Drag the SAUCE to the Wok"}
            {cookingStep === 'sauce_added' && "Drag the EGG to finish!"}
          </div>

          {/* STOVE SETUP */}
          <div className="relative mt-auto mb-10 w-[500px] h-[500px]">
            
            {/* 1. Stove (Bottom Layer) */}
            <img src={assets.stove} className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 z-0" alt="Stove" />

            {/* 2. Fire Effect (If cooking) */}
            {cookingStep !== 'empty' && (
               <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-48 h-48 bg-orange-500 rounded-full blur-3xl opacity-40 animate-pulse z-10"></div>
            )}

            {/* 3. Wok (Top Layer) */}
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleWokDrop}
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-96 h-96 z-20 transition-transform origin-bottom hover:scale-105"
            >
              <img src={assets.wok} className="w-full h-full object-contain drop-shadow-2xl" alt="Wok" />
              
              {/* CONTENTS INSIDE WOK */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 flex items-center justify-center">
                
                {/* Shrimp */}
                {cookingStep !== 'empty' && (
                  <img 
                    src={assets.shrimp} 
                    className={`w-32 transition-all duration-1000 ${cookingStep === 'shrimp_cooking' ? 'opacity-80 sepia animate-shake' : ''} ${cookProgress >= 100 ? 'sepia-0 scale-110' : ''}`} 
                  />
                )}

                {/* Sauce Overlay */}
                {(cookingStep === 'sauce_added' || cookingStep === 'egg_added') && (
                  <div className="absolute inset-0 bg-amber-900 mix-blend-multiply opacity-50 rounded-full"></div>
                )}

                {/* Egg Overlay */}
                {cookingStep === 'egg_added' && (
                  <img src={assets.egg} className="absolute w-20 top-0 animate-bounce" />
                )}
              </div>
            </div>
          </div>

          {/* INGREDIENT DOCK */}
          <div className="w-full h-32 bg-stone-700 flex items-center justify-center gap-8 border-t-4 border-stone-600 z-40">
            
            {/* Draggable Shrimp Bowl */}
            {cookingStep === 'empty' && (
              <div 
                draggable 
                onDragStart={(e) => handleDragStart(e, 'prepped_shrimp')}
                className="cursor-move hover:scale-110 transition"
              >
                <div className="bg-pink-100 p-2 rounded-full border-4 border-pink-300">
                  <img src={assets.shrimp} className="w-20" />
                </div>
                <p className="text-white text-center text-sm font-bold mt-1">PREPPED</p>
              </div>
            )}

            {/* Draggable Sauce Bowl */}
            {cookingStep === 'shrimp_cooked' && (
              <div 
                draggable 
                onDragStart={(e) => handleDragStart(e, 'mixed_sauce')}
                className="cursor-move hover:scale-110 transition animate-bounce"
              >
                <div className="bg-amber-800 w-24 h-24 rounded-full border-4 border-amber-600 flex items-center justify-center">
                  <span className="text-2xl">🥣</span>
                </div>
                <p className="text-white text-center text-sm font-bold mt-1">SAUCE</p>
              </div>
            )}

            {/* Draggable Egg */}
            {cookingStep === 'sauce_added' && (
              <div 
                draggable 
                onDragStart={(e) => handleDragStart(e, 'egg')}
                className="cursor-move hover:scale-110 transition animate-pulse"
              >
                <img src={assets.egg} className="w-20 drop-shadow-lg" />
                <p className="text-white text-center text-sm font-bold mt-1">CRACK EGG</p>
              </div>
            )}

          </div>
        </div>
      )}

      {/* --- 4. PLATING STATION --- */}
      {gameState === 'plating' && (
        <div className="flex-1 bg-green-50 p-8 flex flex-col items-center">
          <h2 className="text-3xl font-bold text-green-900 mb-2">Final Step: Plating</h2>
          <p className="text-green-700 mb-8">Sprinkle Scallions on top!</p>

          <div className="relative w-96 h-96 mt-10">
            {/* The Finished Dish */}
            <div 
               onDragOver={(e) => e.preventDefault()}
               onDrop={handlePlatingDrop}
               className="w-full h-full bg-white rounded-full shadow-2xl border-8 border-gray-100 flex items-center justify-center overflow-hidden"
            >
               <img src={assets.shrimp} className="w-64 scale-125" />
               <img src={assets.egg} className="absolute w-24 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
               <div className="absolute inset-0 bg-amber-900 mix-blend-multiply opacity-20"></div>

               {/* Render Sprinkled Scallions */}
               {[...Array(scallionsSprinkled)].map((_, i) => (
                 <img 
                   key={i} 
                   src={assets.scallions} 
                   className="absolute w-32"
                   style={{
                     top: `${40 + Math.random() * 20}%`,
                     left: `${30 + Math.random() * 40}%`,
                     transform: `rotate(${Math.random() * 360}deg)`
                   }} 
                 />
               ))}
            </div>
          </div>

          <div className="mt-auto mb-8">
            <div 
              draggable
              onDragStart={(e) => handleDragStart(e, 'scallions')}
              className="bg-green-100 p-4 rounded-full border-4 border-green-300 cursor-move hover:scale-110 transition"
            >
              <img src={assets.scallions} className="w-24" />
              <p className="text-center font-bold text-green-800">DRAG ME</p>
            </div>
          </div>
        </div>
      )}

      {/* --- GAME OVER --- */}
      {gameState === 'gameOver' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-yellow-50">
          <h1 className="text-5xl font-black text-orange-600 mb-8">ORDER UP!</h1>
          
          <div className="bg-white p-12 rounded-2xl shadow-2xl text-center border-8 border-orange-200 transform -rotate-1 max-w-lg">
            <img src={assets.tony} className="w-40 h-40 mx-auto mb-4 object-contain" />
            <p className="text-2xl font-bold italic text-gray-700 mb-4">"Magnifico! Especially that egg!"</p>
            <div className="text-6xl font-black text-green-600 mb-8">
              Score: {score}
            </div>
            <button 
              onClick={startGame}
              className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-xl hover:bg-blue-700 shadow-lg"
            >
              <RotateCcw size={24} /> Play Again
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ShrimpCookingGame;