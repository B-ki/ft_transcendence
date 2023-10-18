import { SearchParamsOption } from 'ky';
import { useQuery } from 'react-query';

import api from '@/utils/api';

type RequestType = 'post' | 'get' | 'delete' | 'patch';

interface RequestArgsType {
  data?: object;
  params?: SearchParamsOption;
  options?: object;
}

export function useApi() {

  const make_request = (
    type: RequestType,
    label: string,
    endpoint: string,
    args?: RequestArgsType,
  ) => {
  
    if (endpoint.startsWith('/')) endpoint = endpoint.slice(1);

    const method = (() => {
      switch (type) {
        case 'post':
          return api.post;
        case 'get':
          return api.get;
        case 'delete':
          return api.delete;
        case 'patch':
          return api.patch;
        default:
          return api.get;
      }
    })();

    return useQuery(
      label,
      async () => {
        try {
        const response = await method(endpoint, {
          json: args?.data,
          searchParams: args?.params,
          ...args?.options,
        });
        return response.json();
      }
      catch(err) {}
      },
    );
  };

  const post = (label: string, endpoint: string, args?: RequestArgsType) =>
    make_request('post', label, endpoint, args);
  const get = (label: string, endpoint: string, args?: RequestArgsType) =>
    make_request('get', label, endpoint, args);
  const del = (label: string, endpoint: string, args?: RequestArgsType) =>
    make_request('delete', label, endpoint, args);
  const patch = (label: string, endpoint: string, args?: RequestArgsType) =>
    make_request('patch', label, endpoint, args);
  return { post, get, del, patch };
}
