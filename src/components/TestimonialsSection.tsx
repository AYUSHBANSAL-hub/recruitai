
import { Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "RecruitAI has revolutionized our hiring process. We've reduced our time-to-hire by 60% and found better-qualified candidates.",
      author: "Sarah Johnson",
      position: "HR Director",
      company: "TechCorp Inc."
    },
    {
      quote: "The AI-powered ranking system is incredibly accurate. It helps us focus on the most promising candidates right away.",
      author: "Michael Chen",
      position: "Talent Acquisition Manager",
      company: "Global Solutions"
    },
    {
      quote: "Creating custom application forms is a breeze. The platform is intuitive and saves us hours of manual work.",
      author: "Emma Williams",
      position: "Recruiting Lead",
      company: "Innovate Labs"
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 gradient-text">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what our customers say about RecruitAI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="glass-card p-8 rounded-2xl relative">
              <Quote className="w-8 h-8 text-blue-600 mb-4" />
              <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
              <div className="mt-auto">
                <p className="font-semibold text-black">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.position}</p>
                <p className="text-sm text-blue-600">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;