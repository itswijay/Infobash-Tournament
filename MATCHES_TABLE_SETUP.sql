-- Create matches table if it doesn't exist
-- This table stores all cricket matches

CREATE TABLE IF NOT EXISTS public.matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
    team1_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    team2_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    match_date TIMESTAMP WITH TIME ZONE NOT NULL,
    venue TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
    team1_score TEXT,
    team2_score TEXT,
    match_details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_matches_tournament_id ON public.matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_matches_team1_id ON public.matches(team1_id);
CREATE INDEX IF NOT EXISTS idx_matches_team2_id ON public.matches(team2_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_match_date ON public.matches(match_date);

-- Enable Row Level Security (RLS)
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for matches table
-- Everyone can read matches (public information)
CREATE POLICY "Matches are viewable by everyone" ON public.matches
    FOR SELECT USING (true);

-- Only admins can insert, update, and delete matches
CREATE POLICY "Only admins can insert matches" ON public.matches
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can update matches" ON public.matches
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can delete matches" ON public.matches
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_matches_updated_at 
    BEFORE UPDATE ON public.matches 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON public.matches TO authenticated;
GRANT SELECT ON public.matches TO anon;
