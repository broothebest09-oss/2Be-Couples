-- ========================================================
-- 2Be Couples App - Supabase Database Schema
-- Run this script in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ========================================================

-- 1. PROFILES TABLE (Holds user profiles linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT DEFAULT '',
  couple_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. COUPLES TABLE (Pairs two individuals via invite code)
CREATE TABLE IF NOT EXISTS public.couples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_code TEXT UNIQUE NOT NULL,
  user1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user1_name TEXT NOT NULL,
  user2_name TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paired', 'dissolved')),
  paired_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MESSAGES TABLE (Real-time couple chat)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT,
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'kiss', 'hug', 'photo', 'voice', 'secret_letter')),
  media_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. GRATITUDE NOTES TABLE
CREATE TABLE IF NOT EXISTS public.gratitude_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  text TEXT NOT NULL,
  color_bg TEXT DEFAULT 'bg-[#FFE3E8]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BUCKET LIST DREAMS TABLE
CREATE TABLE IF NOT EXISTS public.bucket_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  text TEXT NOT NULL,
  category TEXT DEFAULT 'Travel',
  emoji TEXT DEFAULT '✈️',
  target_date TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gratitude_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bucket_list ENABLE ROW LEVEL SECURITY;

-- 7. RLS POLICIES FOR SECURE ACCESS
CREATE POLICY "Users can view and edit their own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can view couples they belong to or pending invite codes" ON public.couples
  FOR ALL USING (auth.uid() = user1_id OR auth.uid() = user2_id OR status = 'pending');

CREATE POLICY "Couples can access their own messages" ON public.messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.couples c
      WHERE c.id = public.messages.couple_id
      AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
    )
  );

CREATE POLICY "Couples can access gratitude notes" ON public.gratitude_notes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.couples c
      WHERE c.id = public.gratitude_notes.couple_id
      AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
    )
  );

CREATE POLICY "Couples can access bucket list" ON public.bucket_list
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.couples c
      WHERE c.id = public.bucket_list.couple_id
      AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
    )
  );

-- 8. ENABLE REALTIME BROADCASTING
-- This allows instant message delivery between Phone 1 and Phone 2
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.couples;
