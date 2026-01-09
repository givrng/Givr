import { useEffect } from 'react';

/**
 * Custom hook to lock the body scroll when the component mounts.
 * It also handles the common scrollbar shift issue.
 * * @param {boolean} isLocked - Whether the scroll should be locked.
 */
function useScrollLock(isLocked:boolean) {
  useEffect(() => {
    const body = document.body;
    
    // Check if scroll locking is requested
    if (isLocked) {
      // 1. Calculate the width of the vertical scrollbar
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // 2. Lock scroll via Tailwind CSS class
      body.classList.add('overflow-hidden');
      
      // 3. Add padding to the body to prevent content shift
      body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      // Unlock scroll (cleanup)
      body.classList.remove('overflow-hidden');
      body.style.paddingRight = ''; 
    }

    // Cleanup function: runs when the component unmounts or state changes
    return () => {
      body.classList.remove('overflow-hidden');
      body.style.paddingRight = '';
    };
  }, [isLocked]); // Re-run effect only if 'isLocked' changes
}

export default useScrollLock;