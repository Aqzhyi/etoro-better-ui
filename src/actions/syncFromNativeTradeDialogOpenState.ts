import { createAction } from '@reduxjs/toolkit'

export const syncNativeTradeDialogOpen = createAction<boolean>(
  'setNativeTradeDialogOpenState',
)
