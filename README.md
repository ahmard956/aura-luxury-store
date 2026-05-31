# Aura Luxury Store - Production Run Manual (US Market Validation)

## Core Architectural Overview
Aura is designed to use **Next.js 15**, **React 18.2**, and raw **JavaScript** within the Next.js **App Router** paradigm to prevent module mismatch conflicts during deployment.

---

## Step 1: Initialize Database Framework inside Supabase
1. Create a project in the **Supabase Dashboard**.
2. Open the **SQL Editor** within your project view.
3. Paste the contents of `supabase/schema.sql` into the editor and click **Run**.
4. To handle inventory tracking, run this quick SQL function snippet in the editor:
   ```sql
   CREATE OR REPLACE FUNCTION decrement_inventory(row_id UUID, qty INT)
   RETURNS void AS $$
   BEGIN
     UPDATE products 
     SET stock = stock - qty 
     WHERE id = row_id;
   END;
   $$ LANGUAGE plpgsql;
# aura-luxury-store
