-- Additional tables for image management and content

-- Hero slider images table
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    image_url TEXT NOT NULL,
    button_text TEXT,
    button_action TEXT, -- 'products', 'about', 'contact', etc.
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Gallery images table (Instagram-style)
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    caption TEXT,
    alt_text TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Features table (Why Choose Us section)
CREATE TABLE IF NOT EXISTS public.features (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    icon TEXT, -- emoji or icon class
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Product images table (for product gallery)
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false, -- main product image
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Social media links table
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    platform TEXT NOT NULL, -- 'instagram', 'facebook', 'line', etc.
    url TEXT NOT NULL,
    icon TEXT, -- emoji or icon class
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- Public read access for all users
CREATE POLICY "Public read access for hero_slides" ON public.hero_slides
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access for gallery_images" ON public.gallery_images
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access for features" ON public.features
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access for product_images" ON public.product_images
    FOR SELECT USING (true);

CREATE POLICY "Public read access for social_links" ON public.social_links
    FOR SELECT USING (is_active = true);

-- Admin full access (you'll need to set up proper admin role)
CREATE POLICY "Admin full access for hero_slides" ON public.hero_slides
    FOR ALL USING (auth.jwt() ->> 'email' = 'admin@daddybathbomb.com');

CREATE POLICY "Admin full access for gallery_images" ON public.gallery_images
    FOR ALL USING (auth.jwt() ->> 'email' = 'admin@daddybathbomb.com');

CREATE POLICY "Admin full access for features" ON public.features
    FOR ALL USING (auth.jwt() ->> 'email' = 'admin@daddybathbomb.com');

CREATE POLICY "Admin full access for product_images" ON public.product_images
    FOR ALL USING (auth.jwt() ->> 'email' = 'admin@daddybathbomb.com');

CREATE POLICY "Admin full access for social_links" ON public.social_links
    FOR ALL USING (auth.jwt() ->> 'email' = 'admin@daddybathbomb.com');

-- Add updated_at triggers
CREATE TRIGGER update_hero_slides_updated_at
    BEFORE UPDATE ON public.hero_slides
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_images_updated_at
    BEFORE UPDATE ON public.gallery_images
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_features_updated_at
    BEFORE UPDATE ON public.features
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_links_updated_at
    BEFORE UPDATE ON public.social_links
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO public.hero_slides (title, subtitle, description, image_url, button_text, button_action, display_order) VALUES
('Premium Bath Bombs', '100% Natural', 'Experience the ultimate bathing experience with natural bath bombs', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop', 'View Products', 'products', 1),
('Luxury Spa Experience', 'Relax at Home', 'Transform your home into a luxury spa with aromatherapy scents', 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&h=800&fit=crop', 'About Us', 'about', 2),
('Perfect Gift for Loved Ones', 'Special Gift', 'Give happiness and relaxation to your loved ones with Daddy Bath Bomb', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1200&h=800&fit=crop', 'Contact Us', 'contact', 3);

INSERT INTO public.features (title, description, image_url, icon, display_order) VALUES
('Natural Ingredients', 'Made from 100% natural ingredients, safe for the whole family', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500&h=400&fit=crop', '🌿', 1),
('Beautiful Fizzy Colors', 'Beautiful colorful fizz with relaxing aromatherapy scents', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop', '✨', 2),
('Skin Nourishing', 'Moisturizes and nourishes skin for smooth, soft feeling after bath', 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&h=400&fit=crop', '💧', 3),
('Perfect Gift', 'Perfect gift for special people on any occasion', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop&sig=gift', '🎁', 4);

INSERT INTO public.gallery_images (image_url, caption, display_order) VALUES
('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Relaxing bath time with our premium bath bombs', 1),
('https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop', 'Natural ingredients for healthy skin', 2),
('https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop', 'Luxury spa experience at home', 3),
('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&sig=2', 'Beautiful fizzy colors and scents', 4),
('https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop&sig=3', 'Perfect for family relaxation time', 5),
('https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop&sig=4', 'Premium quality bath products', 6);

INSERT INTO public.social_links (platform, url, icon, display_order) VALUES
('instagram', 'https://instagram.com/daddybathbomb', '📸', 1),
('facebook', 'https://facebook.com/daddybathbomb', '📘', 2),
('line', 'https://line.me/ti/p/daddybathbomb', '💬', 3);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hero_slides_active_order ON public.hero_slides(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_images_active_order ON public.gallery_images(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_features_active_order ON public.features(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_product_images_product_order ON public.product_images(product_id, display_order);
CREATE INDEX IF NOT EXISTS idx_social_links_active_order ON public.social_links(is_active, display_order);
