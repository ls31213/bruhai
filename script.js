const apiKey =
  "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";
let messages = [
  {
    role: "ai",
    content: "Привет, чем могу помочь?",
  },
];


const messageslist = document.querySelector(`.messages`);
const inputmessage = document.querySelector(`.enteringamessage .inputtext`);
const inputFilemessage = document.querySelector(`.enteringamessage .inputfile`);
const sendButton = document.querySelector(`.enteringamessage svg`);
const promptinput = document.querySelector(`#promptinput`);
const modelSelect = document.querySelector('select[name="states"]');
let model = modelSelect.value;
modelSelect.addEventListener("change", () => {
  model = modelSelect.value;
});

let now = new Date();
let hours = now.getHours();
let minutes = now.getMinutes();
let time = `${hours}:${minutes}`

function addMessage(role, content) {
  let sendmessage = document.createElement(`div`);
  let prompt = `[Текущее время у юзера: ${time}]\nТвое поведение: ${promptinput.value}`;
  sendmessage.classList.add("message");

  if (role === `user`) {
    sendmessage.classList.add(`usermessage`);
  } else if (role === `ai`) {
    sendmessage.classList.add(`aimessage`);
  } else {
    sendmessage.classList.add(`systemmessage`);
  }

  let sendmessagecontent = document.createElement("p");
  sendmessagecontent.textContent = content;
  sendmessage.appendChild(sendmessagecontent);

  messageslist.appendChild(sendmessage);
  messages.push({ role: `system`, content: prompt });
  messages.push({ role: role, content: content });
  messageslist.scrollTop = messageslist.scrollHeight;
}

async function sendRequest() {
  let userMessage = inputmessage.value;
  if (userMessage === "") {
    return;
  } else {
    try {
      addMessage("user", userMessage);
      inputmessage.value = "";

      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: model,
            messages: messages,
          }),
        }
      );

      let data = await response.json();
      console.log(data)
      addMessage("ai", data.choices[0].message.content);
    } catch(error) {
      addMessage(
        "system",
        `Произошла ошибка, возможно, выбранная вами модель в данный момент недоступна. Попробуйте повторить запрос с другой моделью.`
      );
      console.error(error);
      console.log(error.message )
      
    }
  }
}
inputmessage.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendRequest();
  }
});

sendButton.addEventListener("click", sendRequest);
