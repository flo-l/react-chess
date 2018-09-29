git submodule update --init --recursive --remote
cd vendor/littlewing
cargo +nightly build --target wasm32-unknown-unknown --release
wasm-bindgen target/wasm32-unknown-unknown/release/littlewing_web.wasm --out-dir target
