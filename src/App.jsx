{/* --- THE GAME SECTION --- */}
<section id="game" className="py-16 bg-gray-100">
  <div className="container mx-auto px-4">
    
    {/* 1. VIMEO VIDEO HEADER */}
    <div className="max-w-4xl mx-auto mb-12">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Tony's Recipe</h2>
        <p className="text-gray-600">Watch how Tony does it, then try it yourself below!</p>
      </div>
      
      {/* Responsive Video Container */}
      <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-black">
        <iframe 
          src = "https://player.vimeo.com/video/1132358106?badge=0&amp"
          className="w-full h-full" 
          frameBorder="0" 
          allow="autoplay; fullscreen; picture-in-picture" 
          allowFullScreen
        ></iframe>
      </div>
    </div>

    {/* 2. THE GAME CONTAINER */}
    <div className="text-center mb-6">
      <h2 className="text-4xl font-bold text-gray-800">Your Turn to Cook</h2>
    </div>

    <div className="max-w-5xl mx-auto h-[700px] border-4 border-gray-800 rounded-3xl overflow-hidden shadow-2xl bg-white">
      <ShrimpCookingGame />
    </div>
  </div>
</section>