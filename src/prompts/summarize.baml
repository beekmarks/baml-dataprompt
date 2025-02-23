// Define the summarize function with clear input/output types
class Summary {
    text: String
    summary: String
}

@prompt("Summarize the following text concisely: {text}")
fn summarize(text: String) -> Summary {
    "Generate a concise summary of the provided text while maintaining key information."
}
