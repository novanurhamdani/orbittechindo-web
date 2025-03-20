import { LoginCredentials, RegisterData, User } from "@/types";

// Mock user data
const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Test User",
    email: "test@example.com",
    phone: "123-456-7890",
  },
];

// Mock credentials (email/password pairs)
const MOCK_CREDENTIALS: Record<string, string> = {
  "test@example.com": "password123",
};

// Generate a mock JWT token
const generateToken = (user: User): string => {
  // In a real app, It would use a proper JWT library
  // This is just a simple mock
  const payload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration
  };

  return btoa(JSON.stringify(payload));
};

export const authService = {
  // Mock login function
  login: async (credentials: LoginCredentials) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { email, password } = credentials;

    // Check if user exists and password matches
    if (MOCK_CREDENTIALS[email] === password) {
      const user = MOCK_USERS.find((u) => u.email === email);

      if (user) {
        const token = generateToken(user);
        return { user, token };
      }
    }

    throw new Error("Invalid email or password");
  },

  // Mock register function
  register: async (data: RegisterData) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { email } = data;

    // Check if user already exists
    if (MOCK_USERS.some((u) => u.email === email)) {
      throw new Error("User already exists");
    }

    // Create new user
    const newUser: User = {
      id: String(MOCK_USERS.length + 1),
      name: data.name,
      email: data.email,
      phone: data.phone,
    };

    // Add to mock database
    MOCK_USERS.push(newUser);
    MOCK_CREDENTIALS[data.email] = data.password;

    const token = generateToken(newUser);
    return { user: newUser, token };
  },

  // Verify token and get user
  verifyToken: async (token: string) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    try {
      // Decode token
      const payload = JSON.parse(atob(token));

      // Check if token is expired
      if (payload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error("Token expired");
      }

      // Find user
      const user = MOCK_USERS.find((u) => u.id === payload.sub);

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      console.error(error);
      throw new Error("Invalid token");
    }
  },

  // Logout (client-side only in this mock implementation)
  logout: async () => {
    // In a real app, It might invalidate the token on the server
    // Here we just return a success response
    await new Promise((resolve) => setTimeout(resolve, 200));
    return { success: true };
  },
};

export default authService;
