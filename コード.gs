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
  var notifySheet = SpreadsheetApp.getActiveSpreadsheet(); 
  var active_sheet = SpreadsheetApp.getActiveSheet();
  var my_cell = active_sheet.getActiveCell();
  var active_sheet_column = my_cell.getColumn();
  var rowNum = my_cell.getRow();
  //var name = Drive.Files.get("https://docs.google.com/spreadsheets/d/16AzlyauUx3cQMlTUDFi7479AWk4QL16JZKd_6mMev4g/edit#gid=0").lastModifyingUserName;
  var data =
      '契約名：'+ notifySheet.getRange('C' + rowNum).getValue() + '\n' 
       +'契約会社：' + notifySheet.getRange('D' + rowNum).getValue() + '\n' 
        +'ステータス：' + notifySheet.getRange('F' + rowNum).getValue() + '\n' 
         + 'https://docs.google.com/spreadsheets/d/1Ijn9NhvxiuMRsIvV7RPZlXce21YbI3Y5aPjhOZt4BKE/edit#gid=0';
      //'契約名：'+ notifySheet.getRange('C' + rowNum).getValue() + '\n' +'契約会社：' + notifySheet.getRange('D' + rowNum).getValue() + '\n' +'ステータス：' + notifySheet.getRange('F' + rowNum).getValue() + '\n' +'最終更新者：' + name + '\n' + 'https://docs.google.com/spreadsheets/d/16AzlyauUx3cQMlTUDFi7479AWk4QL16JZKd_6mMev4g/edit#gid=0';

  
  if (active_sheet_column !== status_column){
    return;
  }
  
  return data;
}

/**
 * スラックにPostする際の詳細の設定
 *
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
