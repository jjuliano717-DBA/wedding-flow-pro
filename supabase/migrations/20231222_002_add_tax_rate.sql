-- =============================================
-- Migration: Add tax_rate to projects
-- Date: 2023-12-22
-- =============================================

ALTER TABLE projects ADD COLUMN IF NOT EXISTS tax_rate DECIMAL(4,3) DEFAULT 0.080 CHECK (tax_rate >= 0 AND tax_rate <= 1);

COMMENT ON COLUMN projects.tax_rate IS 'Tax rate for the project (e.g., 0.080 for 8%)';
