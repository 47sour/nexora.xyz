const { createServer } = require("http")
const next = require("next")
const { Server } = require("socket.io")
const mysql = require("mysql2/promise")
const jwt = require("jsonwebtoken")

const dev = process.env.NODE_ENV !== "production"
const hostname = "localhost"
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

function parseCookies(cookieHeader = "") {
  return cookieHeader.split(";").reduce((cookies, cookie) => {
    const [name, ...rest] = cookie.trim().split("=")
    if (!name) return cookies
    cookies[name] = decodeURIComponent(rest.join("="))
    return cookies
  }, {})
}

app.prepare().then(async () => {
  const httpServer = createServer(handle)

  const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      credentials: true,
    },
  })

  io.use(async (socket, nextMiddleware) => {
    try {
      const cookies = parseCookies(socket.handshake.headers.cookie)
      const token = cookies.nexora_token

      if (!token) {
        return nextMiddleware(new Error("Not authenticated"))
      }

      const tokenUser = jwt.verify(token, process.env.JWT_SECRET)

      const [rows] = await db.query(
        `SELECT id, username, email, role, xp, level, status
         FROM users
         WHERE id = ?
         LIMIT 1`,
        [tokenUser.id]
      )

      if (!Array.isArray(rows) || rows.length === 0) {
        return nextMiddleware(new Error("User not found"))
      }

      socket.user = rows[0]
      nextMiddleware()
    } catch (error) {
      nextMiddleware(new Error("Invalid session"))
    }
  })

  io.on("connection", async (socket) => {
    const user = socket.user

    try {
      await db.query("UPDATE users SET status = 'online' WHERE id = ?", [user.id])
      socket.broadcast.emit("user:status", {
        userId: user.id,
        status: "online",
      })

      const [messages] = await db.query(
        `SELECT
          m.id,
          m.sender_id AS senderId,
          u.username AS senderUsername,
          u.level AS senderLevel,
          m.content,
          m.created_at AS createdAt
        FROM global_chat_messages m
        INNER JOIN users u ON u.id = m.sender_id
        ORDER BY m.created_at DESC
        LIMIT 50`
      )

      socket.emit("global:history", messages.reverse())
    } catch (error) {
      socket.emit("global:error", "Chat history konnte nicht geladen werden.")
    }

    socket.on("global:message", async (payload) => {
      try {
        const content = String(payload?.content || "").trim()

        if (!content || content.length > 500) {
          socket.emit("global:error", "Nachricht ist ungültig.")
          return
        }

        const [result] = await db.query(
          `INSERT INTO global_chat_messages (sender_id, content)
           VALUES (?, ?)`,
          [user.id, content]
        )

        const message = {
          id: result.insertId,
          senderId: user.id,
          senderUsername: user.username,
          senderLevel: user.level,
          content,
          createdAt: new Date().toISOString(),
        }

        io.emit("global:message", message)
      } catch (error) {
        socket.emit("global:error", "Nachricht konnte nicht gesendet werden.")
      }
    })

    socket.on("disconnect", async () => {
      try {
        await db.query("UPDATE users SET status = 'offline' WHERE id = ?", [user.id])
        socket.broadcast.emit("user:status", {
          userId: user.id,
          status: "offline",
        })
      } catch {}
    })
  })

  httpServer.listen(port, () => {
    console.log(`Ready on http://${hostname}:${port}`)
  })
})