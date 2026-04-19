const mineflayer = require("mineflayer")
const express = require("express")

let bot
let moveInterval
let chatInterval
let lookInterval

function startBot() {
  console.log("Đang khởi động bot...")

  bot = mineflayer.createBot({
    host: "darkblademc.joinmc.world",
    port: 20674,
    username: "HexMine_24h7",
    version: "1.20.1"
  })

  bot.once("spawn", () => {
    console.log("Bot đã vào world")

    // FIX: NHẢY 1 GIÂY / 1 LẦN VÀ DI CHUYỂN
    moveInterval = setInterval(() => {
      if (!bot.entity) return

      const actions = ["forward", "back", "left", "right"]
      const action = actions[Math.floor(Math.random() * actions.length)]

      bot.clearControlStates()
      bot.setControlState(action, true)

      // Nhảy mỗi giây
      bot.setControlState("jump", true)

      setTimeout(() => {
        bot.setControlState("jump", false)
        bot.clearControlStates()
      }, 500) // Nhảy lên 0.5s rồi hạ xuống

      bot.swingArm()

    }, 1000) // Chạy lại mỗi 1000ms (1 giây)

    // FIX: XOAY ĐẦU MƯỢT MÀ HƠN
    lookInterval = setInterval(() => {
      if (!bot.entity) return
      
      const yaw = Math.random() * Math.PI * 2
      const pitch = (Math.random() - 0.5) * 0.5

      // Đổi sang 'false' để bot xoay đầu từ từ cho giống người
      bot.look(yaw, pitch, false) 

    }, 1500) // Xoay đầu nhanh hơn một chút (mỗi 1.5 giây)

    const messages = ["hello", "hi everyone", "nice server", "anyone online?", "im here", "lol"]
    chatInterval = setInterval(() => {
      const msg = messages[Math.floor(Math.random() * messages.length)]
      bot.chat(msg)
    }, 90000)
  })

  // XỬ LÝ ĐĂNG NHẬP / ĐĂNG KÝ
  bot.on("messagestr", (msg) => {
    const message = msg.toLowerCase();
    if (message.includes("đăng ký") || message.includes("register")) {
      bot.chat("/register thienmakeios123 thienmakeios123");
      console.log("=> Đã gửi lệnh register: thienmakeios123");
    } 
    else if (message.includes("đăng nhập") || message.includes("login")) {
      bot.chat("/login thienmakeios123");
      console.log("=> Đã gửi lệnh login: thienmakeios123");
    }
  })

  bot.on("end", () => {
    console.log("Bot mất kết nối, reconnect sau 10s...")
    clearInterval(moveInterval)
    clearInterval(chatInterval)
    clearInterval(lookInterval)
    setTimeout(startBot, 10000)
  })

  bot.on("error", (err) => console.log("Lỗi:", err.message))
  bot.on("kicked", (reason) => console.log("Bot bị kick:", reason))
}

startBot()

const app = express()
app.get("/", (req, res) => res.send("Bot Minecraft đang chạy"))
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log("Web server chạy port", PORT))
