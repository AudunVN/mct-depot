"use strict";

const NATelemetryDefinition = require('./NATelemetryDefinition');

const eps1 = "\\x80fdc8428091d7411ce00100a44f0100110000004a016a01f100300100000000000000000000000000000000b420f5007c0000000000000000006100470000000000000000000000000000000000000000000000000000003a0000001e0d8c13662fed3b00000000000000000f18000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001d1d1e1e1e1d1d1d1d7f7f7f7f7f03000000";
// const eps2 = '\\x80febcd39891d741200c00000e500100110000004a015c01ed00340100000000000000000000000000000000ac20c40148010000000000000000610045000000000001000000000000000000000000000000000000000000360000001e0d8c13662fed3b00000000000000000f18000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c1c1c1c1d1c1c1c1c7f7f7f7f7f02000000';
const epsTelemetrySampleString = eps1;

const fcGeneralSampleString = '\\x28bc425ea95d0900160000000000fa003f01019d4fa8000000019d4fa8000000019d4fa8000000000000000080f73d00404e3e0000000000e8003e0000c07f0000c07f0000c07f0000c07f0000c07f0000c07f00000000000000c07f0000c07f0000c07f00000000000000000000c07f';
// const fcUnknownTelemetrySampleString = '\\x000000327f91d741000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b537f8c264aa08bf143fc6dcb584f8be555227a089b0f53e000000809919394001000000010000000100000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d4a9909bab2e713f98749774bdd760bf455308ca98402c3f0000000000003f40010000000100000001000000010000009bda7b45f4b1633f76ee4b45451a74bf0600e846a90a68bf0000000000404140010000000100000001000000010000009ee254ba09f84ebf182aca1125cb71bf9172eca5608775bf000000000080404001000000010000000100000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b537f8c264aa08bf143fc6dcb584f8be555227a089b0f53e00000080991939400100000001000000010000000100000012f9af5edbe05e3fe6e1eb60dbe06ebffc1f605720c765bfabaaaaaaaa6a40400100000001000000010000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007f4df12bb386e23f8df1b8397474e0bfed24b635b437dcbfd527c86d820cdd3f8164c95c09ce5e3fb2f03dbc0dfa6ebf47417e9a57c965bf68870b275c79d23e8a7ca7ae5348e93eea3ef0f8c851b23e4085254d6675d23e95a3517c2d45e93e4c39335f0136b23ea0e644a0036ed23ed29651ccca45e93e280e72a48d21b23ebd78722e718edabdfe2249c5de65cabdbedfe00c2f5ac73d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f03f00000000000000000000000000000000000000000000000021ab60f40000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';

const fc_def = {
    "type": "fc",
    "name": "Flight Computer",
    "parser": "NA",
    "structPath": "defs/structs/fc_v0.0.3_GeneralT_file.txt"
}

const eps_def = {
    "type": "eps",
    "name": "Electronic Power Supply",
    "parser": "NA",
    "structPath": "defs/structs/eps_telemetry_struct_NAEPS001.txt"
}

const fcTelemetrySample = JSON.stringify({"fca_id":5744,"fca_init_ts":"2020-02-05T10:11:25.105499","fca_complete_ts":"2020-02-14T06:37:57.438591","fca_session_id":1,"fca_download":true,"fca_file_id":34,"fca_gs_id":1,"fca_entry_nr":2965,"fca_entry_data":"\\x28bc425ea95d0900160000000000fa003f01019d4fa8000000019d4fa8000000019d4fa8000000000000000080f73d00404e3e0000000000e8003e0000c07f0000c07f0000c07f0000c07f0000c07f0000c07f00000000000000c07f0000c07f0000c07f00000000000000000000c07f"});

test('can unpack EPS telemetry string', () => {
    let definition = new NATelemetryDefinition(eps_def);
    let result = definition.canUnpack(epsTelemetrySampleString);

    /*
    let buffer = definition.getDataBuffer(epsTelemetrySampleString);

    console.log("Sample byte length: " + Buffer.byteLength(buffer));
    console.log("Definition byte length: " + definition.byteLength);
    */

    expect(result).toEqual(true);
});

