import { ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  logout,
  selectCurrentUser,
  TUser,
  useCurrentToken,
} from '../../redux/features/auth/authSlice';
import { Navigate } from 'react-router-dom';
import { verifyToken } from '../../utils/verifyToken';

type TProtectedRoue = {
  children: ReactNode;
  role: string | undefined;
};

const ProtectedRoute = ({ children, role }: TProtectedRoue) => {
  const token = useAppSelector(useCurrentToken);

  let user;

  if (token) {
    user = verifyToken(token);
  }

  const dispatch = useAppDispatch();

  console.log(role);

  if (role !== undefined && role !== (user as TUser)?.role) {
    dispatch(logout());

    return <Navigate to="/login" replace={true} />;
  }

  if (!token) {
    return <Navigate to="/login" replace={true} />;
  }

  return children;
};

export default ProtectedRoute;
