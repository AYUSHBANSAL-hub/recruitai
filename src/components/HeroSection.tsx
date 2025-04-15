import { ArrowRight, FileText, Users, Star, Bot } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-indigo-50 z-0" />

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div
          className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-float"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-200 rounded-full opacity-20 animate-float"
          style={{ animationDelay: "0.2s" }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-float"
          style={{ animationDelay: "0.4s" }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-blue-100 rounded-full opacity-20 animate-float"
          style={{ animationDelay: "0.6s" }}
        />

        {/* Abstract shapes */}
        <div className="absolute top-1/4 right-1/3 w-48 h-48 opacity-10">
          <div
            className="absolute inset-0 transform rotate-45 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg animate-float"
            style={{ animationDelay: "0.8s" }}
          />
        </div>
        <div className="absolute bottom-1/3 left-1/3 w-36 h-36 opacity-10">
          <div
            className="absolute inset-0 transform -rotate-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg animate-float"
            style={{ animationDelay: "1s" }}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="text-center max-w-4xl mx-auto animate-slide-in">
          <div className="inline-flex  items-center gap-2 px-4 py-2 mb-6 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
            <Bot className="w-4 h-4 " />
            Powered by AI
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-black">
            Welcome to <span className="gradient-text">HirezApp</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your hiring process with AI-powered resume ranking and
            intelligent candidate matching. Build custom application forms and
            find your perfect candidates faster.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href={"/signup"}>
              <Button className="button-gradient px-8 py-6 rounded-xl text-lg">
                Get Started Free <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link href={"/login"}>
              <Button
                variant="outline"
                className="px-8 py-6 rounded-xl text-lg"
              >
                Sign In
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              {
                icon: FileText,
                label: "Dynamic Forms",
                value: "100% Customizable",
              },
              { icon: Users, label: "Happy Clients", value: "500+" },
              { icon: Star, label: "Success Rate", value: "95%" },
            ].map((stat, index) => (
              <div
                key={index}
                className="glass-card p-6 rounded-2xl animate-float"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-1 text-black">{stat.value}</h3>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
