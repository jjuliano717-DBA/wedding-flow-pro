
-- Alternative: Remove duplicates using a CTE (Common Table Expression) which is safer
WITH duplicates AS (
  SELECT id,
         ROW_NUMBER() OVER (PARTITION BY name ORDER BY id ASC) as row_num
  FROM vendors
)
DELETE FROM vendors
WHERE id IN (SELECT id FROM duplicates WHERE row_num > 1);

-- Then add the safety rule
ALTER TABLE vendors ADD CONSTRAINT unique_vendor_name UNIQUE (name);
