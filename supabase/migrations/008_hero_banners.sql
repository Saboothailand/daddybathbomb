-- Hero Banners table for managing main page banners
CREATE TABLE IF NOT EXISTS hero_banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    description TEXT,
    tagline TEXT,
    primary_button_text TEXT,
    secondary_button_text TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for hero_banners
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;

-- Policy to allow reading hero banners for everyone
CREATE POLICY "Allow read access to hero banners" ON hero_banners
    FOR SELECT USING (true);

-- Policy to allow admin users to manage hero banners
CREATE POLICY "Allow admin to manage hero banners" ON hero_banners
    FOR ALL USING (true);

-- Insert default hero banners
INSERT INTO hero_banners (
    id, title, subtitle, description, tagline, 
    primary_button_text, secondary_button_text, 
    image_url, is_active, display_order
) VALUES 
(
    'banner-1',
    'DADDY',
    'BATH BOMB',
    'ฮีโร่อ่างอาบน้ำ',
    'สนุกสุดฟอง สดชื่นทุกสี เพื่อคุณ',
    'ช้อปบาธบอม',
    'ดูเรื่องราวสีสัน',
    '',
    true,
    1
),
(
    'banner-2',
    'FUN',
    'BATH TIME',
    'Make every bath an adventure!',
    'Fun & Fizzy Adventures',
    'Shop Now',
    'Learn More',
    '',
    true,
    2
),
(
    'banner-3',
    'COLORS',
    'GALORE',
    'Rainbow of fun awaits you!',
    'Colorful Bath Experience',
    'Explore',
    'Gallery',
    '',
    true,
    3
),
(
    'banner-4',
    'SPARKLE',
    'MAGIC',
    'Add sparkle to your day!',
    'Magical Bath Moments',
    'Discover',
    'Stories',
    '',
    true,
    4
),
(
    'banner-5',
    'RELAX',
    'REVIVE',
    'Perfect relaxation time!',
    'Relaxing Bath Therapy',
    'Shop',
    'About',
    '',
    true,
    5
),
(
    'banner-6',
    'FAMILY',
    'FUN',
    'Fun for the whole family!',
    'Family Bath Time',
    'Products',
    'Contact',
    '',
    true,
    6
)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hero_banners_display_order ON hero_banners(display_order);
CREATE INDEX IF NOT EXISTS idx_hero_banners_is_active ON hero_banners(is_active);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_hero_banners_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_hero_banners_updated_at
    BEFORE UPDATE ON hero_banners
    FOR EACH ROW
    EXECUTE FUNCTION update_hero_banners_updated_at();
