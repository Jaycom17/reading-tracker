export type Community = {
  id: string
  name: string
  description: string
  creator_id: string
  access_code: string
  created_at: string
}

export type CommunityMember = {
  id: string
  community_id: string
  user_id: string
  role: 'creator' | 'member'
  joined_at: string
}

export type CommunityBook = {
  id: string
  community_id: string
  title: string
  author: string
  status: 'asignado'
  discussion_start_date: string | null
  created_at: string
}

export type CommunityComment = {
  id: string
  community_book_id: string
  user_id: string
  content: string
  parent_id: string | null
  created_at: string
}

export type CommunityWithMembers = Community & {
  community_members: CommunityMember[]
  member_count?: number
}

export type CommunityWithBooks = Community & {
  community_books: CommunityBook[]
}
