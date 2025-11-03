export interface StorageData {
  tickets: any[];
  employees: any[];
  currentUser: any;
  isAuthenticated: boolean;
}

interface UserCredential {
  email: string;
  password: string;
  role: "admin" | "employee";
}

const STORAGE_KEYS = {
  TICKETS: 'etickets_tickets',
  EMPLOYEES: 'etickets_employees',
  CURRENT_USER: 'etickets_current_user',
  IS_AUTHENTICATED: 'etickets_is_authenticated',
  USER_CREDENTIALS: 'etickets_user_credentials',
} as const;

export class StorageError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'StorageError';
  }
}

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      if (typeof window === 'undefined') {
        return defaultValue;
      }

      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }

      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      throw new StorageError(`Failed to read data from storage: ${key}`, error);
    }
  },

  set<T>(key: string, value: T): void {
    try {
      if (typeof window === 'undefined') {
        return;
      }

      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
      throw new StorageError(`Failed to write data to storage: ${key}`, error);
    }
  },

  remove(key: string): void {
    try {
      if (typeof window === 'undefined') {
        return;
      }

      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage key "${key}":`, error);
      throw new StorageError(`Failed to remove data from storage: ${key}`, error);
    }
  },

  clear(): void {
    try {
      if (typeof window === 'undefined') {
        return;
      }

      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      throw new StorageError('Failed to clear storage', error);
    }
  },
};

export const getTickets = (): any[] => {
  try {
    return storage.get(STORAGE_KEYS.TICKETS, []);
  } catch (error) {
    console.error('Failed to load tickets:', error);
    return [];
  }
};

export const saveTickets = (tickets: any[]): void => {
  try {
    storage.set(STORAGE_KEYS.TICKETS, tickets);
  } catch (error) {
    console.error('Failed to save tickets:', error);
    throw error;
  }
};

export const getEmployees = (): any[] => {
  try {
    return storage.get(STORAGE_KEYS.EMPLOYEES, []);
  } catch (error) {
    console.error('Failed to load employees:', error);
    return [];
  }
};

export const saveEmployees = (employees: any[]): void => {
  try {
    storage.set(STORAGE_KEYS.EMPLOYEES, employees);
  } catch (error) {
    console.error('Failed to save employees:', error);
    throw error;
  }
};

export const getCurrentUser = (): any => {
  try {
    return storage.get(STORAGE_KEYS.CURRENT_USER, null);
  } catch (error) {
    console.error('Failed to load current user:', error);
    return null;
  }
};

export const saveCurrentUser = (user: any): void => {
  try {
    storage.set(STORAGE_KEYS.CURRENT_USER, user);
  } catch (error) {
    console.error('Failed to save current user:', error);
    throw error;
  }
};

export const getIsAuthenticated = (): boolean => {
  try {
    return storage.get(STORAGE_KEYS.IS_AUTHENTICATED, false);
  } catch (error) {
    console.error('Failed to load authentication state:', error);
    return false;
  }
};

export const saveIsAuthenticated = (isAuthenticated: boolean): void => {
  try {
    storage.set(STORAGE_KEYS.IS_AUTHENTICATED, isAuthenticated);
  } catch (error) {
    console.error('Failed to save authentication state:', error);
    throw error;
  }
};

export const clearAuth = (): void => {
  try {
    storage.remove(STORAGE_KEYS.CURRENT_USER);
    storage.remove(STORAGE_KEYS.IS_AUTHENTICATED);
  } catch (error) {
    console.error('Failed to clear auth:', error);
    throw error;
  }
};

export const getUserCredentials = (): UserCredential[] => {
  try {
    return storage.get(STORAGE_KEYS.USER_CREDENTIALS, []);
  } catch (error) {
    console.error('Failed to load user credentials:', error);
    return [];
  }
};

export const saveUserCredentials = (credentials: UserCredential[]): void => {
  try {
    storage.set(STORAGE_KEYS.USER_CREDENTIALS, credentials);
  } catch (error) {
    console.error('Failed to save user credentials:', error);
    throw error;
  }
};

export const addUserCredential = (credential: UserCredential): void => {
  try {
    const credentials = getUserCredentials();
    const existingIndex = credentials.findIndex(
      c => c.email.toLowerCase() === credential.email.toLowerCase()
    );
    
    if (existingIndex >= 0) {
      credentials[existingIndex] = credential;
    } else {
      credentials.push(credential);
    }
    
    saveUserCredentials(credentials);
  } catch (error) {
    console.error('Failed to add user credential:', error);
    throw error;
  }
};

export const verifyUserCredential = (email: string, password: string): UserCredential | null => {
  try {
    const credentials = getUserCredentials();
    const credential = credentials.find(
      c => c.email.toLowerCase() === email.toLowerCase() && c.password === password
    );
    return credential || null;
  } catch (error) {
    console.error('Failed to verify user credential:', error);
    return null;
  }
};

export const findUserByEmail = (email: string): UserCredential | null => {
  try {
    const credentials = getUserCredentials();
    const credential = credentials.find(
      c => c.email.toLowerCase() === email.toLowerCase()
    );
    return credential || null;
  } catch (error) {
    console.error('Failed to find user by email:', error);
    return null;
  }
};

