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
        }
    },
    getters: {
        getButtonPictSetting: (state) => (gamepadId: string) => {
            const idx = state.buttonPictSettings.findIndex((bps: ButtonPictSetting) => bps.gamepadId === gamepadId);
            if (idx >= 0) {
                return state.buttonPictSettings[idx];
            } else {
                return new ButtonPictSetting(gamepadId);
            }
        }
    }
})



export default store;