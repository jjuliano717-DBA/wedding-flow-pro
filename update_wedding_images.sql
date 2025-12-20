-- Update script to add "Couple" focused images to Real Weddings
-- specific themes: Garden, City, Rustic, Beach, Southern, Lake, Winter, Luxury

-- 1. Sarah & Michael (Napa Valley) -> Couple in Vineyard
UPDATE real_weddings
SET image_url = 'https://images.unsplash.com/photo-1583939003579-00269c6f23f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
WHERE couple_names = 'Sarah & Michael';

-- 2. Emily & James (New York) -> Couple in City/Formal
UPDATE real_weddings
SET image_url = 'https://images.unsplash.com/photo-1623773663673-a2eb98b9bd79?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
WHERE couple_names = 'Emily & James';

-- 3. Jessica & David (Rustic/Tennessee) -> Couple in Field/Barn setting
UPDATE real_weddings
SET image_url = 'https://images.unsplash.com/photo-1510076857177-7470076d4098?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
WHERE couple_names = 'Jessica & David';

-- 4. Amanda & Ryan (Turks & Caicos/Beach) -> Couple on Beach
UPDATE real_weddings
SET image_url = 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
WHERE couple_names = 'Amanda & Ryan';

-- 5. Olivia & Thomas (Charleston/Southern) -> Couple with Greenery/Trees
UPDATE real_weddings
SET image_url = 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
WHERE couple_names = 'Olivia & Thomas';

-- 6. Madison & William (Lake Como/Italy) -> Couple by Water/Villa
UPDATE real_weddings
SET image_url = 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
WHERE couple_names = 'Madison & William';

-- 7. Sophia & Benjamin (Aspen/Winter) -> Couple in Snow
UPDATE real_weddings
SET image_url = 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
WHERE couple_names = 'Sophia & Benjamin';

-- 8. Isabella & Alexander (Beverly Hills/Luxury) -> Couple in Black Tie/Estate
UPDATE real_weddings
SET image_url = 'https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
WHERE couple_names = 'Isabella & Alexander';
