Set ThunderAgent = CreateObject("ThunderAgent.Agent64.1")
Call ThunderAgent.AddTask(wscript.arguments(0))
Call ThunderAgent.CommitTasks2(1)
Set ThunderAgent = Nothing