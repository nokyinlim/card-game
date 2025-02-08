"use client";

import { JSX, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ChevronLeft, ChevronRight, ListPlus, Monitor, Move3D, X, ShieldHalf, RectangleVertical } from 'lucide-react';

import Image from 'next/image';

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
    title: "Character List - Guardian",
    content: (
      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
            <Image src="/character_portraits/Guardian.png" alt="Guardian" width={320} height={320} className="border-4 border-solid rounded-md border-orange-600 bg-orange-100" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Armored Sentinel</AlertDialogTitle>
                <AlertDialogDescription>
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col">
                  Class: <b>Knight</b><br/>
                  Element: <b>Fire</b><br/>
                  Base Health: 140<br/>
                  Base MP: 10<br/>
                  Base SP: 24<br/>
                  Base Defense: 30<br/>
                  Base Magic Defense: 5<br/>
                  Attack Damage: 45<br/>
                  Critical Hit Chance: 10%<br/>
                  Attack Accuracy: 60<br/>
                  Hit Evasion: 10<br/>
                  </div>
                <div>
                  <Image src="/character_portraits/Guardian.png" alt="Electric-Mage" width={240} height={240} className="border-4 border-solid rounded-md border-gray-600 bg-gray-100" />
                </div>
                </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction>
                  Close
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          </div>
        <div className="flex flex-col">
          <h3 className="font-semibold text-sm">Knight</h3>
          <p className="text-sm text-muted-foreground">
            The Knight is a defensive character that can protect allies and block enemy attacks.
          </p><br/>

          <h3 className="font-semibold text-sm">Unique Ability: Stun Bash (5)</h3>
          <span className="text-sm text-muted-foreground">Bashes a target with a shield, dealing moderate damage and chance to stun based on user's Defense.</span>
          <br/>
          <h3 className="font-semibold text-sm">Passive: Taunt</h3>
          <p className="text-sm text-muted-foreground">
            Chance to redirect enemy attacks to the Sentinel.
          </p><br/>
          <h3 className="font-semibold text-sm">Ability: Self-Defense (Skills: 8)</h3>
          <p className="text-sm text-muted-foreground">
            Greatly increases the Sentinel's defense and magic-defense for a short duration.
          </p><br/>
          <h3 className="font-semibold text-sm">Spell: Self-Healing (Mana: 5)</h3>
          <p className="text-sm text-muted-foreground">
            Heals the Sentinel for a small amount each turn, for 4 turns
          </p>
        </div>
      </div>
    )
  },
  {
    title: "Character List - Electric-Mage",
    content: (
        <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
            <Image src="/character_portraits/Electric-Mage.png" alt="Electric-Mage" width={320} height={320} className="border-4 border-solid rounded-md border-gray-600 bg-gray-100" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Electric-Mage</AlertDialogTitle>
                <AlertDialogDescription>
                <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col">
                Class: <b>Mage</b><br/>
                Element: <b>Electric</b><br/>
                Base Spell Damage: 30<br/>
                Base Health: 60<br/>
                Base MP: 30<br/>
                Base SP: 5<br/>
                Base Defense: 10<br/>
                Base Magic Defense: 15<br/>
                Attack Damage: 15<br/>
                Critical Hit Chance: 5%<br/>
                Attack Accuracy: 40<br/>
                Hit Evasion: 15<br/>
                </div>
                <div>
                <Image src="/character_portraits/Electric-Mage.png" alt="Electric-Mage" width={240} height={240} className="border-4 border-solid rounded-md border-gray-600 bg-gray-100" />
                </div>
                </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction>
                  Close
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>


          
        </div>
        <div className="flex flex-col text-left">
        <h3 className="font-semibold text-sm">Mage</h3>
          <p className="text-sm text-muted-foreground">
            The Mage is a heavily magic-based character specializing in the Magics.
          </p><br/>
          <h3 className="font-semibold text-sm">Unique Spell: Thunderstrike (10)</h3>
          <span className="text-sm text-muted-foreground">A thunderbolt deals major Thunder-type damage to 1 Target. Afterward, decreases defense and cannot cast spells for 1 turn.</span>
          <br/><h3 className="font-semibold text-sm">Passive: Double Insulation</h3>
          <p className="text-sm text-muted-foreground">
            Decreases Thunder-type damage taken from all sources.
          </p><br/>
          <h3 className="font-semibold text-sm">Ability: Electrostatic Charge (Skills: 5)</h3>
          <p className="text-sm text-muted-foreground">
            Increases the Mage's spell damage for the next 3 turns.
          </p><br/>
          <h3 className="font-semibold text-sm">Spell: Static Ignition (Mana: 6)</h3>
          <p className="text-sm text-muted-foreground">
          Deals minor thunder-type damage and ignites the enemy for 3 turns.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "Character List - Electric-Mage",
    content: (
        <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
            <Image src="/character_portraits/Ninja.png" alt="Electric-Mage" width={320} height={320} className="border-4 border-solid rounded-md border-gray-600 bg-gray-100" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Requiem of Shadows</AlertDialogTitle>
                <AlertDialogDescription>
                <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col">
                Class: <b>Ninja</b><br/>
                Element: <b>Shadow</b><br/>
                Base Spell Damage: 20<br/>
                Base Health: 80<br/>
                Base MP: 20<br/>
                Base SP: 30<br/>
                Base Defense: 15<br/>
                Base Magic Defense: 15<br/>
                Attack Damage: 15<br/>
                Critical Hit Chance: 30%<br/>
                Attack Accuracy: 70<br/>
                Hit Evasion: 25<br/>
                </div>
                <div>
                <Image src="/character_portraits/Ninja.png" alt="Electric-Mage" width={240} height={240} className="border-4 border-solid rounded-md border-gray-600 bg-gray-100" />
                </div>
                </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction>
                  Close
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>


          
        </div>
        <div className="flex flex-col text-left">
        <h3 className="font-semibold text-sm">Ninja</h3>
          <p className="text-sm text-muted-foreground">
            The Ninja is a stealthy character that can deal high damage and evade attacks.
          </p><br/>
          <h3 className="font-semibold text-sm">Unique Ability: Summon Clone (12)</h3>
          <span className="text-sm text-muted-foreground">Summons a weaker clone to fight for you until death or for 4 turns, whichever is longer</span>
          <br/><h3 className="font-semibold text-sm">Passive: Way of the Ninja</h3>
          <p className="text-sm text-muted-foreground">
            Increases critical hit chance against enemies with a status effect.
          </p><br/> 
          <h3 className="font-semibold text-sm">Ability: Precision Strike (4)</h3>
          <p className="text-sm text-muted-foreground">
            Ignores Defense power. Moderate shadow-type attack with a increased critical hit chance.
          </p><br/>
          <h3 className="font-semibold text-sm">Spell: Smoke Bomb (Mana: 5)</h3>
          <p className="text-sm text-muted-foreground">
          Increases all ally Evasion while decreasing Accuracy of all allies, except the Ninja.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "Character List",
    content: (
      <div className="flex flex-col items-center gap-4 text-center">
        <a href="/join"><div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center">
          <span className="text-2xl">🎮</span>
        </div></a>
        <h2 className="text-2xl font-bold">Let's Begin!</h2>
        <p className="text-muted-foreground">
          You can always revisit the tutorial from the menu. Good luck!
        </p>
      </div>
    )
  }
];

export default function CharacterList() {
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
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Leave Character List?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to leave this page? You can always revisit it later from the main menu.
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

        <div className="relative h-[500px]">
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