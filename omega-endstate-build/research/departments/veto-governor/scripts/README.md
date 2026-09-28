# VETO-01 Local Tools

These tools are convenience surfaces, not governance authorities.

## Add-VetoTask.ps1

Creates a durable task file and appends an index entry.

Example:

PowerShell Add-VetoTask.ps1 -Title "Review X" -Requester "AGENT-01" -Objective "..." -Target "..." -MissionConnection "..." -RequestedOutput "..."

## Get-VetoQueue.ps1

Lists task records by status.

Example:

PowerShell Get-VetoQueue.ps1 -Status NEW

## Check-VetoDepartment.ps1

Checks that the cold-start files exist and prints the current operating state.

A tool cannot grant VETO-01 authority.
