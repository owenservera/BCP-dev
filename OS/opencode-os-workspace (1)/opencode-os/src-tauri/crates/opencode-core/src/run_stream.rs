//! Chat stream bridge — normalizes `opencode run --format json` NDJSON output
//! into simple events the UI can render:
//!   Delta(text) | Session(String) | Error(msg) | Done
//!
//! The upstream event shapes vary between OpenCode versions, so the parser is
//! deliberately liberal: it walks every JSON line and harvests text-ish fields
//! and session ids wherever they appear.

use serde_json::Value;

#[derive(Debug, Clone, PartialEq)]
pub enum StreamEvent {
    Delta(String),
    Session(String),
    Error(String),
    Done,
}

/// Parse one NDJSON line into zero or more normalized events.
pub fn parse_line(line: &str) -> Vec<StreamEvent> {
    let line = line.trim();
    if line.is_empty() {
        return vec![];
    }
    let Ok(v) = serde_json::from_str::<Value>(line) else {
        return vec![];
    };
    let mut out = Vec::new();
    let kind = v.get("type").and_then(|t| t.as_str()).unwrap_or("").to_string();

    if kind.contains("error") || looks_like_error(&v) {
        let msg = extract_error_message(&v).unwrap_or_else(|| "The model could not answer this message.".to_string());
        out.push(StreamEvent::Error(msg));
        return out;
    }

    if let Some(sid) = harvest_session_id(&v) {
        out.push(StreamEvent::Session(sid));
    }
    for text in harvest_text(&v) {
        if !text.is_empty() {
            out.push(StreamEvent::Delta(text));
        }
    }
    if kind == "session.idle" || kind == "run.completed" || kind == "done" {
        out.push(StreamEvent::Done);
    }
    out
}

fn looks_like_error(v: &Value) -> bool {
    v.get("error").is_some() || v.get("message").and_then(|m| m.get("error")).is_some()
}

fn extract_error_message(v: &Value) -> Option<String> {
    let candidates = [
        v.get("error"),
        v.get("message").and_then(|m| m.get("error")),
        v.get("error").and_then(|e| e.get("message")).map(|_| v.get("error").unwrap()),
    ];
    for c in candidates.into_iter().flatten() {
        if let Some(s) = c.as_str() {
            return Some(s.to_string());
        }
        if let Some(s) = c.get("message").and_then(|m| m.as_str()) {
            return Some(s.to_string());
        }
        if let Ok(s) = serde_json::to_string(c) {
            return Some(s);
        }
    }
    None
}

fn harvest_session_id(v: &Value) -> Option<String> {
    // direct
    if let Some(s) = v.get("sessionID").and_then(|s| s.as_str()) {
        return Some(s.to_string());
    }
    if let Some(s) = v.get("session").and_then(|s| s.as_str()) {
        if s.starts_with("ses_") {
            return Some(s.to_string());
        }
    }
    // nested: info.sessionID (message.updated etc.), part.sessionID
    for key in ["info", "part", "properties", "message"] {
        if let Some(nested) = v.get(key) {
            if let Some(s) = nested.get("sessionID").and_then(|s| s.as_str()) {
                return Some(s.to_string());
            }
        }
    }
    None
}

/// Collect human-visible text deltas from common event shapes:
///  - {"type":"message.part.updated","part":{"type":"text","text":"..."}}
///  - {"type":"message.part","part":{"text":"..."}}
///  - {"delta":"..."}
///  - {"type":"text","text":"..."}
fn harvest_text(v: &Value) -> Vec<String> {
    let mut out = Vec::new();
    if let Some(d) = v.get("delta").and_then(|d| d.as_str()) {
        out.push(d.to_string());
        return out;
    }
    let part = v.get("part").or_else(|| v.get("properties").and_then(|p| p.get("part")));
    if let Some(part) = part {
        let ptype = part.get("type").and_then(|t| t.as_str()).unwrap_or("");
        if ptype == "text" || ptype.is_empty() {
            if let Some(t) = part.get("text").and_then(|t| t.as_str()) {
                out.push(t.to_string());
            }
        }
        return out;
    }
    if let Some(t) = v.get("text").and_then(|t| t.as_str()) {
        if v.get("type").and_then(|t| t.as_str()).unwrap_or("") == "text" {
            out.push(t.to_string());
        }
    }
    out
}

/// Collapse a run of events into user-visible state; used by tests and by the
/// Tauri command that streams over an event channel.
pub fn fold(events: Vec<StreamEvent>) -> (String, Option<String>, Option<String>) {
    let mut text = String::new();
    let mut session = None;
    let mut error = None;
    for e in events {
        match e {
            StreamEvent::Delta(t) => text.push_str(&t),
            StreamEvent::Session(s) => session = Some(s),
            StreamEvent::Error(m) => error = Some(m),
            StreamEvent::Done => {}
        }
    }
    (text, session, error)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_message_part_updated_shape() {
        let line = r#"{"type":"message.part.updated","part":{"type":"text","text":"Hel"}}"#;
        assert_eq!(parse_line(line), vec![StreamEvent::Delta("Hel".into())]);
    }

    #[test]
    fn parses_plain_delta_shape() {
        let line = r#"{"type":"message.delta","delta":"lo world"}"#;
        assert_eq!(parse_line(line), vec![StreamEvent::Delta("lo world".into())]);
    }

    #[test]
    fn harvests_session_id_from_info() {
        let line = r#"{"type":"message.updated","info":{"sessionID":"ses_abc"}}"#;
        assert_eq!(parse_line(line), vec![StreamEvent::Session("ses_abc".into())]);
    }

    #[test]
    fn error_events_surface_message() {
        let line = r#"{"type":"session.error","error":{"message":"Unauthorized"}}"#;
        assert_eq!(parse_line(line), vec![StreamEvent::Error("Unauthorized".into())]);
        let line2 = r#"{"type":"x","error":"quota exceeded"}"#;
        assert_eq!(parse_line(line2), vec![StreamEvent::Error("quota exceeded".into())]);
    }

    #[test]
    fn garbage_lines_are_ignored_safely() {
        assert!(parse_line("").is_empty());
        assert!(parse_line("not json at all").is_empty());
        assert!(parse_line("[1,2,3]").is_empty());
    }

    #[test]
    fn done_event_recognized() {
        assert_eq!(parse_line(r#"{"type":"session.idle"}"#), vec![StreamEvent::Done]);
    }

    #[test]
    fn fold_combines_everything() {
        let events = vec![
            StreamEvent::Session("ses_1".into()),
            StreamEvent::Delta("Hel".into()),
            StreamEvent::Delta("lo".into()),
        ];
        let (text, session, error) = fold(events);
        assert_eq!(text, "Hello");
        assert_eq!(session.as_deref(), Some("ses_1"));
        assert!(error.is_none());
    }
}
