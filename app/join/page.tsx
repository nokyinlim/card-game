"use client"
import { auth } from "@/auth";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function JoinGame() {
  const { data: session, status } = useSession();
  const [gameCode, setGameCode] = useState("");
  const [characterID, setCharacterID] = useState("guardian");
  const [playerID, setPlayerID] = useState("Bob");
  const [didJoinGame, setDidJoinGame] = useState(false);

  const [possibleCharacters, setPossibleCharacters] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/get-all-characters').then((res) => {
        console.log(res.data)
        setPossibleCharacters(res.data)
    }).catch((e) => {
        console.log(`Error while fetching characters: ${e}`);
    });
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

  const joinGame = async (e: { preventDefault: () => void; }) => {
    
    e.preventDefault(); // Prevent form submission default behavior
    
    try {
      const response = await axios.post('http://localhost:8000/join', {
        characterID: characterID,
        game_code: gameCode,
        player_id: playerID,
      });
      // console.log(response.data);
      console.log("player ID: " + playerID)
      localStorage.setItem("game_code", gameCode)
      localStorage.setItem("player_id", playerID)
      setDidJoinGame(true);

    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      
      <Card className="w-[350px] h-[400px]">
        <CardHeader>
          <CardTitle>{didJoinGame ? "Game Joined!" : "Join A Game"}</CardTitle>
          <CardDescription>
            {didJoinGame ? "Start the game using the link below:" : "Enter a generated game code to start!"}<br/>
          <span>
            {didJoinGame ? "" : "Don't have a game code?"} <a href={didJoinGame ? "/game" : "/new-game"}>Start {didJoinGame ? "" : "A"} Game</a>
          </span>
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={joinGame}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Player ID / Username</Label>
              <Input id="name" placeholder="Bobby" onChange={(e) => setPlayerID(e.target.value)} required/>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Game Code</Label>
              <Input id="name" placeholder="A1B2C3" onChange={(e) => setGameCode(e.target.value)} required/>
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
          {/* <Button variant="outline" type="reset">Clear</Button> */}
          <Button type="submit">Join Game</Button>
        </CardFooter>
        </form>
        
      </Card>
    </main>
  );
}