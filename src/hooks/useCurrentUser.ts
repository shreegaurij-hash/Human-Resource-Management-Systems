import { useEffect, useState } from 'react';

export function useCurrentUser() {
  const [user, setUser] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const data = localStorage.getItem('currentUser');
    if (data) {
      try {
        setUser(JSON.parse(data));
      } catch(e) {}
    }
    setIsLoaded(true);
  }, []);
  
  return { user, isLoaded };
}
