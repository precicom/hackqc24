import os
from youtube_transcript_api import YouTubeTranscriptApi
import tiktoken
from langchain_text_splitters  import TokenTextSplitter
from openai import OpenAI
# To get the tokeniser corresponding to a specific model in the OpenAI API:
# # Set your API key
# api_key = "AIzaSyCu7ct12FiIyjCr6mo2dHBvGrUHRCVld4w"

# # Define the YouTube API service
# youtube = build('youtube', 'v3', developerKey=api_key)

def get_video_transcript(video_id):

    transcript_response = YouTubeTranscriptApi.get_transcript(video_id, languages=['fr', 'en'])
    # Get transcript if available
    if transcript_response:
        transcript = []
        for item in transcript_response:
            if 'text' in item:
                transcript.append(item['text'])

        return ' '.join(transcript)
    else:
        return None

if __name__ == "__main__":
    video_id = input("Enter the YouTube video ID: ")
    transcript = get_video_transcript(video_id)
    if transcript:
        # enc = tiktoken.encoding_for_model("gpt-4")
        text_splitter = TokenTextSplitter(
            chunk_size=3500, chunk_overlap=0
        )
        texts = text_splitter.split_text(transcript)
        print(len(texts))
        client = OpenAI(
            # This is the default and can be omitted
            api_key="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",
        )

        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": transcript + "\n\n-----\n\nCette transcription provient d'un video Youtube. Génère un résumé des différents points discutés avec une seule phrase par point.",
                },
            ],
            model="gpt-4-0125-preview",
        )
        print(chat_completion)