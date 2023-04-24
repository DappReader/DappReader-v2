# DappReader


## What is DappReader?

![cover](https://github.com/DappReader/DappReader-v2/blob/main/img/intro1.png)


DappReader是一个方便开发者对已发布的智能合约集中化管理的可视化工具
1. 快速检索与管理已发布的合约
2. 无代码快速生成智能合约操作界面
3. 对智能合约整体以及每一个函数单独进行注释
4. 与开发者或非开发者快速分享开发中的智能合约(包含注释)
5. 提供一系列类型转换工具,减少开发者工作量

DappReader is a GUI tool to facilitate developers to centralize the management of published smart contracts
1. Quickly retrieve and manage contracts whitch was published
2. Quickly generate smart contract interface without code
3. Annotate smart contracts's each function individually or Write the doc for the whole contracts
4. Quickly share the developing smart contracts (including annotations) with developers or non-developers
5. Provide a series of type conversion tools to reduce the workload of developers


## Why you should usd DappReader?

作为一个智能合约开发者,我在开发中遇到了不少痛点:
刚开始我使用Remix来发布和临时调试智能合约,但是Remix的调试模块实在太简单了,已部署的合约甚至会在页面刷新后消失不见
我也使用过Etherscan.io的Contract模块来临时调试合约,这的确奏效.但是每当我更新合约内容就需要重新发布和验证一次我的代码,过于麻烦
后来我使用JavaScript和hardhat来调试我写好的合约和编写单元测试,这对大型项目来说非常奏效.可是这对一些临时使用的合约不友好(在开发的过程中往往有70%的时间用来写一些临时的工具类型合约)
在和团队成员或者其他前端工程师一起远程协作时,需要在办公软件/email中传输abi等信息,十分繁琐
给非开发者使用智能合约时,不得不写一个前端ui界面并部署到中心化服务器上,非常麻烦


它为开发者提供了以下便利:
非常丝滑的UI界面,可以将智能合约及近百条调用内容在本地保存和随时运行(目前正在开发云端同步功能)
在本地即可实例化智能合约,不用在开发阶段就大量发布和验证智能合约
很适合调试临时智能合约,全程不需要写代码
方便在开发者和非开发者之间快速分享智能合约,美观直观


Introduction to DappReader

As a smart contract developer, I have encountered many pain points in my development:

At first I used Remix to publish and temporarily debug smart contracts, but Remix's debugging module was so simple and crude that deployed contracts would even disappear after a page refresh.
I also used the Contract module of Etherscan.io to debug contracts , and it did worked. But every time I updated the contract, I had to republish and validate my code again, which was not cool

Then I used JavaScript and hardhat to debug my contracts and write unit tests, which worked very well for large projects. But this is not friendly to some temporary use of the contract (in process of development often 70% of the time used to write some temporary tool type contract)
When collaborating with team members or other front-end engineers remotely, you need to transfer abi and other information in sms or in email,which was not cool.
When using smart contracts for non-developers, Developer had to write a front-end UI interface and deploy it to a centralized server, which was not cool

It provides developers with the following convenience:
A very silky UI that allows smart contracts and hundreds of calls/writes/events to be saved locally and run at any time (we are currently working on a cloud sync feature)
Everyone can instantiate smart contracts locally, so you don't have to publish and verify a lot of smart contracts in the development phase
Easy to quickly share smart contracts between developers or non-developers, beautiful and intuitive

![groupQrCode](https://github.com/DappReader/DappReader-v2/blob/main/img/group.png)

## 快速安装

下载本项目到本地后

```
yarn install
```

### 在本地运行
```
yarn run serve
```

### 编译本项目
```
yarn run build
```