import { angularAPI } from '@/angularAPI'
import { WatchlistCompactSwitch } from '@/components/Watchlist/WatchlistCompactSwitch'
import { WatchlistInvestedSwitch } from '@/components/Watchlist/WatchlistInvestedSwitch'
import { GM } from '@/GM'
import { i18n } from '@/i18n'
import store, { useAppSelector } from '@/store/_store'
import { stickReactComponent } from '@/utils/stickReactComponent'
import {
  DefaultButton,
  Stack,
  TextField,
  TextFieldBase,
  ITextFieldProps,
} from '@fluentui/react'
import Tooltip from 'rc-tooltip'
import React from 'react'
import { Provider } from 'react-redux'
import { useMount } from 'react-use'
import { debounce } from 'lodash'

export const WatchlistHeader: React.FC = () => {
  const listCompactOn = useAppSelector(
    state => state.settings.betterEtoroUIConfig.listCompactOn,
  )
  const shouldShowInvested = useAppSelector(
    state => state.settings.betterEtoroUIConfig.showInvested,
  )
  const [filterText, filterTextSet] = React.useState<string | undefined>('')
  const searchBoxRef = React.createRef<TextFieldBase>()

  useMount(() => {
    angularAPI.toggleListCompact(listCompactOn)
    angularAPI.toggleListInvested(shouldShowInvested)
  })

  return (
    <Stack horizontal tokens={{ childrenGap: 8 }}>
      <Stack.Item>
        <DefaultButton
          text={i18n.清除篩選文字()}
          onClick={() => {
            filterTextSet('')
            angularAPI.filterWatchlistByText('')
            angularAPI.toggleListInvested(shouldShowInvested)
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

export const {
  mount: mountWatchlistHeader,
  unmount: unmountWatchlistHeader,
  containerId: WatchlistHeaderId,
} = stickReactComponent({
  component: (
    <Provider store={store}>
      <WatchlistHeader></WatchlistHeader>
    </Provider>
  ),
  containerId: 'WatchlistHeader',
  containerConstructor: containerElement => {
    $('.watchlist-header .watch-list-buttons').prepend(containerElement)
  },
})

GM.addStyle(`
  #${WatchlistHeaderId} {
    margin-top: 18px;
  }

  #${WatchlistHeaderId} .ms-Toggle .ms-Label {
    margin-left: 4px;
  }
`)
