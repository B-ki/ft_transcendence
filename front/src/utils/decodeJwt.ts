import jwt_decode from 'jwt-decode';

export const tokenIsValid = () => {
  const token = localStorage.getItem('token');
  const decodedToken = jwt_decode(token);
  console.log('Decoded Token', decodedToken);
  const currentDate = new Date();
  let result = false;

  if (decodedToken.exp * 1000 < currentDate.getTime()) {
    console.log('Token expired.');
  } else {
    console.log('Valid token');
    result = true;
  }
};
