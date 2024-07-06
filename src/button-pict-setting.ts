
export class ButtonPictSetting {
    public gamepadId = "";

    public button1: ButtonPictSettingData;
    public button2: ButtonPictSettingData;
    public button3: ButtonPictSettingData;
    public button4: ButtonPictSettingData;
    public button5: ButtonPictSettingData;
    public button6: ButtonPictSettingData;
    public button7: ButtonPictSettingData;
    public button8: ButtonPictSettingData;
    public button9: ButtonPictSettingData;
    public button10: ButtonPictSettingData;
    public button11: ButtonPictSettingData;
    public button12: ButtonPictSettingData;
    public button13: ButtonPictSettingData;
    public button14: ButtonPictSettingData;
    public button15: ButtonPictSettingData;
    public button16: ButtonPictSettingData;


    constructor(gamepadId: string) {
        this.gamepadId = gamepadId;
        this.button1 = new ButtonPictSettingData();
        this.button2 = new ButtonPictSettingData();
        this.button3 = new ButtonPictSettingData();
        this.button4 = new ButtonPictSettingData();
        this.button5 = new ButtonPictSettingData();
        this.button6 = new ButtonPictSettingData();
        this.button7 = new ButtonPictSettingData();
        this.button8 = new ButtonPictSettingData();
        this.button9 = new ButtonPictSettingData();
        this.button10 = new ButtonPictSettingData();
        this.button11 = new ButtonPictSettingData();
        this.button12 = new ButtonPictSettingData();
        this.button13 = new ButtonPictSettingData();
        this.button14 = new ButtonPictSettingData();
        this.button15 = new ButtonPictSettingData();
        this.button16 = new ButtonPictSettingData();
    }

}

export class ButtonPictSettingData {
    public pict1FileName = "";
    public pict2FileName = "";
    public pict3FileName = "";
    public directionalPadFileName = "";
    public isDirectionalPad = false;
}
