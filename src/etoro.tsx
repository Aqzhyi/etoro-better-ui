import '@blueprintjs/core/lib/css/blueprint.css'
import { debugAPI } from './debugAPI'
import { emitter, Events } from './emitter'
import { GM } from './GM'
import { fetchExtraCurrency } from '@/actions/fetchExtraCurrency'
import {
  mountExecutionDialogControls,
  unmountExecutionDialogControls,
} from '@/components/ExecutionDialog/ExecutionDialogControls'
import { applyExecutionRiskLeverFromMemory } from '@/components/ExecutionDialog/applyExecutionRiskLeverFromMemory'
import { renderFooterUnitValues } from '@/components/Footer/FooterUnitValues'
import {
  PortfolioHeaderExtraButtons,
  mountPortfolioHeaderExtraButtons,
} from '@/components/Portfolio/PortfolioHeaderExtraButtons'
import {
  PortfolioHistoryHeaderExtraButtons,
  mountPortfolioHistoryHeaderExtraButtons,
} from '@/components/Portfolio/PortfolioHistoryHeaderExtraButtons'
import { renderSidebarDepositButton } from '@/components/Sidebar/SidebarDepositButton'
import { applyEventsObserver } from '@/components/UniversalControl/applyEventsObserver'
import { UniversalControlKeyObserver } from '@/components/UniversalControl/UniversalControlKeyObserver'
import { showWelcomeMessage } from '@/components/UniversalControl/UniversalWelcomeMessage'
import { mountWatchlistHeader } from '@/components/Watchlist/WatchlistHeader'
import { renderWatchlistPeople } from '@/components/Watchlist/WatchlistPeople'
import store from '@/store/_store'
import { throttle } from 'lodash'
import * as React from 'react'
import {
  SidebarMenuItems,
  mountSidebarMenuItems,
} from '@/components/Sidebar/SidebarMenuItems'
import { fetchStatusInfoAggregate } from '@/actions/fetchStatusInfoAggregate'
import { fetchPingValue } from '@/actions/setPingValue'
import {
  mountExecutionDialogStatusInfo,
  unmountExecutionDialogStatusInfo,
} from '@/components/ExecutionDialog/ExecutionDialogStatusInfo'

type $ = JQueryStatic
globalThis.localStorage.setItem('debug', `${debugAPI.log.namespace}:*`)

debugAPI.universal('套件正在努力加載...')

/**
 * 開始運作腳本的時機點是在 etoro 頁面有出現的情況，
 * 因為才能夠開始將「本腳本」部件透過 jQuery 掛載上去
 */
$('body').delegate(
  '.main-app-view',
  'mouseover.bootstrap',
  throttle(() => {
    debugAPI.universal('套件加載完成')
    $('body').undelegate('.main-app-view', 'mouseover.bootstrap')
    emitter.emit(Events.ready)
  }, 1000),
)

/**
 * 以事件驅動分別在各頁面中，渲染「本腳本」的各個部件到 etoro 頁面上
 *
 * 然而，「本腳本」介面會因 etoro 換頁而導致消失
 *
 * 因此嘗試以低開銷的方式，不斷地（或使用戶感覺不出來）觸發介面渲染是必要的
 */
emitter.once(Events.ready).then(applyEventsObserver)

/** 「全部平倉」自動打勾我想平掉所有交易 */
emitter.on(
  Events.onCloseAllPositionsDialogHover,
  function allPositionsCloseAgree() {
    const button = $(
      '[data-etoro-automation-id="close-all-positions-selection-input"]',
    )

    if (button.hasClass('ng-empty')) {
      button.click()
    }
  },
)

/** */
emitter.on(Events.onPing, function checkSystemStatus() {
  debugAPI.universal('檢查 status.etoro.com 功能狀況')
  store.dispatch(fetchStatusInfoAggregate())

  debugAPI.universal('推斷大致延遲時間')
  store.dispatch(fetchPingValue())
})

/**
 * 下單視窗的各種關鍵資訊提示 e.g. 延遲、可用餘額 etc.
 */
emitter.on(Events.onDialogHover, mountExecutionDialogStatusInfo)
emitter.on(Events.onDialogNotFount, unmountExecutionDialogStatusInfo)

/**
 * 掌握全網站的 keyboard 按下事件
 */
const constructKeyboardEventsUnbind = emitter.on(
  Events.ready,
  function constructKeyboardEvents() {
    UniversalControlKeyObserver.construct()
    constructKeyboardEventsUnbind()
  },
)

/**
 * 這使用戶不需要按巨集，直接按內建槓桿時，也會記憶
 */
emitter.once(Events.ready).then(applyExecutionRiskLeverFromMemory)

/**
 * 查看更多按鈕
 */
