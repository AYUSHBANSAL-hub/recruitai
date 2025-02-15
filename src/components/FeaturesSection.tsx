
import { FileText, Users, Brain, Clock } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: FileText,
      title: "Dynamic Form Builder",
      description:
        "Create custom application forms with drag-and-drop ease. Add fields, customize validation, and preview in real-time.",
      gradient: "from-blue-400 to-indigo-400"
    },
    {
      icon: Brain,
      title: "AI-Powered Ranking",
      description:
        "Our advanced AI analyzes resumes against job descriptions to rank candidates based on relevance and qualifications.",
      gradient: "from-indigo-400 to-purple-400"
    },
    {
      icon: Users,
      title: "Candidate Management",
      description:
        "Track applications, communicate with candidates, and manage the entire hiring pipeline from one dashboard.",
      gradient: "from-purple-400 to-pink-400"
    },
    {
      icon: Clock,
      title: "Time-Saving Automation",
      description:
        "Automate resume screening and candidate ranking to focus on what matters most - finding the right talent.",
      gradient: "from-pink-400 to-blue-400"
    },
  ];

  return (
    <section className="section-padding bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-r from-blue-100 to-transparent rounded-full blur-3xl opacity-30 transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-indigo-100 to-transparent rounded-full blur-3xl opacity-30 transform translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 gradient-text">
            Powerful Features for Modern Recruitment
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to streamline your hiring process and find the best talent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card p-8 rounded-2xl hover:scale-105 transition-transform duration-300 relative group"
            >
              {/* Animated gradient border */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} bg-opacity-10 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
