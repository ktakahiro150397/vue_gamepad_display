import { createStore } from "vuex";

const store = createStore({
    state() {
        return {
            backgroundColor: "#f0f0f0",
            count: 0
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
        }
    }
})

export default store;