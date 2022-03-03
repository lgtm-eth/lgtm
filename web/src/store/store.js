import { configureStore, isPlain } from "@reduxjs/toolkit";
import logger from "redux-logger";
// TODO
// import { init, reducer } from "../eth/eth";
import { ethers } from "ethers";

const store = configureStore({
  reducer: {
    // TODO
    // eth: reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        isSerializable: (v) => isPlain(v) || ethers.BigNumber.isBigNumber(v),
      },
    }).concat(logger),
});

// TODO
// store.dispatch(init());

export default store;
