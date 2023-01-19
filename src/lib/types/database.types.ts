export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      custom_blends: {
        Row: {
          approved: boolean
          approvedById: string | null
          createdAt: string
          createdById: string
          flavor1: string
          flavor2: string | null
          flavor3: string | null
          id: string
          name: string
          shots1: number
          shots2: number | null
          shots3: number | null
          updatedAt: string
          updatedById: string | null
        }
        Insert: {
          approved?: boolean
          approvedById?: string | null
          createdAt?: string
          createdById: string
          flavor1: string
          flavor2?: string | null
          flavor3?: string | null
          id: string
          name: string
          shots1: number
          shots2?: number | null
          shots3?: number | null
          updatedAt: string
          updatedById?: string | null
        }
        Update: {
          approved?: boolean
          approvedById?: string | null
          createdAt?: string
          createdById?: string
          flavor1?: string
          flavor2?: string | null
          flavor3?: string | null
          id?: string
          name?: string
          shots1?: number
          shots2?: number | null
          shots3?: number | null
          updatedAt?: string
          updatedById?: string | null
        }
      }
      flavors: {
        Row: {
          category: Database["public"]["Enums"]["FlavorCategory"]
          flavor: string
          id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["FlavorCategory"]
          flavor: string
          id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["FlavorCategory"]
          flavor?: string
          id?: string
        }
      }
      locations: {
        Row: {
          address: string | null
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          id: string
          name: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          id?: string
          name?: string
          phone?: string | null
        }
      }
      nicotine_packets: {
        Row: {
          color: string
          id: string
          level: number
          salt: boolean
        }
        Insert: {
          color: string
          id: string
          level: number
          salt: boolean
        }
        Update: {
          color?: string
          id?: string
          level?: number
          salt?: boolean
        }
      }
      promos: {
        Row: {
          blendId: string | null
          createdAt: string
          createdById: string
          id: string
          notes: string | null
          sale: string | null
          subtitle: string | null
          title: string
          updatedAt: string
          updatedById: string | null
          validFrom: string
          validUntil: string
        }
        Insert: {
          blendId?: string | null
          createdAt?: string
          createdById: string
          id: string
          notes?: string | null
          sale?: string | null
          subtitle?: string | null
          title: string
          updatedAt: string
          updatedById?: string | null
          validFrom: string
          validUntil: string
        }
        Update: {
          blendId?: string | null
          createdAt?: string
          createdById?: string
          id?: string
          notes?: string | null
          sale?: string | null
          subtitle?: string | null
          title?: string
          updatedAt?: string
          updatedById?: string | null
          validFrom?: string
          validUntil?: string
        }
      }
      users: {
        Row: {
          email: string
          id: string
          locationId: string | null
          name: string | null
          role: Database["public"]["Enums"]["Role"]
        }
        Insert: {
          email: string
          id: string
          locationId?: string | null
          name?: string | null
          role?: Database["public"]["Enums"]["Role"]
        }
        Update: {
          email?: string
          id?: string
          locationId?: string | null
          name?: string | null
          role?: Database["public"]["Enums"]["Role"]
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      FlavorCategory:
        | "Fruit"
        | "Candy"
        | "Dessert"
        | "Tobacco"
        | "Menthol"
        | "Drinks"
        | "Other"
      Role: "User" | "Store" | "Manager" | "Admin"
    }
  }
}
