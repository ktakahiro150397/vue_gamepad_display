export class DropdownImage {
    public fileName: string;
    public fileData: string;

    constructor(fileName: string, fileData: string) {
        this.fileName = fileName;
        this.fileData = fileData;
    }
}

export class ButtonPictSetting {
    public presetName = "";
    public gamepadId = "";
    public device_id = "";


    public settings: ButtonPictSettingData[] = [];

    public directionalPadUpFileName = "";
    public directionalPadDownFileName = "";

    constructor(presetName: string, gamepadId: string, device_id: string) {
        this.presetName = presetName;
        this.gamepadId = gamepadId;
        this.device_id = device_id;

        for (let i = 0; i < 16; i++) {
            this.settings.push(new ButtonPictSettingData());
        }
    }

}

export class ButtonPictSettingData {
    public pictFileNames: string[] = [];

    public isDirectionalPad = false;
    public directionalValue = -1;

    constructor() {
        this.pictFileNames.push("");
        this.pictFileNames.push("");
        this.pictFileNames.push("");
    }
}
