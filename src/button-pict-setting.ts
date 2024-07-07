export class DropdownImage {
    public fileName: string;
    public fileData: string;

    constructor(fileName: string, fileData: string) {
        this.fileName = fileName;
        this.fileData = fileData;
    }
}

export class ButtonPictSetting {
    public gamepadId = "";

    public settings: ButtonPictSettingData[] = [];

    public directionalPadUpFileName = "";
    public directionalPadDownFileName = "";

    constructor(gamepadId: string) {
        this.gamepadId = gamepadId;

        for (let i = 0; i < 16; i++) {
            this.settings.push(new ButtonPictSettingData());
        }
    }

}

export class ButtonPictSettingData {
    public pictFileNames: string[] = [];

    public isDirectionalPad = false;
    // public directionalPadFileName = "";
    public directionalValue = -1;

    constructor() {
        this.pictFileNames.push("");
        this.pictFileNames.push("");
        this.pictFileNames.push("");
    }
}
