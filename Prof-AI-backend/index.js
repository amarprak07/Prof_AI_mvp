import { exec } from "child_process";
import cors from "cors";
import dotenv from "dotenv";
import voice from "elevenlabs-node";
import express from "express";
import { promises as fs } from "fs";
import OpenAI from "openai";
import path from "path";
import ffmpeg from "ffmpeg";
const rhubarbPath = path.resolve("bin", "rhubarb.exe");
dotenv.config();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY || "-", // Your OpenAI API key here, I used "-" to avoid errors when the key is not set but you should not do that
// });

const elevenLabsApiKey = "your_api_key";
const voiceID = "Xb7hH8MSUJpSbSDYk0k2";

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/voices", async (req, res) => {
  res.send(await voice.getVoices(elevenLabsApiKey));
});

const execCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(error);
      resolve(stdout);
    });
  });
};

const lipSyncMessage = async (message) => {
  const rhubarbPath = path.resolve("./bin/rhubarb.exe");
  const time = new Date().getTime();
  await execCommand(
    `ffmpeg -y -i audios/message_${message}.mp3 audios/message_${message}.wav`
  );
  await execCommand(
    `"${rhubarbPath}" -f json -o audios/message.json audios/message_${message}.wav -r phonetic`
  );
};

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  const langCode = req.body.language;
  if (!userMessage) {
    res.send({
      messages: [
        {
          text: "Hello rohit.good afternoon. I am your new professor AI. Let's together democratize the education industry.",
          audio: await audioFileToBase64("audios/intro_0.wav"),
          lipsync: await readJsonTranscript("audios/intro_0.json"),
          facialExpression: "smile",
          animation: "Talking_1",
        }
      ],
    });
    return;
  }

  // keys not added 

  // if (!elevenLabsApiKey || openai.apiKey === "-") {
  //   res.send({
  //     messages: [
  //       {
  //         text: "Please my dear, don't forget to add your API keys!",
  //         audio: await audioFileToBase64("audios/api_0.wav"),
  //         lipsync: await readJsonTranscript("audios/api_0.json"),
  //         facialExpression: "angry",
  //         animation: "Angry",
  //       },
  //       {
  //         text: "You don't want to ruin Wawa Sensei with a crazy ChatGPT and ElevenLabs bill, right?",
  //         audio: await audioFileToBase64("audios/api_1.wav"),
  //         lipsync: await readJsonTranscript("audios/api_1.json"),
  //         facialExpression: "smile",
  //         animation: "Laughing",
  //       },
  //     ],
  //   });
  //   return;
  // }


  //code to dfetch message from chatgpt

  // const completion = await openai.chat.completions.create({
  //   model: "gpt-3.5-turbo-1106",
  //   max_tokens: 1000,
  //   temperature: 0.6,
  //   response_format: {
  //     type: "json_object",
  //   },
  //   messages: [
  //     {
  //       role: "system",
  //       content: `
  //       You are a virtual girlfriend.
  //       You will always reply with a JSON array of messages. With a maximum of 3 messages.
  //       Each message has a text, facialExpression, and animation property.
  //       The different facial expressions are: smile, sad, angry, surprised, funnyFace, and default.
  //       The different animations are: Talking_0, Talking_1, Talking_2, Crying, Laughing, Rumba, Idle, Terrified, and Angry. 
  //       `,
  //     },
  //     {
  //       role: "user",
  //       content: userMessage || "Hello",
  //     },
  //   ],
  // });



  // Make the POST request to the local API


  console.log(langCode);

  let apiResponse;
  try {
    const response = await fetch("http://127.0.0.1:5001/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
        language: langCode,
      }),
    });
    apiResponse = await response.json();
  } catch (error) {
    console.error("Error calling the local API:", error);
    return res.status(500).send({ error: "Failed to get a response from the local API." });
  }





  // console.log(apiResponse.audio);

  // const baseaud = apiResponse.audio;
  // const audioBytes = atob(baseaud);
  // const audioArray = new Uint8Array(audioBytes.length);
  // for (let i = 0; i < audioBytes.length; i++) {
  //     audioArray[i] = audioBytes.charCodeAt(i);
  // }
  // const audioBlob = new Blob([audioArray], { type: 'audio/wav' });



  let messages = [
  {
    text: apiResponse.answer, //// this message is to be received from the fahad's file
    facialExpression: "default",
    animation: "Talking_1",
  },
];

  // let messages = JSON.parse(completion.choices[0].message.content);
  if (messages.messages) {
    messages = messages.messages; // ChatGPT is not 100% reliable, sometimes it directly returns an array and sometimes a JSON object with a messages property
  }
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    // generate audio file
    const fileName = `audios/message_${i}.mp3`; // The name of your audio file
    const textInput = message.text; // The text you wish to convert to speech
    await voice.textToSpeech(elevenLabsApiKey, voiceID, fileName, textInput);
    // generate lipsync
    await lipSyncMessage(i);
    message.audio = await audioFileToBase64(fileName);
    message.lipsync = await readJsonTranscript(`audios/message.json`);
  }

  res.send({ messages });
});

const readJsonTranscript = async (file) => {
  const data = await fs.readFile(file, "utf8");
  return JSON.parse(data);
};

const audioFileToBase64 = async (file) => {
  const data = await fs.readFile(file);
  return data.toString("base64");
};

app.listen(port, () => {
  console.log(`Professor AI on port ${port}`);
});
