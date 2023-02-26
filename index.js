const axios = require('axios');
const fs = require('fs');

const guildId = ''; // substitua pelo ID do seu servidor Discord
const token = ''; // substitua pelo seu token
const headers = { 'Authorization': token };

// faz uma solicitação GET para a API Discord para obter a lista de emojis
axios.get(`https://discord.com/api/v9/guilds/${guildId}/emojis`, { headers })
  .then(response => {
    if (response.status !== 200) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
    return response.data;
  })
  .then(emojis => {
    // itera sobre a lista de emojis e salva cada emoji em um arquivo usando seu nome como nome do arquivo
    for (let i = 0; i < emojis.length; i++) {
      const emoji = emojis[i];
      const filename = `${emoji.name}.${emoji.animated ? 'gif' : 'png'}`; // usa o nome do emoji e sua extensão como nome do arquivo
      const url = `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'png'}`; // url para baixar o emoji
      axios.get(url, { responseType: 'stream' }).then(response => {
        const dest = fs.createWriteStream(filename); // cria um arquivo na pasta local com o nome do emoji
        response.data.pipe(dest); // escreve o conteúdo do emoji no arquivo
        console.log(`Emoji ${filename} baixado com sucesso`);
      }).catch(error => {
        console.error(`Erro ao baixar o emoji ${filename}: ${error}`);
      });
    }
  })
  .catch(error => {
    console.error(`Erro ao obter a lista de emojis: ${error}`);
  });
