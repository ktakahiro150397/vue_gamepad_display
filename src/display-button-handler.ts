import { GetInputStreamResponse } from './api/get-server-info';
import { ButtonPictSetting, DropdownImage } from './button-pict-setting';
import { KeyHistoryDisplayType } from './display-type';


export class DisplayButtonHandler {
    public inputHistoryDisplayType: KeyHistoryDisplayType;
    public buttonPictSetting: ButtonPictSetting;
    public dropdown_images: DropdownImage[];
    public direction_image: DropdownImage[];

    private previous_direction_state = 5;

    constructor(inputHistoryDisplayType: KeyHistoryDisplayType, buttonPictSetting: ButtonPictSetting, direction_image: DropdownImage[], dropdown_images: DropdownImage[]) {
        this.inputHistoryDisplayType = inputHistoryDisplayType;
        this.buttonPictSetting = buttonPictSetting;
        this.direction_image = direction_image;
        this.dropdown_images = dropdown_images;
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
     * @returns キー入力履歴に表示するためのプロパティの配列
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


        return [{
            directionFileData: directionFileData,
            buttonFileData: buttonFileDataList.map(
                (element: any) => element.fileData
            ),
            initialFrameCount: 1,
            isFreeze: false,
            index: -1,
        }];
    }

    /**
     * キー入力・ボタン入力の変更が行われるたびにキー表示を個別に表示する場合のプロパティを取得
     * RTA配信で使用されるようなキー表示に対応しています。
     * 
     * 方向キーは前回と同じ入力の場合、配列に含まれません。
     * 
     * 以下の優先順位で配列を返却します。
     * 
     * 1. 方向キー
     * 2. ボタン(ボタンの順序は画像ファイル名に依存)
     * 
     * @param data - キー入力ストリームから受け取ったデータ
     * @returns キー入力履歴に表示するためのプロパティの配列
     * @example [
     * {"方向キー情報"},
     * {"ボタン情報_1"},
     * {"ボタン情報_2"},
     * ...,
     * {"ボタン情報_n"}
     * ]
     */
    private getAddPropertyWithInputChangeSeparately(data: GetInputStreamResponse): any {
        // 以下の優先順位で返却する配列にプロパティ情報を追加する
        // 1 方向キー
        // 2 ボタン(押下順序は画像ファイル名に依存)

        const ret = [] as any;

        // 方向キーの割当
        if (this.previous_direction_state != data.direction_state && data.direction_state !== 5) {
            this.previous_direction_state = data.direction_state;

            // 前回と入力が異なり、ニュートラル以外の場合、方向キーデータを追加
            const directionFileData =
                this.direction_image[data.direction_state - 1].fileData;
            ret.push({
                directionFileData: directionFileData,
                buttonFileData: [],
                initialFrameCount: 1,
                isFreeze: false,
                index: -1,
                triggerFrameReset: false,
            });
        }

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

        // ボタンごとにプロパティを追加
        for (let i = 0; i < buttonFileDataList.length; i++) {
            ret.push({
                directionFileData: "",
                buttonFileData: [buttonFileDataList[i].fileData],
                initialFrameCount: 1,
                isFreeze: false,
                index: -1,
                triggerFrameReset: false,
            });
        }

        return ret;
    }
}