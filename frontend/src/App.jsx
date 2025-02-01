import { useState } from 'react'
import Map from './components/Map'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <Map />
      </div>
    </>
  )
}

export default App
