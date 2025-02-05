"use client";

import { JSX, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ChevronLeft, ChevronRight, ListPlus, Monitor, Move3D, X, BookOpenCheck } from 'lucide-react';

type TutorialStep = {
  title: string;
  content: JSX.Element;
};

const TutorialSteps: TutorialStep[] = [
  {
    title: "Welcome to the Tutorial!",
    content: (
      <div className="flex flex-col items-center gap-4 text-center">
        <Monitor className="h-16 w-16 text-primary" />
        <h2 className="text-2xl font-bold">Getting Started</h2>
        <p className="text-muted-foreground">
          Let's walk through the basics of the game. This tutorial will take a few minutes.
        </p>
      </div>
    )
  },
  {
    title: "Characters",
    content: (
      <div className="grid grid-cols-2 gap-8 text-center">
        <div className="flex flex-col items-center gap-2">
          <BookOpenCheck className="h-12 w-12 text-primary" />
          <h3 className="font-semibold">Select Your Character</h3>
          <p className="text-sm text-muted-foreground">
            You can select your character when joining a game.
          </p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <a href="/characters"><ListPlus className="h-12 w-12 text-primary" /></a>
          <h3 className="font-semibold">Preview Characters</h3>
          <p className="text-sm text-muted-foreground">
            Click the image above to see all Characters!
          </p>
        </div>
      </div>
    )
  },
  {
    title: "Movement",
    content: (
      <div className="flex flex-col items-center gap-4">
        <Move3D className="h-16 w-16 text-primary animate-bounce" />
        <p className="text-center text-muted-foreground">
          Use the movement keys to navigate through the environment.
          Avoid obstacles and find the optimal path to your objective.
        </p>
      </div>
    )
  },
  {
    title: "Ready to Play!",
    content: (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center">
          <span className="text-2xl">🎮</span>
        </div>
        <h2 className="text-2xl font-bold">Let's Begin!</h2>
        <p className="text-muted-foreground">
          You can always revisit the tutorial from the menu. Good luck!
        </p>
      </div>
    )
  }
];

export default function TutorialPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('left');

  const handleNext = () => {
    setDirection('left');
    setCurrentStep(prev => Math.min(prev + 1, TutorialSteps.length - 1));
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
                Skip Tutorial
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Skip Tutorial?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to skip the tutorial? You can always revisit it later from the main menu.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmSkip}>
                  Skip
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
                {TutorialSteps[currentStep].title}
              </h1>
              {TutorialSteps[currentStep].content}
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
            {Array.from({ length: TutorialSteps.length }).map((_, index) => (
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
            disabled={currentStep === TutorialSteps.length - 1}
          >
            {currentStep === TutorialSteps.length - 1 ? 'Finish' : 'Next'}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
}