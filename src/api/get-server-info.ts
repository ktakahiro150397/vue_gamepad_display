

export class GetServerInfo {
    static async getDevices(): Promise<GetDevicesResponse> {
        try {
            const response = await fetch("http://localhost:5000/GetDevices");
            if (!response.ok) {
                throw new Error("Failed to fetch devices");
            }
            const data = await response.json();

            // dataをDeviceインターフェースの配列として扱い、GetDevicesResponseに渡す
            const devices: Device[] = data.map((item: any) => ({
                joyId: item.joyId,
                device_id: item.device_id,
                device_name: item.device_name,
            }));

            return new GetDevicesResponse(devices);
        } catch (error) {
            console.error("There was a problem with the fetch operation:", error);
            throw error;
        }
    }
}

export interface Device {
    joyId: number;
    device_name: string;
    device_id: string;
}

export class GetDevicesResponse {

    devices: Device[];

    constructor(devices: Device[]) {
        this.devices = devices;
    }
}

export class GetInputStreamResponse {
    direction_state: number;
    button_state: boolean[];
    time_stamp: number;

    constructor(direction_state: number, button_state: boolean[], time_stamp: number) {
        this.direction_state = direction_state;
        this.button_state = button_state;
        this.time_stamp = time_stamp;
    }

}