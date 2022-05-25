import ReactDOM from 'react-dom/client';
import App from './components/App';
import './index.css';

// Render DOM
ReactDOM
  .createRoot(document.getElementById('root') as HTMLElement)
  .render(<App />);