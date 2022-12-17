export const chainsOptions = [
	{
		"name": "Mainnet",
		"chain": "ETH",
		"icon": "ethereum",
		"rpc": [
			"https://mainnet.infura.io/v3/${INFURA_API_KEY}",
			"wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}",
			"https://api.mycryptoapi.com/eth",
			"https://cloudflare-eth.com"
		],
		"faucets": [],
		"nativeCurrency": {
			"name": "Ether",
			"symbol": "ETH",
			"decimals": 18
		},
    "endpointURL": "https://api.etherscan.io",
		"infoURL": "https://ethereum.org",
		"shortName": "eth",
		"chainId": 1,
		"networkId": 1,
		"slip44": 60,
		"ens": {
			"registry": "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
		},
		"explorers": [
			{
				"name": "etherscan",
				"url": "https://etherscan.io",
				"standard": "EIP3091"
			}
		]
	}, {
		"name": "Görli",
		"title": "Ethereum Testnet Görli",
		"chain": "ETH",
		"network": "testnet",
		"rpc": [
			"https://goerli.infura.io/v3/${INFURA_API_KEY}",
			"wss://goerli.infura.io/v3/${INFURA_API_KEY}",
			"https://rpc.goerli.mudit.blog/"
		],
		"faucets": [
			"http://fauceth.komputing.org?chain=5&address=${ADDRESS}",
			"https://goerli-faucet.slock.it?address=${ADDRESS}",
			"https://faucet.goerli.mudit.blog"
		],
		"nativeCurrency": {
			"name": "Görli Ether",
			"symbol": "GOR",
			"decimals": 18
		},
    "endpointURL": "https://api-goerli.etherscan.io",
		"infoURL": "https://goerli.net/#about",
		"shortName": "gor",
		"chainId": 5,
		"networkId": 5,
		"ens": {
			"registry": "0x112234455c3a32fd11230c42e7bccd4a84e02010"
		},
		"explorers": [
			{
				"name": "etherscan-goerli",
				"url": "https://goerli.etherscan.io",
				"standard": "EIP3091"
			}
		]
	},
  {
		"name": "BSC Mainnet",
		"chain": "BSC",
		"rpc": [
			"https://bsc-dataseed1.binance.org",
			"https://bsc-dataseed2.binance.org",
			"https://bsc-dataseed3.binance.org",
			"https://bsc-dataseed4.binance.org",
			"https://bsc-dataseed1.defibit.io",
			"https://bsc-dataseed2.defibit.io",
			"https://bsc-dataseed3.defibit.io",
			"https://bsc-dataseed4.defibit.io",
			"https://bsc-dataseed1.ninicoin.io",
			"https://bsc-dataseed2.ninicoin.io",
			"https://bsc-dataseed3.ninicoin.io",
			"https://bsc-dataseed4.ninicoin.io",
			"wss://bsc-ws-node.nariox.org"
		],
		"faucets": [
			"https://free-online-app.com/faucet-for-eth-evm-chains/"
		],
		"nativeCurrency": {
			"name": "Binance Chain Native Token",
			"symbol": "BNB",
			"decimals": 18
		},
    "endpointURL": "https://api.bscscan.com",
		"infoURL": "https://www.binance.org",
		"shortName": "bnb",
		"chainId": 56,
		"networkId": 56,
		"slip44": 714,
		"explorers": [
			{
				"name": "bscscan",
				"url": "https://bscscan.com",
				"standard": "EIP3091"
			}
		]
	}, {
		"name": "BSC Testnet",
		"chain": "BSC",
		"rpc": [
			"https://data-seed-prebsc-1-s1.binance.org:8545",
			"https://data-seed-prebsc-2-s1.binance.org:8545",
			"https://data-seed-prebsc-1-s2.binance.org:8545",
			"https://data-seed-prebsc-2-s2.binance.org:8545",
			"https://data-seed-prebsc-1-s3.binance.org:8545",
			"https://data-seed-prebsc-2-s3.binance.org:8545"
		],
		"faucets": [
			"https://testnet.binance.org/faucet-smart"
		],
		"nativeCurrency": {
			"name": "Binance Chain Native Token",
			"symbol": "tBNB",
			"decimals": 18
		},
    "endpointURL": "https://api-testnet.bscscan.com",
		"infoURL": "https://testnet.binance.org/",
		"shortName": "bnbt",
		"chainId": 97,
		"networkId": 97,
		"explorers": [
			{
				"name": "bscscan-testnet",
				"url": "https://testnet.bscscan.com",
				"standard": "EIP3091"
			}
		]
	},
]