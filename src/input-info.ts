
export default class GamepadKeyInputInfo {
    public get button1(): boolean {
        return this.buttonPressState(0);
    }

    public get button2(): boolean {
        return this.buttonPressState(1);
    }

    public get button3(): boolean {
        return this.buttonPressState(2);
    }

    public get button4(): boolean {
        return this.buttonPressState(3);
    }

    public get button5(): boolean {
        return this.buttonPressState(4);
    }

    public get button6(): boolean {
        return this.buttonPressState(5);
    }

    public get button7(): boolean {
        return this.buttonPressState(6);
    }

    public get button8(): boolean {
        return this.buttonPressState(7);
    }

    public get button9(): boolean {
        return this.buttonPressState(8);
    }

    public get button10(): boolean {
        return this.buttonPressState(9);
    }

    public get button11(): boolean {
        return this.buttonPressState(10);
    }

    public get button12(): boolean {
        return this.buttonPressState(11);
    }

    public get button13(): boolean {
        return this.buttonPressState(12);
    }

    public get button14(): boolean {
        return this.buttonPressState(13);
    }

    public get button15(): boolean {
        return this.buttonPressState(14);
    }

    public get button16(): boolean {
        return this.buttonPressState(15);
    }

    public buttonPressState(index: number): boolean {
        if (this.buttonPressStates.length < index) {
            return false;
        }
        return this.buttonPressStates[index];
    }

    public buttonLength = 0;
    public buttonLayout: string[] = [];
    public buttonPressStates = [] as boolean[];

    public axisLength = 0;
    public axisStates = [] as number[];
}

