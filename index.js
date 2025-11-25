import express from "express";
import bodyParser from "body-parser";
import makeWASocket, { fetchLatestBaileysVersion } from "@whiskeysockets/baileys";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/pair", async (req, res) => {
    try {
        const number = req.body.number;

        if (!number) return res.send("❌ Number is required");

        const jid = number.replace(/\D/g, "") + "@s.whatsapp.net";

        const { version } = await fetchLatestBaileysVersion();

        const sock = makeWASocket({
            printQRInTerminal: false,
            browser: ["TunzyShop Web Bot", "Chrome", "1.0.0"],
            version
        });

        const code = await sock.requestPairingCode(jid.replace("@s.whatsapp.net", ""));

        res.send(`
            <style>
                body { background:#0d0d0d; color:#fff; text-align:center; font-family:Arial; padding:30px; }
                .code-box {
                    background:#111; padding:20px; border-radius:12px;
                    width:90%; max-width:400px; margin:auto; box-shadow:0 0 20px #00aaff;
                }
                h1 { font-size:48px; letter-spacing:5px; color:#00ccff; }
                a { color:#00ccff; text-decoration:none; }
            </style>

            <h2>🔗 Your Pairing Code</h2>
            <div class="code-box">
                <h1>${code}</h1>
            </div>
            <br><br>
            <a href="/">⬅ Back</a>
        `);

    } catch (err) {
        res.send("❌ Error: " + err.message);
    }
});

app.listen(port, () => {
    console.log(`TunzyShop Bot Running on ${port}`);
});
