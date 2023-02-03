import React, { useState } from 'react'
import Paperbase from './components/Paperbase'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Content from './components/Content';
import MissionsPage from './components/MissionsPage';

function App() {
  const [counter, setCounter] = useState(0)
  
  return (
    <BrowserRouter>
      <Paperbase>
        <Routes>
          <Route path="/" element={<Content/>} />
          <Route path="/missions" element={<MissionsPage/>} />
        </Routes>
      </Paperbase>
    </BrowserRouter>
  )
}

export default App

