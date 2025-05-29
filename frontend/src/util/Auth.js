import {redirect} from 'react-router-dom';

export function getTokenDuration() {
  const storedExpirationDate = localStorage.getItem('expiration');
  if (!storedExpirationDate) {
    return 0;
  }
  const expirationDate = new Date(storedExpirationDate);
  const now = new Date();
  return expirationDate.getTime() - now.getTime();
}

export function getAuthToken() {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }
  const tokenDuration = getTokenDuration();
  if (tokenDuration <= 0) {
    return null;
  }
  return token;
}

export function tokenLoader() {
  return getAuthToken();
}

export function checkAuthLoader() {
  const token = getAuthToken();

  if (!token) {
    return redirect('/auth');
  }
}