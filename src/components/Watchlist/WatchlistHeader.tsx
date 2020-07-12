import { angularAPI } from '@/angularAPI'
import { WatchlistCompactSwitch } from '@/components/Watchlist/WatchlistCompactSwitch'
import { WatchlistInvestedSwitch } from '@/components/Watchlist/WatchlistInvestedSwitch'
import { GM } from '@/GM'
import { i18n } from '@/i18n'
import { useAppSelector } from '@/store/_store'
import { registerReactComponent } from '@/utils/registerReactComponent'
import { DefaultButton, Stack, TextField, TextFieldBase } from '@fluentui/react'
import Tooltip from 'rc-tooltip'
import React from 'react'
import { useMount, useDebounce } from 'react-use'
import { gaAPI, GaTargetEventId } from '@/gaAPI'

export const WatchlistHeader: React.FC = () => {
  const listCompactOn = useAppSelector(state => state.settings.listCompactOn)
  const shouldShowInvested = useAppSelector(
    state => state.settings.showInvested,
  )
  const [filterText, filterTextSet] = React.useState<string | undefined>('')
  const searchBoxRef = React.createRef<TextFieldBase>()

  useMount(() => {
    angularAPI.toggleListCompact(listCompactOn)
    angularAPI.toggleListInvested(shouldShowInvested)
  })

  useDebounce(
    () => {
      if (filterText) {
        gaAPI.sendEvent(GaTargetEventId.watchlists_filterByText)
      }
    },
    1000,
    [filterText],
  )

  return (
    <Stack horizontal tokens={{ childrenGap: 8 }}>
      <Stack.Item>
        <DefaultButton
          text={i18n.清除篩選文字()}
          onClick={() => {
            filterTextSet('')
            angularAPI.filterWatchlistByText('')
            angularAPI.toggleListInvested(shouldShowInvested)
            gaAPI.sendEvent(GaTargetEventId.watchlists_filterByTextClearClick)
          }}
          allowDisabledFocus
        />
      </Stack.Item>

      <Stack.Item>
        <Tooltip placement='bottom' overlay={i18n.輸入以過濾提示窗說明()}>
          <TextField
            value={filterText}
            componentRef={searchBoxRef}
            placeholder={i18n.輸入以過濾()}
            iconProps={{ iconName: filterText ? 'FilterSolid' : 'Filter' }}
            onChange={(event, newValue) => {
              filterTextSet(newValue)
              angularAPI.filterWatchlistByText(newValue)

              if (!newValue) {
                angularAPI.toggleListInvested(shouldShowInvested)
              }
            }}
            onMouseEnter={() => {
              // setTimeout 避免 polyfills-es5 報錯 Cannot assign to read only property 'event' of object '[object Object]'
              globalThis.setTimeout(() => {
                searchBoxRef.current?.focus()
              })
            }}
            onKeyDown={event => {
              if (event.key.toLowerCase() === 'escape') {
                filterTextSet('')
                angularAPI.filterWatchlistByText('')
                angularAPI.toggleListInvested(shouldShowInvested)
              }

              if (event.key.toLowerCase() === 'enter') {
                $('[automation-id="buy-sell-button-container-buy"]:visible')
                  .eq(0)
                  .click()

                searchBoxRef.current?.blur()
              }
            }}
          />
        </Tooltip>
      </Stack.Item>

      <Stack.Item>
        <Tooltip placement='bottom' overlay={i18n.使緊湊之說明()}>
          <div>
            <WatchlistCompactSwitch />
          </div>
        </Tooltip>
      </Stack.Item>

      <Stack.Item>
        <Tooltip placement='bottom' overlay={i18n.使已投資顯示之說明()}>
          <div>
            <WatchlistInvestedSwitch />
          </div>
        </Tooltip>
      </Stack.Item>
    </Stack>
  )
}

export const registeredWatchlistHeader = registerReactComponent({
  component: <WatchlistHeader></WatchlistHeader>,
  containerId: 'WatchlistHeader',
  containerConstructor: containerElement => {
    $('.watchlist-header .watch-list-buttons').prepend(containerElement)
  },
})

GM.addStyle(`
  #${registeredWatchlistHeader.container.id} {
    margin-top: 18px;
  }

  #${registeredWatchlistHeader.container.id} .ms-Toggle .ms-Label {
    margin-left: 4px;
  }
`)
