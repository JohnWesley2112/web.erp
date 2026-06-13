import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import store from './store/Store.ts'
import Spinner from './views/spinner/Spinner.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Suspense fallback={< Spinner />}>
        <App />
      </Suspense>
    </Provider>
  </StrictMode>,
)
