"use client"
import { useEffect, useRef, useState } from "react";
import { Action } from "../utils";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";


export default function Game() {
  // Set up constants
  const router = useRouter();
  const { toast, dismiss } = useToast();

  // The player ID for this player
  const [playerID, setPlayerID] = useState<string>("");

  // The action index, as a string, to be performed by the player
  const [action, setAction] = useState<string>("0");

  // The game code for the current game
  const [gameCode, setGameCode] = useState<string>("");

  // The turn count for the current game
  const [turnCount, setTurnCount] = useState<number>(0);

  // The player IDs for all players in the current game, in a list.
  const [playerIDs, setPlayerIDs] = useState<string[]>([]);
  // The index of the current player in the player IDs list
  const [thisIndex, setThisIndex] = useState<number>(0);

  // A list of the opponent player IDs (not in the player's team)
  const [opponent, setOpponent] = useState<string[]>([""]);

  // the enemyCharacters state needs to be implemented

  // A list of all the Characters in the game, in JSONified Character format
  const [characters, setCharacters] = useState([]);
  
  // A list of all the action's names that the player can perform
  const [actionNames, setActionNames] = useState<string[]>([]);

  // A list of all the action's details that the player can perform
  // This is just the list of the actions from the get_character_actions function.
  // Format: [{name: "action_name", type: str in ["action", "base", "spell", "ability"], "params": <List[str]>[param1, param2, ...]}, ...]
  const [actionDetails, setActionDetails] = useState<Action[]>([]);

  // Most recent event message from the websocket
  const [event, setEvent] = useState("");

  const [alertTitle, setAlertTitle] = useState("");
  const [alertDescription, setAlertDescription] = useState("");
  const [alertIsOpen, setAlertIsOpen] = useState(false);

  const [toastMessageIDs, setToastMessageIDs] = useState<string[]>([])

  const [gameMessages, setGameMessages] = useState<string[]>([]);

  // The target for the action. Unsure if this is preferred over a Dictionary matching param to value.
  const [target, setTarget] = useState("");
  const wsRef = useRef<WebSocket | null>(null);

  // This function controls the websocket. 
  // The WebSocket is used to send and receive messages from the server.
  // This is used to update the game state and get the player's options.
  // This is also used to send the player's actions to the server.
  // When messages are received, the message is shown as appropriate, using a Toast or the player console log.
  const webSocketInit = () => {
    const source = localStorage.getItem("source") || "localhost:8000";
    // Initialize WebSocket connection
    const ws = new WebSocket(`ws://${source}/game-ws`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      // A message is received from the WebSocket. This message is then set to the event state.
      const parsed_data = JSON.parse(event.data);

      if (parsed_data.game_code != gameCode) {
        console.log(`This WebSocket is not for this current game. WS Returned Code: ${parsed_data.game_code}; Current Code: ${gameCode}`);
      } else {

        console.log("WebSocket message:", event.data);

        // This means there is a game update. The game state is updated and the player's options are updated.
        
        updateGame(); // updateGame is slow and should not be relied on for real-time updates.
        getOptions(); // This only succeeds if this player is the current player. However, to avoid
        // edge cases, we get this regardless of whether the player is the current player or not.

        setEvent(event.data);
        /** 
         * Example format of event.data: (parsed)
         * {
         * "type": "game_update",
         * "game_code": "1234",
         * "player_id": "p1",
         * "data": {}
         * "current_turn": 1,
         * "players": ["p1", "p2"],
         * "characters": [{...}, {...}],
         * "messages": "Player p1 has joined the game",
         * "error": false
         * }
         * 
         * event.data is a JSON string. It needs to be parsed to be used.
         * 
         * Types:
         * "game_update": This is a game update. The game state is updated.
         * "refresh": Forces a refresh, due to a large change in the game state.
         * "error": An error has occurred. Nothing else occured.
         * "message": A message is sent to the player. No change to game state.
         * 
         */

        

        if (parsed_data.error === true) {
          console.log("Error:", parsed_data.data);
          parsed_data.messages.map((m: string) => {
            showUserToast(m, true);
          });
          
          return;
        } else {
          // add the messages to the gameMessages state

          let gm = gameMessages;
          gm.push(parsed_data.messages);
          setGameMessages(gm);

          parsed_data.messages.map((m: string) => {
            toastMessageIDs.map((id: string) => {
              dismiss(id);
            });
            let toast = showUserToast(m, false);
            setToastMessageIDs([...toastMessageIDs, toast.id]);
          });
        }

        if (parsed_data.type === "game_update" || parsed_data.type === "refresh") {
          updateGame();
          getOptions();
        }
      }


      
    };

    ws.onopen = () => {
      console.log("WebSocket connected");
      updateGame();
      getOptions();
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");

      // Show a dialog box to the user. Option to try reconnecting.

      setAlertTitle("Disconnected from Server");
      setAlertDescription("You have been disconnected from the server. Please try reconnecting.");
      setAlertIsOpen(true);
    };

    return () => {
      ws.close();
    };
  };

  // First, data needs to be gotten from local storage. This should mean short disconnects should not affect the game.

  useEffect(() => {

    // Gets the game code from local storage and sets it to the game code state.
    setGameCode(localStorage.getItem("game_code") || "");
    
    // This is a check to see if the game code is empty. If it is, the user is redirected to the home page. 
    // Unsure if the user should be prompted to enter a game code to rejoin or not.
    if (localStorage.getItem("game_code") === "") {
      console.log("Could not find a Game Code. Redirecting to Home Page.");
      router.push("/");
    }

    // Gets the player ID from local storage and sets it to the player ID state.
    setPlayerID(localStorage.getItem("player_id") || "p2");

    // This is a check to see if the player ID is empty. If it is, the user is redirected to the home page.
    // Unsure if the user should be prompted to enter a player ID to rejoin or not.
    if (localStorage.getItem("player_id") === "") {
      console.log("Could not find a Player ID. Redirecting to Home Page.");
      router.push("/");
    }

    // This function updates the game state with the most recent data from the server.
    updateGame();

    // This function gets the options for the player to perform actions.
    getOptions();

    // Connect to the websocket
    webSocketInit();
  }, []);

  // This function updates the game state with the most recent data from the server
  const updateGame = () => {
    const source = localStorage.getItem("source") || "localhost:8000";
    // This function sends a POST request to the server to get the game data.
    axios.post(`http://${source}/game-data`, {
        game_code: gameCode
    }).then((res) => {
        // This sets the turn count to the current turn count from the server.
        setTurnCount(res.data.current_turn[0])

        // While this is stored in local storage, there is a server-side check to ensure that this player is indeed the correct player.
        // This is to prevent cheating.

        // This sets the player IDs to the list of player IDs from the server
        setPlayerIDs(res.data.players);

        // This sets the characters to the list of characters from the server
        setCharacters(res.data.characters);

        let index: number = 0;

        // This sets the current player's index, and the opponents.
        let opponents: string[] = [];
        res.data.players.map((p: any) => {
            if (p === playerID) {
                setThisIndex(index);
            } else {
              opponents.push(p);
            }
            index++;
        })
        
        
        setOpponent(opponents);
    }).catch((e) => {
        // This means that the Game Code entered is invalid.
        // The Game Code should be removed from storage and the user should be redirected to the home page.
        // This has yet to be implemented.
        console.log(`Error: ${e}`);
    });
  }

  // This function shows an error toast with the message provided.
  // This is used to show errors to the player.
  const showUserToast = (message: string, isError: boolean, title: string = "") => {
    let toastItem = null;
    if (isError) {
      toastItem = toast({
        variant: "destructive",
        title: title || "Uh oh! Something went wrong.",
        description: message,
        duration: 5000,
      });
    } else {
      if (title) {
        toastItem = toast({
          variant: "default",
          title: title,
          description: message,
        });
      } else {
        toastItem = toast({
          variant: "default",
          description: message
        })
      }
    }
    return toastItem;
  }



  const getOptions = async () => {
    const source = localStorage.getItem("source") || "localhost:8000";
    await axios.post(`http://${source}/turn-options`, {
        player_id: localStorage.getItem('player_id'),
        game_code: gameCode,
      }).then((res) => {
        console.log(res.data)
        
        if (!res.data) {
          console.log("No options found")
          return;
        }
        
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
      }).catch((error) => {
        console.log("Error while fetching options:", error);
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
        console.log("Send data to WebSocket");
        wsRef.current.send(`{
          "type": "${selectedAction.type}",
          "name": "${selectedAction.name}", 
          "game_code": "${gameCode}", 
          "player_id": "${playerID}",
          "params": {
            "target": "${target}",
            "targets": ["${target}"]
          }
        }`);
      }
    } catch (error) {
      console.error("WebSocket send error:", error);
    }
  };

    return (
        // Two Columns: Left Column: 40% width, Right Column: 60% width
        // Left Side is for inputting your action. Right side is for the game.

        // This alert dialog for when the WebSocket disconnects.
        

        <div className="flex flex-col lg:flex-row min-h-screen m-8">

          <AlertDialog open={alertIsOpen}>
            <AlertDialogTrigger/>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{alertTitle}</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription>
                {alertDescription}
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  Exit Game
                </AlertDialogCancel>
                <AlertDialogAction onClick={() => {
                  setAlertIsOpen(false);
                  webSocketInit();
                }}>
                  Reconnect
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Card className="w-[350px] h-[600px]">
            <CardHeader>
            <CardTitle>{gameCode ? `Game: ${gameCode}` : "No Game Code"}</CardTitle>
              <CardDescription>Invite friends using the above game code</CardDescription>
            </CardHeader>
            
            {turnCount === thisIndex ? 
            <CardContent><form>
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

                  {actionDetails.map((a: Action, i) => {
                    if (a.name === actionNames[parseInt(action)]) {
                      console.log(a);
                      if (a.params.includes("Target")) {
                      return (
                        <div key={a.name}>
                          <Label htmlFor="target">Target</Label>
                          <Select onValueChange={setTarget}>
                            <SelectTrigger id="target">
                              <SelectValue placeholder="No Target Selected" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              {playerIDs.map((p: string) => {
                                if (p !== playerID) {
                                  return (
                                    <SelectItem value={p} key={p}>{p}</SelectItem>
                                  )
                                }
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                      )
                      }
                    }
                  })}
                </div>
                </form></CardContent> :
            <CardContent>
                
            </CardContent>
            }
            <CardFooter className="flex justify-between">
                <Button onClick={doPlayerAction}>Confirm Action</Button><br/>
                Current Turn: {turnCount}<br></br>
                Your Turn Index: {thisIndex}
            </CardFooter>
            
            
            </Card>
          <div className="lg:w-3/5 lg:max-w-[600px] p-4">
            <h2 className="text-xl font-bold mb-4">Debug</h2>
            <div className="mb-4">
              {gameMessages.map((m: string, i: number) => {
                return (
                  <p key={i}>{m}</p>
                )
              })}
            </div>
            <div className="mb-4">
              <p>Game Code: {gameCode}</p>
              <p>Turn: {turnCount}</p>
              <p>Player ID: {playerID}</p>
              <p>Last Event: {event}</p>
              <p>Player IDs: {playerIDs.join(", ")}</p>
              <p>Opponent IDs: {opponent.join(", ")}</p>
              <p>Action Names: {actionNames.join(", ")}</p>
              <p>Target: {target}</p>
              <p>Characters: {JSON.stringify(characters)}</p>
              <p>Action Details: {JSON.stringify(actionDetails)}</p>
            </div>
            <Button onClick={() => {
              updateGame();
              getOptions();
            }}>Manual Refresh</Button>
          </div>
        </div>
    )
}