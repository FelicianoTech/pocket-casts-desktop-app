## Publishing

1. Merge a PR that bumps the version in `package.json` and `snapcraft.yaml` to `trunk`.
2. Publish assets with the command, `npx electron-forge publish --arch="x64,arm64"`.
3. `git fetch` to pull the latest tag. (technically, optional)
4. Once the .debs are on GitHub, run `snapcraft remote-build`.
5. While `snapcraft remote-build` is running, create a PR to update `./flatpak/tech.feliciano.pocket-casts.appdata.xml` with the changelog published on GitHub from the latest release.
6. `snapcraft upload --release=stable pocket-casts_0.10.1_amd64.snap`
7. `snapcraft upload --release=stable pocket-casts_0.10.1_arm64.snap`
