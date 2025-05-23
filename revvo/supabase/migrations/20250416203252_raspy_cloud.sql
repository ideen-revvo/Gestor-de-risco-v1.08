/*
  # Create sales order table

  1. New Tables
    - `sales_order`: Sales order records
      - `id` (bigint, primary key)
      - `created_at` (timestamp)
      - `customer_id` (bigint, foreign key)
      - `total_qtt` (bigint)
      - `total_amt` (double precision)
      - `item_id` (bigint[])
      - `item_qtt` (bigint[])
      - `item_price` (double precision[])
      - `item_disc` (double precision[])
      - `item_tot_price` (double precision[])
      - `company_id` (bigint)
      - `status` (text)
      - `due_date` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS sales_order (
  id bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  customer_id bigint NULL,
  total_qtt bigint NULL,
  total_amt double precision NULL,
  item_id bigint[] NULL,
  item_qtt bigint[] NULL,
  item_price double precision[] NULL,
  item_disc double precision[] NULL,
  item_tot_price double precision[] NULL,
  company_id bigint NULL,
  status text NULL,
  due_date timestamp with time zone NULL,
  CONSTRAINT sales_order_pkey PRIMARY KEY (id),
  CONSTRAINT sales_order_company_id_fkey FOREIGN KEY (company_id) REFERENCES company(id),
  CONSTRAINT sales_order_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customer(id)
);

ALTER TABLE sales_order ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to authenticated users"
  ON sales_order
  FOR SELECT
  TO authenticated
  USING (true);