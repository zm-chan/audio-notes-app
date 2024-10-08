import { useToast } from "@/hooks/use-toast";
import { isEqual } from "@/lib/utils";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// QUESTION: store tags as key, data and refetch function as value?
const remoteDataQueryInitialState = new Map();

const RemoteDataQueryContext = createContext();

export function RemoteDataQueryProvider({ children }) {
  const [remoteDataQuery, setRemoteDataQuery] = useState(
    remoteDataQueryInitialState,
  );

  function checkQueryTags({ tags }) {
    let hasTags = false;

    for (const [key, value] of remoteDataQuery) {
      if (isEqual(key, tags)) {
        hasTags = true;
        break;
      }
    }

    return hasTags;
  }

  const getQueryCache = useCallback(
    ({ tags }) => {
      let data = null;
      for (const [key, value] of remoteDataQuery) {
        if (isEqual(key, tags)) {
          data = value.data;
          break;
        }
      }

      return data;
    },
    [remoteDataQuery],
  );

  const setQueryCache = useCallback(({ tags, data, refetchFunction }) => {
    setRemoteDataQuery((prevRemoteData) => {
      const updatedRemoteData = new Map(prevRemoteData);

      // Check query Tags
      let hasTags = false;

      for (const [key, value] of updatedRemoteData) {
        if (isEqual(key, tags)) {
          hasTags = true;
          break;
        }
      }

      if (hasTags) {
        for (const [key, value] of updatedRemoteData) {
          if (isEqual(key, tags)) {
            updatedRemoteData.delete(key);
            updatedRemoteData.set(key, { data, refetchFunction });
            break;
          }
        }
      } else {
        updatedRemoteData.set(tags, { data, refetchFunction });
      }

      // console.log(updatedRemoteData);

      return updatedRemoteData;
    });
  }, []);

  function invalidateQueries({ queryKey: tags }) {
    // console.log("invalidate");
    // console.log(remoteDataQuery);
    for (const [key, value] of remoteDataQuery) {
      // For same specific key. Eg: single select keys
      if (key.length === tags.length) {
        // Why has nested "if"? Because I want those keys that have the same length to skip the general key check as well
        if (isEqual(key, tags)) {
          // console.log("specific");
          const { refetchFunction } = value;
          refetchFunction(true);
        }
      } else {
        // console.log("general");
        // For general keys
        key.forEach((keyItem) => {
          if (tags.some((tag) => isEqual(tag, keyItem))) {
            const { refetchFunction } = value;
            refetchFunction(true);
          }
        });
      }
    }
  }

  return (
    <RemoteDataQueryContext.Provider
      value={{
        checkQueryTags,
        getQueryCache,
        setQueryCache,
        invalidateQueries,
      }}
    >
      {children}
    </RemoteDataQueryContext.Provider>
  );
}

export function useBaseQuery({
  queryKey,
  queryFn,
  hasTags,
  currentCacheData,
  setQueryCache,
  enabled,
}) {
  const [isStartOperating, setIsStartOperating] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const [initialRun, setInitialRun] = useState(true);

  const queryKeyRef = useRef(queryKey);
  const queryFnRef = useRef(queryFn);

  const { toast } = useToast();

  useEffect(() => {
    async function remoteOperationFunction() {
      try {
        // console.log("start operating");
        // console.log(queryKeyRef.current);
        setIsStartOperating(true);
        setError("");

        if (hasTags && !refetch) {
          setData(currentCacheData);
          setQueryCache({
            tags: queryKeyRef.current,
            data: currentCacheData,
            refetchFunction: setRefetch,
          });
          return setIsStartOperating(false);
        }

        // console.log("fetching");
        const data = await queryFnRef.current();

        setData(data);
        setQueryCache({
          tags: queryKeyRef.current,
          data,
          refetchFunction: setRefetch,
        });
        setError("");
      } catch (error) {
        console.log(error);
        toast({ title: error.name, description: error.message });
        setError(error);
      } finally {
        setIsStartOperating(false);
        setRefetch(false);

        if (initialRun) {
          setInitialRun(false);
        }
      }
    }

    if (!enabled) {
      return;
    }

    if (initialRun) {
      remoteOperationFunction();
    }

    if (!initialRun && refetch) {
      remoteOperationFunction();
    }
  }, [
    refetch,
    initialRun,
    currentCacheData,
    hasTags,
    setQueryCache,
    enabled,
    toast,
  ]);

  return {
    data,
    isStartOperating,
    error,
  };
}

export function useQuery({ queryKey, queryFn, enabled = true }) {
  const context = useContext(RemoteDataQueryContext);

  if (context === undefined) {
    throw new Error("useQuery was used outside of RemoteDataQueryProvider");
  }

  const hasTags = context.checkQueryTags({ tags: queryKey });
  // console.log(hasTags);

  const currentCacheData = useMemo(() => {
    return context.getQueryCache({ tags: queryKey });
  }, [context, queryKey]);

  let { data, isStartOperating, error } = useBaseQuery({
    queryKey,
    queryFn,
    hasTags,
    currentCacheData,
    setQueryCache: context.setQueryCache,
    enabled,
  });

  //   console.log(data);
  // console.log(isStartOperating, data);

  let isLoading = false;

  // QUESTION: The reason why that's so many conditions is because these conditions will run before the fetching operation runs because the fetching operation is in useEffect hook

  // Never run, dependent query
  if (!isStartOperating && !data && !error && !enabled) {
    isLoading = false;
    // Initial loading
  } else if (!isStartOperating && !data && !error && enabled) {
    isLoading = true;
    // Loading and waiting for data
  } else if (isStartOperating && !data) {
    isLoading = true;
  } else if (!isStartOperating && data) {
    isLoading = false;
    // Loading done, no data, has error
  } else if (!isStartOperating && !data && error) {
    isLoading = false;
  }

  return { isLoading, error, data };
}

export function useMutation({ mutationFn, onSuccess, onError }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function mutate(
    { ...parameterObj } = {},
    { onSuccess: mutateSuccess, onError: mutateError } = {},
  ) {
    try {
      setIsLoading(true);
      setError("");

      await mutationFn(parameterObj);

      onSuccess && onSuccess();
      mutateSuccess && mutateSuccess();
    } catch (error) {
      console.log(error);
      setError(error);
      onError && onError(error);
      mutateError && mutateError(error);
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, error, mutate };
}

export function useQueryClient() {
  const context = useContext(RemoteDataQueryContext);

  if (context === undefined) {
    throw new Error(
      "useQueryClient was used outside of RemoteDataQueryProvider",
    );
  }

  return context;
}
