"use strcit";

const axios = require("axios");
const fs = require("fs"); //注: npm i 不要

const linenotify = require('./action.js');
/*
const message = 'hogehoge'
linenotify({
  message: message,
})
*/


//データ更新関数
async function updateData(newData) {
  const PATH = "./docs/data.json";
  fs.writeFileSync(PATH, JSON.stringify(newData));
}

// 実際にデータを取得する getRequest 関数
async function getRequest() {
  let response;
  try {
    response = await axios.get(
      "https://transit.yahoo.co.jp/traininfo/detail/21/0/"
    );
    // console.log(response.data);
    let html = response.data;
    html = html.replace(/\r?\n/g, ""); //整形1: 改行などを削除して整形しやすくする

    //時間
    let jikan = html.match(/class="subText">(.*?)<\/span>/)[1];
    jikan = jikan.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, ""); //整形2: タグを削除
    //console.log(jikan);

    //運行情報
    let unko = html.match(/id="mdServiceStatus">(.*?)<\/div>/)[1];
    unko = unko.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, ""); //整形2: タグを削除
    //console.log(unko);

    // 前回のデータ
    const PATH = "./docs/data.json";
    const readTxt = fs.readFileSync(PATH, 'utf8');
    let yamanoteData = JSON.parse(readTxt);

    // 前回の情報を保持
    yamanoteData.old.date = yamanoteData.new.date;
    yamanoteData.old.msg = yamanoteData.new.msg;

    // 最新の情報に書き換え
    yamanoteData.new.date = jikan;
    yamanoteData.new.msg = unko;

    // 変更されているか確認
    if(　yamanoteData.new.date != yamanoteData.old.date ){
      console.log(yamanoteData);
      // 変更があれば更新
      const saveData = yamanoteData;
      await updateData(saveData); //データ更新関数を実行

      const message = 'yamanote.jsから'
      linenotify({
        message: message,
      })

    }
    else {
      console.log('変更なし');
      const message = 'yamanote.jsから変更なし'
      linenotify({
        message: message,
      })

    }
  }catch (error) {
    console.error(error);
  }
}

// getRequest を呼び出してデータを読み込む
getRequest();