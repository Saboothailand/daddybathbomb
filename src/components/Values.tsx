import { Shield, Heart, Star, Users, Zap, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function Values() {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  const values = [
    {
      title: "SAFETY FIRST",
      subtitle: "PROTECTION POWER",
      icon: <Shield className="w-16 h-16" />,
      description: "Every ingredient is kid-approved and safe",
      details: "We use only natural, non-toxic ingredients that are gentle on sensitive skin. Every batch is tested by independent labs and meets the highest safety standards for children's bath products.",
      color: "#FF2D55",
      emoji: "🛡️",
      bgGradient: "from-[#FF2D55] to-[#FF6B8A]"
    },
    {
      title: "PURE FUN",
      subtitle: "JOY GENERATOR",
      icon: <Star className="w-16 h-16" />,
      description: "Bath time should be the highlight of every kid's day - GUARANTEED!",
      details: "We believe laughter is the best medicine and bath time should never be a battle. Our products are designed to create magical moments that kids will remember forever.",
      color: "#FFD700",
      emoji: "🌟",
      bgGradient: "from-[#FFD700] to-[#FFE55C]"
    },
    {
      title: "TOP QUALITY",
      subtitle: "EXCELLENCE FORCE",
      icon: <CheckCircle className="w-16 h-16" />,
      description: "Only the finest ingredients make it into our superhero formulas!",
      details: "We source premium ingredients from trusted suppliers worldwide. Each bath bomb is handcrafted with love and undergoes rigorous quality control to ensure the perfect fizz every time.",
      color: "#007AFF",
      emoji: "💎",
      bgGradient: "from-[#007AFF] to-[#339CFF]"
    },
    {
      title: "FAMILY LOVE",
      subtitle: "UNITY STRENGTH",
      icon: <Heart className="w-16 h-16" />,
      description: "Bringing families together, one bubble at a time!",
      details: "We're a family business that believes in the power of family time. Our mission is to create products that help busy parents connect with their children and make precious memories together.",
      color: "#00FF88",
      emoji: "💝",
      bgGradient: "from-[#00FF88] to-[#5CFFAC]"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#151B2E] to-[#0B0F1A] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-20 left-10 w-20 h-20 bg-[#FFD700] rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-[#FF2D55] rotate-45 animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-24 h-24 border-4 border-[#007AFF] rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-12 h-12 bg-[#00FF88] rounded-full animate-ping"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Zap className="w-10 h-10 text-[#FFD700] animate-bounce mr-4" />
            <Users className="w-12 h-12 text-[#FF2D55] animate-pulse" />
            <Zap className="w-10 h-10 text-[#FFD700] animate-bounce ml-4" />
          </div>
          
          <h2 className="font-fredoka text-5xl font-bold text-white mb-6 comic-shadow">
            OUR SUPER VALUES
          </h2>
          
          <div className="bg-[#007AFF] rounded-2xl px-8 py-4 comic-border border-4 border-black inline-block">
            <p className="font-nunito text-white text-xl font-bold">
              ⚡ The powers behind Daddy Bath Bomb ⚡
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div 
              key={index}
              className="group relative"
              onMouseEnter={() => setHoveredValue(index)}
              onMouseLeave={() => setHoveredValue(null)}
            >
              {/* Main value card */}
              <div 
                className={`bg-[#151B2E] rounded-3xl comic-border border-4 transition-all duration-500 transform hover:scale-105 comic-button relative overflow-hidden ${
                  hoveredValue === index ? 'border-[#FFD700]' : 'border-black'
                }`}
                style={{ 
                  borderColor: hoveredValue === index ? '#FFD700' : value.color 
                }}
              >
                {/* Animated gradient overlay */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 rounded-3xl ${
                    hoveredValue === index ? 'opacity-20' : 'opacity-0'
                  }`}
                  style={{ 
                    background: `linear-gradient(135deg, ${value.color}40, transparent)` 
                  }}
                ></div>
                
                {/* Content */}
                <div className="p-8 relative z-10">
                  {/* Icon with power activation */}
                  <div className="text-center mb-6 relative">
                    <div 
                      className={`w-24 h-24 mx-auto rounded-full comic-border border-4 border-black flex items-center justify-center relative transition-all duration-300 ${
                        hoveredValue === index ? 'animate-pulse' : ''
                      }`}
                      style={{ backgroundColor: value.color }}
                    >
                      <div className="text-white">
                        {value.icon}
                      </div>
                      
                      {/* Power rings */}
                      <div 
                        className={`absolute inset-0 rounded-full transition-all duration-500 ${
                          hoveredValue === index ? 'animate-ping opacity-50' : 'opacity-0'
                        }`}
                        style={{ backgroundColor: value.color }}
                      ></div>
                      
                      {/* Floating emoji */}
                      <div 
                        className={`absolute -top-6 -right-6 text-3xl transition-all duration-300 ${
                          hoveredValue === index ? 'opacity-100 animate-bounce' : 'opacity-0'
                        }`}
                      >
                        {value.emoji}
                      </div>
                    </div>
                  </div>
                  
                  {/* Title and subtitle */}
                  <div className="text-center mb-4">
                    <h3 className="font-fredoka text-xl font-bold text-white mb-2 comic-shadow">
                      {value.title}
                    </h3>
                    <div 
                      className="inline-block px-4 py-2 rounded-full comic-border border-2 border-black font-fredoka font-bold text-sm text-black"
                      style={{ backgroundColor: value.color }}
                    >
                      {value.subtitle}
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="bg-white/10 rounded-2xl p-4 comic-border border-2 border-white/20 backdrop-blur-sm mb-4">
                    <p className="font-nunito text-[#B8C4DB] text-sm leading-relaxed text-center">
                      {value.description}
                    </p>
                  </div>
                  
                  {/* Expandable details */}
                  <div 
                    className={`overflow-hidden transition-all duration-500 ${
                      hoveredValue === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="bg-black/30 rounded-2xl p-4 comic-border border-2 border-[#FFD700]">
                      <p className="font-nunito text-[#B8C4DB] text-xs leading-relaxed">
                        {value.details}
                      </p>
                    </div>
                  </div>
                  
                  {/* Power level indicator */}
                  <div 
                    className={`text-center mt-4 transition-all duration-300 ${
                      hoveredValue === index ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div className="flex justify-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i}
                          className="w-2 h-6 bg-[#FFD700] rounded-full animate-pulse"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        ></div>
                      ))}
                    </div>
                    <span className="font-fredoka text-[#FFD700] text-xs font-bold mt-2 block">
                      POWER LEVEL: MAX!
                    </span>
                  </div>
                  
                  {/* Action lines */}
                  <div 
                    className={`absolute top-4 right-4 transition-all duration-300 ${
                      hoveredValue === index ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div className="w-6 h-1 bg-[#FFD700] rotate-12 mb-1"></div>
                    <div className="w-4 h-1 bg-[#FFD700] rotate-12 mb-1"></div>
                    <div className="w-2 h-1 bg-[#FFD700] rotate-12"></div>
                  </div>
                </div>
                
                {/* Glow effect */}
                <div 
                  className={`absolute inset-0 rounded-3xl transition-all duration-500 ${
                    hoveredValue === index ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ 
                    boxShadow: hoveredValue === index ? `0 0 40px ${value.color}40` : 'none'
                  }}
                ></div>
              </div>
              
              {/* Floating sparkles */}
              <div 
                className={`absolute -top-2 -left-2 transition-all duration-300 ${
                  hoveredValue === index ? 'opacity-100 animate-spin' : 'opacity-0'
                }`}
              >
                <Star className="w-6 h-6 text-[#FFD700]" />
              </div>
              <div 
                className={`absolute -bottom-2 -right-2 transition-all duration-300 ${
                  hoveredValue === index ? 'opacity-100 animate-bounce' : 'opacity-0'
                }`}
              >
                <Zap className="w-5 h-5 text-[#FF2D55]" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Values commitment */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-[#FF2D55] via-[#007AFF] to-[#FFD700] rounded-3xl p-8 comic-border border-6 border-black inline-block">
            <h3 className="font-fredoka text-3xl font-bold text-white mb-4 comic-shadow">
              OUR SUPERHERO PROMISE
            </h3>
            <p className="font-nunito text-white text-xl font-bold mb-2">
              💝 We pledge to uphold these values in everything we do! 💝
            </p>
            <p className="font-nunito text-white/80 text-lg">
              Because every family deserves to feel like superheroes! 🦸‍♂️🦸‍♀️
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}