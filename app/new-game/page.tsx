"use client"
// import { auth } from "@/auth";
import { useState, useEffect } from "react";
// import { Clipboard as ClipboardCopy, ClipboardCheck as CompletedClipboardCopy } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
// import { redirect } from "next/navigation";

export default function NewGame() {

  const [characterID, setCharacterID] = useState("guardian");
  const [playerID, setPlayerID] = useState("Bob");
  const [generatedGameData, setGeneratedGameData] = useState({});
  const [generatedGameCode, setGeneratedGameCode] = useState("");
  const [didGenerateGame, setDidGenerateGame] = useState(false);
  const [possibleCharacters, setPossibleCharacters] = useState([]);
  const [didCopyGameCode, setDidCopyGameCode] = useState(false);
  const [username, setUsername] = useState("");
  

  useEffect(() => {
    axios.get('http://localhost:8000/get-all-characters').then((res) => {
        console.log(res.data)
        setPossibleCharacters(res.data)
    }).catch((e) => {
        console.log(`Error: ${e}`);
    });

    setUsername(localStorage.getItem("username") ?? "");
  }, [])
  

  const getCharacter = async (e: { preventDefault: () => void; }) => {
    e.preventDefault(); // Prevent form submission default behavior
    
    try {
      const response = await axios.post('http://localhost:8000/get-character/', {
        characterID: characterID
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const createGame = async (e: { preventDefault: () => void; }) => {
    e.preventDefault(); // Prevent form submission default behavior
    
    try {
      const response = await axios.post('http://localhost:8000/generate-code', {
        character_id: characterID,
        player_id: playerID,
      });
      console.log(response.data);
      console.log(`Game Code: ${response.data.game_code}`)
      localStorage.setItem("game_code", response.data.game_code)
      localStorage.setItem("player_id", playerID)


      
      setGeneratedGameData(response.data)
      setGeneratedGameCode(response.data.game_code)
      setDidGenerateGame(true);

      // redirect('/game')
    } catch (error) {
      console.error('Error:', error);
    }
  }
  if (didGenerateGame) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
  
      
      <Card className="w-[350px] h-[330px]">
        <CardHeader>
          <CardTitle>Game Created!</CardTitle>
          <CardDescription>Invite friends using the game code:</CardDescription>
          <CardTitle>{generatedGameCode}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Player ID / Username</Label>
              <Input id="name" placeholder="Bobby" onChange={(e) => setPlayerID(e.target.value)} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Character</Label>
              <Select onValueChange={setCharacterID}>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select Your Character" />
                </SelectTrigger>
  
  
                <SelectContent position="popper">
                  {possibleCharacters.map((c) => {
                    return (
                        <SelectItem value={c} key={c}>{c}</SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {/* <Button variant="outline" type="reset" className="transform transition ease-in-out hover:scale-110 active:scale-105">Clear</Button> */}
          <a href="/game">
          <Button className="transform transition ease-in-out hover:scale-110 active:scale-105">Start Game</Button>
          </a>
        </CardFooter>
        
      </Card>
  
  
  
      </main>
    );
  } else {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
  
      
      <Card className="w-[350px] h-[450px]">
        <CardHeader>
          <CardTitle>Start A New Game</CardTitle>
          <CardDescription>Invite friends using the Game Code generated</CardDescription>
          <CardDescription>You will be the host of the game. Others will have to use your generated game code to join.</CardDescription>
          <CardDescription>Having an even number of players is recommended, but not necessary. Minimum of 2 players to start.</CardDescription>
        </CardHeader>
        
        <form onSubmit={createGame}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            {username ? <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Hosting Game as {username}</Label>
            </div> : ''}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Player ID / Username</Label>
              <Input id="name" placeholder="Bobby" onChange={(e) => setPlayerID(e.target.value)} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Character</Label>
              <Select onValueChange={setCharacterID}>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select Your Character" />
                </SelectTrigger>
  
  
                <SelectContent position="popper">
                  {possibleCharacters.map((c) => {
                    return (
                        <SelectItem value={c} key={c}>{c}</SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="reset">Clear</Button>
          <Button type="submit">Start Game</Button>
        </CardFooter>
        </form>
        
      </Card>
      </main>
    );
  }
  
}