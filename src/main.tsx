/**
 * @author MilesChen
 * @description main.tsx
 * @createDate 2023-01-15 13:26:05
 */

import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import store from './Redux/store'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <App />
  </Provider>
)
