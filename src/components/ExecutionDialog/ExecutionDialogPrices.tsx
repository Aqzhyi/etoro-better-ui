/** @jsx jsx */ import { jsx, css } from '@emotion/react'
import { angularAPI } from '~/angularAPI'
import { isDisabledInProchart } from '~/components/ExecutionDialog/isDisabledInProchart'
import { ProfitText } from '~/components/ProfitText'
import { emitter, Events } from '~/emitter'
import { GM } from '~/GM'
import { useRate } from '~/hooks/useRate'
import { useAppSelector } from '~/store/_store'
import { registerReactComponent } from '~/utils/registerReactComponent'
import React, { useMemo } from 'react'
import { useInterval } from 'react-use'
import big from 'big.js'

enum Blocks {
  root = 'root',
  price = 'price',
  priceAsk = 'priceAsk',
  priceBid = 'priceBid',
  priceMovement = 'priceMovement',
  spread = 'spread',
}

const ExecutionDialogPrices: React.FC = () => {
  const rate = useRate()

  const degree = useAppSelector(
    state => state.settings.tradeDialogPriceRenderRate,
  )

  /** Price of close the position of sell put */
  const askValue = useMemo(() => {
    if (rate.model?.isLowLeverage) {
      return rate.value?.AskDiscounted ?? 0
    }

    return rate.value?.lastAskPrice ?? 0
  }, [rate])

  /** Price of close the position of buy call */
  const bidValue = rate.value?.lastPrice || 0

  const Precision = rate.model?.instrument?.Precision ?? 0

  useInterval(() => {
    rate.updateValue()
  }, degree)

  if (!rate.value || !degree) {
    return null
  }

  const spread = big(askValue).minus(bidValue)

  const farOfTP = big(rate.model?.takeProfit.amount || 0)
    .minus(bidValue)
    .abs()
    .plus(spread)

  const farOfSL = big(rate.model?.stopLoss.amount || 0)
    .minus(bidValue)
    .abs()

  return (
    <span css={rootCSS}>
      <span css={bidCSS}>
        <ProfitText
          profit={rate.value.lastPrice}
          pureDollar
          noDollarSign
          precision={Precision}
        />
        {/* <span className={withBlock(Blocks.priceMovement)}>
          {<ProfitText profit={rate.value.lastBidChange} noDollarSign />}
        </span> */}
      </span>

      <span css={spreadCSS}>{spread.toPrecision(2)}</span>

      <span css={askCSS}>
        <ProfitText
          profit={askValue}
          pureDollar
          noDollarSign
          precision={Precision}
        />
        {/* <span className={withBlock(Blocks.priceMovement)}>
          <ProfitText profit={rate.value.lastAskChange} noDollarSign />
        </span> */}
      </span>

      <span
        css={css`
          position: absolute;
          left: 51px;
          top: 400px;
          width: 180px;
          display: inline-block;
          text-align: center;
        `}
      >
        {farOfSL.toPrecision()}
      </span>

      <span
        css={css`
          position: absolute;
          left: 410px;
          top: 400px;
          width: 180px;
          display: inline-block;
          text-align: center;
        `}
      >
        {farOfTP.toPrecision()}
      </span>
    </span>
  )
}

export const exectionDialogPrices = registerReactComponent({
  component: <ExecutionDialogPrices />,
  containerId: 'ExecutionDialogPrices',
  containerConstructor: renderContainer => {
    $(angularAPI.selectors.dialogInnerContent)
      .find('.execution.edit, #open-position-view')
      .append(renderContainer)
  },
  disabled: () => {
    if (isDisabledInProchart()) return true
    return false
  },
})

emitter.on(Events.onDialogHover, exectionDialogPrices.mount)
emitter.on(Events.onDialogNotFound, exectionDialogPrices.unmount)

const rootCSS = css`
  @media (min-width: 741px) {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }
`

const priceCSS = css`
  position: absolute;
  text-shadow: 1px 1px 1px #000000;
  font-size: 22px;
`

const bidCSS = css`
  ${priceCSS};
  left: 231px;
  top: 13%;
`

const askCSS = css`
  ${priceCSS};
  left: 362px;
  top: 13%;
`

const spreadCSS = css`
  ${priceCSS};
  left: 282px;
  top: 11%;
  color: #a3ff00;
`
