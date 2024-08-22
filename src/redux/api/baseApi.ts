import {
  BaseQueryApi,
  BaseQueryFn,
  createApi,
  DefinitionType,
  FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { logout, setUser } from '../features/auth/authSlice';
import { toast } from 'sonner';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/api/v1',
  credentials: 'include', //WE MUST USE THIS TO GET COOKIES FROM THE SERVER BECAUSE BY DEFAULT FETCH API DOESN'T SEND COOKIES WE MUST HAVE TO ENABLE IT IN BACKEND ALSO PLEASE UPDATE CODE IN
  // [ app.use(cors({origin: 'http://localhost:5173', credentials: true})); ] IN BACKEND

  // We can use prepareHeaders to send accessToken with every request
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set('authorization', `${token}`);
    }

    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<FetchArgs, BaseQueryApi, DefinitionType> = async (
  args,
  api,
  extraOptions
): Promise<any> => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 404) {
    toast.error((result?.error?.data as { message?: string })?.message);
  }
  if (result?.error?.status === 403) {
    toast.error((result?.error?.data as { message?: string })?.message);
  }
  if (result?.error?.status === 401) {
    //* Send refresh token
    console.log('Sending refresh token');
    const res = await fetch('http://localhost:5000/api/v1/auth/refresh-token', {
      method: 'POST',
      credentials: 'include',
    });

    const data = await res.json();

    //* Sending new accessToken based on refresh token
    if (data?.data?.accessToken) {
      const user = (api.getState() as RootState).auth.user;

      api.dispatch(
        setUser({
          user,
          token: data.data.accessToken,
        })
      );

      //* Setting new accessToken in headers
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout()); //* Logout user if refresh token is expired
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ['semester', 'courses', 'offeredCourse'],
  endpoints: () => ({}),
});
