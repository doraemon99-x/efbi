const axios = require('axios');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

const token = '6811315556:AAEi5nftWiwFJSgK6fb6ETHdonCqaWE5S30'; // Ganti dengan token bot Anda
const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text.startsWith('/efbi')) {
        const url = text.replace('/efbi', '').trim();
        
        try {
            const videoUrl = await downloadVideoFromFacebook(url);

            // Kirim video sebagai file ke pengguna
            bot.sendVideo(chatId, videoUrl)
                .catch((error) => {
                    console.error('Gagal mengirim video:', error);
                });
        } catch (error) {
            console.error('Gagal mengunduh video:', error);
            bot.sendMessage(chatId, 'Gagal mengunduh video.');
        }
    }
});

async function downloadVideoFromFacebook(url) {
    try {
        const apiUrl = 'https://aiovideodownloader.com/api/facebook';
        
        // Buat permintaan GET dengan axios
        const response = await axios.get(apiUrl, {
            params: {
                url: url
            }
        });

        // Cek apakah permintaan sukses
        if (response.status === 200) {
            const videoUrl = response.data.sd; // Ambil URL video SD

            return videoUrl;
        } else {
            throw new Error('Gagal mendapatkan video dari API');
        }
    } catch (error) {
        console.error('Error:', error.message);
        throw error; // Melempar error untuk ditangani oleh pemanggil
    }
}
