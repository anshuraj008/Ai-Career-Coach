"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CreditCard,
  Lock,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { upgradeToPremium } from "@/actions/user";
import useFetch from "@/hooks/use-fetch";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");

  const {
    loading: isUpgrading,
    fn: upgradeToPremiumFn,
    data: upgradeResult,
  } = useFetch(upgradeToPremium);

  // Redirect to sign-in if user is loaded and not authenticated
  useEffect(() => {
    if (isLoaded && !user) {
      toast.error("Please sign in to upgrade to Premium.");
      router.push("/sign-in");
    }
  }, [isLoaded, user]);

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!cardNumber || !expiry || !cvc || !nameOnCard) {
      toast.error("Please fill in all credit card details.");
      return;
    }

    try {
      await upgradeToPremiumFn();
    } catch (error) {
      toast.error(error.message || "Checkout failed");
    }
  };

  useEffect(() => {
    if (upgradeResult?.success && !isUpgrading) {
      toast.success("Payment successful! You are now a Premium member.");
      router.push("/dashboard");
      router.refresh();
    }
  }, [upgradeResult, isUpgrading]);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 relative">
      {/* Decorative gradient glow background */}
      <div className="absolute top-0 right-[25%] w-[350px] h-[350px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="flex flex-col space-y-4 mb-6">
        <Link href="/">
          <Button
            variant="link"
            className="gap-2 pl-0 text-primary hover:text-primary/80 font-semibold text-xs"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: Order details & premium benefits */}
        <div className="md:col-span-5 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              Upgrade
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </h1>
            <p className="text-sm text-muted-foreground">
              Subscribe to unlock complete AI-powered career coach tools.
            </p>
          </div>

          <Card className="border border-white/5 bg-zinc-950/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
            <CardHeader className="border-b border-white/5 pb-4 bg-zinc-950/10">
              <CardTitle className="text-sm font-bold tracking-tight text-foreground uppercase">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-muted-foreground">Career Coach Premium</span>
                <span className="text-foreground">$19.00 / mo</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold border-t border-white/5 pt-4">
                <span className="text-muted-foreground font-bold">Total Due</span>
                <span className="text-primary font-extrabold text-lg">$19.00</span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
              What's Included
            </span>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Unlimited AI Mock Interviews & scoring analysis.</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Unlimited AI Cover Letters tailoring to job descriptions.</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Full access to AI Resume Improvement suggestions.</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Real-time salary range forecasts and market trend diagnostics.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Secure Card Payment Gateway form */}
        <div className="md:col-span-7">
          <Card className="border border-white/5 bg-zinc-950/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl relative">
            <CardHeader className="border-b border-white/5 pb-4 bg-zinc-950/20 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Card Payment
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  Enter credit card details to complete payment simulation.
                </CardDescription>
              </div>
              <div className="flex items-center gap-1 bg-zinc-900 border border-white/5 py-1 px-2.5 rounded-full text-[10px] text-muted-foreground font-semibold">
                <Lock className="h-3 w-3 text-emerald-400" />
                <span>Secure SSL Connection</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6 px-6 md:p-8">
              <form onSubmit={handleCheckoutSubmit} className="space-y-5">
                
                {/* Email (read-only) */}
                <div className="space-y-1.5">
                  <Label htmlFor="checkout-email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</Label>
                  <Input
                    id="checkout-email"
                    type="email"
                    value={user?.primaryEmailAddress?.emailAddress || ""}
                    disabled
                    className="rounded-xl border-white/5 bg-zinc-900/40 text-muted-foreground select-none"
                  />
                </div>

                {/* Name on Card */}
                <div className="space-y-1.5">
                  <Label htmlFor="card-name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name on Card</Label>
                  <Input
                    id="card-name"
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={nameOnCard}
                    onChange={(e) => setNameOnCard(e.target.value)}
                    className="rounded-xl border-white/5 bg-zinc-900/50"
                  />
                </div>

                {/* Card Number */}
                <div className="space-y-1.5">
                  <Label htmlFor="card-number" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Card Number</Label>
                  <div className="relative">
                    <Input
                      id="card-number"
                      type="text"
                      required
                      maxLength={19}
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      className="rounded-xl border-white/5 bg-zinc-900/50 pl-10"
                    />
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                {/* Expiry & CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="card-expiry" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Expiration Date</Label>
                    <Input
                      id="card-expiry"
                      type="text"
                      required
                      maxLength={5}
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      className="rounded-xl border-white/5 bg-zinc-900/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="card-cvc" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CVC / CVV</Label>
                    <Input
                      id="card-cvc"
                      type="password"
                      required
                      maxLength={3}
                      placeholder="•••"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, ""))}
                      className="rounded-xl border-white/5 bg-zinc-900/50"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isUpgrading}
                  className="w-full rounded-xl font-bold tracking-wide mt-2 h-11"
                >
                  {isUpgrading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Authorizing Payment...
                    </>
                  ) : (
                    "Authorize & Pay $19.00"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="bg-zinc-950/20 px-6 py-4 border-t border-white/5 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
              <Lock className="h-3.5 w-3.5 text-emerald-400" />
              <span>Complies with Standard PCI DSS Guidelines</span>
            </CardFooter>
          </Card>
        </div>

      </div>
    </div>
  );
}
