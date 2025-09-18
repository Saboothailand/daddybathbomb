import { Calendar, Trophy, Users, Globe, Star, Zap, Rocket } from "lucide-react";
import { useState } from "react";

export default function Timeline() {
  const [expandedMilestone, setExpandedMilestone] = useState<number | null>(null);

  const milestones = [
    {
      year: "2020",
      title: "THE ORIGIN",
      icon: <Rocket className="w-8 h-8" />,
      description: "Super Dad discovers the secret formula in his kitchen lab!",
      details: "After countless failed experiments and one very colorful bathtub incident, the first Daddy Bath Bomb was born. It turned the water purple and made bath time magical for the first time ever!",
      color: "#FF2D55",
      emoji: "🚀"
    },
    {
      year: "2021", 
      title: "FIRST EXPLOSION",
      icon: <Users className="w-8 h-8" />,
      description: "100 families join the super fun bath time revolution!",
      details: "Word spread like wildfire through playground networks. Suddenly, dads everywhere were requesting the 'secret weapon' that made their kids actually WANT to take baths!",
      color: "#007AFF",
      emoji: "💥"
    },
    {
      year: "2022",
      title: "SUPER GROWTH",
      icon: <Trophy className="w-8 h-8" />,
      description: "10,000+ happy families and first industry recognition!",
      details: "Won 'Most Innovative Bath Product' at the Super Dad Awards. Featured in Parenting Heroes Magazine as 'The Dad Who Saved Bath Time.' Our warehouse moved from the garage to an actual building!",
      color: "#FFD700",
      emoji: "🏆"
    },
    {
      year: "2023",
      title: "GOING VIRAL",
      icon: <Globe className="w-8 h-8" />,
      description: "Social media explosion reaches 1M+ super dads worldwide!",
      details: "The #DaddyBathBomb challenge broke the internet. Videos of colorful bath transformations went viral on TikTok, Instagram, and YouTube. International shipping launched to spread the magic globally!",
      color: "#00FF88",
      emoji: "🌍"
    },
    {
      year: "2024",
      title: "SUPERHERO STATUS",
      icon: <Star className="w-8 h-8" />,
      description: "50,000+ families served, superhero line launched!",
      details: "Introduced themed collections including Superhero Series, Princess Power, and Dinosaur Destruction. Partnered with children's hospitals to bring joy to young patients during treatment.",
      color: "#AF52DE",
      emoji: "⭐"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0B0F1A] to-[#151B2E] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-32 left-20 w-16 h-16 bg-[#FFD700] rounded-full animate-bounce"></div>
        <div className="absolute bottom-40 right-32 w-12 h-12 bg-[#FF2D55] rotate-45 animate-spin" style={{ animationDuration: '6s' }}></div>
        <div className="absolute top-60 left-1/3 w-20 h-20 border-4 border-[#007AFF] rounded-full animate-pulse"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Calendar className="w-10 h-10 text-[#FFD700] animate-pulse mr-4" />
            <Zap className="w-12 h-12 text-[#FF2D55] animate-bounce" />
            <Calendar className="w-10 h-10 text-[#FFD700] animate-pulse ml-4" />
          </div>
          
          <h2 className="font-fredoka text-5xl font-bold text-white mb-6 comic-shadow">
            SUPERHERO TIMELINE
          </h2>
          
          <div className="bg-[#007AFF] rounded-2xl px-8 py-4 comic-border border-4 border-black inline-block">
            <p className="font-nunito text-white text-xl font-bold">
              📅 The legendary journey through time! ⚡
            </p>
          </div>
        </div>
        
        <div className="relative">
          {/* Central timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-full bg-gradient-to-b from-[#FF2D55] via-[#007AFF] to-[#FFD700] rounded-full hidden lg:block"></div>
          
          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div key={index} className={`flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex-col lg:gap-8`}>
                {/* Content card */}
                <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'} text-center`}>
                  <div 
                    className="bg-[#151B2E] rounded-3xl p-8 comic-border border-4 hover:border-[#FFD700] transition-all duration-300 transform hover:scale-105 comic-button cursor-pointer group"
                    onClick={() => setExpandedMilestone(expandedMilestone === index ? null : index)}
                    style={{ borderColor: milestone.color }}
                  >
                    {/* Year badge */}
                    <div 
                      className="inline-block px-6 py-3 rounded-full comic-border border-3 border-black font-fredoka font-bold text-xl text-black mb-4"
                      style={{ backgroundColor: milestone.color }}
                    >
                      {milestone.year}
                    </div>
                    
                    {/* Milestone content */}
                    <div className="mb-4">
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <span className="text-4xl animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
                          {milestone.emoji}
                        </span>
                        <div style={{ color: milestone.color }}>
                          {milestone.icon}
                        </div>
                      </div>
                      
                      <h3 className="font-fredoka text-2xl font-bold text-white mb-3 comic-shadow">
                        {milestone.title}
                      </h3>
                      
                      <p className="font-nunito text-[#B8C4DB] text-lg font-bold mb-4">
                        {milestone.description}
                      </p>
                    </div>
                    
                    {/* Expandable details */}
                    <div className={`overflow-hidden transition-all duration-300 ${expandedMilestone === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="bg-black/20 rounded-2xl p-4 comic-border border-2 border-white/20">
                        <p className="font-nunito text-[#B8C4DB] leading-relaxed">
                          {milestone.details}
                        </p>
                      </div>
                    </div>
                    
                    {/* Hover indicator */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-4">
                      <Star className="w-6 h-6 text-[#FFD700] mx-auto animate-spin" />
                    </div>
                  </div>
                </div>
                
                {/* Timeline dot */}
                <div className="hidden lg:flex w-2/12 justify-center relative z-20">
                  <div 
                    className="w-16 h-16 rounded-full comic-border border-4 border-black flex items-center justify-center relative group"
                    style={{ backgroundColor: milestone.color }}
                  >
                    <div className="text-white">
                      {milestone.icon}
                    </div>
                    
                    {/* Pulsing ring */}
                    <div 
                      className="absolute inset-0 rounded-full animate-ping opacity-75"
                      style={{ backgroundColor: milestone.color }}
                    ></div>
                  </div>
                </div>
                
                {/* Spacer for alternating layout */}
                <div className="w-full lg:w-5/12 hidden lg:block"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Future teaser */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-[#FF2D55] via-[#007AFF] to-[#FFD700] rounded-3xl p-8 comic-border border-6 border-black inline-block transform hover:scale-105 transition-transform duration-300">
            <h3 className="font-fredoka text-3xl font-bold text-white mb-4 comic-shadow">
              THE ADVENTURE CONTINUES...
            </h3>
            <p className="font-nunito text-white text-xl font-bold mb-2">
              🚀 Next stop: GALACTIC BATH BOMBS! 🌌
            </p>
            <p className="font-nunito text-white/80 text-lg">
              Coming 2025 - Bath time in SPACE! 🛸
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}