mkdir build
cp * build

files=(
  "node_modules/chai/index.js"
  "node_modules/path-browserify/index.js"
)

for file in "${files[@]}"; do
  mkdir -p "./build/$(dirname "$file")"
  cp -p "$file" "./build/$file"
done
