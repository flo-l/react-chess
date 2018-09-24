cd vendor/littlewing
cargo +nightly build --target wasm32-unknown-unknown --release
wasm-bindgen target/wasm32-unknown-unknown/release/littlewing.wasm --out-dir target
