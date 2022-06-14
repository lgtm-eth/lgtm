import _ from "lodash";
import { useQuery } from "react-query";

const API_BASE_URL =
  // prettier-ignore
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_DEV_API_BASE_URL :
      "/app/api";
const STORAGE_BASE_URL = process.env.REACT_APP_STORAGE_BASE_URL;

// These are the available API methods.
// e.g. useApi.getSource({...})
//      Api.getSource({...})
const apiMethods = {
  refreshAddressInfo: ({ address }) => {},
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
    useApiMethod(name, _Api[name], requestData, nonce)
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

function useApiMethod(name, method, request, nonce) {
  let { isLoading, isError, data, refetch } = useQuery(
    [name, request],
    () => method(request),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      staleTime: 30000,
    }
  );
  return {
    isLoading,
    isFailure: isError,
    response: data,
    reload: refetch,
  };
}

export function useAddressInfo({ address }) {
  let {
    isLoading,
    isError,
    data: info,
  } = useQuery(
    ["addressInfo", address],
    () =>
      fetch(`${STORAGE_BASE_URL}/address/${address}.json`).then(async (res) => {
        if (res.ok) {
          return res.json();
        }
        await Api.refreshAddressInfo({ address });
        throw new Error(`addressInfo unavailable, triggered refresh`);
      }),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );
  return { isLoading, isError, info };
}

export function useContractSource({ address }) {
  let {
    isLoading,
    isError,
    info: {
      contract: { source },
    },
  } = useAddressInfo({ address });
  return { isLoading, isError, source };
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
