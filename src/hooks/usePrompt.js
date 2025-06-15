// hooks/usePrompt.js
import { useContext, useEffect } from 'react';
import {
  useLocation,
  useNavigate,
  UNSAFE_NavigationContext as NavigationContext,
} from 'react-router-dom';

export function usePrompt(message, when) {
  const { navigator } = useContext(NavigationContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!when) return;

    const push = navigator.push;

    navigator.push = (...args) => {
      const result = window.confirm(message);
      if (result) {
        navigator.push = push;
        push(...args);
      }
    };

    return () => {
      navigator.push = push; // 원래대로 복원
    };
  }, [when, message, navigate, location, navigator]);
}
