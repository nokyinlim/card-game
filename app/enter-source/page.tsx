'use client'
import { useState } from "react"


export default function EnterSourcePage() {

    const [currentSource, setCurrentSource] = useState('')

    const setSource = () => {
        localStorage.setItem('source', currentSource)
    }

    return (
        <div>
            <h1>Enter Source</h1>
            <p>Choose a source to enter</p>
            <div>
                <input onChange={(e) => setCurrentSource(e.target.value)}></input>
                <button onClick={setSource}>Enter</button>
            </div>
        </div>
    )
}