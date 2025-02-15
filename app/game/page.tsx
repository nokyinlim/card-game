"use client"

// This page creates many errors if opened with VSCode for iPad. They can be safely ignored

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

import { get_turn_color, get_turn_message, Character } from "../utils";

import Image from "next/image";
import StatBar from "@/components/StatBar";


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
  const [opponent, setOpponent] = useState<string[]>([]);

  // the enemyCharacters state needs to be implemented

  // A list of all the Characters in the game, in JSONified Character format
  const [characters, setCharacters] = useState<Character[]>([]);
  const [character, setCharacter] = useState<Character>();
  
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
  const [showTarget, setShowTarget] = useState<boolean>(false);

  // Stores the WebSocket reference used to connect to the backend and for live updates
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

      const this_game_code = gameCode;

      console.log("A message from the WebSocket has been received.")
      console.log(`The WebSocket has returned the following data: \ngame_code: ${parsed_data.game_code}\nplayers: ${parsed_data.players}\nerror: ${parsed_data.error}`)

      if (parsed_data.game_code != this_game_code && false) {
        console.log(`This WebSocket is not for this current game. WS Returned Code: ${parsed_data.game_code}; Current Code: ${this_game_code}`);
      } else {

        console.log("WebSocket message:", event.data);

        // This means there is a game update. The game state is updated and the player's options are updated.
        setTimeout(() => {
          updateGame(); // updateGame is slow and should not be relied on for real-time updates.
          getOptions(); // This only succeeds if this player is the current player. However, to avoid
        //                 edge cases, we get this regardless of whether the player is the current player or not.
        }, 1000)

        
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

        // if (parsed_data.type === "game_update" || parsed_data.type === "refresh") {
        // setTimeout(() => {
        //   updateGame();
        //   getOptions();
        // }, 1000)
        // }
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
    
    
    // This is a check to see if the game code is empty. If it is, the user is redirected to the home page. 
    // Unsure if the user should be prompted to enter a game code to rejoin or not.
    if (localStorage.getItem("game_code") === "") {
      console.log("Could not find a Game Code. Redirecting to Home Page.");
      router.push("/");
    }

    const temp_game_code: string = localStorage.getItem("game_code") || "";
    if (temp_game_code === "") {
      console.log("The Game Code was null!")
    }
    setGameCode(temp_game_code);

    // Gets the player ID from local storage and sets it to the player ID state.
    setPlayerID(localStorage.getItem("player_id") || "p2");

    // This is a check to see if the player ID is empty. If it is, the user is redirected to the home page.
    // Unsure if the user should be prompted to enter a player ID to rejoin or not.
    if (localStorage.getItem("player_id") === "") {
      console.log("Could not find a Player ID. Redirecting to Home Page.");
      router.push("/");
    }

    // These functions should be ran after a delay to allow loading first
    setTimeout(() => {
      // This function updates the game state with the most recent data from the server.
      updateGame();

      // This function gets the options for the player to perform actions.
      getOptions();
    }, 3000)

    // Connect to the websocket
    webSocketInit();
  }, []);

  // This function updates the game state with the most recent data from the server
  const updateGame = () => {
    const source = localStorage.getItem("source") || "localhost:8000";
    // This function sends a POST request to the server to get the game data.
    axios.post(`http://${source}/game-data`, {
        game_code: gameCode
    }).then((res: any) => {
        // Debug Purposes Only
        console.log(`Game Code is: ${gameCode}`);
        // This sets the turn count to the current turn count from the server.
        setTurnCount(res.data.current_turn[0]);

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
        });
        
        setCharacter(res.data.characters[thisIndex])
        
        setOpponent(opponents);
    }).catch((e: any) => {
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

  // test Toasting function

  const testToast = () => {
    toast({
      variant: "default",
      title: "Critical Hit!",
      description: "You attacked Electric-Mage for 25 damage!",
      duration: 5000,
    });
    toast({
      variant: "default",
      description: "Electric-Mage [Alice Smith] casted Electrostatic Charge on Armored Sentinel [Bob Smith] for 37.5 damage!",
      duration: 5000,
    });
    toast({
      variant: "destructive",
      description: "Armored Sentinel [Bob Smith] used Shield Bash on Ninja [You] for 27.5 earth damage!",
      duration: 5000
    });
  }

  const getOptions = async () => {
    const source = localStorage.getItem("source") || "localhost:8000";
    await axios.post(`http://${source}/turn-options`, {
        player_id: localStorage.getItem('player_id'),
        game_code: gameCode,
      }).then((res: any) => {
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
      }).catch((error: any) => {
        console.log("Error while fetching options:", error);
      });

    
  }

  const updateAndSetAction = (action: string) => {
    setAction(action);
    actionDetails.map((a: Action) => {
      if (a.name === actionNames[parseInt(action)]) {
        console.log(a);
        console.log(`Params: ${a.params}`)
        if (a.params.includes("Target")) {
          setShowTarget(true);
        } else {
          setShowTarget(false);
        }
      }
    })
  }

  const doPlayerAction = async (e: any) => {
    e.preventDefault();

    console.log("Preparing to update game due to response...")
    
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
    } finally {
      updateGame();
      getOptions();
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
                  You are {playerID}
                  <Label htmlFor="framework">Action</Label>
                  <Select onValueChange={updateAndSetAction}>
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

                  {showTarget ? <div>
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
                  : ""}
                </div>
                </form></CardContent> :
            <CardContent>
                You are {playerID}<br/>It is currently not your turn! Please Wait.
            </CardContent>
            }
            <CardFooter className="flex justify-between">
              <div className="flex-col gap-4">
                <Button onClick={doPlayerAction}>Confirm Action</Button><br/>
                <Button onClick={() => {updateGame(); getOptions();}}>Force Refresh</Button><br/>
              </div>
                Current Turn: {turnCount}<br/>
                Your Turn Index: {thisIndex}
            </CardFooter>
            <CardFooter className="justify-items-center">
            {showTarget ? characters.map((c: any, i: number) => {
              if (target === c.character_data.owner) {
                return (
                  <Card key={i} className={`flex-none w-64 border-blue-500 w-72`}>
                    <CardHeader>
                      <CardTitle>Targeted: {c.name}</CardTitle>
                      <CardDescription>Owned By {c.character_data.owner}</CardDescription>
                      <CardTitle>{c.base_stats.health}/{c.base_stats.max_health} HP</CardTitle>
                      <StatBar value={c.base_stats.health} max_value={c.base_stats.max_health} color="d61f1f"></StatBar>
                    </CardHeader>
                    <CardContent>
                      <Image alt={""} height={200} width={200} src={`/character_portraits/${c.name.replace(" ", "")}.png`}></Image>
                    </CardContent>
                    <CardFooter>
                      <div className="flex flex-col">
                        <h2><b>Character Details:</b></h2>
                        <div className="grid grid-cols-1">
                          <p><b>Status Effects:</b></p>
                          {c.activeEffects.keys().length > 0 ? c.activeEffects.map((ae: any) => {return (<p key={ae.name}>{ae.name}</p>)}) : <p>No Active Effects Applied</p>}
                  
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                )
              }
          }) : ""}
          </CardFooter>
            
            
          </Card>

          <div className="lg:w-3/5 lg:max-w-[600px] p-4">
            <div className="flex gap-4">
              
              {characters.map((c: any, i: number) => {
                const char_turn = playerIDs.indexOf(c.character_data.owner);
                const turns_until = -(turnCount - char_turn);
                console.log(`Character: ${c.name}`);
                if (playerIDs[i] === playerID) {
                  return (
                    <Card key={i} className={`flex-none w-96 ${get_turn_color(turns_until)}`}>
                      <CardHeader>
                        <CardTitle>{c.name} - {playerIDs[i] === playerID ? "You" : playerIDs[i]}</CardTitle>
                        <CardDescription>{c.base_stats.health}/{c.base_stats.max_health} HP</CardDescription>
                        <CardDescription>{get_turn_message(turns_until)}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Image alt={""} height={300} width={300} src={`/character_portraits/${c.name.replace(" ", "")}.png`}></Image>
                      </CardContent>
                      <CardFooter>
                        <div className="flex flex-col">
                          <h2><b>Your Stats:</b></h2>
                          <div className="grid grid-cols-2">
                            <p>SP: {c.base_stats.skill_points}/{c.base_stats.max_skill_points}</p>
                            <p>MP: {c.base_stats.mp}/{c.base_stats.max_mp}</p>
                            <p>ATK: {c.base_stats.attack_damage}</p>
                            <p>SPELL: {c.base_stats.spell_damage}</p>
                            <p>DEF: {c.base_stats.defense}</p>
                            <p>MAG DEF: {c.base_stats.magic_defense}</p>
                            <p>CRIT: {c.base_stats.critical_chance * 100}%</p>
                            <p>ACC: {c.base_stats.accuracy}</p>
                            <p>AGIL: {c.base_stats.agility}</p>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  )
                } 
              })}
              <div className="grid grid-cols-1 gap-4">
              <h2 className="text-center"><b>Upcoming Players</b></h2>
              {characters.sort((a: Character, b: Character) => {
                // Not ideal, but to save time
                // @ts-ignore
                const char_turn_a = a.character_data.owner;
                const turns_until_a = -(turnCount - char_turn_a);
                // @ts-ignore
                const turns_until_b = -(turnCount - b.character_data.owner)
                return turns_until_a - turns_until_b;
              }).map((c: any, i: number) => {
                const char_turn = playerIDs.indexOf(c.character_data.owner);
                const turns_until = -(turnCount - char_turn);
                const this_char = character || {team: ""}
                const char_team = this_char.team === c.team ? "Ally" : "Enemy"
                if (!(playerIDs[i] === playerID)) {
                  return (
                    <Card key={i} className={`flex-none w-64 ${get_turn_color(turns_until)}`}>
                      <CardHeader>
                        <CardTitle>{c.name} - {get_turn_message(turns_until)}</CardTitle>
                        <CardDescription>Owned By {playerIDs[i] === playerID ? "You" : `${playerIDs[i]} [${char_team}]`}</CardDescription>
                        <CardTitle>{c.base_stats.health}/{c.base_stats.max_health} HP</CardTitle>
                        <StatBar value={c.base_stats.health} max_value={c.base_stats.max_health} color="d61f1f"></StatBar>
                      </CardHeader>
                      <CardContent>
                        <Image alt={""} height={200} width={200} src={`/character_portraits/${c.name.replace(" ", "")}.png`}></Image>
                      </CardContent>
                      <CardFooter>
                        <div className="flex flex-col">
                          <h2><b>Character Details:</b></h2>
                          <div className="grid grid-cols-1">
                            <p><b>Status Effects:</b></p>
                            {c.activeEffects.keys().length > 0 ? c.activeEffects.map((ae: any) => {return (<p key={ae.name}>{ae.name}</p>)}) : <p>No Active Effects Applied</p>}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button>More Details</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>
                                  More Details: {`${c.name} [${playerIDs[i]} - ${char_team}]`} 
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                {get_turn_message(turns_until)}
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                  <div>
                                  <p><b>Status Effects:</b></p>
                                  {c.activeEffects.keys().length > 0 ? c.activeEffects.map((ae: any) => {return (<p key={ae.name}>{ae.name}</p>)}) : <p>No Active Effects Applied</p>}
                                  <br/>
                                  <p><b>Applied Effects:</b></p>
                                  {c.effects.keys().length > 0 ? c.effects.map((e: any) => {
                                    const stat_display = `${e.stat.charAt(0).toUpperCase() + String(e.stat).slice(1)} ${e.modifier_type === "add" ? "+" : "x"}${e.modifier_type === "multiply_base" ? String((e.value + 1)) : e.value}`;
                                    <p><b>{e.displayName}</b>: {stat_display}[{e.duration >= 9999 ? "Infinite" : e.duration} turns left]</p>
                                  }) : <p>No Applied Effects</p>}<br/>
                                  <p><b>Turn-Based Active Modifiers</b></p>
                                  <p>These modifiers apply at the end of each turn. When the Modifier expires, the stat is not restored.</p>
                                  {c.active_modifiers.keys().length > 0 ? c.effects.map((e: any) => {
                                    const stat_display: string = `${e.stat.charAt(0).toUpperCase() + String(e.stat).slice(1)} ${e.modifier_type === "add" ? "+" : "x"}${e.modifier_type === "multiply_base" ? String((e.value + 1)) : e.value}`;
                                    <p><b>{e.displayName}</b>: {stat_display}[]</p>
                                  }) : <p>No Active Modifiers Applied</p>}
                                  </div>
                                <AlertDialogAction>Close</AlertDialogAction>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  )
                }
                })}
                </div>
            </div>


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
              <p>Characters: {JSON.stringify(characters.map((c: any) => {return c.name}))}</p>
              <p>Action Details: {JSON.stringify(actionDetails)}</p>
            </div>
            <Button onClick={testToast}>Test Toast</Button>
            <Button onClick={() => {
              updateGame();
              getOptions();
            }}>Manual Refresh</Button>
          </div>
        </div>
    )
}