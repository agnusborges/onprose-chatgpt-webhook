const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/webhook", async (req, res) => {
  const userMessage = req.body.message || "";
  if (!userMessage) return res.status(400).send({ error: "Mensagem ausente" });

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    res.send({ reply });
  } catch (error) {
    res.status(500).send({ error: "Erro ao acessar o ChatGPT" });
  }
});

app.get("/", (_, res) => {
  res.send("Webhook rodando!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
