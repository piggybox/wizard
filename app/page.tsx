"use client"

import type React from "react"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import supabase from "@/lib/supabase"

// Define the steps in the wizard
const steps = [
  {
    id: "personal",
    name: "Personal Information",
    description: "Tell us about yourself",
  },
  {
    id: "company",
    name: "Company Details",
    description: "Tell us about your company",
  },
  {
    id: "role",
    name: "Role & Team",
    description: "What's your role and team size?",
  },
  {
    id: "goals",
    name: "Goals & Use Case",
    description: "How do you plan to use our product?",
  },
  {
    id: "complete",
    name: "Complete",
    description: "Review and complete your profile",
  },
]

// Define the form data structure
type FormData = {
  firstName: string
  lastName: string
  email: string
  companyName: string
  companyWebsite: string
  industry: string
  jobTitle: string
  teamSize: string
  primaryGoal: string
  useCase: string
}

export default function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    companyWebsite: "",
    industry: "",
    jobTitle: "",
    teamSize: "",
    primaryGoal: "",
    useCase: "",
  })

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Navigate to next step
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  // Check if current step is valid
  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Personal Information
        return formData.firstName && formData.lastName && formData.email
      case 1: // Company Details
        return formData.companyName && formData.industry
      case 2: // Role & Team
        return formData.jobTitle && formData.teamSize
      case 3: // Goals & Use Case
        return formData.primaryGoal
      default:
        return true
    }
  }

  // Handle form submission
  const handleSubmit = () => {
    console.log("Form submitted:", formData)
    // Here you would typically send the data to your backend
    alert("Onboarding complete! Thank you for signing up.")
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mx-auto max-w-3xl">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium",
                    currentStep > index
                      ? "border-primary bg-primary text-primary-foreground"
                      : currentStep === index
                        ? "border-primary text-primary"
                        : "border-muted-foreground/25 text-muted-foreground",
                  )}
                >
                  {currentStep > index ? <Check className="h-5 w-5" /> : index + 1}
                </div>
                <span
                  className={cn(
                    "mt-2 hidden text-xs font-medium md:block",
                    currentStep === index ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {step.name}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 overflow-hidden rounded-full bg-muted">
            <div
              className="h-2 bg-primary transition-all"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep].name}</CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john.doe@example.com"
                    required
                  />
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Acme Inc."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyWebsite">Company Website</Label>
                  <Input
                    id="companyWebsite"
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    placeholder="https://www.example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={formData.industry} onValueChange={(value) => handleSelectChange("industry", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    placeholder="Product Manager"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamSize">Team Size</Label>
                  <RadioGroup
                    value={formData.teamSize}
                    onValueChange={(value) => handleSelectChange("teamSize", value)}
                    className="grid grid-cols-2 gap-4 pt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1-10" id="team-1-10" />
                      <Label htmlFor="team-1-10">1-10 employees</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="11-50" id="team-11-50" />
                      <Label htmlFor="team-11-50">11-50 employees</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="51-200" id="team-51-200" />
                      <Label htmlFor="team-51-200">51-200 employees</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="201+" id="team-201" />
                      <Label htmlFor="team-201">201+ employees</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryGoal">Primary Goal</Label>
                  <Select
                    value={formData.primaryGoal}
                    onValueChange={(value) => handleSelectChange("primaryGoal", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your primary goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="increase_productivity">Increase Productivity</SelectItem>
                      <SelectItem value="reduce_costs">Reduce Costs</SelectItem>
                      <SelectItem value="improve_quality">Improve Quality</SelectItem>
                      <SelectItem value="expand_market">Expand Market Reach</SelectItem>
                      <SelectItem value="automate_processes">Automate Processes</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="useCase">How do you plan to use our product?</Label>
                  <Textarea
                    id="useCase"
                    name="useCase"
                    value={formData.useCase}
                    onChange={handleChange}
                    placeholder="Tell us about your specific use case..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Personal Information</h3>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span> {formData.firstName} {formData.lastName}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span> {formData.email}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Company Details</h3>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Company:</span> {formData.companyName}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Website:</span> {formData.companyWebsite}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Industry:</span> {formData.industry}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Role & Team</h3>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Job Title:</span> {formData.jobTitle}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Team Size:</span> {formData.teamSize}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Goals & Use Case</h3>
                  <div className="mt-2 space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Primary Goal:</span> {formData.primaryGoal}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Use Case:</span> {formData.useCase}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
              Previous
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button onClick={nextStep} disabled={!isStepValid()}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit}>Complete Setup</Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

