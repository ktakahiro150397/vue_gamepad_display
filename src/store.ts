import { createStore } from "vuex";
import { ButtonPictSetting } from "./button-pict-setting";
import createPersistedState from 'vuex-persistedstate'
import { KeyHistoryDisplayType } from "./display-type";

const store = createStore({
    plugins: [createPersistedState({
        key: "gamepad-display",
    })],
    state() {
        return {
            backgroundColor: "#f0f0f0",
            count: 0,
            buttonPictSettings: [] as ButtonPictSetting[],
            serverUrl: "http://localhost:5000",
            isUseTestInputStream: false,
            testInputStreamFrameCount: 10,
            isDisplayFrameCount: true,
            displayHistoryCount: 20,
            inputHistoryDisplayType: KeyHistoryDisplayType.StreetFighter,
        }
    },
    mutations: {
        increment(state: any) {
            state.count++;
        },
        setBackgroundColor(state: any, color: string) {
            // #が先頭にない場合は付与
            if (color.indexOf("#") !== 0) {
                color = "#" + color;
            }
            state.backgroundColor = color;
            if (process.env.NODE_ENV === "development") {
                console.log("setBackgroundColor", color);
            }
        },
        setButtonPictSetting(state: any, buttonPictSetting: ButtonPictSetting) {
            const idx = state.buttonPictSettings.findIndex((bps: ButtonPictSetting) => bps.presetName === buttonPictSetting.presetName && bps.gamepadId === buttonPictSetting.gamepadId && bps.device_id === buttonPictSetting.device_id);
            if (idx >= 0) {
                state.buttonPictSettings[idx] = buttonPictSetting;
                console.log("setButtonPictSetting", buttonPictSetting.gamepadId, "Updated.");
            } else {
                state.buttonPictSettings.push(buttonPictSetting);
                console.log("setButtonPictSetting", buttonPictSetting.gamepadId, "Saved.");
            }
        },
        deleteButtonPictSetting(state: any, payload: { presetName: string, gamepadId: string, device_id: string }) {
            console.log("deleteButtonPictSetting", payload.presetName, payload.gamepadId, payload.device_id);
            const idx = state.buttonPictSettings.findIndex((bps: ButtonPictSetting) => bps.presetName === payload.presetName && bps.gamepadId === payload.gamepadId && bps.device_id === payload.device_id);
            if (idx >= 0) {
                state.buttonPictSettings.splice(idx, 1);
                console.log("deleteButtonPictSetting", payload.gamepadId, "Deleted.");
            } else {
                console.log("deleteButtonPictSetting", payload.gamepadId, "Not found.");
            }
        },
        setServerUrl(state: any, url: string) {
            state.serverUrl = url;
            if (process.env.NODE_ENV === "development") {
                console.log("setServerUrl", url);
            }
        },
        setIsUseTestInputStream(state: any, isUseTestInputStream: boolean) {
            state.isUseTestInputStream = isUseTestInputStream;
            if (process.env.NODE_ENV === "development") {
                console.log("setIsUseTestInputStream", isUseTestInputStream);
            }
        },
        setIsDisplayFrameCount(state: any, isDisplayFrameCount: boolean) {
            state.isDisplayFrameCount = isDisplayFrameCount;
            if (process.env.NODE_ENV === "development") {
                console.log("setIsDisplayFrameCount", isDisplayFrameCount);
            }
        },
        setDisplayHistoryCount(state: any, displayHistoryCount: number) {
            state.displayHistoryCount = displayHistoryCount;
            if (process.env.NODE_ENV === "development") {
                console.log("setDisplayHistoryCount", displayHistoryCount);
            }
        },
        setInputHistoryDisplayType(state: any, displayType: KeyHistoryDisplayType) {
            state.inputHistoryDisplayType = displayType;
            if (process.env.NODE_ENV === "development") {
                console.log("setInputHistoryDisplayType", displayType);
            }
        }
    },
    getters: {
        getButtonPictSetting: (state) => (presetName: string, gamepadId: string, device_id: string) => {
            const idx = state.buttonPictSettings.findIndex((bps: ButtonPictSetting) => bps.presetName === presetName && bps.gamepadId === gamepadId && bps.device_id === device_id);
            console.log("getButtonPictSetting", gamepadId, device_id, idx);
            if (idx >= 0) {
                return state.buttonPictSettings[idx];
            } else {
                return new ButtonPictSetting(presetName, gamepadId, device_id);
            }
        }
    }
})



export default store;