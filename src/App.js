import { useState } from 'react'
import VideoPlayer from './components/videoPlayer'
import Options from './components/options'
import Notifications from './components/notifications'
import './App.css'




function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='container' >
      
      <h1>video chat app</h1>
      <VideoPlayer>
        
      <Notifications/>

        </VideoPlayer>
      <Options/>
      
        
        
    </div>

  )
}

export default App
