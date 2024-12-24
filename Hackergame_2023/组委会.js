var d = new Date();
var tick1 = d.getTime();
fetch("http://202.38.93.111:10021/api/getMessages", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2"
    },
    "referrer": "http://202.38.93.111:10021/",
    "method": "POST",
    "mode": "cors"
}).then((response) => response.json())
  .then((data) => {
    for(i in data["messages"])
        {
            var msg = data["messages"][i]["text"];
	var delay = data["messages"][i]["delay"];
          	if(msg)
              {
				var n = msg.search(/hack\[[a-zA-Z]+\]/);
				if (n >= 0)
				{
					setTimeout(deletemsg, parseInt(delay*1000), i, msg);
                }
            }
        }
})

function deletemsg(id, msg)
{
  console.debug(msg)
  fetch("http://202.38.93.111:10021/api/deleteMessage", {
		"credentials": "include",
		"headers": {
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
			"Accept": "application/json, text/plain, */*",
			"Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
			"Content-Type": "application/json"
		},
		"referrer": "http://202.38.93.111:10021/",
		"body": "{\"id\":"+id+"}",
		"method": "POST",
		"mode": "cors"
	});
}