export function getSupabaseUrl(): string {
  // Try to get from environment first
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
  }

  // Extract from POSTGRES_URL (server-side only)
  const postgresUrl = process.env.POSTGRES_URL
  if (!postgresUrl) {
    throw new Error("POSTGRES_URL is not defined")
  }

  // Parse the URL to extract the project reference
  // Format: postgres://postgres.projectref:pass@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
  try {
    const url = new URL(postgresUrl)
    const username = url.username

    const projectRefMatch = username.match(/^postgres\.(.+)$/)
    if (!projectRefMatch) {
      throw new Error("Could not extract project ref from username")
    }

    const projectRef = projectRefMatch[1]
    return `https://${projectRef}.supabase.co`
  } catch (error) {
    console.error("[v0] Error extracting Supabase URL:", error)
    throw new Error("Could not extract Supabase URL from POSTGRES_URL")
  }
}

export function getSupabaseAnonKey(): string {
  const key = process.env.SUPABASE_ANON_KEY || ""

  if (!key) {
    console.error("[v0] Missing Supabase Anon Key - check environment variables SUPABASE_ANON_KEY")
    throw new Error("Supabase anon key is required")
  }

  return key
}
