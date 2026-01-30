# VFX Library CEP Extension Installation

## 1) Copy the extension folder

Place the `VFXLibrary` folder into your CEP extensions directory:

- **macOS:** `~/Library/Application Support/Adobe/CEP/extensions/`
- **Windows:** `%AppData%\\Adobe\\CEP\\extensions\\`

The final path should look like:

```
.../CEP/extensions/VFXLibrary
```

## 2) Enable unsigned extensions (developer mode)

CEP panels must be signed for production use. For local development, enable unsigned
extensions by setting:

- **macOS:**
  ```bash
  defaults write com.adobe.CSXS.11 PlayerDebugMode 1
  ```
- **Windows (PowerShell):**
  ```powershell
  reg add "HKCU\Software\Adobe\CSXS.11" /v PlayerDebugMode /t REG_SZ /d 1 /f
  ```

If you use After Effects 2024 and CEP 12, replace `CSXS.11` with `CSXS.12`.

## 3) Launch After Effects

Restart After Effects and open:

**Window → Extensions → VFX Library**

The panel is dockable and will persist like other CEP panels.
