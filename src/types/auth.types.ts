export interface User {
  userid: string;
  username: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

// Wait, looking at the user request "HU-001: registrarme con email y contraseña".
// I need to be careful with the API expectation. The user provided `https://apistock.somee.com/`.
// I don't have the API docs. I should assume standard `email` and `password` for now.
// If the previous conversation 08fc478d mentioned `AppUser` and `RegisterDto`, it likely expects specific fields.
// I'll stick to a generic structure and adjust if I see errors or can inspect the network.

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
    token: string;
    userid: string;
    username: string;
    expiration: string;
}
