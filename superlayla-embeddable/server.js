import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import OpenAI from 'openai';
const openai = new OpenAI({
	apiKey: process.env.OPENAI,
});

const app = express();
app.use(express.json());

const port = process.env.PORT || 3001;

// Global Settings
const temp = 0.7;
const tokens = 2048;
const frequency = 0.1;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06',
      messages: [{ role: 'user', content: message }],
      temperature: temp,
			max_tokens: tokens,
			frequency_penalty: frequency,
    });

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).send('Error generating response');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
