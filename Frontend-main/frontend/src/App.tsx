import { RouterProvider } from 'react-router-dom'
import { router } from './routes/router'
import {UserProvider} from "./contexts/UserContext.tsx";

function App() {

  return (
    <> <UserProvider>
        <div className="min-h-screen bg-page-bg max-h-screen bg-page-bg">
      <RouterProvider router={router} />
        </div>
    </UserProvider>
    </>
  )
}

export default App