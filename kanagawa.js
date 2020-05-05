"use strcit";

const axios = require("axios");
const fs = require("fs"); //注: npm i 不要

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
      "https://www.pref.kanagawa.jp/docs/ga4/bukanshi/occurrence.html"
    );
    // console.log(response.data);
    let html = response.data;
    html = html.replace(/\r?\n/g, ""); //整形1: 改行などを削除して整形しやすくする
    //console.log(html);

    //時間
    //let jikan = html.match(/class="subText">(.*?)<\/span>/)[1];
    //jikan = jikan.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, ""); //整形2: タグを削除
    //console.log(jikan);

    //市町村情報
    let unko = html.match(/居住地別累計(.*?)<\/tbody>/)[1];
    let shichoson = unko.match(/bg_blue">(.*?)<\/td>/g);
    let kazu = unko.match(/enter;">(.*?)<\/td>/g);
    shichoson = shichoson.map(item => item.match(/bg_blue">(.*?)<\/td>/)[1])
    kazu = kazu.map(item => item.match(/enter;">(.*?)<\/td>/)[1])
    shichoson.splice(0, 1);
    shichoson.splice(7, 1);
    //console.log(shichoson, kazu);
    const saveData = []
    //for (let i = 0,len = shichoson.length; i < len; i++) {
    //saveData[i] = {
    //    shichoson: shichoson[i],
    //    ruikei: kazu[i]
    //}
    for (let i = 0,len = shichoson.length; i < len; i++) {
      saveData[i] = {
        [shichoson[i]]: kazu[i]
      }
    }
    console.log(saveData)
    //unko = unko.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, ""); //整形2: タグを削除
    //console.log(unko);

    return;


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