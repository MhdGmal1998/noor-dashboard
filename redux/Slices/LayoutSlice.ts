import { createSlice } from '@reduxjs/toolkit'
import FetchRequestCountApi from '../AsyncThunkApi/FetchRequestCountApi'
import { RootState } from '../index';

export interface LayoutModel {
    requestCount: number | string,
    name: string
}

const initialState: LayoutModel = {
    requestCount: "جاري التحميل",
    name: ""
}

export const LayoutSlcie = createSlice({
    name: "layout",
    initialState,
    reducers: {
        changeRequestNumber: (state, action) => {

        }
    },
    extraReducers: {
        [FetchRequestCountApi.fulfilled.toString()]: (state: any, action: any) => {
            console.log("FetchRequestCountApi.fulfilled")
            state.requestCount = action.payload
        },
        [FetchRequestCountApi.pending.toString()]: (state: any, action: any) => {
            console.log("FetchRequestCountApi.pending")
            state.requestCount = "جاري التحميل"
        },
        [FetchRequestCountApi.rejected.toString()]: (state: any, action: any) => {
            console.log("FetchRequestCountApi.rejected")
            state.requestCount = "حصل خطأ"
        },

    }
})

export const layoutState = (state: RootState) => state.layout
export default LayoutSlcie.reducer
export const { changeRequestNumber } = LayoutSlcie.actions