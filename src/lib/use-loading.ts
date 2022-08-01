/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

export default function useLoading<T, R extends Array<any>>(
  fn: (...args: R) => Promise<T>,
  initialLoadingState = false,
): [boolean, (...args: R) => Promise<T>] {
  const [loading, setLoading] = useState(initialLoadingState);
  const wrappedFunction = (...args: R) => {
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
  };
  return [loading, wrappedFunction];
}

export const useLoadingEffect = (
  fn: () => Promise<any>,
  deps: React.DependencyList = [],
) => {
  const [loading, wrappedFn] = useLoading(fn, true);
  useEffect(() => {
    wrappedFn();
  }, deps);
  return loading;
};
