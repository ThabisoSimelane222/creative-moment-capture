CREATE TABLE public.date_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  details text NOT NULL,
  message text,
  date_time text,
  food text,
  activity text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.date_invitations TO service_role;
ALTER TABLE public.date_invitations ENABLE ROW LEVEL SECURITY;