"use client";

import { JSX, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ChevronLeft, ChevronRight, ListPlus, Monitor, Move3D, X, ShieldHalf, RectangleVertical } from 'lucide-react';

type TutorialStep = {
  title: string;
  content: JSX.Element;
};

const TutorialSteps: TutorialStep[] = [
  {
    title: "Character List",
    content: (
      <div className="flex flex-col items-center gap-4 text-center">
        <Monitor className="h-16 w-16 text-primary" />
        <h2 className="text-2xl font-bold"></h2>
        <p className="text-muted-foreground">
          This guide will help you understand the game's Characters, their strengths and their Abilities.
        </p><br/>
        <h3 className="font-semibold">Info</h3>
        <p><b>SP (skill points)</b> are used to use <b>Abilities</b></p>
        <p><b>MP (mana points)</b> are used to cast <b>Spells</b></p>
        <p>Click on the <b>Icon</b> for a Character to view their detailed stats!</p>
      </div>
    )
  },
  {
    title: "Character List",
    content: (
      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
                <ShieldHalf className="h-12 w-12 text-primary" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Guardian</AlertDialogTitle>
                <AlertDialogDescription>
                Class: <b>Guardian</b><br/>
                Element: <b>Fire</b><br/>
                Base Health: 100<br/>
                Base MP: 20<br/>
                Base SP: 40<br/>
                Base Defense: 30<br/>
                Base Magic Defense: 5<br/>
                Attack Damage: 45<br/>
                Critical Hit Chance: 10%<br/>
                Attack Accuracy: 60<br/>
                Hit Evasion: 10<br/>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction>
                  Close
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <h3 className="font-semibold">Guardian</h3>
          <p className="text-sm text-muted-foreground">
            The Guardian is a defensive character that can protect allies and block enemy attacks.
          </p><br/>

          <h3 className="font-semibold">Featured Ability: Stun Bash (5)</h3>
          <span className="text-sm text-muted-foreground">Bashes a target with a shield, dealing moderate damage and chance to decrease enemy Defense.</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <h3 className="font-semibold">Passive: Taunt</h3>
          <p className="text-sm text-muted-foreground">
            Chance to redirect enemy attacks to the Guardian.
          </p><br/>
          <h3 className="font-semibold">Ability: Self-Defense (Skills: 8)</h3>
          <p className="text-sm text-muted-foreground">
            Increases the Guardian's defense and magic-defense for a short duration.
          </p><br/>
          <h3 className="font-semibold">Spell: Self-Healing (Mana: 5)</h3>
          <p className="text-sm text-muted-foreground">
            Heals the Guardian for a small amount each turn, for 4 turns
          </p>
        </div>
      </div>
    )
  },
  {
    title: "Character List",
    content: (
        <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
                <ShieldHalf className="h-12 w-12 text-primary" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Electric-Mage</AlertDialogTitle>
                <AlertDialogDescription>
                Class: <b>Mage</b><br/>
                Element: <b>Electric</b><br/>
                Base Spell Damage: 30<br/>
                Base Health: 60<br/>
                Base MP: 60<br/>
                Base SP: 5<br/>
                Base Defense: 10<br/>
                Base Magic Defense: 15<br/>
                Attack Damage: 15<br/>
                Critical Hit Chance: 5%<br/>
                Attack Accuracy: 40<br/>
                Hit Evasion: 15<br/>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction>
                  Close
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <h3 className="font-semibold">Electric-Mage</h3>
          <p className="text-sm text-muted-foreground">
            A Mage with the ability to cast Electric spells
          </p><br/>

          <h3 className="font-semibold">Featured Spell: Thunderstrike (10)</h3>
          <span className="text-sm text-muted-foreground">Unleashes a massive thunderbolt dealing major Thunder-type damage to 1 Target. Afterward, decreases own defense and can no longer cast spells for 1 turn.</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <h3 className="font-semibold">Passive: Double Insulation</h3>
          <p className="text-sm text-muted-foreground">
            Decreases Thunder-type damage taken from all sources.
          </p><br/>
          <h3 className="font-semibold">Ability: Electrostatic Charge (Skills: 5)</h3>
          <p className="text-sm text-muted-foreground">
            Increases the Mage's spell damage for the next 3 turns.
          </p><br/>
          <h3 className="font-semibold">Spell: Static Ignition (Mana: 5)</h3>
          <p className="text-sm text-muted-foreground">
          A spark of electricity deals minor Thunder-type damage that ignites the target, dealing True damage over time.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "Character List",
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