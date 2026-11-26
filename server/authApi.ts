import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import type { Connect, Plugin } from 'vite'

export type StoredUser = {
  name: string
  email: string
  passwordHash: string
}

export type PublicUser = {
  name: string
  email: string
}

const USERS_DIR = path.resolve(process.cwd(), 'data')
const USERS_FILE = path.join(USERS_DIR, 'users.txt')

function ensureStore() {
  if (!fs.existsSync(USERS_DIR)) fs.mkdirSync(USERS_DIR, { recursive: true })
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '', 'utf8')
}

function hashPassword(password: string) {
  return createHash('sha256').update(password).digest('hex')
}

function readUsers(): StoredUser[] {
  ensureStore()
  const raw = fs.readFileSync(USERS_FILE, 'utf8')
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      const [name, email, passwordHash] = line.split('|')
      if (!name || !email || !passwordHash) return []
      return [{ name, email: email.toLowerCase(), passwordHash }]
    })
}

function writeUsers(users: StoredUser[]) {
  ensureStore()
  const body = users.map((user) => `${user.name}|${user.email}|${user.passwordHash}`).join('\n')
  fs.writeFileSync(USERS_FILE, body ? `${body}\n` : '', 'utf8')
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function readJson(req: Connect.IncomingMessage) {
  const chunks: Buffer[] = []
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  const raw = Buffer.concat(chunks).toString('utf8')
  if (!raw) return {}
  return JSON.parse(raw) as Record<string, unknown>
}

function sendJson(res: Connect.ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

function toPublic(user: StoredUser): PublicUser {
  return { name: user.name, email: user.email }
}

async function handleRegister(req: Connect.IncomingMessage, res: Connect.ServerResponse) {
  try {
    const body = await readJson(req)
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body.password === 'string' ? body.password : ''

    if (name.length < 2) return sendJson(res, 400, { error: 'Enter your full name' })
    if (!isValidEmail(email)) return sendJson(res, 400, { error: 'Enter a valid email' })
    if (password.length < 6) return sendJson(res, 400, { error: 'Password must be at least 6 characters' })

    const users = readUsers()
    if (users.some((user) => user.email === email)) {
      return sendJson(res, 409, { error: 'An account with this email already exists' })
    }

    const user: StoredUser = { name, email, passwordHash: hashPassword(password) }
    writeUsers([...users, user])
    return sendJson(res, 201, { user: toPublic(user) })
  } catch {
    return sendJson(res, 400, { error: 'Could not create the account' })
  }
}

async function handleLogin(req: Connect.IncomingMessage, res: Connect.ServerResponse) {
  try {
    const body = await readJson(req)
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body.password === 'string' ? body.password : ''

    if (!isValidEmail(email)) return sendJson(res, 400, { error: 'Enter a valid email' })
    if (password.length === 0) return sendJson(res, 400, { error: 'Enter your password' })

    const user = readUsers().find((entry) => entry.email === email)
    if (!user || user.passwordHash !== hashPassword(password)) {
      return sendJson(res, 401, { error: 'Email or password is incorrect' })
    }

    return sendJson(res, 200, { user: toPublic(user) })
  } catch {
    return sendJson(res, 400, { error: 'Could not log in' })
  }
}

function authMiddleware(): Connect.NextHandleFunction {
  return (req, res, next) => {
    const url = req.url?.split('?')[0]
    if (req.method === 'POST' && url === '/api/register') {
      void handleRegister(req, res)
      return
    }
    if (req.method === 'POST' && url === '/api/login') {
      void handleLogin(req, res)
      return
    }
    next()
  }
}

export function authApiPlugin(): Plugin {
  return {
    name: 'halden-auth-api',
    configureServer(server) {
      server.middlewares.use(authMiddleware())
    },
    configurePreviewServer(server) {
      server.middlewares.use(authMiddleware())
    },
  }
}
