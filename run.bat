for /l %%i in (1, 1, 100) do (
    if exist "C:\Program Files\Unity\Hub\Editor\2021.3.%%if1\Editor\Data\PlaybackEngines\WebGLSupport\BuildTools\SimpleWebServer.exe" (
        "C:\Program Files\Unity\Hub\Editor\2021.3.%%if1\Editor\Data\PlaybackEngines\WebGLSupport\BuildTools\SimpleWebServer.exe" ./ 8000
        goto :eof
    )
)
