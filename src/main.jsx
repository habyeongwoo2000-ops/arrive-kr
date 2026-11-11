import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import './toss.css';   // 토스 색감 · 여백 (styles.css 를 덮어씀)
import { applySavedView } from './components/ViewToggle.jsx';

applySavedView(); // 휴대폰에서 "PC로 보기"를 골라 두었으면 먼저 적용

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
