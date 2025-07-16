"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Code, Github, Rocket, Zap, Globe, Server, Check } from "lucide-react"

import { Button } from "@/components/ui/button"

// Company logos for the marquee
const companies = [
  { name: "Acme Inc", logo: "/placeholder.svg?height=40&width=120" },
  { name: "Globex", logo: "/placeholder.svg?height=40&width=120" },
  { name: "Stark Industries", logo: "/placeholder.svg?height=40&width=120" },
  { name: "Wayne Enterprises", logo: "/placeholder.svg?height=40&width=120" },
  { name: "Umbrella Corp", logo: "/placeholder.svg?height=40&width=120" },
  { name: "Cyberdyne Systems", logo: "/placeholder.svg?height=40&width=120" },
  { name: "Oscorp", logo: "/placeholder.svg?height=40&width=120" },
  { name: "Massive Dynamic", logo: "/placeholder.svg?height=40&width=120" },
  { name: "Hooli", logo: "/placeholder.svg?height=40&width=120" },
  { name: "Pied Piper", logo: "/placeholder.svg?height=40&width=120" },
]

// Pricing plans
const pricingPlans = [
  {
    name: "Hobby",
    price: "$0",
    description: "Perfect for personal projects and experiments",
    features: ["Up to 3 projects", "1 team member", "Basic analytics", "Manual deployments", "Community support"],
    cta: "Start for Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For professionals and small teams",
    features: [
      "Unlimited projects",
      "Up to 5 team members",
      "Advanced analytics",
      "Automatic deployments",
      "Custom domains",
      "Priority support",
    ],
    cta: "Start 14-Day Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For large teams and organizations",
    features: [
      "Unlimited projects",
      "Unlimited team members",
      "Enterprise-grade analytics",
      "Automatic deployments",
      "Custom domains",
      "SSO Authentication",
      "Dedicated support",
      "SLA guarantees",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export default function Home() {
  // Refs for scroll targets
  const featuresRef = useRef<HTMLElement>(null)
  const pricingRef = useRef<HTMLElement>(null)
  const docsRef = useRef<HTMLElement>(null)

  // Function to handle smooth scrolling
  const scrollToSection = (elementRef: React.RefObject<HTMLElement>) => {
    if (elementRef.current) {
      window.scrollTo({
        top: elementRef.current.offsetTop - 80, // Offset for header
        behavior: "smooth",
      })
    }
  }

  // Add scroll animation for elements
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in")
          }
        })
      },
      { threshold: 0.1 },
    )

    const animatedElements = document.querySelectorAll(".animate-on-scroll")
    animatedElements.forEach((el) => observer.observe(el))

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:20px_20px]"></div>
        <div className="absolute h-[40rem] w-[40rem] -translate-y-1/2 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-3xl filter animate-blob"></div>
        <div className="absolute right-0 top-0 h-[30rem] w-[30rem] translate-x-1/3 -translate-y-1/4 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 blur-3xl filter animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-0 h-[35rem] w-[35rem] translate-y-1/4 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-3xl filter animate-blob animation-delay-4000"></div>
      </div>

      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-purple-600 animate-pulse" />
            <span className="text-xl font-bold">DeployHub</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection(featuresRef)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection(pricingRef)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection(docsRef)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Documentation
            </button>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm" className="rounded-full px-4 transition-all hover:shadow-md">
                Login
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="sm"
                className="rounded-full px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all hover:shadow-md"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-purple-100 text-purple-900 group-hover:bg-primary/80 w-fit animate-fade-in">
                  <span className="mr-1">✨</span> Seamless Deployment Platform
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent animate-gradient">
                    Deploy your code with confidence
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Ship your projects faster with our seamless GitHub integration and instant deployments.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/login">
                    <Button
                      size="sm"
                      className="gap-2 rounded-full px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all hover:shadow-md"
                    >
                      Get Started <ArrowRight className="h-4 w-4 animate-bounce-x" />
                    </Button>
                  </Link>
                  <button onClick={() => scrollToSection(docsRef)}>
                    <Button size="sm" variant="outline" className="rounded-full px-6 transition-all hover:shadow-md">
                      Read Documentation
                    </Button>
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-full overflow-hidden rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 p-1 shadow-2xl transition-all hover:shadow-purple-500/10 animate-float">
                  <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
                  <div className="relative h-full w-full rounded-lg bg-black/80 p-6 text-white">
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span>Deployment successful</span>
                    </div>
                    <div className="mt-4 font-mono text-xs">
                      <p>$ git push deployhub main</p>
                      <p className="mt-2 animate-typing overflow-hidden whitespace-nowrap">→ Analyzing repository...</p>
                      <p className="animate-typing animation-delay-500 overflow-hidden whitespace-nowrap">
                        → Building project...
                      </p>
                      <p className="animate-typing animation-delay-1000 overflow-hidden whitespace-nowrap">
                        → Optimizing assets...
                      </p>
                      <p className="animate-typing animation-delay-1500 overflow-hidden whitespace-nowrap">
                        → Deploying to production...
                      </p>
                      <p className="text-green-400 animate-typing animation-delay-2000 overflow-hidden whitespace-nowrap">
                        ✓ Deployment complete!
                      </p>
                      <p className="mt-4 text-blue-400 animate-typing animation-delay-2500 overflow-hidden whitespace-nowrap">
                        🚀 Your project is live at: https://your-project.deployhub.app
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted by companies section with auto-scrolling logos */}
        <section className="w-full py-12 border-y bg-white/50 backdrop-blur-sm">
          <div className="container px-4 md:px-6 text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tighter">Trusted by innovative teams worldwide</h2>
            <p className="mt-2 text-muted-foreground">
              Join thousands of companies deploying millions of projects with DeployHub
            </p>
          </div>

          <div className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-16 before:bg-gradient-to-r before:from-white before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-16 after:bg-gradient-to-l after:from-white after:to-transparent">
            {/* First row - moves left to right */}
            <div className="flex animate-marquee-infinite space-x-16 py-3">
              {companies.map((company, index) => (
                <div key={`company-1-${index}`} className="flex items-center justify-center">
                  <div className="flex h-16 w-40 items-center justify-center rounded-lg bg-white/80 p-4 shadow-sm">
                    <Image
                      src={company.logo || "/placeholder.svg"}
                      alt={company.name}
                      width={120}
                      height={40}
                      className="max-h-8 w-auto object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Second row - moves right to left */}
            <div className="flex animate-marquee-infinite-reverse space-x-16 py-3">
              {[...companies].reverse().map((company, index) => (
                <div key={`company-2-${index}`} className="flex items-center justify-center">
                  <div className="flex h-16 w-40 items-center justify-center rounded-lg bg-white/80 p-4 shadow-sm">
                    <Image
                      src={company.logo || "/placeholder.svg"}
                      alt={company.name}
                      width={120}
                      height={40}
                      className="max-h-8 w-auto object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="container px-4 md:px-6 mt-8">
            <div className="flex flex-wrap justify-center gap-4 text-center">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-purple-600">10,000+</span>
                <span className="text-sm text-muted-foreground">Projects Deployed</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-blue-600">5,000+</span>
                <span className="text-sm text-muted-foreground">Happy Developers</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-cyan-600">99.99%</span>
                <span className="text-sm text-muted-foreground">Uptime</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-purple-600">50ms</span>
                <span className="text-sm text-muted-foreground">Avg. Response Time</span>
              </div>
            </div>
          </div>
        </section>

        <section id="features" ref={featuresRef} className="w-full py-12 md:py-24 lg:py-32 relative animate-on-scroll">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/80 to-transparent -z-10"></div>
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-blue-100 text-blue-900 w-fit">
                <span className="mr-1">🚀</span> Powerful Features
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Powerful Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to deploy and manage your projects with ease
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-xl border p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="rounded-full bg-purple-100 p-3">
                  <Github className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold">GitHub Integration</h3>
                <p className="text-center text-muted-foreground">
                  Connect your GitHub repositories and deploy with a single click
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-xl border p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="rounded-full bg-blue-100 p-3">
                  <Zap className="h-8 w-8 text-blue-600 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold">Instant Deployments</h3>
                <p className="text-center text-muted-foreground">
                  Push to your repository and see your changes live in seconds
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-xl border p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="rounded-full bg-cyan-100 p-3">
                  <Code className="h-8 w-8 text-cyan-600" />
                </div>
                <h3 className="text-xl font-bold">Framework Agnostic</h3>
                <p className="text-center text-muted-foreground">
                  Support for all major frameworks and static site generators
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-purple-50 animate-on-scroll">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-cyan-100 text-cyan-900 w-fit">
                  <span className="mr-1">🌐</span> Global Edge Network
                </div>
                <h2 className="mt-4 text-3xl font-bold tracking-tighter sm:text-4xl">Deploy to the Edge</h2>
                <p className="mt-4 text-muted-foreground md:text-lg">
                  Your applications are deployed to our global edge network, ensuring fast load times for users anywhere
                  in the world.
                </p>
                <ul className="mt-6 grid gap-2">
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-green-100 p-1">
                      <svg
                        className="h-4 w-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Global CDN with 99.99% uptime</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-green-100 p-1">
                      <svg
                        className="h-4 w-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Automatic SSL certificates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-green-100 p-1">
                      <svg
                        className="h-4 w-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>DDoS protection included</span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-center">
                <div className="relative h-[300px] w-[300px] animate-float">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Globe className="h-32 w-32 text-purple-600/20" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
                    <div className="h-full w-full rounded-full border-2 border-dashed border-purple-200"></div>
                  </div>
                  {/* Connection lines */}
                  <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600 shadow-lg shadow-purple-600/50 animate-ping"></div>
                  {/* Server nodes */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <div
                      key={i}
                      className="absolute h-8 w-8 rounded-full bg-white shadow-lg flex items-center justify-center"
                      style={{
                        left: `calc(50% + ${Math.cos((angle * Math.PI) / 180) * 120}px)`,
                        top: `calc(50% + ${Math.sin((angle * Math.PI) / 180) * 120}px)`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <Server className="h-4 w-4 text-purple-600" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" ref={pricingRef} className="w-full py-12 md:py-24 lg:py-32 bg-white animate-on-scroll">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-purple-100 text-purple-900 w-fit">
                <span className="mr-1">💰</span> Simple Pricing
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Choose the perfect plan for your needs
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  No hidden fees. No surprises. Scale as you grow.
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`flex flex-col rounded-xl border p-6 shadow-sm transition-all hover:shadow-md ${
                    plan.popular ? "border-purple-200 relative" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-1 text-xs font-semibold text-white">
                      Most Popular
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <div className="mt-2 flex items-baseline">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  <ul className="mb-6 flex-1 space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Documentation Section */}
        <section
          id="docs"
          ref={docsRef}
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-purple-50 animate-on-scroll"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-blue-100 text-blue-900 w-fit">
                <span className="mr-1">📚</span> Documentation
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Comprehensive Documentation
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to get started and make the most of DeployHub
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2">
              <div className="flex flex-col space-y-2 rounded-xl border p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <h3 className="text-xl font-bold">Getting Started</h3>
                <p className="text-muted-foreground">Learn how to set up your first project in minutes</p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <ArrowRight className="h-4 w-4 text-purple-600" />
                    <span>Creating an account</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <ArrowRight className="h-4 w-4 text-purple-600" />
                    <span>Connecting your GitHub repository</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <ArrowRight className="h-4 w-4 text-purple-600" />
                    <span>Deploying your first project</span>
                  </li>
                </ul>
                <Button variant="outline" className="mt-4">
                  Read Guide
                </Button>
              </div>

              <div className="flex flex-col space-y-2 rounded-xl border p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <h3 className="text-xl font-bold">API Reference</h3>
                <p className="text-muted-foreground">Integrate DeployHub into your workflow with our API</p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <ArrowRight className="h-4 w-4 text-purple-600" />
                    <span>Authentication</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <ArrowRight className="h-4 w-4 text-purple-600" />
                    <span>Projects API</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <ArrowRight className="h-4 w-4 text-purple-600" />
                    <span>Deployments API</span>
                  </li>
                </ul>
                <Button variant="outline" className="mt-4">
                  View API Docs
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-purple-500 to-blue-600 text-white animate-on-scroll">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to transform your deployment workflow?
                </h2>
                <p className="mt-4 text-white/80 md:text-xl">
                  Join thousands of developers who have simplified their deployment process with DeployHub. Get started
                  for free today.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Link href="/login">
                    <Button
                      size="lg"
                      className="gap-2 rounded-full px-8 bg-white text-purple-600 hover:bg-white/90 transition-all hover:shadow-lg"
                    >
                      Start Deploying Now
                    </Button>
                  </Link>
                  <button onClick={() => scrollToSection(pricingRef)}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="gap-2 rounded-full px-8 border-white text-white hover:bg-white/10 transition-all"
                    >
                      View Pricing
                    </Button>
                  </button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -top-6 -left-6">
                  <div className="text-6xl font-bold opacity-10">01</div>
                </div>
                <div className="relative z-10 rounded-xl bg-white/10 p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-bold">Sign Up</h3>
                  <p className="mt-2 text-white/80">Create your account in seconds with GitHub authentication</p>
                </div>
                <div className="absolute -top-2 left-24">
                  <div className="text-6xl font-bold opacity-10">02</div>
                </div>
                <div className="relative z-10 ml-12 mt-6 rounded-xl bg-white/10 p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-bold">Connect Repository</h3>
                  <p className="mt-2 text-white/80">Link your GitHub repository with a single click</p>
                </div>
                <div className="absolute -top-6 left-48">
                  <div className="text-6xl font-bold opacity-10">03</div>
                </div>
                <div className="relative z-10 ml-24 mt-6 rounded-xl bg-white/10 p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-bold">Deploy</h3>
                  <p className="mt-2 text-white/80">Push your code and watch it go live in seconds</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 bg-gradient-to-t from-purple-50 to-white">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-purple-600" />
            <span className="text-lg font-semibold">DeployHub</span>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} DeployHub. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
