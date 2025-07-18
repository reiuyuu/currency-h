import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // 列表：所有 active=true
    const { data, error } = await supabase
      .from('currencies')
      .select('*')
      .eq('active', true)
      .order('iso_code')
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    // 新增：接受整个对象 payload
    const payload = req.body
    const { data, error } = await supabase
      .from('currencies')
      .insert([payload])
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  // 不支持的方法
  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
