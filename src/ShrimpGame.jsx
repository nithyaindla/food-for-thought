import React, { useState, useEffect } from 'react';
import { Star, Clock, Info, RotateCcw } from 'lucide-react';

const ShrimpCookingGame = () => {
  // --- Game State ---
  const [gameState, setGameState] = useState('menu'); // menu, prep, cooking, sauce, gameOver
  const [score, setScore] = useState(0);
  
  // --- Assets (Using placeholders for the logic, replace src with your actual file paths) ---
  const assets = {
    chef: "Tony_character.jpg",
    wok: "wok.jpg",
    supplies: "cooking-supplies.jpg"
  };

  // --- Order & Logic ---
  const orders = [
    { 
      id: 1, 
      customer: 'Customer #1', 
      shrimpCount: 6, 
      cookTime: 5, // slightly longer for realism
      sauce: { oyster: 3, soy: 1, sugar: 1 } 
    },
  ];
  const [currentOrder, setCurrentOrder] = useState(orders[0]);

  // Station States
  const [shrimpPrepped, setShrimpPrepped] = useState(0);
  const [shrimpCooked, setShrimpCooked] = useState(0);
  const [currentShrimpInWok, setCurrentShrimpInWok] = useState(false);
  const [cookProgress, setCookProgress] = useState(0); // 0 to 100+
  const [sauceRatio, setSauceRatio] = useState({ oyster: 0, soy: 0, sugar: 0 });
  const [draggedItem, setDraggedItem] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [cookedShrimpQuality, setCookedShrimpQuality] = useState([]);
  const [ticketVisible, setTicketVisible] = useState(true);

  // --- Timer / Loop ---
  useEffect(() => {
    let timer;
    if (gameState === 'cooking' && currentShrimpInWok) {
      timer = setInterval(() => {
        setCookProgress(prev => prev + (100 / (currentOrder.cookTime * 10)));
      }, 100);
    }
    return () => clearInterval(timer);
  }, [currentShrimpInWok, gameState, currentOrder]);

  // --- Handlers ---

  const startGame = () => {
    setGameState('prep');
    setScore(0);
    setShrimpPrepped(0);
    setShrimpCooked(0);
    setCurrentShrimpInWok(false);
    setCookProgress(0);
    setSauceRatio({ oyster: 0, soy: 0, sugar: 0 });
    setFeedback('');
    setCookedShrimpQuality([]);
  };

  const handlePrepClick = (index) => {
    if (index === shrimpPrepped) {
      setShrimpPrepped(prev => prev + 1);
      triggerFeedback("Cleaned!");
    }
  };

  const handleDragStart = (e, type) => {
    setDraggedItem(type);
  };

  const handleDropWok = (e) => {
    e.preventDefault();
    if (draggedItem === 'raw_shrimp' && !currentShrimpInWok) {
      setCurrentShrimpInWok(true);
      setCookProgress(0);
    }
  };

  const handleDropTray = (e) => {
    e.preventDefault();
    if (draggedItem === 'cooking_shrimp') {
      evaluateCooking();
      setCurrentShrimpInWok(false);
      setCookProgress(0);
      
      // Auto progression
      if (shrimpCooked + 1 >= currentOrder.shrimpCount) {
         setTimeout(() => setGameState('sauce'), 1000);
      }
    }
  };

  const evaluateCooking = () => {
    let quality = 'bad';
    let pts = 0;
    
    if (cookProgress >= 90 && cookProgress <= 110) {
      quality = 'perfect';
      pts = 100;
      triggerFeedback("Perfect!");
    } else if (cookProgress > 110) {
      quality = 'burned';
      pts = 20;
      triggerFeedback("Burned!");
    } else {
      quality = 'raw';
      pts = 50;
      triggerFeedback("Too Early!");
    }
    
    setCookedShrimpQuality([...cookedShrimpQuality, quality]);
    setScore(prev => prev + pts);
    setShrimpCooked(prev => prev + 1);
  };

  const addSauce = (type) => {
    setSauceRatio(prev => ({...prev, [type]: prev[type] + 1}));
  };

  const triggerFeedback = (text) => {
    setFeedback(text);
    setTimeout(() => setFeedback(''), 1000);
  };

  const finishGame = () => {
    // Sauce evaluation
    const s = currentOrder.sauce;
    const r = sauceRatio;
    let sauceScore = 0;
    if (s.oyster === r.oyster && s.soy === r.soy && s.sugar === r.sugar) {
      sauceScore = 200;
    } else {
      sauceScore = 50;
    }
    setScore(prev => prev + sauceScore);
    setGameState('gameOver');
  };

  // --- Components ---

  const OrderTicket = () => (
    <div className={`absolute top-4 right-4 bg-white paper-texture p-4 rounded shadow-xl border-t-8 border-gray-300 w-48 transition-transform z-50 ${ticketVisible ? 'translate-x-0' : 'translate-x-full'}`}>
      <button onClick={() => setTicketVisible(!ticketVisible)} className="absolute -left-8 top-0 bg-gray-300 p-2 rounded-l font-bold text-xs transform -rotate-90 origin-right">
        ORDER
      </button>
      <h3 className="font-bold text-lg border-b-2 border-dashed border-gray-400 mb-2">Ticket #101</h3>
      <div className="space-y-2 text-sm font-mono">
        <p>🔴 {currentOrder.shrimpCount}x Shrimp</p>
        <p>------------</p>
        <p>🟤 {currentOrder.sauce.oyster}x Oyster Sauce</p>
        <p>⚫ {currentOrder.sauce.soy}x Soy Sauce</p>
        <p>⚪ {currentOrder.sauce.sugar}x Sugar</p>
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen bg-stone-100 overflow-hidden relative font-sans select-none">
      
      {/* Top HUD */}
      <div className="absolute top-0 left-0 w-full h-12 bg-gray-800 text-white flex items-center justify-between px-4 z-40 shadow-md">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
             <img src={assets.chef} alt="Tony" className="object-cover w-full h-full" />
           </div>
           <span className="font-bold text-yellow-400">Score: {score}</span>
        </div>
        <div className="text-gray-400 text-sm">Station: {gameState.toUpperCase()}</div>
      </div>

      {currentOrder && <OrderTicket />}

      {/* FEEDBACK POPUP */}
      {feedback && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce">
          <span className="text-4xl font-black text-white stroke-black" style={{WebkitTextStroke: '2px black'}}>{feedback}</span>
        </div>
      )}

      {/* --- MENU SCREEN --- */}
      {gameState === 'menu' && (
        <div className="h-full flex flex-col items-center justify-center bg-orange-50">
          <div className="relative w-64 h-64 mb-6">
            <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
            <img src={assets.chef} alt="Tony" className="relative w-full h-full object-contain drop-shadow-2xl" />
          </div>
          <h1 className="text-6xl font-black text-orange-600 mb-2" style={{textShadow: '2px 2px 0px #fff'}}>SHRIMP PAPA</h1>
          <p className="text-gray-600 mb-8 font-medium">Tony needs help in the kitchen!</p>
          <button 
            onClick={startGame}
            className="bg-green-500 hover:bg-green-600 text-white text-2xl font-bold py-4 px-12 rounded-xl shadow-lg border-b-8 border-green-700 active:border-b-0 active:translate-y-2 transition-all"
          >
            PLAY
          </button>
        </div>
      )}

      {/* --- PREP STATION --- */}
      {gameState === 'prep' && (
        <div className="h-full w-full bg-blue-50 pt-16 p-8 flex flex-col items-center">
          <h2 className="text-3xl font-bold text-blue-800 mb-8">Devein The Shrimp</h2>
          
          <div className="bg-white rounded-xl shadow-inner border-4 border-blue-200 p-8 w-full max-w-4xl flex flex-wrap justify-center gap-4">
             {[...Array(currentOrder.shrimpCount)].map((_, i) => (
               <div 
                 key={i}
                 onClick={() => handlePrepClick(i)}
                 className={`w-32 h-32 relative transition-all duration-300 cursor-pointer 
                   ${i < shrimpPrepped ? 'opacity-50 grayscale' : 'hover:scale-105 active:scale-95'}
                   ${i === shrimpPrepped ? 'animate-bounce' : ''}
                 `}
               >
                 <span className="text-6xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                   {i < shrimpPrepped ? '🍤' : '🦐'}
                 </span>
                 {i === shrimpPrepped && (
                   <div className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                     CLICK!
                   </div>
                 )}
               </div>
             ))}
          </div>

          <button 
             disabled={shrimpPrepped < currentOrder.shrimpCount}
             onClick={() => setGameState('cooking')}
             className={`mt-8 px-8 py-3 rounded-lg font-bold text-xl transition-all ${shrimpPrepped === currentOrder.shrimpCount ? 'bg-green-500 text-white shadow-lg cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            Go To Wok &rarr;
          </button>
        </div>
      )}

      {/* --- COOKING STATION --- */}
      {gameState === 'cooking' && (
        <div className="h-full w-full bg-stone-800 pt-16 relative overflow-hidden">
          
          {/* Work Surface */}
          <div className="absolute bottom-0 w-full h-1/2 bg-stone-300 border-t-8 border-stone-400"></div>

          <div className="relative z-10 max-w-6xl mx-auto flex h-full items-end pb-8 justify-around">
            
            {/* Raw Bin */}
            <div className="w-48 bg-pink-100 rounded-t-xl p-4 border-4 border-pink-300 mb-8">
              <p className="text-center font-bold text-pink-800 mb-2">RAW</p>
              <div 
                draggable 
                onDragStart={(e) => handleDragStart(e, 'raw_shrimp')}
                className="w-full h-32 bg-pink-200 rounded-lg flex items-center justify-center text-5xl cursor-move hover:bg-pink-300 active:scale-95 transition-colors shadow-inner"
              >
                🦐
              </div>
              <p className="text-center text-xs mt-2 text-pink-600">Drag to Wok</p>
            </div>

            {/* THE WOK */}
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropWok}
              className="relative w-96 h-96 mb-12"
            >
              {/* Wok Image with Blend Mode to remove white bg */}
              <img 
                src={assets.wok} 
                alt="Wok" 
                className="w-full h-full object-contain"
                style={{ mixBlendMode: 'multiply' }} 
              />
              
              {/* Interactive Zone inside Wok */}
              <div className="absolute top-[25%] left-[20%] w-[60%] h-[50%] rounded-full flex items-center justify-center">
                 {currentShrimpInWok && (
                   <div 
                     draggable
                     onDragStart={(e) => handleDragStart(e, 'cooking_shrimp')}
                     className="relative cursor-move"
                   >
                     {/* Cooking Shrimp Visual */}
                     <span className={`text-6xl filter drop-shadow-lg transition-all duration-1000 ${cookProgress > 100 ? 'brightness-50 grayscale' : cookProgress > 50 ? 'sepia-0' : 'sepia'}`}>
                       🍤
                     </span>
                     
                     {/* Steam Effect */}
                     <div className="absolute -top-10 left-0 w-full flex justify-center space-x-2">
                        <div className="w-2 h-8 bg-white opacity-40 rounded-full animate-ping"></div>
                        <div className="w-2 h-8 bg-white opacity-30 rounded-full animate-pulse delay-75"></div>
                     </div>

                     {/* Doneness Ring */}
                     <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 pointer-events-none">
                       <circle cx="64" cy="64" r="30" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="6" />
                       <circle 
                         cx="64" cy="64" r="30" fill="none" 
                         stroke={cookProgress > 110 ? "red" : cookProgress > 90 ? "#4ade80" : "orange"} 
                         strokeWidth="6"
                         strokeDasharray={188}
                         strokeDashoffset={188 - (188 * Math.min(cookProgress, 120) / 100)}
                         className="transition-all duration-100"
                         strokeLinecap="round"
                         transform="rotate(-90 64 64)"
                       />
                     </svg>
                   </div>
                 )}
              </div>
            </div>

            {/* Finished Tray */}
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropTray}
              className="w-48 bg-green-100 rounded-t-xl p-4 border-4 border-green-300 mb-8 min-h-[16rem]"
            >
              <p className="text-center font-bold text-green-800 mb-2">DONE ({shrimpCooked}/{currentOrder.shrimpCount})</p>
              <div className="grid grid-cols-2 gap-2">
                {cookedShrimpQuality.map((q, i) => (
                  <div key={i} className={`h-12 rounded flex items-center justify-center text-2xl bg-white shadow-sm
                    ${q === 'burned' ? 'bg-gray-800 grayscale' : ''}
                  `}>
                    🍤
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- SAUCE STATION --- */}
      {gameState === 'sauce' && (
        <div className="h-full w-full bg-amber-50 pt-16 flex flex-col items-center">
          <div className="text-center mb-4">
             <h2 className="text-3xl font-bold text-amber-800">Sauce Station</h2>
             <p className="text-amber-600">Follow the Ticket Recipe!</p>
          </div>

          <div className="relative w-full max-w-4xl h-[500px] bg-white rounded-xl shadow-2xl border-4 border-amber-200 overflow-hidden">
            {/* Supplies Background Image */}
            <img 
               src={assets.supplies} 
               alt="Kitchen Supplies" 
               className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            
            {/* Overlay Gradient for readability */}
            <div className="absolute inset-0 bg-white/60"></div>

            {/* Interactive "Bottles" positioned relative to the container */}
            <div className="absolute inset-0 flex items-center justify-center gap-12">
              
              {/* Oyster Sauce */}
              <div 
                onClick={() => addSauce('oyster')}
                className="group relative flex flex-col items-center cursor-pointer transition-transform hover:-translate-y-2 active:translate-y-0"
              >
                <div className="w-32 h-64 bg-amber-900 rounded-t-full rounded-b-lg shadow-xl border-b-8 border-amber-950 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl -rotate-90">OYSTER</span>
                </div>
                <div className="mt-4 bg-white px-4 py-2 rounded-full font-bold shadow border border-gray-200">
                  Count: {sauceRatio.oyster}
                </div>
              </div>

               {/* Soy Sauce */}
               <div 
                onClick={() => addSauce('soy')}
                className="group relative flex flex-col items-center cursor-pointer transition-transform hover:-translate-y-2 active:translate-y-0"
              >
                <div className="w-24 h-56 bg-black rounded-t-md rounded-b-lg shadow-xl border-b-8 border-gray-800 flex items-center justify-center">
                  <span className="text-white font-bold text-xl -rotate-90">SOY</span>
                </div>
                <div className="mt-4 bg-white px-4 py-2 rounded-full font-bold shadow border border-gray-200">
                  Count: {sauceRatio.soy}
                </div>
              </div>

               {/* Sugar */}
               <div 
                onClick={() => addSauce('sugar')}
                className="group relative flex flex-col items-center cursor-pointer transition-transform hover:-translate-y-2 active:translate-y-0"
              >
                <div className="w-32 h-32 bg-gray-100 rounded-lg shadow-xl border-b-8 border-gray-300 flex items-center justify-center mt-auto">
                   <span className="text-gray-500 font-bold text-2xl">SUGAR</span>
                </div>
                <div className="mt-4 bg-white px-4 py-2 rounded-full font-bold shadow border border-gray-200">
                  Count: {sauceRatio.sugar}
                </div>
              </div>

            </div>
          </div>

          <button 
             onClick={finishGame}
             className="mt-8 bg-purple-600 text-white px-12 py-4 rounded-full text-2xl font-bold shadow-xl hover:bg-purple-700 hover:scale-105 transition-all"
          >
            SERVE ORDER!
          </button>
        </div>
      )}

      {/* --- GAME OVER --- */}
      {gameState === 'gameOver' && (
        <div className="h-full flex flex-col items-center justify-center bg-green-50">
          <h1 className="text-6xl font-black text-green-600 mb-8">ORDER UP!</h1>
          
          <div className="bg-white p-12 rounded-2xl shadow-2xl text-center border-4 border-green-200 transform -rotate-2">
            <img src={assets.chef} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-yellow-400" />
            <p className="text-gray-500 mb-2">Tony says...</p>
            <p className="text-3xl font-bold mb-6 italic">"{score > 400 ? 'Magnifico! You are a natural!' : 'Not bad, kid. Keep practicing.'}"</p>
            <div className="text-5xl font-black text-gray-800 mb-8">
              Score: {score}
            </div>
            <button 
              onClick={startGame}
              className="flex items-center justify-center gap-2 w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600"
            >
              <RotateCcw size={20} /> Try Again
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ShrimpCookingGame;