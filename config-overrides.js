// Custom Webpack Plugin to remove CRA filename hashes.
const NoHashes = {
    apply: config => {
        const walk = obj => {
            const paths = {
              object: k => walk(obj[k]),
              string: k => {
                obj[k] = obj[k].replace(/\[\w*?contenthash:\d+\]\.chunk\./, '');
                obj[k] = obj[k].replace(/\[\w*?hash:\d+\]\.chunk\./, '');
              },
            };
            if (obj != null) {
              Object.keys(obj)
                .filter(k => paths[typeof obj[k]])
                .forEach(k => paths[typeof obj[k]](k));
            }
        };
        walk(config);
    }
}

module.exports = function override(config, env){
    config.output = Object.assign(config.output, {
        libraryTarget: 'umd',
        library: 'r4r',
        umdNamedDefine: true
    })
    config.plugins.push(NoHashes)
    return config;
};