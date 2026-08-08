# Convert products_out.json to DEFAULT_PRODUCTS JS array entries
$ErrorActionPreference = "Stop"
$json = Get-Content -Path "products_out.json" -Raw -Encoding UTF8 | ConvertFrom-Json

function Get-Category([string]$title) {
    $t = $title.ToLower()
    if ($t -match "esp32|arduino|raspberry|vi xu ly|vi dieu khien") { return "Vi xu ly" }
    if ($t -match "module|breadboard|test board|wifi|bluetooth|relay|board") {
        if ($t -match "cam bien|sensor|nhip tim|nhiet do|mua") { return "Cam bien" }
        return "Bo mach"
    }
    if ($t -match "cam bien|sensor|encoder|mua|hong ngoai|uv") { return "Cam bien" }
    if ($t -match "man hinh|lcd|oled|display") { return "Man hinh" }
    if ($t -match "led thanh|led 7 mau") { return "Phu kien" }
    if ($t -match "nguon|bien ap|boost|battery|pin|adapter|to ong|sac") { return "Nguon & Sac" }
    if ($t -match "dien tro|tu dien|tu hoa|cuon cam|diode|transistor|mosfet|ic |thach anh|tu cao") { return "Linh kien thu dong" }
    if ($t -match "jack|connector|dau noi|jumper|header|jst|microusb|day pin|edge") { return "Ket noi" }
    if ($t -match "mo han|dong ho|thuoc kep|dao roc|caliper|kep|vom") { return "Cong cu" }
    if ($t -match "nut nhan|cong tac|coi hu|relay nhiet|den bao|keo dan|bulong|cos") { return "Phu kien" }
    return "Phu kien"
}

$lines = @()
$lines += "  // ===== Danh sach san pham tu dientukhaidinh.com (55 san pham da dang) ====="
$id = 19
foreach ($p in $json) {
    $name = $p.title -replace '\\', '\\\\' -replace '"', '\"'
    $desc = $p.desc -replace '\\', '\\\\' -replace '"', '\"'
    $price = [int64]($p.price -replace '[^0-9]', '')
    $cat = Get-Category $name
    $imgs = @($p.images | ForEach-Object { '"' + ($_ -replace '\\', '\\\\' -replace '"', '\"') + '"' })
    $imgStr = $imgs -join ", "
    $primary = ($p.images | Select-Object -First 1) -replace '\\', '\\\\' -replace '"', '\"'
# Map ASCII category back to proper Vietnamese category names used in CATEGORIES
    # Use [char] codes to avoid PowerShell 5.1 encoding issues
    $catJs = switch ($cat) {
        "Vi xu ly"          { "Vi xu" + [char]0x0309 + " ly" }
        "Bo mach"           { "Bo m" + [char]0x1EA1 + "ch" }
        "Cam bien"          { "C" + [char]0x1EA3 + "m bi" + [char]0x1EBF + "n" }
        "Man hinh"          { "M" + [char]0x00E0 + "n h" + [char]0x00EC + "nh" }
        "Nguon & Sac"       { "Ng" + [char]0x1ED3 + "n & S" + [char]0x1EA1 + "c" }
        "Linh kien thu dong" { "Linh ki" + [char]0x1EC7 + "n th" + [char]0x1EE5 + " " + [char]0x0111 + [char]0x1ED9 + "ng" }
        "Ket noi"           { "K" + [char]0x1EBF + "t n" + [char]0x1ED1 + "i" }
        "Cong cu"           { "C" + [char]0x00F4 + "ng c" + [char]0x1EE5 + "" }
        "Phu kien"          { "Ph" + [char]0x1EE5 + " ki" + [char]0x1EC7 + "n" }
        default             { "Ph" + [char]0x1EE5 + " ki" + [char]0x1EC7 + "n" }
    }
    $lines += "  { id: $id, name: `"$name`", category: `"$catJs`", price: ${price}, stock: 50, unit: `"cái`", images: [$imgStr], image: `"$primary`", desc: `"$desc`", rating: 4.5 },"
    $id++
}
$lines -join "`n" | Out-File -FilePath "products_entries.txt" -Encoding utf8
Write-Host "Generated $($json.Count) product entries. IDs 19-$($id-1)"
