import * as React from 'react'

const zh = {
  當前可用餘額: (htmlText: string) => (
    <span>
      當前可用餘額：<span dangerouslySetInnerHTML={{ __html: htmlText }}></span>
    </span>
  ),
  使下單視窗能夠單鍵快速切換買賣: () =>
    '在下單視窗使用 Tab 鍵來切換「賣出」或「買入」',
  回車鍵使彈出下單框: () => '使用 enter 時，將會自動開啟第一個篩選標的之下單框',
  使已投資顯示: () => '已投資',
  左下入金按鈕: (value: number) => `入金（${value}）銀行賣出`,
  使鎖定下單重複一致: () => '自動上次',
  使鎖定下單重複一致否定: () => '自動上次?',
  使鎖定下單重複一致之說明: () =>
    '始終以你上一次點擊巨集為基準，同步每次下單金額與槓桿',
  使緊湊: () => '緊湊',
  輸入以過濾: () => '過濾...',
  腳本標題: () => 'eToro better UI',
  功能提供者述敘: (Link: React.FC) => {
    return (
      <span>
        本功能由 <Link /> 提供
      </span>
    )
  },
  腳本官網: () => '腳本官網',
  聯絡作者: () => '聯絡作者',
  風險說明書: () => '風險說明書',
  感謝使用提示語: (Link: React.FC) => {
    return (
      <React.Fragment>
        <span>🙏 感謝您使用 {zh.腳本標題()} 更多資訊請恰詢：</span>
        <Link /> {zh.腳本官網()}
      </React.Fragment>
    )
  },
  設定幣別: (selectedText: string) => `設定幣別（當前：${selectedText}）`,
  下單巨集啟用狀態: enabled =>
    `下單巨集輔助功能（當前：${enabled ? '啟用' : '停用'}）`,
  下單巨集金額設定: () =>
    '下單巨集金額設定（請用逗號隔開數字）e.g. 100,200,300,500,1000',
  大概延遲: (msValue: number) => `大概延遲：${msValue}ms`,
  槓桿: () => '槓桿',
  金額: () => '金額',
  設定: () => '設定',
  餘額: () => '餘額',
  確保同意下單巨集風險: (Link: React.FC) => {
    return (
      <span>
        在使用 better-etoro-ui 所提供的下單巨集之前，請您確保您已閱讀 <Link />
        ，並你也表示同意。
      </span>
    )
  },
  投資組合: () => '投資組合',
  動作沒有執行: () => '動作沒有執行，可能介面不存在，或發生錯誤',
  設定變更中: () => '設定變更中...',
  設定已變更: (PostComponent: React.FC) => {
    return (
      <span>
        設定已變更：
        <PostComponent />
      </span>
    )
  },
  設定未變更: (PostComponent: React.FC) => {
    return (
      <span>
        設定未變更：
        <PostComponent />
      </span>
    )
  },
}

const en: typeof zh = {
  當前可用餘額: (htmlText: string) => (
    <span>
      Available Value：
      <span dangerouslySetInnerHTML={{ __html: htmlText }}></span>
    </span>
  ),
  使下單視窗能夠單鍵快速切換買賣: () =>
    'Use Tab key to switch BUY or SELL, effect on Execution Dialog open',
  回車鍵使彈出下單框: () =>
    'Use Enter key to popup the first result of filter items.',
  使已投資顯示: () => 'Invested',
  左下入金按鈕: (value: number) => `Deposit（${value}）Sold`,
  使鎖定下單重複一致: () => 'Same Order',
  使鎖定下單重複一致否定: () => 'Same Order?',
  使鎖定下單重複一致之說明: () =>
    'Always use the last Amount and Lever which you last click in macro buttons.',
  使緊湊: () => 'compact',
  輸入以過濾: () => 'Filter...',
  腳本標題: () => 'eToro better UI',
  功能提供者述敘: (Link: React.FC) => {
    return (
      <span>
        Support By <Link />
      </span>
    )
  },
  腳本官網: () => 'Website',
  聯絡作者: () => 'Contact Developer',
  風險說明書: () => 'Risk Agreement',
  感謝使用提示語: (Link: React.FC) => {
    return (
      <React.Fragment>
        <span>
          🙏 Thanks for install {en.腳本標題()}, for more information in{' '}
        </span>
        <Link /> {en.腳本官網()}
      </React.Fragment>
    )
  },
  設定幣別: (selectedText: string) => `Currency（Now：${selectedText}）`,
  下單巨集啟用狀態: enabled =>
    `Macro（Now：${enabled ? 'enabled' : 'disabled'}）`,
  下單巨集金額設定: () =>
    'Order Macro Setting, each numbers have to split by comma. e.g. 100,200,300,500,1000',
  大概延遲: (msValue: number) => `Infer Delay：${msValue}ms`,
  槓桿: () => 'Lever',
  金額: () => 'Amount',
  設定: () => 'Setting',
  餘額: () => 'Balance',
  確保同意下單巨集風險(Link: React.FC) {
    return (
      <span>
        Before use the Macro support by {this.腳本標題()}, Make sure you
        understand <Link />, and you must agree the possible risk.
      </span>
    )
  },
  投資組合: () => 'portfolio',
  動作沒有執行: () =>
    'No Action Execution, Target not found or maybe somethings broken.',
  設定變更中: () => 'loading...',
  設定已變更: (PostComponent: React.FC) => {
    return (
      <span>
        Has been changed：
        <PostComponent />
      </span>
    )
  },
  設定未變更: (PostComponent: React.FC) => {
    return (
      <span>
        nothing changes：
        <PostComponent />
      </span>
    )
  },
}

type EtoroLocale = 'en-gb' | 'zh-cn' | 'zh-tw'

const eToroLocale: EtoroLocale =
  (/eToroLocale=(?<eToroLocale>[\s\S]+?);/i.exec(globalThis.document.cookie)
    ?.groups?.eToroLocale as EtoroLocale) || 'zh-tw'

export const i18n = (eToroLocale.includes('zh') && zh) || en
