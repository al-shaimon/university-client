import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/v1',
    credentials: 'include', //WE MUST USE THIS TO GET COOKIES FROM THE SERVER BECAUSE BY DEFAULT FETCH API DOESN'T SEND COOKIES WE MUST HAVE TO ENABLE IT IN BACKEND ALSO PLEASE UPDATE CODE IN
    // [ app.use(cors({origin: 'http://localhost:5173', credentials: true})); ] IN BACKEND
  }),
  endpoints: () => ({}),
});
