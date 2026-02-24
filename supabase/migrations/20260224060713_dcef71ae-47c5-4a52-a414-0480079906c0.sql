
-- Fix theme_settings policies: change from RESTRICTIVE to PERMISSIVE
DROP POLICY IF EXISTS "Admins can insert theme settings" ON public.theme_settings;
DROP POLICY IF EXISTS "Admins can update theme settings" ON public.theme_settings;
DROP POLICY IF EXISTS "Theme settings are publicly readable" ON public.theme_settings;

CREATE POLICY "Theme settings are publicly readable"
ON public.theme_settings FOR SELECT
USING (true);

CREATE POLICY "Admins can insert theme settings"
ON public.theme_settings FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update theme settings"
ON public.theme_settings FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix reviews policies too
DROP POLICY IF EXISTS "Reviews are publicly readable" ON public.reviews;
DROP POLICY IF EXISTS "Users can create their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;

CREATE POLICY "Reviews are publicly readable"
ON public.reviews FOR SELECT
USING (true);

CREATE POLICY "Users can create their own reviews"
ON public.reviews FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
ON public.reviews FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
ON public.reviews FOR UPDATE
USING (auth.uid() = user_id);

-- Fix user_roles policy
DROP POLICY IF EXISTS "Admins can view roles" ON public.user_roles;

CREATE POLICY "Admins can view roles"
ON public.user_roles FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));
