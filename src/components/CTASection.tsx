import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="section-padding bg-gradient-to-r from-blue-600 to-indigo-600">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Hiring Process?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of companies using ResumeAI to find the best talent
            efficiently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={"/signup"}>
              <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 rounded-xl text-lg">
                Start Free Trial <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link href={"/login"}>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-6 rounded-xl text-lg"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
