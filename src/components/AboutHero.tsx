import { Shield, Star, Zap, Heart } from "lucide-react";
import AnimatedBackground from "./AnimatedBackground";

export default function AboutHero() {
  return (
    <section className="relative bg-gradient-to-br from-[#0B0F1A] via-[#1a1f2e] to-[#007AFF]/20 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden flex items-center">
      <AnimatedBackground />
      
      {/* Comic speech bubble */}
      <div className="absolute top-20 right-10 hidden lg:block animate-bounce">
        <div className="bg-[#FFD700] rounded-2xl px-6 py-3 comic-border border-4 border-black relative">
          <span className="font-fredoka text-black font-bold text-lg">Origin Story!</span>
          <div className="absolute -bottom-3 left-8 w-0 h-0 border-l-6 border-r-6 border-t-12 border-transparent border-t-[#FFD700]"></div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <Shield className="w-10 h-10 text-[#FFD700] mr-3 animate-pulse" />
              <span className="font-nunito text-[#B8C4DB] text-xl font-bold">Daddy Bath Bomb Chronicles</span>
              <Shield className="w-10 h-10 text-[#FFD700] ml-3 animate-pulse" />
            </div>
            
            <h1 className="font-fredoka text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-none comic-shadow">
              <span className="inline-block animate-bounce text-[#FF2D55]" style={{ animationDelay: '0s' }}>MEET THE</span>
              <span className="block text-[#007AFF] relative">
                <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>SUPER DAD</span>
                <Zap className="absolute -top-4 -right-8 w-12 h-12 text-[#FFD700] rotate-12 animate-spin" style={{ animationDuration: '3s' }} />
              </span>
              <span className="block text-white animate-bounce" style={{ animationDelay: '0.4s' }}>BEHIND THE MAGIC</span>
            </h1>
            
            <div className="bg-[#151B2E]/80 rounded-3xl p-6 comic-border border-4 border-[#FFD700] backdrop-blur-lg mb-6">
              <p className="font-nunito text-xl text-[#B8C4DB] leading-relaxed mb-4">
                🦸‍♂️ Once upon a time, an ordinary dad discovered the secret to making bath time 
                <span className="text-[#FF2D55] font-bold"> SUPER FUN</span>!
              </p>
              <p className="font-nunito text-lg text-[#B8C4DB] leading-relaxed">
                💥 With Daddy Bath Bomb, bath time became the most exciting adventure for busy families everywhere!
              </p>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
              <Star className="w-8 h-8 text-[#FFD700] animate-spin" />
              <span className="font-fredoka text-2xl text-white font-bold">Est. 2020</span>
              <Star className="w-8 h-8 text-[#FFD700] animate-spin" />
            </div>
          </div>
          
          <div className="relative">
            {/* Super Dad character showcase */}
            <div className="w-96 h-96 mx-auto bg-gradient-to-br from-[#FF2D55] via-[#007AFF] to-[#FFD700] rounded-full comic-border border-8 border-white flex items-center justify-center relative overflow-hidden animate-float">
              {/* Main superhero character */}
              <div className="text-9xl animate-bounce" style={{ animationDuration: '2s' }}>
                🦸‍♂️
              </div>
              
              {/* Cape effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#FF2D55]/30 to-transparent rounded-full"></div>
              
              {/* Floating bath bombs around character */}
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-[#FFD700] rounded-full comic-border border-4 border-black flex items-center justify-center animate-bounce">
                <span className="text-2xl">🛁</span>
              </div>
              
              <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#00FF88] rounded-full comic-border border-4 border-black flex items-center justify-center animate-pulse">
                <span className="text-3xl">💣</span>
              </div>
              
              <div className="absolute top-1/4 -right-8 w-12 h-12 bg-[#007AFF] rounded-full comic-border border-4 border-black flex items-center justify-center animate-bounce" style={{ animationDelay: '0.5s' }}>
                <Heart className="w-6 h-6 text-white" />
              </div>
              
              <div className="absolute bottom-1/4 -left-8 w-14 h-14 bg-[#FF2D55] rounded-full comic-border border-4 border-black flex items-center justify-center animate-pulse" style={{ animationDelay: '1s' }}>
                <Star className="w-8 h-8 text-white" />
              </div>
              
              {/* Action lines */}
              <div className="absolute top-8 left-8 w-8 h-1 bg-[#FFD700] rotate-45 animate-pulse"></div>
              <div className="absolute bottom-8 right-8 w-6 h-1 bg-white rotate-12 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
              <div className="absolute top-1/2 right-4 w-4 h-1 bg-[#00FF88] -rotate-45 animate-pulse" style={{ animationDelay: '0.7s' }}></div>
            </div>
            
            {/* Power-up effects */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#FF2D55] rounded-full opacity-20 blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-[#007AFF] rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/3 -right-8 w-20 h-20 bg-[#FFD700] rounded-full opacity-30 blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            
            {/* Comic "Bubble" text */}
            <div className="absolute top-4 left-4 bg-white rounded-full px-4 py-2 comic-border border-3 border-black animate-pulse">
              <span className="font-fredoka text-black font-bold text-lg">Bubble</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}