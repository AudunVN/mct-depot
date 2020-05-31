"use strict";

const TelemetryParser = require('./TelemetryParser');

const TestDefinitions = [
    {type: "JSON", id: "test"},
    {type: "NA", id: "fc", structPath: "defs/structs/fc_v0.0.3_GeneralT_file.txt"},
    {type: "NA", id: "fc_startup", structPath: "defs/structs/fc_v0.0.3_StartupT_file.txt"}
];

const fcTelemetrySample = JSON.stringify({"fca_id":5744,"fca_init_ts":"2020-02-05T10:11:25.105499","fca_complete_ts":"2020-02-14T06:37:57.438591","fca_session_id":1,"fca_download":true,"fca_file_id":34,"fca_gs_id":1,"fca_entry_nr":2965,"fca_entry_data":"\\x28bc425ea95d0900160000000000fa003f01019d4fa8000000019d4fa8000000019d4fa8000000000000000080f73d00404e3e0000000000e8003e0000c07f0000c07f0000c07f0000c07f0000c07f0000c07f00000000000000c07f0000c07f0000c07f00000000000000000000c07f"});

test('can load definitions', () => {
    let parser = new TelemetryParser(TestDefinitions);

    expect(parser.definitions.length).toEqual(TestDefinitions.length);
});

test('can get type for FC telemetry string', () => {
    let parser = new TelemetryParser(TestDefinitions);
    let fcType = parser.getType(fcTelemetrySample);

    expect(fcType).toEqual("fc");
});

test('can get definition for FC telemetry type', () => {
    let parser = new TelemetryParser(TestDefinitions);
    let fcDefinition = parser.getDefinition("fc");

    expect(fcDefinition.id).toEqual("fc");
});