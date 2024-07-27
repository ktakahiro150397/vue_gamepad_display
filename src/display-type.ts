/**
 * キー入力履歴の表示形式
 */
export enum KeyHistoryDisplayType {
    StreetFighter,
    TekkenAndDOA,
    RTA,
}

/**
 * 指定されたキー入力履歴の表示形式に対応する文字列を取得します。
 * @param type - キー入力履歴の表示形式
 * @returns 対応する文字列
 */
export function GetDisplayValue(type: KeyHistoryDisplayType): string {
    switch (type) {
        case KeyHistoryDisplayType.StreetFighter:
            return "ストリートファイター6風";
        case KeyHistoryDisplayType.TekkenAndDOA:
            return "鉄拳・DOA風";
        case KeyHistoryDisplayType.RTA:
            return "RTA形式表示(フレーム表示なしで固定)";
        default:
            return "Unknown";
    }
}

export class KeyInputHistoryDropdownItem {
    public value: KeyHistoryDisplayType;
    public text: string;

    constructor(value: KeyHistoryDisplayType) {
        this.value = value;
        this.text = GetDisplayValue(value);
    }
}