import type { Edition, Photo, Photographer, User } from "@/generated/prisma";

// Listing = Edition + vnořená Photo + Photographer + User (autor)
export type ListingWithDetails = Edition & {
  photo: Photo & {
    photographer: Photographer & {
      user: Pick<User, "id" | "name">;
    };
  };
};

// Rozšíření NextAuth session o role a id
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}
