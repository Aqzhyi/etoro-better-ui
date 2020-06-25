import React from 'react'
import store from '@/store/_store'
import { Provider } from 'react-redux'
import { Stack, TextField, TextFieldBase } from '@fluentui/react'
import { GM } from '@/GM'
import { i18n } from '@/i18n'
import { debounce } from 'lodash'
import { stickReactComponent } from '@/utils/stickReactComponent'

const showMeBy = (filterText = '') => {
  if (filterText) {
    $('.ui-table-row').hide()

    $('.i-portfolio-table-inner-name-symbol, .ui-table-row').each(
      (index, element) => {
        const didMatch = element.innerText
          .trim()
          .toLowerCase()
          .replace(/[\s]*/gi, '')
          .includes(filterText.toLowerCase())

        if (didMatch) {
          $(element).closest('.ui-table-row').show()
        }
      },
    )
  } else {
    $('.ui-table-row').show()
  }
}

export const PortfolioHistoryHeaderExtraButtons = () => {
  const searchBoxRef = React.createRef<TextFieldBase>()
  const [filterText, filterTextSet] = React.useState<string | undefined>('')

  return (
    <Stack horizontal horizontalAlign='center'>
      <TextField
        componentRef={searchBoxRef}
        placeholder={i18n.輸入以過濾()}
        iconProps={{ iconName: filterText ? 'FilterSolid' : 'Filter' }}
        onChange={debounce((event, newValue) => {
          filterTextSet(newValue)
          showMeBy(newValue)
        }, 250)}
        onMouseEnter={() => {
          // setTimeout 避免 polyfills-es5 報錯 Cannot assign to read only property 'event' of object '[object Object]'
          globalThis.setTimeout(() => {
            searchBoxRef.current?.focus()
          })
        }}
      />
    </Stack>
  )
}

export const {
  mount: mountPortfolioHistoryHeaderExtraButtons,
  unmount: unmountPortfolioHistoryHeaderExtraButtons,
  containerId: PortfolioHistoryHeaderExtraButtonsId,
} = stickReactComponent({
  component: (
    <Provider store={store}>
      <PortfolioHistoryHeaderExtraButtons />
    </Provider>
  ),
  containerId: 'PortfolioHistoryHeaderExtraButtons',
  containerConstructor: container => {
    $(container).insertBefore(
      $('.p-portfolio.history .inner-header .inner-header-buttons'),
    )
  },
})

GM.addStyle(`
  #${PortfolioHistoryHeaderExtraButtonsId} {
    display: inline-block;
    margin-left: 16px;
  }
`)