test('unpacked data from EPS telemetry string is valid', () => {
    let definition = new NATelemetryDefinition(eps_def);
    let result = definition.unpack(epsTelemetrySampleString);

    expect(result.timestamp).toEqual(1581646091.1404724);
});

test('can unpack FC telemetry string', () => {
    let definition = new NATelemetryDefinition(fc_def);
    let result = definition.canUnpack(fcGeneralSampleString);

    expect(result).toEqual(true);
});

test('unpacked data from FC telemetry string is valid', () => {
    let definition = new NATelemetryDefinition(fc_def);
    let result = definition.unpack(fcGeneralSampleString);

    expect(result.timestamp).toEqual(1581431848);
});

test('packed data is valid', () => {
    let definition = new NATelemetryDefinition(fc_def);
    let input = definition.unpack(fcGeneralSampleString);
    let result = definition.unpack(definition.pack(input));

    expect(result.timestamp).toEqual(1581431848);
});

test('can parse FC telemetry sample', () => {
    let definition = new NATelemetryDefinition(fc_def);
    let result = definition.parse(fcTelemetrySample);

    expect(typeof result.data).not.toEqual("undefined");
    expect(result.data).not.toEqual({});
});

test('can get FC metadata', () => {
    let definition = new NATelemetryDefinition(fc_def);
    let metadata = definition.getMctMetadata();

    expect(typeof metadata).not.toBe("undefined");
});

test('FC metadata has more than 0 entries', () => {
    let definition = new NATelemetryDefinition(fc_def);
    let metadata = definition.getMctMetadata();

    expect(metadata.length).toBeGreaterThan(0);
});

test('all FC metadata telemetry.values have key and hint fields', () => {
    let definition = new NATelemetryDefinition(fc_def);
    let metadata = definition.getMctMetadata();

    let allValuesHaveKeyField = true;
    let allValuesHaveHintsField = true;

    for (let i = 0; i < metadata.length; i++) {
        let point = metadata[i];

        for (let j = 0; j < point.telemetry.values.length; j++) {
            let value = point.telemetry.values[j];

            if (typeof value.key === "undefined") {
                allValuesHaveKeyField = false;
                console.log("Value missing key field: " + value);
            }

            if (typeof value.hints === "undefined") {
                allValuesHaveHintsField = false;
                console.log("Value missing hint field: " + value);
            }
        }
    }

    expect(allValuesHaveKeyField).toBe(true);
    expect(allValuesHaveHintsField).toBe(true);
});

test('can get EPS metadata', () => {
    let definition = new NATelemetryDefinition(eps_def);
    let metadata = definition.getMctMetadata();

    expect(typeof metadata).not.toBe("undefined");
});

test('EPS metadata has more than 0 entries', () => {
    let definition = new NATelemetryDefinition(eps_def);
    let metadata = definition.getMctMetadata();

    expect(metadata.length).toBeGreaterThan(0);
});

test('all EPS metadata telemetry.values have key and hint fields', () => {
    let definition = new NATelemetryDefinition(eps_def);
    let metadata = definition.getMctMetadata();

    let allValuesHaveKeyField = true;
    let allValuesHaveHintsField = true;

    for (let i = 0; i < metadata.length; i++) {
        let point = metadata[i];

        for (let j = 0; j < point.telemetry.values.length; j++) {
            let value = point.telemetry.values[j];

            if (typeof value.key === "undefined") {
                allValuesHaveKeyField = false;
                console.log("Value missing key field: " + value);
            }

            if (typeof value.hints === "undefined") {
                allValuesHaveHintsField = false;
                console.log("Value missing hint field: " + value);
            }
        }
    }

    expect(allValuesHaveKeyField).toBe(true);
    expect(allValuesHaveHintsField).toBe(true);
});
