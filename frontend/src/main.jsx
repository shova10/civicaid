// while using django as backend
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { BrowserRouter } from 'react-router-dom'
// import './index.css'
// import App from './App.jsx'

// async function prepare() {
//   if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === 'true') {
//     const { worker } = await import('./mocks/browser')
//     await worker.start({ onUnhandledRequest: 'warn' })
//   }
// }

// prepare().then(() => {
//   createRoot(document.getElementById('root')).render(
//     <StrictMode>
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </StrictMode>
//   )
// })

// while using msw
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

async function prepare() {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === 'true') {
    const { worker } = await import('./mocks/browser')
    await worker.start({
      onUnhandledRequest(request, print) {
        if (!request.url.includes('/api/')) return
        print.warning()
      },
    })
  }
}

prepare().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  )
})
