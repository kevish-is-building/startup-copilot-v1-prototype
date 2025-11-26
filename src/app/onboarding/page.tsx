"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, Rocket, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { saveProfile, saveAuthUser } from '@/lib/localStorage';
import { generateBlueprint, getSampleProfile } from '@/lib/mockApi';

const steps = ['Basics', 'Founders', 'Current State', 'Goals', 'Review'];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    // Basics
    companyName: '',
    industry: '',
    // Founders
    founderName: '',
    founderEmail: '',
    founderCount: 1,
    // Current State
    stage: '',
    currentState: '',
    fundingGoal: '',
    // Goals
    goals: [] as string[],
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const useSampleProfile = async () => {
    setLoading(true);
    const sample = await getSampleProfile();
    setFormData({
      companyName: sample.companyName,
      industry: sample.industry,
      founderName: 'John Doe',
      founderEmail: 'john@techflow.ai',
      founderCount: sample.founderCount,
      stage: sample.stage,
      currentState: sample.currentState,
      fundingGoal: sample.fundingGoal,
      goals: sample.goals,
    });
    setLoading(false);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.companyName && formData.industry;
      case 1:
        return formData.founderName && formData.founderEmail && formData.founderCount;
      case 2:
        return formData.stage && formData.currentState && formData.fundingGoal;
      case 3:
        return formData.goals.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Save user auth
    saveAuthUser({
      name: formData.founderName,
      email: formData.founderEmail,
    });

    // Save profile
    const profile = {
      id: `profile-${Date.now()}`,
      companyName: formData.companyName,
      industry: formData.industry,
      stage: formData.stage,
      founderCount: formData.founderCount,
      fundingGoal: formData.fundingGoal,
      currentState: formData.currentState,
      goals: formData.goals,
      createdAt: new Date().toISOString(),
    };
    saveProfile(profile);

    // Generate blueprint
    await generateBlueprint(profile);

    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <Rocket className="h-12 w-12 text-teal-600" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Welcome to Startup CoPilot</h1>
          <p className="text-gray-600">Let's build your personalized 90-day startup blueprint</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                      index <= currentStep
                        ? 'border-teal-600 bg-teal-600 text-white'
                        : 'border-gray-300 bg-white text-gray-400'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className={`mt-2 hidden text-xs sm:block ${
                    index <= currentStep ? 'text-teal-600 font-medium' : 'text-gray-400'
                  }`}>
                    {step}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 ${
                      index < currentStep ? 'bg-teal-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep]}</CardTitle>
            <CardDescription>
              {currentStep === 0 && 'Tell us about your company'}
              {currentStep === 1 && 'Information about the founding team'}
              {currentStep === 2 && 'Where are you in your startup journey?'}
              {currentStep === 3 && 'What are your primary goals for the next 90 days?'}
              {currentStep === 4 && 'Review and confirm your information'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 0: Basics */}
            {currentStep === 0 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    placeholder="e.g., TechFlow AI"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                    <SelectTrigger id="industry">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SaaS">SaaS</SelectItem>
                      <SelectItem value="E-commerce">E-commerce</SelectItem>
                      <SelectItem value="Fintech">Fintech</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="EdTech">EdTech</SelectItem>
                      <SelectItem value="Consumer">Consumer</SelectItem>
                      <SelectItem value="Enterprise">Enterprise</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Step 1: Founders */}
            {currentStep === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="founderName">Your Name *</Label>
                  <Input
                    id="founderName"
                    placeholder="e.g., John Doe"
                    value={formData.founderName}
                    onChange={(e) => handleInputChange('founderName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="founderEmail">Email *</Label>
                  <Input
                    id="founderEmail"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.founderEmail}
                    onChange={(e) => handleInputChange('founderEmail', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="founderCount">Number of Co-founders *</Label>
                  <Select 
                    value={formData.founderCount.toString()} 
                    onValueChange={(value) => handleInputChange('founderCount', parseInt(value))}
                  >
                    <SelectTrigger id="founderCount">
                      <SelectValue placeholder="Select number" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Solo Founder</SelectItem>
                      <SelectItem value="2">2 Founders</SelectItem>
                      <SelectItem value="3">3 Founders</SelectItem>
                      <SelectItem value="4">4+ Founders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Step 2: Current State */}
            {currentStep === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="stage">Stage *</Label>
                  <Select value={formData.stage} onValueChange={(value) => handleInputChange('stage', value)}>
                    <SelectTrigger id="stage">
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="idea">Idea / Concept</SelectItem>
                      <SelectItem value="prototype">Prototype</SelectItem>
                      <SelectItem value="mvp">MVP Built</SelectItem>
                      <SelectItem value="launched">Launched</SelectItem>
                      <SelectItem value="growth">Growth</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentState">Current State *</Label>
                  <Select value={formData.currentState} onValueChange={(value) => handleInputChange('currentState', value)}>
                    <SelectTrigger id="currentState">
                      <SelectValue placeholder="Select current state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concept">Just a concept</SelectItem>
                      <SelectItem value="validating">Validating idea</SelectItem>
                      <SelectItem value="building">Building product</SelectItem>
                      <SelectItem value="beta">In beta testing</SelectItem>
                      <SelectItem value="launched">Launched publicly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fundingGoal">Funding Goal *</Label>
                  <Select value={formData.fundingGoal} onValueChange={(value) => handleInputChange('fundingGoal', value)}>
                    <SelectTrigger id="fundingGoal">
                      <SelectValue placeholder="Select funding goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bootstrap">Bootstrap (no external funding)</SelectItem>
                      <SelectItem value="pre-seed">Pre-seed ($50K-500K)</SelectItem>
                      <SelectItem value="seed">Seed ($500K-2M)</SelectItem>
                      <SelectItem value="series-a">Series A ($2M+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Step 3: Goals */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Select all that apply</p>
                {[
                  { id: 'build_mvp', label: 'Build MVP' },
                  { id: 'raise_funding', label: 'Raise Funding' },
                  { id: 'get_first_customers', label: 'Get First Customers' },
                  { id: 'validate_idea', label: 'Validate Idea' },
                  { id: 'hire_team', label: 'Hire Team' },
                  { id: 'scale_operations', label: 'Scale Operations' },
                ].map((goal) => (
                  <div key={goal.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={goal.id}
                      checked={formData.goals.includes(goal.id)}
                      onCheckedChange={() => handleGoalToggle(goal.id)}
                    />
                    <Label
                      htmlFor={goal.id}
                      className="cursor-pointer text-sm font-normal"
                    >
                      {goal.label}
                    </Label>
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-3 font-semibold text-gray-900">Company Information</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Company Name:</dt>
                      <dd className="font-medium">{formData.companyName}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Industry:</dt>
                      <dd className="font-medium">{formData.industry}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Founder:</dt>
                      <dd className="font-medium">{formData.founderName}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Co-founders:</dt>
                      <dd className="font-medium">{formData.founderCount}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Stage:</dt>
                      <dd className="font-medium capitalize">{formData.stage}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Funding Goal:</dt>
                      <dd className="font-medium capitalize">{formData.fundingGoal}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Goals:</dt>
                      <dd className="font-medium">{formData.goals.length} selected</dd>
                    </div>
                  </dl>
                </div>
                <p className="text-sm text-gray-600">
                  We'll generate a personalized 90-day blueprint based on this information.
                </p>
              </div>
            )}

            {/* Sample Profile Button */}
            {currentStep === 0 && (
              <Button
                variant="outline"
                onClick={useSampleProfile}
                disabled={loading}
                className="w-full gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Use Sample Profile (Quick Demo)
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0 || loading}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          {currentStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed() || loading}
              className="gap-2 bg-teal-600 hover:bg-teal-700"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="gap-2 bg-teal-600 hover:bg-teal-700"
            >
              {loading ? 'Generating Blueprint...' : 'Complete Setup'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
