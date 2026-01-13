import React from 'react';
import ShrimpCookingGame from './ShrimpGame';

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* --- Navigation Bar --- */}
      <nav className="bg-gray-900 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-500">Tony's Kitchen</h1>
          <div className="space-x-4">
            <a href="#" className="hover:text-orange-400">Home</a>
            <a href="#game" className="hover:text-orange-400">Play Game</a>
            <a href="#" className="hover:text-orange-400">About</a>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <header className="bg-orange-50 py-20 text-center px-4">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">Master the Art of Wok</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join Tony in the kitchen and learn the secrets of the perfect shrimp stir-fry. 
          It's all about timing, sauce ratios, and high heat!
        </p>
        <a href="#game" className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-orange-700 transition">
          Start Cooking Now
        </a>
      </header>

      {/* --- THE GAME SECTION --- */}
      <section id="game" className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-800">Play the Game</h2>
            <p className="text-gray-600">Drag the shrimp, watch the heat, and mix the sauce!</p>
          </div>

          {/* Game Container - This box holds your game */}
          <div className="max-w-5xl mx-auto h-[700px] border-4 border-gray-800 rounded-3xl overflow-hidden shadow-2xl bg-white">
            <ShrimpCookingGame />
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center">
        <p>© 2025 Tony's Kitchen Digital Experience.</p>
      </footer>
    </div>
  );
}

export default App;