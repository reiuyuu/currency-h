import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // 获取所有 currencies，按 code 排序
    const { data, error } = await supabase
      .from('currencies')
      .select('id, code, name, symbol, created_at')
      .order('code')
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    // 新增 currency，只接受 code, name, symbol 字段
    const { code, name, symbol } = req.body
    if (!code || !name || !symbol) {
      return res.status(400).json({ error: 'code, name, symbol are required' })
    }
    const { data, error } = await supabase
      .from('currencies')
      .insert([{ code, name, symbol }])
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  // 不支持的方法
  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
