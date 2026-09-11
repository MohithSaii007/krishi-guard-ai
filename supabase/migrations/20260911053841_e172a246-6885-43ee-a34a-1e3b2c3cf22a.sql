CREATE TYPE public.domain_order_status AS ENUM ('draft', 'payment_pending', 'paid', 'registering', 'completed', 'failed', 'refunded');
CREATE TYPE public.domain_registration_status AS ENUM ('pending', 'active', 'expiring', 'expired', 'failed', 'transferring');
CREATE TYPE public.marketplace_role AS ENUM ('admin', 'support', 'customer');

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE public.domain_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  extension text NOT NULL UNIQUE,
  registration_price numeric(12,2) NOT NULL,
  renewal_price numeric(12,2) NOT NULL,
  transfer_price numeric(12,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.domain_products TO anon, authenticated;
GRANT ALL ON public.domain_products TO service_role;
ALTER TABLE public.domain_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active domain pricing is public" ON public.domain_products FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE TRIGGER set_domain_products_updated_at BEFORE UPDATE ON public.domain_products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.domain_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  status public.domain_order_status NOT NULL DEFAULT 'draft',
  currency text NOT NULL DEFAULT 'USD',
  total_amount numeric(12,2) NOT NULL DEFAULT 0,
  payment_reference text,
  idempotency_key text NOT NULL UNIQUE,
  failure_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.domain_orders TO authenticated;
GRANT ALL ON public.domain_orders TO service_role;
ALTER TABLE public.domain_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers can view own domain orders" ON public.domain_orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Customers can create own domain orders" ON public.domain_orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND status = 'draft');
CREATE POLICY "Customers can update own draft orders" ON public.domain_orders FOR UPDATE TO authenticated USING (auth.uid() = user_id AND status = 'draft') WITH CHECK (auth.uid() = user_id AND status = 'draft');
CREATE TRIGGER set_domain_orders_updated_at BEFORE UPDATE ON public.domain_orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.domain_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.domain_orders(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  domain_name text NOT NULL,
  years integer NOT NULL DEFAULT 1 CHECK (years BETWEEN 1 AND 10),
  unit_price numeric(12,2) NOT NULL,
  renewal_price numeric(12,2) NOT NULL,
  registration_status public.domain_registration_status NOT NULL DEFAULT 'pending',
  provider_reference text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (order_id, domain_name)
);
GRANT SELECT, INSERT ON public.domain_order_items TO authenticated;
GRANT ALL ON public.domain_order_items TO service_role;
ALTER TABLE public.domain_order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers can view own order items" ON public.domain_order_items FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Customers can add items to own draft orders" ON public.domain_order_items FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.domain_orders o WHERE o.id = order_id AND o.user_id = auth.uid() AND o.status = 'draft'));

CREATE TABLE public.customer_domains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  order_item_id uuid UNIQUE REFERENCES public.domain_order_items(id) ON DELETE SET NULL,
  domain_name text NOT NULL UNIQUE,
  status public.domain_registration_status NOT NULL DEFAULT 'pending',
  registered_at timestamptz,
  expires_at timestamptz,
  auto_renew boolean NOT NULL DEFAULT true,
  nameservers text[] NOT NULL DEFAULT '{}',
  registrar_provider text NOT NULL DEFAULT 'name.com',
  provider_reference text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.customer_domains TO authenticated;
GRANT ALL ON public.customer_domains TO service_role;
ALTER TABLE public.customer_domains ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers can view own domains" ON public.customer_domains FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Customers can update own domain preferences" ON public.customer_domains FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER set_customer_domains_updated_at BEFORE UPDATE ON public.customer_domains FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.domain_dns_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id uuid NOT NULL REFERENCES public.customer_domains(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  record_type text NOT NULL CHECK (record_type IN ('A', 'AAAA', 'CNAME', 'MX', 'TXT', 'SRV', 'CAA', 'NS')),
  host text NOT NULL,
  value text NOT NULL,
  priority integer,
  ttl integer NOT NULL DEFAULT 3600 CHECK (ttl BETWEEN 60 AND 86400),
  provider_reference text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.domain_dns_records TO authenticated;
GRANT ALL ON public.domain_dns_records TO service_role;
ALTER TABLE public.domain_dns_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers can manage own domain DNS" ON public.domain_dns_records FOR ALL TO authenticated USING (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.customer_domains d WHERE d.id = domain_id AND d.user_id = auth.uid())) WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.customer_domains d WHERE d.id = domain_id AND d.user_id = auth.uid()));
CREATE TRIGGER set_domain_dns_records_updated_at BEFORE UPDATE ON public.domain_dns_records FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.marketplace_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own marketplace roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_marketplace_role(_user_id uuid, _role public.marketplace_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
GRANT EXECUTE ON FUNCTION public.has_marketplace_role(uuid, public.marketplace_role) TO authenticated, service_role;

INSERT INTO public.domain_products (extension, registration_price, renewal_price, transfer_price, currency) VALUES
('.com', 12.99, 17.99, 12.99, 'USD'),
('.in', 8.99, 11.99, 8.99, 'USD'),
('.co', 24.99, 29.99, 24.99, 'USD'),
('.org', 10.99, 16.99, 10.99, 'USD'),
('.net', 13.99, 18.99, 13.99, 'USD'),
('.ai', 79.99, 89.99, 79.99, 'USD');