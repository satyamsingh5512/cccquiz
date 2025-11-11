import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string;
    organization?: string;
    isAdmin?: boolean;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      organization: string;
      isAdmin: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    organization?: string;
  }
}
