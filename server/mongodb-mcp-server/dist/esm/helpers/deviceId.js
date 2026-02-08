import { getDeviceId } from "@mongodb-js/device-id";
import { LogId } from "../common/logger.js";
export const DEVICE_ID_TIMEOUT = 3000;
export class DeviceId {
    constructor(logger, timeout = DEVICE_ID_TIMEOUT) {
        this.logger = logger;
        this.timeout = timeout;
        this.getMachineId = async () => {
            const nodeMachineId = await import("node-machine-id");
            const machineId = nodeMachineId.default?.machineId || nodeMachineId.machineId;
            return machineId(true);
        };
        this.abortController = new AbortController();
        this.deviceIdPromise = DeviceId.UnknownDeviceId;
    }
    initialize() {
        this.deviceIdPromise = getDeviceId({
            getMachineId: this.getMachineId,
            onError: (reason, error) => {
                this.handleDeviceIdError(reason, String(error));
            },
            timeout: this.timeout,
            abortSignal: this.abortController.signal,
        });
    }
    static create(logger, timeout) {
        const instance = new DeviceId(logger, timeout ?? DEVICE_ID_TIMEOUT);
        instance.initialize();
        return instance;
    }
    /**
     * Closes the device ID calculation promise and abort controller.
     */
    close() {
        this.abortController.abort();
    }
    /**
     * Gets the device ID, waiting for the calculation to complete if necessary.
     * @returns Promise that resolves to the device ID string
     */
    get() {
        return this.deviceIdPromise;
    }
    handleDeviceIdError(reason, error) {
        this.deviceIdPromise = DeviceId.UnknownDeviceId;
        switch (reason) {
            case "resolutionError":
                this.logger.debug({
                    id: LogId.deviceIdResolutionError,
                    context: "deviceId",
                    message: `Resolution error: ${String(error)}`,
                });
                break;
            case "timeout":
                this.logger.debug({
                    id: LogId.deviceIdTimeout,
                    context: "deviceId",
                    message: "Device ID retrieval timed out",
                    noRedaction: true,
                });
                break;
            case "abort":
                // No need to log in the case of 'abort' errors
                break;
        }
    }
}
DeviceId.UnknownDeviceId = Promise.resolve("unknown");
//# sourceMappingURL=deviceId.js.map