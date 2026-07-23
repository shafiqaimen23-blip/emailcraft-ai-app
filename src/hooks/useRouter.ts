import { useEffect, useState, useCallback } from 'react';

export type Route = 'home' | 'about' | 'contact';

function parseHash(): Route {
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  if (hash === 'about') return 'about';
  if (hash === 'contact') return 'contact';
  return 'home';
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(parseHash);

  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((to: Route) => {
    window.location.hash = `/${to === 'home' ? '' : to}`;
  }, []);

  return { route, navigate };
}

export function routeFromHash(): Route {
  return parseHash();
}
