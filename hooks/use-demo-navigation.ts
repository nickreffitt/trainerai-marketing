import { useEffect } from 'react';

export function useDemoNavigation(page: 'summary' | 'chat' | 'workout' | 'goal' | 'weekly' | 'plan') {
  useEffect(() => {
    // Notify parent window of navigation
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'DEMO_NAVIGATION',
        page: page,
      }, window.location.origin);
    }
  }, [page]);
}
