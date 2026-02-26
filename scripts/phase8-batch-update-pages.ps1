#!/usr/bin/env pwsh

# Phase 8: Batch Update Pages with Type Imports

$ErrorActionPreference = "Stop"

$typeMapping = @{
    "content-calendar.json" = "ContentCalendar"
    "content-metrics.json" = "ContentMetrics"
    "distribution-channels.json" = "DistributionChannels"
    "editorial-guidelines.json" = "EditorialGuidelines"
    "journeys.json" = "Journeys"
    "quick-checklist.json" = "QuickChecklist"
    "qa-tools.json" = "QaTools"
    "config-highlights.json" = "ConfigHighlights"
    "email-types.json" = "EmailTypes"
    "features.json" = "Features"
    "system-checks.json" = "SystemChecks"
    "highlights.json" = "Highlights"
    "sections.json" = "Sections"
    "capabilities.json" = "Capabilities"
    "facebook-strategy.json" = "FacebookStrategy"
    "facebook-tools.json" = "FacebookTools"
    "google-ecosystem.json" = "GoogleEcosystem"
    "google-tools.json" = "GoogleTools"
}

Write-Host "Phase 8: Batch Update Pages with Type Imports" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host ""

$adminPages = Get-ChildItem -Path "app" -Recurse -Filter "page.tsx" | 
    Where-Object { $_.FullName -match "admin" }

Write-Host "Found $($adminPages.Count) admin pages to scan" -ForegroundColor Green
Write-Host ""

$updatedCount = 0
$skippedCount = 0

foreach ($page in $adminPages) {
    $content = Get-Content $page.FullName -Raw
    
    # Skip if already has type imports
    if ($content.Contains("@/types/strapi-mock")) {
        $skippedCount++
        continue
    }
    
    # Skip if no data imports
    if (-not $content.Contains("@/data/strapi-mock")) {
        $skippedCount++
        continue
    }
    
    # Extract JSON file names
    $lines = $content -split "`n"
    $dataImports = @()
    
    foreach ($line in $lines) {
        if ($line.Contains("@/data/strapi-mock")) {
            if ($line -match '(\w+\.json)') {
                $dataImports += $matches[1]
            }
        }
    }
    
    $dataImports = $dataImports | Select-Object -Unique
    
    # Map to types
    $typesToImport = @()
    foreach ($file in $dataImports) {
        if ($typeMapping.ContainsKey($file)) {
            $typesToImport += $typeMapping[$file]
        }
    }
    
    if ($typesToImport.Count -eq 0) {
        $skippedCount++
        continue
    }
    
    $typesToImport = $typesToImport | Select-Object -Unique | Sort-Object
    $typeImportLine = 'import type { ' + ($typesToImport -join ', ') + ' } from "@/types/strapi-mock";'
    
    # Insert type import
    $newLines = @()
    $inserted = $false
    
    foreach ($line in $lines) {
        if (-not $inserted) {
            if ($line.Contains('"use client') -or $line.Contains('"use server')) {
                $newLines += $line
                $newLines += $typeImportLine
                $inserted = $true
                continue
            }
            if ($line.Contains('import ') -and -not $line.Contains('type {')) {
                $newLines += $typeImportLine
                $newLines += $line
                $inserted = $true
                continue
            }
        }
        $newLines += $line
    }
    
    $newContent = $newLines -join "`n"
    Set-Content -Path $page.FullName -Value $newContent -Encoding UTF8
    
    Write-Host "✓ Updated: $($page.Name)" -ForegroundColor Green
    $updatedCount++
    
    if ($updatedCount % 10 -eq 0) {
        Write-Host "  Checking TypeScript..." -ForegroundColor Yellow
        npx tsc --noEmit 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "  ✗ Errors found!" -ForegroundColor Red
            exit 1
        }
        Write-Host "  ✓ OK" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Summary: $updatedCount updated, $skippedCount skipped" -ForegroundColor Green
Write-Host "Final TypeScript check..." -ForegroundColor Yellow
npx tsc --noEmit 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ TypeScript errors!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Complete!" -ForegroundColor Green
