/**
 * Custom hook for handling async operations with loading, error, and data states.
 * Provides a clean interface for data fetching and error handling.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseAsyncState<T> {
  status: 'idle' | 'pending' | 'success' | 'error';
  data: T | null;
  error: Error | null;
}

interface UseAsyncOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  immediate?: boolean;
}

/**
 * Hook for managing async operations
 * @param asyncFunction - Async function to execute
 * @param immediate - Whether to execute immediately on mount (default: true)
 * @param onSuccess - Callback on success
 * @param onError - Callback on error
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const { onSuccess, onError, immediate = true } = options;
  const [state, setState] = useState<UseAsyncState<T>>({
    status: 'idle',
    data: null,
    error: null
  });

  const isMountedRef = useRef(true);

  const execute = useCallback(async () => {
    setState({ status: 'pending', data: null, error: null });

    try {
      const response = await asyncFunction();

      if (isMountedRef.current) {
        setState({ status: 'success', data: response, error: null });
        onSuccess?.();
      }

      return response;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));

      if (isMountedRef.current) {
        setState({ status: 'error', data: null, error: err });
        onError?.(err);
      }

      throw err;
    }
  }, [asyncFunction, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      void execute();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    isLoading: state.status === 'pending',
    isSuccess: state.status === 'success',
    isError: state.status === 'error'
  };
}
