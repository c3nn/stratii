module.exports = {
  packagerConfig: {
    icon: 'assets/icon'
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        iconUrl: 'https://stratii.c3nn.com/assets/icon.ico',
        setupIcon: 'assets/icon.ico'
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        icon: 'assets/icon.icns'
      },
    },
  ],
};
