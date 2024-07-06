import GamepadKeyInputInfo from "./input-info";

export class DebugInfomation {
    elapsedFrame: number
    elapsedTime: number

    constructor() {
        this.elapsedFrame = 0
        this.elapsedTime = 0
    }
}

export class GamepadKeyPressState {
    gamepadId: string
    inputInfo: GamepadKeyInputInfo

    constructor(gamepadId: string, inputInfo: GamepadKeyInputInfo) {
        this.gamepadId = gamepadId
        this.inputInfo = inputInfo
    }
}

type LoopFunction = (debugInfo: DebugInfomation, keyPressState: GamepadKeyPressState[]) => void

export class GameLoop {
    private static _singleton: GameLoop
    private static _pressState: GamepadKeyPressState[]
    private static _debugInfo: DebugInfomation
    private static _gamepads: Gamepad[]

    static get instance(): GameLoop {
        if (!GameLoop._singleton) {
            GameLoop._singleton = new GameLoop()
            GameLoop._debugInfo = new DebugInfomation()

            console.log("GameLoop instance is created")
        }

        return GameLoop._singleton
    }

    /// <summary>
    /// Update current Gamepad Connections
    /// </summary>
    private updateGamepadConnections() {
        GameLoop._gamepads = Array.from(navigator.getGamepads()).filter(
            (gp): gp is Gamepad => gp !== null
        );
    }

    /// <summary>
    /// Update current Gamepad Input State
    /// </summary>
    private updateGamepadInputState() {
        this.updateGamepadConnections();

        GameLoop._pressState = [];
        for (const gamepad of GameLoop._gamepads) {
            const gamepadId = gamepad.id;
            const inputInfo = new GamepadKeyInputInfo();

            // ボタン状態を取得
            //inputInfo.buttonLayout = gamepad.buttons.map((button) => button.value);
            inputInfo.buttonLength = gamepad.buttons.length;
            for (let i = 0; i < gamepad.buttons.length; i++) {
                inputInfo.buttonPressStates[i] = gamepad.buttons[i].pressed;
            }

            inputInfo.axisLength = gamepad.axes.length;
            for (let i = 0; i < gamepad.axes.length; i++) {
                inputInfo.axisStates[i] = gamepad.axes[i];
            }

            GameLoop._pressState.push(new GamepadKeyPressState(gamepadId, inputInfo));
        }
    }

    public executeGameLoop(loopFunction: LoopFunction) {
        const lastTime = 0

        const fps = 60;
        const interval = 1000 / fps;

        const gameLoop = (currentTime: number) => {
            const timeElapsed = currentTime - lastTime;

            GameLoop._debugInfo.elapsedFrame += 1
            GameLoop._debugInfo.elapsedTime += timeElapsed

            // if (timeElapsed > interval) {
            //     //console.log(GameLoop._debugInfo);



            //     loopFunction(GameLoop._debugInfo, GameLoop._pressState)
            //     lastTime = currentTime - (timeElapsed % interval);
            //     requestAnimationFrame(gameLoop)
            // }

            this.updateGamepadInputState();
            loopFunction(GameLoop._debugInfo, GameLoop._pressState)
            requestAnimationFrame(gameLoop)
        }

        requestAnimationFrame(gameLoop)
    }
}