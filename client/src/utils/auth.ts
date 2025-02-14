import { JwtPayload, jwtDecode } from 'jwt-decode';

class AuthService {
  getProfile() {
    // TODO: return the decoded token
      const token = this.getToken();
      if (!token) return null;
      try {
        return jwtDecode<JwtPayload>(token);  // Decode the token properly
      } catch (error) {
        console.error('Invalid token', error);
        return null;
      }
  }

  loggedIn() {
    // TODO: return a value that indicates if the user is logged in
    const token = localStorage.getItem('id_token');
    return !!token && !this.isTokenExpired(token);
  }
  
  isTokenExpired(token: string) {
    // TODO: return a value that indicates if the token is expired
    try {
      const decoded: JwtPayload = jwtDecode(token);  
      const currentTime = Math.floor(Date.now() / 1000); 
      if (decoded.exp) {
        return decoded.exp < currentTime;  
      }
      return false;
    } catch (error) {
      console.error('Failed to decode token', error);
      return true;  
    }
  }

  getToken(): string {
    // TODO: return the token
      return localStorage.getItem('id_token') || ''; 
  }

  login(idToken: string) {
    // TODO: set the token to localStorage
    if (!idToken) {
      console.error('Invalid token');
      return;
    }
    localStorage.setItem('id_token', idToken);
    // TODO: redirect to the home page
    window.location.href = '/'; 
  }

  logout() {
    // TODO: remove the token from localStorage
    localStorage.removeItem('id_token');
    // TODO: redirect to the login page
    window.location.href = '/login';
  }
}

export default new AuthService();
