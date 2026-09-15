SET local check_function_bodies = off;

CREATE TABLE "public"."profiles" (
  "id"         uuid                     NOT NULL,
  "full_name"  text,
  "role"       text                     NOT NULL DEFAULT 'ADMIN'::text,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "profiles_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."profiles"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."registrations" (
  "id"                  uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "registration_number" text                     NOT NULL,
  "first_name"          text                     NOT NULL,
  "last_name"           text                     NOT NULL,
  "date_of_birth"       date                     NOT NULL,
  "age_group"           text                     NOT NULL,
  "playing_speciality"  text                     NOT NULL,
  "email"               text                     NOT NULL,
  "mobile"              text                     NOT NULL,
  "district"            text                     NOT NULL,
  "state"               text                     NOT NULL,
  "photo_url"           text,
  "amount"              integer                  NOT NULL DEFAULT 999,
  "payment_status"      text                     NOT NULL DEFAULT 'PENDING'::text,
  "registration_status" text                     NOT NULL DEFAULT 'PENDING'::text,
  "razorpay_order_id"   text,
  "razorpay_payment_id" text,
  "razorpay_signature"  text,
  "created_at"          timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"          timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "registrations_pkey" PRIMARY KEY (id),
  CONSTRAINT "registrations_razorpay_order_id_key" UNIQUE (razorpay_order_id),
  CONSTRAINT "registrations_registration_number_key" UNIQUE (registration_number)
);

ALTER TABLE "public"."registrations"
  ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
  RETURNS boolean
  LANGUAGE sql
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $function$
  select exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'ADMIN'
  );
$function$;

ALTER TABLE "public"."profiles"
  ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE POLICY "admins_read_own_profile" ON "public"."profiles"
  FOR SELECT
  TO "authenticated"
  USING ((id = auth.uid()));

CREATE POLICY "registrations_admin_select" ON "public"."registrations"
  FOR SELECT
  TO "authenticated"
  USING (public.is_admin());

CREATE POLICY "registrations_public_insert" ON "public"."registrations"
  FOR INSERT
  TO "anon", "authenticated"
  WITH CHECK (true);

CREATE POLICY "Allow player photo reads" ON "storage"."objects"
  FOR SELECT
  TO "anon"
  USING ((bucket_id = 'player-photos'::text));

CREATE POLICY "Allow player photo uploads" ON "storage"."objects"
  FOR INSERT
  TO "anon"
  WITH CHECK ((bucket_id = 'player-photos'::text));

GRANT EXECUTE ON FUNCTION "public"."is_admin"() TO PUBLIC, "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."registrations" TO "anon", "authenticated", "postgres", "service_role";

