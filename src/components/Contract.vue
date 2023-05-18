<template>
  <div class="contract-content">
    <div v-if="isShowHd || isIframe" style="margin-bottom: 24px;">
      <ContractHd v-if="contractData" :contract="contractData.content"  />
    </div>
    <div class="contract-main flex-start" ref="contractRef">
      <div class="collapse">
        <div class="collapse-item" @click="showFun(1)" :style="{'height': getFunHeight(1)}">
          <div class="collapse-item-hd flex-center-sb" :style="{'padding-bottom': showType.indexOf(1) > -1 ? '10px' : '0'}">
            <div class="title flex-center"><img src="@/assets/images/read.svg" alt=""><span>Read function</span></div>
            <img src="@/assets/images/arrow.svg" alt="" class="arrow" >
          </div>
          <div v-if="readFun" class="collapse-item-list" @click.stop>
            <div v-for="(item, index) in readFun" :key="index" :class="['collapse-item-fun', 'flex-start', (abiItem && item.name == abiItem.name) ? 'collapse-item-fun-activated' : '']" @click="updateAbi(item, 'read')">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 12.75L4.5 5.25M13.5 5.25L13.5 12.75" stroke="#858D99" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13.5 12.75C13.5 13.9926 11.4853 15 9 15C6.51472 15 4.5 13.9926 4.5 12.75" stroke="#858D99" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13.5 9C13.5 10.2426 11.4853 11.25 9 11.25C6.51472 11.25 4.5 10.2426 4.5 9" stroke="#858D99" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 7.5C11.4853 7.5 13.5 6.49264 13.5 5.25C13.5 4.00736 11.4853 3 9 3C6.51472 3 4.5 4.00736 4.5 5.25C4.5 6.49264 6.51472 7.5 9 7.5Z" stroke="#858D99" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div class="item-name">
                <p v-if="item.otherName" class="other-name">{{item.otherName}}</p>
                <p>{{item.name}}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="collapse-item" @click="showFun(2)" :style="{'height': getFunHeight(2)}">
          <div class="collapse-item-hd flex-center-sb" :style="{'padding-bottom': showType.indexOf(2) > -1 ? '10px' : '0'}">
            <div class="title flex-center"><img src="@/assets/images/write.svg" alt=""><span>Write function</span></div>
            <img src="@/assets/images/arrow.svg" alt="" class="arrow" >
          </div>
          <div v-if="writeFun" class="collapse-item-list" @click.stop>
            <div v-for="(item, index) in writeFun" :key="index" :class="['collapse-item-fun', 'flex-center', (abiItem && item.name == abiItem.name) ? 'collapse-item-fun-activated' : '']" @click="updateAbi(item, 'write')">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 12.75L4.5 5.25M13.5 5.25L13.5 12.75" stroke="#858D99" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13.5 12.75C13.5 13.9926 11.4853 15 9 15C6.51472 15 4.5 13.9926 4.5 12.75" stroke="#858D99" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13.5 9C13.5 10.2426 11.4853 11.25 9 11.25C6.51472 11.25 4.5 10.2426 4.5 9" stroke="#858D99" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 7.5C11.4853 7.5 13.5 6.49264 13.5 5.25C13.5 4.00736 11.4853 3 9 3C6.51472 3 4.5 4.00736 4.5 5.25C4.5 6.49264 6.51472 7.5 9 7.5Z" stroke="#858D99" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div class="item-name">
                <p v-if="item.otherName" class="other-name">{{item.otherName}}</p>
                <p>{{item.name}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="contractData" class="contract-main-content" ref="mainContent">
        <div v-if="abiItem" class="execute">
          <n-spin :show="showSpin">
            <div class="contract-main-content-hd flex-center-sb">
              <div class="fun-name flex-center">{{abiItem.otherName || abiItem.name}} <span v-if="abiItem.otherName">{{abiItem.name}}</span>
                <div class="edit flex-center">
                  <img src="@/assets/images/note_edit.svg" alt="" @click="() => showPopover = !showPopover">
                  <div class="popover" v-if="showPopover">
                    <div class="popover-hd flex-center-sb">
                      <div class="popover-title">function name</div>
                      <img src="@/assets/images/close.svg" alt="" class="close" @click="hiddenPopover">
                    </div>
                    <div class="popover-input">
                      <n-input class="form-input popover-input-item" v-model:value="abiItem.tempName" />
                      <div class="popover-btn flex-center-center" @click="saveOtherName">Save</div>
                    </div>
                  </div>
                </div>
              </div>
              <img src="@/assets/images/close.svg" alt="" class="close" @click="init">
            </div>
            <div v-if="abiItem.inputs && abiItem.inputs.length" class="fun-parames">
              <div class="fun-parames-title">Parameters</div>
              <div class="parame-item" v-for="(inputItem, index) in abiItem.inputs" :key="index">
                <div class="parame-item-hd flex-center-sb">
                  <div class="parame-name flex-center">{{inputItem.name}} <span>Data type: {{inputItem.type}}</span></div>
                  <div v-if="inputItem.type == 'uint256'" class="conversion flex-center" @click="showConvert('parameData', inputItem.name)">
                    <span>Digital Conversion</span>
                    <img src="@/assets/images/conversion.svg" alt="">
                  </div>
                </div>
                <div v-if="inputItem.type == 'tuple'">
                  <ParameItem v-for="(item, index) in inputItem.components" :inputItem="item" :key="index" @inputParameData="inputParameData($event, inputItem.name)" />
                </div>
                <div v-else>
                  <n-input
                    v-if="inputItem.type.indexOf('[]') > -1"
                    v-model:value="parameData[inputItem.name]"
                    type="textarea"
                    size="small"
                    :autosize="{
                      minRows: 3,
                      maxRows: 5
                    }" 
                    class="form-input form-textarea"
                  />
                  <n-input v-else class="form-input" v-model:value="parameData[inputItem.name]" />
                  <div v-if="inputItem.type == 'uint256' && parameData[inputItem.name] && (parameData[inputItem.name] % 1 != 0)" class="wei-btns flex-center">
                    <div class="wei-btn flex-center-center" @click="toWei('parameData', inputItem.name, 18)">ToWei(10^18)</div>
                    <div class="wei-btn flex-center-center" @click="toWei('parameData', inputItem.name, 9)">ToGwei(10^9)</div>
                    <p>invalid number, please use digital conversion </p>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="abiType == 'write'" class="fun-parames">
              <div class="fun-parames-title flex-center" @click="() => showSendInfo = !showSendInfo"><span>Incidental parameter</span><img src="@/assets/images/arrow.svg" alt="" :style="{transform:  (showSendInfo || abiItem.stateMutability == 'payable') ? 'rotate(180deg)' : 'rotate(0deg)'}"></div>
              <div class="parame-w" :style="{'max-height': (showSendInfo || abiItem.stateMutability == 'payable') ? '300px' : '0'}">
                <div class="parame-item">
                  <div class="parame-item-hd flex-center-sb">
                    <div class="parame-name flex-center">Value <span>The contract is executed with the quantity of ETH</span></div>
                    <div class="conversion flex-center" @click="showConvert('sendInfo', 'value')">
                      <span>Digital Conversion</span>
                      <img src="@/assets/images/conversion.svg" alt="">
                    </div>
                  </div>
                  <n-input class="form-input" v-model:value="sendInfo.value" />
                  <div v-if="sendInfo.value && (sendInfo.value % 1 != 0)" class="wei-btns flex-center">
                    <div class="wei-btn flex-center-center" @click="toWei('sendInfo', 'value', 18)">ToWei(10^18)</div>
                    <div class="wei-btn flex-center-center" @click="toWei('sendInfo', 'value', 9)">ToGwei(10^9)</div>
                    <p>invalid number, please use digital conversion </p>
                  </div>
                </div>
                <div class="parame-item">
                  <div class="parame-item-hd flex-center-sb">
                    <div class="parame-name flex-center">GasPrice</div>
                    <div class="conversion flex-center" @click="showConvert('sendInfo', 'gasPrice')">
                      <span>Digital Conversion</span>
                      <img src="@/assets/images/conversion.svg" alt="">
                    </div>
                  </div>
                  <n-input class="form-input" v-model:value="sendInfo.gasPrice" />
                  <div class="wei-btns flex-center">
                    <!-- <div class="wei-btn flex-center-center" @click="toWei('sendInfo', 'gasPrice', 18)">ToWei(10^18)</div> -->
                    <div class="wei-btn flex-center-center" @click="toWei('sendInfo', 'gasPrice', 9)">ToGwei(10^9)</div>
                    <p v-if="sendInfo.gasPrice && (sendInfo.gasPrice % 1 != 0)">invalid number, please use digital conversion </p>
                  </div>
                </div>
              </div>
            </div>
            <!-- <div class="fun-parames">
              <div class="fun-parames-title flex-center-sb"><span>Incidental parameter</span><img src="@/assets/images/arrow.svg" alt=""></div>
              <div class="parame-w" style="max-height: 0"></div>
            </div> -->
            <div class="fun-run-btn flex-center-center" @click="runFunction(abiItem)">Run</div>
          </n-spin>
        </div>
        <div class="result">
          <div v-if="contractData.result && contractData.result.length">
            <div v-for="(item, index) in contractData.result" :key="index" class="result-item">
              <div class="result-item-hd flex-center">
                <div class="result-item-hd-l">
                  <div class="result-name">{{item.state == 'success' ? '✅' : '❌'}} <span v-if="!isIframe">Run function :</span> {{item.name}}</div>
                </div>
                <div class="result-item-hd-r flex-center">
                  <div class="result-time flex-center" v-if="!isIframe"><img src="@/assets/images/time.svg" alt="">
                    {{createAt(item.createAt)}}<span v-if="item.confirmed" style="margin-left: .25em">| Confirmed within {{item.confirmed}} sec</span> 
                  </div>
                  <div v-if="item.content.hash" class="result-btn flex-center-center" @click="toEtherscanAddress(item.content.hash, contractData.content.chain, 'tx')"><img src="@/assets/images/show.svg" alt=""><span>View Etherscan</span></div>
                  <div class="result-btn flex-center-center" @click="resend(item)"><img src="@/assets/images/arrow_reload.svg" alt=""><span>Resend</span></div>
                </div>
              </div>
              <div v-if="item.content.hash" class="result-info flex-center">
                <div class="result-info-item flex-center">
                  <div class="result-info-item-key flex-center-center">Tx Type</div>
                  <div class="result-info-item-value flex-center-center">{{item.content.type == 2 ? "2(EIP-1599)" : "1"}}</div>
                </div>
                <div class="result-info-item flex-center">
                  <div class="result-info-item-key flex-center-center">Nonce</div>
                  <div class="result-info-item-value flex-center-center">{{ item.content.nonce }}</div>
                </div>
                <div class="result-info-item flex-center">
                  <div class="result-info-item-key flex-center-center">BlockNumber</div>
                  <div class="result-info-item-value flex-center-center">{{ item.content.blockNumber || "--" }}</div>
                </div>
              </div>
              <div v-if="item.params && item.params.length" class="result-section">
                <div class="result-section-content">
                  <div class="result-section-content-hd flex-center">Data input: {{item.name}}</div>
                  <div class="result-section-content-main">
                    <div class="result-params" :style="{'max-height': !item.showParams ? '300px' : '0'}">
                      <div v-for="(param, index) in item.params" :key="index" class="result-param flex-center">
                        <div class="result-param-name">{{param.key}}</div>
                        <div class="result-param-value">{{param.value}}</div>
                        <img src="@/assets/images/copy.svg" alt="" @click="copy(param.value)">
                      </div>
                    </div>
                    <div v-if="item.params.length > 10" class="result-param-show flex-center-center"  @click="item.showParams = !item.showParams">show<img src="@/assets/images/arrow.svg" :style="{transform: !item.showParams ? 'rotate(180deg)' : 'rotate(0deg)'}" alt=""></div>
                  </div>
                </div>
              </div>
              <div class="result-section">
                <div v-if="item && item.content && (item.content.hash)" class="result-section">
                  <div class="result-section-content">
                    <div class="result-section-content-hd flex-center">Transaction Info 
                      <img v-if="!item.isShowJson" src="@/assets/images/json.svg" alt="" @click="clickConversion('isShowJson', index)">
                      <img v-else src="@/assets/images/table.svg" alt="" @click="clickConversion('isShowJson', index)">
                    </div>
                    <div v-if="!item.isShowJson" class="result-section-content-main">
                      <div class="result-param flex-center" v-if="item.content && item.content.transactionHash">
                        <div class="result-param-name">TransactionHash</div>
                        <div class="result-param-value">{{item.content.transactionHash}}</div>
                        <img src="@/assets/images/copy.svg" alt="" @click="copy(item.content.transactionHash)">
                      </div>
                      <div class="result-param flex-center" v-if="item.content && item.content.hash">
                        <div class="result-param-name">Hash</div>
                        <div class="result-param-value">{{item.content.hash}}</div>
                        <img src="@/assets/images/copy.svg" alt="" @click="copy(item.content.hash)">
                      </div>
                      <div class="result-params">
                        <div class="result-param flex-center" v-if="item.content && item.content.transactionIndex">
                          <div class="result-param-name">TransactionIndex</div>
                          <div class="result-param-value">{{item.content.transactionIndex}}</div>
                          <img src="@/assets/images/copy.svg" alt="" @click="copy(item.content.transactionIndex)">
                        </div>
                        <div class="result-param flex-center" v-if="item.content && item.content.data">
                          <div class="result-param-name">Data</div>
                          <div class="result-param-value">{{item.content.data}}</div>
                          <img src="@/assets/images/copy.svg" alt="" @click="copy(item.content.data)">
                        </div>
                        <div class="result-param flex-center" v-if="item.content && item.content.gasPrice">
                          <div class="result-param-name">GasPrice</div>
                          <div v-if="!item.isFormatGasPrice" class="result-param-value">{{(formatUnits(item.content.gasPrice, 9) * 1).toFixed(4)}} Gwei</div>
                          <div v-else class="result-param-value">{{item.content.gasPrice}}</div>
                          <img src="@/assets/images/conversion.svg" alt="" @click="clickConversion('isFormatGasPrice', index)">
                        </div>
                        <div class="result-param flex-center" v-if="item.content && item.content.gasLimit">
                          <div class="result-param-name">GasLimit</div>
                          <div v-if="!item.isFormatGasLimit" class="result-param-value">{{formatUnits(item.content.gasLimit, 0)}}</div>
                          <div v-else class="result-param-value">{{item.content.gasLimit}}</div>
                          <img src="@/assets/images/conversion.svg" alt="" @click="clickConversion('isFormatGasLimit', index)">
                        </div>
                        <div class="result-param flex-center" v-if="item.content && item.content.gasUsed">
                          <div class="result-param-name">GasUsed</div>
                          <div v-if="!item.isFormatGasUsed" class="result-param-value">{{formatUnits(item.content.gasUsed, 0)}}</div>
                          <div v-else class="result-param-value">{{item.content.gasUsed}}</div>
                          <img src="@/assets/images/conversion.svg" alt="" @click="clickConversion('isFormatGasUsed', index)">
                        </div>
                        <div class="result-param flex-center" v-if="item.content && item.content.gasUsed">
                          <div class="result-param-name">GasUsedPercent</div>
                          <div v-if="!item.isFormatGasUsed" class="result-param-value">{{((formatUnits(item.content.gasUsed, 0)) / (formatUnits(item.content.gasLimit)) * 100).toFixed(1)}}%</div>
                          <div v-else class="result-param-value">{{item.content.gasUsed}}</div>
                          <!-- <img src="@/assets/images/conversion.svg" alt="" @click="clickConversion('isFormatGasUsed', index)"> -->
                          <img src="@/assets/images/copy.svg" alt="" @click="copy(((formatUnits(item.content.gasUsed, 0)) / (formatUnits(item.content.gasLimit)) * 100).toFixed(1) + '%')">
                        </div>
                        <div class="result-param flex-center" v-if="item.content && item.content.effectiveGasPrice">
                          <div class="result-param-name">GasCost</div>
                          <div v-if="formatUnits(item.content.value, 18) == 0" class="result-param-value">{{(formatUnits(formatUnits(item.content.gasUsed, 0) * (formatUnits(item.content.effectiveGasPrice, 0)), 18) * 1).toFixed(9)}} ETH</div>
                          <div v-else class="result-param-value">{{(formatUnits(formatUnits(item.content.gasUsed, 0) * (formatUnits(item.content.effectiveGasPrice, 0)), 18) * 1).toFixed(9)}} ETH + {{(formatUnits(item.content.value, 18) * 1).toFixed(9)}} ETH = {{(formatUnits(formatUnits(item.content.gasUsed, 0) * (formatUnits(item.content.effectiveGasPrice, 0)), 18) * 1 + formatUnits(item.content.value, 18) * 1).toFixed(9)}} ETH</div>
                          <!-- <img src="@/assets/images/conversion.svg" alt="" @click="clickConversion('isFormatGasUsed', index)"> -->
                          <img v-if="formatUnits(item.content.value, 18) == 0" src="@/assets/images/copy.svg" alt="" @click="copy((formatUnits(formatUnits(item.content.gasUsed, 0) * (formatUnits(item.content.effectiveGasPrice, 0)), 18) * 1).toFixed(9))">
                          <img v-else src="@/assets/images/copy.svg" alt="" @click="copy((formatUnits(formatUnits(item.content.gasUsed, 0) * (formatUnits(item.content.effectiveGasPrice, 0)), 18) * 1 + formatUnits(item.content.value, 18) * 1).toFixed(9))">
                        </div>
                        <div class="result-param flex-center" v-if="item.content && item.content.maxFeePerGas">
                          <div class="result-param-name">MaxFeePerGas</div>
                          <div v-if="!item.isFormatMaxFee" class="result-param-value">{{(formatUnits(item.content.maxFeePerGas, 9) * 1).toFixed(4)}} Gwei</div>
                          <div v-else class="result-param-value">{{item.content.maxFeePerGas}}</div>
                          <img src="@/assets/images/conversion.svg" alt="" @click="clickConversion('isFormatMaxFee', index)">
                        </div>
                        <div class="result-param flex-center" v-if="item.content && item.content.maxPriorityFeePerGas">
                          <div class="result-param-name">MaxPriorityFeePerGas</div>
                          <div v-if="!item.isFormatMaxPriority" class="result-param-value">{{formatUnits(item.content.maxPriorityFeePerGas, 9)}} Gwei</div>
                          <div v-else class="result-param-value">{{item.content.maxPriorityFeePerGas}}</div>
                          <img src="@/assets/images/conversion.svg" alt="" @click="clickConversion('isFormatMaxPriority', index)">
                        </div>
                        <div class="result-param flex-center" v-if="item.content && item.content.value">
                          <div class="result-param-name">Value</div>
                          <div v-if="!item.isFormatValue" class="result-param-value">{{formatUnits(item.content.value, 18)}} ETH</div>
                          <div v-else class="result-param-value">{{item.content.value}}</div>
                          <img src="@/assets/images/conversion.svg" alt="" @click="clickConversion('isFormatValue', index)">
                        </div>
                      </div>
                      <div v-if="item.params.length > 10" class="result-param-show flex-center-center"  @click="item.showParams = !item.showParams">show<img src="@/assets/images/arrow.svg" :style="{transform: !item.showParams ? 'rotate(180deg)' : 'rotate(0deg)'}" alt=""></div>
                    </div>
                    <JsonViewer v-else :value="(item && item.content) || ''" preview-mode copyable boxed sort theme="dark" expanded />
                  </div>
                </div>
                <div v-else class="result-section-content">
                  <div class="result-section-content">
                    <div class="result-section-content-hd flex-center">Result
                      <div v-if="item.content.constructor === Object">
                        <img v-if="!item.isShowJson" src="@/assets/images/json.svg" alt="" @click="clickConversion('isShowJson', index)">
                        <img v-else src="@/assets/images/table.svg" alt="" @click="clickConversion('isShowJson', index)">
                      </div>
                      
                    </div>
                    <div v-if="!item.isShowJson && item.content.constructor === Object" class="result-section-content-main">
                      <div class="result-params">
                        <div class="result-param flex-center" v-for="(val, key, index) in item.content" :key="index">
                          <div class="result-param-name">{{key}}</div>
                          <div class="result-param-value">{{val}}</div>
                          <img src="@/assets/images/copy.svg" alt="" @click="copy(val)">
                        </div>
                      </div>
                    </div>
                    <JsonViewer v-else :value="(item && item.content) || ''" preview-mode copyable boxed sort theme="dark" expanded />
                  </div>
                  <!-- <JsonViewer :value="(item && item.content) || ''" preview-mode boxed sort theme="dark" /> -->
                </div>
              </div>
              <div v-if="item.content && item.content.events && item.content.events.length" class="result-section">
                <div class="result-section-title">event list</div>
                <div class="result-section-content" v-for="(event, inx) in item.content.events" :key="inx">
                  <div class="result-section-content-hd flex-center">{{ event.eventSignature }}</div>
                  <div class="result-section-content-main">
                    <div class="result-params" :style="{'max-height': event.showEvents ? '300px' : '0'}">
                      <div v-for="(param, i) in eventParam(event.eventSignature)" :key="i" class="result-param flex-center">
                        <div class="result-param-name">{{param}}</div>
                        <div v-if="event.isFormatUnits && param == 'uint256'" class="result-param-value">{{formatUnits(event.args[i])}}</div>
                        <div v-else class="result-param-value">{{event.args[i]}}</div>
                        <img v-if="param != 'uint256'" src="@/assets/images/copy.svg" alt="" @click="copy(event.args[i])">
                        <img v-else src="@/assets/images/conversion.svg" alt="" @click="() => event.isFormatUnits = !event.isFormatUnits">
                      </div>
                    </div>
                    <div class="result-param-show flex-center-center" @click="event.showEvents = !event.showEvents">show <img src="@/assets/images/arrow.svg" alt="" :style="{transform: event.showEvents ? 'rotate(180deg)' : 'rotate(0deg)'}"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!abiItem && !(contractData.result && contractData.result.length)" >
          <div class="demo-hint">
            <div class="demo-hint-title">Welcome to DappReader, this is a sample card</div>
            <div class="demo-hint-desc flex-center"><img src="@/assets/images/left.png" alt="">The first step is to select the function on the left, which will generate an execution card.</div>
            <img src="@/assets/images/hint.png" alt="" class="hint-img">
            <div class="demo-hint-desc flex-center"><p>After entering the parameters according to the functional requirements, click the "run" button, and you can see the running results in the results bar below.</p></div>
            <div class="demo-hint-desc flex-center" style="margin-top: 14px">You can even customize GasPrice and accompany ETH.</div>
          </div>
          <!-- <div v-else class="not-result flex-center-center"><img src="@/assets/images/left.png" alt="">Please select the function on the left and execute</div> -->
        </div>
      </div>
      <ContractMsg v-if="!isShowHd && contractData && !isIframe" :contract="contractData.content" />
    </div>
    
    <NetworkErrorModal v-if="contractData && contractData.content" :chain="contractData.content.chain" @switchChain="switchChainFun" ref="networkErrorModal" />
    <ConversionModal ref="conversionModal" @convert="convert" />
  </div>
