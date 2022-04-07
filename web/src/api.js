import _ from "lodash";
import { useEffect, useReducer, useRef, useState } from "react";

const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001/lgtm-info-dev/us-central1/app/app/api"
    : "/app/api";

// These are the available API methods.
// e.g. useApi.getSource({...})
//      Api.getSource({...})
const apiMethods = {
  getSource: ({ address }) => {},
  // TODO: add more methods
  // TODO: add per-method configs
};

const _Api = _.mapValues(
  apiMethods,
  (method, name) => (requestData) =>
    rpc({ ...method, ...{ name } }, requestData)
);

const _UseApi = _.mapValues(
  apiMethods,
  (method, name) => (requestData, nonce) =>
    useApiMethod(_Api[name], requestData, nonce)
);

async function rpc(method, requestData) {
  let path = `/${method.name}`;
  let requestUrl = API_BASE_URL + path;
  let body = JSON.stringify(requestData);
  let response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      // TODO:
      // Authorization: `Bearer ${config.auth_token}`,
    },
    body,
  });
  if (!response.ok) {
    throw new Error(`Api ${method.name} Failed: ${response.statusText}`);
  }
  return response.json();
}

// This is like "useEffect" but it deeply compares dependencies.
//   e.g. we can compare the entire `request` to decide if it has changed.
function useDeepEffect(callback, dependencies) {
  let prev = useRef();
  if (!_.isEqual(prev.current, dependencies)) {
    prev.current = dependencies;
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useEffect(callback, prev.current);
}

function useApiReducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return {
        ...state,
        isLoading: true,
        isFailure: false,
        reload: action.reload,
      };
    case "FAILURE":
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        response: null,
        reload: action.reload,
      };
    case "SUCCESS":
      return {
        ...state,
        isLoading: false,
        isFailure: false,
        response: action.response,
        reload: action.reload,
      };
    default:
      throw new Error(`unexpected action ${action.type}`);
  }
}

function useApiMethod(method, request, nonce) {
  let [state, dispatch] = useReducer(useApiReducer, {
    isLoading: true,
    isFailure: false,
    response: null,
    // until the effect begins, .reload is a no-op
    reload: () => {},
  });

  // We track requested_at to allow us to later
  // invalidate the previous request when we want to reload.
  let [requestedAt, setRequestedAt] = useState(Date.now());
  useDeepEffect(() => {
    let wasCancelled = false;
    let reload = () => {
      wasCancelled = true;
      setRequestedAt(Date.now());
    };
    let execute = async () => {
      dispatch({ type: "LOADING", reload });
      try {
        let res = await method(request);
        if (!wasCancelled) {
          dispatch({ type: "SUCCESS", reload, response: res });
        }
      } catch (error) {
        if (!wasCancelled) {
          dispatch({ type: "FAILURE", reload });
        }
      }
    };
    execute().catch((ignore) => {});
    return () => {
      wasCancelled = true;
    };
  }, [
    request, // safe because of useDeepEffect
    requestedAt, // so reload just requires setting a new requested_at
    nonce, // so a non-request param change can trigger reload
  ]);
  return state;
}

/**
 * @typedef {function} ApiMethod
 * @param {Object} request
 * @returns Object
 */

/**
 * @type {{[name: string]: ApiMethod}}
 */
export const Api = _Api;

/**
 * @typedef {Object} ApiHookResponse
 * @property {boolean} isLoading
 * @property {boolean} isFailure
 * @property {Object} response
 * @property {function} reload
 */

/**
 * @typedef {function} ApiHookMethod
 * @param {Object} request
 * @returns ApiHookResponse
 */

/**
 * @type {{[name: string]: ApiHookMethod}}
 */
export const useApi = _UseApi;
