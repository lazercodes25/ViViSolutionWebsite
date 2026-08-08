# Scrape ~50 diverse products from dientukhaidinh.com
# Output: products_out.json
$ErrorActionPreference = "Stop"
$urls = Get-Content -Path "product_urls.txt" -Encoding utf8 | Where-Object { $_ -match "^https://dientukhaidinh.com/.+kde\d+$" } | Select-Object -Unique

# Diversify selection: spread across the whole list (skip first which is homepage)
$all = @($urls | Where-Object { $_ -ne "https://dientukhaidinh.com/" })
$step = [Math]::Floor($all.Count / 60)
$selected = New-Object System.Collections.ArrayList
for ($i = 0; $i -lt $all.Count -and $selected.Count -lt 55; $i += $step) {
    [void]$selected.Add($all[$i])
}
# Ensure we have at least ~50
$extraNeeded = 50 - $selected.Count
if ($extraNeeded -gt 0) {
    for ($i = 1; $i -le $extraNeeded; $i++) {
        if ($i -lt $all.Count) { [void]$selected.Add($all[$i]) }
    }
}

$products = New-Object System.Collections.ArrayList
$count = 0
foreach ($p in $selected) {
    $count++
    Write-Host "Fetching ($count/$($selected.Count)): $p"
    try {
        $r = Invoke-WebRequest -Uri $p -UseBasicParsing -Headers @{"User-Agent"="Mozilla/5.0 (Windows NT 10.0; Win64; x64)"} -TimeoutSec 30
        $c = $r.Content
        $title = ""
        $t = [regex]::Match($c, '(?is)<meta[^>]*property="og:title"[^>]*content="([^"]*)"')
        if ($t.Success) { $title = $t.Groups[1].Value.Trim() }
        $price = ""
        $pr = [regex]::Match($c, '(?is)<meta[^>]*property="og:price:amount"[^>]*content="([^"]*)"')
        if ($pr.Success) { $price = $pr.Groups[1].Value.Trim() }
        $images = New-Object System.Collections.ArrayList
        foreach ($im in [regex]::Matches($c, '(?is)<meta[^>]*property="og:image(:secure_url)?"[^>]*content="([^"]*)"')) {
            $img = $im.Groups[2].Value.Trim()
            if ($img -and -not $images.Contains($img)) { [void]$images.Add($img) }
        }
        $desc = ""
        $d = [regex]::Match($c, '(?is)<meta[^>]*property="og:description"[^>]*content="([^"]*)"')
        if ($d.Success) { $desc = $d.Groups[1].Value.Trim() }
        if ($title -and $price) {
            $product = @{
                url = $p
                title = $title
                price = $price
                images = @($images)
                desc = $desc
            }
            [void]$products.Add($product)
        }
    } catch {
        Write-Host "  ERROR: $($_.Exception.Message)"
    }
    Start-Sleep -Milliseconds 300
}

$json = $products | ConvertTo-Json -Depth 6
$json | Out-File -FilePath "products_out.json" -Encoding utf8
Write-Host "DONE. Total products scraped: $($products.Count)"
