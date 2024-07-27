import { GetInputStreamResponse } from './api/get-server-info';
import { ButtonPictSetting, DropdownImage } from './button-pict-setting';
import { KeyHistoryDisplayType } from './display-type';


export class DisplayButtonHandler {
    public inputHistoryDisplayType: KeyHistoryDisplayType;
    public buttonPictSetting: ButtonPictSetting;
    public dropdown_images: DropdownImage[];
    public direction_image: DropdownImage[];

    constructor(inputHistoryDisplayType: KeyHistoryDisplayType, buttonPictSetting: ButtonPictSetting, direction_image: DropdownImage[], dropdown_images: DropdownImage[]) {
        this.inputHistoryDisplayType = inputHistoryDisplayType;
        this.buttonPictSetting = buttonPictSetting;
        this.direction_image = direction_image;
        this.dropdown_images = dropdown_images;

        console.log("DisplayButtonHandler");
        console.log(this.buttonPictSetting);
    }


    /**
     * 指定されたキー入力履歴の表示形式に対応する文字列を取得します。
     * @param data - キー入力ストリームから受け取ったデータ
     * @returns キー入力履歴に表示するためのプロパティ
     */
    public getAddProperty(data: GetInputStreamResponse): any {

        switch (this.inputHistoryDisplayType) {
            case KeyHistoryDisplayType.StreetFighter:
            case KeyHistoryDisplayType.TekkenAndDOA:
                return this.getAddPropertyWithEveryInputChangeOnce(data);
            case KeyHistoryDisplayType.RTA:
                return this.getAddPropertyWithInputChangeSeparately(data);
            default:
                return {};
        }

    }

    /**
     * キー入力・ボタン入力の変更が行われるたびにキー表示をまとめて表示する場合のプロパティを取得
     * 一般的な格闘ゲームのキー表示に対応しています。
     * @param data - キー入力ストリームから受け取ったデータ
     */
    private getAddPropertyWithEveryInputChangeOnce(data: GetInputStreamResponse): any {
        // 押下方向に応じて画像データを割り当て(テンキー方式のファイル順前提)
        const directionFileData =
            this.direction_image[data.direction_state - 1].fileData;

        // 押下されているボタンの確認
        const buttonFileDataList = [] as any;
        for (let i = 0; i < 16; i++) {
            if (data.button_state[i]) {
                // 対応するボタン画像データを取得
                for (let j = 0; j < 3; j++) {
                    if (this.buttonPictSetting.settings[i].pictFileNames[j] !== "") {
                        // ファイル名を取得
                        const fileName =
                            this.buttonPictSetting.settings[i].pictFileNames[j];

                        // 実ファイルデータを取得
                        const fileData = this.dropdown_images.find(
                            (image) => image.fileName === fileName
                        )?.fileData;

                        // 配列に追加
                        if (
                            fileData !== undefined &&
                            !buttonFileDataList.some((e: any) => e.fileName === fileName)
                        ) {
                            buttonFileDataList.push({
                                fileName: fileName,
                                fileData: fileData,
                            });
                        }
                    }
                }
            }
        }
        // ファイル名でソート
        buttonFileDataList.sort((a: any, b: any) => {
            if (a.fileName < b.fileName) return -1;
            if (a.fileName > b.fileName) return 1;
            return 0;
        });


        return {
            directionFileData: directionFileData,
            buttonFileData: buttonFileDataList.map(
                (element: any) => element.fileData
            ),
            initialFrameCount: 1,
            isFreeze: false,
            index: -1,
        };
    }

    /**
     * キー入力・ボタン入力の変更が行われるたびにキー表示を個別に表示する場合のプロパティを取得
     * RTA配信で使用されるようなキー表示に対応しています。
     * @param data - キー入力ストリームから受け取ったデータ
     */
    private getAddPropertyWithInputChangeSeparately(data: GetInputStreamResponse): any {
        return {};
    }
}