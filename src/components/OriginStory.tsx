import { Baby, Lightbulb, Rocket, Star, Zap } from "lucide-react";

export default function OriginStory() {
  const storyPanels = [
    {
      title: "THE DISCOVERY",
      icon: <Baby className="w-12 h-12" />,
      content: "One chaotic Tuesday, Dad realized bath time was turning into a BATTLE! 😤",
      image: "👶",
      bgColor: "from-[#FF2D55] to-[#FF6B8A]",
      borderColor: "border-[#FF2D55]"
    },
    {
      title: "THE EXPERIMENT", 
      icon: <Lightbulb className="w-12 h-12" />,
      content: "In his secret lab (aka the kitchen), he mixed magical ingredients! ⚗️",
      image: "🧪",
      bgColor: "from-[#007AFF] to-[#339CFF]",
      borderColor: "border-[#007AFF]"
    },
    {
      title: "THE BREAKTHROUGH",
      icon: <Zap className="w-12 h-12" />,
      content: "EUREKA! The very first Daddy Bath Bomb was born – explosive fun guaranteed! 💥",
      image: "💣",
      bgColor: "from-[#FFD700] to-[#FFE55C]",
      borderColor: "border-[#FFD700]"
    },
    {
      title: "THE MISSION",
      icon: <Rocket className="w-12 h-12" />,
      content: "Now every dad can be a superhero, turning ordinary baths into extraordinary adventures! 🚀",
      image: "🦸‍♂️",
      bgColor: "from-[#00FF88] to-[#5CFFAC]",
      borderColor: "border-[#00FF88]"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B0F1A] relative overflow-hidden">
      {/* Comic book background effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-24 h-24 bg-[#FFD700] rotate-45 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-[#FF2D55] rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 border-4 border-[#007AFF] rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-12 h-12 bg-[#00FF88] rounded-full animate-ping"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Star className="w-10 h-10 text-[#FFD700] animate-spin mr-4" />
            <span className="font-fredoka text-3xl text-[#FF2D55] font-bold comic-shadow">ORIGIN STORY</span>
            <Star className="w-10 h-10 text-[#FFD700] animate-spin ml-4" />
          </div>
          
          <h2 className="font-fredoka text-5xl font-bold text-white mb-6 comic-shadow">
            HOW IT ALL BEGAN
          </h2>
          
          <div className="bg-[#151B2E] rounded-2xl px-8 py-4 comic-border border-4 border-[#FFD700] inline-block">
            <p className="font-nunito text-xl text-[#B8C4DB] font-bold">
              📚 The legendary tale of transformation! 📚
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {storyPanels.map((panel, index) => (
            <div 
              key={index} 
              className={`group bg-gradient-to-br ${panel.bgColor} rounded-3xl comic-border border-6 ${panel.borderColor} hover:scale-105 transition-all duration-300 comic-button relative overflow-hidden`}
            >
              {/* Panel number */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-black rounded-full comic-border border-4 border-white flex items-center justify-center z-20">
                <span className="font-fredoka text-white font-bold text-lg">{index + 1}</span>
              </div>
              
              {/* Main content */}
              <div className="p-8 text-center relative z-10">
                {/* Title banner */}
                <div className="bg-black/80 rounded-2xl px-4 py-2 mb-6 comic-border border-3 border-white">
                  <h3 className="font-fredoka text-lg font-bold text-white comic-shadow">
                    {panel.title}
                  </h3>
                </div>
                
                {/* Character/Image */}
                <div className="mb-6">
                  <div className="text-6xl mb-4 animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
                    {panel.image}
                  </div>
                  <div className="flex justify-center text-white">
                    {panel.icon}
                  </div>
                </div>
                
                {/* Story text */}
                <div className="bg-white/90 rounded-2xl p-4 comic-border border-3 border-black">
                  <p className="font-nunito text-black font-bold text-sm leading-relaxed">
                    {panel.content}
                  </p>
                </div>
                
                {/* Action lines */}
                <div className="absolute top-4 right-4 w-6 h-1 bg-white rotate-12 opacity-70"></div>
                <div className="absolute top-6 right-6 w-4 h-1 bg-white rotate-12 opacity-70"></div>
              </div>
              
              {/* Comic book halftone effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-300"></div>
              
              {/* Hover sparkles */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Star className="w-6 h-6 text-white animate-spin" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to action panel */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-[#FF2D55] via-[#007AFF] to-[#FFD700] rounded-3xl p-8 comic-border border-6 border-black inline-block">
            <h3 className="font-fredoka text-3xl font-bold text-white mb-4 comic-shadow">
              AND THE ADVENTURE CONTINUES...
            </h3>
            <p className="font-nunito text-white text-xl font-bold">
              🌟 Join thousands of Super Dads in the bath time revolution! 🌟
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}