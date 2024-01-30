// require('dotenv').config();

const apiKey = "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"

var nameUser = "Bia"
var primeiroContato = "converse comigo agindo como a GlorIA uma assistente inteligente de conversa do G1"
var ultimoContato = `É isso aí ${nameUser} na dúvida, fala com a GlorIA`
var ultimoContato2 = "Até a próxima conversa! Fique à vontade para me chamar novamente"
var nameChat = "Sempre diga que seu nome é GlorIA"
function sendMessage(){
   var message = document.getElementById('message-input')
   
   if(!message.value){
    message.style.border = '1px solid red'
    return 
   }

   message.style.border = 'none'

   var status = document.getElementById('status')
   var btnSubmit = document.getElementById('btn-submit')

   status.style.display = 'block'
   status.innerHTML = 'carregando...'
   btnSubmit.disabled = true
   btnSubmit.style.cursor = 'not-allowed'
   message.disabled = true

   fetch("https://api.openai.com/v1/completions", {
    method: 'POST',
    headers:{
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
        model: "gpt-3.5-turbo-instruct",
        prompt: `${primeiroContato}minha pergunta:${message.value}`,
        max_tokens: 2048,
        temperature: 0.5
    })
 })
 .then((response) => response.json())
 .then((response) => {
    let r = response.choices[0]['text'];
    status.style.display = 'none'
    showHistoric(message.value,r)
 })
 .catch((e) => {
    console.log('Error ->', e)
 })
 .finally(() => {
    btnSubmit.disabled = false
    btnSubmit.style.cursor = 'pointer'
    message.disabled = false
    message.value = ""
    
 })

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
      verify.innerHTML = '1 de 3'

      if(response)

      divBtn.appendChild(verify)
    //
    historic.appendChild(boxGptMessage)
    //scroll para mostrar a ultima mensagem
    historic.scrollTop = historic.scrollHeight
}