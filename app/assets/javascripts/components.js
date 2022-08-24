/**
 * 初始化对话框控件
 */
function initDialog() {
	$('.dialog .close').on('click', function() {
		$(this).parents('.dialog').hide()
	})
	$('.dialog .shell').on('click', function() {
		$(this).parents('.dialog').hide()
	})
}

/**
 * 初始化拷贝按钮
 */
function initCopy() {
	$('.copy').on('click', function() {
		var text = $(this).attr('data-text')
		var oInput = document.createElement('input')
		oInput.value = text
		document.body.appendChild(oInput)
		oInput.select()
		document.execCommand('Copy')
		oInput.id = 'oInput'
		oInput.style.display = 'none'
		document.querySelector('#oInput')?.remove()
		useMessage('info', 'Copied!')
	})
}

/**
 * 开启对话框
 * @param dialogId 对话框的id
 */
function openDialog(dialogId) {
	// 关闭所有已开启的对话框
	$('.dialog').hide()
	var dialog = $('#' + dialogId)
	dialog.find('input').val('')
	dialog.show()
}

/**
 * 关闭对话框
 * @param dialogId 对话框的id
 */
function closeDialog(dialogId) {
	var dialog = $('#' + dialogId)
	dialog.hide()
}

/**
 * 连接钱包
 */
function connectWallet(preConnect) {
	if (!window.ethereum || !window.ethereum.isMetaMask) {
		if (!preConnect) {
			alert('Please install MetaMask')
    }
		return
	}

	window.ethereum.request({ method: 'eth_requestAccounts' })
		.then(function(accounts){
			if (accounts.length) {
				window.WALvar = accounts[0]
				$('.connect-wallet.not-connect').hide()
				$('.connect-wallet.connected .address').text(shortAddress(window.WALvar))
				$('.connect-wallet.connected').show()

				closeDialog('WalletConnect')

        // 注册或者登陆
        $.ajax({
         url: '/front_ends/signup_or_signin_by_wallet?address='+ accounts[0],
         type: 'GET',
         success: function(response) {
           location.href = '/'
         }
        });
			}
		})
		.catch(function(e) {
			console.error(e)
		})
  console.info("=== connectWallet done")
}

/**
 * 断开钱包
 */
function disConnect() {
	if (!window.ethereum || !window.ethereum.isMetaMask) {
		alert('Please install MetaMask')
		return
	}

  $.ajax({
   url: '/front_ends/the_sign_out',
   type: 'GET',
   success: function(response) {
     alert("您已成功退出，请另外在您的钱包中点击“断开连接” 以彻底退出。")
     location.href = '/'
   }
  });

}

/**
 * 转换缩略地址
 * @param address
 * @returns {string}
 */
function shortAddress(address) {
	return address.substring(0, 5) + '...' + address.substring(38)
}

/**
 * useMessage  土司提示
 * @param type  'info' | 'success' | 'warn' | 'error'
 * @param msg  string
 * @param emoji string
 */
function useMessage (type, msg, emoji) {
	// 计算显示时间
	var duration = msg.split(' ').length * 500

	// 不低于0.5秒
	duration = Math.max(500, duration)

	// 不超过5秒
	duration = Math.min(5000, duration)

	var messageList = document.getElementById('MessageList')
	if (!messageList) {
		messageList = document.createElement('div')
		messageList.setAttribute('id', 'MessageList')
		document.body.append(messageList)
	}

	var messageItem = document.createElement('div')
	var className = `app-message ${type}`
	messageItem.setAttribute('class', className)

	if (emoji) {
		var icon = document.createElement('span')
		icon.setAttribute('class', 'icon')
		icon.innerText = emoji
		messageItem.append(icon)
	}

	var textItem = document.createElement('div')
	textItem.setAttribute('class', 'text')
	textItem.innerText = msg

	if (Math.min(screen.width, window.innerWidth) <= 750) {
		messageItem.style.maxWidth = '260px'
	}

	var messageItemList = messageList.querySelectorAll('.app-message')
	messageItem.appendChild(textItem)
	messageList.append(messageItem)
	if (messageItemList.length) {
		messageItemList.forEach((item, index) => {
			item.style.top = Number(item.style.top.replace('px', '')) + messageItem.clientHeight + 12 + 'px'
		})
	}
	setTimeout(() => {
		messageItem.setAttribute('class', `app-message active ${type}`)
		setTimeout(() => {
			messageItem.setAttribute('class', `app-message ${type}`)
			setTimeout(() => {
				messageItem.remove()
			}, 500)
		}, duration)
	}, 100)
}

/**
 * 媒体分享方法
 * @param type facebook | twitter | mail | telegram | copy
 * @text type string 可选， copy的内容. 不传为空字符串
 */
function share(type, text) {
	var methods = {
		facebook: () => {
			window.open(`https://www.facebook.com/sharer.php?u=${window.location.host}`)
		},
		twitter: () => {
			var messageText = encodeURIComponent('This is my Web3 profile!')
			var address = encodeURIComponent(window.location.href)
			window.open(`https://twitter.com/intent/tweet?text=${messageText}&url=${address}`)
		},
		mail: () => {
			window.open(`mailto:?subject=This is my Web3 profile&body=This is my Web3 profile! ${window.location.href}`)
		},
		telegram: () => {
			var address = encodeURIComponent(window.location.href)
			window.open(`https://telegram.me/share/?url=${address}`)
		},
		copy: (text) => {
			text = text || ''
			var oInput = document.createElement('input')
			oInput.value = text
			document.body.appendChild(oInput)
			oInput.select()
			document.execCommand('Copy')
			oInput.id = 'oInput'
			oInput.style.display = 'none'
			document.querySelector('#oInput')?.remove()
			useMessage('info', 'Copied!')
		}
	}

	return methods[type](text)
}
