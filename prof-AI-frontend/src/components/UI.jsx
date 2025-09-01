import { useEffect,useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import { FaMicrophone, FaStop } from "react-icons/fa";
// import logo from "prof-AI-frontend/public/prof-ai-logo_1755775207766.avif";

export const UI = ({ hidden, ...props }) => {
  const input = useRef();
  const [chatHistory, setChatHistory] = useState([]);
  const { chat, loading, cameraZoomed, setCameraZoomed, message } = useChat();
  const [showChat, setShowChat] = useState(true);
  const [showSyllabus, setShowSyllabus] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const SUPPORTED_LANGUAGES = [
    { "code": "en-IN", "name": "English" },
    { "code": "hi-IN", "name": "Hindi" },
    { "code": "bn-IN", "name": "Bengali" },
    { "code": "mr-IN", "name": "Marathi" },
    { "code": "ta-IN", "name": "Tamil" },
    { "code": "te-IN", "name": "Telugu" },
    { "code": "kn-IN", "name": "Kannada" },
    { "code": "ml-IN", "name": "Malayalam" },
    { "code": "gu-IN", "name": "Gujarati" },
    { "code": "pa-IN", "name": "Punjabi" },
    { "code": "ur-IN", "name": "Urdu" }
  ];

  const [selectedLanguage, setSelectedLanguage] = useState(SUPPORTED_LANGUAGES[0]);


const [syllabusData, setSyllabusData] = useState(null);
const [syllabusLoading, setSyllabusLoading] = useState(false);
const [syllabusError, setSyllabusError] = useState("");
const [selectedWeek, setSelectedWeek] = useState(null);
const [openSubIndex, setOpenSubIndex] = useState(null);


//fetch syllabus
// FETCH from your API
useEffect(() => {
  const controller = new AbortController();
  const fetchSyllabus = async () => {
    try {
      setSyllabusLoading(true);
      setSyllabusError("");

      const url = "http://127.0.0.1:5001/api/course/1";
      const res = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
      const data = await res.json();

      // expecting: { course_title, course_id, modules: [{ week, title, sub_topics: [{ title, content }] }] }
      setSyllabusData(data);
      setSelectedWeek(data?.modules?.[0]?.week ?? null);
    } catch (e) {
      if (e.name !== "AbortError") setSyllabusError(e.message || "Failed to load syllabus");
    } finally {
      setSyllabusLoading(false);
    }
  };

  fetchSyllabus();
  return () => controller.abort();
}, []);

  let recognition = null;

  const sendMessage = async (textToSend = inputValue) => {
    const text = textToSend.trim();
    if (!loading && !message && text !== "") {
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: "user", text: text },
      ]);
      setInputValue("");
      
      // Pass the selected language code to the chat function
      const aiResponse = await chat(text, selectedLanguage.code);
      
      console.log(aiResponse);
      const arr = Array.isArray(aiResponse) ? aiResponse : [aiResponse];
      arr.forEach((m) => {
        const aiText = m?.text ?? "";
        if (aiText) {
          setChatHistory((prev) => [...prev, { sender: "ai", text: aiText }]);
        }
      });
    }
  };

  const handleMicClick = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isRecording) {
      if (recognition) {
        recognition.stop();
      }
    } else {
      recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      // Set the recognition language based on selected state
      recognition.lang = selectedLanguage.code;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecording(true);
        console.log("Recording started...");
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("Transcript:", transcript);
        setInputValue(transcript);
        sendMessage(transcript);
      };

      recognition.onend = () => {
        setIsRecording(false);
        console.log("Recording ended.");
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognition.start();
    }
  };

  if (hidden) {
    return null;
  }

  const avatarWidthClass = () => {
    if (!showChat && !showSyllabus) {
      return "w-full";
    }
    if (showChat && !showSyllabus) {
      return "w-3/5";
    }
    if (!showChat && showSyllabus) {
      return "w-4/5";
    }
    return "w-3/5";
  };

