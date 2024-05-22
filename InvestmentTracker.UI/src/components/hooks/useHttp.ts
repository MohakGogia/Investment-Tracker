import { useState, useEffect } from 'react';
import { AxiosResponse } from 'axios';

interface FetchState<T> {
  isFetching: boolean;
  data: T | null;
  error: string | null;
}

export function useHttp<T>(apiFn: () => Promise<AxiosResponse<T>>, initialValue: T | null) {
  const [state, setState] = useState<FetchState<T>>({
    isFetching: false,
    data: initialValue,
    error: null,
  });

  useEffect(() => {
    const sendHttpCall = async () => {
      setState((prevState) => ({ ...prevState, isFetching: true }));
      try {
        const response = await apiFn();
        setState({ isFetching: false, data: response.data, error: null });
      } catch (error) {
        setState({ isFetching: false, data: null, error: 'Something went wrong' });
      }
    };

    sendHttpCall();
  }, [apiFn]);

  return {
    isFetching: state.isFetching,
    data: state.data,
    error: state.error,
  };
}
