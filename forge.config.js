module.exports = {
	packagerConfig: {},
	makers: [
		{
			name: '@electron-forge/maker-zip'
		},
		{
			name: '@electron-forge/maker-deb',
			config: {
				options: {
					productName: "Pocket Casts",
					maintainer: "Ricardo N Feliciano",
					homepage: "https://www.Feliciano.Tech",
					icon: "img/icon-x512.png",
					categories: ["Audio", "AudioVideo"]
				}
			}
		},
		{
			name: '@electron-forge/maker-rpm',
			config: {
				options: {
					productName: "Pocket Casts",
					homepage: "https://www.Feliciano.Tech",
					icon: "img/icon-x512.png",
					categories: ["Audio", "AudioVideo"]
				}
			}
		}
	]
};
