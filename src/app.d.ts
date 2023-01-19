// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

import type { Location, User } from '@prisma/client'
import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types'
import type { Session, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './lib/types/database.types'

declare global {
	declare namespace App {
		interface Supabase {
			Database: Database
			SchemaName: 'public'
		}

		// interface PageData {}

		// interface Error {}
		interface Locals {
			sb: TypedSupabaseClient
			sbServiceRole: SupabaseClient
			session: Session
			user: User & { location?: Location | null }
		}
		// interface Platform {}
	}
}
