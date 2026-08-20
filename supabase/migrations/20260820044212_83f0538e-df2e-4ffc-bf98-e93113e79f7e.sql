CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  mobile TEXT,
  village TEXT,
  district TEXT,
  state TEXT,
  language TEXT NOT NULL DEFAULT 'English',
  farm_name TEXT,
  farm_size TEXT,
  main_crop TEXT,
  soil_type TEXT,
  setup_complete BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.sensor_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  sensor_type TEXT NOT NULL,
  connection TEXT NOT NULL DEFAULT 'wifi',
  status TEXT NOT NULL DEFAULT 'offline',
  last_seen TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sensor_devices TO authenticated;
GRANT ALL ON public.sensor_devices TO service_role;
ALTER TABLE public.sensor_devices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own devices" ON public.sensor_devices FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.sensor_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  soil_moisture NUMERIC,
  soil_ph NUMERIC,
  nitrogen NUMERIC,
  phosphorus NUMERIC,
  potassium NUMERIC,
  temperature NUMERIC,
  humidity NUMERIC,
  water_level NUMERIC,
  source TEXT NOT NULL DEFAULT 'demo',
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sensor_readings TO authenticated;
GRANT ALL ON public.sensor_readings TO service_role;
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own readings" ON public.sensor_readings FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX sensor_readings_user_time ON public.sensor_readings (user_id, recorded_at DESC);

CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  severity TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.alerts TO authenticated;
GRANT ALL ON public.alerts TO service_role;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own alerts" ON public.alerts FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.irrigation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  action TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'demo',
  soil_moisture NUMERIC,
  duration_minutes INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.irrigation_events TO authenticated;
GRANT ALL ON public.irrigation_events TO service_role;
ALTER TABLE public.irrigation_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own irrigation" ON public.irrigation_events FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, mobile, village, district, state, language, farm_name, farm_size, main_crop, soil_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.raw_user_meta_data ->> 'mobile',
    NEW.raw_user_meta_data ->> 'village',
    NEW.raw_user_meta_data ->> 'district',
    NEW.raw_user_meta_data ->> 'state',
    COALESCE(NEW.raw_user_meta_data ->> 'language', 'English'),
    NEW.raw_user_meta_data ->> 'farm_name',
    NEW.raw_user_meta_data ->> 'farm_size',
    NEW.raw_user_meta_data ->> 'main_crop',
    NEW.raw_user_meta_data ->> 'soil_type'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();