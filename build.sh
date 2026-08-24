#!/bin/bash

SOAR_DIR="Soar/Core"

# Source directories required for the full Soar kernel
SRC_DIRS=(
  "$SOAR_DIR/SoarKernel/src"
  "$SOAR_DIR/SoarKernel/sqlite"
  "$SOAR_DIR/KernelSML/src"
  "$SOAR_DIR/ClientSML/src"
  "$SOAR_DIR/ConnectionSML/src"
  "$SOAR_DIR/ElementXML/src"
  "$SOAR_DIR/CLI/src"
  "$SOAR_DIR/shared"
  "$SOAR_DIR/SVS/src"
  "$SOAR_DIR/SVS/ccd"
)

VALID_SRC_DIRS=()
for d in "${SRC_DIRS[@]}"; do
  [ -d "$d" ] && VALID_SRC_DIRS+=("$d")
done

# 1. Gather source files while excluding MSVC, SWIG, Windows, and OSX sources
SOAR_KERNEL_FILES=$(find "${VALID_SRC_DIRS[@]}" \
  \( -path "$SOAR_DIR/shared/msvc" -o -path "$SOAR_DIR/ClientSMLSWIG" -o -path "*/windows/*" -o -path "*/osx/*" \) -prune \
  -o -type f \( -name "*.cpp" -o -name "*.c" \) -print)

# 2. Gather include directories while excluding MSVC, SWIG, Windows, and OSX paths
SOAR_INCLUDES=$(find $SOAR_DIR \
  \( -path "$SOAR_DIR/shared/msvc" -o -path "$SOAR_DIR/ClientSMLSWIG" -o -path "*/windows" -o -path "*/osx" \) -prune \
  -o -type d -print | awk '{print "-I" $0}')

# 3. Compile WebAssembly module
emcc soar_bridge.cpp $SOAR_KERNEL_FILES \
  $SOAR_INCLUDES \
  -O3 \
  -std=c++17 \
  -s WASM=1 \
  -s MODULARIZE=1 \
  -s EXPORT_NAME="CreateSoarModule" \
  -s NO_EXIT_RUNTIME=1 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall", "UTF8ToString"]' \
  -o soar_core.js
