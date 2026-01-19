import React from 'react';
import ShrimpCookingGame from './ShrimpGame';
import { ArrowDown, Instagram, Mail, Globe } from 'lucide-react';

// Reusable Components for the Studio Look
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