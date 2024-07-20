import { createStore } from "vuex";
import { ButtonPictSetting } from "./button-pict-setting";
import createPersistedState from 'vuex-persistedstate'

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
            const idx = state.buttonPictSettings.findIndex((bps: ButtonPictSetting) => bps.gamepadId === buttonPictSetting.gamepadId);
            if (idx >= 0) {
                state.buttonPictSettings[idx] = buttonPictSetting;
                console.log("setButtonPictSetting", buttonPictSetting.gamepadId, "Updated.");
            } else {
                state.buttonPictSettings.push(buttonPictSetting);
                console.log("setButtonPictSetting", buttonPictSetting.gamepadId, "Saved.");
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