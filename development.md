## Publishing

1. Merge a PR that bumps the version in `package.json` to `trunk`.
2. Publish assets with the command, `npx electron-forge publish --arch="x64,arm64"`.
3. `git fetch` to pull the latest tag.
4. Update deb URLs in Snapcraft file.
5. `snapcraft remote-build`
