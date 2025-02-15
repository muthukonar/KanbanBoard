import { type JwtPayload, jwtDecode } from 'jwt-decode';
import type { UserData } from '../interfaces/UserData';

class AuthService {
  private inactivityTimeout: number = 60 * 1000; 
  private inactivityTimer: number | null = null;

  constructor() {
    this.setupInactivityListener();
  }

  getProfile() {
    return jwtDecode<UserData>(this.getToken());
  }

  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded?.exp && decoded?.exp < Date.now() / 1000) {
        return true;
      }
    } catch (err) {
      return false;
    }
  }

  getToken(): string {
    const loggedUser = localStorage.getItem('id_token') || '';
    return loggedUser;
  }

  login(idToken: string) {
    localStorage.setItem('id_token', idToken);
    this.resetInactivityTimer();
    window.location.assign('/');
  }

  logout() {
    localStorage.removeItem('id_token');
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer); 
    }
    window.location.assign('/');
  }
  
  resetInactivityTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
    this.inactivityTimer = setTimeout(() => this.handleSessionTimeout(), this.inactivityTimeout);
  }
  
  handleSessionTimeout() {
    this.logout();
  }

  setupInactivityListener() {
    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    events.forEach(event => {
      window.addEventListener(event, () => this.resetInactivityTimer());
    });
  }
}

export default new AuthService();
