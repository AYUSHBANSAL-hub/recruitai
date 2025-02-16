
import { Check } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      title: "Create Custom Forms",
      description: "Design application forms tailored to your specific requirements with our intuitive form builder.",
      gradient: "from-blue-400 to-indigo-400"
    },
    {
      title: "Collect Applications",
      description: "Share your form link and receive applications with resumes through a streamlined process.",
      gradient: "from-indigo-400 to-purple-400"
    },
    {
      title: "AI Analysis",
      description: "Our AI analyzes resumes against job descriptions to provide detailed matching scores.",
      gradient: "from-purple-400 to-pink-400"
    },
    {
      title: "Make Better Decisions",
      description: "Review ranked candidates and make data-driven hiring decisions with confidence.",
      gradient: "from-pink-400 to-blue-400"
    },
  ];

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-blue-50 to-transparent opacity-50 animate-float"
             style={{ animationDelay: "0.2s" }} />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-t from-indigo-50 to-transparent opacity-50 animate-float"
             style={{ animationDelay: "0.4s" }} />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 gradient-text">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A simple yet powerful process to transform your hiring workflow
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="glass-card p-8 rounded-2xl flex items-start gap-4 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
              >
                {/* Animated gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-r ${step.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <div className="relative z-10 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl text-black font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>

                {/* Decorative corner accent */}
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
