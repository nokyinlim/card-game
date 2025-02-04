"use client"
// import { auth } from "@/auth";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
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
import { Action } from "../utils";




export default function NewGame() {
  const { data: session, status } = useSession();
  const [playerID, setPlayerID] = useState("");
  const [action, setAction] = useState("0");
  const [gameCode, setGameCode] = useState("");
  
  const [actionParams, setActionParams] = useState({});
  const [possibleCharacters, setPossibleCharacters] = useState([]);
  const [turnCount, setTurnCount] = useState(0);
  const [playerIDs, setPlayerIDs] = useState([]);
  const [opponent, setOpponent] = useState("");
  const [characters, setCharacters] = useState([]);
  const [thisIndex, setThisIndex] = useState(0);
  const [actionNames, setActionNames] = useState([]);
  const [actionDetails, setActionDetails] = useState<Action[]>([]);
  const [event, setEvent] = useState("");
  const wsRef = useRef<WebSocket | null>(null);


  const updateGame = () => {
    setGameCode(localStorage.getItem("game_code") || "");
    setPlayerID(localStorage.getItem("player_id") || "p2");
    axios.post(`http://localhost:8000/game-data`, {
        game_code: localStorage.getItem('game_code') || ""
    }).then((res) => {
        console.log(res.data)
        console.log("game data");

        console.log(`current turn: ${res.data.current_turn[0]}`)
        setTurnCount(res.data.current_turn[0])

        setPlayerIDs(res.data.players);

        setCharacters(res.data.characters);

        console.log(`all IDs: ${res.data.players}`)
        console.log(`Your ID: ${playerID}`)
        res.data.players.map((p: any) => {
            if (p === playerID) {
                setThisIndex(index);
            } else {
              setOpponent(res.data.players[index])
            }
            index++;
        })
    }).catch((e) => {
        console.log(`Error: ${e}`);
    });
  }

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket("ws://localhost:8000/game-ws");
    wsRef.current = ws;

    ws.onmessage = (event) => {
      setEvent(event.data);
      updateGame();
    };

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8000/get-all-characters').then((res) => {
        console.log(res.data)
        setPossibleCharacters(res.data)
        setGameCode(localStorage.getItem("game_code") || "");
        setPlayerID(localStorage.getItem("player_id") || "p2");
    }).catch((e) => {
        console.log(`Error: ${e}`);
    });
    

  }, [])
  var index = 0;
  
  useEffect(() => {
    updateGame();
  }, [])

  const testAction = async (e: any) => {
    e.preventDefault();

    const response = await axios.post('http://localhost:8000/action', {
        action: "attack",
        player_id: localStorage.getItem('player_id'),
        game_code: gameCode,
        params: {
            target: "p2"
        },
      }).then(() => {
        updateGame()
      });

    
  }

  const getOptions = async (e: any) => {
    e.preventDefault();

    await axios.post('http://localhost:8000/turn-options', {
        player_id: localStorage.getItem('player_id'),
        game_code: gameCode,
      }).then((res) => {
        console.log(res.data)
        
        
        // actions = res.data

        
        const actions = res.data.map((option: any) => {
          if (option.type == "spell") {
            return `Spell: ${option.name}`
          } else if (option.type == "ability") {
            return `Ability: ${option.name}`
          } else {
            return (option.name)
          }
          
        })

        const actionDetails = res.data.map((option: any) => {
          return option
        })
        setActionDetails(actionDetails)
        setActionNames(actions);
      });

    
  }

  const doPlayerAction = async (e: any) => {
    e.preventDefault();
    
    if (!wsRef.current) {
      console.error("WebSocket connection not established");
      return;
    }

    try {
      const selectedAction = actionDetails[parseInt(action)];
      if (selectedAction) {
        wsRef.current.send(`{
          "action": "${selectedAction.name}", 
          "game_code": "${gameCode}", 
          "player_id": "${playerID}",
          "params": {
            "target": "${opponent}",
            "targets": ["${opponent}"]
          }
        }`);
      }
    } catch (error) {
      console.error("WebSocket send error:", error);
    }
  };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">

        
        <Card className="w-[350px] h-[600px]">
        <CardHeader>
        <CardTitle>{gameCode ? `Game: ${gameCode}` : "No Game Code"}</CardTitle>
            <CardDescription>Invite friends using the above game code</CardDescription>
        </CardHeader>
        <form>
        {turnCount === thisIndex ? 
        <CardContent>
            <div className="grid w-full items-center gap-4">
            {/* <div className="flex flex-col space-y-1.5">
                <Label htmlFor="action">Action</Label>
                <Input id="action" placeholder="attack" onChange={(e) => setAction(e.target.value)} />
            </div> */}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Action</Label>
              <Select onValueChange={setAction}>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="No Action Selected" />
                </SelectTrigger>
  
  
                <SelectContent position="popper">
                  {actionDetails.map((a: Action, i) => {
                    return (
                        <SelectItem value={i.toString()} key={a.name}>{a.name}</SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>Your Current Action is: {action ? action : "No Action"}<br/>
            </div>
            
            <button onClick={testAction}>Submit Turn</button>
        </CardContent> :
        <CardContent>
          NOT CURRENT TURN
            
        </CardContent>
        }
        <CardFooter className="flex justify-between">
            <Button onClick={doPlayerAction}>Confirm Action</Button><br/>
            Current Turn: {turnCount}<br></br>
            Your Turn Index: {thisIndex}
        </CardFooter>
        </form>
        
        </Card>
        <button onClick={updateGame}>Update</button>
        
        <br></br><button onClick={testAction}>Test Action</button><br/>
        <button onClick={getOptions}>Test Get Options</button>

        </main>
    );
  
}