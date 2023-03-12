import React, { useEffect } from 'react'
import Paperbase from './components/Paperbase'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Content from './components/Content'
import MissionsPage from './components/MissionsPage'
import PostprocessingPage from './components/PostprocessingPage'
import { io } from 'socket.io-client'
import axios from 'axios'
import { SOCKET_EVENTS } from '../../server/EventService'

function App() {
    useEffect(() => {
        
        const socket = io('ws://localhost:3000', {
            reconnectionDelayMax: 10000,
            auth: {
                token: '123',
            },
            query: {
                'my-key': 'my-value',
            },
        })

        socket.on('connect', () => {
            console.log('Connected to socket!')
            // axios.get('/test-socket').then((res) => console.log(res))
        })

        // socket.on('test', (data) => {
        //     console.log('Received data from socket!')
        //     console.log(data)
        // })

        socket.on(SOCKET_EVENTS.METRICS_UPDATE, (data) => {
            console.log('Received new metrics file!')
            console.log(data)
        })

        socket.on(SOCKET_EVENTS.MISSION_COMPLETE, ()=>{
            console.log("Mission has completed")
        })

        socket.on(SOCKET_EVENTS.FILE_CHANGE, (data)=>{
            console.log("File change")
            console.log(data)
        })

        socket.on('error', () => {
            console.log('Socket error')
        })
    }, [])



    return (
        <BrowserRouter>
            <Paperbase>
                <Routes>
                    <Route path="/" element={<Content />} />
                    <Route path="/missions" element={<MissionsPage />} />
                    <Route
                        path="/postprocessing"
                        element={<PostprocessingPage />}
                    />
                </Routes>
            </Paperbase>
        </BrowserRouter>
    )
}

export default App