emitter.on(Events.onMoreInfoButtonHover, function triggerMoreButton() {
  $('.more-info-button').click()
  ;[500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000].forEach(
    value => {
      globalThis.setTimeout(() => {
        $('.more-info-button').click()
      }, value)
    },
  )
})

/**
 * 我的歷史記錄
 */
emitter.on(
  Events.onPortfolioHistoryPageHover,
  mountPortfolioHistoryHeaderExtraButtons,
)

/**
 * 我的關注列表
 */
emitter.on(Events.onWatchlistPageHover, mountWatchlistHeader)

/**
 * 我的投資組合
 */
emitter.on(Events.onPortfolioPageHover, mountPortfolioHeaderExtraButtons)

/**
 * 下單框框增強介面
 */
emitter.on(Events.onDialogHover, mountExecutionDialogControls)
emitter.on(Events.onDialogNotFount, unmountExecutionDialogControls)

/**
 * 歡迎訊息
 */
emitter.once(Events.ready).then(showWelcomeMessage)

/**
 * 關注列表中的投資人提供額外功能按鈕
 */
emitter.on(Events.onWatchlistPageHover, renderWatchlistPeople)

/**
 * 提供左側欄入金按鈕，匯率換算結果顯示
 */
emitter.on(Events.onSidebarHover, renderSidebarDepositButton)
emitter.on(Events.settingChange, renderSidebarDepositButton)

/**
 * 提供 etoro 頁面底部的「可用、配額、利潤、價值」匯率換算
 */
emitter.on(Events.settingChange, renderFooterUnitValues)
const constructFooterUnitValuesUnbind = emitter.on(
  Events.ready,
  function constructFooterUnitValues() {
    globalThis.setInterval(renderFooterUnitValues, 5000)
    constructFooterUnitValuesUnbind()
  },
)

/**
 * 左側欄連結項目與設定
 */
emitter.on(Events.settingChange, mountSidebarMenuItems)
emitter.on(Events.onSidebarHover, mountSidebarMenuItems)

/**
 * 取得外部銀行買賣匯率
 */
const fetchExtraCurrencySettingsUnbind = emitter.on(
  Events.ready,
  async function fetchExtraCurrencySettings() {
    await store.dispatch(fetchExtraCurrency())
    emitter.emit(Events.settingChange)
    fetchExtraCurrencySettingsUnbind()
  },
)

// 盡可能不拖慢 etoro 程式啟動時間，將 CSS 統一在 ready 後加載
const constructCssUnbind = emitter.on(Events.ready, function constructCSS() {
  /**
   * 提供 etoro 頁面底部的「可用、配額、利潤、價值」匯率換算
   */
  GM.addStyle(`
    .footer-unit[_ngcontent-qlo-c4] {
      height: 100px;
    }

    .footer-unit-value-exchange {
      font-size: 10pt;
      margin-left: 4px;
      opacity: 0.65;
    }

    .footer-unit-value-exchange-main {
      font-weight: bold;
    }

    .footer-unit-value-exchange-small {
      font-size: 8pt;
    }
  `)

  /**
   * 修正「添加到列表」被其它元素蓋住的問題
   *
   * e.g. https://www.etoro.com/people/olivierdanvel/portfolio
   */
  GM.addStyle(`
    body .inner-header {
      z-index: 1
    }
  `)

  /**
   * 使「買入與賣出按鈕」更加立體明確
   *
   * 大多數使用者在看到買入與賣出時，時常分不清「目前勾選」項目，導致經常發生明明要買入，卻不小心賣空的狀況。
   */
  GM.addStyle(`
    .execution-head .execution-head-button.active:after {
      content: "✅";
    }
  `)

  /**
   * 確保 toast 不會被蓋住
   */
  GM.addStyle(`
    #ct-container {
      z-index: 1000000
    }
  `)

  /**
   * blueprintjs 的 tooltip 之 z-index 需要高於「下單 dialog」才好正確提示資訊
   */
  GM.addStyle(`
    .bp3-transition-container {
      z-index: 10001
    }
  `)

  /**
   * 為關注列表頁面增加一點 style 質感
   */
  GM.addStyle(`
    et-instrument-trading-row:hover,
    et-user-row:hover {
      box-shadow: 1px 1px 5px #42424294;
      text-shadow: 2px 2px 1px #d2d2d2;
    }
  `)

  /** 使顯眼賣出或買入文字 */
  GM.addStyle(`
    [data-etoro-automation-id="open-trades-table-body-cell-action-sell"] {
      color: #ff7171;
    }
    [data-etoro-automation-id="open-trades-table-body-cell-action-sell"]:after {
      content: "📉";
    }

    [data-etoro-automation-id="open-trades-table-body-cell-action-buy"] {
      color: #20ae20;
    }
    [data-etoro-automation-id="open-trades-table-body-cell-action-buy"]:after {
      content: "📈";
    }
  `)

  constructCssUnbind()
})
