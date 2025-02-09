"use client";

import { JSX, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ChevronLeft, ChevronRight, Monitor, X } from 'lucide-react';
import LinkConfirmation from './LinkConfirmation';

type CreditStep = {
  title: string;
  content: JSX.Element;
};

const CreditSteps: CreditStep[] = [
  {
    title: "Credits and Attributions",
    content: (
      <div className="flex flex-col items-center gap-4 text-center">
        <Monitor className="h-16 w-16 text-primary" />
        <h2 className="text-2xl font-bold">Credits and Attributions</h2>
        <p className="text-muted-foreground">
          List of resources and components used in the game.
        </p>
      </div>
    )
  },
  {
    title: "Credits and Attributions - Artwork",
    content: (
      <div className="flex flex-col items-center gap-4 text-center">
        <Monitor className="h-16 w-16 text-primary" />
        <h2 className="text-2xl font-bold">Character Artwork</h2>
        <p className="text-muted-foreground">
          All character art, portraits, and icons drawn and designed by Nok Yin Lim. Reference art used from various sources.
        </p>
        <h2 className="text-2xl font-bold">Ability & Spell Icons</h2>
        <p className="text-muted-foreground">
          Ability and Spell icon licensed from Freepik under Personal Use.
        </p>

      </div>
    )
  },
  {
    title: "Credits and Attributions - Audio",
    content: (
      <div className="flex flex-col items-center gap-4 text-center">
        <Monitor className="h-16 w-16 text-primary" />
        <h2 className="text-2xl font-bold">Audio</h2>
        <p className="text-muted-foreground">
          Background music licensed from <LinkConfirmation link_str="https://www.youtube.com/channel/UC4taeD5ajiihfQde-8FvyhQ"><span className="underline cursor-pointer">NoisePlug</span></LinkConfirmation> under Personal Use. 
        </p>
        <h2 className="text-2xl font-bold">Sound Effects</h2>
        <p className="text-muted-foreground">
          {/* Ability and Spell icon licensed from Freepik under Personal Use.  */}
        </p>

      </div>
    )
  },
  {
    title: "Credits and Attributions - Components",
    content: (
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-2xl font-bold">UI Components</h2>
        <p className="text-muted-foreground">
          The following UI components from <LinkConfirmation link_str="https://ui.shadcn.com"><span className='underline cursor-pointer'>shadcn</span></LinkConfirmation> were used:
          <ul className="list-disc text-left">
            <li>Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle</li>
            <li>Button</li>
            <li>AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger</li>
            <li>Toast, Toaster, useToast</li>

          </ul>
        </p>
        <p className="text-muted-foreground">
          The following icon libraries were used:
          <ul className="list-disc text-left">
            <li><LinkConfirmation link_str="https://lucide.dev/guide/packages/lucide-react">
            <span className='underline cursor-pointer'>Lucide React</span>
            </LinkConfirmation></li>
            <li><LinkConfirmation link_str="https://www.radix-ui.com">
              <span className='underline cursor-pointer'>Radix-UI</span>
            </LinkConfirmation></li>
          </ul>
        </p>

      </div>
    )
  },
];

export default function CreditPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('left');

  const handleNext = () => {
    setDirection('left');
    setCurrentStep(prev => Math.min(prev + 1, CreditSteps.length - 1));
  };

  const handleBack = () => {
    setDirection('right');
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const confirmSkip = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-200">
      <Card className="w-full max-w-2xl relative p-8">
        <div className="absolute top-4 right-4 z-50">
          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="hover:bg-gray-100">
                <X className="h-4 w-4 mr-2" />
                Leave
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Leave Credits?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to leave this page? You will be redirected to the main menu.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmSkip}>
                  Leave
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="relative h-96">
          <div
            className={`absolute inset-0`}
          >
            <div className="flex flex-col items-center justify-center h-full gap-8 px-4">
              <h1 className="text-3xl font-bold">
                {CreditSteps[currentStep].title}
              </h1>
              {CreditSteps[currentStep].content}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="transition-opacity"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: CreditSteps.length }).map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            disabled={currentStep === CreditSteps.length - 1}
          >
            {currentStep === CreditSteps.length - 1 ? 'Finish' : 'Next'}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
}