</template>
<script>
import ContractHd from '@/components/ContractHd.vue'
import ContractMsg from '@/components/ContractMsg.vue'
import NetworkErrorModal from '@/components/NetworkErrorModal.vue'
import ConversionModal from '@/components/ConversionModal.vue'
import { useStore } from 'vuex'
import { ethers } from 'ethers'
import { ref, computed, watch, toRaw, onMounted } from 'vue'
import { setLs } from '@/service/service'
import { formatDate, formatAddress } from '../libs/utils'
import {JsonViewer} from "vue3-json-viewer"
import "vue3-json-viewer/dist/index.css"
import { useUtils } from '../hooks/useUtils'
import { useIsActivating } from '../hooks/useIsActivating'
import { useNetwork } from '../hooks/useNetwork'
import { connectContract } from "../libs/connectWallet"
import { useMessage } from "naive-ui"
import ParameItem from '@/components/ParameItem.vue'
export default {
  components: { ParameItem, ContractHd, JsonViewer, NetworkErrorModal, ConversionModal, ContractMsg },
  setup() {
    let toWeiData = ''
    let toWeiType = ''
    let running = false
    const message = useMessage()
    const { toEtherscanAddress, copy, setData } = useUtils()
    const { getProvider } = useIsActivating()
    const { switchChain } = useNetwork()
    const store = useStore()
    const showPopover = ref(false)
    const readFun = ref(null)
    const mainContent = ref(null)
    const writeFun = ref(null)
    const contractData = ref(null)
    const contractRef = ref(null)
    const abiItem = ref(null)
    const showSpin = ref(false)
    const parameData = ref({})
    const showType = ref([1, 2])
    const abiType = ref('')
    const networkErrorModal = ref(null)
    const conversionModal = ref(null)
    const sendInfo = ref({})
    const showSendInfo = ref(false)
    const isShowHd = ref(true)
    const funOtherName = ref('')
    const provider = computed(() => {
      return store.state.provider
    })
    const results = computed(() => {
      return store.state.results
    })
    const menuList = computed(() => {
      return store.state.menuList
    })
    const network = computed(() => {
      return store.state.network
    })
    const activeId = computed(() => {
      return store.state.activeId
    })
    const address = computed(() => {
      return store.state.address
    })
    const contractList = computed(() => {
      return store.state.contractList
    })
    const isIframe = computed(() => {
      return store.state.isIframe
    })
    const createAt = computed(() => {
      return (value) => {
        if (!value) return '--'
        return formatDate('YYYY-mm-dd HH:MM:SS', value)
      }
    })
    const formatStr = computed(() => {
      return (value) => {
        if (!value) return ''
        return formatAddress(value)
      }
    })
    const formatUnits = computed(() => {
      return (val, d = 0) => {
        if (val.type != 'BigNumber') val += ''
        return ethers.utils.formatUnits(val, d);
      }
    })
    const eventParam = computed(() => {
      return (val) => {
        if (val) {
          val.match(/\((.+)\)/g)[0]
          let arrStr = RegExp.$1
          let arr = arrStr.split(',')
          return arr
        } else {
          return []
        }
        
      }
    })

    window.onresize = () =>{
      return (() => {
        window.screenwidth = document.body.clientWidth
        let screenwidth = window.screenwidth
        console.log(screenwidth)
        if (screenwidth < 1680) {
          isShowHd.value = true
          contractRef.value.style.height = 'calc(100% - 124px)'
        } else {
          isShowHd.value = false
          contractRef.value.style.height = 'calc(100% - 2px)'
        }
      })()
    }

    const hiddenPopover = () => {
      showPopover.value = false
    }

    const setParameData = (e) => {
      let data
      if (e.type == 'tuple') {
        data = {}
        let arr = e.components
        arr.forEach(el => {
          data[el.name] = setParameData(el)
        })
      } else {
        data = ''
      }
      return data
    }

    const updateAbi = (item, type) => {
      console.log(item)
      mainContent.value.scrollTop = 0
      if (item.otherName) {
        item.tempName = JSON.parse(JSON.stringify(item.otherName))
      }
      abiItem.value = item
      if (type) {
        abiType.value = type
      } else {
        if (item.stateMutability == 'view') {
          abiType.value = 'read'
        } else {
          abiType.value = 'write'
        }
      }
      let data = {}
      abiItem.value.inputs.forEach(e => {
        data[e.name] = setParameData(e)
      })
      console.log(data)
      parameData.value = data
      sendInfo.value = {}
      if (type == 'read' && !abiItem.value.inputs.length) {
        runFunction(abiItem.value)
      }
    }

    const switchChainFun = () => {
      let contract = contractData.value.content
      switchChain(contract.chain.chainId)
      networkErrorModal.value.showModal = false
    }

    const init = () => {
      abiItem.value = null
      abiType.value = ''
      parameData.value = {}
      showSpin.value = false
    }

    const inputParameData = (val, v) => {
      let key = Object.keys(val)[0]
      if (!parameData.value[v]) {
        parameData.value[v] = {}
      }
      parameData.value[v][key] = val[key]
    }

    const setOutpuData = (e, item) => {
      let data = item
      if (e.type == 'tuple') {
        data = {}
        let arr = e.components
        arr.forEach((el,i) => {
          let it = item[i]
          let name = el.name || i
          data[name] = setOutpuData(el, it)
        })
      } else {
        console.log('530', e.type, data, item)
        if (e.type == 'uint256') {
          data = ethers.utils.formatUnits(item, 0)
        } else if (e.type == 'bool') {
          data = item ? 'true' : 'false'
        }
      }
      return data
    }

    const runFunction = async (abiItem) => {
      running = false
      let contract = contractData.value.content
      if (!provider.value) {
        getProvider()
        return
      }
      if (network.value.chainId != contract.chain.chainId) {
        networkErrorModal.value.showModal = true
        running = true
      } else {
        showSpin.value = true
        try {
          let user = toRaw(provider.value).getSigner()
          let C = await connectContract(contract.address, contract.abi, user)
          let param = []
          let inputs = abiItem.inputs
          for (let i = 0; i < inputs.length; i++) {
            let name = inputs[i].name
            let type = inputs[i].type
            let item = parameData.value[name]
            if (type.indexOf("[]") > -1) {
              item = item ? item.replace(/\s+/g, ",").replace(/\[|]/g, "").replace(/(\r\n)|(\n)/g, ",") : ''
              item = item.split(",")
              item = item.filter((e) => e && e.trim())
              item = item.map((e) => e.trim().replace(/\"/g, "").replace(/'/g, "")) // eslint-disable-line
              if (type.indexOf("address") > -1) {
                item = item.map((e) => ethers.utils.getAddress(e))
              } else {
                try {
                  item = item.map((e) => ethers.utils.hexlify(e))
                } catch (error) {
                  console.log(error)
                }
              }
            } else if (type == 'bool') {
              item = item == 'true' ? true : false
            }
            param.push(item)
          }
          let resultData = null
          let tx = null
          let resultState = ''
          try {
            tx = await C[abiItem.name](...param, sendInfo.value)
            resultState = 'success'
          } catch (error) {
            console.error(error)
            resultState = 'error'
            tx = error
          }
          if (abiItem.stateMutability == 'view' || abiItem.stateMutability == 'pure') {
            let res
            let outputs = abiItem.outputs
            if (outputs.length == 1) {
              if (outputs[0].type == 'uint256') {
                tx = ethers.utils.formatUnits(tx, 0)
              } else if (outputs[0].type == 'bool') {
                console.log(tx)
                tx = tx ? 'true' : 'false'
              }
              res = tx
            } else {
              res = {}
              outputs.forEach((e, i) => {
                console.log(e, i)
                let name = e.name || i
                let item = tx[i]
                item = setOutpuData(e, item)
                res[name] = item
              })
            }
            tx = res
          }
          resultData = {
            content: tx,
            state: resultState,
            parameData: parameData.value,
            formData: Object.assign(parameData.value, sendInfo.value),
            sendInfo: sendInfo.value,
            funData: abiItem,
            name: abiItem.name,
            createAt: new Date(),
          }
          setResult(resultData)
          init()
          if (tx && tx.hash) {
            const receipt = await tx.wait()
            console.log(receipt)
            resultData.content = Object.assign(resultData.content, receipt)
            resultData.confirmed = Math.ceil((new Date().getTime() - resultData.createAt.getTime()) / 1000)
            setResult(resultData)
          }
        } catch (error) {
          console.error(error)
          message.error(error)
          showSpin.value = false
        }
      }
    }

    const setResult = async (result) => {
      let resultData = results.value[contractData.value.content.id] || []
      if (result.content.hash && resultData.some(e => e.content.hash == result.content.hash)) {
        resultData.forEach((el, index) => {
          if (el.content.hash == result.content.hash) {
            resultData[index] = result
          }
        })
      } else {
        resultData.unshift(result)
      }
      resultData.forEach(e => {
        let params = []
        let formData = e.formData
        for (let key in formData) {
          let item = {
            key,
            value: formData[key]
          }
          params.push(item)
        }
        e.params = params
      })
      results.value[contractData.value.content.id] = JSON.parse(JSON.stringify(resultData))
      contractData.value.result = JSON.parse(JSON.stringify(resultData))
      console.log(results.value, JSON.parse(JSON.stringify(toRaw(results.value))))
      let R = {}
      for (let key in results.value) {
        R[key] = JSON.parse(JSON.stringify(toRaw(results.value[key])))
      }
      setLs('results', R).then(res => {
        console.log(res)
        store.commit("setResults", res)
      }).catch(err => {
        console.log(err)
      })
    }

    const getContarctData = async () => {
      let contract = contractList.value.filter(e => e.id == activeId.value)[0]
      for (let i = 0; i < menuList.value.length; i++) {
        let son = menuList.value[i].son
        son.forEach((e, index) => {
          if (e.id == activeId.value) {
            contract = son[index]
          }
        })
      }
      console.log(contract)
      if (!contract) return
      let token = toRaw(contract.token)
      if (token && token != 'undefined') token = `https://dappreader.com/${token}`
      if (token) {
        if (token == 'undefined') {
          token = ''
        } else if (token.indexOf('dappreader.com') > -1) {
          let tArr = token.split('/')
          token = tArr[tArr.length - 1]
        }
      }
      contract.token = token
      if (contract) {
        let resultData = results.value[contract.id] || []
        if (resultData && resultData.length) {
          resultData.forEach(e => {
            let params = []
            let formData = e.formData
            for (let key in formData) {
              let item = {
                key,
                value: formData[key]
              }
              params.push(item)
            }
            e.params = params
          })
        }
        contractData.value = {
          content: toRaw(contract),
          result: resultData
        }
        let abi = contract.abi || []
        let list = abi.filter((e) => e.type == "function")
        let readAbi = list.filter((e) => (e.stateMutability != "nonpayable" && e.stateMutability != "payable"))
        let writeAbi = list.filter((e) => (e.stateMutability == "nonpayable" || e.stateMutability == "payable"))
        readFun.value = readAbi
        writeFun.value = writeAbi
      }
    }

    const resend = (item) => {
      console.log(item)
      updateAbi(item.funData)
      if (item.parameData) {
        parameData.value = item.parameData  
      } else {
        parameData.value = item.formData  
      }
      sendInfo.value = item.sendInfo
    }

    const saveOtherName = () => {
      let contract = contractData.value.content
      if (abiItem.value.otherName != abiItem.value.tempName && !contract.isImport) {
        contract.hasUpdate = true
      } else {
        contract.hasUpdate = false
      }
      abiItem.value.otherName = abiItem.value.tempName
      setData(contract)
      hiddenPopover()
    }

    const showConvert = (data, type) => {
      toWeiData = data
      toWeiType = type
      conversionModal.value.show()
    }

    const toWei = (data, type, decimals) => {
      try {
        if (data == 'sendInfo') {
          sendInfo.value[type] = ethers.utils.parseUnits(sendInfo.value[type].toString(), decimals).toString()
        } else if (data == 'parameData') {
          parameData.value[type] = ethers.utils.parseUnits(parameData.value[type].toString(), decimals).toString()
        }
      } catch (error) {
        message.error(error)
      }
    }

    const convert = (e) => {
      let decimals = e
      console.log(e)
      if (toWeiData == 'sendInfo') {
        sendInfo.value[toWeiType] = ethers.utils.parseUnits(sendInfo.value[toWeiType].toString(), decimals).toString()
      } else if (toWeiData == 'parameData') {
        parameData.value[toWeiType] = ethers.utils.parseUnits(parameData.value[toWeiType].toString(), decimals).toString()
      }
      conversionModal.value.showModal = false
      toWeiData = ''
      toWeiType = ''
    }

    const clickConversion = (type, index) => {
      let contract = contractData.value
      let result = contract.result
      let item = result[index]
      item[type] = !item[type]
      result[index] = item
      contract.result = result
      contractData.value = JSON.parse(JSON.stringify(contract))
    }

    const getFunHeight = (type) => {
      // showType == 'writeFun' ? 'calc(100% - 66px)' : '56px'
      let st = showType.value
      if (st.length == 2) {
        return 'calc(50% - 5px)'
      } else if (st.indexOf(type) > -1) {
        return 'calc(100% - 66px)'
      } else {
        return '56px'
      }
    }

    const showFun = (type) => {
      let st = showType.value
      console.log(st.indexOf(type))
      if (st.indexOf(type) > -1) {
        let index = st.indexOf(type)
        st.splice(index, 1)
        console.log(st)
      } else {
        st.push(type)
      }
      showType.value = st
    }

    watch(activeId, async () => {
      console.log(activeId.value)
      if (activeId.value) {
        getContarctData()
        init()
      }
    }, {immediate: true})

    watch(menuList, async () => {
      if (activeId.value) {
        getContarctData()
      }
    }, {immediate: true, deep: true})

    watch(contractList, async () => {
      if (activeId.value) {
        getContarctData()
      }
    }, {immediate: true, deep: true})

    watch(network, async () => {
      if (running && abiItem.value) {
        runFunction(abiItem.value)
      }
    }, {immediate: true})

    onMounted(() => {
      let screenwidth = document.body.clientWidth
      if (screenwidth < 1680) {
        isShowHd.value = true
        contractRef.value.style.height = 'calc(100% - 124px)'
      } else {
        isShowHd.value = false
        contractRef.value.style.height = 'calc(100% - 5px)'
      }
    })

    return {
      isIframe,
      address,
      contractRef,
      isShowHd,
      showType,
      mainContent,
      conversionModal,
      funOtherName,
      showSendInfo,
      sendInfo,
      networkErrorModal,
      showSpin,
      parameData,
      abiItem,
      abiType,
      createAt,
      formatStr,
      contractData,
      showPopover,
      readFun,
      writeFun,
      eventParam,
      hiddenPopover,
      toEtherscanAddress,
      copy,
      updateAbi,
      runFunction,
      switchChainFun,
      init,
      resend,
      formatUnits,
      saveOtherName,
      toWei,
      convert,
      showConvert,
      clickConversion,
      showFun,
      getFunHeight,
      inputParameData
    }
  }
}
</script>
<style lang="scss" scoped>
.contract-content {
  padding: 24px 24px 0;
  box-sizing: border-box;
  width: 100%;
  height: calc(100vh - 60px);
  overflow: hidden;
  .contract-main {
    height: calc(100% - 189px);
    .collapse {
      width: 250px;
      height: 100%;
      overflow: hidden;
      scrollbar-width: none;
      -ms-overflow-style: none;
      padding-bottom: 12px;
      box-sizing: border-box;
      &::-webkit-scrollbar {
        display: none;
      }
      .collapse-item {
        padding: 15px;
        box-sizing: border-box;
        border: 1px solid rgba(133, 141, 153, 0.2);
        border-radius: 10px;
        margin-bottom: 20px;
        transition: all .3s;
        .collapse-item-hd {
          cursor: pointer;
          padding-bottom: 10px;
          .title {
            font-weight: 400;
            font-size: 14px;
            line-height: 18px;
            text-transform: capitalize;
            color: #FFFFFF;
            img {
              width: 24px;
              height: 24px;
              margin-right: 10px;
            }
          }
          .arrow {
            width: 18px;
            height: 18px;
          }
        }
        .collapse-item-list {
          box-sizing: border-box;
          overflow: auto;
          height: calc(100% - 34px);
          .collapse-item-fun {
            min-height: 32px;
            padding: 7px 4px;
            box-sizing: border-box;
            cursor: pointer;
            &:hover {
              background: rgba(55, 92, 255, 0.1);
              border-radius: 6px;
              svg {
                path {
                  stroke: #375CFF;
                }
              }
              p {
                color: #375CFF;
              }
            }
            &.collapse-item-fun-activated {
              background: rgba(55, 92, 255, 0.1);
                border-radius: 6px;
                svg {
                  path {
                    stroke: #375CFF;
                  }
                }
                p {
                  color: #375CFF;
                }
            }
            svg {
              width: 18px;
              height: 18px;
            }
            .item-name {
              flex: 0 0 180px;
              width: 180px;
              margin-left: 12px;
              p {
                font-weight: 400;
                font-size: 12px;
                line-height: 18px;
                color: #FFFFFF;
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                &.other-name {
                  font-size: 14px;
                  line-height: 18px;
                  font-family: Montserrat-Medium;
                  margin-bottom: 2px;
                }
              }
            }
          }
        }
      }
    }
    .contract-main-content {
      margin-left: 16px;
      box-sizing: border-box;
      border-radius: 10px;
      flex: 1;
      height: 100%;
      // border: 1px solid rgba(47, 52, 61, 0.4);
      // padding: 20px;
      box-sizing: border-box;
      overflow-y: auto;
      overflow-x: hidden;
      scrollbar-width: none;
      -ms-overflow-style: none;
      &::-webkit-scrollbar {
        display: none;
      }
      .contract-main-content-hd {
        .close {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
      }
      .fun-name {
        font-family: Montserrat-Medium;
        font-size: 16px;
        line-height: 18px;
        color: #FFFFFF;
        position: relative;
        span {
          margin: 0 12px;
          font-weight: 400;
          font-size: 12px;
          line-height: 15px;
          color: #858D99;
        }
        img {
          width: 18px;
          height: 18px;
          margin-left: 8px;
          cursor: pointer;
        }
        .edit {
          .popover {
            z-index: 9;
            position: absolute;
            top: 28px;
            left: 0;
            width: 400px;
            height: 109px;
            background: rgba(27, 26, 34, 0.9);
            border: 1px solid rgba(133, 141, 153, 0.1);
            box-shadow: 0px 12px 30px rgba(10, 10, 12, 0.3);
            backdrop-filter: blur(10px);
            border-radius: 10px;
            padding: 20px;
            box-sizing: border-box;
            // &::after {
            //   content: '';
            //   width: 0;
            //   height: 0;
            //   position: absolute;
            //   left: 78px;
            //   top: -20px;
            //   border: 10px solid transparent;
            //   border-bottom: 10px solid rgba(27, 26, 34, 0.9);
            //   z-index: 2;
            // }
            .popover-title {
              font-weight: 400;
              font-size: 14px;
              line-height: 17px;
              text-transform: capitalize;
              color: #FFFFFF;
              span {
                font-weight: 400;
                font-size: 12px;
                line-height: 15px;
                text-transform: capitalize;
                color: #858D99;
                margin-left: 24px;
              }
            }
            .popover-input {
              position: relative;
              margin-top: 12px;
              height: 40px;
              .popover-input-item {
                margin-top: 0;
                box-sizing: border-box;
                padding-right: 74px;
              }
              .popover-btn {
                width: 64px;
                height: 30px;
                background: #15141B;
                border: 1px solid rgba(47, 52, 61, 0.4);
                border-radius: 4px;
                position: absolute;
                right: 5px;
                top: 4px;
                font-weight: 400;
                font-size: 14px;
                text-transform: capitalize;
                color: #858D99;
                cursor: pointer;
                &:hover {
                  background: #375CFF;
                  color: #FFFFFF;
                }
              }
            }
          }
        }
      }
      .fun-parames {
        padding: 15px;
        box-sizing: border-box;
        border: 1px dashed rgba(133, 141, 153, 0.2);
        border-radius: 10px;
        margin-top: 16px;
        .fun-parames-title {
          font-weight: 500;
          font-size: 15px;
          line-height: 18px;
          text-transform: capitalize;
          color: #FFFFFF;
          font-family: Montserrat-Medium;
          img {
            width: 18px;
            height: 18px;
            cursor: pointer;
            margin-left: 30px;
            transition: all .3s;
          }
        }
        .parame-w {
          overflow: hidden;
          max-height: 0px;
          transition: all .3s;
        }
        .parame-item {
          margin-top: 16px;
          .parame-item-hd {
            margin-bottom: 12px;
            .parame-name {
              font-size: 14px;
              line-height: 17px;
              color: #FFFFFF;
              span {
                margin-left: 24px;
                font-size: 12px;
                line-height: 15px;
                color: #858D99;
              }
            }
            .conversion {
              font-size: 12px;
              line-height: 15px;
              color: #858D99;
              cursor: pointer;
              img {
                width: 16px;
                height: 16px;
                margin-left: 8px;
              }
            }
          }
          .wei-btns {
            margin-top: 12px;
            .wei-btn {
              width: 100px;
              height: 31px;
              background: #22212B;
              border-radius: 5px;
              font-weight: 400;
              font-size: 12px;
              line-height: 15px;
              color: #858D99;
              margin-right: 12px;
              cursor: pointer;
              &:hover {
                background: #375CFF;
                color: #FFFFFF;
              }
            }
            p {
              color: #E88080;
              font-size: 12px;
              line-height: 15px;
            }
          }
        }
      }
      .fun-run-btn {
        width: 130px;
        height: 36px;
        background: #375CFF;
        border-radius: 5px;
        font-size: 14px;
        line-height: 20px;
        color: #FFFFFF;
        margin-top: 16px;
        cursor: pointer;
      }
      .not-result {
        margin-top: 20%;
        width: 100%;
        font-size: 12px;
        line-height: 18px;
        text-transform: capitalize;
        color: #858D99;
        img {
          width: 32px;
          margin-right: 8px;
          height: auto;
        }
      }
      .execute {
        border: 1px solid rgba(133, 141, 153, 0.2);
        padding: 15px;
        border-radius: 10px;
        margin-bottom: 24px;
      }
      .result-item {
        padding: 20px;
        border-radius: 10px;
        box-sizing: border-box;
        border: 1px solid rgba(133, 141, 153, 0.2);
        margin-bottom: 24px;
        &.result-item:last-child {
          margin-bottom: 0px;
        }
        .result-item-hd {
          justify-content: space-between;
        }
        .result-name {
          font-weight: 600;
          font-size: 16px;
          line-height: 18px;
          color: #FFFFFF;
          font-family: 'Montserrat-Medium';
        }
        .result-time {
          font-weight: 400;
          font-size: 12px;
          line-height: 15px;
          color: #858D99;
          // margin-top: 12px;
          img {
            width: 18px;
            height: 18px;
            margin-right: 6px;
          }
        }
        .result-hash {
          font-size: 12px;
          line-height: 15px;
          color: #858D99;
          cursor: pointer;
          img {
            width: 18px;
            height: 18px;
            margin-left: 8px;
          }
        }
        .result-btn {
          img {
            width: 18px;
            height: 18px;
            margin-right: 8px;
          }
          height: 30px;
          padding: 0 6px;
          background: #22212B;
          border-radius: 6px;
          box-sizing: border-box;
          font-size: 12px;
          line-height: 15px;
          text-transform: capitalize;
          color: #FFFFFF;
          margin-left: 12px;
          cursor: pointer;
          max-width: 30px;
          overflow: hidden;
          justify-content: flex-start;
          transition: all .5s;
          span {
            transition: all .5s;
            opacity: 0;
            white-space: nowrap;
          }
          &:hover {
            max-width: 150px;
            span {
              opacity: 1;
            }
          }
        }
        .result-info {
          margin-top: 15px;
          .result-info-item {
            & ~ .result-info-item {
              margin-left: 16px;
            }
            width: 180px;
            background: #17171A;
            border: 1px solid rgba(133, 141, 153, 0.1);
            border-radius: 5px;
            height: 27px;
            padding: 0 2px;
            box-sizing: border-box;
            .result-info-item-key {
              width: 92px;
              height: 23px;
              background: #2C2D34;
              border-radius: 3px;
              font-size: 10px;
              text-transform: capitalize;
              color: #FFFFFF;
            }
            .result-info-item-value {
              flex: 1;
              font-size: 10px;
              text-transform: capitalize;
              color: #858D99;
            }
          }
        }
        .result-section {
          margin-top: 18px;
          font-size: 14px;
          line-height: 18px;
          // text-transform: capitalize;
          color: #FFFFFF;
          .result-section-content {
            margin-top: 12px;
            background: #2C2D34;
            border-radius: 10px;
            padding: 0 2px 2px;
            box-sizing: border-box;
            .result-section-content-hd {
              padding: 0 18px;
              height: 30px;
              img {
                margin-left: 12px;
                cursor: pointer;
              }
            }
            .result-section-content-main {
              background: #17171A;
              border-radius: 9px;
              .result-params {
                overflow: hidden;
                transition: all .3s;
              }
              .result-param {
                width: 100%;
                padding: 12px 18px;
                box-sizing: border-box;
                // height: 40px;
                border-bottom: 1px solid #2C2D34;
                font-size: 12px;
                line-height: 15px;
                // text-transform: capitalize;
                color: #FFFFFF;
                &:last-child {
                  border-bottom: none;
                }
                .result-param-name {
                  width: 160px;
                  margin-right: 10px;
                }
                .result-param-value {
                  flex: 1;
                  max-width: 538px;
                  margin-right: 10px;
                  white-space: normal;
                  word-wrap: break-word;
                  overflow: hidden;
                }
                img {
                  width: 18px;
                  height: 18px;
                  cursor: pointer;
                }
              }
              .result-param-show {
                background: linear-gradient(180deg, rgba(10, 10, 12, 0) 0%, rgba(10, 10, 12, 0.63) 17.45%, #17171A 50%);
                border-radius: 0px 0px 10px 10px;
                width: 100%;
                height: 20px;
                cursor: pointer;
                font-size: 0px;
                img {
                  width: 16px;
                  height: 16px;
                  margin-left: 8px;
                }
              }
            }
          }
        }
       }
    }
  }
}
.demo-hint {
  width: 100%;
  height: 100%;
  border: 1px solid rgba(133, 141, 153, 0.2);
  border-radius: 10px;
  padding: 24px;
  box-sizing: border-box;
  .demo-hint-title {
    font-size: 16px;
    line-height: 18px;
    font-family: Montserrat-Medium;
    color: #FFFFFF;
  }
  .demo-hint-desc {
    margin-top: 16px;
    font-size: 12px;
    line-height: 24px;
    color: #FFFFFF;
    width: 100%;
    max-width: 792px;
    img {
      width: 34px;
      height: auto;
      margin: 0 12px 0 0;
    }
    .down {
      transform: rotate(-90deg);
      margin-left: 12px;
    }
  }
  .hint-img {
    margin-top: 26px;
    width: 100%;
    max-width: 700px;
    height: auto;
  }
}
</style>