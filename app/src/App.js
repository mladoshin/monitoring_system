import React, { useState } from 'react'
import Paperbase from './components/Paperbase'
import styles from "./styles/App.module.css"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Content from './components/Content';

function App() {
  const [counter, setCounter] = useState(0)

  return (
    <BrowserRouter>
      <Paperbase>
        <Routes>
          <Route path="/" element={<Content/>} />
          <Route path="/missions" element={<h1>Hello</h1>} />
        </Routes>
      </Paperbase>
    </BrowserRouter>
  )
}

export default App

