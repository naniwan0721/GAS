function main() {
    var sheet = SpreadsheetApp.getActiveSheet(); //現在のシートを取得する。
    var data = sheet.getDataRange().getValues(); //シートの全セルのデータを取得する
    var today = new Date(); //現在の日付を取得
    var lastCol = sheet.getLastColumn(); //取得したシートの最終列の列番号を取得する。
 
    // 1行目にある名前の一覧を取得します
    var names = data[0].slice(1, lastCol); //slice(開始位置,終了位置)
    Logger.log(names);
 
    // 今日の日付と一致する一列目の日付の行を取得する
    var found = data.slice(1, data.length).filter(function (row) {
        var dueDate = row[0];
 
        return Utilities.formatDate(today, 'Asia/Tokyo', 'YYYY/MM/dd') === Utilities.formatDate(dueDate, 'Asia/Tokyo', 'YYYY/MM/dd');
    })[0];
    Logger.log(found);
 
    // 日付が一致しない時は何もしません
    if (typeof found === 'undefined') {
        return false;
    }
 
    // 未提出の名前の一覧を作成します
    var unsubmitted = [];
    found.slice(1, found.length).forEach(function (value, index) {
        if (value.length === 0) {
            unsubmitted.push(names[index]);
        }
    });
    Logger.log(unsubmitted);
    
    // 未提出の人がいる場合はSlackでメッセージを送信します
    if (unsubmitted) {
        sendMessageToSlack(Utilities.formatDate(found[0], 'Asia/Tokyo', 'YYYY/MM/dd'), unsubmitted);
    }
}
 
function sendMessageToSlack(dueDate, unsubmitted) {
    var url        = 'WebhookのURLを記載してください';
        
    var payload = {
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",　//typeをmrkdwnとすることで太字やリンクをつけることが可能
                    "text": "今月の業務時間入力は" + dueDate + "までに済ませてください。\nよろしくお願いいたします。"
                }
            },
            {
                "type": "divider" //横線だと思われる
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": ":japanese_ogre: 未対応者"
                }
            },
            {
                "type": "section",
                "fields": unsubmitted.map(function(name) {
                    return {
                        "type": "plain_text",
                        "text": name,
                        "emoji": true
                    };
                })
            }
        ]
    };
    var params = {
        "method": "post",
        "contentType": "application/json",
        "payload": JSON.stringify(payload)
    };
 
    var response = UrlFetchApp.fetch(url, params);
}
