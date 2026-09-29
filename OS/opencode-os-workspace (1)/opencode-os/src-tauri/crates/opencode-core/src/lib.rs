//! opencode-core: the platform engine of OpenCode OS.
//!
//! Kept free of any Tauri dependency so it builds and tests on any machine
//! (including headless sandboxes without webkit2gtk).

pub mod fs_engine;
pub mod host;
pub mod oc_server;
pub mod run_stream;
pub mod settings;

pub use fs_engine::{Entry, FsEngine, FsError};
pub use host::{HostEngine, HostRoot};
pub use oc_server::{ManagedServer, ServerEndpoint, SpawnConfig};
pub use run_stream::StreamEvent;
pub use settings::Settings;
