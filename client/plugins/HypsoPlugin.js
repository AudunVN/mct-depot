function HypsoPlugin() {
    return function install(openmct) {
        console.log("HypsoPlugin loaded");

        // add root object (accessible from left side panel)
        openmct.objects.addRoot({
            namespace: 'hypso',
            key: 'spacecraft'
        });
    }
}
