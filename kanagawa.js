"use strcit";

const axios = require("axios");
const fs = require("fs"); //注: npm i 不要

const linenotify = require('./action.js')

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

    //市町村情報
    let ruikei = html.match(/居住地別累計(.*?)<\/tbody>/)[1];
    let shichoson = ruikei.match(/bg_blue">(.*?)<\/td>/g);
    let kazu = ruikei.match(/enter;">(.*?)<\/td>/g);
    shichoson = shichoson.map(item => item.match(/bg_blue">(.*?)<\/td>/)[1])
    kazu = kazu.map(item => item.match(/enter;">(.*?)<\/td>/)[1])
    shichoson.splice(0, 1);
    shichoson.splice(7, 1);
    //console.log(shichoson, kazu);
    const saveData = []
    //for (let i = 0,len = shichoson.length; i < len; i++) {
    //saveData[i] = {
    //    shichoson: shichoson[i],
    //   ruikei: kazu[i]
    //  }
    //}
    for (let i = 0,len = shichoson.length; i < len; i++) {
      saveData[i] = {
        [shichoson[i]]: kazu[i]
      }
    }
    //console.log(saveData[0]);

    // 前回のデータ
    const PATH = "./docs/data.json";
    const readTxt = fs.readFileSync(PATH, 'utf8');
    let kanagawaData = JSON.parse(readTxt);

    // 前回の情報を保持
    kanagawaData.old = kanagawaData.new;

    // 最新の情報に書き換え
    kanagawaData.new = saveData;
    //console.log(kanagawaData.old[0]);
    //console.log(kanagawaData.new);

    // 変更されているか確認
    //kanagawaData.new[0][shichoson[0]] = 2222;
    //console.log(kanagawaData.old[0][shichoson[0]]);
    //console.log(kanagawaData.new[0][shichoson[0]]);
    //if( !Object.is(kanagawaData.new,kanagawaData.old) ){        
    if( JSON.stringify(kanagawaData.new) != JSON.stringify(kanagawaData.old)){        
      // 変更があれば更新
      //const saveData0 = kanagawaData;
      await updateData(kanagawaData); //データ更新関数を実行
 
      const message = '神奈川県で新規感染者が確認されました'
      linenotify({
        message: message,
      })
      console.log(message);
    }
    else {
      console.log('神奈川県の感染者数の増加はありません');
     }
   }catch (error) {
     console.error(error);
   }
 }
 
 // getRequest を呼び出してデータを読み込む
 getRequest();