-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('mentor', 'admin', 'responder')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Zones table for area management
CREATE TABLE public.zones (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    description TEXT,
    polygon_coordinates JSONB, -- GeoJSON polygon
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Responders table for tracking responder locations and status
CREATE TABLE public.responders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    location_lat DECIMAL(10, 8) NOT NULL,
    location_lng DECIMAL(11, 8) NOT NULL,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'busy', 'offline')),
    zone_id UUID REFERENCES public.zones(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Incidents table for AI-detected events
CREATE TABLE public.incidents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    type TEXT NOT NULL CHECK (type IN ('crowd_surge', 'fire_smoke', 'medical')),
    photo_url TEXT,
    confidence_score DECIMAL(3, 2) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'dispatched', 'resolved', 'cancelled')),
    location_lat DECIMAL(10, 8) NOT NULL,
    location_lng DECIMAL(11, 8) NOT NULL,
    description TEXT,
    verified_by UUID REFERENCES public.users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    dispatched_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assignments table for responder incident assignments
CREATE TABLE public.assignments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    incident_id UUID REFERENCES public.incidents(id) ON DELETE CASCADE,
    responder_id UUID REFERENCES public.responders(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES public.users(id),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'en_route', 'arrived', 'completed')),
    eta_minutes INTEGER,
    accepted_at TIMESTAMP WITH TIME ZONE,
    arrived_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Settings table for model thresholds
CREATE TABLE public.ai_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    crowd_surge_threshold DECIMAL(3, 2) DEFAULT 0.7,
    fire_smoke_threshold DECIMAL(3, 2) DEFAULT 0.8,
    medical_threshold DECIMAL(3, 2) DEFAULT 0.6,
    human_verification_enabled BOOLEAN DEFAULT TRUE,
    auto_dispatch_enabled BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time location tracking table
CREATE TABLE public.location_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responder_id UUID REFERENCES public.responders(id) ON DELETE CASCADE,
    location_lat DECIMAL(10, 8) NOT NULL,
    location_lng DECIMAL(11, 8) NOT NULL,
    accuracy_meters DECIMAL(10, 2),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event logs for audit trail
CREATE TABLE public.event_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES public.users(id),
    event_type TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    details JSONB,
    ip_address INET
);

-- Insert default AI settings
INSERT INTO public.ai_settings (id) VALUES (uuid_generate_v4());

-- Create indexes for performance
CREATE INDEX idx_responders_user_id ON public.responders(user_id);
CREATE INDEX idx_responders_zone_id ON public.responders(zone_id);
CREATE INDEX idx_responders_status ON public.responders(status);
CREATE INDEX idx_incidents_status ON public.incidents(status);
CREATE INDEX idx_incidents_type ON public.incidents(type);
CREATE INDEX idx_incidents_created_at ON public.incidents(created_at);
CREATE INDEX idx_assignments_incident_id ON public.assignments(incident_id);
CREATE INDEX idx_assignments_responder_id ON public.assignments(responder_id);
CREATE INDEX idx_assignments_status ON public.assignments(status);
CREATE INDEX idx_location_history_responder_id ON public.location_history(responder_id);
CREATE INDEX idx_location_history_timestamp ON public.location_history(timestamp);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users can read their own profile and admins can read all
CREATE POLICY "Users can read own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can read all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Admins can manage all users
CREATE POLICY "Admins can manage users" ON public.users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Everyone can read zones
CREATE POLICY "Everyone can read zones" ON public.zones
    FOR SELECT USING (TRUE);

-- Only admins can manage zones
CREATE POLICY "Admins can manage zones" ON public.zones
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Responders and admins can read responder data
CREATE POLICY "Responders and admins can read responders" ON public.responders
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('admin', 'mentor')
        )
    );

-- Responders can update their own data
CREATE POLICY "Responders can update own data" ON public.responders
    FOR UPDATE USING (user_id = auth.uid());

-- Admins can manage all responder data
CREATE POLICY "Admins can manage responders" ON public.responders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Everyone can read incidents (for dashboard view)
CREATE POLICY "Everyone can read incidents" ON public.incidents
    FOR SELECT USING (TRUE);

-- Mentors and admins can manage incidents
CREATE POLICY "Mentors and admins can manage incidents" ON public.incidents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('admin', 'mentor')
        )
    );

-- Responders can read their assignments
CREATE POLICY "Responders can read own assignments" ON public.assignments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.responders 
            WHERE id = assignments.responder_id AND user_id = auth.uid()
        )
    );

-- Mentors and admins can manage assignments
CREATE POLICY "Mentors and admins can manage assignments" ON public.assignments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('admin', 'mentor')
        )
    );

-- Only admins can read AI settings
CREATE POLICY "Admins can read AI settings" ON public.ai_settings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Only admins can update AI settings
CREATE POLICY "Admins can update AI settings" ON public.ai_settings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Responders can insert their own location history
CREATE POLICY "Responders can insert location history" ON public.location_history
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.responders 
            WHERE id = location_history.responder_id AND user_id = auth.uid()
        )
    );

-- Everyone can read location history (for map display)
CREATE POLICY "Everyone can read location history" ON public.location_history
    FOR SELECT USING (TRUE);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_zones_updated_at BEFORE UPDATE ON public.zones 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_responders_updated_at BEFORE UPDATE ON public.responders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON public.incidents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON public.assignments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_settings_updated_at BEFORE UPDATE ON public.ai_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, phone_number, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone_number', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'mentor')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();