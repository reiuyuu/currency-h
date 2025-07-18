import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const { iso_code } = req.query;

  if (req.method === 'GET') {
    // 查询单条
    const { data, error } = await supabase
      .from('currencies')
      .select('*')
      .eq('iso_code', iso_code)
      .single();
    if (error) return res.status(404).json({ error: 'Not Found' });
    return res.status(200).json(data);
  }

  if (req.method === 'PATCH') {
    // 更新任意字段
    const updates = req.body;
    const { data, error } = await supabase
      .from('currencies')
      .update(updates)
      .eq('iso_code', iso_code)
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'DELETE') {
    // 软删除：设 active=false
    const { data, error } = await supabase
      .from('currencies')
      .update({ active: false })
      .eq('iso_code', iso_code)
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
