import logging
import os
from typing import List, Tuple

from dotenv import load_dotenv

from openai import OpenAI, RateLimitError

load_dotenv()

logger = logging.getLogger(__name__)

MODEL = "openrouter/free"
BASE_URL = "https://openrouter.ai/api/v1"


def get_api_keys() -> List[Tuple[int, str]]:
    """
    Load all configured OpenRouter API keys from environment variables.
    Returns a list of (key_index, key_value) tuples for non-empty keys.
    """
    key_vars = [
        "OPENROUTER_API_KEY",
        "OPENROUTER_API_KEY_2",
        "OPENROUTER_API_KEY_3",
    ]
    keys = []
    for idx, var_name in enumerate(key_vars, start=1):
        key = os.getenv(var_name)
        if key and key.strip():
            keys.append((idx, key.strip()))
    return keys


def is_rate_limit_or_quota_error(e: Exception) -> bool:
    """
    Determine if an exception is caused by rate limits, quota exhaustion,
    or insufficient credits on OpenRouter.
    """
    if isinstance(e, RateLimitError):
        return True

    status_code = getattr(e, "status_code", None)
    if status_code in (429, 402, 403):
        return True

    err_msg = str(e).lower()
    quota_keywords = [
        "rate limit",
        "rate_limit",
        "quota",
        "credit",
        "429",
        "402",
        "resource_exhausted",
        "insufficient_quota",
        "out of credits",
        "free limit",
    ]
    if any(keyword in err_msg for keyword in quota_keywords):
        return True

    return False


def generate_text(prompt: str) -> str:
    """
    Generate text using OpenRouter, automatically attempting fallback keys if a
    rate limit or quota error is encountered.
    """
    api_keys = get_api_keys()

    if not api_keys:
        raise ValueError(
            "No valid OpenRouter API keys found in environment variables "
            "(OPENROUTER_API_KEY, OPENROUTER_API_KEY_2, OPENROUTER_API_KEY_3)."
        )

    last_exception = None

    for i, (key_idx, api_key) in enumerate(api_keys):
        try:
            client = OpenAI(
                base_url=BASE_URL,
                api_key=api_key,
            )

            response = client.chat.completions.create(
                model=MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a JSON assistant. Output only valid JSON. "
                            "Do not include markdown codeblocks or text explanations."
                        ),
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    },
                ],
            )

            content = response.choices[0].message.content
            return content if content else ""

        except Exception as e:
            last_exception = e

            if is_rate_limit_or_quota_error(e):
                if i < len(api_keys) - 1:
                    next_key_idx = api_keys[i + 1][0]
                    log_msg = (
                        f"OpenRouter key {key_idx} failed due to rate limit/quota, "
                        f"trying key {next_key_idx}"
                    )
                else:
                    log_msg = (
                        f"OpenRouter key {key_idx} failed due to rate limit/quota "
                        f"(no more keys available)"
                    )

                logger.warning(log_msg)
                print(f"[LLM Service] {log_msg}")
                continue
            else:
                # Do not retry on normal application or syntax errors
                raise e

    raise RuntimeError(
        "All available OpenRouter API keys failed due to rate limit or quota issues. "
        f"Last error: {type(last_exception).__name__}"
    )
