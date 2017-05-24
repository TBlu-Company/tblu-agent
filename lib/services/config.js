const defaultServiceConfig = {
  name: 'TBlu Agent',
  description: 'Collector Agent for TBlu',
  script: global.properties.getAppDir + '/index.js',
  wait: 2,
  grow: .5
};

module.exports = defaultServiceConfig;
