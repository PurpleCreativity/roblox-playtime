# roblox-playtime

Adds a weekly playtime counter to Roblox game pages using the parental controls API.

> [!INFORMATION]
> Now available on the mozilla [extensions catalog](https://addons.mozilla.org/en-US/firefox/addon/roblox-playtime/)!

> [!WARNING]
> Due to how roblox stores playtime or "screentime" data, this will refresh every week, and is limited to your top 20 most played experiences in said week.

# Build Instructions

### Requirements

| Tool      | Version (or higher) |
|-----------|---------------------|
| Node.js   | 22.11.0             |
| npm       | 11.5.1              |
| OS        | Windows 11          |
| Shell     | PowerShell          |

Download Node.js from: https://nodejs.org

Verify installation:

```powershell
   node -v
   npm -v
```

Install dependencies: `npm install`<br>
Build the add-on source: `npm run build`<br>
Package the add-on as .xpi `npm run build:xpi`<br>
Alternatively, run the included build script that does all of the above: `./build.ps1`