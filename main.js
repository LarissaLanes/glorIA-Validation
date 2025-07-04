// require('dotenv').config();

const apiKey = "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"

var mensagem1 = "Olá! Eu sou a GlorIA, a assistente inteligente de conversa do G1. Fico feliz em poder ajudá-lo com as suas dúvidas e informações sobre notícias e atualidades. Como posso ser útil para você hoje?"
var primeiroContato = "Converse como se vc fosse a GlorIA uma assistente inteligente de conversa do G1"
//
let messageCount = 0;
var messageLogin = false

let newsData; // Declare newsData outside functions

fetch('./DB.json')
  .then(response => response.json())
  .then(data => {
    newsData = data.newsData;

    // Now you can use newsData in your functions
    sendMessage();
    // ...
  })
  .catch(error => console.error('Error loading DB.json:', error));



function sendMessage(){
   var message = document.getElementById('message-input')
   
   if(!message.value){
    message.style.border = '1px solid red'
    return 
   }

   message.style.border = 'none'

   var status = document.getElementById('status')
   var btnSubmit = document.getElementById('btn-submit')
   var loginText = document.getElementById('loginText')

   status.style.display = 'block'
   status.innerHTML = 'carregando...'
//    btnSubmit.disabled = true
//    btnSubmit.style.cursor = 'not-allowed'
//    message.disabled = true

   loginText.style.display = 'none'

   messageCount++;

   if (messageCount >= 3) {
    messageLogin = true
    }

    const matchedNews = newsData.find(news => news.title.toLowerCase() === message.value.toLowerCase());

    if (matchedNews) {
        // Se corresponder, usar o conteúdo da notícia como resposta
        status.style.display = 'none';
        showHistoric(message.value, matchedNews.content);
        document.getElementById('message-input').value = '';

        if(messageLogin == true){
            loginText.style.display = 'block'
            button.disabled = true;
            button.style.cursor = 'not-allowed';
                    message.disabled = true

        }
    } else {
   fetch("https://api.openai.com/v1/completions", {
    method: 'POST',
    headers:{
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
        model: "gpt-3.5-turbo-instruct",
        prompt: `${primeiroContato}${message.value}`,
        max_tokens: 2048,
        temperature: 0.5
    })
 })
 .then((response) => response.json())
 .then((response) => {
    let r = response.choices[0]['text'];
    status.style.display = 'none'
    showHistoric(message.value,r)

    if(messageLogin == true){
        loginText.style.display = 'block'
        button.disabled = true;
        button.style.cursor = 'not-allowed';
        message.disabled = true
            
    }
 })
 .catch((e) => {
    console.log('Error ->', e)
 })
 .finally(() => {
    // btnSubmit.disabled = false
    btnSubmit.style.cursor = 'pointer'
    document.getElementById('message-input').value = '';
    // message.disabled = false
 })
}
}

//envio a partir do botao da lista

function sendMessageFromButton(prompt) {
    var status = document.getElementById('status')
    var loginText = document.getElementById('loginText')
    var btnMessageSend = document.querySelectorAll('.filterGpt button');

    status.style.display = 'block'
    status.innerHTML = 'carregando...'
    loginText.style.display = 'none'

    messageCount++;

   if (messageCount >= 3) {
    messageLogin = true    
    }


    const matchedNews = newsData.find(news => news.title.toLowerCase() === prompt.toLowerCase());

    if (matchedNews) {
        // Se corresponder, usar o conteúdo da notícia como resposta
        status.style.display = 'none';
        showHistoric(prompt, matchedNews.content);

        if(messageLogin == true){
            loginText.style.display = 'block'
            btnMessageSend.forEach(button => {
                button.disabled = true;
                button.style.cursor = 'not-allowed';
            });
            return
        }

    } else {

    fetch("https://api.openai.com/v1/completions", {
        method: 'POST',
        headers:{
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo-instruct",
            prompt: `${primeiroContato}${prompt}`,
            max_tokens: 2048,
            temperature: 0.5
        })
    })
    .then((response) => response.json())
    .then((response) => {
        let r = response.choices[0]['text'];
        status.style.display = 'none'
        showHistoric(prompt, r);

        if(messageLogin == true){
            loginText.style.display = 'block'
            btnMessageSend.forEach(button => {
                button.disabled = true;
                button.style.cursor = 'not-allowed';
            });
            return
        }
    })
    .catch((e) => {
        console.log('Error ->', e);
    });
}
}

function showHistoric(message, response){
    var historic = document.getElementById('historic')

    //mensagens do usuario
    var boxUserMessage = document.createElement('div')
    boxUserMessage.className = 'box-user-message'

    var userMessage = document.createElement('p')
    userMessage.className = 'userMessage'
    userMessage.innerHTML = message

    boxUserMessage.appendChild(userMessage)
    historic.appendChild(boxUserMessage)

    //mensagem do GPT
    var boxGptMessage = document.createElement('div')
    boxGptMessage.className = 'box-gpt-message'

    var gptMessage = document.createElement('p')
    gptMessage.className = 'gptMessage'
    gptMessage.innerHTML = response

    boxGptMessage.appendChild(gptMessage)

     //div do bottao e da verificacao de 3 perguntas 
     var divBtn = document.createElement('div');
     divBtn.className = 'divBtn'
 
     boxGptMessage.appendChild(divBtn)

    //speech ====>
    let speech = new SpeechSynthesisUtterance();
    let voices = [];
    let voiceSelect = document.querySelector('select');

    window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        speech.voice = voices[0];

         // Limpa as opções existentes
    voiceSelect.innerHTML = '';

        voices.forEach((voice, i) => 
        (voiceSelect.options[i] = new Option(voice.name, i)));
    };

    voiceSelect.addEventListener('change',() => {
        speech.voice = voices[voiceSelect.value];
    });

      //text-to-speech
      var listenButton = document.createElement('button');
      listenButton.className = 'btn-listem'
      listenButton.innerHTML = 'Ouvir';
      listenButton.addEventListener('click', function() {
  
          speech.text = response;
          window.speechSynthesis.speak(speech);
  
      });

    divBtn.appendChild(listenButton);

      //veridicacao 

      var verify = document.createElement('p')
      verify.className = 'verify-p'
      verify.innerHTML = `${messageCount} de 3`

      divBtn.appendChild(verify)
    //
    
    historic.appendChild(boxGptMessage)
    //scroll para mostrar a ultima mensagem
    historic.scrollTop = historic.scrollHeight
}

function startRecording() {
    const messageInput = document.getElementById('message-input');
        const btnSubmit = document.getElementById('btn-submit');
        const btnSpeechToText = document.getElementById('btn-speech-to-text');
        let recognition = new webkitSpeechRecognition();

    recognition.lang = 'pt-BR'; // Defina o idioma desejado
    recognition.start();

    recognition.onresult = function(event) {
        if (event.results.length > 0) {
            const transcript = event.results[0][0].transcript;
            messageInput.value = transcript;
        }
    };

    //envia a mensagem sem o clique do botao
    // recognition.onend = function() {
    //     btnSubmit.click(); // Envie automaticamente após o reconhecimento de voz
    // };
}