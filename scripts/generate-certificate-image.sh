#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${OPENAI_API_KEY:-}" ]]; then
  echo "Error: OPENAI_API_KEY is not set." >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "Error: jq is required but was not found in PATH." >&2
  exit 1
fi

output_path="assets/images/certificate-bg.png"
prompt="A soft, dreamy watercolor illustration in a hand-painted anime background art style, gentle painterly brushwork. A slender white river dragon spirit with a flowing mane, sea-green accents and antler-like horns glides gracefully in a wide arc across a dusk sky, its long body trailing like a ribbon of mist. Background: a twilight gradient from deep blue through soft purple to warm sunset orange, with faint clouds, scattered tiny stars and distant mountain silhouettes. Romantic, serene, magical atmosphere. IMPORTANT: this image will be used as a soft background behind text on a keepsake certificate, so keep it low-contrast, desaturated and airy overall — pale washed-out colors, lots of calm negative space in the center, no busy detail, no dark areas, dragon and elements positioned toward the edges and corners so overlaid text remains easily readable. No text, no borders, no logos."

response="$(
  curl -sS https://api.openai.com/v1/images/generations \
    -H "Authorization: Bearer ${OPENAI_API_KEY}" \
    -H "Content-Type: application/json" \
    -d "$(jq -n --arg prompt "$prompt" '{
      model: "gpt-image-2",
      prompt: $prompt,
      n: 1,
      size: "1024x1536",
      quality: "high"
    }')"
)"

error_message="$(printf '%s' "$response" | jq -r '.error.message // empty')"
if [[ -n "$error_message" ]]; then
  echo "OpenAI image generation failed: $error_message" >&2
  exit 1
fi

image_base64="$(printf '%s' "$response" | jq -r '.data[0].b64_json // empty')"
if [[ -z "$image_base64" ]]; then
  echo "OpenAI image generation failed: response did not contain data[0].b64_json." >&2
  exit 1
fi

mkdir -p "$(dirname "$output_path")"
printf '%s' "$image_base64" | base64 --decode > "$output_path"

file_size="$(wc -c < "$output_path" | tr -d ' ')"
echo "Generated $output_path (${file_size} bytes)."
