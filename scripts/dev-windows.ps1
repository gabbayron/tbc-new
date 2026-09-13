param([switch]$BuildOnly)

$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)

$goExe = (Get-Command go.exe -ErrorAction SilentlyContinue).Source
if (-not $goExe) { $goExe = 'C:\Program Files\Go\bin\go.exe' }
if (-not (Test-Path -LiteralPath $goExe)) { throw 'Go 1.25+ is required. Install Go and run this script again.' }

$env:PATH = (Split-Path -Parent $goExe) + ';' + $env:PATH
if (-not (Test-Path -LiteralPath .\node_modules)) { npm ci }

if (-not (Test-Path -LiteralPath .\ui\core\proto\api.ts)) {
	npx protoc --ts_opt generate_dependencies --ts_out ui/core/proto --proto_path proto proto/api.proto
	npx protoc --ts_out ui/core/proto --proto_path proto proto/test.proto
	npx protoc --ts_out ui/core/proto --proto_path proto proto/ui.proto
}

$goPath = (& $goExe env GOPATH).Trim()
$goPlugin = Join-Path $goPath 'bin\protoc-gen-go.exe'
if (-not (Test-Path -LiteralPath $goPlugin)) { & $goExe install google.golang.org/protobuf/cmd/protoc-gen-go@latest }

# The npm protoc wrapper downloads the official protoc binary on first use.
npx protoc --version | Out-Null
$protocExe = Get-ChildItem .\node_modules\@protobuf-ts\protoc\installed -Filter protoc.exe -Recurse -File | Sort-Object FullName -Descending | Select-Object -First 1
if (-not $protocExe) { throw 'protoc could not be found in node_modules.' }
$protoDir = (Resolve-Path .\proto).Path
$protoInclude = (Resolve-Path (Join-Path $protocExe.Directory.Parent.FullName 'include')).Path
$protoFiles = @(Get-ChildItem .\proto -Filter '*.proto' -File | ForEach-Object { $_.FullName })
& $protocExe.FullName "--proto_path=$protoDir" "--proto_path=$protoInclude" "--plugin=protoc-gen-go=$goPlugin" '--go_opt=Mgoogle/protobuf/descriptor.proto=google.golang.org/protobuf/types/descriptorpb' '--go_out=./sim/core' @protoFiles
if ($LASTEXITCODE -ne 0) { throw 'Go protobuf generation failed.' }

New-Item -ItemType Directory -Force -Path .\dist\tbc | Out-Null
$oldGoOS = $env:GOOS
$oldGoArch = $env:GOARCH
$oldGoWasm = $env:GOWASM
try {
	$env:GOOS = 'js'
	$env:GOARCH = 'wasm'
	$env:GOWASM = 'satconv,signext'
	& $goExe build -o .\dist\tbc\lib.wasm .\sim\wasm\
	if ($LASTEXITCODE -ne 0) { throw 'WASM compilation failed.' }
} finally {
	$env:GOOS = $oldGoOS
	$env:GOARCH = $oldGoArch
	$env:GOWASM = $oldGoWasm
}

npx tsx vite.build-workers.mts
if ($LASTEXITCODE -ne 0) { throw 'Worker build failed.' }
node .\node_modules\typescript\bin\tsc --noEmit
if ($LASTEXITCODE -ne 0) { throw 'TypeScript check failed.' }

if ($BuildOnly) { return }
$env:WASM_WORKER = '1'
Write-Host 'Open http://127.0.0.1:5173/tbc/'
npx vite --host 127.0.0.1 --port 5173
