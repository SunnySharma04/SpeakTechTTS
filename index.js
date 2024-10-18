const textarea = document.querySelector("textarea"),
  voicelist = document.querySelector("select"),
  speechbtn = document.querySelector("button"),
  resetbtn = document.getElementById("reset");

let synth = speechSynthesis;
let isSpeaking = true;

// Fetch and filter voices for English and Hindi
function voiceSpeech() {
  const voices = synth.getVoices().filter(voice => {
    return voice.lang === 'en-US' || voice.lang === 'hi-IN';
  });

  voices.forEach(voice => {
    let selected = voice.name === "Google US English" ? "selected" : "";
    let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
    voicelist.insertAdjacentHTML("beforeend", option);
  });
}

synth.addEventListener("voiceschanged", voiceSpeech);

function textToSpeech(text) {
  let utterance = new SpeechSynthesisUtterance(text);
  const selectedVoice = voicelist.value;

  for (let voice of synth.getVoices()) {
    if (voice.name === selectedVoice) {
      utterance.voice = voice;
    }
  }
  synth.speak(utterance);
}

speechbtn.addEventListener("click", (event) => {
  event.preventDefault();
  if (textarea.value !== "") {
    if (!synth.speaking) {
      synth.cancel();
      setTimeout(() => {
        textToSpeech(textarea.value);
      }, 500);
    }
    if (textarea.value.length > 80) {
      setInterval(() => {
        if (!synth.speaking && !isSpeaking) {
          isSpeaking = true;
          speechbtn.innerText = "Convert To Speech";
        }
      }, 500);
      if (isSpeaking) {
        synth.resume();
        isSpeaking = false;
        speechbtn.innerText = "Pause Speech";
        resetbtn.style.display = "none";
      } else {
        synth.pause();
        isSpeaking = true;
        speechbtn.innerText = "Resume Speech";
        resetbtn.style.display = "flex";
      }
    } else {
      speechbtn.innerText = "Convert To Speech";
    }
  }
});

resetbtn.addEventListener("click", (event) => {
  event.preventDefault();
  resetEverything();
});

function resetEverything() {
  synth.cancel();
  isSpeaking = true;

  textarea.value = "";
  speechbtn.innerText = "Convert To Speech";
  resetbtn.style.display = "none";
}
