const axios = require('axios');
const qs = require('querystring');

const LINE_NOTIFY_API_URL = 'https://notify-api.line.me/api/notify';
const LINE_NOTIFY_TOKEN = process.env.LINE_TOKEN;

let config = {
    url: LINE_NOTIFY_API_URL,
    method: 'post',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + LINE_NOTIFY_TOKEN
    },
    data: qs.stringify({
        message: 'ProtoOut Studioからの通知だよー！',
    })
}

module.exports = async function(postData){
    config.data = qs.stringify(postData)
    const response = await axios.request(config);
    console.log(response.data);
}