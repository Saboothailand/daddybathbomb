-- Admin helper functions for managing banner_images and gallery_images via RPC
-- Run this script in Supabase SQL Editor after deploying the base tables.

-- Ensure the search_path is set to public so SECURITY DEFINER functions use the correct schema.
SET search_path = public;

-- =========================
-- Banner admin RPC helpers
-- =========================

CREATE OR REPLACE FUNCTION public.admin_list_banner_images()
RETURNS SETOF public.banner_images
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM public.banner_images
  ORDER BY position, display_order, created_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.admin_save_banner_image(
    p_id UUID DEFAULT NULL,
    p_title TEXT,
    p_description TEXT DEFAULT NULL,
    p_image_url TEXT,
    p_link_url TEXT DEFAULT NULL,
    p_position TEXT DEFAULT 'hero',
    p_display_order INTEGER DEFAULT 0,
    p_is_active BOOLEAN DEFAULT TRUE,
    p_start_date TIMESTAMPTZ DEFAULT NULL,
    p_end_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS public.banner_images
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_result public.banner_images;
BEGIN
    IF p_id IS NULL THEN
        INSERT INTO public.banner_images (
            title,
            description,
            image_url,
            link_url,
            position,
            display_order,
            is_active,
            start_date,
            end_date
        ) VALUES (
            p_title,
            p_description,
            p_image_url,
            p_link_url,
            p_position,
            COALESCE(p_display_order, 0),
            COALESCE(p_is_active, TRUE),
            p_start_date,
            p_end_date
        )
        RETURNING * INTO v_result;
    ELSE
        UPDATE public.banner_images
        SET
            title = COALESCE(p_title, title),
            description = p_description,
            image_url = COALESCE(p_image_url, image_url),
            link_url = p_link_url,
            position = COALESCE(p_position, position),
            display_order = COALESCE(p_display_order, display_order),
            is_active = COALESCE(p_is_active, is_active),
            start_date = COALESCE(p_start_date, start_date),
            end_date = COALESCE(p_end_date, end_date),
            updated_at = NOW()
        WHERE id = p_id
        RETURNING * INTO v_result;
    END IF;

    RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_banner_image(p_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    DELETE FROM public.banner_images WHERE id = p_id;
    RETURN TRUE;
END;
$$;

-- =========================
-- Gallery admin RPC helpers
-- =========================

CREATE OR REPLACE FUNCTION public.admin_list_gallery_images()
RETURNS SETOF public.gallery_images
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM public.gallery_images
  ORDER BY display_order, created_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.admin_save_gallery_image(
    p_id UUID DEFAULT NULL,
    p_image_url TEXT,
    p_caption TEXT DEFAULT NULL,
    p_is_active BOOLEAN DEFAULT TRUE,
    p_display_order INTEGER DEFAULT 0
)
RETURNS public.gallery_images
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_result public.gallery_images;
BEGIN
    IF p_id IS NULL THEN
        INSERT INTO public.gallery_images (
            image_url,
            caption,
            is_active,
            display_order
        ) VALUES (
            p_image_url,
            p_caption,
            COALESCE(p_is_active, TRUE),
            COALESCE(p_display_order, 0)
        )
        RETURNING * INTO v_result;
    ELSE
        UPDATE public.gallery_images
        SET
            image_url = COALESCE(p_image_url, image_url),
            caption = p_caption,
            is_active = COALESCE(p_is_active, is_active),
            display_order = COALESCE(p_display_order, display_order),
            updated_at = NOW()
        WHERE id = p_id
        RETURNING * INTO v_result;
    END IF;

    RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_gallery_image(p_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    DELETE FROM public.gallery_images WHERE id = p_id;
    RETURN TRUE;
END;
$$;

-- Grant execute privileges to authenticated and anon roles so they can invoke the functions through supabase-js.
GRANT EXECUTE ON FUNCTION public.admin_list_banner_images TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_save_banner_image TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_banner_image TO anon, authenticated;

GRANT EXECUTE ON FUNCTION public.admin_list_gallery_images TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_save_gallery_image TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_gallery_image TO anon, authenticated;
