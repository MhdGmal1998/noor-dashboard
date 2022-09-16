import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import type { RootState } from '../index'
import constants from '../../lib/constants'
export default createAsyncThunk(
    'layout/requestCount',
    async (_dt, thunkApi) => {
        const { rejectWithValue } = thunkApi
        const url = `${constants.url}/admin/${constants.routes.fetchAllPendingRequest}`

        return await axios.get(url)
            .then((data) => {
                console.log(data.data.result)
                return data.data.result
            })
            .catch((error) => {
                rejectWithValue(error)
            })
    }
)