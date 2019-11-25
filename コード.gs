var status_column = 6; //スプレッドシートのF列が編集された時のみ通知したい。

/**
 * メイン処理
 *
 * @param object e
 * @return void
 */
function postSheetChange(e){
  const value = getValue(e);
  
  if (value) {
    postMessage(value);
  }
}

/**
 * スプレッドシートから必要なデータを取り出す
 *
 * @param object e
 * @return data
 */
function getValue(e){
  var notifySheet = SpreadsheetApp.getActiveSpreadsheet(); //現在のスプレッドシートへアクセス 
  var active_sheet = SpreadsheetApp.getActiveSheet(); //現在のシートへアクセス 
  var my_cell = active_sheet.getActiveCell(); //選択されているセルを取得する
  var active_sheet_column = my_cell.getColumn(); //選択されたセルの列番号を取得する
  var rowNum = my_cell.getRow(); //選択されたセルの行番号を取得する
  //var name = Drive.Files.get("https://docs.google.com/spreadsheets/d/16AzlyauUx3cQMlTUDFi7479AWk4QL16JZKd_6mMev4g/edit#gid=0").lastModifyingUserName;
  /*データに値を埋め込む*/ 
  var data =
      '契約名：'+ notifySheet.getRange('C' + rowNum).getValue() + '\n' 
       +'契約会社：' + notifySheet.getRange('D' + rowNum).getValue() + '\n' 
        +'ステータス：' + notifySheet.getRange('F' + rowNum).getValue() + '\n' 
         + 'https://docs.google.com/spreadsheets/d/1Ijn9NhvxiuMRsIvV7RPZlXce21YbI3Y5aPjhOZt4BKE/edit#gid=0';
      //'契約名：'+ notifySheet.getRange('C' + rowNum).getValue() + '\n' +'契約会社：' + notifySheet.getRange('D' + rowNum).getValue() + '\n' +'ステータス：' + notifySheet.getRange('F' + rowNum).getValue() + '\n' +'最終更新者：' + name + '\n' + 'https://docs.google.com/spreadsheets/d/16AzlyauUx3cQMlTUDFi7479AWk4QL16JZKd_6mMev4g/edit#gid=0';

  /*6列目以外が更新された時は結果を返さない*/
  if (active_sheet_column !== status_column){
    return;
  }
  
  return data;
}

/**
 * スラックにPostする際の詳細の設定
 * method:メソッドの種類（get,postなど）
 * headers:ヘッダー情報
 * payload:合わせて送信する情報
 * channel:slackのチャンネル
 * attachment:slackに付与する情報
 * UrlFetchApp.fetch(アドレス, オプション)
 * @param string value
 * @return void
 */
function postMessage(value){
  var options = {
    'method': 'post',
    'headers': {'Content-type': 'application/json'},
    'payload' : JSON.stringify({
    'channel' : '@naniwa',
      'attachments':[
       {                                                              
        'fallback': '契約一覧アップデート通知',
        'color': '#36a64f',
        'title': '契約一覧のステータスを更新しました',
        'title_link': 'https://docs.google.com/spreadsheets/d/1Ijn9NhvxiuMRsIvV7RPZlXce21YbI3Y5aPjhOZt4BKE/edit#gid=0',
        'text': value,
       }
      ]
    })
  };
  UrlFetchApp.fetch("https://hooks.slack.com/services/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", options);  
 }

/**
 * スラックにPostする際の詳細の設定
 *
 * @return attachment
 */
function formatMessage(){
  var attachments = [{
     color: '#36a64f',
     text: '',
    }]; 
  return attachments;
}