// STOP BUTTON
  const stopSpeaking = () => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel(); // stop TTS voice
  }
  // if you track avatar talking state from useChat, reset it:
  // e.g., setCameraZoomed(false) or a setIsSpeaking(false) if you have that state
  console.log("Stopped speaking and avatar reset");
  };  

  const currentModule = syllabusData?.modules?.find(m => m.week === selectedWeek);
  
  return (
    <div className="flex w-full h-screen -z-100 text-white p-4">
      {/* ====== SYLLABUS (API) ====== */}
      {showSyllabus && (
        <div className="w-2/5 bg-gray-800 rounded-md p-4 overflow-auto">
          <h2 className="text-xl font-bold mb-4">Syllabus</h2>

          {/* Week selector */}
          <div className="flex flex-wrap gap-2 mb-4">
            {syllabusData?.modules?.map((m) => (
              <button
                key={m.week}
                onClick={() => { setSelectedWeek(m.week); setOpenSubIndex(null); }}
                className={`px-3 py-1 rounded-md border
                  ${selectedWeek === m.week ? "bg-pink-500 border-pink-400" : "bg-gray-700 border-gray-600 hover:bg-gray-600"}`}
              >
                Week {m.week}
              </button>
            ))}
          </div>

          {syllabusLoading && <div className="text-gray-300">Loading syllabus…</div>}
          {syllabusError && <div className="text-red-400">Error: {syllabusError}</div>}

          {!syllabusLoading && !syllabusError && currentModule && (
            <div className="space-y-3">
              <div className="text-lg font-semibold">{currentModule.title}</div>
              <div className="space-y-2">
                {currentModule.sub_topics?.map((st, idx) => {
                  const open = openSubIndex === idx;
                  return (
                    <div key={idx} className="rounded-md border border-gray-700 overflow-hidden">
                      <button
                        className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 flex justify-between items-center"
                        onClick={() => setOpenSubIndex(open ? null : idx)}
                      >
                        <span className="text-sm font-medium">{st.title}</span>
                        <span className="text-xs">{open ? "−" : "+"}</span>
                      </button>
                      {open && (
                        <div className="px-3 py-3 bg-gray-900 text-sm text-gray-200 space-y-2">
                          {/* Use ReactMarkdown if you want rendered markdown */}
                          {/* <ReactMarkdown>{st.content || ""}</ReactMarkdown> */}
                          <pre className="whitespace-pre-wrap">{st.content || ""}</pre>

                          <div className="flex gap-2">
                            <button
                              onClick={() => sendMessage(`Explain: ${st.title}`)}
                              className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-md text-xs"
                            >
                              Ask about this
                            </button>
                            <button
                              onClick={() => setInputValue(`Summarize "${st.title}" for me`)}
                              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-xs"
                            >
                              Draft a question
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      





      <div
        className={`w-1/5 flex flex-col justify-center items-center relative transition-all duration-500
          ${avatarWidthClass()}
        `}
      >
        <div id="avatar-container" className="h-full w-full relative">
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 ">
            <img src="/PROF.AI (2).png" alt="Your Company Logo" className="w-auto h-36 " />
          </div>
        </div>

        <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
          <button
            onClick={() => setCameraZoomed(!cameraZoomed)}
            className="pointer-events-auto bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-md"
          >
            {cameraZoomed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                />
              </svg>
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="pointer-events-auto bg-gray-800 hover:bg-gray-700 text-white h-10 w-14 rounded-md"
            >Lang
              {/* <svg
                xmlns="https://cdn.iconscout.com/icon/premium/png-256-thumb/dropdown-icon-svg-png-download-1346254.png"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6a.75.75 0 0 0 1.5 0V6Zm-.75 12a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                  clipRule="evenodd"
                />
              </svg> */}
            </button>
            {showLanguageDropdown && (
              <div className="absolute top-12 right-0 w-40 bg-gray-700 rounded-md shadow-lg z-30">
                <ul className="py-1">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <li
                      key={lang.code}
                      onClick={() => {
                        setSelectedLanguage(lang);
                        setShowLanguageDropdown(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-600 cursor-pointer"
                    >
                      {lang.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {showChat && (
        <div className="w-2/5 bg-gray-800 rounded-md p-4 flex flex-col justify-between">
          <div className="flex-grow overflow-auto mb-4">
            <h2 className="text-xl font-bold mb-4">Chat</h2>
            <div className="space-y-4">
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-pink-500 text-white"
                        : "bg-white text-gray-900"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              className="w-full placeholder:text-gray-400 p-2 rounded-md bg-gray-700 text-white"
              placeholder="Type a message..."
              ref={input}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />
            <button
              onClick={handleMicClick}
              className={`bg-pink-500 hover:bg-pink-600 text-white p-2 px-3 rounded-md ${
                isRecording ? "animate-pulse" : ""
              }`}
            >
              {isRecording ? <FaStop /> : <FaMicrophone />}
            </button>

            {/* NEW: Stop button */}
            {/* <button
              onClick={stopSpeaking}
              className="bg-gray-700 hover:bg-gray-600 text-white p-2 px-4 rounded-md"
            >
              Stop
            </button> */}
            <button
              disabled={loading || message || !inputValue.trim()}
              onClick={() => sendMessage()}
              className={`bg-pink-500 hover:bg-pink-600 text-white p-2 px-6 rounded-md ${
                loading || message || !inputValue.trim()
                  ? "cursor-not-allowed opacity-30"
                  : ""
              }`}
            >
              Send
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowChat(!showChat)}
        className="pointer-events-auto bg-gray-800 hover:bg-gray-700 text-white p-4 rounded-md absolute top-4 right-4 z-20"
      >
        {showChat ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 12c0-.528-.158-1.034-.452-1.474s-.734-.82-1.268-1.057l-1.637-.732a3.812 3.812 0 00-2.324-2.732c-.28-.53-.473-.82-.686-.884-.213-.064-.441-.098-.654-.098-.213 0-.441.034-.654.098-.213.064-.406.354-.686.884a3.812 3.812 0 00-2.324 2.732l-1.637.732c-.534.237-.99.593-1.268 1.057s-.452.946-.452 1.474v2.152c0 .546.19.98.508 1.12l.84.56c.264.095.556.14.85.14.294 0 .586-.045.85-.14l.84-.56c.318-.14.508-.574.508-1.12v-2.152a.75.75 0 011.5 0v2.152c0 .546.19.98.508 1.12l.84.56c.264.095.556.14.85.14.294 0 .586-.045.85-.14l.84-.56c.318-.14.508-.574.508-1.12v-2.152a.75.75 0 011.5 0z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12.76c0 1.258.855 2.302 2.152 2.766l.872.31c.21.075.433.114.656.114.484 0 .958-.15 1.353-.418L9 15.688v-2.17a3.81 3.81 0 002.324-2.732c.28-.53.473-.82.686-.884.213-.064.441-.098.654-.098.213 0 .441.034.654.098.213.064.406.354.686.884a3.81 3.81 0 002.324 2.732v2.17l-.84.56a2.152 2.152 0 01-1.353.418c-.223 0-.446-.039-.656-.114l-.872-.31c-1.297-.464-2.152-1.508-2.152-2.766v-2.152a.75.75 0 011.5 0v2.152c0 .546.19.98.508 1.12l.84.56c.264.095.556.14.85.14.294 0 .586-.045.85-.14l.84-.56c.318-.14.508-.574.508-1.12v-2.152a.75.75 0 011.5 0z"
            />
          </svg>
        )}
      </button>
    </div>
  );
};