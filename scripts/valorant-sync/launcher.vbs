Set Wmi = GetObject("winmgmts:\\.\root\cimv2")
Set objStartup = Wmi.Get("Win32_ProcessStartup")
Set objConfig = objStartup.SpawnInstance_
objConfig.ShowWindow = 0 ' Hidden Window

cmd = """C:\Program Files\nodejs\node.exe"" index.js"
pid = 0
result = Wmi.Get("Win32_Process").Create(cmd, "C:\Users\Arash\Documents\antigravity\excited-tesla\scripts\valorant-sync", objConfig, pid)

If result = 0 Then
    ' 64 = Idle / Low priority class
    Set colProcesses = Wmi.ExecQuery("Select * from Win32_Process Where ProcessId = " & pid)
    For Each objProcess in colProcesses
        objProcess.SetPriority(64)
    Next
End If
