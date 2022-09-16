import { configureStore, Action, ThunkAction } from '@reduxjs/toolkit'
import LayoutSlice from './Slices/LayoutSlice'
import { createWrapper } from "next-redux-wrapper"

const store = configureStore({
    reducer: {
        "layout": LayoutSlice
    }
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
   ReturnType,
   RootState,
   unknown,
   Action<string>
 >;
// export type AppStore = ReturnType<typeof makeStore>
// export type AppState = ReturnType<AppStore["getState"]>
// export type AppThunk<ReturnType = void> = ThunkAction<
//     ReturnType,
//     AppState,
//     unknown,
//     Action
// >;

// export type AppDispatch = AppStore["dispatch"]
// export const wrapper = createWrapper<AppStore>(makeStore);
export default store