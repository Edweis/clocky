/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useEffect } from 'react';

export default function useLoading<T, R extends Array<any>>(
  fn: (...args: R) => Promise<T>,
  initialLoadingState = false,
): [boolean, (...args: R) => Promise<T>] {
  const [loading, setLoading] = useState(initialLoadingState);
  const wrappedFunction = useCallback(
    (...args: R) => {
      setLoading(true);
      const call = fn(...args);
      return call
        .then((res) => {
          setLoading(false);
          return res;
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
          throw error;
        });
    },
    [fn],
  );
  return [loading, wrappedFunction];
}
