import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/Home/HomePage'
import { ChatroomPage } from './pages/Chatroom/ChatroomPage'

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path='/chatroom' element={<ChatroomPage />} />
        </Routes>
    )
}