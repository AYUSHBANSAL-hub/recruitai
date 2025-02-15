
import { Check } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

const PricingSection = () => {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for small businesses just getting started",
      features: [
        "Up to 5 job postings",
        "Basic resume parsing",
        "Standard form builder",
        "Email support"
      ]
    },
    {
      name: "Professional",
      price: "$49",
      description: "Ideal for growing companies with regular hiring needs",
      features: [
        "Unlimited job postings",
        "Advanced AI resume ranking",
        "Custom form templates",
        "Priority support",
        "Analytics dashboard"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations with complex hiring processes",
      features: [
        "Everything in Professional",
        "Custom AI model training",
        "API access",
        "Dedicated account manager",
        "Custom integrations"
      ]
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 gradient-text">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that best fits your hiring needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`glass-card p-8 rounded-2xl relative ${
                plan.popular ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.price !== "Custom" && <span className="text-gray-600">/month</span>}
              </div>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-blue-600 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href={"/signup"}>
              <Button 
                className={`w-full ${
                  plan.popular ? 'button-gradient' : ''
                }`}
                variant={plan.popular ? 'default' : 'outline'}
              >
                Get Started
              </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
