"use client"
import { useEffect, useRef, useState } from "react";
import { Action } from "../utils";
import { useRouter } from "next/router";
import axios from "axios";

export default function Game() {

  const router = useRouter();

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

  // The target for the action. Unsure if this is preferred over a Dictionary matching param to value.
  const [target, setTarget] = useState("");
  const wsRef = useRef<WebSocket | null>(null);

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

  useEffect(() => {
    const source = localStorage.getItem("source") || "localhost:8000";
    // Initialize WebSocket connection
    const ws = new WebSocket(`ws://${source}/game-ws`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      // A message is received from the WebSocket. This message is then set to the event state.
      console.log("WebSocket message:", event.data);

      // This means there is a game update. The game state is updated and the player's options are updated.
      
      // updateGame(); // updateGame is slow and should not be relied on for real-time updates.
      getOptions(); // This only succeeds if this player is the current player. However, to avoid
      // edge cases, we get this regardless of whether the player is the current player or not.

      setEvent(event.data);
      /** 
       * Example format of event.data:
       * {
       * "type": "game_update",
       * "game_code": "1234",
       * "player_id": "p1",
       * "data": {}
       * "current_turn": 1,
       * "players": ["p1", "p2"],
       * "characters": []
       * "error": false
       * }
       * 
       * event.data is a JSON string. It needs to be parsed to be used.
       */

      const parsed_data = JSON.parse(event.data);

      if (parsed_data.error === true) {
        console.error("Error:", parsed_data.data);
        return;
      }

      
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


  
  var index = 0;

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

        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Left Column - Action Input */}
          <div className="lg:w-2/5 p-4 bg-gray-100">
            <h2 className="text-xl font-bold mb-4">Actions</h2>
            <form onSubmit={doPlayerAction}>
              <div className="mb-4">
                <label className="block mb-2">Select Action:</label>
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {actionNames.map((name, index) => (
                    <option key={index} value={index}>{name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Target:</label>
                <select
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {opponent.map((id, index) => (
                    <option key={index} value={id}>{id}</option>
                  ))}
                </select>
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Submit Action
              </button>
            </form>
          </div>

          {/* Right Column - Game State */}
          <div className="lg:w-3/5 p-4">
            <h2 className="text-xl font-bold mb-4">Game State</h2>
            <div className="mb-4">
              <p>Game Code: {gameCode}</p>
              <p>Turn: {turnCount}</p>
              <p>Player ID: {playerID}</p>
              <p>Last Event: {event}</p>
            </div>
          </div>
        </div>
    )
}