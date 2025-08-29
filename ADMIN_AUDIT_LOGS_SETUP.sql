-- Admin Audit Logs Table Setup
-- This table logs all critical admin actions for security and audit purposes

-- Create the admin_audit_logs table
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    action_type text NOT NULL,
    action_description text NOT NULL,
    resource_type text,
    resource_id uuid,
    additional_data jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT admin_audit_logs_pkey PRIMARY KEY (id),
    CONSTRAINT admin_audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_user_id ON public.admin_audit_logs USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_action_type ON public.admin_audit_logs USING btree (action_type);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON public.admin_audit_logs USING btree (created_at);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_resource_type ON public.admin_audit_logs USING btree (resource_type);

-- Enable Row Level Security
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" ON public.admin_audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role = 'admin'
        )
    );

-- Only admins can insert audit logs
CREATE POLICY "Admins can insert audit logs" ON public.admin_audit_logs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role = 'admin'
        )
    );

-- Only admins can update audit logs
CREATE POLICY "Admins can update audit logs" ON public.admin_audit_logs
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role = 'admin'
        )
    );

-- Only admins can delete audit logs
CREATE POLICY "Admins can delete audit logs" ON public.admin_audit_logs
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role = 'admin'
        )
    );

-- Create trigger to automatically update updated_at column
CREATE TRIGGER update_admin_audit_logs_updated_at
    BEFORE UPDATE ON public.admin_audit_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions to authenticated users (RLS will handle access control)
GRANT ALL ON public.admin_audit_logs TO authenticated;

-- Insert a sample audit log entry for testing (optional)
-- INSERT INTO public.admin_audit_logs (user_id, action_type, action_description, resource_type, resource_id)
-- VALUES (
--     (SELECT id FROM auth.users LIMIT 1), -- Replace with actual user ID
--     'table_created',
--     'Admin audit logs table created',
--     'table',
--     NULL
-- );

-- Verify the table was created
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'admin_audit_logs' 
ORDER BY ordinal_position;
