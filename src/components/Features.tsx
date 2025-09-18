import { Leaf, Heart, Shield, Sparkles } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "100% Natural",
    description: "Made with organic ingredients and essential oils sourced from sustainable farms."
  },
  {
    icon: Heart,
    title: "Handcrafted with Love",
    description: "Every product is carefully crafted by hand in small batches for premium quality."
  },
  {
    icon: Shield,
    title: "Skin Safe",
    description: "Dermatologist tested and free from harsh chemicals, sulfates, and parabens."
  },
  {
    icon: Sparkles,
    title: "Aromatherapy Benefits",
    description: "Infused with therapeutic essential oils to enhance your mood and well-being."
  }
];

export default function Features() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-pink-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4">
            Why Choose Pure Bliss?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We believe in creating products that are good for you and good for the planet.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-4 border border-gray-100">
                  <Icon className="h-8 w-8 text-rose-300" />
                </div>
                <h3 className="text-lg mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}