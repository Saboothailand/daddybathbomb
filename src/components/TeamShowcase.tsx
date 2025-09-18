import { useState } from "react";
import { Shield, Zap, Heart, Star, Beaker, Palette, Users, Rocket } from "lucide-react";

export default function TeamShowcase() {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);

  const teamMembers = [
    {
      name: "Mike 'The Creator' Johnson",
      role: "Founder & Chief Bubble Officer",
      normalEmoji: "👨‍💼",
      superheroEmoji: "🦸‍♂️",
      superpower: "FORMULA MASTER",
      description: "The legendary dad who started it all! Master of fizzy formulas and explosive colors.",
      heroDescription: "With the power of ULTIMATE BATH CHEMISTRY, he can create any color combination and make even the grumpiest kids love bath time!",
      color: "#FF2D55",
      icon: <Beaker className="w-8 h-8" />
    },
    {
      name: "Sarah 'Color Burst' Chen",
      role: "Creative Director & Design Wizard",
      normalEmoji: "👩‍🎨",
      superheroEmoji: "🎨",
      superpower: "RAINBOW VISION",
      description: "The artistic genius behind every magical color combination and packaging design.",
      heroDescription: "Armed with CHROMATIC SUPERPOWERS, she can see every color in the universe and create combinations that make kids gasp with wonder!",
      color: "#007AFF",
      icon: <Palette className="w-8 h-8" />
    },
    {
      name: "David 'Safety Shield' Martinez",
      role: "Quality Control & Safety Hero",
      normalEmoji: "👨‍🔬",
      superheroEmoji: "🛡️",
      superpower: "PROTECTION FORCE",
      description: "Our guardian angel who ensures every bath bomb is perfectly safe for little heroes.",
      heroDescription: "With INVINCIBLE SAFETY SENSES, he can detect any ingredient that shouldn't be near kids and protects families with his shield of quality!",
      color: "#FFD700",
      icon: <Shield className="w-8 h-8" />
    },
    {
      name: "Emma 'Happy Helper' Williams",
      role: "Customer Joy Specialist",
      normalEmoji: "👩‍💻",
      superheroEmoji: "💖",
      superpower: "SMILE GENERATOR",
      description: "The voice of our brand who spreads happiness and solves problems with super speed.",
      heroDescription: "Powered by UNLIMITED KINDNESS ENERGY, she can turn any frown upside down and make every customer feel like family!",
      color: "#00FF88",
      icon: <Heart className="w-8 h-8" />
    },
    {
      name: "Alex 'Growth Rocket' Thompson",
      role: "Marketing & Community Captain",
      normalEmoji: "👨‍💻",
      superheroEmoji: "🚀",
      superpower: "VIRAL VELOCITY",
      description: "The mastermind behind our explosive growth and amazing community of super families.",
      heroDescription: "With SOCIAL MEDIA SUPERPOWERS, he can make anything go viral and connect super dads across the galaxy!",
      color: "#AF52DE",
      icon: <Rocket className="w-8 h-8" />
    },
    {
      name: "Jessica 'Team Unity' Brown",
      role: "Operations & Team Harmony Leader",
      normalEmoji: "👩‍💼",
      superheroEmoji: "🤝",
      superpower: "UNITY FORCE",
      description: "The amazing coordinator who keeps our superhero team working together perfectly.",
      heroDescription: "With TEAMWORK TELEPATHY, she can synchronize any group and make impossible deadlines possible through the power of unity!",
      color: "#FF8C42",
      icon: <Users className="w-8 h-8" />
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B0F1A] relative overflow-hidden">
      {/* Comic background effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-24 h-24 bg-[#FFD700] rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-[#FF2D55] rotate-45 animate-spin" style={{ animationDuration: '6s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 border-4 border-[#007AFF] rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-12 h-12 bg-[#00FF88] rounded-full animate-ping"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Users className="w-10 h-10 text-[#FFD700] animate-pulse mr-4" />
            <Zap className="w-12 h-12 text-[#FF2D55] animate-bounce" />
            <Users className="w-10 h-10 text-[#FFD700] animate-pulse ml-4" />
          </div>
          
          <h2 className="font-fredoka text-5xl font-bold text-white mb-6 comic-shadow">
            MEET THE SUPER TEAM
          </h2>
          
          <div className="bg-[#151B2E] rounded-2xl px-8 py-4 comic-border border-4 border-[#FF2D55] inline-block">
            <p className="font-nunito text-[#B8C4DB] text-xl font-bold">
              🦸‍♂️ Every superhero needs an amazing team! 🦸‍♀️
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className="group relative"
              onMouseEnter={() => setHoveredMember(index)}
              onMouseLeave={() => setHoveredMember(null)}
            >
              {/* Main card */}
              <div 
                className={`bg-[#151B2E] rounded-3xl comic-border border-4 transition-all duration-500 transform hover:scale-105 comic-button relative overflow-hidden ${
                  hoveredMember === index ? 'border-[#FFD700]' : 'border-black'
                }`}
                style={{ 
                  borderColor: hoveredMember === index ? '#FFD700' : member.color 
                }}
              >
                {/* Transformation overlay */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 rounded-3xl ${
                    hoveredMember === index ? 'opacity-20' : 'opacity-0'
                  }`}
                  style={{ 
                    background: `linear-gradient(135deg, ${member.color}40, transparent)` 
                  }}
                ></div>
                
                {/* Content */}
                <div className="p-8 relative z-10">
                  {/* Character transformation */}
                  <div className="text-center mb-6 relative">
                    {/* Normal state */}
                    <div 
                      className={`text-8xl transition-all duration-500 ${
                        hoveredMember === index ? 'opacity-0 scale-0 rotate-180' : 'opacity-100 scale-100 rotate-0'
                      }`}
                    >
                      {member.normalEmoji}
                    </div>
                    
                    {/* Superhero state */}
                    <div 
                      className={`absolute inset-0 text-8xl transition-all duration-500 ${
                        hoveredMember === index ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 -rotate-180'
                      }`}
                    >
                      {member.superheroEmoji}
                    </div>
                    
                    {/* Power indicator */}
                    <div 
                      className={`absolute -top-4 -right-4 w-12 h-12 rounded-full comic-border border-3 border-black flex items-center justify-center transition-all duration-300 ${
                        hoveredMember === index ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                      }`}
                      style={{ backgroundColor: member.color }}
                    >
                      <div className="text-white">
                        {member.icon}
                      </div>
                    </div>
                  </div>
                  
                  {/* Name and role */}
                  <div className="text-center mb-4">
                    <h3 className="font-fredoka text-xl font-bold text-white mb-2 comic-shadow">
                      {member.name}
                    </h3>
                    <div 
                      className="inline-block px-4 py-2 rounded-full comic-border border-2 border-black font-nunito font-bold text-sm text-black"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.role}
                    </div>
                  </div>
                  
                  {/* Superpower reveal */}
                  <div 
                    className={`text-center mb-4 transition-all duration-300 ${
                      hoveredMember === index ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'
                    }`}
                  >
                    <div className="bg-black/50 rounded-2xl px-4 py-2 comic-border border-2 border-[#FFD700]">
                      <span className="font-fredoka text-[#FFD700] font-bold text-lg comic-shadow">
                        {member.superpower}
                      </span>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="bg-white/10 rounded-2xl p-4 comic-border border-2 border-white/20 backdrop-blur-sm">
                    {/* Normal description */}
                    <p 
                      className={`font-nunito text-[#B8C4DB] text-sm leading-relaxed transition-all duration-300 ${
                        hoveredMember === index ? 'opacity-0 max-h-0' : 'opacity-100 max-h-32'
                      }`}
                    >
                      {member.description}
                    </p>
                    
                    {/* Hero description */}
                    <p 
                      className={`font-nunito text-[#B8C4DB] text-sm leading-relaxed transition-all duration-300 ${
                        hoveredMember === index ? 'opacity-100 max-h-32' : 'opacity-0 max-h-0'
                      }`}
                    >
                      {member.heroDescription}
                    </p>
                  </div>
                  
                  {/* Action lines for transformation effect */}
                  <div 
                    className={`absolute top-4 right-4 transition-all duration-300 ${
                      hoveredMember === index ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div className="w-6 h-1 bg-[#FFD700] rotate-12 mb-1"></div>
                    <div className="w-4 h-1 bg-[#FFD700] rotate-12 mb-1"></div>
                    <div className="w-2 h-1 bg-[#FFD700] rotate-12"></div>
                  </div>
                </div>
                
                {/* Power aura effect */}
                <div 
                  className={`absolute inset-0 rounded-3xl transition-all duration-500 ${
                    hoveredMember === index ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ 
                    boxShadow: hoveredMember === index ? `0 0 30px ${member.color}40` : 'none'
                  }}
                ></div>
              </div>
              
              {/* Floating stars on hover */}
              <div 
                className={`absolute -top-2 -left-2 transition-all duration-300 ${
                  hoveredMember === index ? 'opacity-100 animate-spin' : 'opacity-0'
                }`}
              >
                <Star className="w-6 h-6 text-[#FFD700]" />
              </div>
              <div 
                className={`absolute -bottom-2 -right-2 transition-all duration-300 ${
                  hoveredMember === index ? 'opacity-100 animate-bounce' : 'opacity-0'
                }`}
              >
                <Star className="w-4 h-4 text-[#FF2D55]" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Team unity message */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-[#FF2D55] via-[#007AFF] to-[#FFD700] rounded-3xl p-8 comic-border border-6 border-black inline-block">
            <h3 className="font-fredoka text-3xl font-bold text-white mb-4 comic-shadow">
              TOGETHER WE'RE UNSTOPPABLE!
            </h3>
            <p className="font-nunito text-white text-xl font-bold mb-2">
              🚀 Every superhero needs their team! 🚀
            </p>
            <p className="font-nunito text-white/80 text-lg">
              We're always looking for more heroes to join our mission! 💪
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}